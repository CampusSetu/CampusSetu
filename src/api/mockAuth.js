import usersData from '../data/users.json';

const USERS_KEY = 'cs_users';

async function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);

  // Use imported seed data instead of fetch
  const seedUsers = usersData;
  localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  return seedUsers;
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function login(email, password) {
  const users = await loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  await new Promise(r => setTimeout(r, 200));
  if (!user) throw new Error('Invalid credentials');
  const token = `mock-token-${user.id}-${Date.now()}`;
  return { token, user };
}

export async function register({ name, email, password, role }) {
  const users = await loadUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    await new Promise(r => setTimeout(r, 120));
    throw new Error('Email already registered');
  }
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, name, email, password, role, profile: {} };
  users.push(newUser);
  saveUsers(users);
  await new Promise(r => setTimeout(r, 200));
  const token = `mock-token-${id}-${Date.now()}`;
  return { token, user: newUser };
}

export async function updateUser(userId, updatedProfile) {
  const users = await loadUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error("User not found.");

  const userToUpdate = users[userIndex];
  userToUpdate.name = updatedProfile.name;
  userToUpdate.profile = { ...userToUpdate.profile, ...updatedProfile.profile };

  saveUsers(users);
  await new Promise(r => setTimeout(r, 100)); // Simulate API call delay
  return userToUpdate;
}
