"use client";

import { useEffect, useState } from "react";

import AppLoadingScreen from "@/components/app-loading-screen";
import PortfolioPage, {
  type Certification,
  type EducationItem,
  type ProfileData,
  type Project,
} from "@/components/portfolio-page";
import {
  FRAME_COUNT,
  preloadSequenceFrames,
  subscribeToSequencePreloadProgress,
} from "@/components/sequence-preload";

type PortfolioBootProps = {
  profile: ProfileData;
  projects: Project[];
  education: EducationItem[];
  certifications: Certification[];
};

export default function PortfolioBoot(props: PortfolioBootProps) {
  const [isReady, setIsReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeToSequencePreloadProgress((count) => {
      if (mounted) {
        setLoadedCount(count);
      }
    });

    preloadSequenceFrames().then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (!isReady || !hasLaunched) {
    return (
      <AppLoadingScreen
        progress={(loadedCount / FRAME_COUNT) * 100}
        isComplete={isReady}
        onLaunch={isReady ? () => setHasLaunched(true) : undefined}
      />
    );
  }

  return <PortfolioPage {...props} />;
}
