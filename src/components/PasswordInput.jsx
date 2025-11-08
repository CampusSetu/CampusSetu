import React, { useState } from 'react';

export default function PasswordInput({ value, onChange, placeholder = 'Password', className = '' }) {
  const [visible, setVisible] = useState(false);
  const baseClasses = 'h-11 w-full rounded-md border border-slate-200 bg-white px-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 transition duration-150 ease-out focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-70';
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${baseClasses} ${className}`.trim()}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center rounded-md border border-transparent px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
