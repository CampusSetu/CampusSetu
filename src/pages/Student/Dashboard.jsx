import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  CursorArrowRippleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import FilterBar from "../../components/FilterBar";
import JobCard from "../../components/JobCard";
import Pagination from "../../components/Pagination";
import { getJobs } from "../../api/mockJobs";
import ApplyModal from "../../components/ApplyModal";

export function StudentDashboard() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setLoading(true);
    getJobs({ approved: true })
      .then(setAllJobs)
      .catch(() => setAllJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!allJobs?.length) return [];
    return allJobs.filter((job) => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(query);
        const matchesCompany = job.companyName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany) return false;
      }
      if (filters.company && job.companyName !== filters.company) return false;
      if (filters.location && job.location !== filters.location) return false;
      if (filters.type && job.type !== filters.type) return false;
      return true;
    });
  }, [allJobs, filters]);

  const total = filtered.length;
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const metrics = useMemo(() => {
    const internshipCount = filtered.filter((job) =>
      job.type?.toLowerCase().includes("intern")
    ).length;
    const remoteCount = filtered.filter((job) =>
      job.location?.toLowerCase().includes("remote")
    ).length;
    const topCompany = filtered[0]?.companyName || "Multiple partners";

    return [
      {
        label: "Active openings",
        value: total,
        icon: BriefcaseIcon,
      },
      {
        label: "Remote friendly",
        value: remoteCount,
        icon: CursorArrowRippleIcon,
      },
      {
        label: "Internships",
        value: internshipCount,
        icon: SparklesIcon,
      },
      {
        label: "Top hiring",
        value: topCompany,
        icon: BuildingOfficeIcon,
      },
    ];
  }, [filtered, total]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {label}
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {typeof value === "number" ? value : <span className="text-base">{value}</span>}
            </p>
          </div>
        ))}
      </section>

      <FilterBar onChange={setFilters} jobs={allJobs} />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Job feed</h2>
          <p className="text-xs text-slate-500">{total} curated opportunities based on your filters.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span>Approved roles only</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="card-elevated flex min-h-[220px] items-center justify-center text-sm text-slate-500">
          Loading jobs...
        </div>
      ) : total === 0 ? (
        <div className="card-elevated flex flex-col items-center justify-center gap-3 p-12 text-center text-slate-500">
          <p className="text-xl font-semibold text-slate-700">No roles match your filters yet</p>
          <p className="max-w-md text-sm">
            Adjust filters to broaden your search or check back soon as partner companies add fresh openings.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paged.map((job) => (
              <JobCard key={job.id} job={job} onApply={() => setSelectedJob(job)} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </>
      )}

      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplied={() => undefined}
        />
      )}
    </div>
  );
}

