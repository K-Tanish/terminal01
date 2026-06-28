import React, { useEffect, useState } from 'react';

export interface ToastConfig {
  id: number;
  rowCount: number;
  sortSummary: string;
  filterSummary: string;
  searchQuery: string;
  filename: string;
}

interface Props {
  toast: ToastConfig | null;
  onClose: () => void;
}

export const ExportToast: React.FC<Props> = ({ toast, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsClosing(false);
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 200); // Wait for exit animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '320px',
        pointerEvents: 'auto',
        animation: isClosing 
          ? 'toastExit 200ms ease-in forwards' 
          : 'toastEnter 250ms ease-out forwards'
      }}
    >
      <style>{`
        @keyframes toastEnter {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes toastExit {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(8px); opacity: 0; }
        }
      `}</style>
      
      <button 
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 200);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280'
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
        Snapshot Exported
      </div>
      
      <div style={{ fontSize: '13px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>{toast.rowCount} rows exported</div>
        <div>{toast.sortSummary}</div>
        <div>{toast.filterSummary}</div>
        {toast.searchQuery && <div>Search: "{toast.searchQuery}"</div>}
      </div>

      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8A93A6', marginTop: '12px' }}>
        {toast.filename}
      </div>
    </div>
  );
};
