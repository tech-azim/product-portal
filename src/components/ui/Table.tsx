import React from 'react';

export function TableContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full overflow-x-auto border border-surface-border rounded-2xl bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <table className={`w-full text-left text-xs text-navy-900 ${className}`}>{children}</table>;
}

export function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={`bg-surface-bg text-surface-subtle font-bold uppercase tracking-wider text-[11px] border-b border-surface-border ${className}`}>
      {children}
    </thead>
  );
}

export function TableHeaderCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3.5 ${className}`}>{children}</th>;
}

export function TableBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-surface-border ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tr className={`hover:bg-brand-50/40 transition-colors ${className}`}>{children}</tr>;
}

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 text-xs text-navy-900 font-medium align-middle ${className}`}>{children}</td>;
}
