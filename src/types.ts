export interface RpaRow {
  project_id: string;
  company_id: string;
  project_name: string;
  start_date: string;
  completion_date: string;
  project_status: string;
  automation_type: string;
  robots_deployed: number;
  budget_usd: number;
  annual_savings_usd: number;
  roi_percent: number;
  department: string;
  implementation_partner: string;
  country: string;
  industry: string;
  employee_hours_saved: number;
  ai_enabled: boolean;
  cloud_deployment: boolean;
  _alertKey?: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
  priority: number;
}

export interface KpiDisplay {
  totalRows: number;
  activeRobots: number;
  globalSavings: number;
  lastBatchRows: number;
  lastBatchRobots: number;
  lastBatchSavings: number;
  lastUpdate: Date;
}

export interface FilterState {
  automation_type: string[];
  department: string[];
  industry: string[];
  implementation_partner: string[];
  country: string[];
}

export interface LayoutState {
  showKpiStrip: boolean;
  showDataGrid: boolean;
  showFiltersBar: boolean;
  showSearchBar: boolean;
  showStatusBar: boolean;
}

export interface FilterOptions {
  automation_type: string[];
  department: string[];
  industry: string[];
  implementation_partner: string[];
  country: string[];
}

declare global {
  interface Window {
    initializeRpaStream: (
      callback: (batch: RpaRow[]) => void,
      csvUrl: string
    ) => void;
    stopRpaStream: () => void;
  }
}
