"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DesignTokens } from "@/lib/DesignTokens";
import { GlassContainer } from "./GlassContainer";

/**
 * Sidebar Component
 * Source: DeskOps-DashboardGuide.md Lines 114
 * Navigation sidebar with glassmorphic styling
 */

interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  className?: string;
}

export function Sidebar({ items, activeItem, className = "" }: SidebarProps) {
  return (
    <GlassContainer
      className={`${className}`}
      glassIntensity="light"
      style={{
        padding: DesignTokens.spacing["4"],
      }}
    >
      <nav>
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: parseFloat(DesignTokens.duration.medium) / 1000,
                delay: index * 0.05,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <button
                type="button"
                onClick={item.onClick}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-300
                  ${
                    activeItem === item.id
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/70 hover:text-white"
                  }
                `}
                style={{
                  fontSize: DesignTokens.typography.fontSize.base,
                  fontWeight:
                    activeItem === item.id
                      ? DesignTokens.typography.fontWeight.semibold
                      : DesignTokens.typography.fontWeight.normal,
                }}
              >
                <span className="opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </GlassContainer>
  );
}
