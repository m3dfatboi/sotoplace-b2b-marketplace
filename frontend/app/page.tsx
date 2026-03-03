'use client';

import { useEffect, useState } from 'react';
import { dashboardApi, ordersApi } from '@/lib/api';
import { DashboardStats, Order, OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          dashboardApi.getStats(),
          ordersApi.getOrders({ size: 5 }),
        ]);
        setStats(statsData);
        setOrders(ordersData.items);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sotoplace</h1>
            <nav className="flex gap-6">
              <a href="/" className="text-blue-600 font-medium">Главная</a>
              <a href="/orders" className="text-gray-600 hover:text-gray-900">Заказы</a>
              <a href="/products" className="text-gray-600 hover:text-gray-900">Каталог</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Главная</h2>
          <p className="mt-2 text-gray-600">Обзор ключевых метрик и активных заказов</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm font-medium text-gray-600 mb-2">Всего заказов</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.total_orders || 0}</div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-600 mb-2">Активные заказы</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.active_orders || 0}</div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-600 mb-2">Выручка</div>
            <div className="text-3xl font-bold text-green-600">
              {((stats?.total_revenue || 0) / 1000000).toFixed(2)}M ₽
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-600 mb-2">Товаров в каталоге</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.total_products || 0}</div>
          </div>
        </div>

        {/* Active Orders Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Последние заказы</h3>
            <a href="/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Все заказы →
            </a>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Заказов пока нет
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Номер</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Покупатель</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Сумма</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.buyer_company?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {order.total_amount.toLocaleString('ru-RU')} ₽
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <button className="btn-primary">
            + Создать заказ
          </button>
          <button className="btn-secondary">
            + Добавить товар
          </button>
        </div>
      </main>
    </div>
  );
}
