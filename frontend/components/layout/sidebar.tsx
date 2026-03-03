"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Главная", href: "/", icon: LayoutDashboard },
  { name: "Заказы", href: "/orders", icon: ShoppingCart },
  { name: "Каталог", href: "/catalog", icon: Package },
  { name: "Контрагенты", href: "/contractors", icon: Users },
  { name: "Чертежи", href: "/blueprints", icon: FileText },
  { name: "Компания", href: "/company", icon: Building2 },
  { name: "Настройки", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-[var(--z-fixed)] h-screen w-64 border-r border-neutral-200 bg-white shadow-[1px_0_3px_0_rgb(0_0_0_/_0.04)]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-neutral-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 shadow-sm">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-semibold tracking-tight text-neutral-900">Sotoplace</span>
          <p className="text-xs text-neutral-500">B2B Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-fast",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
