export interface Link {
  _id?: string;
  id?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  customAlias?: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
}

export interface CreateLinkPayload {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface CreateLinkResponse {
  shortCode: string;
  shortUrl: string;
  link: Link;
}