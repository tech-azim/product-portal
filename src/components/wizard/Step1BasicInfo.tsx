'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/types/product';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/Form';
import { useGetCategoriesQuery } from '@/lib/redux/api/productsApi';

export default function Step1BasicInfo() {
  const { control } = useFormContext<ProductFormData>();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const categoryOptions = React.useMemo(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      return categoriesData.map((cat) => {
        if (typeof cat === 'string') {
          const formatted = cat
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          return { value: cat, label: formatted };
        }
        const slug = cat.slug || cat.name;
        const name = cat.name || cat.slug;
        return { value: slug, label: name };
      });
    }

    return [
      { value: 'beauty', label: 'Beauty' },
      { value: 'fragrances', label: 'Fragrances' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'groceries', label: 'Groceries' },
      { value: 'home-decoration', label: 'Home Decoration' },
      { value: 'kitchen-accessories', label: 'Kitchen Accessories' },
      { value: 'laptops', label: 'Laptops' },
      { value: 'mens-shirts', label: "Men's Shirts" },
      { value: 'mens-shoes', label: "Men's Shoes" },
      { value: 'mens-watches', label: "Men's Watches" },
      { value: 'mobile-accessories', label: 'Mobile Accessories' },
      { value: 'motorcycle', label: 'Motorcycle' },
      { value: 'skin-care', label: 'Skin Care' },
      { value: 'smartphones', label: 'Smartphones' },
      { value: 'sports-accessories', label: 'Sports Accessories' },
      { value: 'sunglasses', label: 'Sunglasses' },
      { value: 'tablets', label: 'Tablets' },
      { value: 'tops', label: 'Tops' },
      { value: 'vehicle', label: 'Vehicle' },
      { value: 'womens-bags', label: "Women's Bags" },
      { value: 'womens-dresses', label: "Women's Dresses" },
      { value: 'womens-jewellery', label: "Women's Jewellery" },
      { value: 'womens-shoes', label: "Women's Shoes" },
      { value: 'womens-watches', label: "Women's Watches" },
    ];
  }, [categoriesData]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base text-navy-900">
          <span>Step 1: Basic Product Information</span>
        </CardTitle>
        <CardDescription>
          Enter the core title, brand, category, and descriptive details for your inventory item.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {/* Title */}
        <FormField
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Product Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Wireless Noise-Canceling Headphones"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brand */}
          <FormField
            control={control}
            name="brand"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Brand</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Sony, Apple, Samsung"
                    error={Boolean(fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={control}
            name="category"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Category</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    placeholder={isLoadingCategories ? 'Loading categories...' : 'Select category'}
                    error={Boolean(fieldState.error)}
                    options={categoryOptions}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Detailed description of the product features, specifications, and box contents (min 20 characters)..."
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
