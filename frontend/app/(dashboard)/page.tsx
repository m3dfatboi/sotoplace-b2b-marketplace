"use client";

import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Главная</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Обзор ключевых метрик и активности
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Активные заказы"
          value="24"
          change="+12%"
          trend="up"
          icon={ShoppingCart}
        />
        <KPICard
          title="Выручка"
          value="₽2.4M"
          change="+8%"
          trend="up"
          icon={TrendingUp}
        />
        <KPICard
          title="Товары"
          value="156"
          change="+3"
          trend="neutral"
          icon={Package}
        />
        <KPICard
          title="Контрагенты"
          value="48"
          change="+5"
          trend="up"
          icon={Users}
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Последняя активность
          </h2>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Показать всё
          </button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 rounded-lg p-3 hover:bg-neutral-50 transition-fast">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  Новый заказ #ORD-{1000 + i}
                </p>
                <p className="text-sm text-neutral-600">
                  ООО "Компания {i}" • 5 минут назад
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-neutral-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <span
          className={`text-sm font-medium ${
            trend === "up"
              ? "text-success-600"
              : trend === "down"
              ? "text-error-600"
              : "text-neutral-600"
          }`}
        >
          {change}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-neutral-600">{title}</p>
        <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
