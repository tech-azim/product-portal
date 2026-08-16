import React from 'react';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'small'
  | 'caption'
  | 'muted'
  | 'label';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  h1: 'text-2xl sm:text-3xl font-extrabold text-[#212121] tracking-tight',
  h2: 'text-xl sm:text-2xl font-bold text-[#212121] tracking-tight',
  h3: 'text-base font-bold text-[#212121]',
  h4: 'text-xs font-bold text-[#212121] uppercase tracking-wider',
  body: 'text-xs sm:text-sm text-[#31353B] leading-relaxed',
  small: 'text-xs text-[#212121] font-medium',
  caption: 'text-[11px] text-[#6C727C] font-normal',
  muted: 'text-xs text-[#6C727C]',
  label: 'block text-xs font-bold uppercase tracking-wider text-[#212121]',
};

const defaultTag: Record<TextVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  small: 'span',
  caption: 'span',
  muted: 'span',
  label: 'label',
};

export default function Text({
  variant = 'body',
  as,
  children,
  className = '',
  ...props
}: TextProps) {
  const Component = as || defaultTag[variant];
  const styles = `${variantStyles[variant]} ${className}`.trim();

  return (
    <Component className={styles} {...props}>
      {children}
    </Component>
  );
}
