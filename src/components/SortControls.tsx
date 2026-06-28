import React from 'react';
import type { SortConfig } from '../types';

interface Props {
  columnKey: string;
  sortConfigs: SortConfig[];
  onClick: (key: string, shiftKey: boolean) => void;
  sortable?: boolean;
}

export const SortControls = React.memo(function SortControls({ columnKey, sortConfigs, onClick, sortable = false }: Props) {
  const config = sortConfigs.find((c) => c.key === columnKey);

  if (!sortable) {
    return (
      <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    );
  }

  return (
    <button
      className="flex items-center gap-1 group"
      onClick={(e) => onClick(columnKey, e.shiftKey)}
      title={`Sort by ${columnKey}${' (Shift+Click for multi-sort)'}`}
    >
      {config && (
        <span className="w-4 h-4 rounded-full bg-[#e3ff73] text-black inline-flex items-center justify-center text-[8px] font-bold shrink-0">
          {config.priority}
        </span>
      )}
      {config ? (
        config.direction === 'asc' ? (
          <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} />
          </svg>
        )
      ) : (
        <svg className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )}
    </button>
  );
});
