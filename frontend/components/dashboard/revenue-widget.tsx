"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function RevenueWidget() {
  const currentRevenue = 3450000;
  const previousRevenue = 2890000;
  const growth = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);

  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <div className="flex items-baseline gap-2">
          <CardTitle>Выручка</CardTitle>
          <CardDescription>за месяц</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-4xl font-semibold text-[#1f1f1f] mb-2">
              {(currentRevenue / 1000000).toFixed(1)}M ₽
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#f0f8eb]">
                <TrendingUp className="w-3 h-3 text-[#67bb34]" />
                <span className="text-xs font-medium text-[#67bb34]">
                  +{growth}%
                </span>
              </div>
              <span className="text-xs text-[#737373]">
                vs прошлый месяц
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#737373]">Средний чек</span>
              <span className="font-medium text-[#1f1f1f]">285,000 ₽</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#737373]">Заказов в месяц</span>
              <span className="font-medium text-[#1f1f1f]">124</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#737373]">Конверсия</span>
              <span className="font-medium text-[#67bb34]">18.5%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
