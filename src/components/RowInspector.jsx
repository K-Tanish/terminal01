import React from 'react';
import { ArrowRight, DollarSign, TrendingUp, Percent, Clock, Cloud, Cpu } from 'lucide-react';

const statusStyles = {
  Active: { bg: '#E8F8F0', color: '#1A9E5C' },
  Completed: { bg: '#EEF2FF', color: '#5B6BF8' },
  Planned: { bg: '#FFFBEB', color: '#D97706' },
  Failed: { bg: '#FFF0EE', color: '#E53935' },
};

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function getCountryFlag(country) {
  if (!country) return '🌐';
  const map = {
    'United States': '🇺🇸',
    Canada: '🇨🇦',
    Mexico: '🇲🇽',
    Germany: '🇩🇪',
    France: '🇫🇷',
    India: '🇮🇳',
    Japan: '🇯🇵',
    China: '🇨🇳',
    Brazil: '🇧🇷',
    Australia: '🇦🇺',
  };
  return map[country] || '🌍';
}

function getRoiColor(roi) {
  if (roi > 100) return '#047857';
  if (roi >= 50) return '#D97706';
  return '#B91C1C';
}

export function RowInspector({ selectedRow, isInspectorOpen, closeInspector }) {
  if (!isInspectorOpen || !selectedRow) return null;

  const startDate = formatDate(selectedRow.start_date);
  const completionDate = selectedRow.completion_date ? formatDate(selectedRow.completion_date) : 'Ongoing';
  const now = new Date();
  const start = new Date(selectedRow.start_date);
  const end = selectedRow.completion_date ? new Date(selectedRow.completion_date) : now;
  const totalDurationMs = Math.max(end.getTime() - start.getTime(), 0);
  const elapsedMs = Math.min(now.getTime() - start.getTime(), totalDurationMs);
  const elapsedPercent = totalDurationMs > 0 ? Math.round((elapsedMs / totalDurationMs) * 100) : 0;
  const roiPercent = selectedRow.roi_percent || 0;
  const returnMultiplier = selectedRow.budget_usd > 0 ? (selectedRow.annual_savings_usd / selectedRow.budget_usd).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end" style={{ pointerEvents: 'auto' }}>
      <div
        className="absolute inset-0 bg-black/25"
        onClick={closeInspector}
        style={{ backdropFilter: 'blur(2px)' }}
      />
      <div
        className="relative h-full bg-white border-l border-[#E4E8F0] shadow-2xl overflow-hidden"
        style={{ width: 420, animation: 'slideIn 250ms ease-out forwards' }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F0F2F7]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#8A93A6] font-semibold">INSPECTOR</div>
            <div className="mt-3 text-[18px] font-bold text-[#1A1D23]">{selectedRow.project_name}</div>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-900"
            onClick={closeInspector}
            aria-label="Close inspector"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="h-full overflow-y-auto pr-2" style={{ paddingRight: 12 }}>
          <div className="px-6 pt-5 pb-6">
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full bg-[#F0F2F7] px-3 py-1 text-[12px] font-mono text-[#2b2f37]">
                {selectedRow.project_id}
              </div>
              <div className="rounded-full bg-[#F0F2F7] px-3 py-1 text-[12px] font-mono text-[#2b2f37]">
                {selectedRow.company_id}
              </div>
              <div
                className="rounded-full px-3 py-1 text-[12px] font-semibold"
                style={statusStyles[selectedRow.project_status] || { background: '#F0F2F7', color: '#1A1D23' }}
              >
                {selectedRow.project_status}
              </div>
            </div>
          </div>

          <section className="px-6 pb-6">
            <div className="mb-4 border-b border-[#F0F2F7] pb-3">
              <div className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#8A93A6]">
                Project Timeline
              </div>
            </div>
            <div className="space-y-3 text-sm text-[#1A1D23]">
              <div className="flex items-center justify-between text-[13px] text-[#475569]">
                <span>Start date</span>
                <span>{startDate || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-[#475569]">
                <span>Completion date</span>
                <span className="flex items-center gap-2">
                  {completionDate}
                  {!selectedRow.completion_date && (
                    <span className="inline-flex items-center gap-2 text-[#16a34a] font-semibold text-[12px]">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                      Ongoing
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-end justify-between mb-2 text-[12px] text-[#475569]">
                <span>Timeline progress</span>
                <span>{elapsedPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EEF0F6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5B6BF8]"
                  style={{ width: `${elapsedPercent}%` }}
                />
              </div>
            </div>
          </section>

          <section className="px-6 pb-6">
            <div className="mb-4 border-b border-[#F0F2F7] pb-3">
              <div className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#8A93A6]">
                Financial Metrics
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#8A93A6] text-[12px] uppercase tracking-[0.08em]">
                  <DollarSign className="w-3 h-3" /> Budget
                </div>
                <div className="text-[15px] font-semibold text-[#1A1D23]">{formatCurrency(selectedRow.budget_usd)}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#8A93A6] text-[12px] uppercase tracking-[0.08em]">
                  <TrendingUp className="w-3 h-3" /> Annual Savings
                </div>
                <div className="text-[15px] font-semibold text-[#1A1D23]">{formatCurrency(selectedRow.annual_savings_usd)}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#8A93A6] text-[12px] uppercase tracking-[0.08em]">
                  <Percent className="w-3 h-3" /> ROI
                </div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold"
                  style={{ background: getRoiColor(roiPercent) === '#047857' ? '#ECFDF5' : getRoiColor(roiPercent) === '#D97706' ? '#FFFBEB' : '#FFF1F2', color: getRoiColor(roiPercent) }}
                >
                  {formatPercent(roiPercent)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#8A93A6] text-[12px] uppercase tracking-[0.08em]">
                  <Clock className="w-3 h-3" /> Employee Hours Saved
                </div>
                <div className="text-[15px] font-semibold text-[#1A1D23]">{formatNumber(selectedRow.employee_hours_saved)} hrs</div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-6">
            <div className="mb-4 border-b border-[#F0F2F7] pb-3">
              <div className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#8A93A6]">
                Operational Attributes
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-[#1A1D23]">
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Automation Type</div>
                <div>{selectedRow.automation_type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Department</div>
                <div>{selectedRow.department}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Industry</div>
                <div>{selectedRow.industry}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Implementation Partner</div>
                <div>{selectedRow.implementation_partner}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Country</div>
                <div className="flex items-center gap-2">{getCountryFlag(selectedRow.country)} {selectedRow.country}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Robots Deployed</div>
                <div className="inline-flex items-center gap-2 text-[#1A1D23]">
                  <Cpu className="w-4 h-4" /> {selectedRow.robots_deployed}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">AI Enabled</div>
                <div className="inline-flex items-center gap-2 text-[#1A1D23]">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${selectedRow.ai_enabled ? 'bg-[#5B6BF8] shadow-[0_0_0_4px_rgba(91,107,248,0.12)]' : 'bg-[#94a3b8]'}`}
                  />
                  {selectedRow.ai_enabled ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[12px] text-[#8A93A6]">Cloud Deployment</div>
                <div className="inline-flex items-center gap-2 text-[#1A1D23]">
                  <span className={selectedRow.cloud_deployment ? 'text-[#2563EB]' : 'text-[#94a3b8]'}>
                    {selectedRow.cloud_deployment ? <Cloud className="w-4 h-4" /> : <Cloud className="w-4 h-4 line-through" />}
                  </span>
                  {selectedRow.cloud_deployment ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-6">
            <div className="mb-4 border-b border-[#F0F2F7] pb-3">
              <div className="text-[11px] uppercase font-semibold tracking-[0.08em] text-[#8A93A6]">
                Performance Snapshot
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[12px] text-[#8A93A6] uppercase tracking-[0.08em]">
                  <span>ROI progress</span>
                  <span>{formatPercent(roiPercent)}</span>
                </div>
                <div className="h-3 rounded-full bg-[#EEF0F6] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(Math.max(roiPercent, 0), 100)}%`, background: getRoiColor(roiPercent) }}
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="text-[12px] text-[#8A93A6] uppercase tracking-[0.08em]">Return Multiplier</div>
                <div className="mt-2 text-[17px] font-semibold text-[#1A1D23]">{returnMultiplier}x</div>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] text-[#8A93A6] uppercase tracking-[0.08em]">Employee Hours Saved</div>
                  <div className="mt-2 text-[15px] font-semibold text-[#1A1D23] flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {formatNumber(selectedRow.employee_hours_saved)} hrs
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#5B6BF8]" />
              </div>
            </div>
          </section>
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}
