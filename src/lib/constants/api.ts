export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dummyjson.com'
).replace(/\/$/, '');

export const API_ENDPOINTS = {
  PRODUCTS: 'products',
  SEARCH: 'products/search',
  CATEGORIES: 'products/categories',
  ADD: 'products/add',
} as const;
