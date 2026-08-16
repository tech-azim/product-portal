import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-xs border border-transparent',
  secondary:
    'bg-brand-50 hover:bg-brand-100 text-brand-500 font-bold border border-brand-200',
  outline:
    'bg-white hover:bg-brand-50 text-brand-500 font-bold border border-brand-500',
  danger:
    'bg-danger-500 hover:bg-danger-600 text-white font-bold shadow-xs border border-transparent',
  ghost:
    'bg-transparent hover:bg-surface-bg text-surface-subtle hover:text-navy-900 border border-transparent font-bold',
  success:
    'bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-xs border border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg space-x-1.5',
  md: 'px-4 py-2 text-xs rounded-lg space-x-2',
  lg: 'px-6 py-2.5 text-sm rounded-lg space-x-2.5',
};

export default function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/30 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';
  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

  return (
    <button type={type} disabled={disabled || isLoading} className={combinedClasses} {...props}>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
