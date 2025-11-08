import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

const selectorClass = "relative";

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <Listbox value={value} onChange={onChange}>
      <div className={selectorClass}>
        <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm text-slate-600 shadow-card transition hover:border-slate-300">
          <span className="truncate">{value || `All ${label}`}</span>
          <ChevronUpDownIcon className="h-5 w-5 text-slate-400" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-2 text-sm shadow-elevated">
            <Listbox.Option
              value=""
              className={({ active }) =>
                clsx(
                  "flex cursor-pointer items-center justify-between px-4 py-2",
                  active && "bg-brand-50 text-brand-700"
                )
              }
            >
              <span>All {label}</span>
              {!value && <CheckIcon className="h-4 w-4" />}
            </Listbox.Option>
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active }) =>
                  clsx(
                    "flex cursor-pointer items-center justify-between px-4 py-2",
                    active && "bg-brand-50 text-brand-700"
                  )
                }
              >
                <span className="truncate">{option}</span>
                {value === option && <CheckIcon className="h-4 w-4" />}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  </div>
);

const ActiveFilter = ({ label, value, onClear }) => (
  <button
    type="button"
    onClick={onClear}
    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
  >
    <span>
      {label}: {value}
    </span>
    <XMarkIcon className="h-3.5 w-3.5" />
  </button>
);

const FilterBar = ({ onChange, jobs = [] }) => {
  const [filters, setFilters] = useState({
    query: "",
    company: "",
    location: "",
    type: "",
  });

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const uniq = (list) => Array.from(new Set(list.filter(Boolean)));
  const companies = useMemo(
    () => uniq((jobs || []).map((j) => j.companyName || "")),
    [jobs]
  );
  const locations = useMemo(
    () => uniq((jobs || []).map((j) => j.location || "")),
    [jobs]
  );
  const types = useMemo(
    () => uniq((jobs || []).map((j) => j.type || "")),
    [jobs]
  );

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeFilters = [
    filters.company && {
      label: "Company",
      key: "company",
      value: filters.company,
    },
    filters.location && {
      label: "Location",
      key: "location",
      value: filters.location,
    },
    filters.type && { label: "Type", key: "type", value: filters.type },
  ].filter(Boolean);

  const resetFilters = () => {
    setFilters({ query: "", company: "", location: "", type: "" });
  };

  return (
    <section className="card-elevated">
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FunnelIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Refine your job feed
            </h2>
            <p className="text-xs text-slate-500">
              Combine filters to match opportunities tailored to your goals.
            </p>
          </div>
          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Reset all
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="relative flex-1 min-w-[260px]">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="query"
              value={filters.query}
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder="Search by title, skill, or company"
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-600 shadow-card placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <FilterSelect
              label="Company"
              value={filters.company}
              onChange={(value) => updateFilter("company", value)}
              options={companies}
            />
            <FilterSelect
              label="Location"
              value={filters.location}
              onChange={(value) => updateFilter("location", value)}
              options={locations}
            />
            <FilterSelect
              label="Type"
              value={filters.type}
              onChange={(value) => updateFilter("type", value)}
              options={types}
            />
          </div>
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeFilters.map((item) => (
              <ActiveFilter
                key={item.key}
                label={item.label}
                value={item.value}
                onClear={() => updateFilter(item.key, "")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterBar;
