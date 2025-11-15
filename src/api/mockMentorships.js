import mentorshipsData from '../data/mentorships.json';

const MENTORSHIPS_KEY = 'cs_mentorships';

async function loadMentorships() {
  const raw = localStorage.getItem(MENTORSHIPS_KEY);
  if (raw) return JSON.parse(raw);
  
  localStorage.setItem(MENTORSHIPS_KEY, JSON.stringify(mentorshipsData));
  return mentorshipsData;
}

function saveMentorships(mentorships) {
  localStorage.setItem(MENTORSHIPS_KEY, JSON.stringify(mentorships));
}

export async function getMentorships(filters = {}) {
  await new Promise(r => setTimeout(r, 120));
  let mentorships = await loadMentorships();
  
  if (filters.mentorId) {
    mentorships = mentorships.filter(m => m.mentorId === filters.mentorId);
  }
  
  if (filters.menteeId) {
    mentorships = mentorships.filter(m => m.menteeId === filters.menteeId);
  }
  
  if (filters.status) {
    mentorships = mentorships.filter(m => m.status === filters.status);
  }
  
  return mentorships;
}

export async function getMentorshipById(id) {
  await new Promise(r => setTimeout(r, 100));
  const mentorships = await loadMentorships();
  return mentorships.find(m => m.id === id);
}

export async function createMentorship(data) {
  await new Promise(r => setTimeout(r, 150));
  const mentorships = await loadMentorships();
  
  const newId = mentorships.length > 0 ? Math.max(...mentorships.map(m => m.id)) + 1 : 1;
  const newMentorship = {
    id: newId,
    ...data,
    matchedOn: new Date().toISOString(),
    status: 'pending',
    sessions: [],
  };
  
  mentorships.push(newMentorship);
  saveMentorships(mentorships);
  return newMentorship;
}

export async function updateMentorship(id, updates) {
  await new Promise(r => setTimeout(r, 120));
  const mentorships = await loadMentorships();
  const index = mentorships.findIndex(m => m.id === id);
  
  if (index === -1) throw new Error('Mentorship not found');
  
  mentorships[index] = { ...mentorships[index], ...updates };
  saveMentorships(mentorships);
  return mentorships[index];
}

export async function addMentorshipSession(mentorshipId, sessionData) {
  await new Promise(r => setTimeout(r, 120));
  const mentorships = await loadMentorships();
  const mentorship = mentorships.find(m => m.id === mentorshipId);
  
  if (!mentorship) throw new Error('Mentorship not found');
  
  const newSessionId = mentorship.sessions.length > 0 
    ? Math.max(...mentorship.sessions.map(s => s.id)) + 1 
    : 1;
  
  const newSession = {
    id: newSessionId,
    ...sessionData,
    date: sessionData.date || new Date().toISOString(),
  };
  
  mentorship.sessions.push(newSession);
  saveMentorships(mentorships);
  return mentorship;
}

export async function matchMentor() {
  await new Promise(r => setTimeout(r, 200));
  // This would call a matching algorithm in production
  // For now, we'll return a simple match score
  
  const mockMatches = [
    {
      mentorId: 301,
      score: 95,
      reasons: ['Both interested in React', 'Frontend Development alignment', 'Same department']
    },
    {
      mentorId: 304,
      score: 88,
      reasons: ['Machine Learning interest', 'Research experience']
    },
    {
      mentorId: 303,
      score: 82,
      reasons: ['Career transition guidance', 'Product thinking']
    }
  ];
  
  return mockMatches;
}

export async function getMentorshipStats() {
  await new Promise(r => setTimeout(r, 100));
  const mentorships = await loadMentorships();
  
  const activeMentorships = mentorships.filter(m => m.status === 'active').length;
  const pendingMentorships = mentorships.filter(m => m.status === 'pending').length;
  const totalSessions = mentorships.reduce((sum, m) => sum + (m.sessions?.length || 0), 0);
  const avgRating = mentorships
    .flatMap(m => m.sessions || [])
    .filter(s => s.rating)
    .reduce((sum, s, _, arr) => sum + s.rating / arr.length, 0);
  
  return {
    activeMentorships,
    pendingMentorships,
    totalSessions,
    avgRating: avgRating ? avgRating.toFixed(1) : 'N/A',
  };
}
