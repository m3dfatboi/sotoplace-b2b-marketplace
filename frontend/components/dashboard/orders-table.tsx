"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { mockUsers } from "@/lib/mock-data";
import { Order } from "@/types";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface OrdersTableProps {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  draft: "bg-[#f5f5f5] text-[#737373]",
  new: "bg-[#f0f8eb] text-[#52962a]",
  in_progress: "bg-[#f6efd5] text-[#a68a26]",
  production: "bg-[#f6efd5] text-[#a68a26]",
  ready: "bg-[#f0f8eb] text-[#52962a]",
  shipped: "bg-[#f0f8eb] text-[#52962a]",
  delivered: "bg-[#f0f8eb] text-[#52962a]",
  completed: "bg-[#f0f8eb] text-[#52962a]",
  cancelled: "bg-[#ffeeee] text-[#b32c2b]",
};

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  new: "Новый",
  in_progress: "В работе",
  production: "Производство",
  ready: "Готов",
  shipped: "Отгружен",
  delivered: "Доставлен",
  completed: "Завершен",
  cancelled: "Отменен",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (orderId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
        <h2 className="text-base font-semibold text-[#1f1f1f]">
          Счета <span className="text-[#737373] font-normal">134</span>
        </h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 h-[30px] rounded-lg border border-[#d4d4d4] bg-white hover:bg-[#f5f5f5] text-sm">
            Фильтры
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 3H10M3 6H9M4 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="flex items-center gap-2 px-3 h-[30px] rounded-lg bg-[#d18043] text-white hover:bg-[#a76636] text-sm">
            Новый
            <span className="text-lg leading-none">+</span>
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[40px_80px_200px_200px_150px_120px_120px_100px_40px] gap-4 px-5 py-3 border-b border-[#e5e5e5] text-xs text-[#737373]">
        <div></div>
        <div>Номер</div>
        <div>Поставщик</div>
        <div>Покупатель</div>
        <div>Статус</div>
        <div>Дедлайн</div>
        <div>Позиций</div>
        <div className="text-right">Сумма (₽)</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#e5e5e5]">
        {orders.map((order) => {
          const isExpanded = expandedRows.has(order.id);
          return (
            <div key={order.id}>
              <div className="grid grid-cols-[40px_80px_200px_200px_150px_120px_120px_100px_40px] gap-4 px-5 py-4 hover:bg-[#f5f5f5] transition-colors items-center">
                {/* Expand button */}
                <button
                  onClick={() => toggleRow(order.id)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e5e5] rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#737373]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#737373]" />
                  )}
                </button>

                {/* Order number */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-[#d18043] rounded-full" />
                  <span className="text-sm font-medium text-[#1f1f1f]">
                    {order.order_number}
                  </span>
                </div>

                {/* Supplier */}
                <div className="text-sm text-[#1f1f1f]">
                  {order.company_name}
                </div>

                {/* Buyer */}
                <div>
                  <div className="text-sm text-[#1f1f1f] font-medium">
                    {order.buyer_company_name}
                  </div>
                  <div className="text-xs text-[#737373]">
                    {formatDate(order.created_at)}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                {/* Deadline */}
                <div className="text-sm text-[#1f1f1f]">
                  {order.deadline ? formatDate(order.deadline) : "-"}
                </div>

                {/* Items count */}
                <div className="text-sm text-[#737373]">
                  {order.items_count} шт
                </div>

                {/* Amount */}
                <div className="text-sm font-semibold text-right text-[#1f1f1f]">
                  {formatCurrency(order.total_amount)}
                </div>

                {/* Actions */}
                <button className="w-6 h-6 flex items-center justify-center hover:bg-[#e5e5e5] rounded">
                  <MoreVertical className="w-4 h-4 text-[#737373]" />
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 py-3 bg-[#f5f5f5] border-t border-[#e5e5e5]">
                  <div className="text-sm text-[#737373]">
                    Детали заказа #{order.order_number}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
