import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight
} from "lucide-react";

interface SuccessCardProps {
  shortUrl: string;
  shortCode: string;
  originalUrl: string;
  onReset: () => void;
}

export default function SuccessCard({ shortUrl, shortCode, originalUrl, onReset }: SuccessCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="space-y-6">
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
            {shortUrl}
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

        {/* Destination URL */}
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
          onClick={() => navigate(`/analytics/${shortCode}`)}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-medium rounded-lg transition-colors flex-1"
        >
          View Analytics
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-medium rounded-lg transition-colors flex-1"
        >
          Create Another
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
