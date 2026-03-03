'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus } from '@/types';
import { Search, Filter, Plus, TrendingUp, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { mockOrders } from '@/lib/mock-data';

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

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = search === '' ||
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.buyer_company?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.supplier_company?.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Управление заказами
          </h1>
          <p className="mt-2 text-muted-foreground">
            Отслеживайте статусы и управляйте заказами
          </p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg" asChild>
          <Link href="/orders/new" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Создать заказ
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего заказов</p>
                <p className="text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Общая сумма</p>
                <p className="text-2xl font-bold text-green-600">
                  {(totalRevenue / 1000000).toFixed(2)}M ₽
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Filter className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний чек</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length / 1000).toFixed(0) : 0}K ₽
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру заказа, компании..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] border-gray-200">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-xl font-bold">
            Найдено заказов: {filteredOrders.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-muted-foreground">Заказы не найдены</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Номер</TableHead>
                  <TableHead className="font-semibold">Покупатель</TableHead>
                  <TableHead className="font-semibold">Поставщик</TableHead>
                  <TableHead className="font-semibold">Статус</TableHead>
                  <TableHead className="text-right font-semibold">Сумма</TableHead>
                  <TableHead className="font-semibold">Создан</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-blue-50/50 transition-colors"
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
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50" asChild>
                        <Link href={`/orders/${order.id}`}>
                          Открыть
                        </Link>
                      </Button>
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
