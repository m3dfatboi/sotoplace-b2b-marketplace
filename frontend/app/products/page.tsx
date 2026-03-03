'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = { size: 50 };
        if (publishedFilter === 'published') {
          params.is_published = true;
        } else if (publishedFilter === 'draft') {
          params.is_published = false;
        }
        const data = await productsApi.getProducts(params);
        setProducts(data.items);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [publishedFilter]);

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sotoplace</h1>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Главная</a>
              <a href="/orders" className="text-gray-600 hover:text-gray-900">Заказы</a>
              <a href="/products" className="text-blue-600 font-medium">Каталог</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Каталог товаров</h2>
          <p className="mt-2 text-gray-600">Управление товарами и услугами</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по названию, описанию, категории..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Published Filter */}
            <div className="sm:w-64">
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Все товары</option>
                <option value="published">Опубликованные</option>
                <option value="draft">Черновики</option>
              </select>
            </div>

            {/* Create Button */}
            <button className="btn-primary whitespace-nowrap">
              + Добавить товар
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="text-sm text-gray-600">Всего товаров</div>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Найдено</div>
            <div className="text-2xl font-bold text-blue-600">{filteredProducts.length}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Опубликовано</div>
            <div className="text-2xl font-bold text-green-600">
              {filteredProducts.filter(p => p.is_published).length}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="card">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Загрузка...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery || publishedFilter !== 'all' ? 'Товары не найдены' : 'Товаров пока нет'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {product.name}
                    </h3>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        product.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.is_published ? 'Опубликован' : 'Черновик'}
                    </span>
                  </div>

                  {/* Category */}
                  {product.category && (
                    <div className="mb-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">Цена</div>
                        <div className="text-xl font-bold text-gray-900">
                          {product.base_price.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">
                        Открыть
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
