import type { RpaRow } from '../types';

export function fuzzyMatch(row: RpaRow, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  
  const combined = (
    row.project_id + ' ' +
    row.project_name + ' ' +
    row.company_id + ' ' +
    row.implementation_partner + ' ' +
    row.country + ' ' +
    row.project_status + ' ' +
    row.department + ' ' +
    row.industry + ' ' +
    row.automation_type
  ).toLowerCase();

  for (let i = 0; i < tokens.length; i++) {
    if (!combined.includes(tokens[i])) return false;
  }
  return true;
}
