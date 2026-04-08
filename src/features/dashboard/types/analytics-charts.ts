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

/** GET /api/gym-owner/analytics/weekly-attendance */
export type WeeklyAttendanceDayRow = {
  day: string;
  dayShort: string;
  morning: number;
  afternoon: number;
  evening: number;
  total: number;
};

export type WeeklyAttendanceChartResponse = {
  title: string;
  subtitle: string;
  data: WeeklyAttendanceDayRow[];
  maxValue: number;
};

/** GET /api/gym-owner/analytics/member-mix */
export type MemberMixChartRow = {
  membershipType: string;
  count: number;
  percentage: number;
  color: string;
};

export type MemberMixChartResponse = {
  title: string;
  subtitle: string;
  data: MemberMixChartRow[];
};
