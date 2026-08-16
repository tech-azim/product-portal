import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
}

export default function Input({
  label,
  helperText,
  error,
  required,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-navy-900">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
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
