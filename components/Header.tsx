"use client";

import { DesignTokens } from "@/lib/DesignTokens";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Header Component
 * Source: DeskOps-DashboardGuide.md Lines 113
 * Dashboard header with title and theme toggle
 */

interface HeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Header({
  title = "DeskOps Dashboard",
  subtitle,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between ${className}`}
      style={{
        padding: `${DesignTokens.spacing["6"]} 0`,
      }}
    >
      <div>
        <h1
          className="font-bold"
          style={{
            fontSize: DesignTokens.typography.fontSize["2xl"],
            color: DesignTokens.theme.dark.text.primary,
            fontWeight: DesignTokens.typography.fontWeight.bold,
            letterSpacing: DesignTokens.typography.letterSpacing.tight,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-1"
            style={{
              fontSize: DesignTokens.typography.fontSize.base,
              color: DesignTokens.theme.dark.text.secondary,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
