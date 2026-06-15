import type { Link } from "../feature/links/types/link.types";

export function calculateTotalLinks(links: Link[]): number {
  return links.length;
}

export function calculateTotalClicks(links: Link[]): number {
  return links.reduce((sum, link) => sum + link.clickCount, 0);
}

export function getMostActiveLink(links: Link[]): Link | null {
  if (links.length === 0) return null;
  return [...links].sort((a, b) => b.clickCount - a.clickCount)[0];
}

export function filterLinks(links: Link[], searchQuery: string): Link[] {
  if (!searchQuery) return links;
  
  const query = searchQuery.toLowerCase();
  return links.filter(
    (link) =>
      link.originalUrl.toLowerCase().includes(query) ||
      link.shortCode.toLowerCase().includes(query)
  );
}
