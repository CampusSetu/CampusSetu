import jobsData from "../data/jobs.json";

let jobs = [...jobsData];

export const getJobs = async (filter = {}) => {
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
  const job = jobs.find((j) => j.id === Number(id));
  return Promise.resolve(job);
};

export const createJob = async (job) => {
  const newJob = {
    ...job,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  return Promise.resolve(newJob);
};

export const deleteJob = async (id) => {
  jobs = jobs.filter((j) => j.id !== id);
  return Promise.resolve(true);
};
