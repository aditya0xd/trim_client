import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnalytics } from "../feature/analytics/hooks/useAnalytics";
import { 
  ArrowLeft, 
  MousePointerClick, 
  Calendar, 
  Share2, 
  ExternalLink,
  Globe
} from "lucide-react";
import MetricCard from "../components/MetricCard";
import ClicksChart from "../components/ClicksChart";
import ReferrerTable from "../components/ReferrerTable";

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

  // Determine top referrer
  const primaryReferrer = topReferrers.length > 0
    ? [...topReferrers].sort((a, b) => b.count - a.count)[0]
    : null;

  const topReferrerDisplay = primaryReferrer
    ? `${primaryReferrer.referrer} (${Math.round((primaryReferrer.count / (totalClicks || 1)) * 100)}%)`
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
        <MetricCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon={<MousePointerClick size={20} />}
        />
        <MetricCard
          title="Top Referrer"
          value={topReferrerDisplay}
          icon={<Globe size={20} />}
        />
      </div>

      {/* Chart Section */}
      <ClicksChart data={clicksPerDay} totalClicks={totalClicks} />

      {/* Referrers Table */}
      <ReferrerTable referrers={topReferrers} totalClicks={totalClicks} />
    </div>
  );
}
