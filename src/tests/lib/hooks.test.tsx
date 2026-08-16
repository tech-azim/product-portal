import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/redux/api/productsApi';
import productReducer, { setSearch, resetFilters } from '@/lib/redux/slices/productSlice';
import { useProductFilters } from '@/lib/hooks/useProductFilters';

const mockReplace = vi.fn();
let mockQueryParams = 'search=phone&category=smartphones&sort=price_asc&page=2';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams(mockQueryParams),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      product: productReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });

describe('Unit Test: useProductFilters Custom Hook', () => {
  it('should read URL parameters on initial mount and sync with Redux state', () => {
    mockQueryParams = 'search=phone&category=smartphones&sort=price_asc&page=2';
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useProductFilters(), { wrapper });

    expect(result.current.search).toBe('phone');
    expect(result.current.category).toBe('smartphones');
    expect(result.current.sort).toBe('price_asc');
    expect(result.current.page).toBe(2);
    expect(result.current.skip).toBe(10);
  });

  it('should handle default empty URL params and reset filters back to /products', async () => {
    mockQueryParams = 'search=initial';
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useProductFilters(), { wrapper });

    await act(async () => {
      store.dispatch(resetFilters());
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.search).toBe('');
    expect(result.current.category).toBe('');
    expect(result.current.sort).toBe('default');
    expect(result.current.page).toBe(1);
    expect(mockReplace).toHaveBeenCalledWith('/products', { scroll: false });
  });

  it('should update debounced search when Redux search changes', async () => {
    mockQueryParams = '';
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useProductFilters(), { wrapper });

    await act(async () => {
      store.dispatch(setSearch('laptop'));
      await new Promise((r) => setTimeout(r, 350));
    });

    expect(result.current.search).toBe('laptop');
    expect(result.current.debouncedSearch).toBe('laptop');
  });
});
