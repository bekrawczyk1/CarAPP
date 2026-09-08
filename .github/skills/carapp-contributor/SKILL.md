---
name: carapp-contributor
description: 'Use when contributing to CarAPP: a React 19, TypeScript, Vite, Tailwind CSS vehicle inventory app. Covers component structure, accessibility, testing, performance, GitHub Pages deployment, and validation practices.'
argument-hint: 'Describe the CarAPP feature, bug, refactor, or documentation task.'
user-invocable: true
---

# CarAPP Contributor Skill

Use this skill when modifying or reviewing the CarAPP repository. Keep changes focused, preserve existing behavior, and follow the project conventions below.

## Project Context

- Stack: React 19, TypeScript, Vite, Tailwind CSS 4.
- Data is currently mocked in `src/data/vehicles.ts`.
- The app is a responsive vehicle inventory with search, make filters, year/price range sliders, sorting, loading states, and inline price editing.
- GitHub Pages deploys from `main` through `.github/workflows/deploy.yml`.

## Structure

- `src/App.tsx`: application state, data loading, derived filtering, and composition.
- `src/components/FilterPanel.tsx`: search, make selection, and range filter UI.
- `src/components/VehicleTable.tsx`: result states, sorting, rows, and price editing.
- `src/components/ui/`: reusable UI primitives such as `Button` and `RangeSlider`.
- `src/data/`: data access and caching.
- `src/types/`: shared TypeScript types.
- `src/test/`: test setup.
- `docs/`: walkthrough and interview documentation.

## Contribution Procedure

1. Read the nearest component, type, test, and data implementation before editing.
2. State a local hypothesis about the behavior or defect and identify a focused check.
3. Prefer the smallest change at the owning abstraction.
4. Keep business rules in `App` or the data layer; keep feature components presentational and controlled.
5. Reuse existing `Button` and `RangeSlider` primitives before creating new controls.
6. Preserve responsive behavior: desktop table columns and mobile vehicle cards are intentionally different.
7. Update tests and documentation when behavior, public APIs, or workflows change.
8. Do not commit, push, reset, or remove unrelated user changes unless explicitly requested.

## React and TypeScript Rules

- Use strict, explicit prop types for components.
- Prefer derived values with `useMemo` over duplicated state.
- Use functional state updates when the next value depends on the previous value.
- Keep effects cancellable or guarded against updates after unmount.
- Avoid unnecessary `useMemo`/`useCallback`; add them when they prevent measurable or meaningful work.
- Keep reusable components controlled and generic where practical.
- Do not use `any` or suppress TypeScript errors without a documented reason.

## Accessibility Requirements

- Use native controls whenever possible.
- Every input needs a visible label or an appropriate accessible name.
- Preserve keyboard operation and visible `focus-visible` styles.
- Use `aria-pressed` for toggle-like make buttons.
- Keep range handles individually labeled and expose formatted values with `aria-valuetext`.
- Announce loading and result changes with concise live regions.
- Associate edit-mode status text with its price input.
- Do not rely on color, hover, or visual position alone to communicate state.
- If changing the desktop grid toward table semantics, consider a semantic `<table>` with proper headers and cells.

## Testing Requirements

Use Vitest and React Testing Library. Test user-visible behavior with `user-event`; avoid asserting private state or implementation details.

Before finishing a change, run:

```bash
npm test -- --run
npm run test:coverage
npm run lint
npm run build
```

Maintain at least 80% coverage for statements, branches, functions, and lines. Add tests for:

- New user workflows and state transitions.
- Loading, empty, error, and boundary states.
- Keyboard behavior and accessible names where controls change.
- Slider minimum/maximum behavior.
- Editing validation and persistence behavior.

## Performance Guidelines

- Keep the current `useDeferredValue` behavior for rapid filtering unless replacing it with an equivalent strategy.
- Avoid copying large arrays unnecessarily in filter paths.
- Keep expensive derived calculations memoized by stable dependencies.
- Reuse the vehicle cache or replace it with a deliberate data-fetching cache.
- For large inventories, prefer server-side filtering, sorting, and pagination.
- Use row virtualization when many result rows must be rendered.
- Consider request cancellation, cache invalidation, and error handling when replacing the mock loader with an API.

## Styling Guidelines

- Use Tailwind utility classes; do not reintroduce component-specific CSS files without a strong reason.
- Preserve the warm stone, emerald, amber, and cream palette.
- Keep desktop and mobile layouts intentional and independently readable.
- Avoid layout shifts during loading, filtering, and inline editing.
- Keep focus, hover, disabled, loading, and empty states visible.

## Deployment

- GitHub Pages expects the Vite base path `/CarAPP/` in Actions builds.
- The deployment workflow runs on pushes to `main`.
- Validate with `npm run build` before pushing.
- Public URL: `https://bekrawczyk1.github.io/CarAPP/`.

## Completion Checklist

- Behavior works for normal, empty, loading, and narrow-screen states.
- Accessibility names, keyboard focus, and live announcements remain correct.
- Tests cover the changed behavior.
- `npm test -- --run` passes.
- `npm run test:coverage` passes the 80% thresholds.
- `npm run lint` passes without warnings.
- `npm run build` passes.
- README or docs are updated when contributor-facing behavior changes.
