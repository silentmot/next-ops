# Icon System Reference

Complete guide to the DeskOps icon system.

## Icon Registry

All icons are semantic and type-safe. Use the `IconName` type for autocomplete.

### Dashboard Icons

```typescript
'revenue'      // Dollar sign
'users'        // Users group
'performance'  // Trending up
'activity'     // Activity pulse
'orders'       // Shopping cart
'goals'        // Target
'views'        // Eye
'time'         // Clock
```

### Chart Icons

```typescript
'line'         // Line chart
'area'         // Area chart
'bar'          // Bar chart
'pie'          // Pie chart
'scatter'      // Scatter chart
'trend'        // Trending up
'decline'      // Trending down
```

### Navigation Icons

```typescript
'home'         // Home
'settings'     // Settings gear
'logout'       // Log out
'menu'         // Menu hamburger
'close'        // X close
'chevronDown'  // Chevron down
'chevronRight' // Chevron right
```

### Status Icons

```typescript
'success'      // Check circle
'error'        // X circle
'warning'      // Alert circle
'alert'        // Alert triangle
'critical'     // Alert octagon
'info'         // Info circle
'help'         // Help circle
```

### Action Icons

```typescript
'download'     // Download
'upload'       // Upload
'share'        // Share
'filter'       // Filter
'search'       // Search
'refresh'      // Refresh
'calendar'     // Calendar
```

### Theme Icons

```typescript
'sun'          // Sun (light mode)
'moon'         // Moon (dark mode)
'device'       // Monitor (system)
```

## Components

### Icon Component

Basic icon with full customization.

```typescript
import { Icon } from '@deskops/design-system';

<Icon
  name="revenue"
  size="lg"              // xs | sm | md | lg | xl | 2xl | 3xl
  color="emerald"        // primary | secondary | tertiary | accent name | custom
  stroke="bold"          // thin | normal | bold | extra
  isDark={true}
  animated={false}
  onClick={() => {}}
  ariaLabel="Revenue icon"
/>
```

### AnimatedIcon Component

Icon with built-in animations.

```typescript
import { AnimatedIcon } from '@deskops/design-system';

<AnimatedIcon
  name="refresh"
  animation="spin"       // pulse | spin | bounce | wave | flip
  duration={2}           // seconds
  size="lg"
  color="violet"
/>
```

### IconButton Component

Interactive button with icon.

```typescript
import { IconButton } from '@deskops/design-system';

<IconButton
  icon="settings"
  onClick={handleSettings}
  variant="ghost"        // ghost | solid | outline | gradient
  size="md"
  color="primary"
  ariaLabel="Open settings"
  disabled={false}
  isDark={true}
/>
```

## Sizes

```typescript
IconSizes.xs   // 12px
IconSizes.sm   // 16px
IconSizes.md   // 20px (default)
IconSizes.lg   // 24px
IconSizes.xl   // 32px
IconSizes['2xl'] // 40px
IconSizes['3xl'] // 48px
```

## Colors

### Theme Colors

```typescript
// Dark theme
IconColors.dark.primary    // rgba(241, 245, 249, 1)
IconColors.dark.secondary  // rgba(203, 213, 225, 1)
IconColors.dark.tertiary   // rgba(148, 163, 184, 1)

// Light theme
IconColors.light.primary   // rgba(15, 23, 42, 1)
```

### Accent Colors

```typescript
IconColors.dark.accent.emerald  // rgba(16, 185, 129, 1)
IconColors.dark.accent.violet   // rgba(139, 92, 246, 1)
IconColors.dark.accent.amber    // rgba(245, 158, 11, 1)
IconColors.dark.accent.blue     // rgba(59, 130, 246, 1)
```

### Status Colors

```typescript
IconColors.dark.status.success   // Green
IconColors.dark.status.warning   // Amber
IconColors.dark.status.critical  // Red
IconColors.dark.status.info      // Blue
```

## Usage Examples

### Metric Card with Icon

```typescript
import { Icon } from '@deskops/design-system';

const MetricCard = ({ value, label, icon, color }) => (
  <div className="glass-container">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon
        name={icon}
        size="xl"
        color={color}
        isDark={true}
        animated
      />
    </div>
  </div>
);
```

### Theme Toggle

```typescript
import { IconButton } from '@deskops/design-system';

const ThemeToggle = ({ isDark, toggle }) => (
  <IconButton
    icon={isDark ? 'sun' : 'moon'}
    onClick={toggle}
    variant="ghost"
    ariaLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
  />
);
```

### Loading Spinner

```typescript
import { AnimatedIcon } from '@deskops/design-system';

const LoadingSpinner = () => (
  <AnimatedIcon
    name="refresh"
    animation="spin"
    duration={1}
    size="lg"
    color="violet"
  />
);
```