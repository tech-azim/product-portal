import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
}

export default function Textarea({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-bold text-navy-900">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <textarea
          id={textareaId}
          rows={rows}
          className={`w-full px-3 py-2 bg-white border text-xs font-medium text-navy-900 placeholder-surface-subtle rounded-lg transition-all duration-150 focus:outline-none focus:ring-1 focus:bg-white disabled:bg-surface-bg disabled:text-surface-muted disabled:cursor-not-allowed ${
            hasError
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-surface-border hover:border-[#C4C9D0] focus:border-brand-500 focus:ring-brand-500'
          } ${className}`.trim()}
          {...props}
        />
      </div>

      {errorMessage ? (
        <p className="text-[11px] font-semibold text-danger-500 animate-fadeIn">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-[11px] text-surface-subtle">{helperText}</p>
      ) : null}
    </div>
  );
}
