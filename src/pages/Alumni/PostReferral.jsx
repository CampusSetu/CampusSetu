import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";
import { createReferral } from "../../api/mockAlumniReferrals";
import TagInput from "../../components/TagInput";

const Field = ({ label, description, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </label>
    {description && <p className="text-xs text-slate-400">{description}</p>}
    {children}
  </div>
);

export default function PostReferral() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Internship",
    description: "",
    skills: [],
    minCgpa: "",
    eligibility: "",
    deadline: "",
    benefits: [],
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const alumniId = user?.id || 301;
      await createReferral({
        ...formData,
        referredBy: alumniId,
        minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : undefined,
      });

      setSubmitted(true);
      setTimeout(() => {
        navigate('/alumni/referrals');
      }, 2000);
    } catch (error) {
      console.error('Failed to create referral', error);
      alert('Failed to post referral. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout title="Post Referral" navItems={dashboardNavConfig.alumni} role="alumni">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircleIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Referral Posted Successfully!</h2>
            <p className="mt-2 text-sm text-slate-600">Redirecting to your referrals...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Post Referral" navItems={dashboardNavConfig.alumni} role="alumni">
      <div className="space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Alumni Referral
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Post a Job Referral</h1>
            <p className="mt-3 text-sm text-slate-500">
              Help students from your alma mater land opportunities at your company
            </p>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="space-y-6">
              <Field label="Job Title" description="Enter the role or position title.">
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Software Engineer Intern"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                />
              </Field>

              <Field label="Company" description="Your current organization.">
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Your company name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Location" description="Where is this role based?">
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Bangalore, India"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>

                <Field label="Job Type" description="Select employment type.">
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </Field>
              </div>

              <Field label="Job Description" description="Provide a detailed description of the role, responsibilities, and requirements.">
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={5}
                  placeholder="Describe the role..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                />
              </Field>

              <Field label="Required Skills" description="Add key skills required for this position.">
                <TagInput
                  tags={formData.skills}
                  onChange={(tags) => handleChange('skills', tags)}
                  placeholder="Add skills (press Enter after each)"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Minimum CGPA" description="Optional eligibility criteria.">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.minCgpa}
                    onChange={(e) => handleChange('minCgpa', e.target.value)}
                    placeholder="e.g., 7.5"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>

                <Field label="Application Deadline" description="Last date to apply for this role.">
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>
              </div>

              <Field label="Eligibility Criteria" description="Describe departments, year, or specific requirements.">
                <textarea
                  value={formData.eligibility}
                  onChange={(e) => handleChange('eligibility', e.target.value)}
                  rows={3}
                  placeholder="e.g., Open to all B.Tech final year students"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                />
              </Field>

              <Field label="Referral Benefits" description="What advantages do students get through your referral?">
                <TagInput
                  tags={formData.benefits}
                  onChange={(tags) => handleChange('benefits', tags)}
                  placeholder="Add benefits (e.g., Fast-track interview)"
                />
              </Field>
            </div>
          </section>

          {/* Submit Buttons */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/alumni/referrals')}
                className="flex-1 rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Posting...' : 'Post Referral'}
              </button>
            </div>
          </section>
        </form>
      </div>
    </DashboardLayout>
  );
}
