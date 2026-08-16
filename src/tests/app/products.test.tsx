import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/redux/api/productsApi';
import productReducer from '@/lib/redux/slices/productSlice';
import ProductsPage from '@/app/products/page';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => '/products',
  useSearchParams: () => new URLSearchParams(),
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

describe('Page Unit Test: /products (Inventory Directory Page)', () => {
  it('should render inventory directory header, search input, and table layout', async () => {
    const user = userEvent.setup();
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <ProductsPage />
      </Provider>
    );

    expect(await screen.findByText(/Inventory Catalog/i)).toBeInTheDocument();
    const searchInputs = await screen.findAllByPlaceholderText(/Search/i);
    expect(searchInputs.length).toBeGreaterThan(0);
    const searchInput = searchInputs[0];

    const gridViewBtn = screen.getByTitle(/Grid Catalog View/i);
    await user.click(gridViewBtn);

    expect(testStore.getState().product.viewMode).toBe('grid');

    await user.type(searchInput, 'phone');
    expect(testStore.getState().product.search).toBe('phone');
  });
});
