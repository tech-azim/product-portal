import React from 'react';
import Input, { InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  prefixSymbol?: string;
  suffixSymbol?: string;
}

export default function NumberInput({
  prefixSymbol,
  suffixSymbol,
  className = '',
  ...props
}: NumberInputProps) {
  return (
    <div className="relative flex items-center">
      {prefixSymbol && (
        <span className="absolute left-3.5 text-xs font-bold text-[#6C727C] pointer-events-none select-none z-10">
          {prefixSymbol}
        </span>
      )}
      <Input
        type="number"
        className={`${prefixSymbol ? 'pl-8' : ''} ${suffixSymbol ? 'pr-12' : ''} ${className}`}
        {...props}
      />
      {suffixSymbol && (
        <span className="absolute right-3.5 text-xs font-bold text-[#6C727C] pointer-events-none select-none z-10">
          {suffixSymbol}
        </span>
      )}
    </div>
  );
}
