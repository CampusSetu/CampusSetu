import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchAggregates,
  fetchCompensationRows,
  fetchInterviewExperiences,
  fetchRatingDistribution,
} from "../api/mockCompanyInsights";

const InsightsContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useInsights() {
  return useContext(InsightsContext);
}

const defaultExperiencesLimit = 60;

export function InsightsProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [ratingSummary, setRatingSummary] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [roleRows, agg, ratings, experienceRows] = await Promise.all([
          fetchCompensationRows(),
          fetchAggregates(),
          fetchRatingDistribution(),
          fetchInterviewExperiences({ limit: defaultExperiencesLimit }),
        ]);
        if (cancelled) return;
        setRoles(roleRows);
        setAggregates(agg);
        setRatingSummary(ratings);
        setExperiences(experienceRows);
      } catch (err) {
        console.error("Failed to load insights", err);
        if (!cancelled) {
          setError("Unable to load insights data right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitExperience = (payload) => {
    const experience = {
      id: `local-${Date.now()}`,
      overallScore: payload.overallScore || 4,
      difficulty: payload.difficulty || "Moderate",
      batch: payload.batch || "2025",
      location: payload.location || "Remote",
      tier: payload.tier || "Campus",
      company: payload.company,
      role: payload.role,
      summary: payload.summary,
      roundHighlights: payload.roundHighlights?.length
        ? payload.roundHighlights
        : [payload.summary],
      tips: payload.tips || "Share structured stories.",
    };
    setExperiences((prev) => [experience, ...prev]);
  };

  const uniqueFilters = useMemo(() => {
    const rolesSet = new Set();
    const locationsSet = new Set();
    const domainsSet = new Set();
    const tiersSet = new Set();

    roles.forEach((role) => {
      if (role.title) rolesSet.add(role.title);
      if (role.location) locationsSet.add(role.location);
      if (role.domain) domainsSet.add(role.domain);
      if (role.tier) tiersSet.add(role.tier);
    });

    return {
      roles: Array.from(rolesSet).sort(),
      locations: Array.from(locationsSet).sort(),
      domains: Array.from(domainsSet).sort(),
      tiers: Array.from(tiersSet).sort(),
    };
  }, [roles]);

  const value = {
    loading,
    error,
    roles,
    aggregates,
    ratingSummary,
    experiences,
    filters: uniqueFilters,
    submitExperience,
  };

  return (
    <InsightsContext.Provider value={value}>{children}</InsightsContext.Provider>
  );
}
