/**
 * OPS Premium Loading Experience
 * Inspired by NK Studio's award-winning design approach
 * Created: October 30, 2025
 */

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../lib/theme";

interface PremiumLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

export function PremiumLoader({
  onComplete,
  duration = 3000,
}: PremiumLoaderProps) {
  const { tokens } = useTheme();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"spark" | "ignite" | "complete">("spark");
  const [textIndex, setTextIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const loadingTexts = [
    "I t  a l l  s t a r t s  w i t h  a  s p a r k",
    "C r e a t i n g  y o u r  u n i v e r s e",
    "I g n i t i n g  p a s s i o n",
    "R e i m a g i n i n g  p o s s i b i l i t i e s",
  ];

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 50);

        if (newProgress >= 30 && phase === "spark") {
          setPhase("ignite");
        }
        if (newProgress >= 90 && phase === "ignite") {
          setPhase("complete");
        }
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }

        return newProgress;
      });
    }, 50);

    // Text cycling effect
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [duration, onComplete, phase]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          oklch(0.08 0.02 265) 0%,
          oklch(0.12 0.04 275) 30%,
          oklch(0.16 0.06 285) 60%,
          oklch(0.20 0.08 295) 100%
        )`,
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient && [...Array(20)].map((_, i) => {
          // Use deterministic values based on index to prevent hydration mismatch
          const particleId = `particle-${i}`;
          const left = (i * 31.7) % 100; // Use deterministic positioning
          const top = (i * 47.3) % 100;
          const duration = 18 + (i % 10) * 2; // Slower: 18-36s instead of 8-14s
          const delay = (i % 8) * 0.5;
          const direction = i % 2 === 0 ? "normal" : "reverse";

          return (
            <div
              key={particleId}
              className="absolute w-1 h-1 rounded-full opacity-20"
              style={{
                background: tokens.colors.gradients.primary,
                left: `${left}%`,
                top: `${top}%`,
                animation: `float ${duration}s ease-in-out infinite ${delay}s`,
                animationDirection: direction,
              }}
            />
          );
        })}
      </div>

      {/* Central Loading Experience */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        {/* Logo/Brand with Spark Effect */}
        <div className="mb-12 relative">
          <div
            className={`
              inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8
              transition-all duration-1000 ease-out
              ${phase === "spark" ? "scale-100 opacity-60" : ""}
              ${phase === "ignite" ? "scale-110 opacity-90" : ""}
              ${phase === "complete" ? "scale-125 opacity-100" : ""}
            `}
            style={{
              background: tokens.colors.gradients.primary,
              boxShadow: `
                0 0 60px oklch(0.62 0.25 264 / 0.25),
                0 0 120px oklch(0.62 0.25 264 / 0.12),
                inset 0 0 60px oklch(0.62 0.25 264 / 0.06)
              `,
            }}
          >
            <span
              className="text-4xl font-bold"
              style={{ color: "oklch(0.98 0.01 250)" }}
            >
              OPS
            </span>

            {/* Spark Animation */}
            {phase === "spark" && (
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, oklch(0.62 0.25 264 / 0.25), transparent)`,
                    animation: "spin 6s linear infinite",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Text Display */}
        <div className="mb-16 h-20 flex items-center justify-center">
          <h1
            className="text-2xl md:text-3xl font-light tracking-[0.3em] transition-all duration-700 ease-out"
            style={{
              background: tokens.colors.gradients.rainbow,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: phase === "complete" ? 1 : 0.8,
              transform:
                phase === "complete" ? "translateY(0)" : "translateY(10px)",
            }}
          >
            {loadingTexts[textIndex]}
          </h1>
        </div>

        {/* Premium Progress Indicator */}
        <div className="mb-8">
          <div className="relative w-full max-w-md mx-auto">
            {/* Progress Track */}
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{
                background: "oklch(1 0 0 / 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Progress Fill */}
              <div
                className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: tokens.colors.gradients.primary,
                }}
              >
                {/* Shimmer Effect */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.4), transparent)",
                    animation: "shimmer 4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Progress Percentage */}
            <div
              className="flex justify-between items-center mt-4 text-sm font-medium"
              style={{ color: "oklch(0.68 0.04 250 / 0.6)" }}
            >
              <span>Loading Experience</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Phase-based Micro-interactions */}
        {phase === "ignite" && (
          <div className="mb-8 animate-pulse">
            <div
              className="flex justify-center items-center gap-2 text-sm"
              style={{ color: "oklch(0.68 0.04 250)" }}
            >
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: "oklch(1 0 0 / 0.4)",
                  animationDelay: "0s",
                }}
              />
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: "oklch(1 0 0 / 0.4)",
                  animationDelay: "0.2s",
                }}
              />
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  background: "oklch(1 0 0 / 0.4)",
                  animationDelay: "0.4s",
                }}
              />
            </div>
          </div>
        )}

        {phase === "complete" && (
          <div className="animate-fade-in">
            <p
              className="text-lg font-light"
              style={{ color: "oklch(0.68 0.04 250 / 0.7)" }}
            >
              Welcome to Operations Portal
            </p>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          25% { transform: translateY(-15px) translateX(8px); opacity: 0.4; }
          50% { transform: translateY(-8px) translateX(-4px); opacity: 0.6; }
          75% { transform: translateY(-22px) translateX(12px); opacity: 0.3; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

// Hook for managing loading state
export function useLoadingState(initialLoading = true) {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = () => setIsLoading(true);
  const finishLoading = () => setIsLoading(false);

  return { isLoading, startLoading, finishLoading };
}
