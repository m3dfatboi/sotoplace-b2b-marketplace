"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

export function KPICard({ title, value, change, changeLabel, icon, trend = "up" }: KPICardProps) {
  const isPositive = trend === "up" ? change > 0 : change < 0;

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-error-600" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                isPositive ? "text-success-600" : "text-error-600"
              )}
            >
              {change > 0 ? "+" : ""}{change}%
            </span>
            <span className="text-sm text-gray-500">{changeLabel}</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}
