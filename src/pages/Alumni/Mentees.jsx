import React, { useEffect, useState, useMemo } from "react";
import {
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  XMarkIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import { useAuth } from "../../contexts/AuthContext";
import { getMentorships, updateMentorship, createMentorship } from "../../api/mockMentorships";
import { getAlumni } from "../../api/mockAlumni";

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>
      {status === 'active' && <CheckCircleIcon className="h-3.5 w-3.5" />}
      {status === 'pending' && <ClockIcon className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
};

const MentorshipCard = ({ mentorship, onAccept, onViewDetails }) => {
  const sessionCount = mentorship.sessions?.length || 0;
  const lastSession = mentorship.sessions?.[sessionCount - 1];
  const nextSession = mentorship.nextSessionDate 
    ? new Date(mentorship.nextSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
              <span className="text-lg font-semibold text-brand-600">
                S{mentorship.menteeId}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Student #{mentorship.menteeId}</h3>
              <p className="text-sm text-slate-500">
                Matched on {new Date(mentorship.matchedOn).toLocaleDateString()}
              </p>
            </div>
          </div>

          {mentorship.matchReasons && mentorship.matchReasons.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Match Reasons
              </p>
              <div className="flex flex-wrap gap-2">
                {mentorship.matchReasons.map((reason, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs text-brand-700">
                    <SparklesIcon className="h-3 w-3" />
                    {reason}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Match Score: <span className="font-semibold text-brand-600">{mentorship.matchScore}%</span>
              </p>
            </div>
          )}

          {mentorship.goals && mentorship.goals.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Student Goals
              </p>
              <ul className="space-y-1.5">
                {mentorship.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <StatusBadge status={mentorship.status} />
          
          {sessionCount > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-500">Sessions</p>
              <p className="text-lg font-semibold text-slate-900">{sessionCount}</p>
            </div>
          )}
        </div>
      </div>

      {sessionCount > 0 && lastSession && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
            Last Session
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{lastSession.topic}</p>
              <p className="text-xs text-slate-500">
                {new Date(lastSession.date).toLocaleDateString()} • {lastSession.duration} min
              </p>
            </div>
            {lastSession.rating && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-amber-600">{lastSession.rating}</span>
                <span className="text-amber-400">★</span>
              </div>
            )}
          </div>
        </div>
      )}

      {nextSession && mentorship.status === 'active' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Next session: <span className="font-semibold text-slate-900">{nextSession}</span></span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {mentorship.status === 'pending' && (
          <button
            onClick={() => onAccept(mentorship.id)}
            className="flex-1 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Accept Mentorship
          </button>
        )}
        <button
          onClick={() => onViewDetails(mentorship)}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const MentorshipRequestModal = ({ isOpen, onClose, students, onMatch }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-elevated mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Find Students to Mentor</h2>
        <p className="text-sm text-slate-600 mb-6">
          Browse students looking for mentorship and create connections based on shared interests.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                selectedStudent?.id === student.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{student.name}</h4>
                  <p className="text-sm text-slate-600">{student.department}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {student.skills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedStudent?.id === student.id && (
                  <CheckCircleIcon className="h-6 w-6 text-brand-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedStudent) {
                onMatch(selectedStudent);
                onClose();
              }
            }}
            disabled={!selectedStudent}
            className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Mentorship Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AlumniMentees() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mentorships, setMentorships] = useState([]);
  const [students, setStudents] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, pending

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const alumniId = user?.id || 301;
        const [mentorshipData] = await Promise.all([
          getMentorships({ mentorId: alumniId }),
          getAlumni({ role: 'student' }), // This would actually fetch students, mocked for now
        ]);

        setMentorships(mentorshipData);
        // Mock student data
        setStudents([
          { id: 1, name: "Riya Sharma", department: "Computer Science", skills: ["React", "Node.js", "Python"] },
          { id: 2, name: "Arjun Mehta", department: "Mechanical", skills: ["CAD", "Manufacturing"] },
          { id: 3, name: "Ananya Verma", department: "Electronics", skills: ["IoT", "Embedded Systems"] },
        ]);
      } catch (error) {
        console.error('Failed to load mentorships', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.id]);

  const handleAcceptMentorship = async (mentorshipId) => {
    try {
      await updateMentorship(mentorshipId, { status: 'active' });
      // Reload data after accepting
      const alumniId = user?.id || 301;
      const mentorshipData = await getMentorships({ mentorId: alumniId });
      setMentorships(mentorshipData);
    } catch (error) {
      console.error('Failed to accept mentorship', error);
    }
  };

  const handleMatchStudent = async (student) => {
    try {
      const alumniId = user?.id || 301;
      await createMentorship({
        mentorId: alumniId,
        menteeId: student.id,
        matchScore: 85,
        matchReasons: ["Shared interests", "Career path alignment"],
        goals: ["Learn industry best practices", "Build professional network"],
      });
      // Reload data after creating mentorship
      const mentorshipData = await getMentorships({ mentorId: alumniId });
      setMentorships(mentorshipData);
    } catch (error) {
      console.error('Failed to create mentorship', error);
    }
  };

  const filteredMentorships = useMemo(() => {
    if (filter === 'all') return mentorships;
    return mentorships.filter(m => m.status === filter);
  }, [mentorships, filter]);

  const stats = useMemo(() => {
    const active = mentorships.filter(m => m.status === 'active').length;
    const pending = mentorships.filter(m => m.status === 'pending').length;
    const totalSessions = mentorships.reduce((sum, m) => sum + (m.sessions?.length || 0), 0);

    return { active, pending, totalSessions };
  }, [mentorships]);

  if (loading) {
    return (
      <DashboardLayout title="My Mentees" navItems={dashboardNavConfig.alumni} role="alumni">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Mentees" navItems={dashboardNavConfig.alumni} role="alumni">
      <div className="space-y-6">
        {/* Header Section */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Alumni Network
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Mentorship Overview</h1>
              <p className="mt-3 text-sm text-slate-500">
                Manage your mentees and track progress
              </p>
            </div>
            <button
              onClick={() => setShowMatchModal(true)}
              className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Find Mentees
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pending</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.pending}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Sessions</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.totalSessions}</p>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {['all', 'active', 'pending'].map((tab) => (
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
                    {tab === 'active' ? stats.active : stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Mentorships Grid */}
        {filteredMentorships.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredMentorships.map((mentorship) => (
              <MentorshipCard
                key={mentorship.id}
                mentorship={mentorship}
                onAccept={handleAcceptMentorship}
                onViewDetails={(m) => console.log('View details', m)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-12 text-center">
            <UserGroupIcon className="mx-auto h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">No mentees found</h3>
            <p className="mt-2 text-sm text-slate-600">
              {filter === 'all' 
                ? "Start mentoring students to make an impact"
                : `No ${filter} mentorships at the moment`}
            </p>
            <button
              onClick={() => setShowMatchModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              <SparklesIcon className="h-4 w-4" />
              Find Students to Mentor
            </button>
          </div>
        )}
      </div>

      <MentorshipRequestModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        students={students}
        onMatch={handleMatchStudent}
      />
    </DashboardLayout>
  );
}
