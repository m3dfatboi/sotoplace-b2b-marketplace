"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed left-64 right-0 top-0 z-[var(--z-sticky)] h-16 border-b border-neutral-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Поиск по системе..."
              className="h-10 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 text-sm transition-fast placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
