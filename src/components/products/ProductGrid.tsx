'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Tag, Star, CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/types/product';
import ConfirmModal from '../common/ConfirmModal';

interface ProductGridProps {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductGrid({ products, onDelete }: ProductGridProps) {
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-lg border border-surface-border overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow duration-200 flex flex-col justify-between select-none"
          >
            <div>
              {/* Product Thumbnail */}
              <div className="relative w-full aspect-square bg-surface-bg overflow-hidden">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-surface-muted">
                    <Tag className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-2.5 sm:p-3 space-y-1.5">
                {/* Title */}
                <h4 className="font-semibold text-navy-900 text-[12px] sm:text-[13px] line-clamp-2 leading-snug h-[32px] sm:h-[34px]">
                  {product.title}
                </h4>

                {/* Price */}
                <div className="pt-0.5">
                  <span className="font-extrabold text-sm sm:text-base text-brand-500">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* Discount Percentage Tag */}
                {product.discountPercentage ? (
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <span className="bg-brand-50 text-brand-500 font-bold px-1.5 py-0.5 rounded text-[10px] border border-brand-100">
                      {product.discountPercentage}% OFF
                    </span>
                    <span className="text-surface-subtle line-through text-[10px]">
                      ${(Number(product.price) * (1 + product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  </div>
                ) : null}

                {/* Merchant / Location Badge */}
                <div className="flex items-center space-x-1 text-[11px] text-surface-subtle pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span className="truncate font-medium">{product.brand || 'IFG Official'}</span>
                </div>

                {/* Rating & Sales count */}
                <div className="flex items-center space-x-1 text-[11px] text-surface-subtle">
                  <Star className="w-3 h-3 text-[#FFC400] fill-[#FFC400]" />
                  <span className="font-bold text-navy-900">{product.rating || '4.8'}</span>
                  <span>|</span>
                  <span>Sold {product.stock > 10 ? '100+' : `${product.stock}+`}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-3 py-2 bg-surface-bg border-t border-surface-border flex items-center justify-between">
              <span className="text-[10px] font-medium text-surface-subtle">ID: #{product.id}</span>
              <button
                type="button"
                onClick={() => setSelectedDeleteProduct(product)}
                className="p-1 text-danger-500 hover:bg-danger-50 rounded transition-colors"
                title="Delete product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(selectedDeleteProduct)}
        title="Delete Inventory Item"
        message={`Are you sure you want to delete "${selectedDeleteProduct?.title}"? This action will apply an optimistic update immediately.`}
        confirmLabel="Yes, Delete"
        isDangerous
        onConfirm={() => {
          if (selectedDeleteProduct) {
            onDelete(selectedDeleteProduct.id);
            setSelectedDeleteProduct(null);
          }
        }}
        onCancel={() => setSelectedDeleteProduct(null)}
      />
    </>
  );
}
