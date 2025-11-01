/**
 * Site Selector Component
 * Source: DeskOps-Dashboard-P1.md Section 2.2
 *
 * REQUIREMENTS:
 * - Width: 200px (fixed)
 * - Height: 40px
 * - Dropdown with site list
 * - Integrates with dashboard store
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITES } from "@/lib/constants";
import { DROPDOWN_CONFIG, HEADER_CONFIG } from "@/lib/constants/dashboard";
import { useDashboardStore } from "@/lib/stores/dashboardStore";

export function SiteSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const currentSite = useDashboardStore((state) => state.currentSite);
  const setCurrentSite = useDashboardStore((state) => state.setCurrentSite);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current site details
  const selectedSite = SITES.find((site) => site.code === currentSite);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (siteCode: string) => {
    setCurrentSite(siteCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="relative flex items-center gap-2 bg-(--input-bg) border border-(--border-color) text-(--text-primary) text-sm font-medium cursor-pointer transition-all duration-200 hover:border-(--border-hover) hover:bg-(--input-hover) focus:outline-none focus:border-2 focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--focus-ring)]"
        style={{
          width: `${HEADER_CONFIG.siteSelector.width}px`,
          height: `${HEADER_CONFIG.siteSelector.height}px`,
          borderRadius: `${HEADER_CONFIG.siteSelector.borderRadius}px`,
          padding: `0 ${HEADER_CONFIG.siteSelector.padding.right}px 0 ${HEADER_CONFIG.siteSelector.padding.left}px`,
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Building2
          size={HEADER_CONFIG.siteSelector.iconSize}
          className="absolute text-(--text-secondary)"
          style={{ left: `${HEADER_CONFIG.siteSelector.iconPosition}px` }}
        />
        <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
          {selectedSite?.code || "Select site..."}
        </span>
        <ChevronDown
          size={16}
          className="text-(--text-secondary) shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 bg-(--dropdown-bg) border border-(--border-color) shadow-(--shadow-lg) overflow-y-auto"
            style={{
              top: `${DROPDOWN_CONFIG.siteSelector.topOffset}px`,
              width: `${DROPDOWN_CONFIG.siteSelector.width}px`,
              maxHeight: `${DROPDOWN_CONFIG.siteSelector.maxHeight}px`,
              borderRadius: `${DROPDOWN_CONFIG.siteSelector.borderRadius}px`,
              zIndex: DROPDOWN_CONFIG.siteSelector.zIndex,
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: DROPDOWN_CONFIG.siteSelector.animation.duration / 1000,
              ease: [0.4, 0, 0.2, 1],
            }}
            role="listbox"
          >
            {SITES.filter((site) => site.isActive).map((site) => (
              <button
                key={site.id}
                type="button"
                className={`flex items-center justify-between bg-transparent border-none text-(--text-primary) cursor-pointer transition-[background] duration-150 w-full hover:bg-(--hover-bg) focus:outline-none focus:bg-(--hover-bg) focus:shadow-[inset_0_0_0_2px_var(--focus-ring)] ${
                  site.code === currentSite
                    ? "bg-(--selected-bg) font-semibold"
                    : ""
                }`}
                style={{
                  height: `${DROPDOWN_CONFIG.siteSelector.itemHeight}px`,
                  padding: `0 ${DROPDOWN_CONFIG.siteSelector.itemPadding}px`,
                }}
                onClick={() => handleSelect(site.code)}
                role="option"
                aria-selected={site.code === currentSite}
                title={`${site.name} - ${site.location}`}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">{site.code}</span>
                  <span className="text-xs text-(--text-secondary)">
                    {site.location}
                  </span>
                </div>
                {site.code === currentSite && (
                  <Check size={20} className="text-(--primary) shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
