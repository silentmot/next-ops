# Design Tokens Reference

Complete reference for all design tokens in the DeskOps Design System.

## Color Tokens

### Dark Theme

```typescript
colors.dark.background.primary    // rgba(10, 14, 39, 1)
colors.dark.background.secondary  // rgba(26, 31, 58, 1)
colors.dark.background.tertiary   // rgba(37, 46, 74, 1)
colors.dark.background.glass      // rgba(255, 255, 255, 0.05)

colors.dark.text.primary          // rgba(241, 245, 249, 1)
colors.dark.text.secondary        // rgba(203, 213, 225, 1)
colors.dark.text.tertiary         // rgba(148, 163, 184, 1)

colors.dark.accent.emerald.solid  // rgba(16, 185, 129, 1)
colors.dark.accent.violet.solid   // rgba(139, 92, 246, 1)
colors.dark.accent.amber.solid    // rgba(245, 158, 11, 1)

colors.dark.status.success        // rgba(16, 185, 129, 1)
colors.dark.status.warning        // rgba(245, 158, 11, 1)
colors.dark.status.critical       // rgba(239, 68, 68, 1)
colors.dark.status.info           // rgba(59, 130, 246, 1)
```

### Light Theme

```typescript
colors.light.background.primary   // rgba(248, 250, 252, 1)
colors.light.text.primary         // rgba(15, 23, 42, 1)
// ... similar structure
```

## Spacing Tokens

```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing['2xl'] // 48px
spacing['3xl'] // 64px
spacing['4xl'] // 96px
```

## Typography Tokens

```typescript
typography.fontSize.xs    // 0.75rem
typography.fontSize.sm    // 0.875rem
typography.fontSize.base  // 1rem
typography.fontSize.lg    // 1.125rem
typography.fontSize.xl    // 1.25rem
typography.fontSize['2xl'] // 1.5rem
typography.fontSize['3xl'] // 1.875rem
typography.fontSize['4xl'] // 2.25rem

typography.fontWeight.normal   // 400
typography.fontWeight.medium   // 500
typography.fontWeight.semibold // 600
typography.fontWeight.bold     // 700

typography.lineHeight.tight    // 1.25
typography.lineHeight.normal   // 1.5
typography.lineHeight.relaxed  // 1.75
```

## Shadow Tokens

```typescript
shadows.glass.default  // Multi-layer glass effect
shadows.glass.hover    // Elevated glass effect

shadows.glow.emerald   // Emerald glow
shadows.glow.violet    // Violet glow
shadows.glow.amber     // Amber glow

shadows.elevation.sm   // Small elevation
shadows.elevation.md   // Medium elevation
shadows.elevation.lg   // Large elevation
shadows.elevation.xl   // Extra large elevation
```

## Animation Tokens

```typescript
animations.duration.fast     // 150ms
animations.duration.normal   // 300ms
animations.duration.slow     // 400ms
animations.duration.counter  // 1200ms

animations.easing.default    // cubic-bezier(0.4, 0, 0.2, 1)
animations.easing.elastic    // cubic-bezier(0.23, 1, 0.320, 1)
animations.easing.spring     // cubic-bezier(0.68, -0.55, 0.265, 1.55)

animations.delay.cascade     // 50ms
animations.delay.stagger     // 100ms

animations.scale.hover       // 1.02
animations.scale.click       // 0.95
```

## Usage Examples

### Creating a Themed Card

```typescript
import { colors, spacing, shadows } from '@deskops/design-system';

const Card = ({ isDark }) => (
  <div style={{
    backgroundColor: isDark 
      ? colors.dark.background.secondary 
      : colors.light.background.secondary,
    padding: spacing.lg,
    borderRadius: '20px',
    boxShadow: shadows.glass.default,
  }}>
    Card Content
  </div>
);
```

### Animated Button

```typescript
import { colors, animations } from '@deskops/design-system';

const Button = () => (
  <button style={{
    transition: `transform ${animations.duration.normal} ${animations.easing.default}`,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = `scale(${animations.scale.hover})`;
  }}>
    Click Me
  </button>
);
```