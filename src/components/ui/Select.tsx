import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  helperText,
  error,
  required,
  placeholder,
  className = '',
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-navy-900">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none px-3 py-2 bg-white border text-xs font-medium text-navy-900 rounded-lg transition-all duration-150 focus:outline-none focus:ring-1 focus:bg-white disabled:bg-surface-bg disabled:text-surface-muted disabled:cursor-not-allowed pr-8 ${
            hasError
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-surface-border hover:border-[#C4C9D0] focus:border-brand-500 focus:ring-brand-500'
          } ${className}`.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-surface-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-navy-900">
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-surface-subtle">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {errorMessage ? (
        <p className="text-[11px] font-semibold text-danger-500 animate-fadeIn">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-[11px] text-surface-subtle">{helperText}</p>
      ) : null}
    </div>
  );
}
