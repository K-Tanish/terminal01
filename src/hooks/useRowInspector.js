import { useState, useCallback } from 'react';

export function useRowInspector(isPaused) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const openInspector = useCallback(
    (row) => {
      if (!isPaused || !row) return;
      setSelectedRow(row);
      setIsInspectorOpen(true);
    },
    [isPaused]
  );

  const closeInspector = useCallback(() => {
    setIsInspectorOpen(false);
    setSelectedRow(null);
  }, []);

  return {
    selectedRow,
    isInspectorOpen,
    openInspector,
    closeInspector,
  };
}
