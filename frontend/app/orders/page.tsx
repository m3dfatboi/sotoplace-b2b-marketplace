"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusConfig = {
  new: { label: "Новый", color: "bg-gray-100 text-gray-700", icon: Clock },
  in_progress: { label: "В работе", color: "bg-warning-50 text-warning-600", icon: AlertCircle },
  production: { label: "Производство", color: "bg-success-50 text-success-600", icon: Package },
  ready: { label: "Готов", color: "bg-info-50 text-info-600", icon: CheckCircle2 },
  cancelled: { label: "Отменен", color: "bg-error-50 text-error-600", icon: XCircle },
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useOrders(page, 20);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Заказы</h1>
          <p className="text-gray-500 mt-1">Управление заказами и счетами</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Экспорт
          </Button>
          <Button>
            <Plus className="w-4 h-4" />
            Создать заказ
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по номеру, компании..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4" />
            Фильтры
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.items?.map((order: any) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.new;
            const StatusIcon = status.icon;

            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Order Number */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">
                            #{order.order_number}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.company_name}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>

                      {/* Buyer */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500">Покупатель</p>
                        <p className="font-medium text-gray-900 truncate">{order.buyer_company_name}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Сумма</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data?.total && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Показано {data.items?.length || 0} из {data.total} заказов
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Назад
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!data.items || data.items.length < 20}
              onClick={() => setPage(page + 1)}
            >
              Далее
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
