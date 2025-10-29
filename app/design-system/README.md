# DeskOps Design System

A comprehensive design system built for the DeskOps Dashboard, featuring design tokens, icon system, and glassmorphism components.

## Features

- **Design Tokens**: Color, spacing, typography, shadows, and animations
- **Icon System**: 40+ semantic icons with type-safe API
- **Glass Components**: Pre-built glassmorphism components
- **Type Safety**: Full TypeScript support with strict types
- **Animation Ready**: Framer Motion integration
- **Theme Support**: Dark and light themes

## Installation

```bash
# In your workspace root
npm install lucide-react framer-motion
```

## Usage

### Import Design Tokens

```typescript
import { colors, spacing, typography, shadows, animations } from '@deskops/design-system';

// Use in your components
const MyComponent = () => (
  <div style={{
    backgroundColor: colors.dark.background.primary,
    padding: spacing.lg,
    borderRadius: '20px',
  }}>
    Content
  </div>
);
```

### Use Icons

```typescript
import { Icon, AnimatedIcon, IconButton } from '@deskops/design-system';

// Basic icon
<Icon name="revenue" size="lg" color="emerald" isDark={true} />

// Animated icon
<AnimatedIcon name="trend" animation="pulse" duration={2} />

// Icon button
<IconButton
  icon="refresh"
  onClick={() => handleRefresh()}
  ariaLabel="Refresh data"
  variant="ghost"
/>
```

### Apply Glass Styles

```css
@import '@deskops/design-system/styles';

.my-card {
  @apply glass-container;
}

.my-glow {
  @apply glow-emerald;
}
```

## Available Tokens

### Colors

- `colors.dark.*` - Dark theme colors
- `colors.light.*` - Light theme colors

### Spacing

- `spacing.xs` through `spacing.4xl`

### Typography

- `typography.fontSize.*`
- `typography.fontWeight.*`
- `typography.lineHeight.*`

### Shadows

- `shadows.glass.*`
- `shadows.glow.*`
- `shadows.elevation.*`

### Animations

- `animations.duration.*`
- `animations.easing.*`

## Icon Names

Dashboard: `revenue`, `users`, `performance`, `activity`, `orders`, `goals`, `views`, `time`

Charts: `line`, `area`, `bar`, `pie`, `scatter`, `trend`, `decline`

Navigation: `home`, `settings`, `logout`, `menu`, `close`

Status: `success`, `error`, `warning`, `alert`, `critical`, `info`

Actions: `download`, `upload`, `share`, `filter`, `search`, `refresh`

Theme: `sun`, `moon`, `device`

## Demo

Run the visual demo:

```bash
cd design-system
npm run dev
```

## License

MIT
