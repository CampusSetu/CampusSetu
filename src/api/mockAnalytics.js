import jobs from '../data/jobs.json';
import applications from '../data/applications.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

// This is a mock API. In a real app, this would be a backend service.

export const getAnalyticsData = async () => {
  // Simulate API delay
  await new Promise(res => setTimeout(res, 500));

  // 1. Key Performance Indicators (KPIs)
  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalCompanies = companies.length;

  // 2. Hiring Funnel Data
  const funnelData = [
    { stage: 'Applied', count: applications.length },
    { stage: 'Shortlisted', count: applications.filter(a => ['Shortlisted', 'Interview', 'Hired'].includes(a.status)).length },
    { stage: 'Interview', count: applications.filter(a => ['Interview', 'Hired'].includes(a.status)).length },
    { stage: 'Hired', count: applications.filter(a => a.status === 'Hired').length },
  ];

  // 3. Jobs by Location
  const jobsByLocationData = jobs.reduce((acc, job) => {
    const location = job.location || 'Not Specified';
    const existing = acc.find(item => item.type === location);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ type: location, value: 1 });
    }
    return acc;
  }, []);

  // 4. Placements by Department
  const hiredApplications = applications.filter(app => app.status === 'Hired');
  const placementsByDeptData = hiredApplications.reduce((acc, app) => {
    const student = users.find(u => u.id === app.userId);
    const department = student?.department || 'Other';
    const existing = acc.find(item => item.type === department);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ type: department, value: 1 });
    }
    return acc;
  }, []);

  // 5. Top Skills in Demand
  const topSkillsData = jobs.flatMap(job => job.skills).reduce((acc, skill) => {
    const existing = acc.find(item => item.name === skill);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: skill, value: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 15); // Top 15 skills

  return {
    kpis: {
      totalJobs,
      totalApplications,
      totalStudents,
      totalCompanies,
    },
    funnel: funnelData,
    jobsByLocation: jobsByLocationData,
    placementsByDept: placementsByDeptData,
    topSkills: topSkillsData,
  };
};
