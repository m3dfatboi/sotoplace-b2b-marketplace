'use client';

import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/lib/hooks/useOrders';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [OrderStatus.NEGOTIATION]: 'bg-blue-100 text-blue-800',
  [OrderStatus.APPROVED]: 'bg-green-100 text-green-800',
  [OrderStatus.IN_PRODUCTION]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.READY]: 'bg-purple-100 text-purple-800',
  [OrderStatus.IN_DELIVERY]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.DELIVERED]: 'bg-teal-100 text-teal-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'Черновик',
  [OrderStatus.NEGOTIATION]: 'Согласование',
  [OrderStatus.APPROVED]: 'Утвержден',
  [OrderStatus.IN_PRODUCTION]: 'В производстве',
  [OrderStatus.READY]: 'Готов',
  [OrderStatus.IN_DELIVERY]: 'В доставке',
  [OrderStatus.DELIVERED]: 'Доставлен',
  [OrderStatus.COMPLETED]: 'Завершен',
  [OrderStatus.CANCELLED]: 'Отменен',
};

export default function DashboardPage() {
  const { data: ordersData, isLoading } = useOrders({ size: 5 });

  const stats = {
    totalOrders: ordersData?.total || 0,
    activeOrders: ordersData?.items.filter(o =>
      [OrderStatus.NEGOTIATION, OrderStatus.APPROVED, OrderStatus.IN_PRODUCTION].includes(o.status)
    ).length || 0,
    totalRevenue: ordersData?.items.reduce((sum, o) => sum + o.total_amount, 0) || 0,
    revenueGrowth: 12.5,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
          <p className="text-muted-foreground">
            Обзор ключевых метрик и последних заказов
          </p>
        </div>
        <Button asChild>
          <Link href="/orders/new">
            Создать заказ
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Всего заказов"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <KPICard
          title="Активные заказы"
          value={stats.activeOrders}
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="Выручка"
          value={`${(stats.totalRevenue / 1000000).toFixed(2)}M ₽`}
          change={stats.revenueGrowth}
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Товаров в каталоге"
          value={156}
          icon={Package}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Последние заказы</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders" className="flex items-center gap-1">
              Все заказы
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер заказа</TableHead>
                  <TableHead>Покупатель</TableHead>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Создан</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData?.items.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => window.location.href = `/orders/${order.id}`}
                  >
                    <TableCell className="font-mono font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>{order.buyer_company?.name || 'N/A'}</TableCell>
                    <TableCell>{order.supplier_company?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]} variant="secondary">
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.total_amount.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
