'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params: any = { size: 50 };
        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }
        const data = await ordersApi.getOrders(params);
        setOrders(data.items);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.buyer_company?.name.toLowerCase().includes(query) ||
      order.supplier_company?.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sotoplace</h1>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Главная</a>
              <a href="/orders" className="text-blue-600 font-medium">Заказы</a>
              <a href="/products" className="text-gray-600 hover:text-gray-900">Каталог</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Заказы</h2>
          <p className="mt-2 text-gray-600">Управление всеми заказами</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по номеру, компании..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <button className="btn-primary whitespace-nowrap">
              + Создать заказ
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="text-sm text-gray-600">Всего заказов</div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Найдено</div>
            <div className="text-2xl font-bold text-blue-600">{filteredOrders.length}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Общая сумма</div>
            <div className="text-2xl font-bold text-green-600">
              {(filteredOrders.reduce((sum, o) => sum + o.total_amount, 0) / 1000000).toFixed(2)}M ₽
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery || statusFilter !== 'all' ? 'Заказы не найдены' : 'Заказов пока нет'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Номер</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Покупатель</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Поставщик</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Статус</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Сумма</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Создан</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Обновлен</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <td className="py-3 px-4 font-mono text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.buyer_company?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.supplier_company?.name || 'N/A'}
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
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDistanceToNow(new Date(order.updated_at), {
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
      </main>
    </div>
  );
}
