import insights from "../data/companyInsights.json";

const delay = (ms = 140) => new Promise((resolve) => setTimeout(resolve, ms));

function flattenRoles() {
  return insights.flatMap((company) =>
    company.roles.map((role, index) => ({
      id: `${company.id}-${index}`,
      companyId: company.id,
      company: company.name,
      tier: company.tier,
      domain: company.domain,
      logo: company.logo,
      ...role,
      acceptanceRate:
        role.offersMade > 0 ? role.offersAccepted / role.offersMade : 0,
      dropoutRate:
        role.offersAccepted > 0 ? role.dropouts / role.offersAccepted : 0,
    }))
  );
}

function flattenExperiences() {
  return insights.flatMap((company) =>
    (company.interviewExperiences || []).map((exp) => ({
      companyId: company.id,
      company: company.name,
      tier: company.tier,
      logo: company.logo,
      ...exp,
    }))
  );
}

export async function fetchCompanyInsights() {
  await delay();
  return insights;
}

export async function fetchCompensationRows() {
  await delay();
  return flattenRoles();
}

export async function fetchInterviewExperiences(params = {}) {
  await delay();
  const { limit = 20, role = "", location = "" } = params;
  return flattenExperiences()
    .filter((item) =>
      (!role || item.role === role) &&
      (!location || item.location === location)
    )
    .slice(0, limit);
}

export async function fetchAggregates() {
  await delay();
  const companies = insights.length;
  const roles = flattenRoles();
  const avgCtc =
    roles.reduce((sum, role) => sum + (role.medianCtc || 0), 0) /
    Math.max(roles.length, 1);
  const totalOffers = roles.reduce((sum, role) => sum + (role.offersMade || 0), 0);
  const accepted = roles.reduce(
    (sum, role) => sum + (role.offersAccepted || 0),
    0
  );
  const acceptanceRate = totalOffers ? (accepted / totalOffers) * 100 : 0;

  const ratingKeys = ["transparency", "difficulty", "negotiation", "culture"];
  const ratingSummary = ratingKeys.map((key) => {
    const avg =
      insights.reduce((sum, company) => sum + (company.ratings?.[key] || 0), 0) /
      Math.max(companies, 1);
    return { key, value: Number(avg.toFixed(2)) };
  });

  return {
    companies,
    avgCtc: Number(avgCtc.toFixed(1)),
    acceptanceRate: Number(acceptanceRate.toFixed(1)),
    ratingSummary,
    totalOffers,
  };
}

export async function fetchRatingDistribution() {
  await delay();
  const ratingKeys = ["transparency", "difficulty", "negotiation", "culture"];
  return ratingKeys.map((key) => ({
    category: key,
    average:
      insights.reduce((sum, company) => sum + (company.ratings?.[key] || 0), 0) /
      Math.max(insights.length, 1),
    topCompany: insights.reduce((acc, company) => {
      const val = company.ratings?.[key] || 0;
      if (!acc || val > acc.value) {
        return { name: company.name, value: val };
      }
      return acc;
    }, null),
  }));
}
