"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

export function SalesWidget() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="h-[236px]">
        <CardHeader>
          <CardTitle>Продажи</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartData = data?.weekly_sales.map((value, index) => ({
    day: index,
    value,
  })) || [];

  const currentValue = data?.weekly_sales[data.weekly_sales.length - 1] || 145;

  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <div className="flex items-baseline gap-2">
          <CardTitle>Продажи</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[123px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2}>
              <Bar
                dataKey="value"
                fill="#d18043"
                radius={[4, 4, 0, 0]}
                maxBarSize={6}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-[#1f1f1f]">{currentValue}</div>
          <div className="flex items-center gap-1 text-xs text-[#67bb34]">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M6 0L12 8H0L6 0Z" fill="currentColor"/>
            </svg>
            <span>17%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
