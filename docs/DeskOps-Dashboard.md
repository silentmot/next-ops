# DeskOps Dashboard Complete Specification
<!--markdownlint-disable-file-->
**Using the current design system and tech stack, create a production-ready operational dashboard for the DeskOps system.**

## **DON'T MAKE ANY ASSUMPTIONS**

- Always check for existing code before creating new code or adding new features **AVOID DUPLICATION**.
- Use `bun` Never use `npm` or `yarn`
- Use `bunx` to run commands
- For linting and formatting use `biome` With `bunx biome {command}`
- For Prisma use `bunx prisma {command}` direct CLI Commands
- For icons use `lucide-react` or `iconify` (check `@lib/icons`) Check for existing icons before creating new ones
- For charts use `recharts`
- For animations use `framer-motion`
- For state management use `zustand`
- For validation use `zod`
- For styling use `tailwindcss`
- **NO Hardcoded Styling/colors/etc** Use DesignTokens.ts and globals.css for all values
- **NO Random Data/Information** Use SSOT constants for all data `@lib/constants`, `@lib/utils`, `@lib/types`, and Prisma Schemas (Also the backend API Endpoints is fully implemnted)

 **Current Project Tech Stack**:

- Next.js 16+ with App Router
- Tailwind CSS v4 with @import syntax
- TypeScript 5.9+
- Prisma 6.18+
- Clerk 6.34+
- Recharts 3.3+
- Framer Motion 12.23+
- Lucide React 0.552+
- Zustand 5.0+
- Biome 2.3+
- Zod 4.1+

---

## **1. LAYOUT ARCHITECTURE**

### 1.1 Container System

```typescript
// Layout Constants (SSOT)
const LAYOUT_CONFIG = {
  viewport: {
    minWidth: 320,
    maxWidth: 1920
  },
  sidebar: {
    expanded: 240,
    collapsed: 64,
    transition: 300
  },
  header: {
    height: 64,
    zIndex: 100
  },
  content: {
    padding: 24,
    gap: 24,
    rowGap: 24
  },
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1440,
    wide: 1920
  }
};
```

### 1.2 Grid System

**Desktop (>1440px)**: 12-column grid
**Tablet (1024-1439px)**: 8-column grid
**Mobile (<1024px)**: 4-column grid

**Grid Properties**:

- Column gap: 24px
- Row gap: 24px
- Container padding: 24px
- Grid template columns: `repeat(12, minmax(0, 1fr))`

