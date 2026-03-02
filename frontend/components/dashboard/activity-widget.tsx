"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockActivity } from "@/lib/mock-data";
import { ShoppingCart, CheckCircle, MessageSquare, Check } from "lucide-react";

const iconMap = {
  "shopping-cart": ShoppingCart,
  "check-circle": CheckCircle,
  "message-square": MessageSquare,
  "check": Check,
};

const typeColors = {
  new_order: "text-[#d18043]",
  payment: "text-[#67bb34]",
  message: "text-[#d0ad2f]",
  product: "text-[#737373]",
};

export function ActivityWidget() {
  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <CardTitle>Последние события</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 overflow-y-auto max-h-[150px]">
          {mockActivity.map((activity, index) => {
            const Icon = iconMap[activity.icon as keyof typeof iconMap];
            const colorClass = typeColors[activity.type as keyof typeof typeColors];

            return (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#1f1f1f] font-medium">
                      {activity.title}
                    </div>
                    <div className="text-[10px] text-[#737373] mt-0.5">
                      {activity.description}
                    </div>
                    <div className="text-[10px] text-[#a3a3a3] mt-1">
                      {activity.time}
                    </div>
                  </div>
                </div>
                {index < mockActivity.length - 1 && (
                  <div className="h-px bg-[#e5e5e5] mt-3" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
