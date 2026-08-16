import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#E5E7E9] rounded-lg shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`p-4 sm:p-5 border-b border-[#E5E7E9] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: CardProps) {
  return (
    <h3 className={`text-sm sm:text-base font-bold text-[#212121] flex items-center gap-2 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: CardProps) {
  return (
    <p className={`text-xs text-[#6C727C] mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`p-4 sm:p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`p-4 sm:p-5 border-t border-[#E5E7E9] bg-[#F8F9FA] rounded-b-lg flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}
