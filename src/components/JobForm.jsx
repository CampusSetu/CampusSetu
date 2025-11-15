import React, { useState } from "react";
import clsx from "clsx";

export default function JobForm({ onSubmit, initialData = {}, submitting }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    eligibility: initialData.eligibility || "",
    location: initialData.location || "",
    type: initialData.type || "Full-time",
    compensation: initialData.compensation || "",
    skills: (initialData.skills || []).join(", "),
    deadline: initialData.deadline || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  };

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

  const labelClass =
    "text-xs font-semibold uppercase tracking-[0.28em] text-slate-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass} htmlFor="title">
            Role Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
            className={fieldClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Remote / Bengaluru / Hybrid"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass} htmlFor="type">
            Engagement Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={clsx(fieldClass, "appearance-none")}
          >
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="compensation">
            Compensation / Stipend
          </label>
          <input
            id="compensation"
            name="compensation"
            value={form.compensation}
            onChange={handleChange}
            placeholder="₹ 12 LPA / ₹ 25,000 monthly"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass} htmlFor="eligibility">
            Eligibility Criteria
          </label>
          <input
            id="eligibility"
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange}
            placeholder="Minimum CGPA, backlogs, etc."
            className={fieldClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="deadline">
            Application Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass} htmlFor="skills">
          Key Skills
        </label>
        <input
          id="skills"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="React, Node.js, SQL"
          className={fieldClass}
        />
        <p className="text-xs text-slate-400">
          Comma separated values. Top skills appear on the student side first.
        </p>
      </div>

      <div className="space-y-2">
        <label className={labelClass} htmlFor="description">
          Description & Responsibilities
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Share the mission, day-to-day, and interview stages."
          className={clsx(fieldClass, "min-h-[140px]", "resize-y")}
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="reset"
          className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
        >
          Save Draft
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
