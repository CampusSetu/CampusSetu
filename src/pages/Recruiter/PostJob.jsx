import React from "react";
import JobForm from "../../components/JobForm";
import { createJob } from "../../api/mockJobs";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";

export function PostJob() {
  const { user } = useAuth();

  const handleSubmit = (job) => {
    const recruiterId = user?.id ?? 101;
    createJob({ ...job, postedBy: recruiterId });
    alert("Job posted successfully");
    // todo: redirect or clear form
  };

  return (
    <DashboardLayout
      title="Post a New Job"
      navItems={dashboardNavConfig.recruiter}
      role="recruiter"
    >
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h1 className="text-3xl font-semibold text-slate-900">Create a new opportunity</h1>
          <p className="mt-2 text-sm text-slate-500">
            Share role details, expectations, and logistics to reach qualified students instantly.
          </p>
        </section>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <JobForm onSubmit={handleSubmit} />
        </div>
      </div>
    </DashboardLayout>
  );
}
