# RPA Monitor

RPA Monitor is a modern React + TypeScript dashboard designed for monitoring robotic process automation activity in real time. It features a high-performance virtualized data grid, sleek glassmorphic UI elements, and a 3D-interactive landing page.

Built with purpose by **Tanish_K**.

## Key features

- Interactive 3D Landing Page with immersive models and smooth transitions
- Live stream of RPA project records with pause/play control
- Virtualized data grid for handling high-density datasets
- Concurrent multi-column sorting (Shift+Click) and fuzzy search engine
- Search and filter controls with a one-click "Clear All" reset
- On-demand row inspector panel when the stream is paused
- Glassmorphic Help Modal and Analytics overlay
- Project status badges, alert styling, and metrics display

## Tech Stack & Libraries

This project was built from the ground up for maximum performance and a bespoke aesthetic:
- **Core Framework:** React 18 + TypeScript + Tailwind CSS
- **Data Visualization:** **Chart.js** (for 2D analytics charts) and **Three.js** via `@react-three/fiber` (for immersive 3D landing page models).
- **Custom UI:** We explicitly **do not** use external UI component libraries (such as shadcn, Material UI, or Ant Design). Every component, including the high-performance virtualized data grid and sleek glassmorphic overlays, was custom-built from scratch.

## Installation

From the project root:

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the local development URL shown in the terminal, typically `http://localhost:5173`.

## Build for production

```bash
npm run build
```

## Project structure

- `src/App.tsx` — app root and dashboard layout
- `src/components/DataGrid.tsx` — virtualized table and row rendering
- `src/components/RowInspector.jsx` — slide-in inspector panel for paused rows
- `src/hooks/useStreamEngine.ts` — live data stream state and pause buffer logic
- `src/hooks/useRowInspector.js` — inspector state management
- `src/components/landing` — landing page UI
- `src/types.ts` — shared row and state type definitions

## Notes

The inspector panel is activated only when the stream is paused. Row clicks do not open inspection while the stream is live, and the inspector displays a frozen snapshot of the selected row.
