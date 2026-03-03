'use client';

import { KPICard } from '@/components/dashboard/KPICard';
import { RevenueChart, OrdersChart } from '@/components/dashboard/Charts';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  ArrowUpRight,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { mockOrders, mockAnalytics } from '@/lib/mock-data';

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-700 border-gray-200',
  [OrderStatus.NEGOTIATION]: 'bg-blue-100 text-blue-700 border-blue-200',
  [OrderStatus.APPROVED]: 'bg-green-100 text-green-700 border-green-200',
  [OrderStatus.IN_PRODUCTION]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [OrderStatus.READY]: 'bg-purple-100 text-purple-700 border-purple-200',
  [OrderStatus.IN_DELIVERY]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [OrderStatus.DELIVERED]: 'bg-teal-100 text-teal-700 border-teal-200',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-700 border-green-200',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-700 border-red-200',
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
  const recentOrders = mockOrders.slice(0, 5);
  const totalOrders = mockOrders.length;
  const activeOrders = mockOrders.filter(o =>
    [OrderStatus.NEGOTIATION, OrderStatus.APPROVED, OrderStatus.IN_PRODUCTION].includes(o.status)
  ).length;
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Добро пожаловать в Sotoplace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Обзор ключевых метрик и последних заказов
          </p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg" asChild>
          <Link href="/orders/new">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Создать заказ
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Всего заказов"
          value={totalOrders}
          icon={ShoppingCart}
          gradient="from-blue-500 to-blue-600"
        />
        <KPICard
          title="Активные заказы"
          value={activeOrders}
          change={15.3}
          icon={Clock}
          trend="up"
          gradient="from-indigo-500 to-purple-600"
        />
        <KPICard
          title="Выручка"
          value={`${(totalRevenue / 1000000).toFixed(2)}M ₽`}
          change={23.8}
          icon={TrendingUp}
          trend="up"
          gradient="from-green-500 to-emerald-600"
        />
        <KPICard
          title="Товаров в каталоге"
          value={156}
          change={8.2}
          icon={Package}
          trend="up"
          gradient="from-orange-500 to-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={mockAnalytics.revenueByMonth} />
        <OrdersChart data={mockAnalytics.ordersByStatus} />
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <CardTitle className="text-xl font-bold">Последние заказы</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Отслеживайте статус ваших заказов</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hover:bg-white/50">
            <Link href="/orders" className="flex items-center gap-1">
              Все заказы
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Номер заказа</TableHead>
                <TableHead className="font-semibold">Покупатель</TableHead>
                <TableHead className="font-semibold">Поставщик</TableHead>
                <TableHead className="font-semibold">Статус</TableHead>
                <TableHead className="text-right font-semibold">Сумма</TableHead>
                <TableHead className="font-semibold">Создан</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                  onClick={() => window.location.href = `/orders/${order.id}`}
                >
                  <TableCell className="font-mono font-semibold text-blue-600">
                    {order.order_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border-2 border-blue-100">
                        <AvatarImage src={order.buyer_company?.logo} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                          {order.buyer_company?.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{order.buyer_company?.name || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border-2 border-indigo-100">
                        <AvatarImage src={order.supplier_company?.logo} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold">
                          {order.supplier_company?.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{order.supplier_company?.name || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[order.status]} border font-medium`} variant="secondary">
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-green-600">
                      {order.total_amount.toLocaleString('ru-RU')} ₽
                    </span>
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
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний чек</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(totalRevenue / totalOrders / 1000).toFixed(0)}K ₽
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Активных клиентов</p>
                <p className="text-2xl font-bold text-green-600">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Рост за месяц</p>
                <p className="text-2xl font-bold text-orange-600">+23.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
