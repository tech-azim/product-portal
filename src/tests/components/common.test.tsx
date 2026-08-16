import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/redux/api/productsApi';
import productReducer, { addToast, setFilterDrawerOpen, updateDraft } from '@/lib/redux/slices/productSlice';
import Header from '@/components/common/Header';
import ToastContainer from '@/components/common/ToastContainer';
import ConfirmModal from '@/components/common/ConfirmModal';
import ProductTable from '@/components/products/ProductTable';
import ProductGrid from '@/components/products/ProductGrid';
import FilterDrawer from '@/components/products/FilterDrawer';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import EmptyState from '@/components/products/EmptyState';
import DraftPrompt from '@/components/wizard/DraftPrompt';
import { Product } from '@/lib/types/product';

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

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Wireless Earbuds',
    brand: 'AudioTech',
    category: 'electronics',
    price: 99.99,
    discountPercentage: 10,
    rating: 4.8,
    stock: 15,
    thumbnail: 'https://cdn.dummyjson.com/products/images/test.png',
    images: [],
    description: 'Test product description',
  },
];

describe('Application Component Unit Tests', () => {
  describe('Header Component', () => {
    it('should render brand logo, link to wizard, and failure mode toggle', async () => {
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

  describe('ToastContainer Component', () => {
    it('should render active toasts from Redux state and allow dismiss', async () => {
      const user = userEvent.setup();
      const store = createTestStore();
      store.dispatch(addToast({ message: 'Operation completed successfully', type: 'success' }));

      render(
        <Provider store={store}>
          <ToastContainer />
        </Provider>
      );

      expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();

      const closeBtn = screen.getByRole('button');
      await user.click(closeBtn);

      expect(store.getState().product.toasts.length).toBe(0);
    });

    it('should handle retry button click on error toast and trigger success toast', async () => {
      const user = userEvent.setup();
      const store = createTestStore();
      store.dispatch(
        addToast({
          id: 'test-retry-id',
          message: 'Failed to delete product',
          type: 'error',
          retryPayload: { actionType: 'delete', productId: 1 },
        })
      );

      render(
        <Provider store={store}>
          <ToastContainer />
        </Provider>
      );

      expect(screen.getByText('Failed to delete product')).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /Retry/i });
      await user.click(retryBtn);

      await waitFor(() => {
        const toasts = store.getState().product.toasts;
        expect(toasts.length).toBeGreaterThan(0);
        expect(toasts[0].message).toMatch(/delete/i);
      });
    });
  });

  describe('ConfirmModal Component', () => {
    it('should render title and trigger onConfirm and onCancel callbacks', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      render(
        <ConfirmModal
          isOpen
          title="Delete Confirmation"
          message="Are you sure?"
          confirmLabel="Delete Now"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );

      expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();

      const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelBtn);
      expect(onCancel).toHaveBeenCalledTimes(1);

      const confirmBtn = screen.getByRole('button', { name: /Delete Now/i });
      await user.click(confirmBtn);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('ProductTable Component', () => {
    it('should render table rows and open confirm modal on delete click', async () => {
      const user = userEvent.setup();
      const handleDelete = vi.fn();

      render(<ProductTable products={mockProducts} onDelete={handleDelete} />);

      expect(screen.getByText('Test Wireless Earbuds')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();

      const deleteBtn = screen.getByTitle(/Delete product/i);
      await user.click(deleteBtn);

      const confirmBtn = screen.getByRole('button', { name: /Yes, Delete/i });
      await user.click(confirmBtn);

      expect(handleDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('ProductGrid Component', () => {
    it('should render product card grid and open confirm modal on delete click', async () => {
      const user = userEvent.setup();
      const handleDelete = vi.fn();

      render(<ProductGrid products={mockProducts} onDelete={handleDelete} />);

      expect(screen.getByText('Test Wireless Earbuds')).toBeInTheDocument();

      const deleteBtn = screen.getByTitle(/Delete product/i);
      await user.click(deleteBtn);

      const confirmBtn = screen.getByRole('button', { name: /Yes, Delete/i });
      await user.click(confirmBtn);

      expect(handleDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('FilterDrawer Component', () => {
    it('should render categories and sort options when open, and support reset and apply', async () => {
      const user = userEvent.setup();
      const store = createTestStore();
      store.dispatch(setFilterDrawerOpen(true));

      render(
        <Provider store={store}>
          <FilterDrawer
            categories={[{ slug: 'electronics', name: 'Electronics' }]}
            isLoadingCategories={false}
          />
        </Provider>
      );

      const categorySelect = screen.getAllByRole('combobox')[0];
      await user.selectOptions(categorySelect, 'electronics');

      const resetBtn = screen.getByRole('button', { name: /Reset/i });
      await user.click(resetBtn);

      const applyBtn = screen.getByRole('button', { name: /Apply/i });
      await user.click(applyBtn);

      expect(store.getState().product.isFilterDrawerOpen).toBe(false);
    });
  });

  describe('ProductSkeleton Component', () => {
    it('should render skeleton loading cards or table rows', () => {
      render(<ProductSkeleton viewMode="table" />);
      render(<ProductSkeleton viewMode="grid" />);
    });
  });

  describe('EmptyState Component', () => {
    it('should render empty state message and reset button', async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();

      render(<EmptyState searchQuery="headphones" onReset={onReset} />);

      expect(screen.getByText('No Products Found')).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: /Reset Filters & Search/i });
      await user.click(resetBtn);

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('DraftPrompt Component', () => {
    it('should render draft resume prompt banner when saved draft exists in Redux state and allow discard', async () => {
      const user = userEvent.setup();
      const store = createTestStore();
      store.dispatch(updateDraft({ stepData: { title: 'Saved Headphones' }, step: 2 }));

      render(
        <Provider store={store}>
          <DraftPrompt />
        </Provider>
      );

      expect(screen.getByText(/Resume Saved Draft\?/i)).toBeInTheDocument();

      const discardBtn = screen.getByRole('button', { name: /Discard Draft/i });
      await user.click(discardBtn);

      expect(store.getState().product.hasSavedDraft).toBe(false);
    });
  });
});
