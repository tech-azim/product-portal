import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

export default function Checkbox({
  label,
  description,
  error,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id={checkboxId}
          className={`w-4 h-4 mt-0.5 rounded border-[#C4C9D0] text-[#E41522] focus:ring-[#E41522]/30 focus:ring-offset-0 transition-colors accent-[#E41522] cursor-pointer ${className}`}
          {...props}
        />
        {label && (
          <div className="text-xs">
            <label htmlFor={checkboxId} className="font-bold text-[#0A192F] cursor-pointer select-none">
              {label}
            </label>
            {description && <p className="text-[#637381] font-normal mt-0.5">{description}</p>}
          </div>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-[#EF144A] animate-fadeIn pl-7">{error}</p>}
    </div>
  );
}
