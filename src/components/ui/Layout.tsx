'use client';

import React from 'react';
import Header from '../common/Header';
import ToastContainer from '../common/ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
  className?: string;
}

const maxWidthClasses: Record<NonNullable<LayoutProps['maxWidth']>, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export default function Layout({ children, maxWidth = '7xl', className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F3F4F5] text-[#212121] flex flex-col font-sans">
      <Header />
      <ToastContainer />

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 ${maxWidthClasses[maxWidth]} ${className}`.trim()}>
        {children}
      </main>
    </div>
  );
}
