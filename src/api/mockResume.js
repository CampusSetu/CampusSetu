import resumeSeed from "../data/resumeProfiles.json";
import skillSignals from "../data/skillSignals.json";
import jobsData from "../data/jobs.json";
import users from "../data/users.json";

const RESUME_KEY = "cs_resume_profiles_v1";

const delay = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value = "") => value.trim().toLowerCase();

const loadProfiles = () => {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    localStorage.setItem(RESUME_KEY, JSON.stringify(resumeSeed));
    return [...resumeSeed];
  } catch (error) {
    console.warn("Resume store unavailable, using seed", error);
    return [...resumeSeed];
  }
};

const persistProfiles = (profiles) => {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.warn("Unable to persist resume profiles", error);
  }
};

const ensureProfile = (profiles, userId) => {
  const existing = profiles.find((profile) => profile.userId === userId);
  if (existing) return existing;
  const user = users.find((item) => item.id === userId) || {};
  const template = {
    userId,
    headline: `${user.name || "Student"} · Emerging Professional`,
    summary:
      "Draft your story—highlight impact, metrics, and the skills you love using.",
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: user.skills || [],
    resumeFile: null,
    lastUpdated: new Date().toISOString(),
  };
  profiles.push(template);
  persistProfiles(profiles);
  return template;
};

const calculateMatchScore = (profile, job) => {
  const jobSkills = (job.skills || []).map(normalize);
  const resumeSkills = new Set((profile.skills || []).map(normalize));
  const overlap = jobSkills.filter((skill) => resumeSkills.has(skill));
  const missing = jobSkills.filter((skill) => !resumeSkills.has(skill));
  const coverage = jobSkills.length ? overlap.length / jobSkills.length : 0;
  const summaryBoost = profile.summary?.length > 80 ? 10 : 0;
  const projectsBoost = profile.projects?.length ? 8 : 0;
  const experienceBoost = profile.experience?.length ? 7 : 0;
  const rawScore = Math.round(
    coverage * 70 + summaryBoost + projectsBoost + experienceBoost
  );
  const score = Math.min(100, Math.max(25, rawScore));

  const missingSkills = missing.map(
    (skill) => job.skills?.find((item) => normalize(item) === skill) || skill
  );

  const overlapSkills = overlap.map(
    (skill) => job.skills?.find((item) => normalize(item) === skill) || skill
  );

  const recommendation = missingSkills.length
    ? `Add ${missingSkills.slice(0, 2).join(", ")} to strengthen this match.`
    : "Great alignment—highlight quantified impact for this role.";

  return {
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.companyName,
    location: job.location,
    score,
    overlapSkills,
    missingSkills,
    recommendation,
    type: job.type,
  };
};

const generateInsights = (profile, matches) => {
  const insights = new Set();
  if (!profile.summary || profile.summary.length < 120) {
    insights.add(
      "Expand your summary to ~3 sentences with metrics and value props."
    );
  }
  if (!profile.projects?.length) {
    insights.add(
      "Add at least one project with problem, action, and measurable impact."
    );
  }
  if (!profile.experience?.length) {
    insights.add(
      "Log internship or freelance experience—even campus roles count."
    );
  }

  const missingCounts = {};
  matches.forEach((match) => {
    match.missingSkills.forEach((skill) => {
      const key = skill.toLowerCase();
      missingCounts[key] = (missingCounts[key] || 0) + 1;
    });
  });
  const sortedGaps = Object.entries(missingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => skill);
  sortedGaps.forEach((gap) =>
    insights.add(`Upskill on ${gap} to unlock more shortlisted roles.`)
  );

  return Array.from(insights);
};

export const getResumeProfile = async (userId) => {
  await delay();
  const profiles = loadProfiles();
  return ensureProfile(profiles, userId);
};

export const saveResumeProfile = async (userId, updates) => {
  await delay(120);
  const profiles = loadProfiles();
  const profile = ensureProfile(profiles, userId);
  const next = {
    ...profile,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  const index = profiles.findIndex((item) => item.userId === userId);
  profiles[index] = next;
  persistProfiles(profiles);
  return next;
};

export const uploadResumeFile = async (userId, fileData) => {
  return saveResumeProfile(userId, { resumeFile: fileData });
};

export const getSkillSignals = async () => {
  await delay(80);
  return skillSignals;
};

export const getCompatibilityReport = async (userId) => {
  await delay(140);
  const profile = await getResumeProfile(userId);
  const eligibleJobs = jobsData.filter((job) => job.approved);
  const matches = eligibleJobs.map((job) => calculateMatchScore(profile, job));
  const sortedMatches = matches.sort((a, b) => b.score - a.score).slice(0, 6);
  const insights = generateInsights(profile, sortedMatches);
  const avgScore =
    sortedMatches.reduce((total, match) => total + match.score, 0) /
    (sortedMatches.length || 1);
  return {
    matches: sortedMatches,
    insights,
    averageScore: Math.round(avgScore),
  };
};

export const getResumeRepository = async () => {
  await delay(100);
  const profiles = loadProfiles();
  return profiles.map((profile) => ({
    ...profile,
    totalSkills: profile.skills?.length || 0,
    totalProjects: profile.projects?.length || 0,
  }));
};
