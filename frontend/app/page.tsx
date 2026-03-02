"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  TrendingUp,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-0">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[var(--z-sticky)] glass border-b border-neutral-200">
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-semibold text-neutral-900">
                Sotoplace
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-smooth"
              >
                Возможности
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-smooth"
              >
                Как работает
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-smooth"
              >
                Тарифы
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-smooth px-4 py-2"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-smooth shadow-sm"
              >
                Начать
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:pb-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700">
                Современная B2B платформа
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Упростите закупки
              <br />
              <span className="gradient-text">для вашего бизнеса</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Автоматизируйте процессы закупок, управляйте заказами и контролируйте расходы в одной платформе
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-smooth shadow-md hover:shadow-lg"
              >
                Попробовать бесплатно
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 text-neutral-900 font-medium rounded-xl hover:bg-neutral-200 transition-smooth"
              >
                Узнать больше
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 pt-16 border-t border-neutral-200">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  500+
                </div>
                <div className="text-sm md:text-base text-neutral-600">
                  Компаний
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  50K+
                </div>
                <div className="text-sm md:text-base text-neutral-600">
                  Заказов
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  99.9%
                </div>
                <div className="text-sm md:text-base text-neutral-600">
                  Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-neutral-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Всё для эффективных закупок
            </h2>
            <p className="text-lg text-neutral-600">
              Инструменты для автоматизации и контроля закупочных процессов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Zap,
                title: "Быстрое оформление",
                description: "Создавайте заказы за минуты с автоматическим расчётом стоимости и сроков"
              },
              {
                icon: BarChart3,
                title: "Аналитика в реальном времени",
                description: "Отслеживайте расходы, анализируйте тренды и оптимизируйте закупки"
              },
              {
                icon: Shield,
                title: "Безопасность данных",
                description: "Шифрование, двухфакторная аутентификация и регулярные бэкапы"
              },
              {
                icon: Users,
                title: "Командная работа",
                description: "Гибкие роли и права доступа для эффективной совместной работы"
              },
              {
                icon: TrendingUp,
                title: "Масштабируемость",
                description: "От стартапа до корпорации — платформа растёт вместе с вами"
              },
              {
                icon: Package,
                title: "Управление каталогом",
                description: "Централизованный каталог товаров с поиском и фильтрацией"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-neutral-200 hover:border-brand-300 hover:shadow-md transition-smooth"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Как это работает
            </h2>
            <p className="text-lg text-neutral-600">
              Простой процесс от регистрации до первого заказа
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: "01",
                  title: "Регистрация",
                  description: "Создайте аккаунт за 2 минуты и настройте профиль компании"
                },
                {
                  step: "02",
                  title: "Настройка каталога",
                  description: "Добавьте товары или подключите существующий каталог"
                },
                {
                  step: "03",
                  title: "Начните работу",
                  description: "Создавайте заказы, отслеживайте статусы и анализируйте данные"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-brand-300 to-transparent -translate-x-6" />
                  )}
                  <div className="text-5xl font-bold text-brand-100 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-lg md:text-xl text-brand-100 mb-10">
              Присоединяйтесь к сотням компаний, которые уже оптимизировали свои закупки
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 font-medium rounded-xl hover:bg-neutral-50 transition-smooth shadow-lg"
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700 text-white font-medium rounded-xl hover:bg-brand-800 transition-smooth border border-brand-500"
              >
                Войти в систему
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-neutral-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">
                  Sotoplace
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Современная платформа для B2B закупок
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Возможности
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Тарифы
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Интеграции
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Компания</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    О нас
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Блог
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Контакты
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Документация
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                    Помощь
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-neutral-400 text-sm">
                © 2026 Sotoplace. Все права защищены.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                  Политика конфиденциальности
                </a>
                <a href="#" className="text-neutral-400 hover:text-white text-sm transition-smooth">
                  Условия использования
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
