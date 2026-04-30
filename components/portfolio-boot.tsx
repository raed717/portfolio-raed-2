"use client";

import { useEffect, useState } from "react";

import AppLoadingScreen from "@/components/app-loading-screen";
import PortfolioPage, {
  type Certification,
  type EducationItem,
  type ProfileData,
  type Project,
} from "@/components/portfolio-page";

type PortfolioBootProps = {
  profile: ProfileData;
  projects: Project[];
  education: EducationItem[];
  certifications: Certification[];
};

export default function PortfolioBoot(props: PortfolioBootProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!isReady || !hasLaunched) {
    return (
      <AppLoadingScreen
        progress={isReady ? 100 : null}
        isComplete={isReady}
        onLaunch={isReady ? () => setHasLaunched(true) : undefined}
      />
    );
  }

  return <PortfolioPage {...props} />;
}
