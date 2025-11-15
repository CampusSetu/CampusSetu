import React from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";

export function ManageStudents() {
  return (
    <DashboardLayout
      title="Manage Students"
      navItems={dashboardNavConfig.placement}
      role="placement"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h1 className="text-3xl font-semibold text-slate-900">Bulk upload and manage student data</h1>
          <p className="mt-2 text-sm text-slate-500">
            Consolidate placement records, cohort information, and recruiter-ready resumes.
          </p>
        </section>
        <div className="p-10 bg-white rounded-2xl text-center text-slate-600 shadow-card">
          <h3 className="text-xl font-semibold">Coming soon</h3>
          <p className="mt-2">The interface for bulk student management will appear here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
