'use client';

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, RotateCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { removeToast, ToastItem } from '@/lib/redux/slices/productSlice';
import { useDeleteProductMutation } from '@/lib/redux/api/productsApi';

export default function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.product.toasts);
  const [deleteProduct] = useDeleteProductMutation();

  if (toasts.length === 0) return null;

  const handleRetry = (toast: ToastItem) => {
    dispatch(removeToast(toast.id));
    if (toast.retryPayload) {
      if (toast.retryPayload.actionType === 'delete') {
        deleteProduct({ id: toast.retryPayload.productId });
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-brand-50 border-brand-100 text-navy-900'
                : isError
                ? 'bg-danger-50 border-danger-100 text-navy-900'
                : 'bg-white border-surface-border text-navy-900'
            }`}
          >
            <div className="mr-3 mt-0.5 shrink-0">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-brand-500" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-danger-500" />
              ) : (
                <Info className="w-5 h-5 text-info-500" />
              )}
            </div>

            <div className="flex-1 pr-2">
              <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
              {toast.retryPayload && (
                <button
                  type="button"
                  onClick={() => handleRetry(toast)}
                  className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-danger-500 hover:bg-danger-600 text-white shadow-xs transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Retry Action</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => dispatch(removeToast(toast.id))}
              className="text-surface-subtle hover:text-navy-900 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
