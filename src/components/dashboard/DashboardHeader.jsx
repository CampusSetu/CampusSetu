import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function DashboardHeader({ title, actions, onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white px-6">
      <button
        onClick={onMenuToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        aria-label="Toggle menu"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      <div className="h-4 w-px bg-slate-200" />

      <h1 className="text-base font-semibold text-slate-900">{title}</h1>

      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  );
}
