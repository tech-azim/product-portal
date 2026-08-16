'use client';

import React, { useState } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setCategory,
  setSort,
  setFilterDrawerOpen,
  resetFilters,
} from '@/lib/redux/slices/productSlice';
import { SortOption } from '@/lib/types/product';
import Button from '../ui/Button';
import Select from '../ui/Select';

interface FilterDrawerProps {
  categories: Array<{ slug: string; name: string }>;
  isLoadingCategories?: boolean;
}

export default function FilterDrawer({ categories, isLoadingCategories }: FilterDrawerProps) {
  const dispatch = useAppDispatch();
  const { isFilterDrawerOpen, category, sort } = useAppSelector((state) => state.product);

  const [localCategory, setLocalCategory] = useState<string | null>(null);
  const [localSort, setLocalSort] = useState<SortOption | null>(null);

  if (!isFilterDrawerOpen) return null;

  const activeCategory = localCategory ?? category;
  const activeSort = localSort ?? sort;

  const handleApply = () => {
    dispatch(setCategory(activeCategory));
    dispatch(setSort(activeSort));
    setLocalCategory(null);
    setLocalSort(null);
    dispatch(setFilterDrawerOpen(false));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalCategory(null);
    setLocalSort(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-surface-border text-navy-900 shadow-2xl flex flex-col justify-between animate-slideInRight">
          {/* Drawer Header */}
          <div className="p-5 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center">
                <Filter className="w-4 h-4 text-brand-500" />
              </div>
              <h3 className="font-bold text-base text-navy-900">Filter & Sort Options</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setLocalCategory(null);
                setLocalSort(null);
                dispatch(setFilterDrawerOpen(false));
              }}
              className="text-surface-subtle hover:text-navy-900 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {/* Category Select */}
            <Select
              label="Filter by Category"
              value={activeCategory}
              onChange={(e) => setLocalCategory(e.target.value)}
              disabled={isLoadingCategories}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
              ]}
              helperText={isLoadingCategories ? 'Loading categories from API...' : 'Select a product category'}
            />

            {/* Sort Select */}
            <Select
              label="Sort Products By"
              value={activeSort}
              onChange={(e) => setLocalSort(e.target.value as SortOption)}
              options={[
                { value: 'default', label: 'Default Sorting' },
                { value: 'price_asc', label: 'Price: Low to High' },
                { value: 'price_desc', label: 'Price: High to Low' },
              ]}
              helperText="Reorder inventory list by base price"
            />
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-surface-border bg-surface-bg flex items-center justify-between space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleApply}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
