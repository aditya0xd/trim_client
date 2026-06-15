import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinks } from "../feature/links/hooks/uselinks";
import { 
  Link2, 
  Sparkles, 
  Calendar, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink,
  ChevronLeft,
  Info
} from "lucide-react";

export default function CreateLinkPage() {
  const navigate = useNavigate();
  const { create, creating, createError } = useLinks();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!successData) return;
    try {
      await navigator.clipboard.writeText(successData.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Simple validation
    if (!originalUrl) {
      setValidationError("Please enter a URL to shorten");
      return;
    }

    if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
      setValidationError("URL must start with http:// or https://");
      return;
    }

    const payload = {
      originalUrl,
      customAlias: customAlias.trim() || undefined,
      expiresAt: expiresAt || undefined,
    };

    const response = await create(payload);
    if (response) {
      setSuccessData({
        shortUrl: response.shortUrl,
        shortCode: response.shortCode,
      });
    }
  };

  const resetForm = () => {
    setOriginalUrl("");
    setCustomAlias("");
    setExpiresAt("");
    setSuccessData(null);
    setValidationError(null);
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-semibold tracking-tight">Create a Link</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate a short, trackable link with optional custom alias.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-card border border-border rounded-xl shadow-xs p-6 md:p-8">
        {successData ? (
          /* Success State */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-success/10 text-success mx-auto">
              <Check size={24} />
            </div>
            
            <div className="text-center space-y-1">
              <h2 className="text-lg font-medium">Link Shortened Successfully!</h2>
              <p className="text-xs text-muted-foreground">Your link is ready to be shared</p>
            </div>

            <div className="space-y-4">
              {/* Short Link Output */}
              <div className="flex items-center justify-between gap-3 p-3 bg-muted border border-border rounded-lg">
                <span className="font-mono text-sm text-foreground select-all truncate">
                  {successData.shortUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    copied
                      ? "bg-success/10 border-success/20 text-success"
                      : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* original link overview */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Destination URL</p>
                <div className="flex items-center gap-1.5 text-xs font-medium truncate max-w-full text-foreground">
                  <span className="truncate">{originalUrl}</span>
                  <a
                    href={originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => navigate(`/analytics/${successData.shortCode}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors flex-1"
              >
                View Analytics
              </button>
              <button
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-medium rounded-lg transition-colors flex-1"
              >
                Create Another Link
              </button>
            </div>
          </div>
        ) : (
          /* Creation Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Destination URL */}
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Link2 size={15} className="text-muted-foreground" />
                Destination URL
              </label>
              <input
                id="url"
                type="text"
                placeholder="https://example.com/very-long-destination-url-here"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                disabled={creating}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/60 disabled:opacity-50"
              />
            </div>

            {/* Custom Alias */}
            <div className="space-y-2">
              <label htmlFor="alias" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Sparkles size={15} className="text-muted-foreground" />
                Custom Alias <span className="text-xs text-muted-foreground/60">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-muted-foreground select-none font-medium">
                  trim.so /
                </span>
                <input
                  id="alias"
                  type="text"
                  placeholder="my-link"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                  disabled={creating}
                  className="w-full pl-18 pr-3 py-2 bg-background border border-input rounded-lg text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/60 disabled:opacity-50"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Only letters, numbers, hyphens, and underscores are allowed.
              </p>
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <label htmlFor="expires" className="text-sm font-medium text-foreground flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-muted-foreground" />
                  Expiration Date <span className="text-xs text-muted-foreground/60">(Optional)</span>
                </span>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                  Beta
                </span>
              </label>
              <input
                id="expires"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                disabled={creating}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-ring focus:border-ring placeholder:text-muted-foreground/60 disabled:opacity-50"
              />
              {expiresAt && (
                <div className="flex items-center gap-1.5 p-2 bg-muted/50 border border-border/50 rounded-md text-[10px] text-muted-foreground mt-1">
                  <Info size={12} className="shrink-0" />
                  <span>Link expiration tracking is currently running in test mode.</span>
                </div>
              )}
            </div>

            {/* Validation / API Errors */}
            {(validationError || createError) && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg font-medium leading-relaxed">
                {validationError || createError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-xs rounded-lg transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Shortening Link...
                </>
              ) : (
                <>
                  Create Link
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
