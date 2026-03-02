"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";

export function ActiveOrdersWidget() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="h-[236px]">
        <CardHeader>
          <CardTitle>Активные счета</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-[#737373]">Загрузка...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const orders = data?.active_orders;
  const total = orders?.total || 24;
  const newOrders = orders?.new || 6;
  const design = orders?.in_progress || 9;
  const production = orders?.production || 33;
  const paused = orders?.ready || 5;

  // Calculate percentages for donut chart
  const designPercent = (design / total) * 100;
  const productionPercent = (production / total) * 100;
  const pausedPercent = (paused / total) * 100;

  // SVG donut chart parameters
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 20;

  const designLength = (designPercent / 100) * circumference;
  const productionLength = (productionPercent / 100) * circumference;
  const pausedLength = (pausedPercent / 100) * circumference;

  return (
    <Card className="h-[236px]">
      <CardHeader>
        <CardTitle>Активные счета</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-[20px]">
        {/* Donut Chart */}
        <div className="relative w-[159px] h-[159px] shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth={strokeWidth}
            />

            {/* Design segment - yellow/process */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f6efd5"
              strokeWidth={strokeWidth}
              strokeDasharray={`${designLength} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />

            {/* Production segment - green */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(103,187,52,0.1)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${productionLength} ${circumference}`}
              strokeDashoffset={-designLength}
              strokeLinecap="round"
            />

            {/* Paused segment - red */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#ffeeee"
              strokeWidth={strokeWidth}
              strokeDasharray={`${pausedLength} ${circumference}`}
              strokeDashoffset={-(designLength + productionLength)}
              strokeLinecap="round"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
            <div className="text-[24px] font-semibold leading-[28px] text-[#1f1f1f]">
              {total}
            </div>
            <div className="flex items-center gap-[6px] h-[24px] px-[12px] bg-[rgba(103,187,52,0.1)] rounded-[26px]">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M6 0L12 7.2L0 7.2L6 0Z" fill="#52962a"/>
              </svg>
              <span className="text-[12px] font-medium leading-[14px] text-[#52962a]">17%</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-between flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] bg-[#e5e5e5] rounded-[8px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="2" stroke="#525252" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">Новые</span>
            </div>
            <span className="text-[14px] font-semibold leading-[18px] text-[#1f1f1f]">{newOrders}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] bg-[#f6efd5] rounded-[8px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3.5V7M7 7V10.5M7 7H10.5M7 7H3.5" stroke="#a68a26" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">Проектирование</span>
            </div>
            <span className="text-[14px] font-semibold leading-[18px] text-[#1f1f1f]">{design}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] bg-[rgba(103,187,52,0.1)] rounded-[8px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="4" height="4" rx="1" fill="#52962a"/>
                  <rect x="8" y="2" width="4" height="4" rx="1" fill="#52962a"/>
                  <rect x="2" y="8" width="4" height="4" rx="1" fill="#52962a"/>
                  <rect x="8" y="8" width="4" height="4" rx="1" fill="#52962a"/>
                </svg>
              </div>
              <span className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">Производство</span>
            </div>
            <span className="text-[14px] font-semibold leading-[18px] text-[#1f1f1f]">{production}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] bg-[#ffeeee] rounded-[8px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="1" stroke="#b32c2b" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">На паузе</span>
            </div>
            <span className="text-[14px] font-semibold leading-[18px] text-[#1f1f1f]">{paused}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
