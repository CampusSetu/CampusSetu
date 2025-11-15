import jobsData from '../data/jobs.json';

let jobs = [...jobsData];

async function loadJobs() {
  return jobs;
}

export const getJobs = async (filter = {}) => {
  await loadJobs();
  let filtered = jobs;
  if (filter.postedBy) {
    filtered = filtered.filter((j) => j.postedBy === filter.postedBy);
  }
  if (filter.approved) {
    filtered = filtered.filter((j) => j.approved);
  }
  if (filter._limit) {
    filtered = filtered.slice(0, filter._limit);
  }
  return Promise.resolve(filtered);
};

export const getJobById = async (id) => {
  await loadJobs();
  const job = jobs.find((j) => j.id === Number(id));
  return Promise.resolve(job);
};

export const createJob = async (job) => {
  await loadJobs();
  const newJob = {
    ...job,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  return Promise.resolve(newJob);
};

export const deleteJob = async (id) => {
  await loadJobs();
  jobs = jobs.filter((j) => j.id !== id);
  return Promise.resolve(true);
};

export const updateJob = async (id, updatedJob) => {
  await loadJobs();
  const index = jobs.findIndex((j) => j.id === Number(id));
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updatedJob };
    return Promise.resolve(jobs[index]);
  }
  return Promise.reject(new Error("Job not found"));
};

export const patchJobApproval = async (jobId, isApproved) => {
  await loadJobs();
  const index = jobs.findIndex((j) => j.id === Number(jobId));
  if (index !== -1) {
    jobs[index].approved = isApproved;
    return Promise.resolve(jobs[index]);
  }
  return Promise.reject(new Error("Job not found"));
};
