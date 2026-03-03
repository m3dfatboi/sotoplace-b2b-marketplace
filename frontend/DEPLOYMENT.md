# Sotoplace Frontend - Руководство по развертыванию

## Быстрый старт

### 1. Установка зависимостей

```bash
cd frontend
npm install
```

### 2. Настройка окружения

Создайте `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Запуск dev сервера

```bash
npm run dev
```

Откройте http://localhost:3000

### 4. Тестовые учетные данные

Используйте существующие аккаунты из backend:

```
Admin:   admin@sotoplace.com / admin123
Manager: manager@sotoplace.com / manager123
Client:  client@sotoplace.com / client123
```

Или создайте новый через страницу регистрации.

## Структура проекта

```
frontend/
├── app/                    # Next.js App Router
│   ├── auth/              # Авторизация (login, register)
│   ├── dashboard/         # Главная страница с KPI
│   ├── orders/            # Управление заказами
│   ├── products/          # Каталог товаров
│   ├── contractors/       # Контрагенты (в разработке)
│   ├── chat/              # Чаты (в разработке)
│   ├── analytics/         # Аналитика (в разработке)
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница (редирект)
│   └── globals.css        # Глобальные стили
├── components/
│   ├── ui/                # shadcn/ui компоненты
│   ├── layout/            # Sidebar, Header
│   └── dashboard/         # KPICard
├── lib/
│   ├── api/               # API клиенты (auth, orders, products, companies)
│   ├── hooks/             # React hooks (useAuth, useOrders, useProducts)
│   ├── stores/            # Zustand stores (authStore)
│   ├── providers.tsx      # React Query Provider
│   └── utils.ts           # Утилиты (cn)
└── types/
    └── index.ts           # TypeScript типы
```

## Основные функции

### ✅ Реализовано

1. **Авторизация**
   - Вход и регистрация
   - JWT токены с автоматическим refresh
   - Защищенные маршруты
   - Zustand store для состояния

2. **Дашборд**
   - 4 KPI карточки (заказы, выручка, товары)
   - Таблица последних заказов
   - Навигация по разделам

3. **Заказы**
   - Список всех заказов с пагинацией
   - Фильтрация по статусу
   - Поиск по номеру/компании
   - Цветовая индикация статусов
   - Форматирование дат (date-fns)

4. **Каталог товаров**
   - Grid/List режимы просмотра
   - Поиск товаров
   - Фильтрация (опубликованные/черновики)
   - Карточки товаров с ценами

5. **Layout**
   - Боковое меню с навигацией
   - Header с поиском и уведомлениями
   - Адаптивный дизайн

### 🚧 В разработке

- Детальные страницы заказов
- Создание/редактирование заказов и товаров
- Раздел контрагентов
- Real-time чаты (WebSocket)
- Аналитика и графики
- Загрузка файлов

## Дизайн-система

### Цветовая палитра

```css
Primary:    #1E40AF (blue-800)   - основной цвет
Secondary:  #3B82F6 (blue-500)   - вторичный
Accent:     #F59E0B (amber-500)  - CTA кнопки
Background: #F8FAFC (slate-50)   - фон
Text:       #1E3A8A (blue-900)   - текст
```

### Типографика

- **Заголовки**: Fira Code (моноширинный, технический)
- **Основной текст**: Fira Sans (читаемый, профессиональный)

### Компоненты

Используется shadcn/ui:
- Button, Card, Table, Input
- Dialog, Badge, Tabs, Avatar
- Select, Separator, Skeleton
- Sonner (toast уведомления)

## API интеграция

### Axios клиент

Все запросы проходят через `lib/api/client.ts`:

```typescript
// Автоматически добавляет JWT токен
// Обрабатывает 401 ошибки (редирект на login)
// Типизированные запросы
```

### React Query

Кеширование и управление серверным состоянием:

```typescript
const { data, isLoading } = useOrders({ status: 'approved' });
const { mutateAsync: createOrder } = useCreateOrder();
```

### Примеры использования

```typescript
// Авторизация
const { login, logout, user, isAuthenticated } = useAuth();
await login({ email, password });

// Заказы
const { data: orders } = useOrders({ search: 'ORD-001' });
const { mutateAsync: updateOrder } = useUpdateOrder();

// Товары
const { data: products } = useProducts({ is_published: true });
```

## Команды

```bash
# Разработка
npm run dev          # Запуск dev сервера (http://localhost:3000)

# Production
npm run build        # Сборка для production
npm start            # Запуск production сервера

# Утилиты
npm run lint         # ESLint проверка
```

## Добавление новых компонентов

### shadcn/ui компонент

```bash
npx shadcn@latest add [component-name]
```

### Новая страница

1. Создайте `app/[page]/page.tsx`
2. Создайте `app/[page]/layout.tsx`
3. Добавьте маршрут в `components/layout/Sidebar.tsx`

### Новый API endpoint

1. Добавьте функции в `lib/api/[module].ts`
2. Создайте hook в `lib/hooks/use[Module].ts`
3. Используйте в компонентах

## Troubleshooting

### Ошибка 401 при запросах

Проверьте:
1. Backend запущен на `http://localhost:8000`
2. Токен сохранен в localStorage
3. CORS настроен в backend

### Ошибки TypeScript

```bash
npm run build  # Проверка типов
```

### Проблемы с зависимостями

```bash
rm -rf node_modules package-lock.json
npm install
```

## Production deployment

### Vercel (рекомендуется)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment variables

Production `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.sotoplace.com/api/v1
```

## Лучшие практики

1. **Используйте TypeScript типы везде**
2. **Обрабатывайте loading и error состояния**
3. **Используйте React Query для кеширования**
4. **Следуйте дизайн-системе**
5. **Валидируйте формы на клиенте и сервере**
6. **Используйте `'use client'` только когда необходимо**

## Roadmap

### Фаза 1 (текущая)
- ✅ Базовая структура
- ✅ Авторизация
- ✅ Дашборд
- ✅ Список заказов
- ✅ Каталог товаров

### Фаза 2
- [ ] Детальные страницы
- [ ] CRUD операции
- [ ] Загрузка файлов
- [ ] Уведомления

### Фаза 3
- [ ] Real-time чаты
- [ ] Аналитика
- [ ] Контрагенты
- [ ] Графики

### Фаза 4
- [ ] Mobile app
- [ ] PWA
- [ ] Offline mode
- [ ] Push notifications

## Поддержка

Для вопросов и предложений создавайте issues в репозитории.

---

**Версия**: 1.0.0
**Дата**: 2026-03-03
**Статус**: Production Ready (базовая версия)
