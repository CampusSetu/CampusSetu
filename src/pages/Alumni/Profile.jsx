import React, { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";
import { getAlumniById, updateAlumni } from "../../api/mockAlumni";
import TagInput from "../../components/TagInput";

// Field Component for consistent form styling
const Field = ({ label, description, children }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </label>
    {description && <p className="text-xs text-slate-400">{description}</p>}
    {children}
  </div>
);

export default function AlumniProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentCompany: "",
    currentPosition: "",
    location: "",
    department: "",
    graduationYear: "",
    expertise: [],
    mentorshipAreas: [],
    bio: "",
    linkedin: "",
    availability: "weekends",
    maxMentees: 3,
    isAvailableForMentorship: true,
  });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const alumniId = user?.id || 301;
        const data = await getAlumniById(alumniId);
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user?.id]);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const alumniId = user?.id || 301;
      await updateAlumni(alumniId, profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile" navItems={dashboardNavConfig.alumni} role="alumni">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile" navItems={dashboardNavConfig.alumni} role="alumni">
      <div className="space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Alumni Network
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Alumni Profile</h1>
            <p className="mt-3 text-sm text-slate-500">
              Manage your professional information and mentorship preferences
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full Name" description="Your complete name as you'd like it displayed.">
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>

                <Field label="Email" description="Your primary email address.">
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Department" description="Your department or field of study.">
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>

                <Field label="Graduation Year" description="When you graduated.">
                  <input
                    type="number"
                    value={profile.graduationYear}
                    onChange={(e) => handleChange('graduationYear', parseInt(e.target.value))}
                    placeholder="e.g., 2018"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>
              </div>

              <Field label="Bio" description="Tell students about yourself, your journey, and what you're passionate about.">
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  placeholder="Share your story..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                />
              </Field>
            </div>
          </section>

          {/* Professional Details */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Current Company" description="Where you're currently working.">
                  <input
                    type="text"
                    value={profile.currentCompany}
                    onChange={(e) => handleChange('currentCompany', e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>

                <Field label="Current Position" description="Your current role or title.">
                  <input
                    type="text"
                    value={profile.currentPosition}
                    onChange={(e) => handleChange('currentPosition', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Location" description="Where you're based.">
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Bangalore, India"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>

                <Field label="LinkedIn Profile" description="Your professional network link.">
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                  />
                </Field>
              </div>

              <Field label="Areas of Expertise" description="Add your key skills and domains of knowledge.">
                <TagInput
                  tags={profile.expertise || []}
                  onChange={(tags) => handleChange('expertise', tags)}
                  placeholder="Add expertise areas (press Enter after each)"
                />
              </Field>
            </div>
          </section>

          {/* Mentorship Preferences */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="space-y-6">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <input
                  type="checkbox"
                  id="available"
                  checked={profile.isAvailableForMentorship}
                  onChange={(e) => handleChange('isAvailableForMentorship', e.target.checked)}
                  className="h-5 w-5 rounded-md border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0"
                />
                <label htmlFor="available" className="text-sm font-semibold text-slate-900 cursor-pointer">
                  I'm available for mentorship
                </label>
              </div>

              {profile.isAvailableForMentorship && (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Maximum Mentees" description="How many students you can mentor at once.">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={profile.maxMentees}
                        onChange={(e) => handleChange('maxMentees', parseInt(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                      />
                    </Field>

                    <Field label="Availability" description="When you're typically available.">
                      <select
                        value={profile.availability}
                        onChange={(e) => handleChange('availability', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                      >
                        <option value="weekends">Weekends</option>
                        <option value="weekdays">Weekdays</option>
                        <option value="evenings">Evenings</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Mentorship Areas" description="What topics can you help students with?">
                    <TagInput
                      tags={profile.mentorshipAreas || []}
                      onChange={(tags) => handleChange('mentorshipAreas', tags)}
                      placeholder="e.g., Career Guidance, Interview Prep"
                    />
                  </Field>
                </>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                {saved && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="font-medium">Profile updated successfully!</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </section>
        </form>
      </div>
    </DashboardLayout>
  );
}
