'use client';

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ProductFormData } from '@/lib/types/product';
import NumberInput from '../ui/NumberInput';
import Textarea from '../ui/Textarea';
import Checkbox from '../ui/Checkbox';
import { CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/Form';

export default function Step3ShippingFragile() {
  const { control } = useFormContext<ProductFormData>();

  const requiresFragileHandling = useWatch({
    control,
    name: 'requiresFragileHandling',
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base text-navy-900">
          <span>Step 3: Shipping, Dimensions & Fragile Handling</span>
        </CardTitle>
        <CardDescription>
          Provide parcel weight, physical dimensions, and conditional fragile shipping specifications.
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Weight */}
        <FormField
          control={control}
          name="weight"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Weight (kg)</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  suffixSymbol="kg"
                  placeholder="1.5"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Width */}
        <FormField
          control={control}
          name="dimensions.width"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Width (cm)</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  suffixSymbol="cm"
                  placeholder="10"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Height */}
        <FormField
          control={control}
          name="dimensions.height"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Height (cm)</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  suffixSymbol="cm"
                  placeholder="15"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Depth */}
        <FormField
          control={control}
          name="dimensions.depth"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Depth (cm)</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  suffixSymbol="cm"
                  placeholder="5"
                  error={Boolean(fieldState.error)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Fragile Checkbox */}
      <div className="pt-4 border-t border-surface-border">
        <FormField
          control={control}
          name="requiresFragileHandling"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label="Requires Fragile / Glass Handling Protection"
                  description="Enable additional bubble wrap packaging and fragile stickers for courier transit."
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Conditional Fragile Fields */}
      {requiresFragileHandling && (
        <div className="p-5 bg-[#FFF8E6] border border-[#FDE68A] rounded-2xl space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-[#D97706]">Fragile Parcel Specifications</h4>
            <p className="text-[11px] text-surface-subtle">
              Please complete the required safety disclaimers and special shipping notes.
            </p>
          </div>

          <FormField
            control={control}
            name="hazardousMaterialDisclaimer"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    label="I confirm this item does NOT contain non-compliant lithium batteries or hazardous materials"
                    description="Compliance acknowledgment for air and sea freight logistics."
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-xs font-semibold text-danger-500 pl-7">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="specialShippingNotes"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel required>Special Fragile Handling Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="e.g. Handle with care, keep upright, do not stack heavy items on top..."
                    error={Boolean(fieldState.error)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
