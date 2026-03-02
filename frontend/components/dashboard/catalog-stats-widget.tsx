"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, Clock, CheckCircle } from "lucide-react";

const stats = [
  {
    label: "Товаров в каталоге",
    value: "1,247",
    icon: Package,
    color: "text-[#d18043]",
    bg: "bg-[#f6efd5]",
  },
  {
    label: "На модерации",
    value: "23",
    icon: Clock,
    color: "text-[#d0ad2f]",
    bg: "bg-[#f6efd5]",
  },
  {
    label: "Запросов на расчет",
    value: "15",
    icon: FileText,
    color: "text-[#67bb34]",
    bg: "bg-[#f0f8eb]",
  },
  {
    label: "Завершено сделок",
    value: "342",
    icon: CheckCircle,
    color: "text-[#67bb34]",
    bg: "bg-[#f0f8eb]",
  },
];

export function CatalogStatsWidget() {
  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <CardTitle>Статистика каталога</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-3 rounded-lg border border-[#e5e5e5] hover:border-[#d4d4d4] transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-2xl font-semibold text-[#1f1f1f] mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] text-[#737373] leading-tight">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
