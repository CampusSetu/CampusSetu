import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/mockJobs";
import {
  getApplicationsByJob,
  patchApplicationStatus,
} from "../../api/mockApplications";
import ApplicantsTable from "../../components/ApplicantsTable";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";

export function Applicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const jobId = parseInt(id, 10);
    getJobById(jobId).then(setJob);
    getApplicationsByJob(jobId).then(setApps);
  }, [id]);

  const handleStatusChange = (appId, newStatus) => {
    patchApplicationStatus(appId, newStatus).then(() => {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    });
  };

  return (
    <DashboardLayout
      title="Applicants"
      navItems={dashboardNavConfig.recruiter}
      role="recruiter"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">
            Pipeline
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Applicants for {job ? `"${job.title}"` : `Job #${id}`}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review submissions, progress talent, and keep stakeholders informed.
          </p>
        </section>
        {apps.length ? (
          <ApplicantsTable
            applicants={apps}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="p-10 bg-white rounded-2xl text-center text-slate-600 shadow-card">
            <h3 className="text-xl font-semibold">No Applicants Found</h3>
            <p className="mt-2">There are currently no applicants for this job.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
