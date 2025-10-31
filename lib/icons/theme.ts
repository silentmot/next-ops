/**
 * Theme toggle icons
 * Source: Document 2 - Theme toggle implementation
 */

import { Monitor, Moon, Sun } from "lucide-react";

export const ThemeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export type ThemeIconKey = keyof typeof ThemeIcons;
