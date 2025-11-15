import React, { useEffect, useState } from "react";
import {
  SparklesIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BriefcaseIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";
import { getAlumni } from "../../api/mockAlumni";
import { getMentorships, createMentorship } from "../../api/mockMentorships";
import { getAlumniReferrals } from "../../api/mockAlumniReferrals";

const AlumniCard = ({ alumni, onRequestMentorship, onViewReferrals }) => {
  return (
    <div className="card-elevated p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold flex-shrink-0">
          {alumni.name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{alumni.name}</h3>
          <p className="text-sm text-slate-600">{alumni.currentPosition}</p>
          <p className="text-sm text-slate-900 font-medium">{alumni.currentCompany}</p>
          
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="h-3.5 w-3.5" />
              {alumni.location}
            </span>
            <span>•</span>
            <span>{alumni.department}</span>
            <span>•</span>
            <span>Class of {alumni.graduationYear}</span>
          </div>

          {alumni.bio && (
            <p className="mt-3 text-sm text-slate-600 line-clamp-2">{alumni.bio}</p>
          )}

          {alumni.expertise && alumni.expertise.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {alumni.expertise.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {alumni.mentorshipAreas && alumni.mentorshipAreas.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                Can help with
              </p>
              <div className="flex flex-wrap gap-1.5">
                {alumni.mentorshipAreas.map((area, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <SparklesIcon className="h-3 w-3" />
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            {alumni.isAvailableForMentorship && (
              <button
                onClick={() => onRequestMentorship(alumni)}
                className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-colors"
              >
                Request Mentorship
              </button>
            )}
            <button
              onClick={() => onViewReferrals(alumni)}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 transition-colors"
            >
              View Referrals
            </button>
          </div>

          {!alumni.isAvailableForMentorship && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              Not currently available for mentorship
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReferralCard = ({ referral, onApply }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{referral.title}</h4>
          <p className="text-sm text-slate-600">{referral.company}</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {referral.type}
        </span>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {referral.skills?.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={() => onApply(referral)}
        className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-colors"
      >
        Apply with Referral
      </button>
    </div>
  );
};

export default function StudentMentorshipHub() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alumni, setAlumni] = useState([]);
  const [myMentorships, setMyMentorships] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [alumniReferrals, setAlumniReferrals] = useState([]);
  const [filter, setFilter] = useState('all'); // all, available, my-department

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const studentId = user?.id || 1;
        
        const [alumniData, mentorshipData] = await Promise.all([
          getAlumni(),
          getMentorships({ menteeId: studentId }),
        ]);

        setAlumni(alumniData);
        setMyMentorships(mentorshipData);
      } catch (error) {
        console.error('Failed to load mentorship data', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  const handleRequestMentorship = async (alumnus) => {
    try {
      const studentId = user?.id || 1;
      await createMentorship({
        mentorId: alumnus.id,
        menteeId: studentId,
        matchScore: 85,
        matchReasons: ["Interested in " + alumnus.expertise[0], "Career path alignment"],
        goals: ["Learn from industry experience", "Build professional network"],
      });
      
      // Reload mentorships
      const mentorshipData = await getMentorships({ menteeId: studentId });
      setMyMentorships(mentorshipData);
      
      alert('Mentorship request sent successfully!');
    } catch (error) {
      console.error('Failed to request mentorship', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const handleViewReferrals = async (alumnus) => {
    try {
      const referrals = await getAlumniReferrals({ referredBy: alumnus.id });
      setAlumniReferrals(referrals);
      setSelectedAlumni(alumnus);
    } catch (error) {
      console.error('Failed to load referrals', error);
    }
  };

  const filteredAlumni = alumni.filter(a => {
    if (filter === 'available') return a.isAvailableForMentorship;
    if (filter === 'my-department') return a.department === user?.department;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout title="Alumni Network" navItems={dashboardNavConfig.student} role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Alumni Network" navItems={dashboardNavConfig.student} role="student">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/50 px-8 py-10 shadow-[0_40px_90px_-65px_rgba(15,23,42,0.55)]">
          <div className="pointer-events-none absolute -top-24 left-6 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <UserGroupIcon className="h-3.5 w-3.5" />
              Alumni Network
            </div>
            
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Connect with Alumni Mentors
            </h1>
            
            <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-2xl">
              Get guidance from experienced alumni, discover job referrals, and accelerate your career growth
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Alumni
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{alumni.length}</p>
                <p className="mt-2 text-xs text-slate-500">
                  From your college network
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Available Mentors
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {alumni.filter(a => a.isAvailableForMentorship).length}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Ready to guide you right now
                </p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  My Mentorships
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{myMentorships.length}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Active connections
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="card-elevated p-6">
          <div className="flex flex-wrap items-center gap-3">
            {['all', 'available', 'my-department'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                type="button"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* Alumni Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredAlumni.map((alumnus) => (
            <AlumniCard
              key={alumnus.id}
              alumni={alumnus}
              onRequestMentorship={handleRequestMentorship}
              onViewReferrals={handleViewReferrals}
            />
          ))}
        </div>

        {/* Referrals Modal */}
        {selectedAlumni && alumniReferrals.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-elevated max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedAlumni(null);
                  setAlumniReferrals([]);
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Referrals from {selectedAlumni.name}
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Apply to these positions with a strong alumni referral
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {alumniReferrals.map((referral) => (
                  <ReferralCard
                    key={referral.id}
                    referral={referral}
                    onApply={(r) => console.log('Apply to', r)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
