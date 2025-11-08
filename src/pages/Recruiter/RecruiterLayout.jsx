import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  HomeModernIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import DashboardShell from "../../components/layout/DashboardShell";

export function RecruiterLayout() {
  const { user, logout } = useAuth();

  const navItems = useMemo(
    () => [
      { label: "Overview", to: "/recruiter/dashboard", icon: HomeModernIcon },
      { label: "Post a role", to: "/recruiter/post-job", icon: BoltIcon },
      { label: "My listings", to: "/recruiter/jobs", icon: ClipboardDocumentListIcon },
      { label: "Talent pipeline", to: "/recruiter/jobs", icon: UserGroupIcon },
    ],
    []
  );

  const headerSlot = (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
          Recruiter Command
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Accelerate campus hiring momentum
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          Monitor role performance, manage applicant stages, and collaborate with CGC teams in real time.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Hiring sprint</p>
        <p className="mt-2">Boost conversion by sharing challenge statements or projects with shortlisted candidates.</p>
      </div>
    </div>
  );

  const footerSlot = (
    <div className="space-y-1 text-sm text-slate-500">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Support</p>
      <p>Need a curated talent shortlist? Email <span className="font-medium text-brand-600">partners@campussetu.com</span>.</p>
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
