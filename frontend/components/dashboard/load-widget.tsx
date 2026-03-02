"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoadItem {
  name: string;
  percentage: number;
  color: string;
}

const mockData: LoadItem[] = [
  { name: "Склад 1", percentage: 90, color: "#b32c2b" },
  { name: "Склад 2", percentage: 65, color: "#a68a26" },
  { name: "Отгрузка", percentage: 26, color: "#52962a" },
];

export function LoadWidget() {
  return (
    <Card className="h-[236px] w-[260px] overflow-hidden">
      <CardHeader>
        <div className="flex items-end gap-[6px]">
          <CardTitle>Нагрузка</CardTitle>
          <CardDescription>сейчас</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-[10px] pt-[16px]">
        {mockData.map((item, index) => (
          <div key={index} className="flex flex-col gap-[10px]">
            <div className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">
              {item.name}
            </div>
            <div className="flex gap-[2px] h-[24px] items-center border border-[#d4d4d4] rounded-[6px] p-[4px]">
              {Array.from({ length: 31 }).map((_, i) => {
                const threshold = Math.round((item.percentage / 100) * 31);
                const isActive = i < threshold;
                return (
                  <div
                    key={i}
                    className="flex-1 h-full rounded-[2px]"
                    style={{
                      backgroundColor: isActive ? item.color : "#d4d4d4",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
