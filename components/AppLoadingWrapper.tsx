/**
 * OPS App Loading Wrapper
 * Manages the initial loading experience for the entire application
 * Created: October 30, 2025
 */

"use client";

import { useEffect, useState } from "react";
import { PremiumLoader } from "../components/loading/PremiumLoader";

interface AppLoadingWrapperProps {
  children: React.ReactNode;
}

export function AppLoadingWrapper({ children }: AppLoadingWrapperProps) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem("ops-visited");

    if (hasVisited) {
      // Skip loading for subsequent page visits in the same session
      setIsInitialLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    // Mark as visited for this session
    sessionStorage.setItem("ops-visited", "true");

    // Fade out loader and show content
    setIsInitialLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  if (showContent) {
    return <>{children}</>;
  }

  return (
    <>
      {isInitialLoading && (
        <PremiumLoader
          onComplete={handleLoadingComplete}
          duration={3200} // Slightly shorter for better UX
        />
      )}

      {/* Pre-render content but keep it hidden */}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
