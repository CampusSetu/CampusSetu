import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function MetricCard({ title, value, change, description, trend, footnote, icon: Icon }) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div className="@container/card relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-50/30 to-transparent opacity-50" />

      <div className="relative flex flex-col gap-4">
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </p>
            {footnote && (
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {footnote}
              </p>
            )}
          </div>
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                isPositive && 'bg-emerald-50 text-emerald-700',
                isNegative && 'bg-red-50 text-red-700',
                !isPositive && !isNegative && 'bg-slate-100 text-slate-600'
              )}
            >
              {isPositive && <ArrowUpIcon className="h-3 w-3" />}
              {isNegative && <ArrowDownIcon className="h-3 w-3" />}
              {change}
            </span>
          )}
        </div>

        {/* Main Value */}
        <div className="flex items-baseline gap-2">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <p className="text-2xl font-semibold text-slate-900 @[250px]/card:text-3xl">
            {value}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
