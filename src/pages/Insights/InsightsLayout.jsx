import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SparklesIcon, ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useInsights } from "../../contexts/InsightsContext";

export default function InsightsLayout() {
  const { aggregates } = useInsights();
  const navigate = useNavigate();

  const headerActions = (
    <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
      <ArrowDownOnSquareIcon className="h-4 w-4" />
      Export report
    </button>
  );

  return (
    <DashboardLayout
      title="Insights Dashboard"
      navItems={dashboardNavConfig.insights}
      role="insights"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-slate-50 to-slate-100 px-8 py-10 shadow-[0_40px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="pointer-events-none absolute -top-24 left-6 h-56 w-56 rounded-full bg-slate-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-900" />
                Insights workspace
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Placement transparency for your entire campus
                </h1>
                <p className="text-sm leading-relaxed text-slate-600">
                  Monitor compensation signals, offer acceptance, and interview experience logs—all organized inside a calm dashboard shell shared with students, recruiters, and the CGC team.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/insights/explorer")}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20"
                >
                  <SparklesIcon className="h-4 w-4" />
                  Explore data
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/insights/share")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  Add experience
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-auto">
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Companies</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{aggregates?.companies ?? "—"}</p>
                <p className="mt-2 text-xs text-slate-500">Partner orgs tracked this term.</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Avg median CTC</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {aggregates?.avgCtc ? `${aggregates.avgCtc.toFixed(1)} LPA` : "—"}
                </p>
                <p className="mt-2 text-xs text-slate-500">Real offers validated by seniors.</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Offers tracked</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{aggregates?.totalOffers ?? "—"}</p>
                <p className="mt-2 text-xs text-slate-500">Across all programs.</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Acceptance rate</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {aggregates?.acceptanceRate ? `${aggregates.acceptanceRate}%` : "—"}
                </p>
                <p className="mt-2 text-xs text-slate-500">Signals hiring confidence.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <Outlet />
        </section>
      </div>
    </DashboardLayout>
  );
}
