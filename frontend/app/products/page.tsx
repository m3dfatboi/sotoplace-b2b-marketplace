'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/lib/hooks/useProducts';
import { Search, Grid3x3, List, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  const { data: productsData, isLoading } = useProducts({
    search: search || undefined,
    is_published: publishedFilter === 'all' ? undefined : publishedFilter === 'published',
    size: 50,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Каталог товаров</h1>
          <p className="text-muted-foreground">
            Управление товарами и услугами
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Добавить товар
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все товары</SelectItem>
                <SelectItem value="published">Опубликованные</SelectItem>
                <SelectItem value="draft">Черновики</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1 rounded-lg border p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="cursor-pointer"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="cursor-pointer"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div>
        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={viewMode === 'grid' ? 'h-64' : 'h-32'} />
            ))}
          </div>
        ) : productsData?.items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Товары не найдены</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productsData?.items.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant={product.is_published ? 'default' : 'secondary'}>
                      {product.is_published ? 'Опубликован' : 'Черновик'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description || 'Нет описания'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {product.base_price.toLocaleString('ru-RU')} ₽
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/products/${product.id}`}>
                        Открыть
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {productsData?.items.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-muted" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <Badge variant={product.is_published ? 'default' : 'secondary'}>
                          {product.is_published ? 'Опубликован' : 'Черновик'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description || 'Нет описания'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">
                          {product.base_price.toLocaleString('ru-RU')} ₽
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/products/${product.id}`}>
                            Открыть
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
