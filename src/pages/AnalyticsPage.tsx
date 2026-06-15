import { useParams, useNavigate } from "react-router-dom";
import { useAnalytics } from "../feature/analytics/hooks/useAnalytics";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  ArrowLeft, 
  MousePointerClick, 
  Calendar, 
  Share2, 
  ExternalLink,
  TrendingUp,
  Globe
} from "lucide-react";

export default function AnalyticsPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { analytics, loading, error } = useAnalytics(shortCode);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-10 w-64 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-28 bg-muted rounded-xl" />
          <div className="h-28 bg-muted rounded-xl" />
        </div>
        <div className="h-80 bg-muted rounded-xl" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="py-16 text-center max-w-sm mx-auto space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto border border-destructive/20">
          <Share2 size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Failed to load analytics</h4>
          <p className="text-xs text-muted-foreground">
            {error || "Could not retrieve analytics details for this link."}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background text-xs font-semibold rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { totalClicks, clicksPerDay, topReferrers, link } = analytics;

  // Format date labels for chart
  const chartData = clicksPerDay.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  // Determine top referrer
  const primaryReferrer = topReferrers.length > 0
    ? [...topReferrers].sort((a, b) => b.count - a.count)[0]
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <span className="font-semibold text-foreground">/{link.shortCode}</span>
              <span>•</span>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground flex items-center gap-1 max-w-[200px] sm:max-w-xs md:max-w-md truncate transition-colors"
              >
                <span className="truncate">{link.originalUrl}</span>
                <ExternalLink size={12} className="shrink-0" />
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium bg-muted border border-border px-2.5 py-1 rounded-lg self-start md:self-auto">
            <Calendar size={12} />
            <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Clicks KPI */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Total Clicks</span>
            <h3 className="text-3xl font-semibold tracking-tight">{totalClicks.toLocaleString()}</h3>
          </div>
          <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground border border-border shadow-xs">
            <MousePointerClick size={22} />
          </div>
        </div>

        {/* Top Referrer KPI */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-medium text-muted-foreground">Top Referrer</span>
            <h3 className="text-3xl font-semibold tracking-tight truncate">
              {primaryReferrer ? primaryReferrer.referrer : "None"}
            </h3>
            {primaryReferrer && (
              <p className="text-[10px] text-muted-foreground font-medium">
                {primaryReferrer.count.toLocaleString()} clicks ({Math.round((primaryReferrer.count / (totalClicks || 1)) * 100)}%)
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground border border-border shadow-xs shrink-0">
            <Globe size={22} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Clicks Over Time</h2>
          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
            <TrendingUp size={12} />
            Past 7 days
          </span>
        </div>
        
        {chartData.length === 0 || totalClicks === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
            No clicks recorded yet.
          </div>
        ) : (
          <div className="h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={false} 
                  tickLine={false} 
                  stroke="hsl(var(--muted-foreground))" 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  stroke="hsl(var(--muted-foreground))"
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--foreground))",
                    fontFamily: "Inter, sans-serif"
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorClicks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Referrers Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold tracking-tight">Referrer Sources</h2>
        </div>
        
        {topReferrers.length === 0 ? (
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
                {[...topReferrers]
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
    </div>
  );
}
