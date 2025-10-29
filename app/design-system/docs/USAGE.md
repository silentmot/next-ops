# Usage Guide

Comprehensive guide for using the DeskOps Design System.

## Installation

```bash
# Install peer dependencies
npm install lucide-react framer-motion

# Design system is already part of the workspace
```

## Importing

```typescript
// Import tokens
import {
  colors,
  spacing,
  typography,
  shadows,
  animations
} from '@deskops/design-system';

// Import icons
import {
  Icon,
  AnimatedIcon,
  IconButton,
  IconName,
  IconSize
} from '@deskops/design-system';

// Import styles
import '@deskops/design-system/styles';
```

## Building a Dashboard Card

### Step 1: Create Base Component

```typescript
import { colors, spacing, shadows } from '@deskops/design-system';
import { Icon } from '@deskops/design-system';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: IconName;
  isDark: boolean;
}

export const MetricCard = ({ title, value, change, icon, isDark }: MetricCardProps) => {
  const theme = isDark ? colors.dark : colors.light;
  const isPositive = change >= 0;

  return (
    <div
      className="glass-container"
      style={{
        backgroundColor: theme.background.secondary,
        padding: spacing.lg,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: theme.text.secondary }}>{title}</p>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: theme.text.primary
          }}>
            {value}
          </h3>
          <p style={{
            color: isPositive ? theme.status.success : theme.status.critical
          }}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        </div>
        <Icon
          name={icon}
          size="xl"
          color="emerald"
          isDark={isDark}
          animated
        />
      </div>
    </div>
  );
};
```

### Step 2: Add to Dashboard

```typescript
import { MetricCard } from './MetricCard';

export const Dashboard = () => {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231"
        change={12.5}
        icon="revenue"
        isDark={isDark}
      />
      <MetricCard
        title="Active Users"
        value="2,345"
        change={-3.2}
        icon="users"
        isDark={isDark}
      />
    </div>
  );
};
```

## Using Glass Effects

```tsx
import '@deskops/design-system/styles';

// Method 1: CSS Classes
<div className="glass-container glow-emerald">
  Content with glass effect
</div>

// Method 2: Custom Styles
import { shadows } from '@deskops/design-system';

<div style={{
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  boxShadow: shadows.glass.default,
  borderRadius: '20px',
  padding: '24px',
}}>
  Custom glass container
</div>
```

## Animations

### Using Framer Motion

```typescript
import { motion } from 'framer-motion';
import { animations } from '@deskops/design-system';

const AnimatedCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: parseFloat(animations.duration.slow) / 1000,
      ease: animations.easing.elastic
    }}
    whileHover={{
      scale: parseFloat(animations.scale.hover)
    }}
    className="glass-container"
  >
    Content
  </motion.div>
);
```

### Using CSS Classes

```tsx
<div className="animate-fade-in stagger-1">
  Fades in with delay
</div>
```

## Theme System

### Creating Theme Provider

```typescript
import { createContext, useContext, useState } from 'react';
import { colors, ColorTheme } from '@deskops/design-system';

const ThemeContext = createContext<{
  theme: ColorTheme;
  toggleTheme: () => void;
  colors: typeof colors.dark | typeof colors.light;
}>({
  theme: 'dark',
  toggleTheme: () => {},
  colors: colors.dark,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors }}>
      <div style={{
        backgroundColor: themeColors.background.primary,
        minHeight: '100vh',
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### Using Theme in Components

```typescript
import { useTheme } from './ThemeProvider';
import { IconButton } from '@deskops/design-system';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header>
      <h1>Dashboard</h1>
      <IconButton
        icon={theme === 'dark' ? 'sun' : 'moon'}
        onClick={toggleTheme}
        ariaLabel="Toggle theme"
        variant="ghost"
      />
    </header>
  );
};
```

## Best Practices

### Type Safety

```typescript
// ✅ Good: Use design token types
import { IconName, IconSize, ColorTheme } from '@deskops/design-system';

interface Props {
  icon: IconName;      // Type-safe icon names
  size: IconSize;      // Type-safe sizes
  theme: ColorTheme;   // Type-safe theme
}

// ❌ Bad: Using string literals
interface Props {
  icon: string;
  size: string;
  theme: string;
}
```

### Token Usage

```typescript
// ✅ Good: Import from single source
import { colors, spacing } from '@deskops/design-system';

const style = {
  color: colors.dark.text.primary,
  padding: spacing.lg,
};

// ❌ Bad: Hardcoding values
const style = {
  color: 'rgba(241, 245, 249, 1)',
  padding: '24px',
};
```

### Icon Selection

```typescript
// ✅ Good: Semantic icon names
<Icon name="revenue" />     // Clear purpose
<Icon name="success" />     // Clear status

// ❌ Bad: Generic names
<Icon name="icon1" />       // Not descriptive
```
<!--markdownlint-disable MD029-->
## Performance Tips

1. **Import only what you need**

```typescript
// ✅ Good
import { colors, spacing } from '@deskops/design-system';

// ❌ Bad
import * as designSystem from '@deskops/design-system';
```

2. **Memoize expensive calculations**

```typescript
import { useMemo } from 'react';
import { colors } from '@deskops/design-system';

const MyComponent = ({ isDark }) => {
  const theme = useMemo(
    () => isDark ? colors.dark : colors.light,
    [isDark]
  );

  return <div style={{ color: theme.text.primary }}>Content</div>;
};
```

3. **Use CSS classes for static styles**

```tsx
// ✅ Good: CSS classes
<div className="glass-container glow-emerald" />

// ❌ Bad: Inline styles for repeated elements
<div style={{
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  // ... many more lines
}} />
```
