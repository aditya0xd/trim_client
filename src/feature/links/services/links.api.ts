import axiosClient from "../../../lib/axios";
import type {
  CreateLinkPayload,
  CreateLinkResponse,
  Link,
} from "../types/link.types";

export async function createLink(
  payload: CreateLinkPayload
): Promise<CreateLinkResponse> {
  const body = {
    url: payload.originalUrl,
    customCode: payload.customAlias || undefined,
  };
  const { data } = await axiosClient.post<{ data: Link }>("/api/links", body);
  return {
    shortCode: data.data.shortCode,
    shortUrl: data.data.shortUrl,
    link: data.data,
  };
}

export async function getAllLinks(): Promise<Link[]> {
  const { data } = await axiosClient.get<{ data: Link[] }>("/api/links");
  return data.data;
}