"use client";

import { Home, Package, ShoppingCart, Users, FileText, MessageSquare, Bell, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { icon: Home, href: "/", label: "Главная" },
  { icon: ShoppingCart, href: "/orders", label: "Заказы" },
  { icon: Package, href: "/products", label: "Товары" },
  { divider: true },
  { icon: Users, href: "/companies", label: "Компании" },
  { icon: FileText, href: "/blueprints", label: "Чертежи" },
  { divider: true },
  { icon: MessageSquare, href: "/chats", label: "Чаты" },
  { divider: true },
  { icon: Bell, href: "/notifications", label: "Уведомления" },
];

const bottomItems = [
  { icon: Settings, href: "/settings", label: "Настройки" },
  { divider: true },
  { icon: LogOut, href: "/logout", label: "Выход" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed right-0 top-0 h-screen w-[72px] bg-white border-l border-[#e5e5e5] flex flex-col">
      {/* Logo */}
      <div className="h-[72px] flex items-center justify-center border-b border-[#e5e5e5]">
        <div className="w-10 h-10 rounded-lg bg-[#d18043] flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      </div>

      {/* Top Menu */}
      <div className="flex-1 py-4">
        <nav className="flex flex-col items-center gap-1">
          {menuItems.map((item, index) => {
            if (item.divider) {
              return (
                <div key={`divider-${index}`} className="w-10 h-px bg-[#e5e5e5] my-2" />
              );
            }

            const Icon = item.icon!;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[#d18043] text-white"
                    : "text-[#737373] hover:bg-[#f5f5f5]"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="py-4 border-t border-[#e5e5e5]">
        <nav className="flex flex-col items-center gap-1">
          {bottomItems.map((item, index) => {
            if (item.divider) {
              return (
                <div key={`divider-bottom-${index}`} className="w-10 h-px bg-[#e5e5e5] my-2" />
              );
            }

            const Icon = item.icon!;

            return (
              <Link
                key={item.href}
                href={item.href!}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#737373] hover:bg-[#f5f5f5] transition-colors"
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
