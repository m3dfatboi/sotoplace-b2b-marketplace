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
  const total = orders?.total || 0;
  const inProgress = orders?.in_progress || 0;
  const production = orders?.production || 0;
  const ready = orders?.ready || 0;

  // Calculate percentages for the circular chart
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
  const productionPercent = total > 0 ? (production / total) * 100 : 0;
  const readyPercent = total > 0 ? (ready / total) * 100 : 0;

  return (
    <Card className="h-[236px]">
      <CardHeader>
        <CardTitle>Активные счета</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-[100px] h-[100px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f5f5f5"
                strokeWidth="12"
              />
              {/* In Progress - Green */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#67bb34"
                strokeWidth="12"
                strokeDasharray={`${inProgressPercent * 2.51} 251`}
                strokeLinecap="round"
              />
              {/* Production - Orange */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#d18043"
                strokeWidth="12"
                strokeDasharray={`${productionPercent * 2.51} 251`}
                strokeDashoffset={-inProgressPercent * 2.51}
                strokeLinecap="round"
              />
              {/* Ready - Red */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e03636"
                strokeWidth="12"
                strokeDasharray={`${readyPercent * 2.51} 251`}
                strokeDashoffset={-(inProgressPercent + productionPercent) * 2.51}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold text-[#1f1f1f]">{total}</div>
              <div className="text-xs text-[#67bb34]">+17%</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f5f5f5]" />
              <span className="text-[#737373]">Новые</span>
              <span className="ml-auto font-medium">{orders?.new || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#67bb34]" />
              <span className="text-[#737373]">Проектирование</span>
              <span className="ml-auto font-medium">{inProgress}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d18043]" />
              <span className="text-[#737373]">Производство</span>
              <span className="ml-auto font-medium">{production}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#e03636]" />
              <span className="text-[#737373]">На погрузке</span>
              <span className="ml-auto font-medium">{ready}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
