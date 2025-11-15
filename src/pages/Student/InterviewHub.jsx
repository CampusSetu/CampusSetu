import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { dashboardNavConfig } from "../../components/dashboard/navConfig";
import InterviewHubBoard from "../../components/interviews/InterviewHubBoard";
import { useAuth } from "../../contexts/AuthContext";
import {
  getStudentInterviewSchedule,
  getProgramsForJobs,
} from "../../api/mockInterviewSchedules";

export default function StudentInterviewHub() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [blueprints, setBlueprints] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const studentId = user?.id || 1; // Demo fallback for unauthenticated preview
        const schedule = await getStudentInterviewSchedule(studentId);
        const jobIds = schedule.map((slot) => slot.jobId);
        const programs = jobIds.length ? await getProgramsForJobs(jobIds) : [];

        if (active) {
          setSlots(schedule);
          setBlueprints(programs);
        }
      } catch (error) {
        console.error("Failed to load student interview schedule", error);
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
      navItems={dashboardNavConfig.student}
      role="student"
    >
      <InterviewHubBoard
        role="student"
        interviews={slots}
        programs={blueprints}
        loading={loading}
      />
    </DashboardLayout>
  );
}
