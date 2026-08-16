'use client';

import React from 'react';
import { ViewMode } from '@/lib/types/product';

export default function ProductSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-surface-border rounded-lg p-3 space-y-3 shadow-sm animate-pulse"
          >
            <div className="w-full aspect-square bg-surface-border rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 bg-surface-border rounded w-3/4" />
              <div className="h-3 bg-surface-border rounded w-1/2" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 bg-surface-border rounded w-1/3" />
              <div className="h-7 bg-surface-border rounded-lg w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-surface-border rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 bg-surface-bg border-b border-surface-border flex items-center justify-between">
        <div className="h-4 bg-surface-border rounded w-48" />
        <div className="h-4 bg-surface-border rounded w-24" />
      </div>
      <div className="divide-y divide-surface-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 w-1/3">
              <div className="w-11 h-11 bg-surface-border rounded-xl shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-4 bg-surface-border rounded w-3/4" />
                <div className="h-3 bg-surface-border rounded w-1/2" />
              </div>
            </div>
            <div className="h-4 bg-surface-border rounded w-20 hidden md:block" />
            <div className="h-4 bg-surface-border rounded w-16" />
            <div className="h-4 bg-surface-border rounded w-16 hidden sm:block" />
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-surface-border rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
