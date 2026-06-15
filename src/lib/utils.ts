export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function truncateUrl(url: string, maxLength = 52): string {
  try {
    const { hostname, pathname } = new URL(url);
    const full = hostname + pathname;
    return full.length > maxLength ? full.slice(0, maxLength) + "…" : full;
  } catch {
    return url.length > maxLength ? url.slice(0, maxLength) + "…" : url;
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}