import { useState, useMemo, useCallback } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { useStreamEngine } from './hooks/useStreamEngine';
import { useSortEngine } from './hooks/useSortEngine';
import { useFilterEngine } from './hooks/useFilterEngine';
import { useFuzzySearch } from './hooks/useFuzzySearch';
import { useLayoutPersistence } from './hooks/useLayoutPersistence';
import { useRowInspector } from './hooks/useRowInspector';
import { KPIStrip } from './components/KPIStrip';
import { DataGrid } from './components/DataGrid';
import { CategoryFilters } from './components/CategoryFilters';
import { FuzzySearch } from './components/FuzzySearch';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { RowInspector } from './components/RowInspector';
import { AnalyticsOverlay } from './components/AnalyticsOverlay';

function Dashboard({ onGoHome }: { onGoHome: () => void }) {
  const { kpi, isPaused, bufferedCount, togglePause, filterOptions, getPoolSnapshot, viewVersion, snapshotRef, pauseTimestampRef } =
    useStreamEngine();
  const { sortConfigs, handleHeaderClick } = useSortEngine();
  const { filters, setFilter } = useFilterEngine();
  const { searchQuery, handleSearch } = useFuzzySearch();
  const { layout, togglePanel, resetLayout } = useLayoutPersistence();

  const [filteredCount, setFilteredCount] = useState(0);
  const { selectedRow, isInspectorOpen, openInspector, closeInspector } = useRowInspector(isPaused);

  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const handleOpenAnalytics = useCallback(() => {
    setIsAnalyticsOpen(true);
    if (isInspectorOpen) {
      closeInspector();
    }
  }, [isInspectorOpen, closeInspector]);

  const rows = useMemo(() => getPoolSnapshot(), [getPoolSnapshot, viewVersion]);

  const filterOpts = useMemo(
    () => ({ ...filterOptions.current }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterOptions, viewVersion]
  );

  const handleFilteredCount = useCallback((n: number) => {
    setFilteredCount(n);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar layout={layout} onToggle={togglePanel} onReset={resetLayout} onGoHome={onGoHome} />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f4f7f9] overflow-hidden">
        <Header
          kpi={kpi}
          isPaused={isPaused}
          bufferedCount={bufferedCount}
          onTogglePause={togglePause}
          onOpenAnalytics={handleOpenAnalytics}
        />

        <div className="flex-1 flex flex-col min-h-0 px-5 pt-5 pb-0 gap-4 overflow-hidden">
          {layout.showKpiStrip && <KPIStrip kpi={kpi} />}

          {(layout.showFiltersBar || layout.showSearchBar) && (
            <div className="flex items-center gap-3 shrink-0">
              {layout.showFiltersBar && (
                <div className="flex-1 min-w-0">
                  <CategoryFilters
                    filters={filters}
                    options={filterOpts}
                    onFilter={setFilter}
                  />
                </div>
              )}
              {layout.showSearchBar && (
                <div className="w-72 shrink-0">
                  <FuzzySearch onSearch={handleSearch} />
                </div>
              )}
            </div>
          )}

          {layout.showDataGrid && (
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              {isPaused && (
                <div className="w-full bg-[#FFFBEB] text-[#D97706] text-[12px] text-center py-1.5 font-medium">
                  ⏸ Stream paused — click any row to inspect
                </div>
              )}
              <DataGrid
                rows={rows}
                sortConfigs={sortConfigs}
                filters={filters}
                searchQuery={searchQuery}
                onHeaderClick={handleHeaderClick}
                onFilteredCount={handleFilteredCount}
                isPaused={isPaused}
                openInspector={openInspector}
                selectedRow={selectedRow}
                isInspectorOpen={isInspectorOpen}
              />
              {layout.showStatusBar && (
                <StatusBar
                  totalFiltered={filteredCount}
                  totalPool={rows.length}
                  isPaused={isPaused}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <RowInspector
        selectedRow={selectedRow}
        isInspectorOpen={isInspectorOpen}
        closeInspector={closeInspector}
      />
      {isAnalyticsOpen && (
        <AnalyticsOverlay
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          snapshot={snapshotRef.current}
          pauseTimestamp={pauseTimestampRef.current}
        />
      )}
    </div>
  );
}

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <LandingPage onEnter={() => setShowDashboard(true)} />;
  }

  return <Dashboard onGoHome={() => setShowDashboard(false)} />;
}
