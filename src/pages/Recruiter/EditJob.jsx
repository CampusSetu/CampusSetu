import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobForm from "../../components/JobForm";
import { getJobById, updateJob } from "../../api/mockJobs";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";

export function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobById(id).then(setJob);
  }, [id]);

  const handleSubmit = (updatedData) => {
    updateJob(id, { ...job, ...updatedData }).then(() => {
      alert("Job updated successfully");
      navigate("/recruiter/jobs");
    });
  };

  if (!job) {
    return (
      <DashboardLayout
        title="Edit Job"
        navItems={dashboardNavConfig.recruiter}
        role="recruiter"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-card">
          Loading job details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Job"
      navItems={dashboardNavConfig.recruiter}
      role="recruiter"
    >
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h1 className="text-3xl font-semibold text-slate-900">Update listing details</h1>
          <p className="mt-2 text-sm text-slate-500">
            Adjust role information, requirements, or compensation before sending to students.
          </p>
        </section>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <JobForm onSubmit={handleSubmit} initialData={job} />
        </div>
      </div>
    </DashboardLayout>
  );
}
