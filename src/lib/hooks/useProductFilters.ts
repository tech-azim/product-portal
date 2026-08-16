'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setLimit,
} from '../redux/slices/productSlice';
import { SortOption } from '../types/product';

export function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { search, category, sort, page, limit } = useAppSelector((state) => state.product);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const isInitialSyncDone = useRef(false);

  // 1. Initial Sync: Read from URL query params -> Redux state on first mount
  useEffect(() => {
    if (!isInitialSyncDone.current) {
      const urlSearch = searchParams.get('search') || '';
      const urlCategory = searchParams.get('category') || '';
      const urlSort = (searchParams.get('sort') as SortOption) || 'default';
      const urlPage = parseInt(searchParams.get('page') || '1', 10);
      const urlLimit = parseInt(searchParams.get('limit') || '10', 10);

      if (urlSearch !== search) dispatch(setSearch(urlSearch));
      if (urlCategory !== category) dispatch(setCategory(urlCategory));
      if (urlSort !== sort) dispatch(setSort(urlSort));
      if (!isNaN(urlPage) && urlPage !== page) dispatch(setPage(urlPage));
      if (!isNaN(urlLimit) && urlLimit !== limit) dispatch(setLimit(urlLimit));

      setDebouncedSearch(urlSearch);
      isInitialSyncDone.current = true;
    }
  }, [searchParams, dispatch, search, category, sort, page, limit]);

  // 2. Debounce Search Input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // 3. Sync Redux state -> URL Search Parameters
  useEffect(() => {
    if (!isInitialSyncDone.current) return;

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort && sort !== 'default') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      router.replace(newQueryString ? `/products?${newQueryString}` : '/products', {
        scroll: false,
      });
    }
  }, [search, category, sort, page, limit, router, searchParams]);

  const skip = (page - 1) * limit;

  return {
    search,
    debouncedSearch,
    category,
    sort,
    page,
    limit,
    skip,
  };
}
