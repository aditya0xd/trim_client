import { useState, useEffect, useCallback } from "react";
import { getAllLinks, createLink } from "../feature/links/services/links.api";
import type { Link, CreateLinkPayload, CreateLinkResponse } from "../feature/links/types/link.types";

interface UseLinksReturn {
  links: Link[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  create: (payload: CreateLinkPayload) => Promise<CreateLinkResponse | null>;
  refresh: () => void;
}

export function useLinks(): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const create = useCallback(
    async (payload: CreateLinkPayload): Promise<CreateLinkResponse | null> => {
      setCreating(true);
      setCreateError(null);
      try {
        const response = await createLink(payload);
        // Optimistically prepend to list
        setLinks((prev) => [response.link, ...prev]);
        return response;
      } catch (err) {
        setCreateError(
          err instanceof Error ? err.message : "Failed to create link"
        );
        return null;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  return {
    links,
    loading,
    error,
    creating,
    createError,
    create,
    refresh: fetchLinks,
  };
}