import { useState, useCallback } from 'react';
import type { SortConfig, SortDirection } from '../types';

export function useSortEngine() {
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  const handleHeaderClick = useCallback((key: string, shiftKey: boolean) => {
    setSortConfigs((prev) => {
      if (shiftKey) {
        // Multi-sort: add or cycle this key
        const existing = prev.find((c) => c.key === key);
        if (!existing) {
          return [...prev, { key, direction: 'asc', priority: prev.length + 1 }];
        }
        if (existing.direction === 'asc') {
          return prev.map((c) => c.key === key ? { ...c, direction: 'desc' as SortDirection } : c);
        }
        // Remove this key
        const filtered = prev.filter((c) => c.key !== key);
        return filtered.map((c, i) => ({ ...c, priority: i + 1 }));
      } else {
        // Single sort: reset and set this column
        const existing = prev.find((c) => c.key === key);
        if (!existing) {
          return [{ key, direction: 'asc', priority: 1 }];
        }
        if (existing.direction === 'asc') {
          return [{ key, direction: 'desc', priority: 1 }];
        }
        // Third click = reset
        return [];
      }
    });
  }, []);

  return { sortConfigs, handleHeaderClick };
}
