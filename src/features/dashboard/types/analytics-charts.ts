export type AnalyticsChartMonthRow = {
  month: string;
  monthShort: string;
  year: number;
};

/** GET /api/gym-owner/analytics/charts/member-growth */
export type MemberGrowthChartResponse = {
  title: string;
  subtitle: string;
  period: string;
  data: (AnalyticsChartMonthRow & { count: number })[];
  min?: number;
  max?: number;
};

/** GET /api/gym-owner/analytics/charts/revenue-trend */
export type RevenueTrendChartResponse = {
  title: string;
  subtitle: string;
  period: string;
  data: (AnalyticsChartMonthRow & { revenue: number })[];
  min?: number;
  max?: number;
};
