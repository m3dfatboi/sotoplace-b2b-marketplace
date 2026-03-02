"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTopProducts } from "@/lib/mock-data";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

export function TopProductsWidget() {
  return (
    <Card className="h-[236px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Топ товаров</CardTitle>
          <TrendingUp className="w-4 h-4 text-[#67bb34]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTopProducts.slice(0, 4).map((product, index) => (
            <div key={product.id}>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs text-[#737373] w-3">{index + 1}</span>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#1f1f1f] font-medium truncate">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-[#737373]">
                      {product.sales} продаж
                    </div>
                  </div>
                </div>
              </div>
              {index < 3 && <div className="h-px bg-[#e5e5e5] mt-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
