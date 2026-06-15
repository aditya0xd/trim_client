import axiosClient from "../../../lib/axios";
import type { Analytics } from "../types/analytics.types";

export async function getLinkAnalytics(shortCode: string): Promise<Analytics> {
  const { data } = await axiosClient.get<{ data: any }>(
    `/api/links/${shortCode}/analytics`
  );
  
  const raw = data.data;
  return {
    totalClicks: raw.totalClicks,
    clicksPerDay: (raw.clicksPerDay ?? []).map((item: any) => ({
      date: item.date,
      clicks: item.count ?? 0,
    })),
    topReferrers: raw.topReferrers ?? [],
    link: raw.link,
  };
}