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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Главная</h1>
        <p className="mt-2 text-base text-neutral-600">
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
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.06)] transition-shadow duration-200 hover:shadow-[0_10px_20px_-5px_rgb(0_0_0_/_0.08)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
              Последняя активность
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Недавние события и обновления
            </p>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Показать всё →
          </button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group flex items-start gap-4 rounded-xl border border-neutral-100 p-4 transition-all duration-200 hover:border-neutral-200 hover:bg-neutral-50/50 hover:shadow-sm">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  Новый заказ #ORD-{1000 + i}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  ООО "Компания {i}" • 5 минут назад
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-neutral-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-600" />
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
    <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.06)] transition-all duration-200 hover:shadow-[0_10px_20px_-5px_rgb(0_0_0_/_0.08)]">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary-50 to-transparent opacity-50 transition-transform duration-300 group-hover:scale-110" />
      <div className="relative flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span
          className={`text-sm font-semibold ${
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
      <div className="relative mt-5">
        <p className="text-sm font-medium text-neutral-600">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">{value}</p>
      </div>
    </div>
  );
}
