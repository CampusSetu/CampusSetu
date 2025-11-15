import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UsersIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../../../components/Navbar";
import Button from "../../../components/Button";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../../components/dashboard/navConfig";
import MetricCard from "../../../components/dashboard/MetricCard";
import { useAuth } from "../../../contexts/AuthContext";
import { useUI } from "../../../contexts/UIContext";
import {
  getMentorshipRequests,
  getReferrals,
  getAlumniProfile,
} from "../../../api/mockAlumni";

export default function AlumniNetwork() {
  const { user } = useAuth();
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAlumni = user?.role === "alumni";

  useEffect(() => {
    if (!isAlumni) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [requestsData, referralsData, profileData] = await Promise.all([
          getMentorshipRequests(user?.id),
          getReferrals(user?.id),
          getAlumniProfile(user?.id),
        ]);

        setRequests(requestsData || []);
        setReferrals(referralsData || []);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load alumni data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, isAlumni]);

  const stats = useMemo(() => {
    const activeMentees = requests.filter((r) => r.status === "Accepted").length;
    const pendingRequests = requests.filter((r) => r.status === "Pending").length;
    const activeReferrals = referrals.filter((r) => r.status === "Active").length;

    return {
      activeMentees,
      pendingRequests,
      activeReferrals,
      totalReferrals: referrals.length,
    };
  }, [requests, referrals]);

  if (!isAlumni) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <Navbar />
        
        <main className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/" className="text-sm text-slate-500 hover:text-primary transition-colors">
              ← Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Core Feature
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Alumni Network & Mentorship
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              Connect with alumni for career guidance, job referrals, and industry insights through intelligent matching.
            </p>
          </div>

          {/* Feature Overview */}
          <div className="mb-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Bridge the Campus-Industry Gap
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Alumni Portal
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Alumni can post job openings, share industry insights, and give back to their alma mater by mentoring current students.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Smart Matching
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Get matched with alumni mentors based on your career interests, target companies, and professional goals for personalized guidance.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Job Referrals
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Access exclusive opportunities through alumni referrals at their organizations, significantly boosting your interview chances.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Career Pathways
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Learn from alumni career trajectories, understand different paths, and get advice on navigating your chosen field.
                </p>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Why This Matters
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Real-World Guidance
                </h3>
                <p className="text-sm text-slate-600">
                  Get practical career advice from people who have walked the same path and understand your challenges.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Accelerated Growth
                </h3>
                <p className="text-sm text-slate-600">
                  Skip years of trial and error by learning from alumni experiences and industry insights.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Powerful Network
                </h3>
                <p className="text-sm text-slate-600">
                  Build lasting professional relationships that extend beyond campus and throughout your career.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center shadow-soft">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              Connect with your alumni network
            </h2>
            <p className="mb-6 text-slate-600">
              Join CampusSetu to find mentors, access opportunities, and accelerate your career journey.
            </p>
            <Button onClick={openAuthModal} rightIcon={ArrowRightIcon}>
              Get Started
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Alumni Dashboard"
      navItems={dashboardNavConfig.alumni}
      role="alumni"
    >
      <div className="mb-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Welcome back, {profile?.name || user?.name || "Alumni"}! 👋
            </h2>
            <p className="mt-2 text-slate-600">
              {profile?.currentCompany || "Your alma mater"} • {profile?.graduationYear || "Class of 2020"}
            </p>
          </div>
          <button
            onClick={() => navigate("/alumni/profile")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Mentees"
          value={loading ? "..." : stats.activeMentees}
          icon={UsersIcon}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <MetricCard
          title="Pending Requests"
          value={loading ? "..." : stats.pendingRequests}
          icon={CalendarDaysIcon}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <MetricCard
          title="Active Referrals"
          value={loading ? "..." : stats.activeReferrals}
          icon={BriefcaseIcon}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <MetricCard
          title="Total Impact"
          value={loading ? "..." : stats.totalReferrals}
          icon={SparklesIcon}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Mentorship Requests</h3>
            <button
              onClick={() => navigate("/alumni/mentees")}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Loading...</p>
            ) : requests.filter((r) => r.status === "Pending").length === 0 ? (
              <p className="text-sm text-slate-500">No pending requests</p>
            ) : (
              requests
                .filter((r) => r.status === "Pending")
                .slice(0, 3)
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{request.studentName}</p>
                      <p className="text-xs text-slate-500">{request.interests?.slice(0, 2).join(", ")}</p>
                    </div>
                    <button className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100">
                      Review
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Your Referrals</h3>
            <button
              onClick={() => navigate("/alumni/referrals")}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Loading...</p>
            ) : referrals.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500 mb-3">No referrals posted yet</p>
                <button
                  onClick={() => navigate("/alumni/post-referral")}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
                >
                  Post Your First Referral
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              referrals.slice(0, 3).map((referral) => (
                <div key={referral.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{referral.title}</p>
                      <p className="text-xs text-slate-500">{referral.company} • {referral.location}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        referral.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => navigate("/alumni/post-referral")}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left hover:border-brand-300 hover:bg-brand-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
              <BriefcaseIcon className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Post a Referral</p>
              <p className="text-xs text-slate-500">Help students find jobs</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/alumni/mentees")}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">View Mentees</p>
              <p className="text-xs text-slate-500">Manage mentorships</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/alumni/profile")}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left hover:border-purple-300 hover:bg-purple-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
              <AcademicCapIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Update Profile</p>
              <p className="text-xs text-slate-500">Edit your information</p>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
