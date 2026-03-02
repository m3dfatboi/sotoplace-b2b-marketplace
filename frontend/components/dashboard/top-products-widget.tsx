"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboard";
import { mockUsers } from "@/lib/mock-data";
import Image from "next/image";

export function TopProductsWidget() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="h-[236px]">
        <CardHeader>
          <CardTitle>Лидеры</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const products = data?.top_products || [];

  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <div className="flex items-baseline gap-2">
          <CardTitle>Лидеры</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product, index) => (
            <div key={index}>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#737373] w-3">{index + 1}</span>
                  <Image
                    src={mockUsers[index]?.avatar || "https://i.pravatar.cc/150?img=1"}
                    alt={product.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-[#1f1f1f]">{product.name}</span>
                </div>
                <span className="text-xs font-medium text-[#1f1f1f]">{product.count}</span>
              </div>
              {index < products.length - 1 && (
                <div className="h-px bg-[#e5e5e5] mt-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
