import React, { useState, useEffect } from 'react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { formatTime } from '../utils/formatters';
import { StatusDonutChart } from './charts/StatusDonutChart';
import { IndustryBarChart } from './charts/IndustryBarChart';
import { SavingsTrendLine } from './charts/SavingsTrendLine';
import { ROIScatterPlot } from './charts/ROIScatterPlot';
import { AutomationTypeRadar } from './charts/AutomationTypeRadar';

function formatSavings(num) {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export function AnalyticsOverlay({ isOpen, onClose, snapshot, pauseTimestamp }) {
  const [isClosing, setIsClosing] = useState(false);
  const data = useAnalyticsData(snapshot);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // 200ms exit animation
  };

  if (!isOpen && !isClosing) return null;

  const animationClass = isClosing 
    ? 'opacity-0 scale-95 transition-all duration-200 ease-in' 
    : 'animate-in fade-in zoom-in-95 duration-300 ease-out';

  const overlayBgClass = isClosing
    ? 'opacity-0 transition-opacity duration-200 ease-in'
    : 'animate-in fade-in duration-300 ease-out';

  const { summary } = data;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm ${overlayBgClass}`}>
      <div 
        className={`bg-[#f4f7f9] rounded-[20px] overflow-y-auto flex flex-col shadow-2xl ${animationClass}`}
        style={{ width: 'calc(100vw - 80px)', maxWidth: '1400px', height: 'calc(100vh - 80px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">Analytics View</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="text-[12px] text-gray-500 font-medium">Frozen snapshot — stream paused</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
              Snapshot taken at {formatTime(new Date(pauseTimestamp))}
            </span>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Summary Strip */}
          {summary && (
            <div className="flex items-center gap-3">
              <div className="bg-white shadow-sm text-gray-900 rounded-full px-4 py-2 text-[12px] font-bold border border-gray-200 flex items-center gap-2">
                <span className="text-gray-400 font-medium">Total Projects</span>
                {summary.totalProjects.toLocaleString()}
              </div>
              <div className="bg-white shadow-sm text-gray-900 rounded-full px-4 py-2 text-[12px] font-bold border border-gray-200 flex items-center gap-2">
                <span className="text-gray-400 font-medium">Avg ROI</span>
                {summary.avgRoi.toFixed(2)}%
              </div>
              <div className="bg-white shadow-sm text-gray-900 rounded-full px-4 py-2 text-[12px] font-bold border border-gray-200 flex items-center gap-2">
                <span className="text-gray-400 font-medium">Total Savings</span>
                {formatSavings(summary.totalSavings)}
              </div>
              {summary.mostCommonIndustry && (
                <div className="bg-white shadow-sm text-gray-900 rounded-full px-4 py-2 text-[12px] font-bold border border-gray-200 flex items-center gap-2">
                  <span className="text-gray-400 font-medium">Most Common Industry</span>
                  {summary.mostCommonIndustry}
                </div>
              )}
            </div>
          )}

          {/* Grid Layout */}
          {data.statusDistribution && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-[16px] p-5 md:p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                <h3 className="text-[14px] font-bold text-gray-900">Status Distribution</h3>
                <p className="text-[12px] font-medium text-gray-400 mb-4">By project lifecycle stage</p>
                <div className="relative flex-1 w-full min-h-[220px]">
                  <StatusDonutChart data={data.statusDistribution} total={summary?.totalProjects} />
                </div>
              </div>
              <div className="bg-white rounded-[16px] p-5 md:p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                <h3 className="text-[14px] font-bold text-gray-900">Top 10 Industries by ROI</h3>
                <p className="text-[12px] font-medium text-gray-400 mb-4">Average ROI % across all projects per industry</p>
                <div className="relative flex-1 w-full min-h-[220px]">
                  <IndustryBarChart data={data.industryROIMap} />
                </div>
              </div>
              <div className="bg-white rounded-[16px] p-5 md:p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                <h3 className="text-[14px] font-bold text-gray-900">Cumulative Savings Trend</h3>
                <p className="text-[12px] font-medium text-gray-400 mb-4">By automation project start year</p>
                <div className="relative flex-1 w-full min-h-[220px]">
                  <SavingsTrendLine data={data.savingsByMonth} />
                </div>
              </div>
            </div>
          )}

          {data.roiVsBudgetPoints && (
            <div className="grid grid-cols-1 lg:grid-cols-[55%_calc(45%-1.25rem)] gap-5">
              <div className="bg-white rounded-[16px] p-5 md:p-6 border border-gray-100 shadow-sm min-h-[340px] flex flex-col">
                <h3 className="text-[14px] font-bold text-gray-900">ROI vs Budget</h3>
                <p className="text-[12px] font-medium text-gray-400 mb-4">Each point represents one project</p>
                <div className="relative flex-1 w-full min-h-[260px]">
                  <ROIScatterPlot data={data.roiVsBudgetPoints} />
                </div>
              </div>
              <div className="bg-white rounded-[16px] p-5 md:p-6 border border-gray-100 shadow-sm min-h-[340px] flex flex-col">
                <h3 className="text-[14px] font-bold text-gray-900">Automation Type Performance</h3>
                <p className="text-[12px] font-medium text-gray-400 mb-4">Normalized across ROI, savings, and hours saved</p>
                <div className="relative flex-1 w-full min-h-[260px]">
                  <AutomationTypeRadar data={data.automationTypeScores} />
                </div>
              </div>
            </div>
          )}

          {/* Overall Summary */}
          {summary && (
            <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm mt-1">
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">Overall Summary</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Based on the frozen snapshot of <span className="font-bold text-gray-900">{summary.totalProjects.toLocaleString()}</span> automation projects, the overall average ROI stands at <span className="font-bold text-gray-900">{summary.avgRoi.toFixed(2)}%</span>. These initiatives have generated a combined total savings of <span className="font-bold text-gray-900">{formatSavings(summary.totalSavings)}</span>. Currently, <span className="font-bold text-gray-900">{summary.mostCommonIndustry}</span> represents the most active industry in this dataset.
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
