import React from 'react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'promo';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[#FFF0F1] text-[#E41522] border-[#FCE8E9]',
  danger: 'bg-[#FFF0F2] text-[#EF144A] border-[#FFC2CD]',
  warning: 'bg-[#FFF8E6] text-[#D97706] border-[#FDE68A]',
  info: 'bg-[#EBF5FF] text-[#0060AF] border-[#BEE3F8]',
  neutral: 'bg-[#F4F5F7] text-[#637381] border-[#E2E4E8]',
  promo: 'bg-[#FFF0F2] text-[#E41522] font-bold border-[#FCE8E9]',
};

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
