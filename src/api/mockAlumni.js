import alumniData from '../data/alumni.json';

const ALUMNI_KEY = 'cs_alumni';
const ALUMNI_VERSION_KEY = 'cs_alumni_version';
const CURRENT_VERSION = '2'; // Increment this to force reload

async function loadAlumni() {
  const storedVersion = localStorage.getItem(ALUMNI_VERSION_KEY);
  const raw = localStorage.getItem(ALUMNI_KEY);
  
  // Force reload if version mismatch or no data
  if (!raw || storedVersion !== CURRENT_VERSION) {
    localStorage.setItem(ALUMNI_KEY, JSON.stringify(alumniData));
    localStorage.setItem(ALUMNI_VERSION_KEY, CURRENT_VERSION);
    return alumniData;
  }
  
  return JSON.parse(raw);
}

function saveAlumni(alumni) {
  localStorage.setItem(ALUMNI_KEY, JSON.stringify(alumni));
}

export async function getAlumni(filters = {}) {
  await new Promise(r => setTimeout(r, 150));
  let alumni = await loadAlumni();
  
  if (filters.available) {
    alumni = alumni.filter(a => a.isAvailableForMentorship);
  }
  
  if (filters.expertise) {
    alumni = alumni.filter(a => 
      a.expertise.some(e => 
        e.toLowerCase().includes(filters.expertise.toLowerCase())
      )
    );
  }
  
  if (filters.company) {
    alumni = alumni.filter(a => 
      a.currentCompany.toLowerCase().includes(filters.company.toLowerCase())
    );
  }
  
  if (filters.department) {
    alumni = alumni.filter(a => a.department === filters.department);
  }
  
  return alumni;
}

export async function getAlumniById(id) {
  await new Promise(r => setTimeout(r, 100));
  const alumni = await loadAlumni();
  return alumni.find(a => a.id === id);
}

export async function updateAlumni(id, updates) {
  await new Promise(r => setTimeout(r, 120));
  const alumni = await loadAlumni();
  const index = alumni.findIndex(a => a.id === id);
  
  if (index === -1) throw new Error('Alumni not found');
  
  alumni[index] = { ...alumni[index], ...updates };
  saveAlumni(alumni);
  return alumni[index];
}

export async function getAlumniStats() {
  await new Promise(r => setTimeout(r, 100));
  const alumni = await loadAlumni();
  
  const totalAlumni = alumni.length;
  const availableMentors = alumni.filter(a => a.isAvailableForMentorship).length;
  const totalMentees = alumni.reduce((sum, a) => sum + (a.currentMentees || 0), 0);
  const companies = new Set(alumni.map(a => a.currentCompany)).size;
  
  return {
    totalAlumni,
    availableMentors,
    totalMentees,
    companies,
    avgExperience: (alumni.reduce((sum, a) => sum + (a.yearsOfExperience || 0), 0) / totalAlumni).toFixed(1)
  };
}

export async function getAlumniProfile(userId) {
  await new Promise(r => setTimeout(r, 100));
  const alumni = await loadAlumni();
  return alumni.find(a => a.id === userId);
}

export async function getMentorshipRequests(alumniId) {
  await new Promise(r => setTimeout(r, 120));
  // Mock mentorship requests data
  return [
    {
      id: 1,
      studentId: 1,
      studentName: "Riya Sharma",
      alumniId: alumniId,
      status: "Pending",
      interests: ["React", "Full Stack Development"],
      message: "Looking for guidance in web development career",
      createdAt: "2025-11-10"
    },
    {
      id: 2,
      studentId: 2,
      studentName: "Arjun Mehta",
      alumniId: alumniId,
      status: "Accepted",
      interests: ["Python", "Data Science"],
      message: "Need mentorship for data science transition",
      createdAt: "2025-11-08"
    }
  ];
}

export async function getReferrals(alumniId) {
  await new Promise(r => setTimeout(r, 120));
  // Mock referrals data
  return [
    {
      id: 1,
      alumniId: alumniId,
      title: "Software Engineer",
      company: "Google",
      location: "Bangalore",
      status: "Active",
      applicants: 5,
      postedDate: "2025-11-12"
    },
    {
      id: 2,
      alumniId: alumniId,
      title: "Frontend Developer",
      company: "Microsoft",
      location: "Hyderabad",
      status: "Active",
      applicants: 3,
      postedDate: "2025-11-14"
    }
  ];
}
