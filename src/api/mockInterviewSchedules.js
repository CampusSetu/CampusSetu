import interviewSchedules from "../data/interviewSchedules.json";
import interviewPrograms from "../data/interviewPrograms.json";

const schedules = [...interviewSchedules];
const programs = [...interviewPrograms];

const delay = (duration = 120) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const sortByStart = (items) =>
  [...items].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

export const getStudentInterviewSchedule = async (studentId) => {
  await delay();
  if (!studentId) return [];
  return sortByStart(schedules.filter((slot) => slot.studentId === studentId));
};

export const getRecruiterInterviewSchedule = async (recruiterId) => {
  await delay();
  if (!recruiterId) return [];
  return sortByStart(
    schedules.filter((slot) => slot.recruiterId === recruiterId)
  );
};

export const getProgramsForJobs = async (jobIds = []) => {
  await delay(60);
  const uniqueIds = [...new Set(jobIds)].filter(Boolean);
  if (!uniqueIds.length) return [];
  return programs.filter((program) => uniqueIds.includes(program.jobId));
};

export const getProgramByJob = async (jobId) => {
  await delay(40);
  if (!jobId) return null;
  return programs.find((program) => program.jobId === jobId) || null;
};

export const upsertInterview = async (payload) => {
  // This is a mock helper to showcase API completeness for future wiring.
  // In a real backend this would persist changes; here we just echo back with an id.
  await delay(80);
  return {
    id: payload?.id || Date.now(),
    ...payload,
    lastUpdated: new Date().toISOString(),
  };
};
