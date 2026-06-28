import { useRef, useState, useEffect, useCallback } from 'react';
import type { RpaRow, KpiDisplay, FilterOptions } from '../types';

const MAX_POOL = 50_000;

export function useStreamEngine() {
  const dataPoolRef = useRef<Map<string, RpaRow>>(new Map());
  const filterOptionsRef = useRef<FilterOptions>({
    automation_type: [],
    department: [],
    industry: [],
    implementation_partner: [],
    country: [],
  });

  // KPI accumulators — never in state
  const totalRowsRef = useRef(0);
  const totalRobotsRef = useRef(0);
  const totalSavingsRef = useRef(0);

  // Per-tick deltas
  const tickRowsRef = useRef(0);
  const tickRobotsRef = useRef(0);
  const tickSavingsRef = useRef(0);

  const isPausedRef = useRef(false);
  const bufferRef = useRef<RpaRow[][]>([]);
  const snapshotRef = useRef<RpaRow[]>([]);
  const pauseTimestampRef = useRef<number>(0);

  const [isPaused, setIsPaused] = useState(false);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [kpi, setKpi] = useState<KpiDisplay>({
    totalRows: 0,
    activeRobots: 0,
    globalSavings: 0,
    lastBatchRows: 0,
    lastBatchRobots: 0,
    lastBatchSavings: 0,
    lastUpdate: new Date(),
  });

  // Snapshot of the pool for the grid — updated on flush
  const [viewVersion, setViewVersion] = useState(0);

  const updateFilterOptions = useCallback((rows: RpaRow[]) => {
    const opts = filterOptionsRef.current;
    let changed = false;
    for (const row of rows) {
      (['automation_type', 'department', 'industry', 'implementation_partner', 'country'] as const).forEach((key) => {
        const val = row[key] as string;
        if (val && !opts[key].includes(val)) {
          opts[key] = [...opts[key], val].sort();
          changed = true;
        }
      });
    }
    return changed;
  }, []);

  const processBatch = useCallback((batch: RpaRow[]) => {
    const pool = dataPoolRef.current;
    let batchRobots = 0;
    let batchSavings = 0;

    const alertedBatch: RpaRow[] = [];

    for (const row of batch) {
      const isAlert = row.project_status === 'Failed' || row.roi_percent < 0;
      const existing = pool.get(row.project_id);

      if (!existing) {
        // New row
        if (pool.size >= MAX_POOL) {
          // Replace oldest: find first key
          const firstKey = pool.keys().next().value;
          if (firstKey) pool.delete(firstKey);
        }
        const newRow: RpaRow = { ...row, _alertKey: isAlert ? Date.now() : undefined };
        pool.set(row.project_id, newRow);
        totalRowsRef.current += 1;
      } else {
        // Update existing
        const updatedRow: RpaRow = {
          ...row,
          _alertKey: isAlert && existing._alertKey !== row.roi_percent + (row.robots_deployed || 0)
            ? Date.now()
            : existing._alertKey,
        };
        if (isAlert && existing.project_status !== 'Failed' && existing.roi_percent >= 0) {
          updatedRow._alertKey = Date.now();
        }
        pool.set(row.project_id, updatedRow);
        totalRowsRef.current += 1;
      }

      batchRobots += row.robots_deployed || 0;
      batchSavings += row.annual_savings_usd || 0;
      alertedBatch.push(row);
    }

    totalRobotsRef.current += batchRobots;
    totalSavingsRef.current += batchSavings;
    tickRowsRef.current += batch.length;
    tickRobotsRef.current += batchRobots;
    tickSavingsRef.current += batchSavings;

    updateFilterOptions(alertedBatch);
  }, [updateFilterOptions]);

  const streamCallback = useCallback((incoming: RpaRow[]) => {
    if (isPausedRef.current) {
      bufferRef.current.push(incoming);
      setBufferedCount((c) => c + incoming.length);
      return;
    }
    processBatch(incoming);
  }, [processBatch]);

  const flushBuffer = useCallback(() => {
    const batches = bufferRef.current;
    bufferRef.current = [];
    setBufferedCount(0);
    for (const batch of batches) {
      processBatch(batch);
    }
    setViewVersion((v) => v + 1);
  }, [processBatch]);

  const togglePause = useCallback(() => {
    const next = !isPausedRef.current;
    isPausedRef.current = next;

    if (next) {
      snapshotRef.current = Array.from(dataPoolRef.current.values());
      pauseTimestampRef.current = Date.now();
    }

    setIsPaused(next);
    if (!next) {
      flushBuffer();
    }
  }, [flushBuffer]);

  // KPI flush interval
  useEffect(() => {
    const interval = setInterval(() => {
      const batchRows = tickRowsRef.current;
      const batchRobots = tickRobotsRef.current;
      const batchSavings = tickSavingsRef.current;
      tickRowsRef.current = 0;
      tickRobotsRef.current = 0;
      tickSavingsRef.current = 0;

      setKpi({
        totalRows: totalRowsRef.current,
        activeRobots: totalRobotsRef.current,
        globalSavings: totalSavingsRef.current,
        lastBatchRows: batchRows,
        lastBatchRobots: batchRobots,
        lastBatchSavings: batchSavings,
        lastUpdate: new Date(),
      });

      if (!isPausedRef.current) {
        setViewVersion((v) => v + 1);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Init stream
  useEffect(() => {
    if (window.initializeRpaStream) {
      window.initializeRpaStream(streamCallback, '/automation_projects.csv');
    }
    return () => {
      if (window.stopRpaStream) window.stopRpaStream();
    };
  }, [streamCallback]);

  const getPoolSnapshot = useCallback((): RpaRow[] => {
    return Array.from(dataPoolRef.current.values());
  }, []);

  return {
    kpi,
    isPaused,
    bufferedCount,
    togglePause,
    filterOptions: filterOptionsRef,
    getPoolSnapshot,
    viewVersion,
    snapshotRef,
    pauseTimestampRef,
  };
}
