'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  onReset: () => void;
}

export default function EmptyState({ searchQuery, onReset }: EmptyStateProps) {
  return (
    <div className="bg-white border border-[#E2E4E8] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF0F1] border border-[#FCE8E9] flex items-center justify-center text-[#E41522]">
        <SearchX className="w-8 h-8 text-[#E41522]" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="text-base font-bold text-[#0A192F]">No Products Found</h3>
        <p className="text-xs text-[#637381] leading-relaxed">
          {searchQuery
            ? `No inventory items matched your search query "${searchQuery}". Try refining your keywords or clearing filters.`
            : 'No inventory items are available in the selected category or filter configuration.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#E41522] hover:bg-[#C80F1A] text-white shadow-xs transition-colors"
      >
        <RotateCcw className="w-4 h-4 text-white" />
        <span>Reset Filters & Search</span>
      </button>
    </div>
  );
}
