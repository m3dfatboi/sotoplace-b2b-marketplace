"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Package,
  TrendingUp,
  Eye
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const mockProducts = [
  {
    id: 1,
    name: "Стол офисный ЛДСП",
    sku: "STL-001",
    category: "Столы",
    price: 12500,
    stock: 45,
    image: "https://placehold.co/400x300/f5f5f5/d18043?text=Product",
    status: "active"
  },
  {
    id: 2,
    name: "Кресло руководителя",
    sku: "KRS-002",
    category: "Кресла",
    price: 28900,
    stock: 12,
    image: "https://placehold.co/400x300/f5f5f5/d18043?text=Product",
    status: "active"
  },
  {
    id: 3,
    name: "Шкаф для документов",
    sku: "SHK-003",
    category: "Шкафы",
    price: 15600,
    stock: 8,
    image: "https://placehold.co/400x300/f5f5f5/d18043?text=Product",
    status: "low_stock"
  },
  {
    id: 4,
    name: "Стеллаж металлический",
    sku: "STL-004",
    category: "Стеллажи",
    price: 9800,
    stock: 23,
    image: "https://placehold.co/400x300/f5f5f5/d18043?text=Product",
    status: "active"
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Товары</h1>
          <p className="text-gray-500 mt-1">Управление каталогом товаров</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Добавить товар
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего товаров</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">1,234</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активные</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">1,156</p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Мало на складе</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">78</p>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию, артикулу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4" />
            Фильтры
          </Button>
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-primary-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-primary-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Card
              key={product.id}
              variant="interactive"
              padding="none"
              className="overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.status === "low_stock" && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-warning-500 text-white text-xs font-medium rounded-lg">
                      Мало на складе
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{product.sku}</p>
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    {product.price.toLocaleString("ru-RU")} ₽
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock} шт
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {mockProducts.map((product) => (
            <Card key={product.id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-900">
                        {product.price.toLocaleString("ru-RU")} ₽
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        На складе: {product.stock} шт
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Eye className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
