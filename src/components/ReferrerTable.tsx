

interface ReferrerItem {
  referrer: string;
  count: number;
}

interface ReferrerTableProps {
  referrers: ReferrerItem[];
  totalClicks: number;
}

export default function ReferrerTable({ referrers, totalClicks }: ReferrerTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold tracking-tight">Referrer Sources</h2>
      </div>
      
      {referrers.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No referrer sources available yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider select-none">
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3 text-right">Clicks</th>
                <th className="px-6 py-3 text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {[...referrers]
                .sort((a, b) => b.count - a.count)
                .map((ref, idx) => {
                  const pct = Math.round((ref.count / (totalClicks || 1)) * 100);
                  return (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-foreground">
                        {ref.referrer || "Direct / Unknown"}
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-foreground tabular-nums">
                        {ref.count.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right text-muted-foreground font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <span className="w-8 text-right">{pct}%</span>
                          <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden border border-border/50 hidden sm:block">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
