import React, { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AnimatePresence, motion as Motion } from "framer-motion";

const navLinkClass = ({ isActive }) =>
  clsx(
    "group relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-slate-100 text-slate-900"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  );

export default function DashboardShell({
  navItems = [],
  user,
  onSignOut,
  children,
  headerSlot,
  footerSlot,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const initials = useMemo(() => {
    if (!user?.name) return "";
    const parts = user.name.split(" ").filter(Boolean);
    if (parts.length === 0) return user.name.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  const renderNavigation = () => (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} end className={navLinkClass}>
          {item.icon && <item.icon className="h-5 w-5" />}
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-auto grid h-6 min-w-[1.75rem] place-items-center rounded-full bg-brand-100 text-xs text-brand-700">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-16">
      <div className="mx-auto w-full max-w-full px-4 pt-10 sm:max-w-[90vw] sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden h-full rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-lg shadow-slate-200/40 backdrop-blur lg:block">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Navigate
              </p>
            </div>
            {renderNavigation()}
            {footerSlot && (
              <div className="mt-8 border-t border-slate-100 pt-5 text-sm text-slate-500">
                {footerSlot}
              </div>
            )}
          </aside>
          <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white/95 px-6 py-5 shadow-lg shadow-slate-200/40 backdrop-blur">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card lg:hidden"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Open navigation"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                <Link to="/" className="flex items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-base font-semibold text-white">
                    C
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-lg font-semibold text-slate-900">
                      CampusSetu
                    </p>
                  </div>
                </Link>
              </div>
              <div className="hidden max-w-[360px] flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500 lg:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.5 14.5L19 19m-4.5-4.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full border-none bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition hover:text-brand-600"
                >
                  <BellIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 font-semibold text-brand-600">
                    {initials || ""}
                  </div>
                  <div className="hidden leading-tight lg:block">
                    <p className="text-xs font-medium text-slate-500">
                      {user?.role}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {user?.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-card transition hover:bg-brand-600"
                    aria-label="Sign out"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <main className="space-y-10">
              {headerSlot && (
                <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-9 shadow-lg shadow-slate-200/40 backdrop-blur">
                  {headerSlot}
                </div>
              )}
              <div className="space-y-10">{children}</div>
            </main>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileNavOpen && (
          <Motion.div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
          >
            <Motion.div
              className="absolute left-0 top-0 h-full w-[260px] bg-white p-6 shadow-elevated"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="font-display text-lg font-semibold text-slate-900"
                >
                  CampusSetu
                </Link>
                <button
                  type="button"
                  className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 space-y-1">{renderNavigation()}</div>
              {footerSlot && (
                <div className="mt-8 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  {footerSlot}
                </div>
              )}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
