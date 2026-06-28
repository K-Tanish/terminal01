import { useState, useCallback } from 'react';
import type { LayoutState } from '../types';

const STORAGE_KEY = 'rpa_layout_v1';

const DEFAULT_LAYOUT: LayoutState = {
  showKpiStrip: true,
  showDataGrid: true,
  showFiltersBar: true,
  showSearchBar: true,
  showStatusBar: true,
};

function loadLayout(): LayoutState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_LAYOUT, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_LAYOUT };
}

export function useLayoutPersistence() {
  const [layout, setLayout] = useState<LayoutState>(loadLayout);

  const togglePanel = useCallback((key: keyof LayoutState) => {
    setLayout((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const resetLayout = useCallback(() => {
    setLayout({ ...DEFAULT_LAYOUT });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { layout, togglePanel, resetLayout };
}
