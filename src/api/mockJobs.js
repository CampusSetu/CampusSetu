let jobs = null;

async function loadJobs() {
  if (jobs) return jobs;
  try {
    const response = await fetch('/src/data/jobs.json');
    if (!response.ok) throw new Error('Network response was not ok');
    jobs = await response.json();
    return jobs;
  } catch (error) {
    console.error('Failed to load jobs:', error);
    jobs = []; // Set to empty array on failure
    return jobs;
  }
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
