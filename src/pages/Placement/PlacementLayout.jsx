import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import DashboardShell from "../../components/layout/DashboardShell";

export function PlacementLayout() {
  const { user, logout } = useAuth();

  const navItems = useMemo(
    () => [
      { label: "Overview", to: "/placement/dashboard", icon: ChartBarSquareIcon },
      { label: "Job approvals", to: "/placement/approvals", icon: ClipboardDocumentCheckIcon },
      { label: "Students", to: "/placement/students", icon: AcademicCapIcon },
      { label: "External analytics", to: "/analytics", icon: GlobeAltIcon },
    ],
    []
  );

  const headerSlot = (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
          Placement Control
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Coordinate campus hiring with clarity</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-500">
          Approve recruiter requests, align departments, and track outcomes across batches with intelligence surfaced from our analytics hub.
        </p>
      </div>
      <div className="grid gap-3 text-sm">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Upcoming spotlight</p>
          <p className="mt-2 text-slate-700">TechnoWave Labs pre-placement talk • 28 Aug, 11:00 AM</p>
        </div>
      </div>
    </div>
  );

  const footerSlot = (
    <div className="space-y-1 text-sm text-slate-500">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Escalations</p>
      <p>Share recruiter SLA issues at <span className="font-medium text-brand-600">support@campussetu.com</span>.</p>
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
