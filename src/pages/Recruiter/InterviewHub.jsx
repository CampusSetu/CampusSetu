import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import InterviewHubBoard from "../../components/interviews/InterviewHubBoard";
import { useAuth } from "../../contexts/AuthContext";
import {
  getRecruiterInterviewSchedule,
  getProgramsForJobs,
} from "../../api/mockInterviewSchedules";

export function RecruiterInterviewHub() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [blueprints, setBlueprints] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const recruiterId = user?.id || 101; // fallback for demo accounts
        const schedule = await getRecruiterInterviewSchedule(recruiterId);
        const jobIds = schedule.map((slot) => slot.jobId);
        const programs = jobIds.length ? await getProgramsForJobs(jobIds) : [];

        if (active) {
          setSlots(schedule);
          setBlueprints(programs);
        }
      } catch (error) {
        console.error("Failed to load recruiter interview schedule", error);
        if (active) {
          setSlots([]);
          setBlueprints([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user?.id]);

  return (
    <DashboardLayout
      title="Interview Hub"
      navItems={dashboardNavConfig.recruiter}
      role="recruiter"
    >
      <InterviewHubBoard
        role="recruiter"
        interviews={slots}
        programs={blueprints}
        loading={loading}
      />
    </DashboardLayout>
  );
}
