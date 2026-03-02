"use client";

import { ActiveOrdersWidget } from "@/components/dashboard/active-orders-widget";
import { RemindersWidget } from "@/components/dashboard/reminders-widget";
import { SalesWidget } from "@/components/dashboard/sales-widget";
import { LoadWidget } from "@/components/dashboard/load-widget";
import { LeadersWidget } from "@/components/dashboard/leaders-widget";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { useOrders } from "@/hooks/useOrders";

export default function DashboardPage() {
  const { data: ordersData, isLoading } = useOrders(1, 20);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pr-[72px]">
      <div className="p-5 space-y-5">
        {/* Row 1: Main widgets */}
        <div className="grid grid-cols-4 gap-5">
          <ActiveOrdersWidget />
          <RemindersWidget />
          <SalesWidget />
          <LoadWidget />
        </div>

        {/* Row 2: Leaders widget */}
        <div className="grid grid-cols-4 gap-5">
          <LeadersWidget />
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white rounded-[20px] border border-[#e5e5e5] p-8 text-center">
            <div className="text-[#737373]">Загрузка заказов...</div>
          </div>
        ) : (
          <OrdersTable orders={ordersData?.items || []} />
        )}
      </div>
    </div>
  );
}
