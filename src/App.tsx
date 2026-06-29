import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { HelpModal } from './components/HelpModal';
import { useDataProcessor } from './hooks/useDataProcessor';
import { exportToCsv } from './utils/csvExport';
import { ExportToast, ToastConfig } from './components/ExportToast';

function Dashboard({ onGoHome }: { onGoHome: () => void }) {
  const { kpi, isPaused, bufferedCount, togglePause, filterOptions, getPoolSnapshot, viewVersion, snapshotRef, pauseTimestampRef } =
    useStreamEngine();
  const { sortConfigs, handleHeaderClick } = useSortEngine();
  const { filters, setFilter, resetFilters } = useFilterEngine();
  const { searchQuery, handleSearch } = useFuzzySearch();
  const { layout, togglePanel, resetLayout } = useLayoutPersistence();

  const [filteredCount, setFilteredCount] = useState(0);
  const { selectedRow, isInspectorOpen, openInspector, closeInspector } = useRowInspector(isPaused);

  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleOpenAnalytics = useCallback(() => {
    setIsAnalyticsOpen(true);
    if (isInspectorOpen) {
      closeInspector();
    }
  }, [isInspectorOpen, closeInspector]);

  const rows = useMemo(() => getPoolSnapshot(), [getPoolSnapshot, viewVersion]);
  const { sortedRows } = useDataProcessor(rows, filters, searchQuery, sortConfigs);

  const [toast, setToast] = useState<ToastConfig | null>(null);

  const filterOpts = useMemo(
    () => ({ ...filterOptions.current }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterOptions, viewVersion]
  );

  const handleFilteredCount = useCallback((n: number) => {
    setFilteredCount(n);
  }, []);

  const handleExport = useCallback(() => {
    const filename = 'export.csv';
    exportToCsv(sortedRows, filename);
    
    // Sort summary
    let sortSummary = 'No sort applied';
    if (sortConfigs.length > 0) {
      sortSummary = 'Sorted by ' + sortConfigs.map(c => `${c.key} ${c.direction === 'desc' ? '↓' : '↑'}`).join(', ');
    }

    // Filter summary
    const activeFilters = [];
    if (filters.automation_type.length > 0) activeFilters.push(`automation_type (${filters.automation_type.length})`);
    if (filters.department.length > 0) activeFilters.push(`department (${filters.department.length})`);
    if (filters.industry.length > 0) activeFilters.push(`industry (${filters.industry.length})`);
    if (filters.implementation_partner.length > 0) activeFilters.push(`implementation_partner (${filters.implementation_partner.length})`);
    if (filters.country.length > 0) activeFilters.push(`country (${filters.country.length})`);
    
    let filterSummary = 'No filters active';
    if (activeFilters.length > 0) {
      filterSummary = 'Filters: ' + activeFilters.join(', ');
    }

    // Assign a new ID to force re-render if clicked multiple times
    setToast({
      id: Date.now(),
      rowCount: sortedRows.length,
      sortSummary,
      filterSummary,
      searchQuery,
      filename
    });
  }, [sortedRows, sortConfigs, filters, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExport]);

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {isSidebarOpen && (
        <div className="relative h-full flex shrink-0 z-50">
          <Sidebar layout={layout} onToggle={togglePanel} onReset={resetLayout} onGoHome={onGoHome} />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute -right-8 top-1/2 -translate-y-1/2 bg-[#0b0b0b] text-[#e3ff73] w-8 h-16 flex items-center justify-center rounded-r-xl shadow-[2px_0_8px_rgba(0,0,0,0.15)] border border-gray-800 border-l-0 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            title="Close Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      <main className="relative flex-1 flex flex-col min-w-0 bg-[#f4f7f9] overflow-hidden">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-[#0b0b0b] text-[#e3ff73] w-8 h-16 flex items-center justify-center rounded-r-xl shadow-[2px_0_8px_rgba(0,0,0,0.15)] border border-gray-800 border-l-0 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            title="Open Settings"
          >
            <svg className="w-5 h-5 animate-breathe-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <Header
          kpi={kpi}
          isPaused={isPaused}
          bufferedCount={bufferedCount}
          onTogglePause={togglePause}
          onOpenAnalytics={handleOpenAnalytics}
          onExport={handleExport}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onToggleHelp={() => setIsHelpOpen(!isHelpOpen)}
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
                    onClearAll={resetFilters}
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
                rows={sortedRows}
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
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      {isAnalyticsOpen && (
        <AnalyticsOverlay
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          snapshot={snapshotRef.current}
          pauseTimestamp={pauseTimestampRef.current}
        />
      )}
      <ExportToast toast={toast} onClose={() => setToast(null)} />
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
