"use client";

import { ActiveOrdersWidget } from "@/components/dashboard/active-orders-widget";
import { RevenueWidget } from "@/components/dashboard/revenue-widget";
import { CatalogStatsWidget } from "@/components/dashboard/catalog-stats-widget";
import { TopProductsWidget } from "@/components/dashboard/top-products-widget-new";
import { ActivityWidget } from "@/components/dashboard/activity-widget";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { useOrders } from "@/hooks/useOrders";

export default function DashboardPage() {
  const { data: ordersData, isLoading } = useOrders(1, 20);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pr-[72px]">
      <div className="p-5">
        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Главная</h1>
          <p className="text-sm text-[#737373] mt-1">
            Обзор активности маркетплейса
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-4 gap-5 mb-5">
          {/* Row 1: Main metrics */}
          <div className="col-span-1">
            <ActiveOrdersWidget />
          </div>
          <div className="col-span-1">
            <RevenueWidget />
          </div>
          <div className="col-span-1">
            <CatalogStatsWidget />
          </div>
          <div className="col-span-1">
            <TopProductsWidget />
          </div>
        </div>

        {/* Row 2: Activity feed */}
        <div className="grid grid-cols-4 gap-5 mb-5">
          <div className="col-span-4">
            <ActivityWidget />
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-[#e5e5e5] p-8 text-center">
            <div className="text-[#737373]">Загрузка заказов...</div>
          </div>
        ) : (
          <OrdersTable orders={ordersData?.items || []} />
        )}
      </div>
    </div>
  );
}
