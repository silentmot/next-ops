# DeskOps Dashboard Implementation Plan - Part 2

**Continuation from Part 1**

---

#### Task 2.4: Global Search Component

**File**: `components/dashboard/header/GlobalSearch.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 2.4 (Lines 405-577)

**Dimensions & Positioning**:
- Width: 400px (default) → 600px (focused)
- Height: 40px
- Position: After Date Picker, flex-grow
- Max-width: 600px
- Margin-right: auto (pushes right section)

**Structure**:
```css
.global-search {
  width: 400px;
  height: 40px;
  border-radius: 12px;
  padding: 0 48px 0 40px;
  position: relative;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Icon Configuration** (Search):
- Position: Absolute left at 12px
- Size: 20×20px
- Icon: Magnifying glass
- Vertical align: center

**Shortcut Hint** (⌘K):
- Position: Absolute right at 12px
- Font size: 12px
- Border: 1px solid
- Border-radius: 4px
- Padding: 2px 6px
- Height: 20px
- Display: flex, align-items center
- Opacity: 0.5
- Hidden on focus (opacity 0, transition 200ms)

**Input Field**:
- Placeholder: "Search materials, Sites, Dispatches…"
- Font size: 14px
- Border: none
- Background: transparent
- Width: 100%
- Height: 100%

**Interaction States**:
- **Hover**: Cursor text, border opacity increase, icon opacity increase (0.5 → 0.7)
- **Focus**: Width 600px (smooth expansion), border width 2px, focus ring 3px blur, icon opacity 1, shortcut hint fade out (opacity 0), results dropdown appear
- **Active (typing)**: Debounce 300ms after last keystroke, loading indicator replaces search icon, clear button appears if input has value (right side, replaces shortcut)

**Keyboard Shortcut**:
- **Global Trigger**: Cmd+K (Mac) / Ctrl+K (Windows/Linux)
- **Action**: Focus search input from anywhere
- **Animation**: Focus ring pulse (300ms)
- **Scroll behavior**: Scroll to header if needed

**Implementation**:
```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, []);
```

**Search Results Dropdown**:
- **Container Width**: 600px (matches focused search width)
- **Max-height**: 480px
- **Position**: Absolute, top offset 48px (8px gap), left align 0
- **Border-radius**: 16px
- **Padding**: 8px
- **Overflow-y**: auto
- **Z-index**: 110

**Animation**:
- Enter: fade + translateY(-8px to 0)
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Exit: fade + translateY(0 to -8px)

**Content Structure**:
```
┌──────────────────────────────────────┐
│ Recent Searches                      │ ← Section header
├──────────────────────────────────────┤
│ → Production Report Oct 2025         │ ← Item (44px)
│ → ALASLA-29 Inventory                │
├──────────────────────────────────────┤
│ Materials (3)                        │ ← Category header with count
├──────────────────────────────────────┤
│ → Aggregate Base                     │
│ → Crushed Concrete                   │
│ → Recycled Asphalt                   │
├──────────────────────────────────────┤
│ Sites (1)                            │
├──────────────────────────────────────┤
│ → ALASLA-29 - Riyadh North           │
├──────────────────────────────────────┤
│ Dispatches (2)                       │
├──────────────────────────────────────┤
│ → Dispatch #D-2025-1031              │
│ → Dispatch #D-2025-1030              │
├──────────────────────────────────────┤
│ No more results                      │ ← Footer message
└──────────────────────────────────────┘
```

**Section Header**:
```css
.search-section-header {
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}
```

**Category Header** (with count):
```css
.search-category-header {
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Result Item**:
```css
.search-result-item {
  height: 44px;
  padding: 0 12px 0 32px; /* Extra left padding for arrow */
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
}
```

**Item Content Layout**:
- Icon/arrow: 16×16px at left (position absolute, left 12px)
- Primary text: Main content (14px)
- Secondary text: Metadata (12px, opacity 0.7)
- Optional: Right-aligned badge or timestamp

**Item States**:
- Default: Base background
- Hover: Background highlight
- Keyboard focus: Background highlight + focus ring
- Active (clicked): Brief background flash

**Empty State** (no results):
- Height: 200px
- Centered content
- Icon: Search with "X" overlay (48×48px)
- Text: "No results found for '{query}'"
- Secondary text: "Try different keywords"

**Loading State**:
- Height: 200px
- Centered spinner: 32×32px
- Text: "Searching..."

**Search Categories**:
1. Materials (material types, inventory items)
2. Sites (facility locations, site codes)
3. Dispatches (dispatch records, transaction IDs)
4. Production (production records, batch IDs)
5. Equipment (equipment units, IDs)
6. Manpower (role categories, personnel)
7. Reports (saved reports, exports)

**Search Behavior**:
- Type: Full-text fuzzy search
- Min query length: 2 characters
- Debounce: 300ms
- Max results per category: 5
- Total max results: 20

**Data Contract**:
```typescript
interface SearchResult {
  id: string;
  type: 'material' | 'site' | 'dispatch' | 'production' | 'equipment' | 'manpower' | 'report';
  title: string;
  subtitle?: string;
  metadata?: string;
  url: string;
  icon?: string;
}

interface SearchCategory {
  name: string;
  results: SearchResult[];
  totalCount: number;
}

interface SearchResponse {
  query: string;
  categories: SearchCategory[];
  recentSearches?: string[];
  executionTime: number;
}

interface GlobalSearchProps {
  onSearch: (query: string) => Promise<SearchResponse>;
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  debounceMs?: number;
  maxResults?: number;
}
```

**Keyboard Navigation**:
- Arrow Up/Down: Navigate results
- Enter: Select highlighted result
- Escape: Close dropdown
- Tab: Move to next header element
- Cmd/Ctrl + K: Focus from anywhere

---

#### Task 2.5: Theme Toggle Component

**File**: `components/dashboard/header/ThemeToggle.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 2.5 (Lines 579-692)

**Dimensions & Positioning**:
- Size: 40×40px (square touch target)
- Position: Right section, before Clerk
- Margin-left: auto (if space needed)
- Margin-right: 16px

**Structure**:
```css
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
```

**Icon Specifications**:
- Size: 20×20px
- Dark mode icon: Moon
- Light mode icon: Sun
- Position: Centered in button

**Icon Animation**:
- Transition type: Morph between sun/moon
- Duration: 500ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Scale during transition: 1 → 0.8 → 1
- Rotation: 0deg → 180deg

**Interaction States**:
- **Hover**: Cursor pointer, background subtle highlight, scale 1 → 1.05, transition 200ms ease
- **Active (click)**: Scale 1 → 0.95, duration 100ms, spring back to 1
- **Focus (keyboard)**: Focus ring 3px blur, tab accessible

**Tooltip**:
- **Position**: Below button, 8px gap
- **Text**: "Switch to {opposite} theme"
- **Dynamic content**: Updates based on current theme
- **Show delay**: 300ms
- **Hide delay**: 0ms (immediate)
- **Max-width**: 160px
- **Padding**: 8px 12px
- **Border-radius**: 8px
- **Font size**: 12px
- **Arrow**: 8px triangle pointing up

**Example Texts**:
- Dark mode active: "Switch to light theme"
- Light mode active: "Switch to dark theme"

**Theme Toggle Behavior**:
```typescript
interface ThemeConfig {
  mode: 'dark' | 'light';
  persistence: 'localStorage' | 'cookie';
  storageKey: 'theme-preference';
}

const toggleTheme = () => {
  const newMode = currentMode === 'dark' ? 'light' : 'dark';
  setCurrentMode(newMode);
  document.documentElement.setAttribute('data-theme', newMode);
  localStorage.setItem('theme-preference', newMode);
};
```

**Application Scope**:
- Target: `document.documentElement`
- Attribute: `data-theme="dark"` or `data-theme="light"`
- CSS variable updates: Automatic via design tokens
- Transition: All themed elements transition over 300ms

**Initial Load**:
1. Check localStorage for saved preference
2. If not found, use system preference (`prefers-color-scheme`)
3. If system preference unavailable, default to dark
4. Apply theme before first paint (prevent flash)

**Data Contract**:
```typescript
interface ThemeToggleProps {
  currentTheme: 'dark' | 'light';
  onToggle: (newTheme: 'dark' | 'light') => void;
  tooltip?: string;
  disabled?: boolean;
}
```

**Accessibility**:
- ARIA label: "Toggle theme"
- ARIA live region: Announces theme change
- Keyboard: Enter/Space to toggle
- Screen reader: "Theme switched to {mode}"

---

#### Task 2.6: Sidebar Component

**File**: `components/dashboard/Sidebar.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 3 (Lines 694-924)

**Container Properties**:
- **Width expanded**: 240px
- **Width collapsed**: 64px
- **Height**: 100vh - 64px (full height minus header)
- **Position**: Fixed left
- **Top**: 64px (below header)
- **Z-index**: 90

**Layout**:
- Display: Flex column
- Padding: 16px 0
- Gap: 4px (between items)
- Overflow-y: auto
- Overflow-x: hidden

**Visual Treatment**:
- Background: Glass morphism base
- Border-right: 1px solid (from design tokens)
- Backdrop-filter: blur(10px) saturate(180%)

**Transition**:
- Property: width
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Timing: All child elements transition in sync

**Toggle Button**:
- **Position**: Top of sidebar, right-aligned when expanded
- **Dimensions**: 32×32px
- **Margin**: 8px from right edge (expanded) / centered (collapsed)
- **Icon**: Expanded state - Chevron left (collapse icon), Collapsed state - Chevron right (expand icon)
- **Icon Size**: 16×16px
- **Icon Transition**: Rotate 180deg over 300ms
- **States**: Hover (background highlight, scale 1.05), Active (scale 0.95), Focus (focus ring)

**Logo Section**:
- **Expanded State**: Height 64px, padding 0 16px, display flex align-items center, logo image 32×32px, text "DeskOps" next to logo, font size 18px, font weight 700
- **Collapsed State**: Logo only 32×32px centered, text opacity 0 hidden, transition 300ms fade

**Navigation Items**:

**Structure**:
```
┌──────────────────┐
│ [icon] Dashboard │ ← 48px height
│ [icon] Production│
│ [icon] Dispatch  │
│ [icon] Received  │
│ [icon] Equipment │
│ [icon] Manpower  │
│ [icon] Inventory │
│ [icon] Reports   │
│ [icon] Settings  │
└──────────────────┘
```

**Item Specifications** (Expanded):
```css
.nav-item {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  margin: 0 8px;
  cursor: pointer;
  position: relative;
}
```

**Item Specifications** (Collapsed):
```css
.nav-item-collapsed {
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin: 0 8px;
  cursor: pointer;
}
```

**Icon Configuration**:
- Size: 20×20px
- Position: Left-aligned (expanded) / centered (collapsed)
- Stroke-width: 2px
- Transition: None (always visible)

**Text Label**:
- Font size: 14px
- Font weight: 500
- Transition: opacity 300ms
- Expanded: opacity 1, visible
- Collapsed: opacity 0, width 0

**Active State Indicator**:
- Type: Left border (3px width) when expanded
- Position: Absolute left at 0
- Height: 32px (centered vertically)
- Border-radius: 0 4px 4px 0
- Or: Background highlight when collapsed

**Navigation States**:
- **Default**: Base background, icon and text normal opacity
- **Hover**: Background subtle highlight, transition 200ms ease, cursor pointer
- **Active (current route)**: Background emphasis, font weight 600, left border indicator (expanded), icon filled variant instead of outline
- **Focus (keyboard)**: Focus ring 2px, background same as hover
- **Disabled** (insufficient permissions): Opacity 0.4, cursor not-allowed, no hover effect

**Tooltip (Collapsed State)**:
- **Show**: Only when sidebar collapsed
- **Position**: Right of item, 8px gap
- **Content**: Full nav item label
- **Delay**: 300ms
- **Width**: Auto, min 120px
- **Padding**: 8px 12px
- **Font size**: 13px
- **Border-radius**: 8px
- **Arrow**: 6px triangle pointing left

**Navigation Hierarchy** (Source: Section 3.5):

**Main Navigation Items**:
1. Dashboard (route: `/`)
2. Production (route: `/production`)
3. Dispatch (route: `/dispatch`)
4. Received (route: `/received`)
5. Equipment (route: `/equipment`)
6. Manpower (route: `/manpower`)
7. Inventory (route: `/inventory`)
8. Reports (route: `/reports`)
9. Settings (route: `/settings`)

**Section Grouping** (Expanded state visual separators):
- Operations: Dashboard, Production, Dispatch, Received
- Resources: Equipment, Manpower, Inventory
- System: Reports, Settings

**Separator**:
- Height: 1px
- Margin: 8px 16px
- Opacity: 0.1
- Between sections

**Responsive Behavior**:
- **Desktop (>1024px)**: Default expanded, user can toggle to collapsed, preference saved to localStorage
- **Tablet (768-1023px)**: Default collapsed, expands on hover (temporary), collapses when mouse leaves
- **Mobile (<768px)**: Hidden by default, opens as overlay drawer from left, backdrop overlay 50% opacity, swipe gesture close drawer, width 280px (wider than desktop expanded)

**Data Contract**:
```typescript
interface NavItem {
  id: string;
  label: string;
  icon: IconComponent;
  route: string;
  badge?: number | string;
  disabled?: boolean;
  permissions?: string[];
}

interface SidebarProps {
  items: NavItem[];
  currentRoute: string;
  expanded: boolean;
  onToggle: () => void;
  userPermissions: string[];
}
```

**Keyboard Navigation**:
- Tab: Focus first nav item
- Arrow Up/Down: Navigate between items
- Enter/Space: Activate item (navigate to route)
- Ctrl+B: Toggle sidebar expanded/collapsed
- Escape: Close sidebar (mobile)

**Permission-Based Rendering**:
```typescript
const canAccess = (item: NavItem, userPerms: string[]) => {
  if (!item.permissions || item.permissions.length === 0) return true;
  return item.permissions.some(perm => userPerms.includes(perm));
};
```

**Render Behavior**:
- No permission: Item marked disabled
- Item visible but grayed out
- Tooltip: "Contact administrator for access"
- Click: No action, shows permission message

---

### Phase 3: Row 1 - KPI Metric Cards

**Source**: `DeskOps-Dashboard-P1.md` Section 4

#### Task 3.1: MetricCard Component

**File**: `components/dashboard/MetricCard.tsx`

**Source**: `DeskOps-Dashboard-P1.md` Section 4 (Lines 926-1289)

**Container Layout** (Source: Section 4.1):
- **Grid Configuration**: 4 equal cards (each 3 columns of 12-column grid)
- **Gap**: 24px
- **Height**: 140px per card
- **Row margin-bottom**: 24px

**Responsive Breakpoints**:
- Desktop (>1440px): 4 columns (25% each)
- Tablet (1024-1439px): 2 columns (50% each)
- Mobile (<1024px): 1 column (100%)

**Component Structure** (Source: Section 4.2):
```css
.metric-card {
  height: 140px;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
```

**Content Hierarchy**:
```
┌─────────────────────────────────┐
│ Label (14px)                    │ ← 20px height
│ ┌───────────┐   ┌─────────────┐ │
│ │ Value     │   │  Sparkline  │ │ ← 48px height
│ │ (32px)    │   │  (60×30px)  │ │
│ └───────────┘   └─────────────┘ │
│ [↑ +12%]                        │ ← 24px height
└─────────────────────────────────┘
```

**Layout Distribution**:
- Label section: 20px height
- Value + Sparkline: 48px height (flex row, space-between)
- Change badge: 24px height
- Gaps: 12px between sections

**Component Elements** (Source: Section 4.3):

**Label Element**:
```css
.metric-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  opacity: 0.7;
  letter-spacing: 0.25px;
}
```

**Value Element**:
```css
.metric-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  font-feature-settings: 'tnum' on, 'lnum' on; /* Tabular numbers */
}
```

**Number Formatting**:
- Locale: Based on user settings
- Decimal places: 2 (for tons)
- Thousand separator: Comma
- Unit suffix: " TON" (uppercase, opacity 0.7)
- Example: "1,234.56 TON"

**Animated Counter** (Source: Section 4.3):
```typescript
interface CounterProps {
  start: number;
  end: number;
  duration: number; // 1200ms
  format: (value: number) => string;
}

