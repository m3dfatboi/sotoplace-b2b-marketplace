# Sotoplace Frontend

Современный B2B маркетплейс для производителей и покупателей мебели.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Структура проекта

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout с sidebar
│   ├── page.tsx             # Главная страница (Dashboard)
│   └── globals.css          # Глобальные стили + дизайн-система
├── components/
│   ├── ui/                  # Базовые UI компоненты
│   │   ├── button.tsx       # Кнопки (6 вариантов)
│   │   └── card.tsx         # Карточки
│   ├── layout/
│   │   └── sidebar.tsx      # Боковое меню навигации
│   ├── dashboard/           # Компоненты дашборда
│   │   ├── active-orders-widget.tsx    # Виджет активных заказов
│   │   ├── reminders-widget.tsx        # Виджет напоминаний
│   │   ├── sales-widget.tsx            # Виджет продаж
│   │   ├── load-widget.tsx             # Виджет нагрузки
│   │   ├── top-products-widget.tsx     # Виджет топ товаров
│   │   └── orders-table.tsx            # Таблица заказов
│   └── providers.tsx        # React Query Provider
├── hooks/
│   ├── useDashboard.ts      # Hook для статистики дашборда
│   └── useOrders.ts         # Hook для работы с заказами
├── lib/
│   ├── api.ts               # Axios instance с interceptors
│   └── utils.ts             # Утилиты (cn, formatCurrency, formatDate)
├── store/
│   └── auth.ts              # Zustand store для аутентификации
└── types/
    └── index.ts             # TypeScript типы
```

## Дизайн-система (из Figma)

### Цвета
- **Primary:** #d18043 (Furnita Orange)
- **Black:** #1f1f1f
- **White:** #ffffff
- **Gray Scale:** #f5f5f5, #e5e5e5, #d4d4d4, #a3a3a3, #737373, #525252
- **Success:** #67bb34
- **Error:** #e03636
- **Process:** #d0ad2f

### Типографика
- **Font:** Inter
- **Sizes:** 10px, 12px, 14px, 16px, 24px, 36px
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semi Bold)

## Запуск проекта

### Development
```bash
npm run dev
```
Откроется на http://localhost:3000

### Build
```bash
npm run build
npm start
```

## Переменные окружения

Создайте файл `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Реализованные фичи

### Dashboard (Главная страница)
- ✅ 5 виджетов статистики:
  - Активные заказы (круговая диаграмма)
  - Напоминания (чеклист)
  - Продажи за неделю (график)
  - Нагрузка складов (прогресс-бары)
  - Топ лидеров (список)
- ✅ Таблица заказов с:
  - Фильтрацией
  - Сортировкой
  - Раскрывающимися строками
  - Статусами заказов
  - Аватарами команды
  - Суммами

### Навигация
- ✅ Боковое меню (72px)
- ✅ Иконки для всех разделов
- ✅ Активное состояние

### UI Components
- ✅ Button (6 вариантов: default, secondary, outline, ghost, success, error)
- ✅ Card (с header, title, description, content)
- ✅ Responsive layout

## API Integration

Все компоненты готовы к интеграции с backend API:
- `/api/v1/orders` - список заказов
- `/api/v1/dashboard/stats` - статистика (пока mock data)

## Следующие шаги

1. **Страницы:**
   - [ ] Страница заказов (/orders)
   - [ ] Страница товаров (/products)
   - [ ] Страница компаний (/companies)
   - [ ] Страница чертежей (/blueprints)
   - [ ] Страница чатов (/chats)
   - [ ] Страница уведомлений (/notifications)

2. **Аутентификация:**
   - [ ] Страница логина
   - [ ] Страница регистрации
   - [ ] Protected routes

3. **Функционал:**
   - [ ] Создание/редактирование заказов
   - [ ] Загрузка файлов
   - [ ] Real-time чаты (WebSocket)
   - [ ] Push уведомления

---

**Статус:** Dashboard готов ✅
**Дата:** 2026-03-02
