import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getApplications } from "../../api/mockApplications";
import { getJobById } from "../../api/mockJobs";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowUpRightIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const StatusBadge = ({ status }) => {
  const variants = {
    Shortlisted: "bg-emerald-50 text-emerald-600",
    Pending: "bg-amber-50 text-amber-600",
    Rejected: "bg-rose-50 text-rose-600",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[status] || "bg-slate-100 text-slate-600"
      )}
    >
      {status}
    </span>
  );
};

export function StudentApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.id ?? 1;
    const fetchApplicationsData = async () => {
      const fetchedApplications = getApplications(studentId);
      const enrichedApplications = await Promise.all(
        fetchedApplications.map(async (application) => {
          const job = await getJobById(application.jobId);
          return {
            ...application,
            jobTitle: job?.title || "Unknown Job",
            companyName: job?.companyName || "Unknown Company",
          };
        })
      );
      setApps(enrichedApplications);
      setLoading(false);
    };

    fetchApplicationsData();
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = apps.length;
    const shortlisted = apps.filter((application) => application.status === "Shortlisted").length;
    const pending = apps.filter((application) => application.status === "Pending").length;
    return [
      { label: "Total", value: total },
      { label: "Shortlisted", value: shortlisted },
      { label: "Pending", value: pending },
    ];
  }, [apps]);

  return (
    <div className="space-y-6">
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
              Tracker
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Application pulse</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Stay aligned with recruiter responses, follow up on pending rounds, and keep momentum across every active pipeline.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {stats.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="card-elevated flex min-h-[220px] items-center justify-center text-sm text-slate-500">
          Loading applications...
        </div>
      ) : apps.length === 0 ? (
        <div className="card-elevated flex flex-col items-center gap-3 p-10 text-center text-slate-500">
          <BriefcaseIcon className="h-10 w-10 text-brand-400" />
          <p className="text-xl font-semibold text-slate-700">No applications yet</p>
          <p className="text-sm max-w-md">
            You have not applied to any opportunities. Explore the job feed to find internships and roles tailored to you.
          </p>
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Find opportunities
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3">Job title</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Applied on</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((application, index) => (
                <tr
                  key={application.id}
                  className={clsx(
                    "border-b border-slate-100 text-sm transition hover:bg-slate-50",
                    index % 2 === 1 && "bg-slate-50/60"
                  )}
                >
                  <td className="px-5 py-4 font-semibold text-slate-800">{application.jobTitle}</td>
                  <td className="px-5 py-4">{application.companyName}</td>
                  <td className="px-5 py-4">{new Date(application.appliedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/jobs/${application.jobId}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
                    >
                      View job
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

