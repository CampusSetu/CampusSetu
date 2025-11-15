import React, { useEffect, useState, useMemo } from "react";
import {
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";
import { getAlumniReferrals } from "../../api/mockAlumniReferrals";

const ReferralCard = ({ referral, onView }) => {
  const daysLeft = Math.ceil(
    (new Date(referral.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const isExpired = daysLeft < 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
              <BriefcaseIcon className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{referral.title}</h3>
              <p className="text-sm text-slate-600">{referral.company}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4" />
              {referral.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserGroupIcon className="h-4 w-4" />
              {referral.applicationCount} applications
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {referral.skills?.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
            referral.type === 'Internship'
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {referral.type}
        </span>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">Referral Code</p>
            <code className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-mono font-semibold text-slate-900">
              {referral.referralCode}
            </code>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Deadline</p>
            <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-slate-900'}`}>
              {isExpired ? 'Expired' : `${daysLeft} days left`}
            </p>
          </div>
        </div>
      </div>

      {referral.benefits && referral.benefits.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Benefits
          </p>
          <ul className="space-y-1">
            {referral.benefits.slice(0, 2).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <ArrowTrendingUpIcon className="h-3.5 w-3.5 text-brand-500 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onView(referral)}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          View Details
        </button>
        <button className="flex-1 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
          Share Link
        </button>
      </div>
    </div>
  );
};

export default function AlumniReferrals() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, expired

  useEffect(() => {
    async function loadReferrals() {
      setLoading(true);
      try {
        const alumniId = user?.id || 301;
        const data = await getAlumniReferrals({ referredBy: alumniId });
        setReferrals(data);
      } catch (error) {
        console.error('Failed to load referrals', error);
      } finally {
        setLoading(false);
      }
    }

    loadReferrals();
  }, [user?.id]);

  const filteredReferrals = useMemo(() => {
    if (filter === 'all') return referrals;
    if (filter === 'active') {
      return referrals.filter(r => {
        const daysLeft = Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft >= 0;
      });
    }
    if (filter === 'expired') {
      return referrals.filter(r => {
        const daysLeft = Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft < 0;
      });
    }
    return referrals;
  }, [referrals, filter]);

  const stats = useMemo(() => {
    const active = referrals.filter(r => {
      const daysLeft = Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft >= 0;
    }).length;
    const totalApplications = referrals.reduce((sum, r) => sum + (r.applicationCount || 0), 0);

    return { active, totalApplications, total: referrals.length };
  }, [referrals]);

  if (loading) {
    return (
      <DashboardLayout title="Job Referrals" navItems={dashboardNavConfig.alumni} role="alumni">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Job Referrals" navItems={dashboardNavConfig.alumni} role="alumni">
      <div className="space-y-6">
        {/* Header Section */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Alumni Network
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">My Referrals</h1>
              <p className="mt-3 text-sm text-slate-500">
                Jobs you've posted for campus students
              </p>
            </div>
            <button
              onClick={() => navigate('/alumni/post-referral')}
              className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              + Post New Referral
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Referrals</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Roles</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Applications</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalApplications}</p>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {['all', 'active', 'expired'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold capitalize ${
                  filter === tab
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
                {tab !== 'all' && (
                  <span className="rounded-full bg-white/20 px-2 text-xs">
                    {tab === 'active' ? stats.active : stats.total - stats.active}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Referrals Grid */}
        {filteredReferrals.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredReferrals.map((referral) => (
              <ReferralCard
                key={referral.id}
                referral={referral}
                onView={(r) => console.log('View details', r)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-12 text-center">
            <BriefcaseIcon className="mx-auto h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">No referrals yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              {filter === 'all'
                ? "Start by posting your first job referral"
                : `No ${filter} referrals at the moment`}
            </p>
            <button
              onClick={() => navigate('/alumni/post-referral')}
              className="mt-6 rounded-2xl border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              + Post Your First Referral
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
