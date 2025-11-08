import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function Pagination({
  page,
  pageSize,
  total,
  onChange,
  variant = "contained",
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const containerClass = clsx(
    "flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between",
    variant === "contained"
      ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
      : "p-0"
  );

  const badgeClass =
    variant === "contained"
      ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-semibold text-slate-700"
      : "inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm";

  return (
    <div className={containerClass}>
      <div>
        Showing <span className="font-medium text-slate-700">{start}</span> –
        <span className="font-medium text-slate-700"> {end}</span> of
        <span className="font-medium text-slate-700"> {total}</span>
      </div>
      <div className="flex items-center gap-3 self-end md:self-auto">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className={badgeClass}>
          <span>{page}</span>
          <span className="text-xs font-medium text-brand-500">
            of {totalPages}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Go to next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
