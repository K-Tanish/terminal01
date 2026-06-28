import React from 'react';

interface Props {
  totalFiltered: number;
  totalPool: number;
  isPaused: boolean;
}

export const StatusBar = React.memo(function StatusBar({ totalFiltered, totalPool, isPaused }: Props) {
  return (
    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
      <div className="text-xs font-medium text-gray-500">
        Showing{' '}
        <span className="text-gray-900">
          {Math.min(500, totalFiltered).toLocaleString()}
        </span>{' '}
        of{' '}
        <span className="text-blue-600 font-semibold">
          {totalPool.toLocaleString()}
        </span>{' '}
        filtered rows
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
          <span
            className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-green-500'}`}
          />
          {isPaused ? 'Stream Paused' : 'Auto-updating every 200ms'}
        </div>
      </div>
    </div>
  );
});
