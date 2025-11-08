import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUI } from "../../contexts/UIContext";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import AnalyticsSection from "./components/AnalyticsSection";
import PersonaSection from "./components/PersonaSection";
import TrustedStrip from "./components/TrustedStrip";
import WorkflowSection from "./components/WorkflowSection";
import TestimonialSection from "./components/TestimonialSection";
import CalloutSection from "./components/CalloutSection";
import HomeFooter from "./components/HomeFooter";
import Navbar from "../../components/Navbar";
import {
  analyticsMetrics,
  featurePillars,
  heroHighlights,
  heroMetrics,
  personaSections,
  snapshotTiles,
  trustedBadges,
  workflowSteps,
  testimonialHighlight,
  calloutBullets,
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
    <div className="min-h-screen text-slate-900">
      <Navbar />
      <main className="w-full">
        <HeroSection
          heroHighlights={heroHighlights}
          heroMetrics={heroMetrics}
          onPrimaryCTA={handlePrimaryCTA}
          user={user}
        />
        <TrustedStrip trustedBadges={trustedBadges} />
        <FeatureSection featurePillars={featurePillars} />
        <WorkflowSection workflowSteps={workflowSteps} />
        <AnalyticsSection
          analyticsMetrics={analyticsMetrics}
          snapshotTiles={snapshotTiles}
        />
        <TestimonialSection testimonial={testimonialHighlight} />
        <PersonaSection personaSections={personaSections} />
        <CalloutSection bullets={calloutBullets} onPrimaryCTA={handlePrimaryCTA} />
      </main>
      <HomeFooter onAuth={openAuthModal} />
    </div>
  );
}
