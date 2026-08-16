'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Tag } from 'lucide-react';
import { Product } from '@/lib/types/product';
import ConfirmModal from '../common/ConfirmModal';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '../ui/Table';
import Badge from '../ui/Badge';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState<Product | null>(null);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Product Info</TableHeaderCell>
              <TableHeaderCell>Brand</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Base Price</TableHeaderCell>
              <TableHeaderCell>Discount</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                {/* Product Title & Image */}
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-11 h-11 rounded-xl bg-surface-bg border border-surface-border overflow-hidden shrink-0">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-muted">
                          <Tag className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-xs line-clamp-1 max-w-[200px]">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-surface-subtle">ID: #{product.id}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Brand */}
                <TableCell>
                  <span className="font-semibold text-navy-900">{product.brand || 'Generic'}</span>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge variant="neutral" className="capitalize text-[11px]">
                    {product.category}
                  </Badge>
                </TableCell>

                {/* Price */}
                <TableCell>
                  <span className="font-bold text-xs">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </TableCell>

                {/* Discount */}
                <TableCell>
                  {product.discountPercentage ? (
                    <Badge variant="promo">
                      {product.discountPercentage}% OFF
                    </Badge>
                  ) : (
                    <span className="text-surface-muted text-[11px]">-</span>
                  )}
                </TableCell>

                {/* Stock */}
                <TableCell>
                  {product.stock > 10 ? (
                    <Badge variant="success">{product.stock} in stock</Badge>
                  ) : product.stock > 0 ? (
                    <Badge variant="warning">Low ({product.stock})</Badge>
                  ) : (
                    <Badge variant="danger">Out of stock</Badge>
                  )}
                </TableCell>

                {/* Action Buttons */}
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedDeleteProduct(product)}
                    className="p-2 text-danger-500 hover:bg-danger-50 rounded-xl transition-colors"
                    title="Delete product with optimistic update"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
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
