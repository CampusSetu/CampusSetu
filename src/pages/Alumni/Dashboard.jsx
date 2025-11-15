import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  UserGroupIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";
import { getMentorships } from "../../api/mockMentorships";
import { getAlumniReferrals } from "../../api/mockAlumniReferrals";
import { getAlumniById } from "../../api/mockAlumni";

const MetricCard = ({ icon: Icon, label, value, delta, helper }) => (
  <article className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-card">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-50 p-2.5">
          {Icon && <Icon className="h-5 w-5 text-brand-600" />}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
      {delta && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
          {delta}
        </span>
      )}
    </div>
    {helper && <p className="mt-3 text-xs text-slate-500">{helper}</p>}
  </article>
);

const MenteeCard = ({ mentorship }) => {
  const upcomingSession = mentorship.nextSessionDate
    ? new Date(mentorship.nextSessionDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Student #{mentorship.menteeId}</h4>
          <p className="mt-1 text-sm text-slate-600">
            {mentorship.sessions?.length || 0} sessions completed
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            mentorship.status === 'active'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {mentorship.status}
        </span>
      </div>
      
      {mentorship.goals && (
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Goals</p>
          <ul className="mt-2 space-y-1">
            {mentorship.goals.slice(0, 2).map((goal, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-brand-500">•</span>
                <span className="line-clamp-1">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {upcomingSession && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Next session: <span className="font-semibold text-slate-900">{upcomingSession}</span>
          </p>
        </div>
      )}
    </div>
  );
};

const ReferralCard = ({ referral }) => {
  const daysLeft = Math.ceil(
    (new Date(referral.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{referral.title}</h4>
          <p className="mt-1 text-sm text-slate-600">{referral.company}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          {referral.type}
        </span>
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <span>{referral.location}</span>
        <span>•</span>
        <span>{referral.applicationCount} applications</span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
        </span>
        <span className="text-xs font-semibold text-slate-900">
          {referral.referralCode}
        </span>
      </div>
    </div>
  );
};

export default function AlumniDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mentorships, setMentorships] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [alumniProfile, setAlumniProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const alumniId = user?.id || 301; // Default to first alumni for demo
        
        const [mentorshipData, referralData, profileData] = await Promise.all([
          getMentorships({ mentorId: alumniId }),
          getAlumniReferrals({ referredBy: alumniId }),
          getAlumniById(alumniId),
        ]);

        if (!cancelled) {
          setMentorships(mentorshipData);
          setReferrals(referralData);
          setAlumniProfile(profileData);
        }
      } catch (error) {
        console.error('Failed to load alumni dashboard', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const stats = useMemo(() => {
    const activeMentorships = mentorships.filter(m => m.status === 'active').length;
    const totalSessions = mentorships.reduce((sum, m) => sum + (m.sessions?.length || 0), 0);
    const activeReferrals = referrals.filter(r => r.status === 'active').length;
    const totalApplications = referrals.reduce((sum, r) => sum + (r.applicationCount || 0), 0);

    return [
      {
        icon: UserGroupIcon,
        label: 'Active Mentees',
        value: activeMentorships,
        delta: activeMentorships > 0 ? `${mentorships.length} total` : null,
        helper: alumniProfile ? `${alumniProfile.maxMentees - alumniProfile.currentMentees} slots available` : '',
      },
      {
        icon: AcademicCapIcon,
        label: 'Total Sessions',
        value: totalSessions,
        delta: totalSessions > 0 ? '+' + Math.round(totalSessions / Math.max(activeMentorships, 1)) + ' avg' : null,
        helper: 'Mentorship sessions conducted',
      },
      {
        icon: BriefcaseIcon,
        label: 'Active Referrals',
        value: activeReferrals,
        delta: null,
        helper: `${totalApplications} total applications received`,
      },
      {
        icon: SparklesIcon,
        label: 'Impact Score',
        value: Math.min(99, totalSessions * 3 + totalApplications),
        delta: '+12%',
        helper: 'Your contribution to student success',
      },
    ];
  }, [mentorships, referrals, alumniProfile]);

  const activityData = useMemo(() => {
    // Generate mock activity data for the chart
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      sessions: Math.floor(Math.random() * 5) + 1,
      applications: Math.floor(Math.random() * 8) + 2,
    })).slice(-6);
  }, []);

  if (loading) {
    return (
      <DashboardLayout
        title="Alumni Dashboard"
        navItems={dashboardNavConfig.alumni}
        role="alumni"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Alumni Dashboard"
      navItems={dashboardNavConfig.alumni}
      role="alumni"
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-brand-50 via-white to-slate-50 px-8 py-10 shadow-soft">
          <div className="pointer-events-none absolute -top-24 left-6 h-56 w-56 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-accent-200/20 blur-3xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Alumni Portal
            </div>
            
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              Welcome back, {alumniProfile?.name || 'Alumni'}! 👋
            </h1>
            
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {alumniProfile?.currentPosition} at {alumniProfile?.currentCompany} • 
              {alumniProfile?.yearsOfExperience} years of experience
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                <SparklesIcon className="h-4 w-4" />
                Find mentees
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">
                <BriefcaseIcon className="h-4 w-4" />
                Post referral
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, idx) => (
            <MetricCard key={idx} {...stat} />
          ))}
        </div>

        {/* Activity Chart */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Activity Trends</p>
            <h2 className="text-xl font-semibold text-slate-900">Your impact over time</h2>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4c72ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4c72ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f17816" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f17816" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#4c72ff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                  name="Sessions"
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#f17816"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                  name="Applications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active Mentees */}
          <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Active Mentees</h3>
                <p className="text-sm text-slate-500">{mentorships.filter(m => m.status === 'active').length} ongoing mentorships</p>
              </div>
              <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                View all →
              </button>
            </div>
            
            <div className="space-y-4">
              {mentorships.filter(m => m.status === 'active').slice(0, 3).map((mentorship) => (
                <MenteeCard key={mentorship.id} mentorship={mentorship} />
              ))}
              
              {mentorships.filter(m => m.status === 'active').length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">No active mentees yet</p>
                  <button className="mt-3 text-sm font-semibold text-brand-600">
                    Find students to mentor
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Active Referrals */}
          <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Your Referrals</h3>
                <p className="text-sm text-slate-500">{referrals.filter(r => r.status === 'active').length} active job postings</p>
              </div>
              <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                View all →
              </button>
            </div>
            
            <div className="space-y-4">
              {referrals.filter(r => r.status === 'active').slice(0, 3).map((referral) => (
                <ReferralCard key={referral.id} referral={referral} />
              ))}
              
              {referrals.filter(r => r.status === 'active').length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                  <BriefcaseIcon className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">No active referrals</p>
                  <button className="mt-3 text-sm font-semibold text-brand-600">
                    Post your first referral
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
