"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoadItem {
  name: string;
  percentage: number;
}

const mockData: LoadItem[] = [
  { name: "Склад 1", percentage: 65 },
  { name: "Склад 2", percentage: 45 },
  { name: "Отгрузка", percentage: 80 },
];

export function LoadWidget() {
  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <div className="flex items-baseline gap-2">
          <CardTitle>Нагрузка</CardTitle>
          <CardDescription>сейчас</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.map((item, index) => (
            <div key={index}>
              <div className="text-[10px] text-[#737373] mb-2">{item.name}</div>
              <div className="flex gap-[2px]">
                {Array.from({ length: 31 }).map((_, i) => {
                  const threshold = (item.percentage / 100) * 31;
                  const isActive = i < threshold;
                  return (
                    <div
                      key={i}
                      className={`w-[4.9px] h-4 rounded-sm ${
                        isActive ? "bg-[#d18043]" : "bg-[#f5f5f5]"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
