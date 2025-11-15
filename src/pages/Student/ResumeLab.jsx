import React, { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import ResumeBuilder from "../../components/resume/ResumeBuilder";
import ResumeUploadCard from "../../components/resume/ResumeUploadCard";
import SkillSignalsPanel from "../../components/resume/SkillSignalsPanel";
import CompatibilityReport from "../../components/resume/CompatibilityReport";
import { useAuth } from "../../contexts/AuthContext";
import {
  getResumeProfile,
  saveResumeProfile,
  uploadResumeFile,
  getSkillSignals,
  getCompatibilityReport,
} from "../../api/mockResume";

function LoadingState() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-3xl bg-slate-200/70"
        />
      ))}
    </div>
  );
}

export default function ResumeLab() {
  const { user } = useAuth();
  const userId = user?.id || 1;
  const [profile, setProfile] = useState(null);
  const [skillSignals, setSkillSignals] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [resumeData, signals, compatibility] = await Promise.all([
        getResumeProfile(userId),
        getSkillSignals(),
        getCompatibilityReport(userId),
      ]);
      setProfile(resumeData);
      setSkillSignals(signals);
      setReport(compatibility);
    } catch (error) {
      console.error("Failed to load resume lab", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      const updated = await saveResumeProfile(userId, payload);
      setProfile(updated);
      const compatibility = await getCompatibilityReport(userId);
      setReport(compatibility);
    } catch (error) {
      console.error("Failed to save resume", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (fileData) => {
    try {
      const updated = await uploadResumeFile(userId, fileData);
      setProfile(updated);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const skillCoverage = useMemo(() => profile?.skills?.length || 0, [profile]);

  return (
    <DashboardLayout
      title="Resume Lab"
      navItems={dashboardNavConfig.student}
      role="student"
    >
      {loading || !profile ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/50 p-8 shadow-lg shadow-blue-500/5">
            {/* Decorative blur effects */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-200/35 blur-3xl" />
            
            <div className="relative flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Resume Intelligence
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {user?.name
                    ? `${user.name.split(" ")[0]}, your resume signal`
                    : "Your resume signal"}
                </h1>
                <p className="text-sm text-slate-600">
                  Keep your profile tailored for every shortlist—builder,
                  upload, and insights in one view.
                </p>
              </div>
              <div className="ml-auto flex gap-4 text-center">
                <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur px-5 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Skills logged
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {skillCoverage}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur px-5 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Avg score
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {report?.averageScore || 0}%
                  </p>
                </div>
              </div>
            </div>
          </section>

          <ResumeUploadCard
            lastUpdated={profile.lastUpdated}
            resumeFile={profile.resumeFile}
            onUpload={handleUpload}
          />

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <ResumeBuilder
              profile={profile}
              onSave={handleSave}
              saving={saving}
            />
            <SkillSignalsPanel
              data={skillSignals}
              selectedSkills={profile.skills}
            />
          </div>

          <CompatibilityReport report={report} />
        </div>
      )}
    </DashboardLayout>
  );
}
