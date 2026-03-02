# Новый дизайн Sotoplace

## Обзор

Полностью переработанный дизайн B2B маркетплейса с современным, минималистичным и профессиональным UI.

## Дизайн-система

### Цветовая палитра

**Brand (Primary)**
- `brand-600`: #2563eb - Основной цвет бренда
- `brand-500`: #3b82f6 - Hover состояния
- `brand-50`: #eff6ff - Фоны и акценты

**Neutrals**
- `neutral-900`: #171717 - Основной текст
- `neutral-600`: #525252 - Вторичный текст
- `neutral-200`: #e5e5e5 - Границы
- `neutral-50`: #fafafa - Фоны

**Semantic**
- Success: #22c55e
- Error: #ef4444
- Warning: #f59e0b
- Info: #06b6d4

### Типографика

- **Font Family**: Inter (с поддержкой кириллицы)
- **Fluid Typography**: Адаптивные размеры от 360px до 1440px
- **Line Heights**: 1.25 (tight) → 1.5 (normal) → 2 (loose)

### Spacing

8pt grid система:
- Base unit: 8px
- Spacing scale: 2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Border Radius

- `sm`: 6px - Мелкие элементы
- `base`: 8px - Стандартные элементы
- `lg`: 16px - Карточки
- `xl`: 24px - Крупные блоки

### Shadows

От `shadow-xs` до `shadow-xl` для создания глубины и иерархии.

### Transitions

- Fast: 150ms - Hover эффекты
- Base: 200ms - Стандартные переходы
- Slow: 300ms - Сложные анимации

## Структура страниц

### 1. Главная страница (Landing) - `/`

**Секции:**
- Hero с градиентным заголовком и CTA
- Статистика (500+ компаний, 50K+ заказов)
- Features (6 карточек возможностей)
- How It Works (3-шаговый процесс)
- CTA секция с градиентным фоном
- Footer с навигацией

**Особенности:**
- Sticky navigation с glass эффектом
- Плавные переходы и hover состояния
- Адаптивная типографика
- Mobile-first подход

### 2. Страница входа - `/login`

**Элементы:**
- Логотип и брендинг
- Email + Password поля
- "Запомнить меня" checkbox
- Ссылка "Забыли пароль?"
- Переход на регистрацию
- Юридические ссылки

**UX:**
- Иконки в полях ввода
- Валидация форм
- Loading состояния
- Error states с AlertCircle

### 3. Страница регистрации - `/register`

**Поля:**
- Полное имя
- Email
- Телефон (опционально)
- Пароль + подтверждение
- Согласие с условиями

**Валидация:**
- Минимум 8 символов для пароля
- Совпадение паролей
- Обязательные поля

### 4. Dashboard - `/dashboard`

Использует отдельный layout с:
- Sidebar навигация
- Header с поиском и профилем
- Основной контент с виджетами

## Компоненты UI

### Button

```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Текст кнопки
</Button>
```

**Варианты:**
- primary, secondary, outline, ghost, danger, success

**Размеры:**
- sm (36px), md (40px), lg (48px), xl (56px), icon (40x40px)

### Input

```tsx
<Input
  type="email"
  placeholder="your@email.com"
  error={false}
/>
```

**Особенности:**
- Focus states с ring
- Error states
- Disabled states
- Иконки через relative positioning

### Badge

```tsx
<Badge variant="success" size="md">
  Активен
</Badge>
```

**Варианты:**
- default, primary, success, error, warning, info

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
    <CardDescription>Описание</CardDescription>
  </CardHeader>
  <CardContent>Контент</CardContent>
  <CardFooter>Футер</CardFooter>
</Card>
```

## Адаптивность

### Breakpoints

- Mobile: 360px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large: 1440px+

### Mobile-First подход

Все компоненты разработаны с учетом мобильных устройств:
- Стековая навигация на мобильных
- Адаптивные отступы (16px → 24px → 32px)
- Fluid typography
- Touch-friendly элементы (минимум 44x44px)

## Доступность (A11y)

### Реализовано:

✅ **Keyboard Navigation**
- Focus-visible states для всех интерактивных элементов
- Tab order соответствует визуальному порядку

✅ **Color Contrast**
- Все цветовые комбинации соответствуют WCAG AA
- Минимальный контраст 4.5:1 для текста

✅ **Focus States**
- 2px outline с brand-500 цветом
- 2px offset для видимости

✅ **Form Labels**
- Все поля имеют связанные labels
- Placeholder не заменяет label

✅ **Error States**
- Визуальные индикаторы (цвет + иконка)
- Текстовые сообщения об ошибках

✅ **Semantic HTML**
- Правильные теги (header, nav, main, footer)
- Heading hierarchy (h1 → h2 → h3)

## Производительность

### Оптимизации:

- **CSS Variables** для быстрого переключения тем
- **Tailwind JIT** для минимального размера CSS
- **Fluid Typography** вместо множества media queries
- **Transition-smooth** класс для консистентных анимаций
- **Lazy Loading** для изображений (когда будут добавлены)

## Следующие шаги

### Рекомендации для дальнейшей разработки:

1. **Темная тема**
   - Добавить CSS variables для dark mode
   - Реализовать переключатель темы

2. **Анимации**
   - Добавить Framer Motion для сложных анимаций
   - Scroll-triggered animations для landing page

3. **Изображения**
   - Добавить hero изображение/иллюстрацию
   - Feature иконки/иллюстрации
   - Оптимизировать через Next.js Image

4. **Интернационализация**
   - Подготовить для i18n (уже используется русский)
   - Структура готова для добавления переводов

5. **Тестирование**
   - Unit тесты для компонентов
   - E2E тесты для критических путей
   - Accessibility тесты с axe-core

## Технологии

- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first CSS
- **TypeScript** - Type safety
- **Lucide React** - Иконки
- **CVA** - Component variants
- **clsx + tailwind-merge** - Conditional classes

## Файловая структура

```
frontend/
├── app/
│   ├── (dashboard)/          # Dashboard route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── globals.css           # Design system tokens
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── layout/               # Layout components
│   └── dashboard/            # Dashboard widgets
└── lib/
    └── utils.ts              # Utility functions
```

---

**Дата создания:** 2026-03-02
**Версия:** 1.0.0
