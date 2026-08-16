import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFormData, SortOption, ViewMode } from '@/lib/types/product';

const DRAFT_STORAGE_KEY = 'ifg_product_wizard_draft';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  retryPayload?: {
    actionType: 'delete' | 'update';
    productId: number;
    data?: unknown;
  };
}

export interface ProductState {
  // Directory Filters & Toggles
  search: string;
  category: string;
  sort: SortOption;
  page: number;
  limit: number;
  viewMode: ViewMode;
  isFilterDrawerOpen: boolean;
  simulateFailure: boolean;
  toasts: ToastItem[];

  // Wizard Draft State
  draftStep: number;
  draftData: Partial<ProductFormData>;
  hasSavedDraft: boolean;
  isDraftPromptDismissed: boolean;
}

const getInitialDraftData = (): Partial<ProductFormData> => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read draft from localStorage', e);
  }
  return {};
};

const initialDraft = getInitialDraftData();

const initialState: ProductState = {
  // Directory & UI
  search: '',
  category: '',
  sort: 'default',
  page: 1,
  limit: 10,
  viewMode: 'table',
  isFilterDrawerOpen: false,
  simulateFailure: false,
  toasts: [],

  // Draft
  draftStep: 1,
  draftData: initialDraft,
  hasSavedDraft: Object.keys(initialDraft).length > 0,
  isDraftPromptDismissed: false,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // --- Directory & Filter Actions ---
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.page = 1;
    },
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.sort = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterDrawerOpen = action.payload;
    },
    setSimulateFailure: (state, action: PayloadAction<boolean>) => {
      state.simulateFailure = action.payload;
    },
    resetFilters: (state) => {
      state.search = '';
      state.category = '';
      state.sort = 'default';
      state.page = 1;
    },
    addToast: (state, action: PayloadAction<Omit<ToastItem, 'id'> & { id?: string }>) => {
      const id = action.payload.id || Math.random().toString(36).substring(2, 9);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // --- Wizard Draft Actions ---
    setDraftStep: (state, action: PayloadAction<number>) => {
      state.draftStep = action.payload;
    },
    updateDraft: (state, action: PayloadAction<{ stepData: Partial<ProductFormData>; step?: number }>) => {
      state.draftData = { ...state.draftData, ...action.payload.stepData };
      if (action.payload.step) {
        state.draftStep = action.payload.step;
      }
      state.hasSavedDraft = true;

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state.draftData));
        } catch (e) {
          console.error('Failed to save draft to localStorage', e);
        }
      }
    },
    restoreDraft: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
          if (saved) {
            state.draftData = JSON.parse(saved);
            state.hasSavedDraft = true;
          }
        } catch (e) {
          console.error('Failed to restore draft', e);
        }
      }
      state.isDraftPromptDismissed = true;
    },
    clearDraft: (state) => {
      state.draftData = {};
      state.draftStep = 1;
      state.hasSavedDraft = false;
      state.isDraftPromptDismissed = true;

      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch (e) {
          console.error('Failed to clear draft from localStorage', e);
        }
      }
    },
    dismissDraftPrompt: (state) => {
      state.isDraftPromptDismissed = true;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  setFilterDrawerOpen,
  setSimulateFailure,
  resetFilters,
  addToast,
  removeToast,
  clearToasts,
  setDraftStep,
  updateDraft,
  restoreDraft,
  clearDraft,
  dismissDraftPrompt,
} = productSlice.actions;

export default productSlice.reducer;
