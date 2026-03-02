"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";

export function SalesWidget() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="h-[236px]">
        <CardHeader>
          <div className="flex items-end gap-[6px]">
            <CardTitle>Продажи</CardTitle>
            <CardDescription>за неделю</CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const chartData = data?.weekly_sales || [60, 100, 67, 60, 46, 74, 60, 60, 84, 96, 96, 84];
  const maxValue = Math.max(...chartData);
  const currentValue = data?.weekly_sales?.[data.weekly_sales.length - 1] || 145;

  return (
    <Card className="h-[236px]">
      <CardHeader>
        <div className="flex items-end gap-[6px]">
          <CardTitle>Продажи</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {/* Chart */}
        <div className="flex items-end justify-between h-[123px] gap-[2px]">
          {chartData.slice(0, 17).map((value, index) => {
            const heightPercent = (value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex items-end h-full">
                <div className="w-full relative">
                  {/* Background bar */}
                  <div className="w-full h-[123px] bg-[#1f1f1f] opacity-15 rounded-[25px]" />
                  {/* Active bar */}
                  <div
                    className="w-full bg-[#d18043] rounded-[25px] absolute bottom-0"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Value and trend */}
        <div className="flex items-center justify-between">
          <div className="text-[24px] font-semibold leading-[28px] text-[#1f1f1f]">
            {currentValue}
          </div>
          <div className="flex items-center gap-[6px] h-[24px] px-[12px] bg-[#f0f8eb] rounded-[26px]">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M6 0L12 7.2L0 7.2L6 0Z" fill="#52962a"/>
            </svg>
            <span className="text-[12px] font-medium leading-[14px] text-[#52962a]">17%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
