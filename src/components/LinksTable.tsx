import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import type { Link } from "../feature/links/types/link.types";
import { formatDate, copyToClipboard } from "../lib/utils";

interface LinksTableProps {
  links: Link[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onRetry: () => void;
}

export default function LinksTable({ links, loading, error, searchQuery, onRetry }: LinksTableProps) {
  const navigate = useNavigate();
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (e: React.MouseEvent, shortUrl: string, code: string) => {
    e.stopPropagation();
    try {
      await copyToClipboard(shortUrl);
      setCopyStates((prev) => ({ ...prev, [code]: true }));
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [code]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">{error}</p>
        <button
          onClick={onRetry}
          className="px-3 py-1.5 border border-border bg-background text-xs font-semibold rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="py-16 px-4 text-center max-w-sm mx-auto space-y-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto border border-border">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-medium">No links found</h4>
          <p className="text-xs text-muted-foreground">
            {searchQuery
              ? "No matches found for your search query."
              : "Create your first shortened link to see it here."}
          </p>
        </div>
        {!searchQuery && (
          <button
            onClick={() => navigate("/create")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Shorten a Link
          </button>
        )}
      </div>
    );
  }

  return (
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
          {links.map((link) => {
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
                        isCopied
                          ? "text-success bg-success/5 border-success/20 opacity-100"
                          : "text-muted-foreground hover:text-foreground"
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
                  {formatDate(link.createdAt)}
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
  );
}
