import React, { useMemo } from 'react';
import type { RpaRow, SortConfig, FilterState } from '../types';
import { stableSort } from '../utils/sortHelpers';
import { fuzzyMatch } from '../utils/fuzzyMatcher';
import { useVirtualScroll } from '../hooks/useVirtualScroll';
import { AlertRow } from './AlertRow';
import { SortControls } from './SortControls';

interface Props {
  rows: RpaRow[];
  sortConfigs: SortConfig[];
  filters: FilterState;
  searchQuery: string;
  onHeaderClick: (key: string, shiftKey: boolean) => void;
  onFilteredCount: (n: number) => void;
  isPaused: boolean;
  openInspector: (row: RpaRow) => void;
  selectedRow: RpaRow | null;
  isInspectorOpen: boolean;
}

interface ColDef {
  key: string;
  label: string;
  sortable?: boolean;
  center?: boolean;
  extraClass?: string;
}

const COLUMNS: ColDef[] = [
  { key: 'project_id', label: 'Project ID' },
  { key: 'project_name', label: 'Project Name' },
  { key: 'project_status', label: 'Project Status', center: true },
  { key: 'automation_type', label: 'Automation Type' },
  { key: 'robots_deployed', label: 'Robots Deployed', center: true },
  { key: 'budget_usd', label: 'Budget (USD)', sortable: true },
  { key: 'annual_savings_usd', label: 'Annual Savings' },
  { key: 'roi_percent', label: 'ROI %', sortable: true },
  { key: 'employee_hours_saved', label: 'Emp. Hours Saved', sortable: true },
  { key: 'department', label: 'Department' },
  { key: 'industry', label: 'Industry' },
  { key: 'implementation_partner', label: 'Impl. Partner', extraClass: 'hidden xl:table-cell' },
  { key: 'country', label: 'Country', extraClass: 'hidden 2xl:table-cell' },
];

export const DataGrid = React.memo(function DataGrid({
  rows,
  sortConfigs,
  filters,
  searchQuery,
  onHeaderClick,
  onFilteredCount,
  isPaused,
  openInspector,
  selectedRow,
  isInspectorOpen,
}: Props) {
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

    if (searchQuery) {
      result = result.filter((r) => fuzzyMatch(r, searchQuery));
    }

    return result;
  }, [rows, filters, searchQuery]);

  const sortedRows = useMemo(() => {
    return stableSort(filteredRows, sortConfigs);
  }, [filteredRows, sortConfigs]);

  // Report filtered count to parent
  const filteredCount = sortedRows.length;
  React.useEffect(() => {
    onFilteredCount(filteredCount);
  }, [filteredCount, onFilteredCount]);

  const { containerRef, startIndex, endIndex, spacerTop, spacerBottom } = useVirtualScroll(sortedRows.length);

  const visibleRows = sortedRows.slice(startIndex, endIndex);

  const handleRowClick = (row: RpaRow) => {
    if (!isPaused) return;
    openInspector(row);
  };

  return (
    <div
      ref={containerRef}
      className="overflow-auto custom-scrollbar"
      style={{ flex: 1, minHeight: 0, maxHeight: 'calc(100vh - 380px)', minWidth: 0 }}
    >
      <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed', minWidth: 1100 }}>
        <colgroup>
          <col style={{ width: 110 }} />
          <col style={{ width: 180 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 160 }} />
          <col style={{ width: 90 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 90 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 140 }} className="hidden xl:table-column" />
          <col style={{ width: 120 }} className="hidden 2xl:table-column" />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap select-none ${
                  col.center ? 'text-center' : ''
                } ${col.extraClass || ''}`}
              >
                <div className={`flex items-center gap-1.5 ${col.center ? 'justify-center' : ''}`}>
                  <span>{col.label}</span>
                  {col.sortable ? (
                    <SortControls
                      columnKey={col.key}
                      sortConfigs={sortConfigs}
                      onClick={onHeaderClick}
                      sortable
                    />
                  ) : (
                    <svg className="w-3 h-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spacerTop > 0 && (
            <tr aria-hidden="true">
              <td colSpan={COLUMNS.length} style={{ height: spacerTop, padding: 0, border: 'none' }} />
            </tr>
          )}
          {visibleRows.map((row) => (
            <AlertRow
              key={row.project_id}
              row={row}
              isPaused={isPaused}
              selected={isInspectorOpen && selectedRow?.project_id === row.project_id}
              onClick={() => handleRowClick(row)}
            />
          ))}
          {spacerBottom > 0 && (
            <tr aria-hidden="true">
              <td colSpan={COLUMNS.length} style={{ height: spacerBottom, padding: 0, border: 'none' }} />
            </tr>
          )}
        </tbody>
      </table>
      {sortedRows.length === 0 && (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No rows match the current filters
        </div>
      )}
    </div>
  );
});
