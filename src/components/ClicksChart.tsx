import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ClickDataItem {
  date: string;
  clicks: number;
}

interface ClicksChartProps {
  data: ClickDataItem[];
  totalClicks: number;
}

export default function ClicksChart({ data, totalClicks }: ClicksChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
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
  );
}
