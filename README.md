# RPA Monitor

RPA Monitor is a React + TypeScript dashboard for monitoring robotic process automation activity in real time. It includes live stream controls, filtering, sorting, and a virtualized data grid for high-performance row rendering.

## Key features

- Live stream of RPA project records with pause/play control
- Virtualized data grid for large datasets
- Search and filter controls for automation type, department, industry, partner, and country
- On-demand row inspector panel when the stream is paused
- Project status badges, alert styling, and metrics display

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
