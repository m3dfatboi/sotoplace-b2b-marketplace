"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import { Order } from "@/types";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { useState } from "react";

interface OrdersTableProps {
  orders: Order[];
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "#f5f5f5", text: "#737373", label: "Черновик" },
  new: { bg: "#f0f8eb", text: "#52962a", label: "Новый" },
  in_progress: { bg: "#f6efd5", text: "#a68a26", label: "В работе" },
  production: { bg: "#f6efd5", text: "#a68a26", label: "Производство" },
  ready: { bg: "#f0f8eb", text: "#52962a", label: "Готов" },
  shipped: { bg: "#f0f8eb", text: "#52962a", label: "Отгружен" },
  delivered: { bg: "#f0f8eb", text: "#52962a", label: "Доставлен" },
  completed: { bg: "#f0f8eb", text: "#52962a", label: "Завершен" },
  cancelled: { bg: "#ffeeee", text: "#b32c2b", label: "Отменен" },
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
    <div className="bg-white rounded-[20px] border border-[#e5e5e5] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[20px] py-[20px] border-b border-[#e5e5e5]">
        <h2 className="text-[16px] font-semibold leading-[20px] text-[#1f1f1f]">
          Счета <span className="text-[#737373] font-normal">134</span>
        </h2>
        <div className="flex items-center gap-[8px]">
          <button className="flex items-center gap-[8px] px-[14px] h-[30px] rounded-[8px] border border-[#d4d4d4] bg-white hover:bg-[#f5f5f5] text-[14px] font-medium leading-[18px] text-[#1f1f1f] transition-colors">
            Фильтры
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5H12M3 7H11M4.5 10.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="flex items-center gap-[8px] px-[14px] h-[30px] rounded-[8px] bg-[#1f1f1f] text-white hover:bg-[#525252] text-[14px] font-medium leading-[18px] transition-colors">
            Новый
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2.625V11.375M11.375 7H2.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[40px_100px_1fr_1fr_150px_120px_100px_120px_40px] gap-[16px] px-[20px] py-[12px] border-b border-[#e5e5e5] text-[12px] font-medium leading-[14px] text-[#737373]">
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
      <div>
        {orders.map((order) => {
          const isExpanded = expandedRows.has(order.id);
          const status = statusConfig[order.status] || statusConfig.draft;

          return (
            <div key={order.id}>
              <div className="grid grid-cols-[40px_100px_1fr_1fr_150px_120px_100px_120px_40px] gap-[16px] px-[20px] py-[16px] hover:bg-[#f5f5f5] transition-colors items-center border-b border-[#e5e5e5]">
                {/* Expand button */}
                <button
                  onClick={() => toggleRow(order.id)}
                  className="w-[24px] h-[24px] flex items-center justify-center hover:bg-[#e5e5e5] rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-[16px] h-[16px] text-[#737373]" />
                  ) : (
                    <ChevronRight className="w-[16px] h-[16px] text-[#737373]" />
                  )}
                </button>

                {/* Order number with colored stripe */}
                <div className="flex items-center gap-[8px]">
                  <div className="w-[2px] h-[24px] bg-[#d18043] rounded-full" />
                  <span className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">
                    {order.order_number}
                  </span>
                </div>

                {/* Supplier */}
                <div className="text-[14px] leading-[18px] text-[#1f1f1f] truncate">
                  {order.company_name}
                </div>

                {/* Buyer with date */}
                <div className="min-w-0">
                  <div className="text-[14px] font-medium leading-[18px] text-[#1f1f1f] truncate">
                    {order.buyer_company_name}
                  </div>
                  <div className="text-[12px] leading-[14px] text-[#737373] mt-[2px]">
                    {formatDate(order.created_at)}
                  </div>
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className="inline-flex items-center px-[8px] py-[4px] rounded-[6px] text-[12px] font-medium leading-[14px]"
                    style={{
                      backgroundColor: status.bg,
                      color: status.text,
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Deadline */}
                <div className="text-[14px] leading-[18px] text-[#1f1f1f]">
                  {order.deadline ? formatDate(order.deadline) : "-"}
                </div>

                {/* Items count */}
                <div className="text-[14px] leading-[18px] text-[#737373]">
                  {order.items_count} шт
                </div>

                {/* Amount */}
                <div className="text-[14px] font-semibold leading-[18px] text-right text-[#1f1f1f]">
                  {formatCurrency(order.total_amount)}
                </div>

                {/* Actions */}
                <button className="w-[24px] h-[24px] flex items-center justify-center hover:bg-[#e5e5e5] rounded transition-colors">
                  <MoreVertical className="w-[16px] h-[16px] text-[#737373]" />
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-[20px] py-[16px] bg-[#f5f5f5] border-b border-[#e5e5e5]">
                  <div className="text-[14px] leading-[18px] text-[#737373]">
                    Детали заказа #{order.order_number}
                  </div>
                  {/* Здесь можно добавить детальную информацию */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
