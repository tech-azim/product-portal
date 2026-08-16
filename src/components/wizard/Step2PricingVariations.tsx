'use client';

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ProductFormData } from '@/lib/types/product';
import Input from '../ui/Input';
import NumberInput from '../ui/NumberInput';
import Button from '../ui/Button';
import { Trash2, Plus, Layers } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/Form';

export default function Step2PricingVariations() {
  const { control } = useFormContext<ProductFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  });

  const handleAddVariation = () => {
    append({
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      color: 'Default',
      size: 'Standard',
      extraPrice: 0,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base text-navy-900">
          <span>Step 2: Pricing, Stock & SKU Variations</span>
        </CardTitle>
        <CardDescription>
          Specify base price, inventory quantity, discount percentage, and dynamic SKU variations.
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Base Price */}
        <FormField
          control={control}
          name="price"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Base Price ($)</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  prefixSymbol="$"
                  placeholder="99.99"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={control}
          name="stock"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Stock Quantity</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  placeholder="50"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Percentage */}
        <FormField
          control={control}
          name="discountPercentage"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  suffixSymbol="%"
                  placeholder="10"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Dynamic SKU Variations Section */}
      <div className="pt-4 border-t border-surface-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-500" />
            <h4 className="font-bold text-xs text-navy-900">
              Custom SKU Variations ({fields.length})
            </h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddVariation}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Variation
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-surface-border rounded-2xl bg-surface-bg space-y-2">
            <p className="text-xs text-surface-subtle font-medium">No custom variations added yet.</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddVariation}
              leftIcon={<Plus className="w-3.5 h-3.5 text-brand-500" />}
            >
              Add first variant (e.g. Color / Size / SKU)
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="p-4 bg-surface-bg border border-surface-border rounded-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-500">
                    Variant #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-danger-500 hover:text-danger-600 p-1 rounded transition-colors"
                    title="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <FormField
                    control={control}
                    name={`variations.${index}.sku`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>SKU Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SKU-001" error={Boolean(fieldState.error)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`variations.${index}.color`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Color / Variant</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Black" error={Boolean(fieldState.error)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`variations.${index}.size`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="XL / 42" error={Boolean(fieldState.error)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`variations.${index}.extraPrice`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Extra Price ($)</FormLabel>
                        <FormControl>
                          <NumberInput
                            {...field}
                            prefixSymbol="+$"
                            placeholder="5.00"
                            error={Boolean(fieldState.error)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
