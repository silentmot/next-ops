/**
 * OPS Page Transition Loader
 * Subtle loading experience for page transitions
 * Created: October 30, 2025
 */

"use client";

import { useState } from "react";
import { useTheme } from "../../lib/theme";

interface PageTransitionLoaderProps {
  isVisible: boolean;
}

export function PageTransitionLoader({ isVisible }: PageTransitionLoaderProps) {
  const { tokens } = useTheme();

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
      style={{
        background: "oklch(0 0 0 / 0.3)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="text-center">
        {/* Minimal spinner */}
        <div
          className="w-8 h-8 border-2 border-transparent rounded-full animate-spin mx-auto mb-4"
          style={{
            borderTopColor: tokens.colors.brand.primary,
            borderRightColor: tokens.colors.brand.primary,
          }}
        />

        {/* Loading text */}
        <p
          className="text-sm font-medium"
          style={{ color: "oklch(0.68 0.04 250 / 0.7)" }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}

// Hook for page transitions
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);

  return { isTransitioning, startTransition, endTransition };
}
