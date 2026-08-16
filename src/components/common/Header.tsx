'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Plus } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-surface-border text-navy-900 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Branding */}
          <Link href="/products" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-600 transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-navy-900">
                  Product Portal
                </span>
              </div>
            </div>
          </Link>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Add New Product CTA */}
            {pathname !== '/products/new' && (
              <Link
                href="/products/new"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-all duration-150 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
