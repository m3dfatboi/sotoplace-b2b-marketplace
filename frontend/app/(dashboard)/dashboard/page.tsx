"use client";

import { ActiveOrdersWidget } from "@/components/dashboard/active-orders-widget";
import { RevenueWidget } from "@/components/dashboard/revenue-widget";
import { CatalogStatsWidget } from "@/components/dashboard/catalog-stats-widget";
import { TopProductsWidget } from "@/components/dashboard/top-products-widget";
import { ActivityWidget } from "@/components/dashboard/activity-widget";
import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar, ArrowRight } from "lucide-react";
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
          <h1 className="text-3xl font-bold text-neutral-900 leading-tight">
            Главная
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
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
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Последние заказы
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
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

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-neutral-600">
              Загрузка заказов...
            </div>
          ) : ordersData?.items && ordersData.items.length > 0 ? (
            <div className="space-y-3">
              {ordersData.items.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-xl transition-smooth group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-brand-600">
                        #{order.order_number}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {order.buyer_company_name || "Компания"}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "production" ? "bg-success-50 text-success-600" :
                      order.status === "in_progress" ? "bg-warning-50 text-warning-600" :
                      order.status === "ready" ? "bg-info-50 text-info-600" :
                      order.status === "new" ? "bg-neutral-100 text-neutral-600" :
                      order.status === "shipped" || order.status === "delivered" ? "bg-info-50 text-info-600" :
                      order.status === "completed" ? "bg-success-50 text-success-600" :
                      order.status === "cancelled" ? "bg-error-50 text-error-600" :
                      "bg-neutral-100 text-neutral-600"
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
                    <span className="font-semibold text-neutral-900 min-w-[120px] text-right">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-brand-600 transition-smooth" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600 mb-4">Заказов пока нет</p>
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
