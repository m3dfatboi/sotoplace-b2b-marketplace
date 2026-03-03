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
    <aside className="fixed left-0 top-0 z-[var(--z-fixed)] h-screen w-64 border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
          <Package className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-neutral-900">Sotoplace</span>
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
