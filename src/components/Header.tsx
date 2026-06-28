import React from 'react';
import { PausePlayControl } from './PausePlayControl';
import { formatTime } from '../utils/formatters';
import type { KpiDisplay } from '../types';

interface Props {
  kpi: KpiDisplay;
  isPaused: boolean;
  bufferedCount: number;
  onTogglePause: () => void;
  onOpenAnalytics: () => void;
  onExport: () => void;
  onToggleSidebar: () => void;
}

export const Header = React.memo(function Header({ kpi, isPaused, bufferedCount, onTogglePause, onOpenAnalytics, onExport, onToggleSidebar }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#e3ff73] rounded-full flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">RPA CONTROL TERMINAL</h2>
          <p className="text-xs text-gray-500 font-medium">High-Density Enterprise Monitor</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Live Stream</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-gray-900">{isPaused ? 'Paused' : 'Connected'}</span>
            </span>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="text-gray-900">
            <span className="text-gray-500">Last Update:</span>{' '}
            {formatTime(kpi.lastUpdate)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PausePlayControl
            isPaused={isPaused}
            bufferedCount={bufferedCount}
            onToggle={onTogglePause}
          />
          {isPaused && (
            <button
              onClick={onOpenAnalytics}
              className="bg-black text-white rounded-xl px-4 h-10 text-[13px] font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics View
            </button>
          )}
          <button 
            onClick={onExport}
            title="Export CSV (Ctrl+E)"
            className="bg-blue-600 text-white rounded-xl px-4 h-10 text-[13px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button 
            onClick={onToggleSidebar}
            className="p-2.5 h-10 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
});
