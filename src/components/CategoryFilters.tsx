import React from 'react';
import type { FilterState, FilterOptions } from '../types';

interface Props {
  filters: FilterState;
  options: FilterOptions;
  onFilter: (key: keyof FilterState, values: string[]) => void;
  onClearAll: () => void;
}

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const displayValue = selected.length === 0 ? 'All' : selected.join(', ');

  return (
    <div className="relative">
      <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] text-gray-500 font-bold z-10 truncate max-w-[90%]">
        {label}
      </label>
      <select
        multiple={false}
        value={selected.length === 0 ? '' : selected[0]}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            onChange([]);
          } else {
            onChange([val]);
          }
        }}
        className="w-full border border-gray-200 rounded-xl text-xs py-2.5 px-3 focus:ring-1 focus:ring-black focus:border-black outline-none bg-white appearance-none cursor-pointer pr-7"
        title={displayValue}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    </div>
  );
}

export const CategoryFilters = React.memo(function CategoryFilters({ filters, options, onFilter, onClearAll }: Props) {
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
      <div className="p-2 border border-gray-200 rounded-lg text-gray-400 shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </div>
      <div className="grid grid-cols-5 flex-1 gap-3">
        <MultiSelect
          label="Automation Type"
          options={options.automation_type}
          selected={filters.automation_type}
          onChange={(v) => onFilter('automation_type', v)}
        />
        <MultiSelect
          label="Department"
          options={options.department}
          selected={filters.department}
          onChange={(v) => onFilter('department', v)}
        />
        <MultiSelect
          label="Industry"
          options={options.industry}
          selected={filters.industry}
          onChange={(v) => onFilter('industry', v)}
        />
        <MultiSelect
          label="Impl. Partner"
          options={options.implementation_partner}
          selected={filters.implementation_partner}
          onChange={(v) => onFilter('implementation_partner', v)}
        />
        <MultiSelect
          label="Country"
          options={options.country}
          selected={filters.country}
          onChange={(v) => onFilter('country', v)}
        />
      </div>
      
      {hasActiveFilters && (
        <div className="shrink-0 pl-2 border-l border-gray-100">
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors px-3 py-2 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
});
