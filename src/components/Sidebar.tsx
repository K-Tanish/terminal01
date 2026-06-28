import React from 'react';
import type { LayoutState } from '../types';

interface Props {
  layout: LayoutState;
  onToggle: (key: keyof LayoutState) => void;
  onReset: () => void;
  onGoHome: () => void;
}

interface ToggleItem {
  key: keyof LayoutState;
  label: string;
  icon: React.ReactNode;
}

const PANELS: ToggleItem[] = [
  {
    key: 'showKpiStrip',
    label: 'KPI Strip',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    ),
  },
  {
    key: 'showDataGrid',
    label: 'Data Grid',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    ),
  },
  {
    key: 'showFiltersBar',
    label: 'Filters Bar',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
  {
    key: 'showSearchBar',
    label: 'Search Bar',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    ),
  },
  {
    key: 'showStatusBar',
    label: 'Status Bar',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    ),
  },
];

export function Sidebar({ layout, onToggle, onReset, onGoHome }: Props) {
  return (
    <aside
      className="w-60 flex flex-col shrink-0 text-gray-400 p-4 overflow-y-auto"
      style={{ backgroundColor: '#0b0b0b' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-[#e3ff73] rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
        <div className="leading-tight">
          <h1 className="text-white text-xs font-bold uppercase tracking-wider">RPA Control</h1>
          <h1 className="text-white text-xs font-bold uppercase tracking-wider">Terminal</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-8">
        <a 
          className="flex items-center gap-3 px-3 py-2 text-sm hover:text-white transition-colors cursor-pointer" 
          onClick={(e) => { e.preventDefault(); onGoHome(); }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Home Screen
        </a>
        <a className="flex items-center gap-3 px-3 py-2 text-sm hover:text-white transition-colors" href="#">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Share
        </a>
        <a
          className="flex items-center gap-3 px-3 py-2 text-sm text-black bg-[#e3ff73] rounded-lg font-medium"
          href="#"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44a1.002 1.002 0 0 1-.94 0l-7.9-4.44A.99.99 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.09.34-.14.52-.14s.36.05.52.14l7.9 4.44c.32.18.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15z" />
          </svg>
          Workspace
        </a>
      </nav>

      {/* Panel Toggles */}
      <div className="mt-2">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">Workspace</p>
        <p className="text-[11px] text-gray-400 px-3 mb-4">Show / Hide Panels</p>
        <div className="space-y-3.5 px-3">
          {PANELS.map((panel) => (
            <div key={panel.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {panel.icon}
                <span className="text-xs">{panel.label}</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={layout[panel.key]}
                  onChange={() => onToggle(panel.key)}
                />
                <span className="slider" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Profile / Reset */}
      <div className="pt-6 border-t border-gray-800 mt-auto">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">Layout Settings</p>
        <button
          onClick={onReset}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-gray-300 hover:text-white mb-5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Reset to Default
        </button>
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            KW
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Kristin Watson</p>
            <p className="text-[10px] text-gray-500">Design Manager</p>
          </div>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </div>
      </div>
    </aside>
  );
}
