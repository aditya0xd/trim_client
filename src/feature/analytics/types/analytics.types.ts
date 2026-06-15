export interface ClickPerDay {
  date: string;
  clicks: number;
}

export interface TopReferrer {
  referrer: string;
  count: number;
}

export interface Analytics {
  totalClicks: number;
  clicksPerDay: ClickPerDay[];
  topReferrers: TopReferrer[];
  link: {
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    createdAt: string;
  };
}