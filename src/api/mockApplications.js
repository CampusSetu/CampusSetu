let applications = null;

async function loadApplications() {
  if (applications) return applications;
  try {
    const response = await fetch('/src/data/applications.json');
    if (!response.ok) throw new Error('Network response was not ok');
    applications = await response.json();
    return applications;
  } catch (error) {
    console.error('Failed to load applications:', error);
    applications = [];
    return applications;
  }
}

export const getApplications = async (studentId) => {
  await loadApplications();
  return applications.filter((app) => app.userId === studentId);
};

export const createApplication = async (newApp) => {
  await loadApplications();
  const id = applications.length
    ? Math.max(...applications.map((a) => a.id)) + 1
    : 1;
  const application = { id, ...newApp, appliedAt: new Date().toISOString() };
  applications.push(application);
  return application;
};

export const getApplicationsByJob = async (jobId) => {
  await loadApplications();
  return applications.filter((a) => a.jobId === jobId);
};

export const patchApplicationStatus = async (id, status) => {
  await loadApplications();
  const app = applications.find((a) => a.id === id);
  if (app) app.status = status;
  return app;
};

