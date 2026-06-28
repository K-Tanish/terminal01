export function formatCurrency(value: number): string {
  if (value < 0) {
    return '-$' + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrencyCompact(value: number): string {
  if (value < 0) {
    return '-$' + Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatROI(value: number): string {
  return value.toFixed(2) + '%';
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatLargeNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return '$' + (value / 1_000_000_000).toFixed(2) + 'B';
  }
  if (Math.abs(value) >= 1_000_000) {
    return '$' + (value / 1_000_000).toFixed(2) + 'M';
  }
  return formatCurrency(value);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
