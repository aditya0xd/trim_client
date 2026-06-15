import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinks } from "../feature/links/hooks/uselinks";
import { 
  Plus, 
  Search, 
  BarChart3, 
  Copy, 
  Check, 
  ExternalLink,
  Link2,
  MousePointerClick,
  TrendingUp,
  ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { links, loading, error, refresh } = useLinks();
  const [searchQuery, setSearchQuery] = useState("");
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (e: React.MouseEvent, shortUrl: string, code: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyStates((prev) => ({ ...prev, [code]: true }));
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [code]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  // Metrics calculations
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
  const mostActiveLink = links.length > 0 
    ? [...links].sort((a, b) => b.clickCount - a.clickCount)[0] 
    : null;

  // Filter links
  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.originalUrl.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query)
    );
  });

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
        {/* Total Links Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Total Links</span>
            {loading ? (
              <div className="h-7 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-semibold tracking-tight">{totalLinks}</h3>
            )}
          </div>
          <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground border border-border shadow-xs">
            <Link2 size={18} />
          </div>
        </div>

        {/* Total Clicks Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Total Clicks</span>
            {loading ? (
              <div className="h-7 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <h3 className="text-2xl font-semibold tracking-tight">{totalClicks}</h3>
            )}
          </div>
          <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground border border-border shadow-xs">
            <MousePointerClick size={18} />
          </div>
        </div>

        {/* Most Active Link Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div className="space-y-1 min-w-0 flex-1 pr-4">
            <span className="text-xs font-medium text-muted-foreground">Top Performing</span>
            {loading ? (
              <div className="h-7 w-28 bg-muted animate-pulse rounded" />
            ) : mostActiveLink ? (
              <div className="space-y-0.5 min-w-0">
                <h3 className="text-2xl font-semibold tracking-tight truncate">
                  /{mostActiveLink.shortCode}
                </h3>
                <p className="text-[10px] text-muted-foreground truncate font-medium">
                  {mostActiveLink.clickCount} clicks
                </p>
              </div>
            ) : (
              <h3 className="text-2xl font-semibold tracking-tight text-muted-foreground">—</h3>
            )}
          </div>
          <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground border border-border shadow-xs shrink-0">
            <TrendingUp size={18} />
          </div>
        </div>
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

        {/* Table Content */}
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button 
              onClick={refresh}
              className="px-3 py-1.5 border border-border bg-background text-xs font-semibold rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredLinks.length === 0 ? (
          /* Empty state */
          <div className="py-16 px-4 text-center max-w-sm mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto border border-border">
              <Link2 size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">No links found</h4>
              <p className="text-xs text-muted-foreground">
                {searchQuery ? "No matches found for your search query." : "Create your first shortened link to see it here."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => navigate("/create")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none"
              >
                <Plus size={14} />
                Shorten a Link
              </button>
            )}
          </div>
        ) : (
          /* Responsive Table List */
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider select-none">
                  <th className="px-6 py-3">Short Link</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3 text-right">Clicks</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredLinks.map((link) => {
                  const isCopied = !!copyStates[link.shortCode];
                  return (
                    <tr 
                      key={link.shortCode}
                      onClick={() => navigate(`/analytics/${link.shortCode}`)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      {/* Short URL / Code */}
                      <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">/{link.shortCode}</span>
                          <button
                            onClick={(e) => handleCopy(e, link.shortUrl, link.shortCode)}
                            className={`p-1 rounded hover:bg-secondary border border-transparent hover:border-border transition-all opacity-0 group-hover:opacity-100 shrink-0 ${
                              isCopied ? "text-success bg-success/5 border-success/20 opacity-100" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      {/* Original URL */}
                      <td className="px-6 py-4 max-w-xs md:max-w-md lg:max-w-lg truncate text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{link.originalUrl}</span>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-0.5 rounded text-muted-foreground/60 hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 shrink-0 transition-all"
                          >
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </td>

                      {/* Clicks */}
                      <td className="px-6 py-4 text-right font-semibold text-foreground tabular-nums">
                        {link.clickCount.toLocaleString()}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(link.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/analytics/${link.shortCode}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <BarChart3 size={11} />
                          Analytics
                          <ChevronRight size={10} className="text-muted-foreground/40" />
                        </button>
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
