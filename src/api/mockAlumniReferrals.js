import referralsData from '../data/alumniReferrals.json';

const REFERRALS_KEY = 'cs_alumni_referrals';

async function loadReferrals() {
  const raw = localStorage.getItem(REFERRALS_KEY);
  if (raw) return JSON.parse(raw);
  
  localStorage.setItem(REFERRALS_KEY, JSON.stringify(referralsData));
  return referralsData;
}

function saveReferrals(referrals) {
  localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
}

export async function getAlumniReferrals(filters = {}) {
  await new Promise(r => setTimeout(r, 150));
  let referrals = await loadReferrals();
  
  if (filters.referredBy) {
    referrals = referrals.filter(r => r.referredBy === filters.referredBy);
  }
  
  if (filters.status) {
    referrals = referrals.filter(r => r.status === filters.status);
  }
  
  if (filters.company) {
    referrals = referrals.filter(r => 
      r.company.toLowerCase().includes(filters.company.toLowerCase())
    );
  }
  
  return referrals;
}

export async function getReferralById(id) {
  await new Promise(r => setTimeout(r, 100));
  const referrals = await loadReferrals();
  return referrals.find(r => r.id === id);
}

export async function createReferral(data) {
  await new Promise(r => setTimeout(r, 150));
  const referrals = await loadReferrals();
  
  const newId = referrals.length > 0 ? Math.max(...referrals.map(r => r.id)) + 1 : 1;
  const newJobId = 1000 + newId;
  
  const newReferral = {
    id: newId,
    jobId: newJobId,
    ...data,
    postedOn: new Date().toISOString(),
    applicationCount: 0,
    status: 'active',
  };
  
  referrals.push(newReferral);
  saveReferrals(referrals);
  return newReferral;
}

export async function updateReferral(id, updates) {
  await new Promise(r => setTimeout(r, 120));
  const referrals = await loadReferrals();
  const index = referrals.findIndex(r => r.id === id);
  
  if (index === -1) throw new Error('Referral not found');
  
  referrals[index] = { ...referrals[index], ...updates };
  saveReferrals(referrals);
  return referrals[index];
}

export async function applyToReferral(referralId) {
  await new Promise(r => setTimeout(r, 120));
  const referrals = await loadReferrals();
  const referral = referrals.find(r => r.id === referralId);
  
  if (!referral) throw new Error('Referral not found');
  
  referral.applicationCount = (referral.applicationCount || 0) + 1;
  saveReferrals(referrals);
  
  return {
    success: true,
    message: 'Application submitted successfully',
    referralCode: referral.referralCode,
  };
}

export async function getReferralStats() {
  await new Promise(r => setTimeout(r, 100));
  const referrals = await loadReferrals();
  
  const activeReferrals = referrals.filter(r => r.status === 'active').length;
  const totalApplications = referrals.reduce((sum, r) => sum + (r.applicationCount || 0), 0);
  const companies = new Set(referrals.map(r => r.company)).size;
  
  return {
    activeReferrals,
    totalApplications,
    companies,
  };
}
