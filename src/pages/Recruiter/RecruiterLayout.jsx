import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  HomeModernIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import DashboardShell from "../../components/layout/DashboardShell";
import { getJobs } from "../../api/mockJobs";

export function RecruiterLayout() {
  const { user, logout } = useAuth();
  const [jobMetrics, setJobMetrics] = useState({ live: 0, pending: 0 });
  const recruiterId = user?.id ?? 101;

  const navItems = useMemo(
    () => [
      { label: "Overview", to: "/recruiter/dashboard", icon: HomeModernIcon },
      { label: "Post a role", to: "/recruiter/post-job", icon: BoltIcon },
      {
        label: "My listings",
        to: "/recruiter/jobs",
        icon: ClipboardDocumentListIcon,
      },
      { label: "Talent pipeline", to: "/recruiter/jobs", icon: UserGroupIcon },
    ],
    []
  );

  useEffect(() => {
    let active = true;

    const captureMetrics = async () => {
      try {
        const roles = await getJobs({ postedBy: recruiterId });
        if (!active) return;
        const live = roles.filter((role) => role.approved).length;
        const pending = roles.length - live;
        setJobMetrics({ live, pending });
      } catch (error) {
        console.error("Failed to load recruiter metrics", error);
        if (active) {
          setJobMetrics({ live: 0, pending: 0 });
        }
      }
    };

    captureMetrics();

    return () => {
      active = false;
    };
  }, [recruiterId]);

  const headerSlot = (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/50 px-8 py-10 shadow-[0_40px_90px_-65px_rgba(15,23,42,0.55)]">
      <div className="pointer-events-none absolute -top-24 left-6 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="relative flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Recruiter workspace</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-[2.8rem]">
              {user?.name
                ? `Welcome back, ${user.name.split(" ")[0]}!`
                : "Your hiring control tower"}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              Launch new roles in minutes, monitor candidate traction, and stay
              in sync with placement teams across campus.
            </p>
            {user?.company && (
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                {user.company}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
            >
              Create a new role
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              Review pipeline
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Live roles
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {jobMetrics.live}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Approved and visible to students right now.
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Awaiting approval
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {jobMetrics.pending}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Placement team will nudge you for clarifications if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const footerSlot = (
    <div className="space-y-1 text-sm text-slate-500">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        Support
      </p>
      <p>
        Need a curated talent shortlist? Email{" "}
        <span className="font-medium text-brand-600">
          partners@campussetu.com
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
