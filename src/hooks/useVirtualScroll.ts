import { useRef, useState, useEffect, useCallback } from 'react';

export const ROW_HEIGHT = 48;
const OVERSCAN = 3;

export function useVirtualScroll(totalRows: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(500);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    ro.observe(el);
    setContainerHeight(el.clientHeight);

    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + OVERSCAN * 2;
  const rawStart = Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN;
  const startIndex = Math.max(0, rawStart);
  const endIndex = Math.min(totalRows, startIndex + visibleCount);

  const spacerTop = startIndex * ROW_HEIGHT;
  const spacerBottom = Math.max(0, (totalRows - endIndex) * ROW_HEIGHT);

  return {
    containerRef,
    startIndex,
    endIndex,
    visibleCount,
    spacerTop,
    spacerBottom,
    totalHeight: totalRows * ROW_HEIGHT,
  };
}