### 1.3 Dashboard Structure

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (64px fixed)                                     │
├──┬──────────────────────────────────────────────────────┤
│  │ ROW 1: KPI Cards (140px)                            │
│  │ ┌──────┬──────┬──────┬──────┐                       │
│S │ │ KPI1 │ KPI2 │ KPI3 │ KPI4 │                       │
│I │ └──────┴──────┴──────┴──────┘                       │
│D │                                                      │
│E │ ROW 2: Trend Charts (400px)                         │
│B │ ┌──────────────────┬────────────┐                  │
│A │ │ Inventory        │ Production │                  │
│R │ │ Levels           │ vs Target  │                  │
│  │ └──────────────────┴────────────┘                  │
│2 │                                                      │
│4 │ ROW 3: Utilization Metrics (350px)                  │
│0 │ ┌─────────────────┬─────────────────────┬─────┐   │
│p │ │ Manpower        │ Equipment           │ KPI │   │
│x │ │ Attendance      │ Utilization         │     │   │
│  │ └─────────────────┴─────────────────────┴─────┘   │
│  │                                                      │
│  │ ROW 4: Flow Analysis (400px)                        │
│  │ ┌──────────────────┬────────────┐                  │
│  │ │ Received vs      │ Recycling  │                  │
│  │ │ Dispatched       │ Rate       │                  │
│  │ └──────────────────┴────────────┘                  │
│  │                                                      │
│  │ ROW 5: Detail Tables (min 500px)                    │
│  │ ┌─────────────────────────────────────────────────┐│
│  │ │ [Movements] [Equipment] [Manpower]              ││
│  │ │ ───────────────────────────────────             ││
│  │ │ Paginated Data Table                            ││
│  │ └─────────────────────────────────────────────────┘│
└──┴──────────────────────────────────────────────────────┘
```

---

## **2. HEADER (TOP BAR) SPECIFICATION**

**Source**: User-provided header layout specification

### 2.1 Container Properties

**Dimensions**:

- Height: 64px (fixed)
- Width: 100% viewport width
- Position: Sticky top
- Z-index: 100

**Layout**:

- Display: Flex
- Justify-content: space-between
- Align-items: center
- Padding: 0 24px
- Gap: 16px

**Visual Treatment**:

- Background: Glass morphism base (from GlassContainer)
- Border-bottom: 1px solid (border color from design tokens)
- Backdrop-filter: blur(10px) saturate(180%)

**Structure**:

```
┌────────────────────────────────────────────────────────────────┐
│ [Site Selector] [Date Picker] [Global Search] {Theme} [Clerk] │
└────────────────────────────────────────────────────────────────┘
```

**Layout Distribution**:

- Left section (68%): Site Selector + Date Picker + Global Search
- Right section (32%): Theme Toggle + Clerk Component

---

### 2.2 Site Selector Component

#### Dimensions & Positioning

- Width: 200px (fixed)
- Height: 40px
- Position: Leftmost element
- Margin-right: 16px

#### Structure

**Default State**:

```css
.site-selector {
  width: 200px;
  height: 40px;
  border-radius: 12px;
  padding: 0 12px 0 40px;
  position: relative;
}
```

**Icon Configuration**:

- Position: Absolute left at 12px
- Size: 20×20px
- Icon: Building/location marker
- Vertical align: center

**Text Content**:

- Placeholder text: "Select site..."
- Selected text: Site code (e.g., "ALASLA-29")
- Font size: 14px
- Font weight: 500
- Text overflow: ellipsis
- White-space: nowrap

#### Interaction States

**Hover**:

- Cursor: pointer
- Transition: 200ms ease-in-out
- Border opacity increase
- Background opacity increase

**Focus/Active**:

- Border width: 2px
- Focus ring: 3px blur
- Dropdown trigger: Opens below

**Disabled**:

- Cursor: not-allowed
- Opacity: 0.5
- Pointer-events: none

#### Dropdown Specifications

**Container**:

- Width: 280px
- Max-height: 400px
- Position: Absolute
- Top offset: 48px (8px gap from trigger)
- Left align: 0
- Border-radius: 12px
- Overflow-y: auto
- Z-index: 110

**Animation**:

- Enter: fade + translateY(-8px to 0)
- Duration: 200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Exit: fade + translateY(0 to -8px)

**Item Structure**:

```css
.site-option {
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Item Content Layout**:

- Left: Site code (primary text)
- Right: Checkmark icon (if selected) 20×20px
- Optional: Status badge (8px dot indicator)

**Item States**:

- Default: Base background
- Hover: Background highlight, cursor pointer
- Selected: Background emphasis, font weight 600, checkmark visible
- Focus (keyboard): Focus ring, background highlight

#### Data Contract

```typescript
interface Site {
  id: string;
  code: string;          // Display value: "ALASLA-29"
  name: string;          // Full name for tooltip
  status: "active" | "inactive";
  location?: string;
}

interface SiteSelectorProps {
  sites: Site[];
  selectedSiteId: string | null;
  onSiteChange: (siteId: string) => void;
  loading?: boolean;
  disabled?: boolean;
}
```

#### Keyboard Navigation

- Tab: Focus selector
- Enter/Space: Open dropdown
- Arrow Up/Down: Navigate options
- Enter: Select option
- Escape: Close dropdown

---

### 2.3 Date Picker Component

#### Dimensions & Positioning

- Width: 180px (default) → 320px (range mode open)
- Height: 40px
- Position: After Site Selector
- Margin-right: 16px

#### Structure

**Default State**:

```css
.date-picker {
  width: 180px;
  height: 40px;
  border-radius: 12px;
  padding: 0 12px 0 40px;
  position: relative;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Icon Configuration**:

- Position: Absolute left at 12px
- Size: 20×20px
- Icon: Calendar
- Vertical align: center

**Text Display**:

- Placeholder: "Select date..."
- Single date format: "Oct 31, 2025"
- Range format: "Oct 1 - Oct 31, 2025"
- Font size: 14px
- Font weight: 500
- Text overflow: ellipsis

#### Interaction States

**Hover**:

- Cursor: pointer
- Transition: 200ms ease-in-out
- Border opacity increase
- Background opacity increase

**Focus/Active**:

- Border width: 2px
- Focus ring: 3px blur
- Width expansion (if range mode): 180px → 320px
- Calendar dropdown opens

#### Calendar Dropdown Specifications

**Container**:

- Width: 320px (single mode) / 640px (range mode)
- Position: Absolute
- Top offset: 48px
- Right align: 0
- Border-radius: 16px
- Padding: 16px
- Z-index: 110

**Animation**:

- Enter: scale(0.95) + fade
- Duration: 250ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Exit: scale(0.95) + fade

**Calendar Layout Structure**:

```
┌──────────────────────────────┐
│  [◀] October 2025 [▶]       │ ← Month navigation (44px height)
├──────────────────────────────┤
│ Su Mo Tu We Th Fr Sa        │ ← Weekday header (32px height)
│          1  2  3  4  5       │
│  6  7  8  9 10 11 12        │
│ 13 14 15 16 17 18 19        │
│ 20 21 22 23 24 25 26        │
│ 27 28 29 30 [31]            │ ← Day cells (40×40px each)
├──────────────────────────────┤
│ [Today] [Clear] [Apply]     │ ← Actions (44px height)
└──────────────────────────────┘
```

**Month Navigation**:

- Height: 44px
- Prev/Next arrows: 32×32px touch targets
- Month label: Font size 16px, font weight 600
- Centered text between arrows

**Weekday Header**:

- Height: 32px
- Font size: 12px
- Font weight: 600
- Text transform: uppercase
- Letter spacing: 0.5px

**Day Cell**:

```css
.day-cell {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
}
```

**Day Cell States**:

- Default: Base background
- Hover: Background highlight
- Today: Border 2px solid
- Selected: Background emphasis, font weight 600
- Disabled (other month): Opacity 0.3, cursor not-allowed
- In range (range mode): Light background fill

**Action Buttons** (Bottom row):

- Height: 44px total
- Padding: 12px
- Gap: 8px between buttons
- Button height: 32px

**Button Specifications**:

- "Today": Jump to current date, secondary style
- "Clear": Reset selection, ghost style
- "Apply": Confirm selection (range mode only), primary style
- Min-width: 80px each
- Border-radius: 8px

#### Range Selection Mode

**Activation**:

- Toggle switch in dropdown header
- Label: "Single Date" / "Date Range"
- Width expands to 640px when activated

**Range Selection Behavior**:

1. First click: Set start date (solid highlight)
2. Hover after first click: Preview end date (dashed outline)
3. Hover between dates: Preview range fill
4. Second click: Set end date (solid highlight)
5. All dates between: Background fill

**Visual Indicators**:

- Start date: Left-rounded background
- End date: Right-rounded background
- In-range dates: Full-width background, no border-radius
- Hover preview: Dashed border

**Range Presets** (Optional sidebar, 120px width):

- Today
- Last 7 Days
- Last 30 Days
- This Month
- Last Month
- Custom
- Each preset: 32px height, 8px padding

#### Data Contract

```typescript
type DateMode = "single" | "range";

interface DateSelection {
  mode: DateMode;
  start: Date;
  end?: Date;
}

interface DatePickerProps {
  mode: DateMode;
  value: DateSelection | null;
  onChange: (selection: DateSelection) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  showPresets?: boolean;
  loading?: boolean;
  disabled?: boolean;
}
```

#### Keyboard Navigation

- Tab: Focus date picker
- Enter/Space: Open calendar
- Arrow keys: Navigate days
- Shift + Arrow keys: Navigate weeks
- Page Up/Down: Navigate months
- Home/End: First/last day of month
- Enter: Select date
- Escape: Close calendar

---

### 2.4 Global Search Component

#### Dimensions & Positioning

- Width: 400px (default) → 600px (focused)
- Height: 40px
- Position: After Date Picker, flex-grow
- Max-width: 600px
- Margin-right: auto (pushes right section)

#### Structure

**Default State**:

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

#### Interaction States

**Hover**:

- Cursor: text
- Border opacity increase
- Icon opacity increase (0.5 → 0.7)

**Focus**:

- Width: 600px (smooth expansion)
- Border width: 2px
- Focus ring: 3px blur
- Icon opacity: 1
- Shortcut hint: Fade out (opacity 0)
- Results dropdown: Appear

**Active (typing)**:

- Debounce: 300ms after last keystroke
- Loading indicator: Replaces search icon
- Clear button: Appears if input has value (right side, replaces shortcut)

#### Keyboard Shortcut

**Global Trigger**:

- Keys: Cmd+K (Mac) / Ctrl+K (Windows/Linux)
- Action: Focus search input from anywhere
- Animation: Focus ring pulse (300ms)
- Scroll behavior: Scroll to header if needed

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

#### Search Results Dropdown

**Container**:

- Width: 600px (matches focused search width)
- Max-height: 480px
- Position: Absolute
- Top offset: 48px (8px gap)
- Left align: 0
- Border-radius: 16px
- Padding: 8px
- Overflow-y: auto
- Z-index: 110

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

#### Search Categories

**Supported Entity Types**:

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

#### Data Contract

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

#### Keyboard Navigation

- Arrow Up/Down: Navigate results
- Enter: Select highlighted result
- Escape: Close dropdown
- Tab: Move to next header element
- Cmd/Ctrl + K: Focus from anywhere

---

### 2.5 Theme Toggle Component

#### Dimensions & Positioning

- Size: 40×40px (square touch target)
- Position: Right section, before Clerk
- Margin-left: auto (if space needed)
- Margin-right: 16px

#### Structure

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

#### Interaction States

**Hover**:

- Cursor: pointer
- Background: Subtle highlight
- Scale: 1 → 1.05
- Transition: 200ms ease

**Active (click)**:

- Scale: 1 → 0.95
- Duration: 100ms
- Spring back to 1

**Focus (keyboard)**:

- Focus ring: 3px blur
- Tab accessible

#### Tooltip

**Configuration**:

- Position: Below button, 8px gap
- Text: "Switch to {opposite} theme"
- Dynamic content: Updates based on current theme
- Show delay: 300ms
- Hide delay: 0ms (immediate)
- Max-width: 160px
- Padding: 8px 12px
- Border-radius: 8px
- Font size: 12px
- Arrow: 8px triangle pointing up

**Example Texts**:

- Dark mode active: "Switch to light theme"
- Light mode active: "Switch to dark theme"

#### Theme Toggle Behavior

**State Management**:

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

#### Data Contract

```typescript
interface ThemeToggleProps {
  currentTheme: 'dark' | 'light';
  onToggle: (newTheme: 'dark' | 'light') => void;
  tooltip?: string;
  disabled?: boolean;
}
```

#### Accessibility

- ARIA label: "Toggle theme"
- ARIA live region: Announces theme change
- Keyboard: Enter/Space to toggle
- Screen reader: "Theme switched to {mode}"

---

### 2.6 Clerk Component

#### Dimensions & Positioning

- Size: 40×40px (avatar size)
- Position: Rightmost element
- Margin-left: 16px

#### Component Integration

**Clerk Configuration**:

```typescript
<UserButton
  appearance={{
    elements: {
      avatarBox: {
        width: 40,
        height: 40,
        borderRadius: 10
      }
    }
  }}
  afterSignOutUrl="/"
  showName={false}
/>
```

**Avatar Specifications**:

- Size: 40×40px
- Border-radius: 10px (rounded square)
- Border: 2px solid (from design tokens)
- Cursor: pointer

**Dropdown Trigger**:

- Click avatar: Opens user menu
- Position: Below avatar, right-aligned
- Top offset: 8px gap

**Dropdown Menu Structure**:

```
┌──────────────────────────┐
│ User Name                │ ← Header (48px)
│ user@email.com           │
├──────────────────────────┤
│ → Profile                │ ← Menu items (44px each)
│ → Settings               │
│ → Notifications          │
├──────────────────────────┤
│ → Sign Out               │ ← Danger zone
└──────────────────────────┘
```

**Menu Specifications**:

- Width: 240px
- Max-height: 400px
- Border-radius: 12px
- Padding: 8px
- Z-index: 110

**Menu Item**:

- Height: 44px
- Padding: 0 12px
- Border-radius: 8px
- Display: flex, align-items center
- Gap: 12px (icon to text)
- Cursor: pointer

**Menu Item States**:

- Default: Base background
- Hover: Background highlight
- Focus: Background highlight + focus ring
- Active: Brief background flash

#### Data Flow

**User Data Source**:

```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
  permissions: string[];
}
```

**Session Management**:

- Provider: Clerk
- Token: Stored in httpOnly cookie
- Refresh: Automatic via Clerk SDK
- Expiration: Configured in Clerk dashboard

---

## **3. SIDEBAR NAVIGATION SPECIFICATION**

**Source**: Original document + enhanced to match header detail level

### 3.1 Container Properties

**Dimensions**:

- Width expanded: 240px
- Width collapsed: 64px
- Height: 100vh - 64px (full height minus header)
- Position: Fixed left
- Top: 64px (below header)
- Z-index: 90

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

### 3.2 Toggle Button

**Position**: Top of sidebar, right-aligned when expanded
**Dimensions**: 32×32px
**Margin**: 8px from right edge (expanded) / centered (collapsed)

**Icon**:

- Expanded state: Chevron left (collapse icon)
- Collapsed state: Chevron right (expand icon)
- Size: 16×16px
- Transition: Rotate 180deg over 300ms

**States**:

- Hover: Background highlight, scale 1.05
- Active: Scale 0.95
- Focus: Focus ring

### 3.3 Logo Section

**Expanded State**:

- Height: 64px
- Padding: 0 16px
- Display: flex, align-items center
- Logo image: 32×32px
- Text: "DeskOps" next to logo
- Font size: 18px
- Font weight: 700

**Collapsed State**:

- Logo only: 32×32px centered
- Text: opacity 0, hidden
- Transition: 300ms fade

### 3.4 Navigation Items

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

#### Navigation States

**Default**:

- Base background
- Icon and text normal opacity

**Hover**:

- Background: Subtle highlight
- Transition: 200ms ease
- Cursor: pointer

**Active (current route)**:

- Background: Emphasis
- Font weight: 600
- Left border indicator (expanded)
- Icon: Filled variant instead of outline

**Focus (keyboard)**:

- Focus ring: 2px
- Background: Same as hover

**Disabled** (insufficient permissions):

- Opacity: 0.4
- Cursor: not-allowed
- No hover effect

#### Tooltip (Collapsed State)

**Configuration**:

- Show: Only when sidebar collapsed
- Position: Right of item, 8px gap
- Content: Full nav item label
- Delay: 300ms
- Width: Auto, min 120px
- Padding: 8px 12px
- Font size: 13px
- Border-radius: 8px
- Arrow: 6px triangle pointing left

### 3.5 Navigation Hierarchy

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

### 3.6 Responsive Behavior

**Desktop (>1024px)**:

- Default: Expanded
- User can toggle to collapsed
- Preference saved to localStorage

**Tablet (768-1023px)**:

- Default: Collapsed
- Expands on hover (temporary)
- Collapses when mouse leaves

**Mobile (<768px)**:

- Hidden by default
- Opens as overlay drawer from left
- Backdrop overlay: 50% opacity
- Swipe gesture: Close drawer
- Width: 280px (wider than desktop expanded)

### 3.7 Data Contract

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

### 3.8 Keyboard Navigation

- Tab: Focus first nav item
- Arrow Up/Down: Navigate between items
- Enter/Space: Activate item (navigate to route)
- Ctrl+B: Toggle sidebar expanded/collapsed
- Escape: Close sidebar (mobile)

### 3.9 Permission-Based Rendering

**Logic**:

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

## **4. ROW 1: KPI METRIC CARDS**

**Source**: Original document "Sample Metrics" section + enhanced specifications

### 4.1 Container Layout

**Grid Configuration**:

- Columns: 4 equal cards (each 3 columns of 12-column grid)
- Gap: 24px
- Height: 140px per card
- Row margin-bottom: 24px

**Responsive Breakpoints**:

- Desktop (>1440px): 4 columns (25% each)
- Tablet (1024-1439px): 2 columns (50% each)
- Mobile (<1024px): 1 column (100%)

### 4.2 MetricCard Component Structure

**Dimensions**:

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

### 4.3 Component Elements

#### Label Element

```css
.metric-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  opacity: 0.7;
  letter-spacing: 0.25px;
}
```

**Content**: Descriptive text (e.g., "Total Production Today")

#### Value Element

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

**Example**: "1,234.56 TON"

#### Animated Counter

**Implementation**:

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

#### Sparkline Chart

**Dimensions**:

- Width: 60px
- Height: 30px
- Position: Right side of value row
- Margin-left: auto

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

**Micro-animation** (Source specified):

- Pulse effect: Every 3s
- Last point pulses
- Scale: 1 → 1.2 → 1
- Duration: 600ms
- Easing: ease-in-out

#### Change Badge

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

### 4.4 Card States

#### Loading State

**Skeleton Structure**:

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
- Animation: Wave effect (source specified 2s loop)
- Wave: Shimmer gradient moving left to right

**Wave Animation**:

```css
@keyframes skeleton-wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

