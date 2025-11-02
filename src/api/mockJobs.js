import jobs from "../data/jobs.json";

export async function getJobs(params = {}) {
  // params: { approved = true, _limit }
  const { approved = true, _limit } = params;
  let res = jobs.slice();

  if (approved) res = res.filter((j) => j.approved === true);
  if (_limit && Number.isFinite(Number(_limit)))
    res = res.slice(0, Number(_limit));
  // simulate async behaviour
  return new Promise((resolve) => setTimeout(() => resolve(res), 120));
}

export async function getJobById(id) {
  const job = jobs.find((j) => Number(j.id) === Number(id));
  return new Promise((resolve) => setTimeout(() => resolve(job || null), 80));
}

export const createJob = (job) => {
  const id = jobs.length ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;
  const newJob = { id, ...job, createdAt: new Date().toISOString() };
  jobs.push(newJob);
  return newJob;
};
