"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";

export function SalesWidget() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="h-[236px] w-[260px]">
        <CardHeader>
          <div className="flex items-end gap-[6px]">
            <CardTitle>Продажи</CardTitle>
            <CardDescription>за неделю</CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // 17 bars with varying heights
  const chartData = [60, 100, 67, 60, 46, 74, 60, 60, 84, 96, 96, 84, 0, 0, 0, 0, 0];
  const maxValue = Math.max(...chartData.filter(v => v > 0));
  const currentValue = 145;

  return (
    <Card className="h-[236px] w-[260px] overflow-hidden">
      <CardHeader>
        <div className="flex items-end gap-[6px]">
          <CardTitle>Продажи</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px] pt-[16px]">
        {/* Chart - 17 bars, 6px width each */}
        <div className="flex items-end justify-between h-[123px]">
          {chartData.map((value, index) => {
            const heightPercent = value > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div key={index} className="relative" style={{ width: '6px' }}>
                {/* Background bar */}
                <div
                  className="absolute bottom-0 w-full rounded-[25px]"
                  style={{
                    height: '123px',
                    backgroundColor: '#1f1f1f',
                    opacity: 0.15
                  }}
                />
                {/* Active bar */}
                {value > 0 && (
                  <div
                    className="absolute bottom-0 w-full bg-[#d18043] rounded-[25px]"
                    style={{ height: `${heightPercent}%` }}
                  />
                )}
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
