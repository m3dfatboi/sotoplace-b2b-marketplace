"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock data
const orders = [
  {
    id: "1",
    orderNumber: "ORD-2026-001",
    customer: "ООО «Производство»",
    status: "in_progress",
    amount: 245000,
    items: 5,
    createdAt: "2026-03-01",
    deadline: "2026-03-15",
  },
  {
    id: "2",
    orderNumber: "ORD-2026-002",
    customer: "ООО «Стройка»",
    status: "new",
    amount: 180000,
    items: 3,
    createdAt: "2026-03-02",
    deadline: "2026-03-20",
  },
  {
    id: "3",
    orderNumber: "ORD-2026-003",
    customer: "ИП Иванов",
    status: "production",
    amount: 95000,
    items: 2,
    createdAt: "2026-02-28",
    deadline: "2026-03-10",
  },
  {
    id: "4",
    orderNumber: "ORD-2026-004",
    customer: "ООО «Металл»",
    status: "completed",
    amount: 520000,
    items: 12,
    createdAt: "2026-02-25",
    deadline: "2026-03-05",
  },
];

const statusConfig = {
  new: { label: "Новый", variant: "default" as const },
  in_progress: { label: "В работе", variant: "warning" as const },
  production: { label: "Производство", variant: "info" as const },
  ready: { label: "Готов", variant: "success" as const },
  completed: { label: "Завершён", variant: "success" as const },
  cancelled: { label: "Отменён", variant: "error" as const },
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Заказы</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Управление заказами и сделками
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Создать заказ
        </Button>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Поиск по номеру, клиенту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
        <Button variant="secondary">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900">
                    Номер заказа
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900">
                    Клиент
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-neutral-600">
                    Статус
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <button className="flex items-center gap-2 ml-auto text-xs font-medium text-neutral-600 hover:text-neutral-900">
                    Сумма
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-neutral-600">
                    Позиций
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900">
                    Создан
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-neutral-600">
                    Срок
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-neutral-600">
                    Действия
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50 transition-fast"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-mono text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-900">
                      {order.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusConfig[order.status as keyof typeof statusConfig].variant}>
                      {statusConfig[order.status as keyof typeof statusConfig].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-neutral-900">
                      {formatCurrency(order.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-neutral-600">
                      {order.items}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-neutral-600">
                      {formatDate(order.deadline)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <span className="text-sm text-neutral-600">
            Показано 1-4 из 4 заказов
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Назад
            </Button>
            <Button variant="outline" size="sm" disabled>
              Вперёд
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
