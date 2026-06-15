import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinks } from "../hooks/useLinks";
import { ChevronLeft } from "lucide-react";
import CreateLinkForm from "../components/CreateLinkForm";
import SuccessCard from "../components/SuccessCard";

export default function CreateLinkPage() {
  const navigate = useNavigate();
  const { create, creating, createError } = useLinks();
  const [successData, setSuccessData] = useState<{
    shortUrl: string;
    shortCode: string;
    originalUrl: string;
  } | null>(null);

  const handleSubmit = async (payload: {
    originalUrl: string;
    customAlias?: string;
    expiresAt?: string;
  }) => {
    const response = await create(payload);
    if (response) {
      setSuccessData({
        shortUrl: response.shortUrl,
        shortCode: response.shortCode,
        originalUrl: payload.originalUrl,
      });
    }
  };

  const handleReset = () => setSuccessData(null);

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
          <SuccessCard
            shortUrl={successData.shortUrl}
            shortCode={successData.shortCode}
            originalUrl={successData.originalUrl}
            onReset={handleReset}
          />
        ) : (
          <CreateLinkForm
            creating={creating}
            createError={createError}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
