---
model: Claude Sonnet 4.5
---

> Review the file **`DeskOps-DashboardGuide.md`** thoroughly to understand the entire design system and its structure.
>
> After analyzing the guide, perform the following tasks with precision and structure:
>
> 1. **Define and Consolidate Design Tokens**
>
>    - Collect every existing token and constant defined in the documentation.
>    - Identify any missing tokens based on established **UI/UX best practices** and **design system principles** (typography, spacing, color, elevation, breakpoints, transitions, etc.).
>    - Generate a TypeScript file named **`DesignTokens.ts`** that will serve as the **Single Source of Truth (SSOT)** for a full-stack monorepo containing **4 applications** and **13 packages**.
>    - Ensure all color values use **`oklch()`** formatting.
>    - Include all possible CSS tokens that can be represented and managed in TypeScript.
>
> 2. **Global Styles File**
>
>    - For any styles or configurations that cannot be imported or expressed via TypeScript (e.g., resets, browser defaults, base layers, non-tokenizable values), create a **`globals.css`** file.
>    - This file must complement `DesignTokens.ts` without duplicating logic.
>    - Apply consistent CSS variable naming derived from the tokens file for maintainability.
>
> 3. **Implementation Guide**
>
>    - Draft a **complete implementation guide** detailing how to integrate the design system into a **Next.js application** structured as a **stand-alone repo** (no `/src` directory; only `/app`).
>    - The guide should describe:
>
>      - How to import and apply `DesignTokens.ts` and `globals.css`.
>      - How to manage theme variants (light/dark modes, accessibility themes).
>      - The correct approach to reference tokens across all apps/packages.
>      - How to maintain SSOT integrity across the repo.
>
> Deliverables:
>
> - `DesignTokens.ts`
> - `globals.css`
> - `DesignSystem-ImplementationGuide.md`
>
> **Constraints:**
>
> - Every color in `oklch`.
> - Maintain modular and scalable token architecture.
> - Follow naming conventions that enforce clarity, version control, and reusability.
>
> **Goal:** Produce a definitive, future-proof design foundation for the DeskOps ecosystem consistent across all apps and packages.
