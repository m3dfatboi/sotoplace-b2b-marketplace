"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface MenuItem {
  icon: string;
  href: string;
  label: string;
  badge?: number;
}

const topMenuItems: MenuItem[] = [
  { icon: "letter", href: "/messages", label: "Сообщения", badge: 5 },
  { icon: "bell", href: "/notifications", label: "Уведомления" },
  { icon: "truck", href: "/shipments", label: "Отгрузки", badge: 20 },
  { icon: "payin", href: "/payments", label: "Платежи", badge: 11 },
];

const bottomMenuItems: MenuItem[] = [
  { icon: "home", href: "/", label: "Главная" },
  { icon: "package", href: "/products", label: "Товары" },
  { icon: "users", href: "/companies", label: "Компании" },
  { icon: "chart", href: "/analytics", label: "Аналитика" },
  { icon: "documents", href: "/documents", label: "Документы" },
  { icon: "chat", href: "/chats", label: "Чаты" },
  { icon: "settings", href: "/settings", label: "Настройки" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed right-0 top-0 h-screen w-[72px] flex flex-col justify-between p-[20px] gap-[20px]">
      {/* Top Menu */}
      <div className="bg-white border border-[#e5e5e5] rounded-[20px] p-[16px] flex flex-col gap-[4px]">
        {/* Logo/Avatar */}
        <div className="w-[40px] h-[40px] rounded-[8px] bg-[#d18043] flex items-center justify-center mb-[4px]">
          <img
            src="https://i.pravatar.cc/80?img=20"
            alt="User"
            className="w-full h-full rounded-[8px] object-cover"
          />
        </div>

        {/* Divider */}
        <div className="h-[14px] flex items-center justify-center py-[9px]">
          <div className="h-[1px] w-full bg-[#e5e5e5] rounded-[10px]" />
        </div>

        {/* Top menu buttons */}
        {topMenuItems.map((item, index) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`relative w-[40px] h-[40px] rounded-[8px] flex items-center justify-center transition-colors ${
                pathname === item.href
                  ? "bg-[#d18043]"
                  : "bg-white hover:bg-[#f5f5f5]"
              }`}
              title={item.label}
            >
              <div className={`w-[16px] h-[16px] ${pathname === item.href ? "text-white" : "text-[#1f1f1f]"}`}>
                {/* Icon placeholder - в реальности здесь будут SVG иконки */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2"/>
                </svg>
              </div>
              {item.badge && (
                <div className="absolute -top-[6px] -right-[6px] min-w-[20px] h-[20px] px-[4px] bg-[#d18043] rounded-[12px] flex items-center justify-center">
                  <span className="text-[12px] font-semibold leading-[14px] text-white">
                    {item.badge}
                  </span>
                </div>
              )}
            </Link>
            {index < topMenuItems.length - 1 && index === 1 && (
              <div className="h-[14px] flex items-center justify-center py-[9px] my-[4px]">
                <div className="h-[1px] w-full bg-[#e5e5e5] rounded-[10px]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Menu */}
      <div className="bg-white border border-[#e5e5e5] rounded-[20px] p-[16px] flex flex-col gap-[4px]">
        {bottomMenuItems.map((item, index) => (
          <div key={item.href}>
            {(index === 3 || index === 5) && (
              <div className="h-[14px] flex items-center justify-center py-[9px] my-[4px]">
                <div className="h-[1px] w-full bg-[#e5e5e5] rounded-[10px]" />
              </div>
            )}
            <Link
              href={item.href}
              className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center transition-colors ${
                pathname === item.href
                  ? "bg-[#d18043]"
                  : "bg-white hover:bg-[#f5f5f5]"
              }`}
              title={item.label}
            >
              <div className={`w-[16px] h-[16px] ${pathname === item.href ? "text-white" : "text-[#1f1f1f]"}`}>
                {/* Icon placeholder */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2"/>
                </svg>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
