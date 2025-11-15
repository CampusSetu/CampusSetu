import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../../api/mockJobs";
import { JobListTable } from "../../components/JobListTable";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";

export function JobListings() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const recruiterId = user?.id ?? 101;
    getJobs({ postedBy: recruiterId }).then(setJobs);
  }, [user?.id]);

  const handleDelete = (id) => {
    deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <DashboardLayout
      title="My Job Listings"
      navItems={dashboardNavConfig.recruiter}
      role="recruiter"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h1 className="text-3xl font-semibold text-slate-900">Manage published opportunities</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review, edit, or retire live postings to keep the student feed fresh.
          </p>
        </section>
        {jobs.length ? (
          <JobListTable jobs={jobs} onDelete={handleDelete} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center text-slate-600">
            <h3 className="text-xl font-semibold text-slate-800">No roles yet</h3>
            <p className="mt-2 text-sm">
              Start by creating a new opportunity so students can discover your company.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
