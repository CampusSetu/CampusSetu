import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import DashboardShell from "../../components/layout/DashboardShell";
import { getRecruitmentHistory } from "../../api/mockRecruitmentHistory";

export function PlacementLayout() {
  const { user, logout } = useAuth();
  const [seasonStats, setSeasonStats] = useState({
    placements: 0,
    successRate: 0,
    companies: 0,
    spotlight: "",
  });

  const navItems = useMemo(
    () => [
      {
        label: "Overview",
        to: "/placement/dashboard",
        icon: ChartBarSquareIcon,
      },
      {
        label: "Job approvals",
        to: "/placement/approvals",
        icon: ClipboardDocumentCheckIcon,
      },
      { label: "Students", to: "/placement/students", icon: AcademicCapIcon },
      { label: "External analytics", to: "/analytics", icon: GlobeAltIcon },
    ],
    []
  );

  useEffect(() => {
    let active = true;

    const extractSeasonStats = async () => {
      try {
        const data = await getRecruitmentHistory();
        if (!active) return;
        const years = data?.years ?? [];
        const latestYear = years.length ? years[years.length - 1] : null;
        const yearlyEntry = latestYear
          ? data.yearlyStats.find((item) => item.year === latestYear)
          : null;
        const placements = yearlyEntry?.totalPlacements ?? 0;
        const successRate = Math.round((yearlyEntry?.successRate ?? 0) * 100);
        const companies = yearlyEntry?.companiesVisited ?? 0;
        const spotlight = data?.companies?.[0]?.name
          ? `${data.companies[0].name} campus drive confirmed`
          : "Placement season underway";
        setSeasonStats({ placements, successRate, companies, spotlight });
      } catch (error) {
        console.error("Failed to load placement metrics", error);
        if (active) {
          setSeasonStats({
            placements: 0,
            successRate: 0,
            companies: 0,
            spotlight: "",
          });
        }
      }
    };

    extractSeasonStats();

    return () => {
      active = false;
    };
  }, []);

  const headerSlot = (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-sky-50/75 to-indigo-100/50 px-8 py-10 shadow-[0_40px_90px_-65px_rgba(15,23,42,0.55)]">
      <div className="pointer-events-none absolute -top-24 left-10 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-4 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="relative flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>Placement command</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-[2.8rem]">
              Coordinate placements with confidence
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              Align recruiters and departments, streamline approvals, and
              surface the insights your leadership needs every morning.
            </p>
            {seasonStats.spotlight && (
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                {seasonStats.spotlight}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
            >
              Review approvals
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              Open analytics
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Offers secured
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {seasonStats.placements}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Across the latest placement cycle.
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Success rate
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {seasonStats.successRate}%
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Candidates matching recruiter benchmarks.
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Companies confirmed
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {seasonStats.companies}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Signed up for this season's interviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const footerSlot = (
    <div className="space-y-1 text-sm text-slate-500">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Escalations
      </p>
      <p>
        Share recruiter SLA issues at{" "}
        <span className="font-medium text-brand-600">
          support@campussetu.com
        </span>
        .
      </p>
    </div>
  );

  return (
    <DashboardShell
      navItems={navItems}
      user={user}
      onSignOut={logout}
      headerSlot={headerSlot}
      footerSlot={footerSlot}
    >
      <Outlet />
    </DashboardShell>
  );
}
