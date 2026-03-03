"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  Edit,
  MessageSquare,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  User
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";

// Mock data
const order = {
  id: "1",
  orderNumber: "ORD-2026-001",
  status: "in_progress",
  customer: {
    name: "ООО «Производство»",
    contact: "Иван Петров",
    phone: "+7 (999) 123-45-67",
    email: "ivan@production.ru",
  },
  amount: 245000,
  createdAt: "2026-03-01T10:30:00",
  deadline: "2026-03-15",
  items: [
    {
      id: "1",
      name: "Металлический верстак",
      sku: "BENCH-001",
      quantity: 3,
      price: 45000,
      status: "production",
      operations: {
        design: { status: "completed", progress: 100 },
        procurement: { status: "completed", progress: 100 },
        production: { status: "in_progress", progress: 60 },
        quality: { status: "pending", progress: 0 },
        assembly: { status: "pending", progress: 0 },
      },
    },
    {
      id: "2",
      name: "Офисный стол",
      sku: "DESK-001",
      quantity: 5,
      price: 25000,
      status: "ready",
      operations: {
        design: { status: "completed", progress: 100 },
        procurement: { status: "completed", progress: 100 },
        production: { status: "completed", progress: 100 },
        quality: { status: "completed", progress: 100 },
        assembly: { status: "completed", progress: 100 },
      },
    },
  ],
  timeline: [
    {
      id: "1",
      type: "created",
      title: "Заказ создан",
      description: "Менеджер Алексей Смирнов",
      timestamp: "2026-03-01T10:30:00",
    },
    {
      id: "2",
      type: "approved",
      title: "Заказ согласован",
      description: "Клиент подтвердил спецификацию",
      timestamp: "2026-03-01T14:20:00",
    },
    {
      id: "3",
      type: "production",
      title: "Запущено производство",
      description: "Позиция: Металлический верстак (3 шт.)",
      timestamp: "2026-03-02T09:00:00",
    },
    {
      id: "4",
      type: "completed",
      title: "Готова позиция",
      description: "Офисный стол (5 шт.) - готов к отгрузке",
      timestamp: "2026-03-02T16:45:00",
    },
  ],
  activeUsers: [
    { id: "1", name: "Алексей С.", avatar: null },
    { id: "2", name: "Мария К.", avatar: null },
  ],
};

const statusConfig = {
  new: { label: "Новый", variant: "default" as const },
  in_progress: { label: "В работе", variant: "warning" as const },
  production: { label: "Производство", variant: "info" as const },
  ready: { label: "Готов", variant: "success" as const },
  completed: { label: "Завершён", variant: "success" as const },
};

const operationLabels = {
  design: "Проектирование",
  procurement: "Закупка",
  production: "Производство",
  quality: "Контроль качества",
  assembly: "Сборка",
};

export default function OrderDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-900">
                {order.orderNumber}
              </h1>
              <Badge variant={statusConfig[order.status as keyof typeof statusConfig].variant}>
                {statusConfig[order.status as keyof typeof statusConfig].label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              Создан {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <MessageSquare className="h-4 w-4" />
            Чат
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
          <Button>
            <Edit className="h-4 w-4" />
            Редактировать
          </Button>
        </div>
      </div>

      {/* Active Users */}
      {order.activeUsers.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-info-200 bg-info-50 px-4 py-3">
          <div className="flex -space-x-2">
            {order.activeUsers.map((user) => (
              <div
                key={user.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-medium text-primary-700"
              >
                {user.name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-sm text-info-700">
            {order.activeUsers.map((u) => u.name).join(", ")} сейчас просматривают этот заказ
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Позиции заказа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-neutral-200 p-4"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Артикул: {item.sku} • {item.quantity} шт. × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <Badge variant={statusConfig[item.status as keyof typeof statusConfig].variant}>
                      {statusConfig[item.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>

                  {/* Operations Progress */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-neutral-600">
                      Операции:
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(item.operations).map(([key, op]) => (
                        <div key={key} className="text-center">
                          <div
                            className={`mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full ${
                              op.status === "completed"
                                ? "bg-success-100 text-success-600"
                                : op.status === "in_progress"
                                ? "bg-warning-100 text-warning-600"
                                : "bg-neutral-100 text-neutral-400"
                            }`}
                          >
                            {op.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : op.status === "in_progress" ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <AlertCircle className="h-5 w-5" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-600">
                            {operationLabels[key as keyof typeof operationLabels]}
                          </p>
                          <p className="text-xs font-medium text-neutral-900">
                            {op.progress}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>История заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <Package className="h-5 w-5 text-primary-600" />
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="absolute left-5 top-10 h-full w-px bg-neutral-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium text-neutral-900">
                        {event.title}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {event.description}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Клиент</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {order.customer.name}
                </p>
                <p className="text-sm text-neutral-600">
                  {order.customer.contact}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-neutral-600">{order.customer.phone}</p>
                <p className="text-sm text-neutral-600">{order.customer.email}</p>
              </div>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4" />
                Написать
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Сводка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Позиций:</span>
                <span className="font-medium text-neutral-900">
                  {order.items.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Срок:</span>
                <span className="font-medium text-neutral-900">
                  {order.deadline}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-medium text-neutral-900">Итого:</span>
                  <span className="text-xl font-bold text-neutral-900">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
