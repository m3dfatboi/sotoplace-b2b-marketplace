import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DashboardStats {
  active_orders: {
    new: number;
    in_progress: number;
    production: number;
    ready: number;
    total: number;
  };
  weekly_sales: number[];
  top_products: Array<{
    name: string;
    count: number;
  }>;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Mock data for now - replace with real API endpoint
      const mockData: DashboardStats = {
        active_orders: {
          new: 8,
          in_progress: 24,
          production: 33,
          ready: 5,
          total: 70,
        },
        weekly_sales: [120, 145, 132, 168, 155, 178, 145],
        top_products: [
          { name: "Владимировна A", count: 24 },
          { name: "Богомолов Л", count: 20 },
          { name: "Огнев А", count: 18 },
          { name: "Терентьев В", count: 17 },
          { name: "Лопухина К", count: 11 },
        ],
      };
      return mockData;
    },
    staleTime: 30000, // 30 seconds
  });
}
