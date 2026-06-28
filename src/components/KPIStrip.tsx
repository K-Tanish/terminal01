import React from 'react';
import type { KpiDisplay } from '../types';
import { formatNumber, formatLargeNumber } from '../utils/formatters';

interface Props {
  kpi: KpiDisplay;
}

function KPICard({
  icon,
  label,
  value,
  delta,
  deltaLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className="w-16 h-16 bg-[#f7fdf0] rounded-full flex items-center justify-center shrink-0">
        <div className="w-10 h-10 bg-[#e3ff73] rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
          {label}
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <div className="text-2xl font-bold text-gray-900 truncate">{value}</div>
        <div className="flex items-center gap-1 text-xs mt-1">
          <svg className="w-3 h-3 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
              fillRule="evenodd"
            />
          </svg>
          <span className="text-green-600 font-bold">{delta}</span>
          <span className="text-gray-400 font-medium">{deltaLabel}</span>
        </div>
      </div>
    </div>
  );
}

export const KPIStrip = React.memo(function KPIStrip({ kpi }: Props) {
  return (
    <div className="grid grid-cols-3 gap-5 mb-5">
      <KPICard
        icon={
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 4.02 2 6.5s4.48 4.5 10 4.5 10-2.02 10-4.5S17.52 2 12 2zm0 13c-4.47 0-8.14-1.16-9.48-2.77C2.18 12.65 2 13.06 2 13.5c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5c0-.44-.18-.85-.52-1.27C20.14 13.84 16.47 15 12 15zm0 5c-4.47 0-8.14-1.16-9.48-2.77-.34.42-.52.83-.52 1.27 0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5c0-.44-.18-.85-.52-1.27C20.14 18.84 16.47 20 12 20z" />
          </svg>
        }
        label="Total Rows Processed"
        value={formatNumber(kpi.totalRows)}
        delta={formatNumber(kpi.lastBatchRows)}
        deltaLabel="(last 200ms)"
      />
      <KPICard
        icon={
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a2 2 0 0 1 2 2c0 .73-.4 1.35-1 1.7V7h2a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1V9a2 2 0 0 1 2-2h2V5.7c-.6-.35-1-.97-1-1.7a2 2 0 0 1 2-2M9 11a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9m5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1z" />
          </svg>
        }
        label="Active Robots Deployed"
        value={formatNumber(kpi.activeRobots)}
        delta={formatNumber(kpi.lastBatchRobots)}
        deltaLabel="(last 200ms)"
      />
      <KPICard
        icon={
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
          </svg>
        }
        label="Global Cumulative Savings (USD)"
        value={formatLargeNumber(kpi.globalSavings)}
        delta={formatLargeNumber(kpi.lastBatchSavings)}
        deltaLabel="(last 200ms)"
      />
    </div>
  );
});
