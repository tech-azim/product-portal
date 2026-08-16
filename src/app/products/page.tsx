'use client';

import React, { Suspense } from 'react';
import {
  Search,
  X,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Layers,
  ChevronDown,
} from 'lucide-react';
import Header from '@/components/common/Header';
import ToastContainer from '@/components/common/ToastContainer';
import ProductTable from '@/components/products/ProductTable';
import ProductGrid from '@/components/products/ProductGrid';
import ProductSkeleton from '@/components/products/ProductSkeleton';
import EmptyState from '@/components/products/EmptyState';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setLimit,
  setViewMode,
  resetFilters,
} from '@/lib/redux/slices/productSlice';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useDeleteProductMutation,
} from '@/lib/redux/api/productsApi';
import { useProductFilters } from '@/lib/hooks/useProductFilters';
import { SortOption } from '@/lib/types/product';

// Popular quick filter category slugs
const POPULAR_CATEGORIES = ['beauty', 'smartphones', 'laptops', 'furniture', 'groceries'];

function InventoryContent() {
  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector((state) => state.product);

  const { search, debouncedSearch, category, sort, page, limit, skip } = useProductFilters();

  const queryArgs = { limit, skip, search: debouncedSearch, category, sort };
  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery(queryArgs);
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const categoriesList: Array<{ slug: string; name: string }> = Array.isArray(categoriesData)
    ? categoriesData.map((cat) => {
        if (typeof cat === 'string') {
          return { slug: cat, name: cat.replace(/-/g, ' ') };
        }
        return { slug: cat.slug || cat.name, name: cat.name || cat.slug };
      })
    : [];

  const handleDelete = (id: number) => {
    deleteProduct({ id, queryArgs });
  };

  const isCustomCategorySelected = category && !POPULAR_CATEGORIES.includes(category);
  const selectedCategoryObj = categoriesList.find((c) => c.slug === category);

  return (
    <div className="min-h-screen bg-surface-bg text-navy-900 flex flex-col font-sans">
      <Header />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Sticky Control Panel (Categories + Search + Sort) */}
        <div className="sticky top-16 z-20 bg-surface-bg/90 backdrop-blur-md pt-2 pb-3 space-y-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 transition-all">
          {/* Category Bar: Quick Pills + Clean Category Dropdown */}
          <div className="bg-white border border-surface-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-xs font-bold text-surface-subtle shrink-0 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-brand-500" /> Categories:
              </span>

              {/* Quick Pill: All Categories */}
              <button
                type="button"
                onClick={() => dispatch(setCategory(''))}
                className={`px-3 py-1.5 rounded-full text-xs transition-all shrink-0 ${
                  !category
                    ? 'bg-brand-50 text-brand-500 border border-brand-100 font-bold shadow-xs'
                    : 'bg-white text-surface-subtle border border-surface-border hover:border-brand-500 hover:text-brand-500 font-medium'
                }`}
              >
                All Categories
              </button>

              {/* Quick Pills: Top Popular Categories */}
              {POPULAR_CATEGORIES.map((slug) => {
                const catObj = categoriesList.find((c) => c.slug === slug) || {
                  slug,
                  name: slug.replace(/-/g, ' '),
                };
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => dispatch(setCategory(slug))}
                    className={`px-3 py-1.5 rounded-full text-xs capitalize transition-all shrink-0 ${
                      category === slug
                        ? 'bg-brand-50 text-brand-500 border border-brand-100 font-bold shadow-xs'
                        : 'bg-white text-surface-subtle border border-surface-border hover:border-brand-500 hover:text-brand-500 font-medium'
                    }`}
                  >
                    {catObj.name}
                  </button>
                );
              })}

              {/* Active Pill if selected category is outside popular list */}
              {isCustomCategorySelected && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs capitalize bg-brand-50 text-brand-500 border border-brand-100 font-bold shadow-xs shrink-0 flex items-center gap-1"
                >
                  <span>{selectedCategoryObj?.name || category}</span>
                  <X
                    className="w-3 h-3 text-brand-500 hover:text-danger-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setCategory(''));
                    }}
                  />
                </button>
              )}

              {/* Clean Category Select Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={category}
                  onChange={(e) => dispatch(setCategory(e.target.value))}
                  disabled={isLoadingCategories}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-surface-bg hover:bg-surface-border border border-surface-border rounded-full text-xs font-bold text-navy-900 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors"
                >
                  <option value="">View All ({categoriesList.length || '24'} Categories)</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-surface-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Layout Switcher (Table / Grid) */}
            <div className="flex items-center space-x-2 shrink-0 border-l border-surface-border pl-3">
              <div className="flex items-center bg-surface-bg p-1 rounded-lg border border-surface-border">
                <button
                  type="button"
                  onClick={() => dispatch(setViewMode('table'))}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'table'
                      ? 'bg-brand-500 text-white font-bold shadow-xs'
                      : 'text-surface-subtle hover:text-navy-900'
                  }`}
                  title="Table View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setViewMode('grid'))}
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'grid'
                      ? 'bg-brand-500 text-white font-bold shadow-xs'
                      : 'text-surface-subtle hover:text-navy-900'
                  }`}
                  title="Grid Catalog View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Integrated Toolbar: Summary, Central Search Input, and Sort Selector */}
          <div className="bg-white border border-surface-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Left: Inventory Summary & Reset Badge */}
            <div className="flex items-center space-x-2 text-xs shrink-0">
              <span className="font-extrabold text-navy-900">Inventory Catalog</span>
              <span className="text-surface-subtle">({total} items found)</span>
              {(search || category || sort !== 'default') && (
                <button
                  type="button"
                  onClick={() => dispatch(resetFilters())}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-danger-50 text-danger-500 hover:bg-danger-100 transition-colors ml-2"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Center: Main Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-surface-subtle" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder="Search products, brand names, or SKUs..."
                className="w-full pl-9 pr-8 py-2 bg-surface-bg border border-surface-border rounded-lg text-xs font-medium text-navy-900 placeholder-surface-subtle focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearch(''))}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-subtle hover:text-danger-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center space-x-2 shrink-0 justify-between md:justify-end">
              <span className="text-xs font-bold text-surface-subtle">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => dispatch(setSort(e.target.value as SortOption))}
                className="bg-surface-bg border border-surface-border rounded-lg px-3 py-1.5 text-xs font-bold text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
                <option value="title_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Content Section */}
        {isLoading || isFetching ? (
          <ProductSkeleton viewMode={viewMode} />
        ) : isError ? (
          <div className="bg-white border border-danger-100 rounded-lg p-8 text-center space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-danger-500">Failed to Load Inventory Data</h3>
            <p className="text-xs text-surface-subtle">
              Connection error with DummyJSON REST API.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-500 text-xs font-bold rounded-lg border border-brand-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : products.length === 0 ? (
          <EmptyState searchQuery={search} onReset={() => dispatch(resetFilters())} />
        ) : (
          <div className="space-y-4 pt-1">
            {viewMode === 'table' ? (
              <ProductTable products={products} onDelete={handleDelete} />
            ) : (
              <ProductGrid products={products} onDelete={handleDelete} />
            )}

            {/* Pagination Bar with Items Per Page Selector */}
            <div className="bg-white border border-surface-border rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-subtle shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
              {/* Left: Range Info & Items Per Page Limit Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  Showing <span className="font-bold text-navy-900">{skip + 1}</span> -{' '}
                  <span className="font-bold text-navy-900">
                    {Math.min(skip + limit, total)}
                  </span>{' '}
                  of <span className="font-bold text-navy-900">{total}</span> items
                </div>

                <div className="flex items-center space-x-1.5 border-l border-surface-border pl-3">
                  <span className="text-xs font-bold text-surface-subtle">Per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                    className="bg-surface-bg border border-surface-border rounded-lg px-2.5 py-1 text-xs font-bold text-navy-900 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Right: Previous / Next Navigation Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => dispatch(setPage(page - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg bg-white border border-surface-border text-navy-900 hover:bg-brand-50 hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4 text-current" />
                </button>

                <span className="px-3 py-1 bg-surface-bg rounded-lg font-bold text-navy-900 text-xs border border-surface-border">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => dispatch(setPage(page + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg bg-white border border-surface-border text-navy-900 hover:bg-brand-50 hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4 text-current" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductSkeleton viewMode="table" />}>
      <InventoryContent />
    </Suspense>
  );
}
