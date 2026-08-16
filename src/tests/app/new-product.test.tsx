import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/redux/api/productsApi';
import productReducer from '@/lib/redux/slices/productSlice';
import NewProductWizardPage from '@/app/products/new/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/products/new',
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

describe('Page Unit Test: /products/new (Add New Product Page)', () => {
  it('should render 4-step wizard onboarding page and navigate between steps', async () => {
    const user = userEvent.setup();
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <NewProductWizardPage />
      </Provider>
    );

    expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1: Basic Product Information/i)).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. Wireless Noise-Canceling Headphones/i);
    const brandInput = screen.getByPlaceholderText(/e\.g\. Sony, Apple, Samsung/i);
    const categorySelect = screen.getByRole('combobox');
    const descriptionInput = screen.getByPlaceholderText(/Detailed description of the product features/i);

    await user.type(titleInput, 'Smart Bluetooth Earbuds Pro');
    await user.type(brandInput, 'TechCorp');
    await user.selectOptions(categorySelect, 'smartphones');
    await user.type(
      descriptionInput,
      'High-performance noise cancelling earbuds with fast wireless charging case.'
    );

    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    await user.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText(/Step 2: Pricing, Stock & SKU Variations/i)).toBeInTheDocument();
    });
  });
});
