# Theme-Aware Component Styling Guide

## Problem Summary

The original `DesignTokens.colors` object was statically bound to `DarkTheme`, causing text and colors to never switch when toggling between light and dark modes.

## Solution

Use the `getThemeColors()` helper function to retrieve theme-aware colors based on the current theme mode.

---

## Pattern 1: Using getThemeColors in Components

### ✅ CORRECT - Theme-Aware

```typescript
import { useTheme } from "@/hooks/useTheme";
import { DesignTokens } from "@/lib/DesignTokens";

export function MyComponent() {
  const { isDark } = useTheme();

  // Get theme-aware colors
  const themeColors = DesignTokens.helpers.getThemeColors(
    isDark ? "dark" : "light"
  );

  return (
    <div style={{
      color: themeColors.text.primary,
      backgroundColor: themeColors.background.primary
    }}>
      Text switches based on theme
    </div>
  );
}
```

### ❌ INCORRECT - Always Dark Theme

```typescript
import { DesignTokens } from "@/lib/DesignTokens";

export function MyComponent() {
  return (
    <div style={{
      color: DesignTokens.colors.text.primary  // ← Always dark theme
    }}>
      Text never switches
    </div>
  );
}
```

---

## Pattern 2: Using CSS Variables (Recommended)

### ✅ BEST PRACTICE - Use CSS Variables

```typescript
export function MyComponent() {
  return (
    <div
      className="text-(--text-primary) bg-(--background-primary)"
      // OR with inline styles:
      style={{
        color: "var(--text-primary)",
        backgroundColor: "var(--background-primary)"
      }}
    >
      Automatically switches with theme
    </div>
  );
}
```

**Available CSS Variables**:

- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--background-primary`, `--background-secondary`, `--background-tertiary`
- Plus all variables defined in globals.css lines 125-177

---

## Pattern 3: Component-Specific Theme Awareness

```typescript
import { useTheme } from "@/hooks/useTheme";
import { DesignTokens } from "@/lib/DesignTokens";

export function Card({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const colors = DesignTokens.helpers.getThemeColors(isDark ? "dark" : "light");

  return (
    <div
      style={{
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        border: `1px solid ${isDark ?
          DesignTokens.borderOpacity.medium :
          DesignTokens.borderOpacity.light
        }`,
      }}
    >
      {children}
    </div>
  );
}
```

---

## Migration Checklist

Search your codebase for these patterns and update:

### 1. Direct DesignTokens.colors Usage

```bash
# Search for:
DesignTokens.colors.text
DesignTokens.colors.brand
DesignTokens.theme.dark
DesignTokens.theme.light
```

### 2. Replace With One Of

- **Option A**: `DesignTokens.helpers.getThemeColors(isDark ? "dark" : "light")`
- **Option B**: CSS variables `var(--text-primary)`
- **Option C**: Tailwind classes with CSS variables

### 3. Common Replacements

| Old (Always Dark) | New (Theme-Aware) |
|------------------|-------------------|
| `DesignTokens.colors.text.primary` | `themeColors.text.primary` |
| `DesignTokens.theme.dark.text.primary` | `themeColors.text.primary` |
| `DesignTokens.colors.brand.surface` | `themeColors.background.primary` |

---

## Complete Example: Refactored Component

```typescript
"use client";

import { useTheme } from "@/hooks/useTheme";
import { DesignTokens } from "@/lib/DesignTokens";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function ThemedCard({ title, children }: CardProps) {
  const { isDark } = useTheme();
  const colors = DesignTokens.helpers.getThemeColors(isDark ? "dark" : "light");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        borderRadius: DesignTokens.borderRadius["2xl"],
        padding: DesignTokens.spacing["6"],
        border: `${DesignTokens.borderWidth["1"]} solid ${
          isDark
            ? DesignTokens.borderOpacity.medium
            : DesignTokens.borderOpacity.light
        }`,
      }}
    >
      <h3 style={{
        color: colors.text.primary,
        marginBottom: DesignTokens.spacing["4"]
      }}>
        {title}
      </h3>
      <div style={{ color: colors.text.secondary }}>
        {children}
      </div>
    </motion.div>
  );
}
```

---

## API Reference

### getThemeColors(mode: ThemeMode)

Returns theme-appropriate color values.

**Parameters**:

- `mode: "dark" | "light"` - The current theme mode

**Returns**:

```typescript
{
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    glass: string;
  },
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    interactive: string;
  },
  accent: { ... },
  status: { ... }
}
```

**Usage**:

```typescript
const { isDark } = useTheme();
const colors = DesignTokens.helpers.getThemeColors(isDark ? "dark" : "light");
```
