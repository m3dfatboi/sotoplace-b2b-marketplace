"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

interface MenuItem {
  icon: keyof typeof Icons;
  href: string;
  label: string;
  badge?: number;
}

const topMenuItems: MenuItem[] = [
  { icon: "Letter", href: "/messages", label: "Сообщения", badge: 5 },
  { icon: "Bell", href: "/notifications", label: "Уведомления" },
  { icon: "Truck", href: "/shipments", label: "Отгрузки", badge: 20 },
  { icon: "Payin", href: "/payments", label: "Платежи", badge: 11 },
];

const bottomMenuItems: MenuItem[] = [
  { icon: "Home", href: "/", label: "Главная" },
  { icon: "Package", href: "/products", label: "Товары" },
  { icon: "Users", href: "/companies", label: "Компании" },
  { icon: "Chart", href: "/analytics", label: "Аналитика" },
  { icon: "Documents", href: "/documents", label: "Документы" },
  { icon: "Chat", href: "/chats", label: "Чаты" },
  { icon: "Settings", href: "/settings", label: "Настройки" },
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
        {topMenuItems.map((item, index) => {
          const Icon = Icons[item.icon];
          const isActive = pathname === item.href;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`relative w-[40px] h-[40px] rounded-[8px] flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[#d18043] text-white"
                    : "bg-white hover:bg-[#f5f5f5] text-[#1f1f1f]"
                }`}
                title={item.label}
              >
                <Icon />
                {item.badge && (
                  <div className="absolute -top-[6px] -right-[6px] min-w-[20px] h-[20px] px-[4px] bg-[#d18043] rounded-[12px] flex items-center justify-center">
                    <span className="text-[12px] font-semibold leading-[14px] text-white">
                      {item.badge}
                    </span>
                  </div>
                )}
              </Link>
              {index === 1 && (
                <div className="h-[14px] flex items-center justify-center py-[9px] my-[4px]">
                  <div className="h-[1px] w-full bg-[#e5e5e5] rounded-[10px]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Menu */}
      <div className="bg-white border border-[#e5e5e5] rounded-[20px] p-[16px] flex flex-col gap-[4px]">
        {bottomMenuItems.map((item, index) => {
          const Icon = Icons[item.icon];
          const isActive = pathname === item.href;

          return (
            <div key={item.href}>
              {(index === 3 || index === 5) && (
                <div className="h-[14px] flex items-center justify-center py-[9px] my-[4px]">
                  <div className="h-[1px] w-full bg-[#e5e5e5] rounded-[10px]" />
                </div>
              )}
              <Link
                href={item.href}
                className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[#d18043] text-white"
                    : "bg-white hover:bg-[#f5f5f5] text-[#1f1f1f]"
                }`}
                title={item.label}
              >
                <Icon />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