#### Hover State

**Transform**:

- Scale: 1 → 1.02 (source specified)
- Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Origin: center

**Shadow Enhancement**:

- Shadow: Expands (source: "glow on hover")
- Blur radius: Increases
- Spread: Increases
- Transition: 300ms

**Interactive Feedback**:

- Cursor: pointer (if card is clickable)
- Sparkline: Show hover point
- Tooltip: Show 7-day data breakdown

#### Error State

**Visual Treatment**:

- Border: Danger color, 2px
- Icon: Alert triangle (24×24px) centered
- Text: "Failed to load data"
- Retry button: Secondary style, 32px height

**Error Message Position**:

- Centered in card
- Replaces all normal content
- Font size: 14px
- Opacity: 0.7

### 4.5 Card Variants (Glass Effect)

**Base Glass Properties** (Source: GlassContainer spec):

- Background: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Backdrop-filter: blur(10px) saturate(180%)
- Multi-layer shadow: Source specified

**Gradient Overlay** (Source specified):

- Type: Linear gradient 45deg
- Opacity: 0.05
- Position: Absolute, full cover
- Pointer-events: none

### 4.6 Entrance Animation

**Stagger Configuration** (Source: Animation specs):

- Duration per card: 400ms
- Stagger delay: 50ms between cards
- Total sequence: 400ms + (50ms × 3) = 550ms
- Easing: cubic-bezier(0.23, 1, 0.320, 1) (Source: Elastic Out)

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

### 4.7 Metrics Definitions & Calculations

**Source**: Document "Sample Metrics" section

#### Metric 1: Total Production Today

**Label**: "Total Production Today"
**Calculation**: `SUM(production.quantity) WHERE date = CURRENT_DATE`
**Data Source**: `production` table
**Unit**: TON
**Trend Calculation**: `((today - yesterday) / yesterday) × 100`

**API Endpoint**: `/api/metrics/production-today`
**Response Format**:

```typescript
{
  value: number;          // Current value in TON
  previousValue: number;  // Yesterday's value
  change: number;         // Percentage change
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];    // Last 7 days
}
```

#### Metric 2: Received Materials Today

**Label**: "Received Materials Today"
**Calculation**: `SUM(received.quantity) WHERE date = CURRENT_DATE`
**Data Source**: `received` table (CDW Vehicles data)
**Unit**: TON
**Trend Calculation**: `((today - yesterday) / yesterday) × 100`

**API Endpoint**: `/api/metrics/received-today`
**Response Format**: Same as Metric 1

#### Metric 3: Total Dispatched Today

**Label**: "Total Dispatched Today"
**Calculation**: `SUM(dispatched.quantity) WHERE date = CURRENT_DATE`
**Data Source**: `dispatched` table
**Unit**: TON
**Trend Calculation**: `((today - yesterday) / yesterday) × 100`

**API Endpoint**: `/api/metrics/dispatched-today`
**Response Format**: Same as Metric 1

#### Metric 4: Current Inventory Status

**Label**: "Current Inventory Status"
**Calculation** (Source: Inventory formula):

```
Closing Inventory = Opening + Production + Received - Dispatched
```

**Data Source**: `inventory` table (latest snapshot)
**Unit**: TON
**Trend Calculation**: `((current - previous_snapshot) / previous_snapshot) × 100`

**API Endpoint**: `/api/metrics/inventory-current`
**Response Format**: Same as Metric 1, plus:

```typescript
{
  // ... standard fields
  breakdown: {
    opening: number;
    production: number;
    received: number;
    dispatched: number;
  }
}
```

### 4.8 Data Refresh

**Polling Strategy**:

- Interval: 60 seconds (1 minute)
- Method: Background fetch
- Update: Smooth transition, not jarring reload

**Optimistic Updates**:

- When user creates new production/dispatch/received record
- Immediately reflect in relevant KPI
- Animate counter to new value
- Revert if API call fails

**Cache Strategy**:

- Cache duration: 30 seconds
- Stale-while-revalidate: Show cached, fetch fresh in background
- Cache key: `kpi-{metric-name}-{site-id}-{date}`

---

## **5. ROW 2: TREND CHARTS**

**Source**: Original document charts specification + enhanced to match header detail

### 5.1 Container Layout

**Grid Configuration**:

- Left chart: 7 columns (58%)
- Right chart: 5 columns (42%)
- Gap: 24px
- Height: 400px
- Row margin-bottom: 24px

**Responsive Breakpoints**:

- Desktop (>1440px): Side by side (7 + 5 columns)
- Tablet (1024-1439px): Stack vertically (12 columns each)
- Mobile (<1024px): Stack vertically (12 columns each)

### 5.2 ChartCard Component Structure

**Dimensions**:

```css
.chart-card {
  height: 400px;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

**Content Layout**:

```
┌─────────────────────────────────────┐
│ Header Section (48px)               │
│ ┌─────┐ Title           [Export]   │
│ │ Icon│ Description                │
│ └─────┘                             │
├─────────────────────────────────────┤
│                                     │
│     Chart Render Area (308px)      │
│     (ResponsiveContainer)           │
│                                     │
└─────────────────────────────────────┘
```

#### Header Section

**Structure**:

```css
.chart-header {
  height: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
```

**Left Side** (Title + Icon):

```css
.chart-title-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.chart-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-icon svg {
  width: 20px;
  height: 20px;
}
```

**Title Text**:

```css
.chart-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 4px;
}

.chart-description {
  font-size: 13px;
  line-height: 18px;
  opacity: 0.7;
}
```

**Right Side** (Export Button):

```css
.chart-export-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.chart-export-button svg {
  width: 16px;
  height: 16px;
}
```

**Export Button States**:

- Hover: Background highlight, scale 1.05
- Active: Scale 0.95
- Loading: Spinner replaces icon
- Tooltip: "Export chart data"

#### Chart Container

**Recharts Configuration**:

```typescript
<ResponsiveContainer width="100%" height={308}>
  <ChartType
    data={chartData}
    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
  >
    {/* Chart elements */}
  </ResponsiveContainer>
