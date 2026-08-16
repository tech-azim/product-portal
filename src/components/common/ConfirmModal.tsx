'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-surface-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-scaleUp text-navy-900">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDangerous ? 'bg-danger-50 text-danger-500' : 'bg-brand-50 text-brand-500'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-surface-subtle hover:text-navy-900 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-surface-subtle leading-relaxed">{message}</p>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDangerous ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
