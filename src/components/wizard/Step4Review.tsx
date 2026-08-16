'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductFormData } from '@/lib/types/product';
import { CheckCircle2, Edit3, Info, DollarSign, Truck, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { CardHeader, CardTitle, CardDescription } from '../ui/Card';

interface Step4Props {
  onGoToStep: (step: number) => void;
}

export default function Step4Review({ onGoToStep }: Step4Props) {
  const { getValues } = useFormContext<ProductFormData>();
  const formData = getValues();

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-base text-[#0A192F]">
          <CheckCircle2 className="w-5 h-5 text-[#E41522]" />
          <span>Step 4: Review & Submit Product</span>
        </CardTitle>
        <CardDescription>
          Review the compiled product details below. Click &quot;Edit&quot; on any section to revise fields without losing form data.
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {/* Section 1: Basic Info */}
        <div className="bg-[#F4F5F7] border border-[#E2E4E8] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E4E8] pb-3">
            <h4 className="font-bold text-[#0A192F] text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#E41522]" />
              <span>1. Basic Product Information</span>
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(1)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Section
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#637381] block font-medium">Product Title</span>
              <span className="font-bold text-[#0A192F]">{formData.title || '-'}</span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Brand</span>
              <span className="font-bold text-[#0A192F]">{formData.brand || '-'}</span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Category</span>
              <span className="font-bold text-[#0A192F] capitalize">{formData.category || '-'}</span>
            </div>
            <div className="md:col-span-3">
              <span className="text-[#637381] block font-medium">Description</span>
              <p className="text-[#212B36] mt-0.5 leading-relaxed font-medium">{formData.description || '-'}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Variations */}
        <div className="bg-[#F4F5F7] border border-[#E2E4E8] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E4E8] pb-3">
            <h4 className="font-bold text-[#0A192F] text-xs flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-[#E41522]" />
              <span>2. Pricing, Stock & Variations</span>
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(2)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Section
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#637381] block font-medium">Base Price</span>
              <span className="font-extrabold text-[#E41522] text-sm">
                ${formData.price ? Number(formData.price).toFixed(2) : '0.00'}
              </span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Stock Quantity</span>
              <span className="font-bold text-[#0A192F]">{formData.stock ?? 0} units</span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Discount Percentage</span>
              <span className="font-bold text-[#0A192F]">
                {formData.discountPercentage ? `${formData.discountPercentage}%` : 'None'}
              </span>
            </div>
          </div>

          {/* SKU Variations List */}
          <div className="pt-2">
            <span className="text-[#637381] block font-medium text-xs mb-2">
              Variations ({formData.variations?.length || 0})
            </span>
            {formData.variations && formData.variations.length > 0 ? (
              <div className="space-y-1.5">
                {formData.variations.map((v, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white rounded-xl border border-[#E2E4E8] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="success" className="font-mono">{v.sku}</Badge>
                      <span className="text-[#0A192F] font-semibold">
                        {v.color} / {v.size}
                      </span>
                    </div>
                    <span className="text-[#E41522] font-bold">
                      +${v.extraPrice ? Number(v.extraPrice).toFixed(2) : '0.00'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#9FA6B0] italic">No custom variations added.</p>
            )}
          </div>
        </div>

        {/* Section 3: Shipping & Logistics */}
        <div className="bg-[#F4F5F7] border border-[#E2E4E8] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E4E8] pb-3">
            <h4 className="font-bold text-[#0A192F] text-xs flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#E41522]" />
              <span>3. Shipping & Logistics</span>
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(3)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Edit Section
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#637381] block font-medium">Weight</span>
              <span className="font-bold text-[#0A192F]">{formData.weight || 0} kg</span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Width</span>
              <span className="font-bold text-[#0A192F]">{formData.dimensions?.width || 0} cm</span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Height</span>
              <span className="font-bold text-[#0A192F]">{formData.dimensions?.height || 0} cm</span>
            </div>
            <div>
              <span className="text-[#637381] block font-medium">Depth</span>
              <span className="font-bold text-[#0A192F]">{formData.dimensions?.depth || 0} cm</span>
            </div>
          </div>

          {formData.requiresFragileHandling ? (
            <div className="p-3 bg-[#FFF8E6] border border-[#FDE68A] rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-[#D97706] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                <span>Fragile Handling Active</span>
              </div>
              <p className="text-[#212B36]">
                <span className="font-semibold">Special Notes:</span> {formData.specialShippingNotes}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#637381] font-medium">Standard non-fragile parcel shipping.</p>
          )}
        </div>
      </div>
    </div>
  );
}
