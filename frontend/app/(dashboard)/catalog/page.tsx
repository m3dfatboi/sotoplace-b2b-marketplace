"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  ShoppingCart,
  Heart,
  Eye
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock data
const products = [
  {
    id: "1",
    name: "Металлический верстак",
    category: "Мебель для мастерских",
    price: 45000,
    image: "/placeholder-product.jpg",
    inStock: true,
    sku: "BENCH-001",
  },
  {
    id: "2",
    name: "Офисный стол",
    category: "Офисная мебель",
    price: 25000,
    image: "/placeholder-product.jpg",
    inStock: true,
    sku: "DESK-001",
  },
  {
    id: "3",
    name: "Металлический стеллаж",
    category: "Складское оборудование",
    price: 15000,
    image: "/placeholder-product.jpg",
    inStock: true,
    sku: "SHELF-001",
  },
  {
    id: "4",
    name: "Производственный стол",
    category: "Мебель для мастерских",
    price: 38000,
    image: "/placeholder-product.jpg",
    inStock: false,
    sku: "TABLE-001",
  },
  {
    id: "5",
    name: "Шкаф инструментальный",
    category: "Складское оборудование",
    price: 32000,
    image: "/placeholder-product.jpg",
    inStock: true,
    sku: "CABINET-001",
  },
  {
    id: "6",
    name: "Рабочее место оператора",
    category: "Офисная мебель",
    price: 55000,
    image: "/placeholder-product.jpg",
    inStock: true,
    sku: "WORKSTATION-001",
  },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Каталог</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Товары и услуги на маркетплейсе
          </p>
        </div>
        <Button>
          <ShoppingCart className="h-4 w-4" />
          Корзина (0)
        </Button>
      </div>

      {/* Filters & View Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              <div className="flex h-full items-center justify-center text-neutral-400">
                <Package className="h-16 w-16" />
              </div>
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50">
                  <Badge variant="error">Нет в наличии</Badge>
                </div>
              )}
              <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-2">
                <Badge variant="default" size="sm">
                  {product.category}
                </Badge>
              </div>
              <h3 className="mb-1 font-semibold text-neutral-900">
                {product.name}
              </h3>
              <p className="mb-3 text-xs text-neutral-500">
                Артикул: {product.sku}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-neutral-900">
                  {formatCurrency(product.price)}
                </span>
                {product.inStock && (
                  <Badge variant="success" size="sm">
                    В наличии
                  </Badge>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Button className="w-full" disabled={!product.inStock}>
                <ShoppingCart className="h-4 w-4" />
                В корзину
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Назад
        </Button>
        <Button variant="secondary" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          Вперёд
        </Button>
      </div>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  );
}
