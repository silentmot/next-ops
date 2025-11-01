/**
 * Global Search Component
 * Source: DeskOps-Dashboard-P1.md Section 2.4
 *
 * REQUIREMENTS:
 * - Width: 240px (default) → 400px (focused)
 * - Height: 40px
 * - Keyboard shortcut: Cmd/Ctrl + K
 * - Search across dashboard data
 */

"use client";

import { Command, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HEADER_CONFIG } from "@/lib/constants/dashboard";

export function GlobalSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      // Close on Escape
      if (event.key === "Escape" && isExpanded) {
        inputRef.current?.blur();
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsExpanded(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // TODO: Implement search functionality
    // This will search across materials, equipment, transactions, etc.
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement search submission
    console.log("Search query:", searchQuery);
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <div
        className="relative transition-[width] ease-linear"
        style={{
          width: isExpanded
            ? `${HEADER_CONFIG.globalSearch.widthExpanded}px`
            : `${HEADER_CONFIG.globalSearch.widthDefault}px`,
          transitionDuration: `${HEADER_CONFIG.globalSearch.transition}ms`,
        }}
      >
        <Search
          size={HEADER_CONFIG.globalSearch.iconSize}
          className="absolute top-1/2 -translate-y-1/2 text-(--text-secondary) pointer-events-none"
          style={{ left: `${HEADER_CONFIG.globalSearch.iconPosition}px` }}
        />
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-(--input-bg) border border-(--border-color) text-(--text-primary) text-sm transition-all duration-200 placeholder:text-(--text-tertiary) hover:border-(--border-hover) hover:bg-(--input-hover) focus:outline-none focus:border-2 focus:border-(--primary) focus:shadow-[0_0_0_3px_var(--focus-ring)] focus:bg-(--input-bg)"
          style={{
            height: `${HEADER_CONFIG.globalSearch.height}px`,
            borderRadius: `${HEADER_CONFIG.globalSearch.borderRadius}px`,
            padding: `0 80px 0 ${HEADER_CONFIG.globalSearch.padding.left}px`,
          }}
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Global search"
        />
        <kbd
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-1 bg-(--kbd-bg) border border-(--border-color) rounded text-[11px] font-medium text-(--text-secondary) font-mono pointer-events-none transition-opacity duration-200"
          style={{ opacity: isExpanded ? 0 : 1 }}
        >
          <Command size={12} />K
        </kbd>
      </div>
    </form>
  );
}
