import { useState, useEffect, useCallback } from "react";
import { getLinkAnalytics } from "../feature/analytics/services/analytics.api";
import type { Analytics } from "../feature/analytics/types/analytics.types";

interface UseAnalyticsReturn {
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAnalytics(shortCode: string | undefined): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!shortCode) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getLinkAnalytics(shortCode);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics,
  };
}
