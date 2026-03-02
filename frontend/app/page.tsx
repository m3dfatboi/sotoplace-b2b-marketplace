"use client";

import { ActiveOrdersWidget } from "@/components/dashboard/active-orders-widget";
import { RevenueWidget } from "@/components/dashboard/revenue-widget";
import { CatalogStatsWidget } from "@/components/dashboard/catalog-stats-widget";
import { TopProductsWidget } from "@/components/dashboard/top-products-widget";
import { ActivityWidget } from "@/components/dashboard/activity-widget";
import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: ordersData, isLoading } = useOrders(1, 5);

  return (
    <div className="p-5 space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold text-[#1f1f1f] leading-tight">
            Главная
          </h1>
          <p className="text-[14px] text-[#737373] mt-1">
            Обзор ключевых метрик и активности
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4" />
            Последние 30 дней
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Экспорт
          </Button>
          <Link href="/orders">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Создать заказ
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Row - Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ActiveOrdersWidget />
        <RevenueWidget />
        <CatalogStatsWidget />
      </div>

      {/* Middle Row - Secondary Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopProductsWidget />
        <ActivityWidget />
      </div>

      {/* Bottom Section - Recent Orders */}
      <div className="bg-white rounded-[20px] border border-[#e5e5e5] overflow-hidden">
        <div className="p-5 border-b border-[#e5e5e5]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-semibold text-[#1f1f1f]">
                Последние заказы
              </h2>
              <p className="text-[14px] text-[#737373] mt-1">
                Недавняя активность по заказам
              </p>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                Все заказы
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="text-center py-8 text-[#737373]">
              Загрузка заказов...
            </div>
          ) : ordersData?.items && ordersData.items.length > 0 ? (
            <div className="space-y-3">
              {ordersData.items.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-[#f5f5f5] rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#fef6f0] rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#d18043]">
                        #{order.order_number}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1f1f1f]">
                        {order.buyer_company_name || "Компания"}
                      </p>
                      <p className="text-sm text-[#737373]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "production" ? "bg-[#f0f8eb] text-[#67bb34]" :
                      order.status === "in_progress" ? "bg-[#f6efd5] text-[#d0ad2f]" :
                      order.status === "ready" ? "bg-[#eff6ff] text-[#3b82f6]" :
                      order.status === "new" ? "bg-[#f5f5f5] text-[#737373]" :
                      order.status === "shipped" || order.status === "delivered" ? "bg-[#eff6ff] text-[#3b82f6]" :
                      order.status === "completed" ? "bg-[#f0f8eb] text-[#67bb34]" :
                      order.status === "cancelled" ? "bg-[#ffeeee] text-[#e03636]" :
                      "bg-[#f5f5f5] text-[#737373]"
                    }`}>
                      {order.status === "production" ? "Производство" :
                       order.status === "in_progress" ? "В работе" :
                       order.status === "ready" ? "Готов" :
                       order.status === "new" ? "Новый" :
                       order.status === "shipped" ? "Отгружен" :
                       order.status === "delivered" ? "Доставлен" :
                       order.status === "completed" ? "Завершен" :
                       order.status === "cancelled" ? "Отменен" :
                       order.status === "draft" ? "Черновик" : order.status}
                    </span>
                    <span className="font-semibold text-[#1f1f1f] min-w-[120px] text-right">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#a3a3a3] group-hover:text-[#d18043] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#737373] mb-4">Заказов пока нет</p>
              <Link href="/orders">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Создать первый заказ
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
