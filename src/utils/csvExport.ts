import type { RpaRow } from '../types';

export function exportToCsv(rows: RpaRow[], filename: string = 'export.csv') {
  if (!rows || rows.length === 0) return;

  const headers = [
    'project_id',
    'project_name',
    'company_id',
    'project_status',
    'automation_type',
    'robots_deployed',
    'budget_usd',
    'annual_savings_usd',
    'roi_percent',
    'employee_hours_saved',
    'department',
    'industry',
    'implementation_partner',
    'country',
    'start_date',
    'completion_date',
    'ai_enabled',
    'cloud_deployment',
  ];

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [];
  csvRows.push(headers.map(escapeCsv).join(','));

  for (const row of rows) {
    const values = headers.map(header => escapeCsv(row[header as keyof RpaRow]));
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
