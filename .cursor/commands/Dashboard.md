---
**Agent Type**: UI/UX Artistic
**Task**: Build DeskOps Dashboard demo page
**Mode**: Creative (with Factual constraints from design system)
---
# DeskOps Dashboard Demo Page

## Request Scope

### Primary Source

- `docs\DeskOps-Dashboard.md` (dashboard specification and requirements)

### Design System Resources (SSOT)

- `app/globals.css` (global styles - exact import path required)
- `@lib/DesignTokens` (design tokens: colors, typography, spacing, shadows)
- `@components` (reusable UI components: Button, Card, Modal, Badge, etc.)

### Data Resources (SSOT)

- `@lib/constants` (static configuration data)
- `@/lib/db` (Prisma Client instance)
- `app/api/[module]/[resource]` (API routes - NO versioned paths)
- `app/actions/[action-name]` (server actions)

### Tooling Context

- **Runtime**: Bun (use `bun` and `bunx` for package management)
- **Database**: Prisma ORM (`bunx prisma` for CLI operations)
- **Linting**: Biome (`bunx biome check` and `bunx biome format`)

## Deliverables

1. **Dashboard Page Demo Page** (`app/(protected)/dashboard/page.tsx` or similar)
   - Server Component with data fetching
   - Responsive layout using design system grid/spacing tokens
   - Type-safe props and data structures (NO `any` types)

2. **Required Imports**
   - Design tokens from `@lib/DesignTokens`
   - Reusable components from `@components`
   - Static constants from `@lib/constants`
   - Type definitions for all data structures

3. **Data Integration**
   - Static data: Import from `@lib/constants`
   - Dynamic data: Fetch via Prisma Client or API routes
   - Server actions: Use for mutations/state changes
   - All endpoints must follow `/api/[module]/[resource]` format

4. **Styling Requirements**
   - Use design system tokens exclusively (no arbitrary values)
   - Reference `app/globals.css` for global styles
   - Implement responsive breakpoints from design system
   - Ensure WCAG 2.1 AA accessibility compliance

## Constraints

- **Type Safety**: All data structures must have explicit TypeScript interfaces
- **SSOT Compliance**: Import all constants/tokens, never duplicate
- **Endpoint Format**: `/api/[module]/[resource]` only (NO `/api/v1/...`)
- **File Naming**: Use exact path specifications (no suffixes like `_new`, `_v2`)
- **Terminology**: Avoid banned terms (Enhanced, Improved, Optimized, etc.)

## Expected Workflow

1. Read `docs\DeskOps-Dashboard.md` for requirements
2. Inventory available design tokens and components
3. Define TypeScript interfaces for all data structures
4. Implement server-side data fetching (Prisma/API)
5. Build component tree using design system primitives
6. Apply responsive layout with design tokens
7. Validate accessibility and type safety

## Output Format

Provide the complete component file with:

- File path comment at top
- All necessary imports with exact paths
- Type-safe interfaces/types
- Component implementation
- Export statement

Include a compliance report confirming:

- ✅ Design system tokens used (source: `@lib/DesignTokens`)
- ✅ No `any` types present
- ✅ Endpoints follow standard format
- ✅ SSOT constants imported
- ✅ Accessibility considerations addressed

**Mode Confirmation**: Creative (UI design) with Factual constraints (design system adherence)
