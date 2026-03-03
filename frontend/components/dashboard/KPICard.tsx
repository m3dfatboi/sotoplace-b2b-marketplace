'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  gradient?: string;
}

export function KPICard({ title, value, change, icon: Icon, trend, gradient = 'from-blue-500 to-blue-600' }: KPICardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-0">
        <div className={cn('bg-gradient-to-br p-6', gradient)}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80">{title}</p>
              <p className="mt-2 text-3xl font-bold text-white">{value}</p>
              {change !== undefined && (
                <div className="mt-2 flex items-center gap-1">
                  <span className={cn(
                    'text-sm font-semibold',
                    trend === 'up' ? 'text-green-100' : 'text-red-100'
                  )}>
                    {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
                  </span>
                  <span className="text-xs text-white/60">vs прошлый месяц</span>
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <Icon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
