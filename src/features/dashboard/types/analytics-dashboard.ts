/** GET /api/gym-owner/analytics/dashboard */
export type GymOwnerAnalyticsPeriod = {
  startDate: string;
  endDate: string;
};

export type GymOwnerAnalyticsDashboard = {
  totalMembers: number;
  activeMembers: number;
  membersChange: number;
  activeClasses: number;
  scheduledClassesThisWeek: number;
  totalClasses: number;
  todaysAttendance: number;
  capacityUtilization: number;
  monthlyRevenue: number;
  revenueChange: number;
  totalRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  totalTrainers: number;
  activeTrainers: number;
  memberEngagement: number;
  pendingTransactions: number;
  period: GymOwnerAnalyticsPeriod;
};
