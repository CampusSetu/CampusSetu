let companies = null;

async function loadCompanies() {
  if (companies) return companies;
  try {
    const response = await fetch('/src/data/companies.json');
    if (!response.ok) throw new Error('Network response was not ok');
    companies = await response.json();
    return companies;
  } catch (error) {
    console.error('Failed to load companies:', error);
    companies = [];
    return companies;
  }
}

export async function getCompanyById(id) {
  await loadCompanies();
  const c = companies.find(x => Number(x.id) === Number(id)) || null;
  return new Promise(resolve => setTimeout(() => resolve(c), 80));
}
