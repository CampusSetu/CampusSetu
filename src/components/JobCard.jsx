import React from "react";
import { motion as Motion } from "framer-motion";
import {
  MapPinIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";

const JobCard = ({ job, onApply }) => {
  const tags = job.skills?.slice(0, 4) ?? [];
  return (
    <Motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              {job.type || "Opportunity"}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              {job.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <BriefcaseIcon className="h-4 w-4" />
                {job.companyName}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {job.location}
              </span>
            </div>
          </div>
          {job.minCgpa && (
            <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-600">
              Min CGPA {job.minCgpa}
            </div>
          )}
        </div>
        <p className="text-sm text-slate-600 line-clamp-3">
          {job.shortDescription}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            Posted {job.postedAgo || "recently"}
          </div>
          <Button onClick={() => onApply(job)} rightIcon={ArrowRightIcon}>
            Apply now
          </Button>
        </div>
      </div>
    </Motion.article>
  );
};

export default JobCard;
