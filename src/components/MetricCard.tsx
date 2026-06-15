import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number | null;
  loading?: boolean;
  icon: React.ReactNode;
}

export default function MetricCard({ title, value, loading, icon }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex items-center justify-between">
      <div className="space-y-1 min-w-0 flex-1 pr-4">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {loading ? (
          <div className="h-7 w-16 bg-muted animate-pulse rounded" />
        ) : value !== null && value !== undefined ? (
          <h3 className="text-2xl font-semibold tracking-tight truncate">{value}</h3>
        ) : (
          <h3 className="text-2xl font-semibold tracking-tight text-muted-foreground">—</h3>
        )}
      </div>
      <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground border border-border shadow-xs shrink-0">
        {icon}
      </div>
    </div>
  );
}
