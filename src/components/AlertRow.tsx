import React, { useRef, useEffect } from 'react';
import type { RpaRow } from '../types';
import { formatCurrency, formatROI, formatNumber } from '../utils/formatters';

interface Props {
  row: RpaRow;
  style?: React.CSSProperties;
  isPaused?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Completed') {
    return (
      <span className="bg-[#f0ffc2] text-[#557e00] px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
        Completed
      </span>
    );
  }
  if (status === 'Failed') {
    return (
      <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
        Failed
      </span>
    );
  }
  if (status === 'In Progress') {
    return (
      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
        In Progress
      </span>
    );
  }
  if (status === 'On Hold') {
    return (
      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
        On Hold
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
      {status}
    </span>
  );
}

export const AlertRow = React.memo(function AlertRow({ row, style, isPaused, selected, onClick }: Props) {
  const trRef = useRef<HTMLTableRowElement>(null);
  const prevAlertKeyRef = useRef<number | undefined>(undefined);

  const isAlert = row.project_status === 'Failed' || row.roi_percent < 0;

  useEffect(() => {
    const el = trRef.current;
    if (!el || !isAlert) return;
    if (row._alertKey !== undefined && row._alertKey !== prevAlertKeyRef.current) {
      prevAlertKeyRef.current = row._alertKey;
      el.classList.remove('row-flash');
      void el.offsetWidth; // reflow
      el.classList.add('row-flash');
      const handler = () => el.classList.remove('row-flash');
      el.addEventListener('animationend', handler, { once: true });
    }
  }, [row._alertKey, isAlert]);

  const roiNeg = row.roi_percent < 0;

  return (
    <tr
      ref={trRef}
      style={style}
      onClick={onClick}
      className={`border-b border-gray-50 text-xs font-medium ${
        isAlert ? 'bg-[#fff1f2]' : 'hover:bg-gray-50'
      } transition-colors ${isPaused ? 'cursor-pointer' : 'cursor-default'} ${selected ? 'border-l-4 border-[#5B6BF8]' : ''}`}
    >
      <td className="px-4 text-gray-400 whitespace-nowrap" style={{ height: 48 }}>
        {row.project_id}
      </td>
      <td className="px-4 whitespace-nowrap max-w-[180px] truncate">
        <span title={row.project_name}>{row.project_name}</span>
      </td>
      <td className="px-4 text-center whitespace-nowrap">
        <StatusBadge status={row.project_status} />
      </td>
      <td className="px-4 whitespace-nowrap max-w-[160px] truncate">
        <span title={row.automation_type}>{row.automation_type}</span>
      </td>
      <td className="px-4 text-center whitespace-nowrap">{row.robots_deployed}</td>
      <td className={`px-4 whitespace-nowrap ${isAlert ? 'text-red-500' : ''}`}>
        {formatCurrency(row.budget_usd)}
      </td>
      <td className={`px-4 whitespace-nowrap ${isAlert ? 'text-red-500' : ''}`}>
        {formatCurrency(row.annual_savings_usd)}
      </td>
      <td className={`px-4 whitespace-nowrap ${roiNeg ? 'text-red-500 font-bold' : ''}`}>
        {formatROI(row.roi_percent)}
      </td>
      <td className="px-4 whitespace-nowrap">{formatNumber(row.employee_hours_saved)}</td>
      <td className="px-4 text-gray-500 whitespace-nowrap">{row.department}</td>
      <td className="px-4 text-gray-500 whitespace-nowrap max-w-[120px] truncate">
        <span title={row.industry}>{row.industry}</span>
      </td>
      <td className="px-4 text-gray-500 whitespace-nowrap max-w-[140px] truncate hidden xl:table-cell">
        <span title={row.implementation_partner}>{row.implementation_partner}</span>
      </td>
      <td className="px-4 text-gray-500 whitespace-nowrap hidden 2xl:table-cell">{row.country}</td>
    </tr>
  );
});
