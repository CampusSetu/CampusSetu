import companiesData from '../data/companies.json';

let companies = [...companiesData];

async function loadCompanies() {
  return companies;
}

export async function getCompanyById(id) {
  await loadCompanies();
  const c = companies.find(x => Number(x.id) === Number(id)) || null;
  return new Promise(resolve => setTimeout(() => resolve(c), 80));
}
