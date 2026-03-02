"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Обзор вашего бизнеса</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Clock className="w-4 h-4" />
            Последние 30 дней
          </Button>
          <Button>
            <Plus className="w-4 h-4" />
            Создать заказ
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Активные заказы"
          value="24"
          change={17}
          changeLabel="за неделю"
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <KPICard
          title="Продажи"
          value="145"
          change={12}
          changeLabel="за неделю"
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <KPICard
          title="Товары"
          value="1,234"
          change={8}
          changeLabel="новых"
          icon={<Package className="w-6 h-6" />}
        />
        <KPICard
          title="Компании"
          value="89"
          change={5}
          changeLabel="активных"
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Продажи</h3>
              <p className="text-sm text-gray-500">За последние 7 дней</p>
            </div>
            <Button variant="ghost" size="sm">
              Подробнее
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[60, 100, 67, 60, 46, 74, 60, 60, 84, 96, 96, 84, 45, 67, 89, 92, 78].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary-500 rounded-t-lg hover:bg-primary-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Orders Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Статус заказов</h3>
              <p className="text-sm text-gray-500">Текущее состояние</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Новые", count: 6, color: "bg-gray-200", percentage: 25 },
              { label: "Проектирование", count: 9, color: "bg-warning-500", percentage: 37.5 },
              { label: "Производство", count: 33, color: "bg-success-500", percentage: 137.5 },
              { label: "На паузе", count: 5, color: "bg-error-500", percentage: 20.8 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Последние заказы</h3>
            <p className="text-sm text-gray-500">Недавняя активность</p>
          </div>
          <Link href="/orders">
            <Button variant="ghost" size="sm">
              Все заказы
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {[
            { id: "2060", company: "Студия Проектирования ЭКСПЕРТ", status: "Производство", amount: "10 800 ₽", date: "15.08.24" },
            { id: "2059", company: "Идея СЕНС", status: "Проектирование", amount: "14 000 ₽", date: "02.07.24" },
            { id: "2058", company: "Мурзаязов Ильяс Нагимуллович", status: "Готов", amount: "640 000 ₽", date: "13.08.24" },
            { id: "2054", company: "Научно-Исследовательская Компания НОВА", status: "Отгружен", amount: "28 000 ₽", date: "03.08.24" },
          ].map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-600">#{order.id}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.company}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "Производство" ? "bg-success-50 text-success-600" :
                  order.status === "Проектирование" ? "bg-warning-50 text-warning-600" :
                  order.status === "Готов" ? "bg-info-50 text-info-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {order.status}
                </span>
                <span className="font-semibold text-gray-900 min-w-[100px] text-right">{order.amount}</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
