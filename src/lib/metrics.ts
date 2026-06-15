interface ReferrerItem {
  referrer: string;
  count: number;
}

export function calculatePercentage(value: number, total: number): number {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function sortReferrersByCount(referrers: ReferrerItem[]): ReferrerItem[] {
  return [...referrers].sort((a, b) => b.count - a.count);
}
