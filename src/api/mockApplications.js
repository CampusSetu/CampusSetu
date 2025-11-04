import applications from "../data/applications.json";

let localApplications = [...applications];

export const getApplications = (studentId) => {
  return localApplications.filter((app) => app.userId === studentId);
};

// export const patchApplicationStatus = (id, status) => {
//   const index = localApplications.findIndex((a) => a.id === id);
//   if (index !== -1) {
//     localApplications[index].status = status;
//   }
//   return localApplications[index];
// };

// new addition
export const createApplication = (newApp) => {
  const id = localApplications.length
    ? Math.max(...localApplications.map((a) => a.id)) + 1
    : 1;
  const application = { id, ...newApp, appliedAt: new Date().toISOString() };
  localApplications.push(application);
  return application;
};

export const getApplicationsByJob = (jobId) => {
  return applications.filter((a) => a.jobId === jobId);
};

export const patchApplicationStatus = (id, status) => {
  const app = applications.find((a) => a.id === id);
  if (app) app.status = status;
  return app;
};

