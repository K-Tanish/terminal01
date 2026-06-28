import React from 'react';

interface Props {
  isPaused: boolean;
  bufferedCount: number;
  onToggle: () => void;
}

export const PausePlayControl = React.memo(function PausePlayControl({ isPaused, bufferedCount, onToggle }: Props) {
  return (
    <div className="flex items-center gap-3">
      {isPaused && bufferedCount > 0 && (
        <div className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
          Buffered: {bufferedCount.toLocaleString()} rows
        </div>
      )}
      <button
        onClick={onToggle}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
          isPaused
            ? 'bg-[#e3ff73] text-black hover:bg-[#d4f060]'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isPaused ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            Pause
          </>
        )}
      </button>
    </div>
  );
});
