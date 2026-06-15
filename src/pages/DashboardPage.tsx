import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinks } from "../feature/links/hooks/uselinks";
import { Plus, Search, Link2, MousePointerClick, TrendingUp } from "lucide-react";
import MetricCard from "../components/MetricCard";
import LinksTable from "../components/LinksTable";

import { 
  calculateTotalLinks, 
  calculateTotalClicks, 
  getMostActiveLink, 
  filterLinks 
} from "../lib/links";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { links, loading, error, refresh } = useLinks();
  const [searchQuery, setSearchQuery] = useState("");

  const totalLinks = calculateTotalLinks(links);
  const totalClicks = calculateTotalClicks(links);
  const mostActiveLink = getMostActiveLink(links);
  const filteredLinks = filterLinks(links, searchQuery);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your shortened URLs and track their performance.
          </p>
        </div>
        <button
          onClick={() => navigate("/create")}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer select-none self-start sm:self-auto"
        >
          <Plus size={15} />
          Create Link
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Total Links"
          value={totalLinks}
          loading={loading}
          icon={<Link2 size={18} />}
        />
        <MetricCard
          title="Total Clicks"
          value={totalClicks}
          loading={loading}
          icon={<MousePointerClick size={18} />}
        />
        <MetricCard
          title="Top Performing"
          value={mostActiveLink ? `/${mostActiveLink.shortCode}` : null}
          loading={loading}
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* Main Link Registry */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 text-muted-foreground top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-input rounded-lg text-xs transition-all focus:outline-hidden focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        <LinksTable
          links={filteredLinks}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          onRetry={refresh}
        />
      </div>
    </div>
  );
}
