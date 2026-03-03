'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  BarChart3,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navigation = [
  { name: 'Дашборд', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
  { name: 'Заказы', href: '/orders', icon: ShoppingCart, color: 'text-indigo-600' },
  { name: 'Каталог', href: '/products', icon: Package, color: 'text-green-600' },
  { name: 'Контрагенты', href: '/contractors', icon: Users, color: 'text-orange-600' },
  { name: 'Чаты', href: '/chat', icon: MessageSquare, color: 'text-purple-600' },
  { name: 'Аналитика', href: '/analytics', icon: BarChart3, color: 'text-pink-600' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-white to-gray-50 shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h1 className="text-2xl font-bold text-white">Sotoplace</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-700 hover:text-blue-600'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : item.color)} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4">
        <div className="mb-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-blue-200">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}&backgroundColor=2563eb`} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {user?.full_name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-600"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
}
