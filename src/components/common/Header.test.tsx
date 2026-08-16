import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/redux/api/productsApi';
import productReducer from '@/lib/redux/slices/productSlice';
import Header from './Header';

vi.mock('next/navigation', () => ({
  usePathname: () => '/products',
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

describe('Unit Test: Header Component', () => {
  it('should render brand logo and link to add product', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText(/Product Portal/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add Product/i })).toBeInTheDocument();
  });
});
