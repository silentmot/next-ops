# DeskOps Dashboard Core Specification
<!--markdownlint-disable-file-->
**Using the current design system and tech stack, create a production-ready operational dashboard for the DeskOps system.**

**Document Structure**:
- **This Document**: Core implementation specifications (~2500 lines)
- **DeskOps-Dashboard-Appendix.md**: Optional features, variations, and detailed patterns
- **DeskOps-API-Specification.md**: Backend API contracts and data models

---

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

**End of Core Dashboard Specification**

**Related Documents**:
- `DeskOps-Dashboard-P2.md` - Detailed dashboard specification Row 3 and Row 4
- `DeskOps-Dashboard-P3.md` - Detailed dashboard specification Row 5 and Data Tables
- `DeskOps-Dashboard-Appendix.md` - Optional features, chart variations, interaction patterns, export details, table virtualization
- `DeskOps-API-Specification.md` - Backend API contracts, data models, endpoints, response structures
- `DeskOps-DB-Prisma.md` - Database schema and Prisma configuration
