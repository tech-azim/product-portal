import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category, Product, ProductsResponse, SortOption } from '@/lib/types/product';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants/api';
import { addToast } from '../slices/productSlice';
import type { RootState } from '../store';

export interface GetProductsQueryParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sort?: SortOption;
}

const baseUrl = `${API_BASE_URL}/`;

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Product', 'Category'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsQueryParams>({
      query: ({ limit = 10, skip = 0, search = '', category = '', sort = 'default' }) => {
        let url: string = API_ENDPOINTS.PRODUCTS;
        const params = new URLSearchParams();

        if (search) {
          url = API_ENDPOINTS.SEARCH;
          params.append('q', search);
        } else if (category) {
          url = `${API_ENDPOINTS.PRODUCTS}/category/${encodeURIComponent(category)}`;
        }

        params.append('limit', limit.toString());
        params.append('skip', skip.toString());

        if (sort !== 'default') {
          if (sort === 'price_asc') {
            params.append('sortBy', 'price');
            params.append('order', 'asc');
          } else if (sort === 'price_desc') {
            params.append('sortBy', 'price');
            params.append('order', 'desc');
          } else if (sort === 'title_asc') {
            params.append('sortBy', 'title');
            params.append('order', 'asc');
          } else if (sort === 'title_desc') {
            params.append('sortBy', 'title');
            params.append('order', 'desc');
          }
        }

        const queryString = params.toString();
        return `${url}?${queryString}`;
      },
      transformResponse: (response: ProductsResponse, meta, arg) => {
        if (arg.sort && arg.sort !== 'default' && response?.products) {
          const sorted = [...response.products];
          if (arg.sort === 'price_asc') sorted.sort((a, b) => a.price - b.price);
          if (arg.sort === 'price_desc') sorted.sort((a, b) => b.price - a.price);
          if (arg.sort === 'title_asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
          if (arg.sort === 'title_desc') sorted.sort((a, b) => b.title.localeCompare(a.title));
          return { ...response, products: sorted };
        }
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getCategories: builder.query<Category[] | string[], void>({
      query: () => API_ENDPOINTS.CATEGORIES,
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `${API_ENDPOINTS.PRODUCTS}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: API_ENDPOINTS.ADD,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, { id: number; patch: Partial<Product>; queryArgs?: GetProductsQueryParams }>({
      query: ({ id, patch }) => ({
        url: `${API_ENDPOINTS.PRODUCTS}/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: patch,
      }),
      async onQueryStarted({ id, patch, queryArgs }, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const shouldSimulateFailure = state.product.simulateFailure || Math.random() < 0.2;

        const patchResult = queryArgs
          ? dispatch(
              productsApi.util.updateQueryData('getProducts', queryArgs, (draft) => {
                const product = draft.products.find((p) => p.id === id);
                if (product) {
                  Object.assign(product, patch);
                }
              })
            )
          : null;

        try {
          if (shouldSimulateFailure) {
            await new Promise((res) => setTimeout(res, 400));
            throw new Error('Simulated network error (20% failure test active)');
          }

          await queryFulfilled;
          dispatch(addToast({ message: `Product #${id} updated successfully!`, type: 'success' }));
        } catch {
          if (patchResult) {
            patchResult.undo();
          }
          dispatch(
            addToast({
              message: `Failed to update product #${id}. UI state restored to previous value.`,
              type: 'error',
              retryPayload: { actionType: 'update', productId: id, data: patch },
            })
          );
        }
      },
    }),

    deleteProduct: builder.mutation<{ id: number; isDeleted: boolean }, { id: number; queryArgs?: GetProductsQueryParams }>({
      query: ({ id }) => ({
        url: `${API_ENDPOINTS.PRODUCTS}/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id, queryArgs }, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const shouldSimulateFailure = state.product.simulateFailure || Math.random() < 0.2;

        let patchResult: { undo: () => void } | null = null;
        if (queryArgs) {
          patchResult = dispatch(
            productsApi.util.updateQueryData('getProducts', queryArgs, (draft) => {
              draft.products = draft.products.filter((p) => p.id !== id);
              draft.total = Math.max(0, draft.total - 1);
            })
          );
        }

        try {
          if (shouldSimulateFailure) {
            await new Promise((res) => setTimeout(res, 400));
            throw new Error('Simulated network failure (20% chance trigger)');
          }

          await queryFulfilled;
          dispatch(addToast({ message: `Product #${id} deleted successfully!`, type: 'success' }));
        } catch {
          if (patchResult) {
            patchResult.undo();
          }
          dispatch(
            addToast({
              message: `Network request failed to delete Product #${id}. State rolled back.`,
              type: 'error',
              retryPayload: { actionType: 'delete', productId: id },
            })
          );
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
