export * from "./overview";
export * from "./analytics-dashboard";
export * from "./analytics-charts";

export type DashboardDocument = {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
};

export * from "./profile";