// Animation uses requestAnimationFrame
// Easing: linear (as specified in source)
// Updates: 60fps
```

**Behavior**:
- Start value: 0
- End value: Target metric
- Duration: 1200ms
- Easing: linear
- Trigger: On mount + on data update
- Decimal handling: Rounds appropriately during animation

**Sparkline Chart**:
- **Dimensions**: Width 60px, height 30px
- **Position**: Right side of value row, margin-left auto

**Chart Configuration**:
```typescript
interface SparklineData {
  values: number[]; // 7 data points
  dates: Date[];
}

// Chart type: Line with area fill
// Points: 7 (one per day)
// Line width: 2px
// Area opacity: 0.2
// No axes, no labels
// No grid
```

**Visual Properties**:
- Line: Smooth curve (cardinal spline)
- Points: Hidden by default, show on hover
- Point size: 4px radius
- Hover point size: 6px radius
- Animation: Draw from left to right over 600ms

**Micro-animation**:
- Pulse effect: Every 3s
- Last point pulses
- Scale: 1 → 1.2 → 1
- Duration: 600ms
- Easing: ease-in-out

**Change Badge**:
```css
.change-badge {
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
}
```

**Content Structure**:
- Arrow icon: 12×12px (up or down)
- Percentage text: "+12%" or "-8%"

**Color Coding** (From design tokens):
- Positive change (increase): Success color
- Negative change (decrease): Danger color
- No change: Neutral color

**Icon Mapping**:
- Positive: Arrow up
- Negative: Arrow down
- Zero: Minus icon

**Card States** (Source: Section 4.4):

**Loading State**:
```
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓ (loading bar)        │
│ ▓▓▓▓▓▓▓    ▓▓▓▓▓▓              │
│ ▓▓▓▓                            │
└─────────────────────────────────┘
```

**Skeleton Specifications**:
- Label bar: 120px width, 14px height
- Value bar: 80px width, 32px height
- Sparkline bar: 60px width, 30px height
- Badge bar: 50px width, 20px height
- Border-radius: 4px on all bars
- Animation: Wave effect (2s loop)
- Wave: Shimmer gradient moving left to right

**Wave Animation**:
```css
@keyframes skeleton-wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

