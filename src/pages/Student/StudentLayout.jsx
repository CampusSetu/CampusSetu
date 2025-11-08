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

  const headerSlot = (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
          Opportunity Hub
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "Welcome to CampusSetu"}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-500">
          Track every application, uncover tailored roles, and keep your profile polished for recruiters actively hiring across campuses.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
          <p className="text-xs uppercase tracking-wide text-slate-400">Overall CGPA</p>
          <p className="mt-1 text-2xl font-semibold text-brand-600">
            {user?.profile?.cgpa ? Number(user.profile.cgpa).toFixed(1) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
          <p className="text-xs uppercase tracking-wide text-slate-400">Skills Tracked</p>
          <p className="mt-1 text-2xl font-semibold text-brand-600">
            {user?.profile?.skills?.length ?? 0}
          </p>
        </div>
      </div>
    </div>
  );

  const footerSlot = (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Support
      </p>
      <p>Need help? Reach out to <span className="font-medium text-brand-600">placement@campussetu.com</span>.</p>
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
