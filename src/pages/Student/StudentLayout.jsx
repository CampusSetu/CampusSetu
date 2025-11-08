import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";
import {
  Squares2X2Icon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import DashboardShell from "../../components/layout/DashboardShell";

export function StudentLayout() {
  const { user, logout } = useAuth();

  const navItems = useMemo(
    () => [
      {
        label: "Job Feed",
        to: "/student/dashboard",
        icon: Squares2X2Icon,
      },
      {
        label: "My Applications",
        to: "/student/applications",
        icon: ClipboardDocumentCheckIcon,
      },
      {
        label: "My Profile",
        to: "/student/profile",
        icon: UserCircleIcon,
      },
    ],
    []
  );

  const skillsTracked = useMemo(() => {
    if (user?.skills?.length) return user.skills.length;
    if (user?.profile?.skills?.length) return user.profile.skills.length;
    return 0;
  }, [user]);

  const cgpaValue = user?.profile?.cgpa
    ? Number(user.profile.cgpa).toFixed(1)
    : "—";

  const profileStrength = Math.min(100, 48 + skillsTracked * 8);

  const headerSlot = (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-blue-50/80 to-indigo-100/60 px-8 py-10 shadow-[0_40px_90px_-65px_rgba(15,23,42,0.55)]">
      <div className="pointer-events-none absolute -top-32 left-8 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="relative flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Placement workspace</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {user?.name
                ? `Welcome back, ${user.name.split(" ")[0]}!`
                : "Your campus hiring hub"}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Visualise every opportunity, stay ahead of recruiter touchpoints,
              and submit polished applications without juggling spreadsheets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
            >
              Browse curated roles
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              Update profile
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Overall CGPA
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {cgpaValue}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Sync your semester results to keep this score current.
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Skills tracked
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {skillsTracked}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Profile strength</span>
                <span className="font-semibold text-slate-700">
                  {profileStrength}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const footerSlot = (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Support
      </p>
      <p>
        Need help? Reach out to{" "}
        <span className="font-medium text-brand-600">
          placement@campussetu.com
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
