# CarAPP

CarAPP is a responsive vehicle inventory interface built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Search vehicles by make, model, year, or price
- Filter by multiple makes
- Filter by year and price ranges with reusable dual-handle sliders
- Sort prices in ascending or descending order
- Edit vehicle prices inline
- Loading, empty, and responsive mobile states
- Keyboard and screen-reader accessibility support for interactive controls
- Cached vehicle loading and deferred filtering for smoother interaction

## Getting Started

Requirements:

- Node.js 18 or newer
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests and generate text/HTML coverage reports |

## Project Structure

```text
src/
  App.tsx                     Application state and composition
  components/
    FilterPanel.tsx           Search, make, and range filters
    VehicleTable.tsx          Results, sorting, and inline price editing
    ui/
      Button.tsx              Shared button primitive
      RangeSlider.tsx         Shared dual-handle range slider
  data/
    vehicles.ts               Vehicle data loader and in-memory cache
  types/
    vehicle.ts                Shared vehicle and range types
  test/
    setup.ts                  Testing Library setup
  App.test.tsx                User-flow integration tests
```

## Testing Approach

Tests use Vitest, React Testing Library, `user-event`, and jsdom. The suite focuses on user-visible workflows rather than implementation details, including loading, filtering, sliders, clearing filters, sorting, editing, and focus behavior.

Coverage is generated with Vitest's V8 provider. The project enforces a minimum of 80% for statements, branches, functions, and lines.

## Performance Notes

The current client-side implementation uses:

- `useDeferredValue` for responsive filtering while dragging sliders
- `useMemo` for derived vehicle results and range bounds
- A shared in-memory cache and in-flight request reuse for vehicle loading
- A stable results area to reduce layout movement during filtering

For a substantially larger inventory, move filtering, sorting, and pagination to the server and add row virtualization, for example with `@tanstack/react-virtual`. A production API cache such as TanStack Query or SWR would also provide stale-data handling, refetching, and request cancellation.
