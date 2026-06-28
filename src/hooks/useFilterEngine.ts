import { useState, useCallback } from 'react';
import type { FilterState } from '../types';

const DEFAULT_FILTERS: FilterState = {
  automation_type: [],
  department: [],
  industry: [],
  implementation_partner: [],
  country: [],
};

export function useFilterEngine() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });

  const setFilter = useCallback((key: keyof FilterState, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  return { filters, setFilter, resetFilters };
}
