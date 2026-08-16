import { describe, it, expect, beforeEach, vi } from 'vitest';
import productReducer, {
  setSearch,
  setCategory,
  setLimit,
  setViewMode,
  setFilterDrawerOpen,
  setSimulateFailure,
  addToast,
  removeToast,
  clearToasts,
  resetFilters,
  updateDraft,
  setDraftStep,
  clearDraft,
  restoreDraft,
  dismissDraftPrompt,
} from '@/lib/redux/slices/productSlice';

describe('Unit Test: productSlice Reducer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const initialState = {
    search: '',
    category: '',
    sort: 'default' as const,
    page: 1,
    limit: 10,
    viewMode: 'table' as const,
    isFilterDrawerOpen: false,
    simulateFailure: false,
    toasts: [],
    draftStep: 1,
    draftData: {},
    hasSavedDraft: false,
    isDraftPromptDismissed: false,
  };

  describe('Directory & Filter Actions', () => {
    it('should handle setSearch and reset page to 1', () => {
      const state = productReducer({ ...initialState, page: 3 }, setSearch('headphones'));
      expect(state.search).toBe('headphones');
      expect(state.page).toBe(1);
    });

    it('should handle setCategory and setLimit', () => {
      const state = productReducer(initialState, setCategory('smartphones'));
      expect(state.category).toBe('smartphones');

      const limitState = productReducer(state, setLimit(20));
      expect(limitState.limit).toBe(20);
      expect(limitState.page).toBe(1);
    });

    it('should handle setViewMode and setFilterDrawerOpen toggle', () => {
      const state = productReducer(initialState, setViewMode('grid'));
      expect(state.viewMode).toBe('grid');

      const drawerState = productReducer(state, setFilterDrawerOpen(true));
      expect(drawerState.isFilterDrawerOpen).toBe(true);
    });

    it('should handle setSimulateFailure mode toggle', () => {
      const state = productReducer(initialState, setSimulateFailure(true));
      expect(state.simulateFailure).toBe(true);
    });

    it('should handle addToast with generated ID and explicit ID, removeToast, and clearToasts', () => {
      const stateWithToast1 = productReducer(
        initialState,
        addToast({ message: 'Auto generated ID toast', type: 'info' })
      );
      expect(stateWithToast1.toasts.length).toBe(1);
      expect(stateWithToast1.toasts[0].id).toBeDefined();

      const stateWithToast2 = productReducer(
        stateWithToast1,
        addToast({ id: 'explicit-id-123', message: 'Explicit ID toast', type: 'success' })
      );
      expect(stateWithToast2.toasts.length).toBe(2);
      expect(stateWithToast2.toasts[1].id).toBe('explicit-id-123');

      const stateAfterRemove = productReducer(stateWithToast2, removeToast('explicit-id-123'));
      expect(stateAfterRemove.toasts.length).toBe(1);

      const clearedState = productReducer(stateAfterRemove, clearToasts());
      expect(clearedState.toasts.length).toBe(0);
    });

    it('should reset filters to default state', () => {
      const dirtyState = {
        ...initialState,
        search: 'phone',
        category: 'smartphones',
        sort: 'price_desc' as const,
        page: 4,
      };
      const cleanState = productReducer(dirtyState, resetFilters());
      expect(cleanState.search).toBe('');
      expect(cleanState.category).toBe('');
      expect(cleanState.sort).toBe('default');
      expect(cleanState.page).toBe(1);
    });
  });

  describe('Wizard Draft Actions', () => {
    it('should update draft form data, save to localStorage, and update step', () => {
      const stepData = { title: 'Test Phone', brand: 'Brand X' };
      const state = productReducer(
        initialState,
        updateDraft({ stepData, step: 2 })
      );

      expect(state.draftStep).toBe(2);
      expect(state.draftData.title).toBe('Test Phone');
      expect(state.hasSavedDraft).toBe(true);

      const savedLocal = localStorage.getItem('ifg_product_wizard_draft');
      expect(savedLocal).toContain('Test Phone');
    });

    it('should handle localStorage.setItem throwing an exception gracefully in updateDraft', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const state = productReducer(
        initialState,
        updateDraft({ stepData: { title: 'Large Data' } })
      );

      expect(state.hasSavedDraft).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save draft to localStorage',
        expect.any(Error)
      );
    });

    it('should restore draft from localStorage when restoreDraft action is dispatched', () => {
      localStorage.setItem(
        'ifg_product_wizard_draft',
        JSON.stringify({ title: 'Restored Item' })
      );

      const state = productReducer(initialState, restoreDraft());
      expect(state.draftData.title).toBe('Restored Item');
      expect(state.hasSavedDraft).toBe(true);
      expect(state.isDraftPromptDismissed).toBe(true);
    });

    it('should handle invalid JSON in restoreDraft gracefully', () => {
      localStorage.setItem('ifg_product_wizard_draft', 'invalid-json-string');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const state = productReducer(initialState, restoreDraft());
      expect(state.isDraftPromptDismissed).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to restore draft',
        expect.any(Error)
      );
    });

    it('should handle setDraftStep and dismissDraftPrompt', () => {
      const stepState = productReducer(initialState, setDraftStep(3));
      expect(stepState.draftStep).toBe(3);

      const dismissState = productReducer(stepState, dismissDraftPrompt());
      expect(dismissState.isDraftPromptDismissed).toBe(true);
    });

    it('should clear draft state and handle localStorage.removeItem error gracefully in clearDraft action', () => {
      localStorage.setItem(
        'ifg_product_wizard_draft',
        JSON.stringify({ title: 'Test Phone' })
      );

      const activeState = {
        ...initialState,
        draftStep: 3,
        draftData: { title: 'Test Phone' },
        hasSavedDraft: true,
        isDraftPromptDismissed: false,
      };

      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('RemoveItemError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const clearedState = productReducer(activeState, clearDraft());
      expect(clearedState.draftStep).toBe(1);
      expect(clearedState.draftData).toEqual({});
      expect(clearedState.hasSavedDraft).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear draft from localStorage',
        expect.any(Error)
      );
    });
  });
});