**Hover State**:
- **Transform**: Scale 1 → 1.02
- **Transition**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Origin**: center
- **Shadow Enhancement**: Shadow expands, blur radius increases, spread increases, transition 300ms
- **Interactive Feedback**: Cursor pointer (if card is clickable), sparkline show hover point, tooltip show 7-day data breakdown

**Error State**:
- **Visual Treatment**: Border danger color 2px, icon alert triangle (24×24px) centered, text "Failed to load data", retry button secondary style 32px height
- **Error Message Position**: Centered in card, replaces all normal content, font size 14px, opacity 0.7

**Card Variants (Glass Effect)** (Source: Section 4.5):
- **Base Glass Properties**: Background rgba(255, 255, 255, 0.05), border 1px solid rgba(255, 255, 255, 0.1), backdrop-filter blur(10px) saturate(180%), multi-layer shadow
- **Gradient Overlay**: Type linear gradient 45deg, opacity 0.05, position absolute full cover, pointer-events none

**Entrance Animation** (Source: Section 4.6):
- **Stagger Configuration**: Duration per card 400ms, stagger delay 50ms between cards, total sequence 400ms + (50ms × 3) = 550ms, easing cubic-bezier(0.23, 1, 0.320, 1) (Elastic Out)

**Animation Properties**:
```css
@keyframes metric-card-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

**Card Animation Delays**:
- Card 1 (Production): 0ms
- Card 2 (Received): 50ms
- Card 3 (Dispatched): 100ms
- Card 4 (Inventory): 150ms

**Metrics Definitions & Calculations** (Source: Section 4.7):

**Metric 1: Total Production Today**:
- **Label**: "Total Production Today"
- **Calculation**: `SUM(production.quantity) WHERE date = CURRENT_DATE`
- **Data Source**: `production` table
- **Unit**: TON
- **Trend Calculation**: `((today - yesterday) / yesterday) × 100`
- **API Endpoint**: `/api/metrics/production-today`

**Metric 2: Received Materials Today**:
- **Label**: "Received Materials Today"
- **Calculation**: `SUM(received.quantity) WHERE date = CURRENT_DATE`
- **Data Source**: `received` table (CDW Vehicles data)
- **Unit**: TON
- **Trend Calculation**: `((today - yesterday) / yesterday) × 100`
- **API Endpoint**: `/api/metrics/received-today`

**Metric 3: Total Dispatched Today**:
- **Label**: "Total Dispatched Today"
- **Calculation**: `SUM(dispatched.quantity) WHERE date = CURRENT_DATE`
- **Data Source**: `dispatched` table
- **Unit**: TON
- **Trend Calculation**: `((today - yesterday) / yesterday) × 100`
- **API Endpoint**: `/api/metrics/dispatched-today`

**Metric 4: Current Inventory Status**:
- **Label**: "Current Inventory Status"
- **Calculation**: `Closing Inventory = Opening + Production + Received - Dispatched`
- **Data Source**: `inventory` table (latest snapshot)
- **Unit**: TON
- **Trend Calculation**: `((current - previous_snapshot) / previous_snapshot) × 100`
- **API Endpoint**: `/api/metrics/inventory-current`

**Response Format** (All metrics):
```typescript
interface MetricResponse {
  value: number;          // Current value in TON
  previousValue: number;  // Yesterday's value or previous snapshot
  change: number;         // Percentage change
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];    // Last 7 days
}

// Inventory metric includes additional breakdown:
interface InventoryMetricResponse extends MetricResponse {
  breakdown: {
    opening: number;
    production: number;
    received: number;
    dispatched: number;
  };
}
```

**Data Refresh** (Source: Section 4.8):
- **Polling Strategy**: Interval 60 seconds (1 minute), method background fetch, update smooth transition not jarring reload
- **Optimistic Updates**: When user creates new production/dispatch/received record, immediately reflect in relevant KPI, animate counter to new value, revert if API call fails
- **Cache Strategy**: Cache duration 30 seconds, stale-while-revalidate (show cached, fetch fresh in background), cache key `kpi-{metric-name}-{site-id}-{date}`

---

**(Plan continues in Part 3...)**
