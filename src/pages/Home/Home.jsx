import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import HomeHeader from "./components/HomeHeader";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import AnalyticsSection from "./components/AnalyticsSection";
import PersonaSection from "./components/PersonaSection";
import HomeFooter from "./components/HomeFooter";
import {
  analyticsMetrics,
  featurePillars,
  heroHighlights,
  personaSections,
  snapshotTiles,
} from "./content";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthModal } = useUI();

  const handlePrimaryCTA = () => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
      return;
    }
    openAuthModal();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HomeHeader onAuth={openAuthModal} />
      <main className="w-full">
        <HeroSection
          heroHighlights={heroHighlights}
          onPrimaryCTA={handlePrimaryCTA}
          user={user}
        />
        <FeatureSection featurePillars={featurePillars} />
        <AnalyticsSection
          analyticsMetrics={analyticsMetrics}
          snapshotTiles={snapshotTiles}
        />
        <PersonaSection personaSections={personaSections} />
      </main>
      <HomeFooter onAuth={openAuthModal} />
    </div>
  );
}
