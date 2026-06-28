import { useMemo } from 'react';
import type { RpaRow, SortConfig, FilterState } from '../types';
import { stableSort } from '../utils/sortHelpers';
import { fuzzyMatch } from '../utils/fuzzyMatcher';

export function useDataProcessor(
  rows: RpaRow[],
  filters: FilterState,
  searchQuery: string,
  sortConfigs: SortConfig[]
) {
  const filteredRows = useMemo(() => {
    let result = rows;

    if (filters.automation_type.length > 0) {
      result = result.filter((r) => filters.automation_type.includes(r.automation_type));
    }
    if (filters.department.length > 0) {
      result = result.filter((r) => filters.department.includes(r.department));
    }
    if (filters.industry.length > 0) {
      result = result.filter((r) => filters.industry.includes(r.industry));
    }
    if (filters.implementation_partner.length > 0) {
      result = result.filter((r) => filters.implementation_partner.includes(r.implementation_partner));
    }
    if (filters.country.length > 0) {
      result = result.filter((r) => filters.country.includes(r.country));
    }

    if (searchQuery.trim()) {
      const tokens = searchQuery.toLowerCase().trim().split(/\s+/);
      result = result.filter((r) => fuzzyMatch(r, tokens));
    }

    return result;
  }, [rows, filters, searchQuery]);

  const sortedRows = useMemo(() => {
    return stableSort(filteredRows, sortConfigs);
  }, [filteredRows, sortConfigs]);

  return { filteredRows, sortedRows };
}
