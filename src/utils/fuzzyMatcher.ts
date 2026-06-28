import type { RpaRow } from '../types';

export function fuzzyMatch(row: RpaRow, query: string): boolean {
  if (!query.trim()) return true;
  const combined = [
    row.project_name,
    row.company_id,
    row.implementation_partner,
    row.country,
    row.project_status,
    row.department,
    row.industry,
  ]
    .join(' ')
    .toLowerCase();

  const tokens = query.toLowerCase().trim().split(/\s+/);
  return tokens.every((token) => combined.includes(token));
}
