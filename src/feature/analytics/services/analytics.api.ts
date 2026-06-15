import axiosClient from "../../../lib/axios";
import type { Analytics } from "../types/analytics.types";

export async function getLinkAnalytics(shortCode: string): Promise<Analytics> {
  const { data } = await axiosClient.get<{ data: Analytics }>(
    `/api/links/${shortCode}/analytics`
  );
  return data.data;
}