export type GymOwnerDashboardOverviewGym = {
  id: string;
  name: string;
  isActive: boolean;
};

export type GymOwnerDashboardOverviewSummary = {
  totalLocations: number;
  totalStaff: number;
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
};

export type GymOwnerDashboardOverviewQuickStats = {
  pendingMemberships: number;
  expiringSoon: number;
  activeSubscriptions: number;
};

/** GET /api/gym-owner/dashboard/overview */
export type GymOwnerDashboardOverview = {
  gym: GymOwnerDashboardOverviewGym;
  summary: GymOwnerDashboardOverviewSummary;
  quickStats: GymOwnerDashboardOverviewQuickStats;
};