</ResponsiveContainer>
```

**Universal Chart Properties**:

- CartesianGrid: Dashed strokes, opacity 0.1
- Tooltip: Custom styled (see Tooltip section)
- Legend: Bottom positioned, toggleable
- Brush: Enabled for zoom on time-series

### 5.3 Left Chart: Inventory Levels (All Materials)

**Source**: Document specifies "Area Chart (Daily inventory by material over 30 days)"

#### Chart Type & Configuration

**Type**: AreaChart (Stacked)
**Data**: 30-day daily inventory by material category
**Time Range**: Last 30 days from selected date

**Recharts Implementation**:

```typescript
<AreaChart data={inventoryData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    type="category"
    tickFormatter={(date) => format(date, 'MMM dd')}
    interval="preserveStartEnd"
  />
  <YAxis
    tickFormatter={(value) => `${value} T`}
    width={60}
  />
  <Tooltip content={<CustomTooltip />} />
  <Legend
    verticalAlign="bottom"
    height={36}
    onClick={handleLegendClick}
  />
  <Brush
    dataKey="date"
    height={30}
    stroke="#8884d8"
  />
  {materials.map((material, index) => (
    <Area
      key={material.id}
      type="monotone"
      dataKey={material.name}
      stackId="1"
      stroke={CHART_COLORS[index]}
      fill={CHART_COLORS[index]}
      fillOpacity={0.6}
    />
  ))}
</AreaChart>
```

#### Data Structure

```typescript
interface InventoryDataPoint {
  date: string;           // ISO date string
  [materialType: string]: number | string; // Dynamic material keys
}

// Example:
[
  {
    date: '2025-10-01',
    'Aggregate Base': 1234.56,
    'Crushed Concrete': 2345.67,
    'Recycled Asphalt': 3456.78,
    // ... other materials
  },
  // ... 30 days
]
```

#### Visual Specifications

**Stack Behavior**:

- Type: Cumulative stacking
- Order: Consistent across all data points
- Blend mode: Normal (no blending)

**Area Properties**:

- Type: Monotone (smooth curves)
- Fill opacity: 0.6
- Stroke width: 2px
- Stroke: Solid material color
- Fill: Material color with opacity

**Material Categories** (Source: All material types in system):

- Aggregate Base
- Crushed Concrete
- Recycled Asphalt
- Fine Sand
- Coarse Aggregate
- Mixed Rubble
- (Additional material types as configured)

**Color Assignment**:

- Colors from design tokens chart palette
- Consistent mapping (same material = same color)
- Accessible contrast ratios

#### Interactive Features

**Legend Click**:

- Action: Toggle material visibility
- Visual: Fade out area (opacity 0.2) when hidden
- Persist: Remember state during session

**Brush Zoom**:

- Position: Bottom of chart, 30px height
- Drag: Select date range to zoom
- Reset: Double-click brush area

**Area Hover**:

- Effect: Increase opacity to 0.8
- Cursor: pointer
- Visual feedback: Subtle glow

#### Threshold Lines (Optional)

**Configuration**:

- Min inventory threshold: Red dashed line
- Max capacity threshold: Orange dashed line
- Label: Small text at line end

### 5.4 Right Chart: Production vs Target

**Source**: Document specifies "Horizontal Bar Chart" + "ComposedChart with Bars (production) + Line (target)"

#### Chart Type & Configuration

**Type**: ComposedChart (Horizontal orientation)
**Data**: Daily production vs target goals
**Time Range**: Selected date range (default last 7 days)

**Recharts Implementation**:

```typescript
<ComposedChart
  data={productionData}
  layout="vertical"
  margin={{ left: 80 }}
>
  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
  <XAxis
    type="number"
    tickFormatter={(value) => `${value} T`}
  />
  <YAxis
    dataKey="date"
    type="category"
    width={80}
    tickFormatter={(date) => format(date, 'MMM dd')}
  />
  <Tooltip content={<CustomTooltip />} />
  <Legend verticalAlign="bottom" />
  <Bar
    dataKey="production"
    fill={CHART_COLORS[0]}
    radius={[0, 8, 8, 0]}
    barSize={20}
  />
  <Line
    dataKey="target"
    stroke={CHART_COLORS[1]}
    strokeWidth={3}
    strokeDasharray="5 5"
    dot={{ r: 5 }}
  />
</ComposedChart>
```

#### Data Structure

```typescript
interface ProductionDataPoint {
  date: string;           // ISO date string
  production: number;     // Actual production in TON
  target: number;         // Target production in TON
  variance: number;       // production - target
  variancePercent: number; // (variance / target) × 100
}

// Example:
[
  {
    date: '2025-10-31',
    production: 1234.56,
    target: 1200.00,
    variance: 34.56,
    variancePercent: 2.88
  },
  // ... more days
]
```

#### Visual Specifications

**Bar Properties**:

- Orientation: Horizontal (layout="vertical" in Recharts)
- Bar size: 20px height
- Border-radius: [0, 8, 8, 0] (right side rounded)
- Fill: Gradient optional
- Stroke: None

**Bar Color Logic**:

- Production >= Target: Success color
- Production < Target: Warning color
- Production << Target (< 80%): Danger color

**Target Line**:

- Type: Line with dots
- Stroke width: 3px
- Stroke style: Dashed (5px dash, 5px gap)
- Dot radius: 5px
- Dot fill: Same as stroke color

**Percentage Labels** (Source: "Dropout percentage labels"):

- Position: End of bar (right side)
- Content: Variance percentage ("+2.88%" or "-5.2%")
- Font size: 12px
- Font weight: 600
- Color: Success/danger based on positive/negative
- Visibility: Always show if |variance| > 0.5%

#### Interactive Features

**Bar Hover**:

- Effect: Increase bar height to 24px
- Tooltip: Show detailed breakdown
- Animation: 200ms ease

**Tooltip Content**:

```
Date: Oct 31, 2025
─────────────────
Production: 1,234.56 T
Target: 1,200.00 T
Variance: +34.56 T (+2.88%)
```

### 5.5 Universal Chart Components

#### Custom Tooltip

**Container Specifications**:

```css
.custom-tooltip {
  min-width: 200px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid;
  backdrop-filter: blur(10px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

**Content Structure**:

```
┌──────────────────────────┐
│ Date: Oct 31, 2025      │ ← Header (bold)
├──────────────────────────┤
│ ● Material A: 123.45 T  │ ← Entry (dot + label + value)
│ ● Material B: 234.56 T  │
│ ● Material C: 345.67 T  │
├──────────────────────────┤
│ Total: 703.68 T         │ ← Footer (bold)
└──────────────────────────┘
```

**Animation** (Source specified):

- Fade-in: 150ms
- Position: Follow cursor with 10px offset
- Boundary: Stays within chart area

#### Legend Component

**Position**: Bottom, 36px height
**Layout**: Horizontal, centered, wrap if needed
**Gap**: 16px between items

**Legend Item**:

```css
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}
```

**Item Content**:

- Color indicator: 12×12px square/circle
- Label text: 13px, font-weight 500
- Optional: Value sum "(1,234 T)"

**Item States**:

- Default: Base style
- Hover: Background highlight
- Active (visible): Normal opacity
- Inactive (hidden): Opacity 0.4, strike-through text

**Interaction**:

- Click: Toggle series visibility
- Visual feedback: Fade series in/out over 300ms

#### Loading State

**Skeleton Structure**:

```
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓        [▓▓▓]      │
│                                     │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│                                     │
└─────────────────────────────────────┘
```

**Shimmer Animation**: Wave effect, 2s loop (source specified)

#### Empty State

**Content**: Centered message
**Icon**: Chart icon with slash, 48×48px
**Text**: "No data available"
**Secondary text**: "Select a different date range"
**Min-height**: 300px (to maintain layout)

#### Error State

**Content**: Centered error message
**Icon**: Alert triangle, 48×48px
**Text**: "Failed to load chart"
**Action button**: "Retry"
**Min-height**: 300px

### 5.6 Chart Entrance Animation

**Type**: Fade + slide up (source: shimmer until data loads)
**Duration**: 400ms
**Easing**: ease-out
**Stagger**: 100ms between charts

**Animation Sequence**:

1. Card container fades in
2. Skeleton shows immediately
3. When data loads: Skeleton fades out
4. Chart elements draw/animate in
5. Complete

---

## **6. ROW 3: UTILIZATION METRICS**

**Source**: User-provided comprehensive specifications for Equipment and Manpower

### 6.1 Container Layout

**Grid Configuration**:

- Left (Manpower): 4 columns (33%)
- Middle (Equipment): 5 columns (42%)
- Right (KPI): 3 columns (25%)
- Gap: 24px
- Height: 350px
- Row margin-bottom: 24px

**Responsive Breakpoints**:

- Desktop (>1440px): 4 + 5 + 3 columns
- Tablet (1024-1439px): Stack vertically (12 columns each)
- Mobile (<1024px): Stack vertically (12 columns each)

### 6.2 Type Definitions (SSOT)

**Source**: User-provided type specifications

```typescript
// Core Type Definitions
export type ManpowerRole =
  | "EQUIPMENT_DRIVER"
  | "CRUSHER_OPERATOR"
  | "MAINTENANCE_WORKER"
  | "LABORER"
  | "SECURITY";

export type EquipmentDef =
  | "CRUSHER"
  | "EXCAVATOR"
  | "LOADER"
  | "DUMPTRUCK"
  | "GENERATOR"
  | "BULLDOZER";

export type EquipmentType =
  | "CRUSHING_SCREENING"
  | "EARTH_MOVING"
  | "HAULING"
  | "AUXILIARY";

export type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT";

export type UOM = "TON" | "LOAD" | "HOUR" | "COUNT" | "PERCENT";
```

### 6.3 Left Chart: Manpower Attendance Tracking

**Source**: User specification - "tracking present workers by role, their count, and their hours, as well as the absent count"

#### Chart Type & Configuration

**Type**: Stacked Column Chart (Time-Series)
**Purpose**: Dynamic daily tracking over selected date range
**Rationale**: Shows trend over time, crucial for daily tracking

**Recharts Implementation**:

```typescript
<BarChart data={manpowerData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'MMM dd')}
    interval="preserveStartEnd"
  />
  <YAxis
    label={{ value: 'Worker Count', angle: -90, position: 'insideLeft' }}
    width={60}
  />
  <Tooltip content={<ManpowerTooltip />} />
  <Legend
    verticalAlign="bottom"
    onClick={handleRoleToggle}
  />
  {/* Present workers by role */}
  {MANPOWER_ROLES.map((role) => (
    <Bar
      key={role}
      dataKey={`present.${role}`}
      stackId="present"
      fill={ROLE_COLORS[role]}
      name={formatRoleName(role)}
    />
  ))}
  {/* Absent workers */}
  <Bar
    dataKey="absent"
    stackId="present"
    fill={DANGER_COLOR}
    name="Absent"
  />
</BarChart>
```

#### Visual Specifications

**Column Structure**:

- Total height: Total Scheduled Workforce
- Stack 1 (bottom): Present Workers Count (segmented by role)
- Stack 2 (top): Absent Workers Count
- Bar width: Auto (responsive to data density)
- Gap between bars: 8px

**Role Segmentation**:

- Each role gets a unique color (from design tokens)
- Color consistency across all charts
- Stack order: Alphabetical by role name

**Color Mapping** (General approach):

- EQUIPMENT_DRIVER: Color 1
- CRUSHER_OPERATOR: Color 2
- MAINTENANCE_WORKER: Color 3
- LABORER: Color 4
- SECURITY: Color 5
- ABSENT: Danger color (red tone)

#### Data Structure

```typescript
interface ManpowerAttendanceData {
  date: string;           // ISO date
  shift: ShiftType;
  present: {
    [role in ManpowerRole]: number; // Headcount
  };
  presentHours: {
    [role in ManpowerRole]: number; // Total hours worked
  };
  absent: number;         // Absent count
  totalScheduled: number; // Total workforce
  attendanceRate: number; // Percentage (0-100)
}

// Example:
{
  date: '2025-10-31',
  shift: 'MORNING',
  present: {
    EQUIPMENT_DRIVER: 12,
    CRUSHER_OPERATOR: 8,
    MAINTENANCE_WORKER: 5,
    LABORER: 20,
    SECURITY: 4
  },
  presentHours: {
    EQUIPMENT_DRIVER: 96,
    CRUSHER_OPERATOR: 64,
    MAINTENANCE_WORKER: 40,
    LABORER: 160,
    SECURITY: 32
  },
  absent: 5,
  totalScheduled: 54,
  attendanceRate: 90.74
}
```

#### Interactive Features

**Role Filter Dropdown**:

```css
.role-filter {
  width: 180px;
  height: 36px;
  margin-bottom: 12px;
  border-radius: 8px;
}
```

**Dropdown Options**:

- "All Roles" (default)
- Individual role options (EQUIPMENT_DRIVER, CRUSHER_OPERATOR, etc.)
- When filtered: Show only selected role + absent

**Shift Toggle**:

- Position: Next to role filter
- Options: All Shifts, Morning, Afternoon, Night
- Width: 140px
- Height: 36px

**Tooltip Content**:

```
Date: Oct 31, 2025 (Morning)
────────────────────────────
Present Workers:
  ● Equipment Driver: 12 (96 hours)
  ● Crusher Operator: 8 (64 hours)
  ● Maintenance Worker: 5 (40 hours)
  ● Laborer: 20 (160 hours)
  ● Security: 4 (32 hours)
────────────────────────────
Absent: 5
Total Scheduled: 54
Attendance Rate: 90.74%
```

#### Supporting KPI Card (Right Side)

**Position**: Adjacent to chart (in Row 3 right section)
**Dimensions**: 3 columns width, 350px height

**Content**:

```
┌────────────────────────┐
│ Manpower Overview      │
├────────────────────────┤
│ 392                    │
│ Total Hours Today      │
├────────────────────────┤
│ 90.74%                 │
│ Attendance Rate        │
├────────────────────────┤
│ EQUIPMENT_DRIVER       │
│ Most Utilized Role     │
└────────────────────────┘
```

**KPI Layout**:

- 3 stacked metrics
- Each: Value (24px) + label (12px)
- Gap: 16px between metrics
- Padding: 24px

#### Secondary View: Hours Worked Line Overlay

**Toggle**: Button to switch between "Count" and "Hours" view
**Implementation**: Adds a line series for total hours on right Y-axis

```typescript
<BarChart data={manpowerData}>
  {/* ... existing config */}
  <YAxis
    yAxisId="right"
    orientation="right"
    label={{ value: 'Hours', angle: 90, position: 'insideRight' }}
    width={60}
  />
  <Line
    yAxisId="right"
    type="monotone"
    dataKey="totalHours"
    stroke={ACCENT_COLOR}
    strokeWidth={2}
    dot={{ r: 4 }}
    name="Total Hours"
  />
</BarChart>
```

### 6.4 Middle Chart: Equipment Utilization Tracking

**Source**: User specification - "tracking equipment by type, its specific def, count, and hours"

#### Dual-View Architecture

**View Toggle**:

```css
.view-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 4px;
  border-radius: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.view-toggle-button {
  width: 80px;
  height: 32px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.view-toggle-button.active {
  font-weight: 600;
}
```

**Buttons**:

- "Trend" (default active)
- "Composition"

---

#### Primary View: Utilization Trend Line Chart

**Type**: Multi-Line Chart with Area Fill
**Purpose**: Show utilization rate trend by equipment type

**Recharts Implementation**:

```typescript
<LineChart data={equipmentTrendData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'MMM dd')}
  />
  <YAxis
    domain={[0, 100]}
    tickFormatter={(value) => `${value}%`}
    label={{ value: 'Utilization Rate (%)', angle: -90, position: 'insideLeft' }}
  />
  <Tooltip content={<EquipmentTrendTooltip />} />
  <Legend verticalAlign="bottom" />

  {/* Target line */}
  <ReferenceLine
    y={80}
    stroke={WARNING_COLOR}
    strokeDasharray="3 3"
    label="Target"
  />

  {/* Equipment type lines */}
  {EQUIPMENT_TYPES.map((type, index) => (
    <React.Fragment key={type}>
      <Area
        type="monotone"
        dataKey={type}
        fill={EQUIPMENT_COLORS[index]}
        fillOpacity={0.2}
        stroke="none"
      />
      <Line
        type="monotone"
        dataKey={type}
        stroke={EQUIPMENT_COLORS[index]}
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
        name={formatEquipmentType(type)}
      />
    </React.Fragment>
  ))}
</LineChart>
```

**Visual Specifications**:

**Lines**:

- One line per Equipment Type (4 lines total)
- Type: Monotone (smooth curves)
- Stroke width: 2px
- Area fill: 20% opacity
- Dot size: 4px (normal), 6px (active)

**Target Threshold**:

- Type: Horizontal reference line
- Position: Y = 80% (or configured target)
- Style: Dashed, warning color
- Label: "Target" at right end

**Threshold Breach Indicators**:

- When utilization < target: Red zone shading
- Visual: Gradient fill below target line
- Opacity: 0.1

**Equipment Type Colors**:

- CRUSHING_SCREENING: Color 1
- EARTH_MOVING: Color 2
- HAULING: Color 3
- AUXILIARY: Color 4

**Data Structure**:

```typescript
interface EquipmentTrendData {
  date: string;
  CRUSHING_SCREENING: number; // Utilization rate 0-100
  EARTH_MOVING: number;
  HAULING: number;
  AUXILIARY: number;
}

// Calculation per type:
// utilizationRate = (totalRunHours / totalAvailableHours) × 100
```

**Type Filter Dropdown**:

```css
.equipment-type-filter {
  width: 200px;
  height: 36px;
  margin-bottom: 12px;
}
```

**Options**:

- "All Types" (default)
- Individual type options (CRUSHING_SCREENING, EARTH_MOVING, etc.)
- When filtered: Show only selected type

**Tooltip Content**:

```
Date: Oct 31, 2025
─────────────────────────────
Crushing & Screening: 85.2%
  Run Hours: 204 / Available: 240
  Active Units: 3

Earth Moving: 72.5%
  Run Hours: 174 / Available: 240
  Active Units: 5

[More types...]
─────────────────────────────
Target: 80%
```

---

#### Secondary View: Utilization Composition (100% Stacked Bar)

**Type**: Horizontal 100% Stacked Bar Chart
**Purpose**: Summarize activity split over entire selected date range

**Recharts Implementation**:

```typescript
<BarChart
  data={equipmentCompositionData}
  layout="vertical"
  margin={{ left: 120 }}
>
  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
  <XAxis
    type="number"
    domain={[0, 100]}
    tickFormatter={(value) => `${value}%`}
  />
  <YAxis
    dataKey="unit"
    type="category"
    width={120}
    tickFormatter={formatUnitLabel}
  />
  <Tooltip content={<CompositionTooltip />} />
  <Legend verticalAlign="bottom" />

  <Bar dataKey="runTime" stackId="a" fill={SUCCESS_COLOR} name="Run Time" />
  <Bar dataKey="idleTime" stackId="a" fill={WARNING_COLOR} name="Idle Time" />
  <Bar dataKey="downtime" stackId="a" fill={DANGER_COLOR} name="Downtime" />
</BarChart>
```

**Visual Specifications**:

**Bar Structure**:

- Orientation: Horizontal
- Bar height: 32px
- X-axis: 0% to 100%
- Segments: Run Time, Idle Time, Downtime

**Segment Colors**:

- Run Time (Utilized): Success color
- Idle Time (Available but not used): Warning color
- Downtime (Maintenance/Breakdown): Danger color

**Segment Proportions**:

- Calculated from total hours over selected range
- Formula: (segmentHours / totalAvailableHours) × 100

**Y-Axis Labels**:

- Format: "EQUIPMENT_DEF UNIT_ID"
- Example: "CRUSHER 01", "EXCAVATOR 03"
- Font size: 12px
- Truncate if too long

**Data Structure**:

```typescript
interface EquipmentCompositionData {
  unit: string;          // "CRUSHER_01"
  def: EquipmentDef;
  type: EquipmentType;
  runTime: number;       // Percentage (0-100)
  idleTime: number;      // Percentage
  downtime: number;      // Percentage
  runHours: number;      // Absolute hours
  idleHours: number;
  downtimeHours: number;
  totalAvailableHours: number;
  downtimeReasons?: string[]; // If tracked
}
```

**Sort Options**:

```css
.composition-sort {
  width: 160px;
  height: 32px;
  position: absolute;
  top: 48px;
  right: 16px;
}
```

**Sort Options**:

- "Utilization (High to Low)" (default)
- "Utilization (Low to High)"
- "Downtime (High to Low)"
- "Alphabetical"

**Type Filter** (Same as trend view):

- Filters which equipment units are shown
- Dropdown above chart
- Updates composition bars instantly

**Tooltip Content**:

```
CRUSHER 01 (Crushing & Screening)
──────────────────────────────────
Run Time: 85.2% (204 hours)
Idle Time: 10.8% (26 hours)
Downtime: 4.0% (10 hours)
──────────────────────────────────
Total Available: 240 hours
Downtime Reasons:
  • Scheduled Maintenance (6h)
  • Belt Replacement (4h)
```

---

#### Optional Enhancement: Heatmap View

**Activation**: Third view toggle option "Heatmap"

**Type**: Calendar Heatmap
**Purpose**: Quickly identify patterns over time

**Structure**:

```
        Day 1  Day 2  Day 3  ...
CRUSHER_01   [85%] [72%] [90%]
CRUSHER_02   [45%] [80%] [88%]
EXCAVATOR_01 [92%] [65%] [78%]
...
```

**Cell Specifications**:

- Size: 32×32px
- Border-radius: 4px
- Color intensity: Based on utilization rate
- Gradient: 0% (danger) → 50% (warning) → 80%+ (success)

**Cell States**:

- Hover: Border highlight, tooltip shows details
- Click: Drill down to day view

**Tooltip**:

- Date + equipment unit
- Utilization rate
- Run hours / available hours

### 6.5 Right Section: Utilization KPI Card

**Dimensions**: 3 columns, 350px height
**Purpose**: At-a-glance metrics for Row 3

**Content Layout**:

```
┌─────────────────────────┐
│ Utilization Summary     │
├─────────────────────────┤
│ 82.5%                   │
│ Avg Equipment Util.     │
├─────────────────────────┤
│ 392 hrs                 │
│ Total Manpower Hours    │
├─────────────────────────┤
│ 90.7%                   │
│ Attendance Rate         │
├─────────────────────────┤
│ 3 units                 │
│ Equipment Downtime      │
└─────────────────────────┘
```

**Metric Structure** (Each):

- Value: 32px font size, bold
- Label: 13px, opacity 0.7
- Gap: 8px between value and label
- Padding: 16px per metric section

**Visual Enhancements**:

- Small sparklines next to values (optional)
- Trend indicators (up/down arrows)
- Color coding based on thresholds

---

## **7. ROW 4: FLOW ANALYSIS**

**Source**: Original document + enhanced to match Row 3 detail level

### 7.1 Container Layout

**Grid Configuration**:

- Left chart: 7 columns (58%)
- Right chart: 5 columns (42%)
- Gap: 24px
- Height: 400px
- Row margin-bottom: 24px

**Responsive Breakpoints**:

- Desktop (>1440px): Side by side (7 + 5 columns)
- Tablet (1024-1439px): Stack vertically (12 columns each)
- Mobile (<1024px): Stack vertically (12 columns each)

### 7.2 Left Chart: Received vs Dispatched Trend

**Source**: Document specifies "ComposedChart with grouped Bars and Line (net = received − dispatched)"

#### Chart Type & Configuration

**Type**: ComposedChart (Bars + Line)
**Purpose**: Show material flow balance over time
**Time Range**: 7-day trend (default)

**Recharts Implementation**:

```typescript
<ComposedChart data={flowTrendData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'EEE dd')}
  />
  <YAxis
    label={{ value: 'Quantity (TON)', angle: -90, position: 'insideLeft' }}
    tickFormatter={(value) => `${value} T`}
    width={70}
  />
  <Tooltip content={<FlowTooltip />} />
  <Legend verticalAlign="bottom" />

  {/* Reference line at 0 */}
  <ReferenceLine y={0} stroke="#666" />

  {/* Bars */}
  <Bar
    dataKey="received"
    fill={SUCCESS_COLOR}
    name="Received"
    radius={[8, 8, 0, 0]}
  />
  <Bar
    dataKey="dispatched"
    fill={INFO_COLOR}
    name="Dispatched"
    radius={[8, 8, 0, 0]}
  />

  {/* Net line */}
  <Line
    type="monotone"
    dataKey="net"
    stroke={ACCENT_COLOR}
    strokeWidth={3}
    dot={{ r: 5 }}
    activeDot={{ r: 7 }}
    name="Net Flow"
  />
</ComposedChart>
```

#### Data Structure

```typescript
interface FlowTrendData {
  date: string;           // ISO date
  received: number;       // Received materials (TON)
  dispatched: number;     // Dispatched materials (TON)
  net: number;            // received - dispatched
  receivedCount: number;  // Number of receive transactions
  dispatchCount: number;  // Number of dispatch transactions
}

// Example:
{
  date: '2025-10-31',
  received: 1234.56,
  dispatched: 987.65,
  net: 246.91,
  receivedCount: 15,
  dispatchCount: 12
}
```

#### Visual Specifications

**Bar Configuration**:

- Grouped (side-by-side), not stacked
- Bar width: Auto-calculated with gap
- Gap between grouped bars: 4px
- Border-radius: Top corners rounded (8px)

**Bar Colors**:

- Received: Success color (green tone)
- Dispatched: Info color (blue tone)
- Consistent throughout dashboard

**Net Flow Line**:

- Type: Monotone curve
- Stroke width: 3px
- Stroke: Accent color
- Dots: Always visible (5px radius)
- Active dot: 7px radius

**Net Flow Color Logic** (Optional enhancement):

- Positive net (received > dispatched): Success color
- Negative net (dispatched > received): Warning color
- Zero net: Neutral color

**Reference Line**:

- Position: Y = 0
- Style: Solid, neutral color
- Purpose: Visual baseline for net flow

#### Interactive Features

**Bar Hover**:

- Effect: Slight opacity increase
- Cursor: pointer
- Tooltip: Show detailed breakdown

**Line Hover**:

- Effect: Dot scales to 8px
- Tooltip: Show net calculation

**Date Range Selector**:

```css
.date-range-quick-select {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.range-button {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
```

**Quick Range Options**:

- "7 Days" (default)
- "30 Days"
- "This Month"
- "Custom" (opens date picker)

**Tooltip Content**:

```
Oct 31, 2025
─────────────────────────
Received: 1,234.56 T (15 transactions)
Dispatched: 987.65 T (12 transactions)
─────────────────────────
Net Flow: +246.91 T
```

#### Drill-Down Capability

**Interaction**: Click on bar or date
**Action**: Opens modal with detailed transactions

**Modal Content**:

- Date header
- Two tabs: "Received" and "Dispatched"
- Table of transactions with: Time, Material, Quantity, Source/Destination
- Export button

### 7.3 Right Chart: Recycling Rate

**Source**: Document specifies "Line Chart with area fill" + "Recycling percentage over time" + "Threshold line at target rate"

#### Chart Type & Configuration

**Type**: AreaChart (Line + Area Fill)
**Purpose**: Track recycling efficiency trend
**Time Range**: 30 days

**Recharts Implementation**:

```typescript
<AreaChart data={recyclingRateData}>
  <defs>
    <linearGradient id="recyclingGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={SUCCESS_COLOR} stopOpacity={0.3}/>
      <stop offset="95%" stopColor={SUCCESS_COLOR} stopOpacity={0.05}/>
    </linearGradient>
  </defs>

  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
  <XAxis
    dataKey="date"
    tickFormatter={(date) => format(date, 'MMM dd')}
  />
  <YAxis
    domain={[0, 100]}
    tickFormatter={(value) => `${value}%`}
    label={{ value: 'Recycling Rate (%)', angle: -90, position: 'insideLeft' }}
    width={60}
  />
  <Tooltip content={<RecyclingTooltip />} />
  <Legend verticalAlign="bottom" />

  {/* Target reference line */}
  <ReferenceLine
    y={TARGET_RECYCLING_RATE}
    stroke={INFO_COLOR}
    strokeDasharray="5 5"
    label="Target"
  />

  {/* Area + Line */}
  <Area
    type="monotone"
    dataKey="rate"
    stroke={SUCCESS_COLOR}
    strokeWidth={2}
    fillOpacity={1}
    fill="url(#recyclingGradient)"
    name="Recycling Rate"
  />
</AreaChart>
```

#### Data Structure

```typescript
interface RecyclingRateData {
  date: string;
  rate: number;              // Percentage (0-100)
  recycledMaterial: number;  // TON
  totalReceived: number;     // TON
  targetRate: number;        // Target percentage
  variance: number;          // rate - targetRate
}

// Calculation:
// rate = (recycledMaterial / totalReceived) × 100
```

#### Visual Specifications

**Line Properties**:

- Type: Monotone (smooth curve)
- Stroke width: 2px
- Stroke: Success color
- Dot size: 0 (hidden unless hover)
- Active dot: 6px

**Area Fill**:

- Gradient: Top (30% opacity) → Bottom (5% opacity)
- Color: Success color base
- Creates subtle depth effect

**Target Line**:

- Type: Horizontal reference line
- Position: Y = target rate (e.g., 75%)
- Style: Dashed (5px dash, 5px gap)
- Color: Info color
- Label: "Target" at right end

**Zone Highlighting** (Optional):

- Above target: Green tint background
- Below target: Yellow tint background
- Visual: Very subtle opacity (0.05)

#### Interactive Features

**Hover on Line**:

- Effect: Show dot at position
- Tooltip: Detailed metrics

**Click on Point**:

- Action: Opens daily detail modal
- Modal content: Breakdown of recycled vs non-recycled materials

**Period Selector**:

```css
.period-selector {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
```

**Options**:

- "7 Days"
- "30 Days" (default)
- "90 Days"
- "YTD"

**Tooltip Content**:

```
Oct 31, 2025
─────────────────────────
Recycling Rate: 78.5%
Recycled: 1,234.56 T
Total Received: 1,572.00 T
─────────────────────────
Target: 75%
Above Target: +3.5%
```

#### Statistical Overlay (Optional)

**Moving Average Line**:

- Type: 7-day moving average
- Style: Dashed, lower opacity
- Color: Same as main line
- Purpose: Show trend smoothing

**Configuration**:

```typescript
<Line
  type="monotone"
  dataKey="movingAverage"
  stroke={SUCCESS_COLOR}
  strokeWidth={2}
  strokeDasharray="3 3"
  opacity={0.5}
  dot={false}
  name="7-Day Average"
/>
```

---

## **8. ROW 5: DETAIL TABLES**

**Source**: Document "Detail Tabs" + enhanced to match header detail level

### 8.1 Container Layout

**Grid Configuration**:

- Width: 12 columns (100%)
- Min-height: 500px (variable based on content)
- Padding: 24px
- Border-radius: 20px

**Tab System**:

```
┌─────────────────────────────────────────┐
│ [Movements] [Equipment] [Manpower]      │ ← Tab headers (48px)
├─────────────────────────────────────────┤
│                                         │
│     Paginated Data Table                │
│     (min-height: 500px)                 │
│                                         │
└─────────────────────────────────────────┘
```

### 8.2 Tab Header Component

**Dimensions**:

```css
.tab-header-container {
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  gap: 4px;
  padding: 0 4px;
}
```

**Tab Button**:

```css
.tab-button {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
}
```

**Tab States**:

- **Default**: Base background, normal opacity
- **Hover**: Background highlight, transition 200ms
- **Active**: Background emphasis, font weight 600, bottom border (3px accent color)
- **Disabled**: Opacity 0.4, cursor not-allowed

**Tab Labels**:

1. "Movements" (Material flow transactions)
2. "Equipment" (Equipment usage logs)
3. "Manpower" (Attendance records)

**Active Indicator**:

- Type: Bottom border (3px thick)
- Color: Accent from design tokens
- Width: 100% of tab button
- Position: Absolute bottom
- Transition: 200ms ease

### 8.3 Table Component Architecture

**Table Container**:

```css
.detail-table-container {
  width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}
```

**Layout Sections**:

1. Toolbar (48px height)
2. Table header (fixed, 44px height)
3. Table body (virtualized, variable height)
4. Footer (pagination + info, 56px height)

---

#### Toolbar Section

**Dimensions**:

```css
.table-toolbar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 16px;
}
```

**Left Side** (Search + Filters):

```
[Search input............] [Filter ▼] [Columns ▼]
```

**Search Input**:

```css
.table-search {
  width: 300px;
  height: 36px;
  padding: 0 12px 0 36px;
  border-radius: 8px;
  font-size: 13px;
}
```

- Icon: Magnifying glass (16×16px) at left
- Placeholder: "Search {table name}..."
- Clear button: X icon (when input has value)
- Debounce: 300ms

**Filter Dropdown**:

```css
.table-filter-button {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  gap: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
```

- Icon: Filter funnel
- Label: "Filter" + badge count (if filters active)
- Badge: Small circle showing filter count

**Column Selector**:

```css
.column-selector-button {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  gap: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
```

- Icon: Columns icon
- Label: "Columns"
- Opens dropdown with column visibility toggles

**Right Side** (Actions):

```
[Refresh] [Export ▼]
```

**Refresh Button**:

```css
.table-refresh-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
```

- Icon: Refresh arrow (16×16px)
- States: Default, Hover, Loading (rotating)
- Tooltip: "Refresh data"

**Export Dropdown**:

```css
.table-export-button {
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  gap: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
```

- Icon: Download
- Label: "Export"
- Dropdown options: Excel, CSV, PDF
- Opens export configuration dialog

---

#### Filter Dropdown Panel

**Container**:

```css
.filter-panel {
  width: 320px;
  max-height: 480px;
  border-radius: 12px;
  padding: 16px;
  position: absolute;
  top: 44px;
  z-index: 10;
  overflow-y: auto;
}
```

**Structure**:

```
┌────────────────────────────┐
│ Filters                    │ ← Header
├────────────────────────────┤
│ Date Range                 │ ← Filter group
│ [Date picker]              │
├────────────────────────────┤
│ Material Type              │
│ □ Aggregate Base           │ ← Checkboxes
│ □ Crushed Concrete         │
│ □ Recycled Asphalt         │
├────────────────────────────┤
│ Status                     │
│ ○ All                      │ ← Radio buttons
│ ○ Active                   │
│ ○ Inactive                 │
├────────────────────────────┤
│ [Clear All] [Apply]        │ ← Actions
└────────────────────────────┘
```

**Filter Group**:

```css
.filter-group {
  margin-bottom: 16px;
}

.filter-group-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}
```

**Filter Actions**:

- Clear All: Remove all filters (secondary style)
- Apply: Commit filters and close (primary style)
- Button height: 36px
- Gap: 8px

---

#### Column Selector Dropdown

**Container**: Same style as filter panel

**Structure**:

```
┌────────────────────────────┐
│ Show/Hide Columns          │
├────────────────────────────┤
│ ☑ Date                     │ ← Toggles
│ ☑ Material                 │
│ ☑ Quantity                 │
│ ☑ Source                   │
│ ☐ Notes                    │ (hidden)
├────────────────────────────┤
│ [Reset] [Apply]            │
└────────────────────────────┘
```

**Column Toggle Item**:

```css
.column-toggle-item {
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 6px;
}
```

**Interaction**:

- Click: Toggle visibility
- Checkbox reflects state
- Hover: Background highlight
- Some columns pinned (cannot hide, e.g., ID column)

**Pinned Indicator**:

- Icon: Pin icon next to checkbox
- Tooltip: "This column cannot be hidden"

---

#### Table Header

**Container**:

```css
.table-header {
  display: grid;
  grid-template-columns: /* Dynamic based on columns */;
  height: 44px;
  border-bottom: 1px solid;
  position: sticky;
  top: 0;
  z-index: 5;
  background: /* Inherit from card background */;
}
```

**Header Cell**:

```css
.table-header-cell {
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer; /* If sortable */
}
```

**Cell Content**:

- Label text
- Sort indicator (if sortable): Arrow icon (12×12px)
- Resize handle (right edge): Drag to resize column

**Sort States**:

- Unsorted: No arrow or neutral arrow
- Ascending: Arrow up
- Descending: Arrow down
- Hover: Arrow appears/highlights

**Resize Handle**:

```css
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
}

.resize-handle:hover {
  background: /* Accent color */;
}
```

---

#### Table Body (Virtualized)

**Implementation**: Use React Virtuoso or similar for performance

**Container**:

```css
.table-body {
  flex: 1;
  overflow: auto;
  min-height: 400px;
}
```

**Row Configuration**:

```css
.table-row {
  display: grid;
  grid-template-columns: /* Match header */;
  height: 52px;
  border-bottom: 1px solid;
  transition: background 150ms;
}
```

**Row States**:

- **Default**: Base background
- **Hover**: Background highlight, cursor pointer
- **Selected**: Background emphasis, checkbox checked
- **Disabled**: Opacity 0.5, no hover effect

**Cell**:

```css
.table-cell {
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Cell Types**:

1. **Text Cell**: Plain text with ellipsis overflow
2. **Number Cell**: Right-aligned, tabular numbers
3. **Date Cell**: Formatted date (MMM dd, yyyy)
4. **Status Cell**: Badge component (chip style)
5. **Action Cell**: Icon buttons (edit, delete, etc.)

**Status Badge**:

```css
.status-badge {
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}
```

- Colors: Based on status (success, warning, danger, info)
- Text: Uppercase or title case
- Icon: Optional small icon (10×10px)

**Action Buttons**:

```css
.table-action-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
```

- Common actions: Edit, Delete, View details
- Icon size: 16×16px
- Hover: Background highlight
- Tooltip: Action name

**Row Selection**:

- First column: Checkbox (24×24px)
- Multi-select: Ctrl/Cmd + click
- Range select: Shift + click
- Select all: Checkbox in header

**Virtualization**:

- Render: Only visible rows + buffer (10 rows above/below)
- Row height: Fixed 52px
- Total rows: Display in footer
- Performance: Handle 10,000+ rows smoothly

**Empty State**:

```
┌─────────────────────────────────┐
│                                 │
│        [Icon]                   │ ← Large icon (48×48px)
│    No data available            │ ← Message
│  Try adjusting your filters     │ ← Hint
│                                 │
└─────────────────────────────────┘
```

- Height: 300px
- Centered content
- Icon: Table with X overlay
- Text: 14px, opacity 0.7

**Loading State**:

- Skeleton rows: 10 visible
- Shimmer animation: 2s loop
- Height: Match row height (52px)

---

#### Table Footer

**Container**:

```css
.table-footer {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-top: 1px solid;
}
```

**Left Side** (Info):

```css
.table-info {
  font-size: 13px;
  opacity: 0.7;
}
```

**Content**: "Showing {start}-{end} of {total} results"
**Example**: "Showing 1-25 of 234 results"

**Selected Info** (if rows selected):
**Content**: "{count} row(s) selected"
**Actions**: Bulk action buttons appear

**Right Side** (Pagination):

```css
.table-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**Components**:

1. Rows per page selector
2. Page navigation buttons
3. Current page indicator

**Rows Per Page**:

```css
.rows-per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
```

- Label: "Rows per page:"
- Dropdown: 10, 25, 50, 100
- Width: 80px

**Page Navigation**:

```
[First] [Prev] [1] 2 [3] [Next] [Last]
```

**Button Specs**:

```css
.pagination-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
}
```

**Button States**:

- Active (current page): Background emphasis, font weight 600
- Hover: Background highlight
- Disabled (first/last bounds): Opacity 0.4, cursor not-allowed

**Page Number Display**:

- Show: Current ± 2 pages
- Ellipsis: "..." for gaps
- Example: "1 ... 5 6 [7] 8 9 ... 15"

---

### 8.4 Tab-Specific Table Configurations

#### Movements Tab

**Columns**:

1. Checkbox (select)
2. ID (auto-generated)
3. Date
4. Type (Received/Dispatched/Production)
5. Material
6. Quantity (TON)
7. Source/Destination
8. Status
9. Actions

**Column Widths**:

- Checkbox: 48px
- ID: 100px
- Date: 120px
- Type: 120px
- Material: 180px (flex-grow)
- Quantity: 120px
- Source/Dest: 160px
- Status: 100px
- Actions: 80px

**Default Sort**: Date descending (newest first)

**Filters**:

- Date range
- Type (multi-select)
- Material (multi-select)
- Status (radio)

**Row Actions**:

- View details (opens modal)
- Edit (if permissions allow)
- Delete (confirmation dialog)

#### Equipment Tab

**Columns**:

1. Checkbox
2. Equipment ID
3. Definition
4. Type
5. Date
6. Shift
7. Run Hours
8. Idle Hours
9. Downtime
10. Utilization %
11. Actions

**Column Widths**:

- Checkbox: 48px
- Equipment ID: 120px
- Definition: 140px
- Type: 160px
- Date: 120px
- Shift: 100px
- Run Hours: 100px
- Idle Hours: 100px
- Downtime: 100px
- Utilization: 100px
- Actions: 80px

**Default Sort**: Date descending

**Filters**:

- Date range
- Equipment type (multi-select)
- Equipment definition (multi-select)
- Shift (multi-select)
- Utilization range (slider: 0-100%)

**Row Actions**:

- View usage details
- Download maintenance log
- Schedule maintenance (if authorized)

#### Manpower Tab

**Columns**:

1. Checkbox
2. Record ID
3. Date
4. Shift
5. Role
6. Present Count
7. Absent Count
8. Total Hours
9. Attendance Rate %
10. Actions

**Column Widths**:

- Checkbox: 48px
- Record ID: 100px
- Date: 120px
- Shift: 100px
- Role: 160px
- Present: 100px
- Absent: 100px
- Hours: 100px
- Rate: 120px
- Actions: 80px

**Default Sort**: Date descending

**Filters**:

- Date range
- Shift (multi-select)
- Role (multi-select)
- Attendance rate range (slider: 0-100%)

**Row Actions**:

- View attendance details
- Download attendance report
- Mark exceptions (if authorized)

---

### 8.5 Accessibility Features

**Keyboard Navigation**:

- Tab: Navigate between interactive elements
- Arrow keys: Navigate cells (when table focused)
- Enter: Activate button/link in focused cell
- Space: Toggle checkbox in focused cell
- Ctrl/Cmd + A: Select all rows
- Escape: Deselect all, close dialogs

**Screen Reader Support**:

- Table role: "grid" with aria-label
- Headers: aria-describedby for sort state
- Rows: aria-selected state
- Cells: Role "gridcell"
- Actions: aria-label for icon buttons

**Focus Management**:

- Focus visible: Clear outline/ring
- Focus trap: In open dialogs
- Focus restoration: Return focus after dialog close

---

## **9. ANIMATION SYSTEM**

**Source**: Document "Animation Specifications" + consolidated timing values

### 9.1 Animation Constants (SSOT)

```typescript
// Animation Configuration
export const ANIMATIONS = {
  entrance: {
    duration: 400,
    stagger: 50,
    easing: 'cubic-bezier(0.23, 1, 0.320, 1)' // Elastic Out
  },
  hover: {
    scale: 1.02,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  counter: {
    duration: 1200,
    easing: 'linear'
  },
  sparkline: {
    pulseDuration: 3000,
    pulseDelay: 0
  },
  tooltip: {
    fadeIn: 150
  },
  skeleton: {
    waveDuration: 2000
  },
  click: {
    damping: 0.7,
    stiffness: 400
  },
  transition: {
    fast: 150,
    medium: 300,
    slow: 500
  }
} as const;
```

### 9.2 Entrance Animations

**Card Cascade** (Rows 1-4):

```css
@keyframes card-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-enter {
  animation: card-enter 400ms cubic-bezier(0.23, 1, 0.320, 1) both;
}
```

**Stagger Delays**:

- Row 1 Card 1: 0ms
- Row 1 Card 2: 50ms
- Row 1 Card 3: 100ms
- Row 1 Card 4: 150ms
- Row 2 Left: 200ms
- Row 2 Right: 250ms
- Row 3 Left: 300ms
- Row 3 Middle: 350ms
- Row 3 Right: 400ms
- Etc.

**Total Cascade Duration**: ~1000ms for full dashboard

### 9.3 Interactive Animations

**Hover Scale** (Cards, buttons):

```css
.interactive-element {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: scale(1.02);
}
```

**Hover Glow** (Cards):

```css
.card {
  transition: box-shadow 300ms ease;
}

.card:hover {
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.2),
    inset 1px 1px 0 rgba(255, 255, 255, 0.3);
}
```

**Click Feedback** (Buttons):

```typescript
// Using Framer Motion
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", damping: 0.7, stiffness: 400 }}
/>
```

**Number Counter**:

```typescript
// Animate from 0 to target over 1200ms
const animateValue = (start: number, end: number, duration: number) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = start + (end - start) * progress;

    setValue(current);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};
```

### 9.4 Micro-Animations

**Sparkline Pulse** (Source: every 3s):

```css
@keyframes sparkline-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.sparkline-last-point {
  animation: sparkline-pulse 600ms ease-in-out;
  animation-delay: 3s;
  animation-iteration-count: infinite;
}
```

**Chart Tooltip Fade**:

```css
@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-tooltip {
  animation: tooltip-fade-in 150ms ease-out;
}
```

**Percentage Badge Shimmer**:

```css
@keyframes badge-shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.change-badge {
  background: linear-gradient(
    90deg,
    currentColor 0%,
    rgba(255, 255, 255, 0.3) 50%,
    currentColor 100%
  );
  background-size: 200% 100%;
  animation: badge-shimmer 2s linear infinite;
}
```

**Loading Skeleton Wave**:

```css
@keyframes skeleton-wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton-bar {
  position: relative;
  overflow: hidden;
}

.skeleton-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: skeleton-wave 2s linear infinite;
}
```

### 9.5 Transition Speeds

**Fast (150ms)**:

- Tooltip appearance
- Hover state changes
- Focus rings
- Small UI element fades

**Medium (300ms)**:

- Card hover effects
- Dropdown open/close
- Modal backdrop fade
- Tab switches

**Slow (500ms)**:

- Theme toggle animation
- Sidebar expand/collapse
- Page transitions
- Large content loads

---

## **10. EXPORT FUNCTIONALITY**

**Source**: Document "Export Capability" section + enhanced specifications

### 10.1 Export Dialog

**Trigger Locations**:

1. Header toolbar (global export)
2. Individual chart export buttons
3. Table export dropdown
4. Right-click context menu on charts/tables

**Dialog Dimensions**:

```css
.export-dialog {
  width: 480px;
  max-height: 680px;
  border-radius: 16px;
  padding: 24px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
```

**Dialog Animation**:

```css
@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

**Backdrop**:

```css
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}
```

### 10.2 Dialog Structure

**Header** (56px):

```
┌────────────────────────────────┐
│ Export Data              [X]   │
└────────────────────────────────┘
```

- Title: "Export Data" (18px, font-weight 600)
- Close button: 32×32px, top-right

**Content** (Scrollable):

```
┌────────────────────────────────┐
│ Format                         │
│ ○ Excel (.xlsx)                │
│ ○ PDF (.pdf)                   │
│ ○ CSV (.csv)                   │
├────────────────────────────────┤
│ Module                         │
│ [Dropdown: Dashboard ▼]        │
├────────────────────────────────┤
│ Filters                        │
│ Site: [ALASLA-29 ▼]           │
│ Date Range: [Oct 1-31 ▼]     │
│ Material: [All ▼]             │
├────────────────────────────────┤
│ Granularity                    │
│ ○ Daily                        │
│ ○ Weekly                       │
│ ○ Monthly                      │
├────────────────────────────────┤
│ Columns                        │
│ ☑ Date                         │
│ ☑ Material                     │
│ ☑ Quantity                     │
│ ☐ Notes                        │
├────────────────────────────────┤
│ Grouping                       │
│ [None ▼]                       │
├────────────────────────────────┤
│ Layout (PDF only)              │
│ ○ Portrait                     │
│ ○ Landscape                    │
└────────────────────────────────┘
```

**Footer** (64px):

```
┌────────────────────────────────┐
│ [Cancel]          [Export]     │
└────────────────────────────────┘
```

- Cancel: Secondary button (left)
- Export: Primary button (right)
- Button height: 40px

### 10.3 Field Specifications

**Source**: Document section "Export Dialog Fields"

#### Format Selection

**Type**: Radio buttons
**Options**:

1. Excel (.xlsx) - Default
2. PDF (.pdf)
3. CSV (.csv)
4. Power BI (.pbix) - Optional if supported

**Layout**:

```css
.format-option {
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
```

**Option Content**:

- Radio button: 20×20px
- Icon: File type icon (20×20px)
- Label: "Excel (.xlsx)"
- Description: Small text (12px, opacity 0.7)

#### Module Selection

**Type**: Dropdown
**Width**: 100%
**Height**: 40px

**Options**:

- Dashboard (all metrics summary)
- Production
- Dispatch
- Received
- Equipment
- Manpower
- Inventory
- Reports (custom)

**Default**: Current module/page user is on

#### Filters Section

**Site Filter**:

- Type: Dropdown
- Default: Current selected site
- Multi-select: Optional (allow "All Sites")

**Date Range Filter**:

- Type: Date picker (range mode)
- Default: Current selected date range
- Quick presets: Today, Last 7 Days, Last 30 Days, This Month

**Material Filter** (if applicable to module):

- Type: Multi-select dropdown
- Options: All material types
- Default: All selected

**Additional Filters**: Dynamic based on module

#### Granularity Selection

**Type**: Radio buttons
**Options**:

1. Daily (default)
2. Weekly
3. Monthly

**Visibility**: Hidden if not applicable (e.g., single-date export)

#### Columns Selection

**Type**: Checkbox list
**Max-height**: 200px (scrollable if many columns)

**Structure**:

```css
.column-checkbox-item {
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
```

**Features**:

- Select All / Deselect All toggle
- Required columns: Disabled checkboxes (always selected)
- Optional columns: User can toggle

**Default**: All columns selected

#### Grouping Selection

**Type**: Dropdown
**Options**:

- None (default)
- Group by Material
- Group by Date
- Group by Site
- Group by Type (context-dependent)

**Visibility**: Only for modules with groupable data

#### Layout Selection

**Type**: Radio buttons
**Options**:

1. Portrait
2. Landscape (default)

**Visibility**: Only when PDF format selected

### 10.4 Export Process Flow

**Source**: Document "Export Process Flow"

**Sequence**:

1. User clicks Export button (any location)
2. Dialog opens with pre-populated fields
3. User configures export options
4. User clicks "Export" button
5. Client-side validation (<150ms)
6. If valid: Job queued, toast notification
7. Progress indicator with estimated time
8. Server generates file
9. File ready notification (<10s target)
10. Download link provided or auto-download

#### Validation Rules

**Required Fields**:

- Format must be selected
- Module must be selected
- At least one column must be selected
- Date range must be valid (start <= end)

**Validation Errors**:

- Display: Inline below field with error icon
- Color: Danger color from tokens
- Font size: 12px
- Prevent submit: Disable Export button

**Example Error**:

```
⚠ Date range is invalid. End date must be after start date.
```

#### Toast Notifications

**Export Initiated**:

```
┌────────────────────────────────┐
│ ⏳ Export Started              │
│ Preparing your file...         │
└────────────────────────────────┘
```

- Duration: Persistent until complete
- Position: Bottom-right
- Type: Info

**Export Complete**:

```
┌────────────────────────────────┐
│ ✓ Export Ready                 │
│ [Download File]                │
└────────────────────────────────┘
```

- Duration: 10 seconds or until dismissed
- Position: Bottom-right
- Type: Success
- Action: Download button

**Export Failed**:

```
┌────────────────────────────────┐
│ ✕ Export Failed                │
│ An error occurred. [Retry]     │
└────────────────────────────────┘
```

- Duration: Until dismissed
- Position: Bottom-right
- Type: Error
- Action: Retry button

#### Progress Indicator

**Implementation**: Progress bar in toast

```css
.export-progress-toast {
  width: 360px;
  padding: 16px;
}

.progress-bar {
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
}

.progress-bar-fill {
  height: 100%;
  transition: width 300ms ease;
}
```

**Content**:

- Title: "Exporting..."
- Message: "Estimated time: 5 seconds"
- Progress bar: 0-100%
- Cancel button: Optional (cancels export job)

### 10.5 File Generation (Backend Contract)

**API Endpoint**: `/api/export`
**Method**: POST
**Content-Type**: application/json

**Request Body**:

```typescript
interface ExportRequest {
  format: 'xlsx' | 'pdf' | 'csv' | 'pbix';
  module: string;
  filters: {
    siteId?: string | string[];
    dateRange: { start: string; end: string };
    materialTypes?: string[];
    [key: string]: any; // Dynamic filters
  };
  granularity?: 'daily' | 'weekly' | 'monthly';
  columns: string[];
  grouping?: string;
  layout?: 'portrait' | 'landscape';
}
```

**Response** (Job Created):

```typescript
{
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTimeMs: number;
  createdAt: string;
}
```

**Polling Endpoint**: `/api/export/{jobId}/status`
**Method**: GET

**Response**:

```typescript
{
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  downloadUrl?: string; // When completed
  error?: string; // When failed
}
```

**Download Endpoint**: `/api/export/{jobId}/download`
**Method**: GET
**Response**: File stream with appropriate headers

### 10.6 Export File Naming Convention

**Format**: `{module}_{site}_{dateRange}_{timestamp}.{ext}`

**Examples**:

- `dashboard_ALASLA29_2025-10-01_2025-10-31_1730400000.xlsx`
- `production_AllSites_2025-10_1730400000.pdf`
- `inventory_ALASLA29_2025-10-31_1730400000.csv`

**Rules**:

- Module: Lowercase
- Site: Remove hyphens, alphanumeric only
- Date range: ISO format (YYYY-MM-DD)
- Timestamp: Unix timestamp
- Extension: Lowercase

---

## **11. DATA MODELS & API CONTRACTS**

### 11.1 Core Type Definitions

**Already Defined** (Source: User specifications):

- `ManpowerRole`
- `EquipmentDef`
- `EquipmentType`
- `ShiftType`
- `UOM`

**Additional Types**:

```typescript
export type MaterialType =
  | "AGGREGATE_BASE"
  | "CRUSHED_CONCRETE"
  | "RECYCLED_ASPHALT"
  | "FINE_SAND"
  | "COARSE_AGGREGATE"
  | "MIXED_RUBBLE";

export type TransactionType =
  | "RECEIVED"
  | "DISPATCHED"
  | "PRODUCTION";

export type RecordStatus =
  | "ACTIVE"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";
```

### 11.2 API Endpoint Structure

**Base URL**: `/api`
**Versioning**: None (source: forbidden versioned paths)

**Module Endpoints**:

- `/api/metrics/{metric-name}` - KPI metrics
- `/api/charts/{chart-name}` - Chart data
- `/api/production` - Production records
- `/api/dispatch` - Dispatch records
- `/api/received` - Received materials
- `/api/equipment` - Equipment logs
- `/api/manpower` - Manpower attendance
- `/api/inventory` - Inventory snapshots
- `/api/export` - Export jobs

### 11.3 Common Query Parameters

**Filtering**:

- `siteId`: string
- `startDate`: ISO date string
- `endDate`: ISO date string
- `materialType`: MaterialType[]
- `status`: RecordStatus

**Pagination**:

- `page`: number (default: 1)
- `pageSize`: number (default: 25)
- `sortBy`: string (column name)
- `sortOrder`: 'asc' | 'desc'

**Example**:

```
GET /api/production?siteId=ALASLA-29&startDate=2025-10-01&endDate=2025-10-31&page=1&pageSize=25&sortBy=date&sortOrder=desc
```

### 11.4 Common Response Structure

**Success Response**:

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
  timestamp: string;
}
```

**Error Response**:

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### 11.5 Inventory Calculation (SSOT)

**Source**: Document formula

**Formula**:

```typescript
const calculateClosingInventory = (data: {
  opening: number;
  production: number;
  received: number;
  dispatched: number;
}): number => {
  return data.opening + data.production + data.received - data.dispatched;
};
```

**Prerequisites** (All required before trigger):

1. Opening inventory recorded
2. Daily production logged
3. Received materials logged
4. Dispatched materials logged

**Trigger Condition**: All 4 inputs recorded for current date
**Action**: Calculate and store closing inventory snapshot

---

**End of Specification Document**
