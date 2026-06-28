import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LIME_ACCENT = '#a8d91d';

export const HelpModal = React.memo(function HelpModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 transform transition-all text-white overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: LIME_ACCENT }}>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Dashboard Guide</h2>
            <p className="text-xs text-gray-400 mt-0.5">Quick instructions for terminal operations</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm leading-relaxed text-gray-300">
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a8d91d] mt-2 shrink-0" />
            <p><strong>Sort Data:</strong> Click any column header to sort. Use <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs mx-0.5">Shift + Click</code> to sort by multiple columns concurrently.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a8d91d] mt-2 shrink-0" />
            <p><strong>Fuzzy Search:</strong> Type anything in the search bar. The engine supports partial and out-of-order queries across multiple fields instantly.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a8d91d] mt-2 shrink-0" />
            <p><strong>Customize View:</strong> Tap the settings button in the top right to open the sidebar and toggle specific panels or features on and off.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a8d91d] mt-2 shrink-0" />
            <p><strong>Row Inspection:</strong> Pause the live stream using the top control, then click on any row to open a detailed inspection panel.</p>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a8d91d] mt-2 shrink-0" />
            <p><strong>Export Snapshot:</strong> Press <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs mx-0.5">Ctrl + E</code> or click the Export button to instantly download your current filtered view as a CSV.</p>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Bottom decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: LIME_ACCENT }} />
      </div>
    </div>
  );
});
