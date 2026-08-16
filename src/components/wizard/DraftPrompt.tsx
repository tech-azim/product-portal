'use client';

import React, { useSyncExternalStore } from 'react';
import { History, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { restoreDraft, clearDraft } from '@/lib/redux/slices/productSlice';

const emptySubscribe = () => () => {};

export default function DraftPrompt() {
  const dispatch = useAppDispatch();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { hasSavedDraft, isDraftPromptDismissed } = useAppSelector((state) => state.product);

  if (!isClient || !hasSavedDraft || isDraftPromptDismissed) return null;

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-navy-900 animate-fadeIn">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-white border border-brand-200 flex items-center justify-center shrink-0 shadow-xs">
          <History className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <h4 className="font-bold text-navy-900 text-sm">Resume Saved Draft?</h4>
          <p className="text-xs text-surface-subtle">
            We found a previously saved product creation draft from your session.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={() => dispatch(clearDraft())}
          className="px-3.5 py-1.5 rounded-xl border border-surface-border bg-white hover:bg-surface-bg text-xs font-bold text-surface-subtle hover:text-navy-900 transition-colors"
        >
          Discard Draft
        </button>
        <button
          type="button"
          onClick={() => dispatch(restoreDraft())}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white shadow-sm shadow-brand-500/20 transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Resume Draft</span>
        </button>
      </div>
    </div>
  );
}
