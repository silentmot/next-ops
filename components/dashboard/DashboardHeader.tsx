/**
 * Dashboard Header Component
 * Source: DeskOps-Dashboard-P1.md Section 2
 *
 * REQUIREMENTS:
 * - Height: 64px (fixed)
 * - Position: Sticky top
 * - Glass morphism design
 * - Contains: Site Selector, Date Picker, Global Search, Theme Toggle, User Button
 */

"use client";

import { UserButton } from "@clerk/nextjs";
import { HEADER_CONFIG } from "@/lib/constants/dashboard";
import { DatePicker } from "./header/DatePicker";
import { GlobalSearch } from "./header/GlobalSearch";
import { SiteSelector } from "./header/SiteSelector";
import { ThemeToggle } from "./header/ThemeToggle";

export function DashboardHeader() {
  return (
    <header
      className="w-full sticky top-0 flex justify-between items-center bg-(--glass-base) border-b border-(--border-color) backdrop-blur-[10px] backdrop-saturate-180"
      style={{
        height: `${HEADER_CONFIG.height}px`,
        padding: `0 ${HEADER_CONFIG.padding}px`,
        gap: `${HEADER_CONFIG.gap}px`,
        zIndex: HEADER_CONFIG.zIndex,
      }}
    >
      {/* Left section */}
      <div
        className="flex items-center"
        style={{ gap: `${HEADER_CONFIG.gap}px` }}
      >
        <SiteSelector />
        <GlobalSearch />
      </div>

      {/* Right section */}
      <div
        className="flex items-center"
        style={{ gap: `${HEADER_CONFIG.gap}px` }}
      >
        <DatePicker />
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: HEADER_CONFIG.userButton.size,
                height: HEADER_CONFIG.userButton.size,
                borderRadius: HEADER_CONFIG.userButton.borderRadius,
              },
            },
          }}
          afterSignOutUrl="/"
          showName={false}
        />
      </div>
    </header>
  );
}
