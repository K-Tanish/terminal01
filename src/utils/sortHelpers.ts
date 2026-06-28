import type { RpaRow, SortConfig } from '../types';

export function stableSort(arr: RpaRow[], sortConfigs: SortConfig[]): RpaRow[] {
  if (!sortConfigs.length) return arr;

  return [...arr].sort((a, b) => {
    for (const config of sortConfigs) {
      const aVal = a[config.key as keyof RpaRow];
      const bVal = b[config.key as keyof RpaRow];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
      }
      if (cmp !== 0) {
        return config.direction === 'asc' ? cmp : -cmp;
      }
    }
    return 0;
  });
}
