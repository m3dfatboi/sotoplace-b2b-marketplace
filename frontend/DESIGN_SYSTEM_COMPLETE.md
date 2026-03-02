# Sotoplace Design System - Полная спецификация

## Анализ дизайна из Figma

### 1. Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  [Widgets Row - 4 виджета по 434px/260px]              │
│  Gap: 20px между виджетами                              │
├─────────────────────────────────────────────────────────┤
│  [Table - Счета]                                        │
│  - Header с фильтрами                                   │
│  - Expandable rows                                      │
│  - Status badges                                        │
│  - Avatars                                              │
└─────────────────────────────────────────────────────────┘
                                                    [Menu]
                                                    72px
```

### 2. Точные размеры из Figma

#### Виджеты
- **Ширина**: 434px (большие), 260px (маленькие)
- **Высота**: 236px (фиксированная)
- **Border-radius**: 20px
- **Border**: 1px solid #e5e5e5
- **Padding**: 20px
- **Gap между виджетами**: 20px

#### Таблица
- **Border-radius**: 20px
- **Border**: 1px solid #e5e5e5
- **Header padding**: 20px
- **Row height**: ~60px
- **Cell padding**: 16px

#### Меню (Sidebar)
- **Ширина**: 72px
- **Padding**: 16px
- **Button size**: 40x40px
- **Border-radius**: 8px (кнопки), 20px (контейнеры)
- **Gap**: 4px между кнопками

### 3. Типографика (точные значения)

```typescript
// Заголовки
H4: {
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: '28px',
  fontFamily: 'Inter'
}

// Текст в виджетах
Subtitle5: {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '18px'
}

Subtitle4: {
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '18px'
}

// Вспомогательный текст
Caption2: {
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '14px'
}

Caption3: {
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '14px'
}

// Мелкий текст (метки в графиках)
Caption4: {
  fontSize: '10px',
  fontWeight: 500,
  lineHeight: '12px'
}
```

### 4. Цвета (точные hex)

```css
/* Основные */
--black: #1f1f1f
--white: #ffffff
--furnita: #d18043
--furnita-600: #a76636

/* Серые */
--gray-100: #f5f5f5  /* Фон страницы */
--gray-200: #e5e5e5  /* Границы */
--gray-300: #d4d4d4  /* Разделители */
--gray-400: #a3a3a3  /* Вспомогательный текст */
--gray-500: #737373  /* Неактивный текст */
--gray-600: #525252  /* Темный вспомогательный */

/* Статусы */
--success-50: #f0f8eb
--success-600: #52962a
--success: #67bb34

--error-50: #ffeeee
--error-600: #b32c2b
--error: #e03636

--process-100: #f6efd5
--process-600: #a68a26
--process: #d0ad2f
```

### 5. Spacing System (4px grid)

```
2px  - минимальный gap в графиках
4px  - gap между кнопками в меню
6px  - gap между заголовком и подзаголовком
8px  - gap между иконкой и текстом
10px - gap в списках
16px - padding в меню, gap между секциями
20px - padding карточек, gap между виджетами
```

### 6. Компоненты - Точные спецификации

#### Sales Widget (Продажи)
```
- Высота графика: 123px
- Ширина столбца: 6px (НЕ толстые!)
- Gap между столбцами: ~7px (13.38px точно)
- Border-radius столбцов: 25px (верх и низ)
- Фон столбца: #1f1f1f opacity 15%
- Активный столбец: #d18043
- Количество столбцов: 17
```

#### Active Orders Widget (Активные счета)
```
- Donut chart: 159x159px
- Stroke width: 20px
- Radius: 65px
- Цвета сегментов (НЕ выцветшие!):
  - Новые: #e5e5e5 (светло-серый)
  - Проектирование: #f6efd5 (светло-желтый)
  - Производство: rgba(103,187,52,0.1) (светло-зеленый)
  - На паузе: #ffeeee (светло-красный)
- Иконки: 14x14px в контейнерах 30x30px
```

#### Load Widget (Нагрузка)
```
- Высота бара: 24px
- Border: 1px solid #d4d4d4
- Border-radius: 6px
- Padding: 4px
- Количество сегментов: 31
- Gap между сегментами: 2px
- Сегмент border-radius: 2px
- Цвета:
  - Склад 1 (90%): #b32c2b (красный)
  - Склад 2 (65%): #a68a26 (желтый)
  - Отгрузка (26%): #52962a (зеленый)
  - Неактивный: #d4d4d4
```

#### Reminders Widget (Напоминания)
```
- Чекбокс: 20x20px круглый
- Border: 1px solid #d4d4d4
- Активный: bg #1f1f1f, внутри белая точка 7x7px
- Аватар: 20x20px, border-radius 4px
- Кнопки внизу: absolute position
  - Bottom: 19px
  - Left/Right: 19px
  - Height: 30px
  - Padding: 14px
```

#### Leaders Widget (Лидеры)
```
- Ранг: 10px ширина, text-align center
- Аватар: 20x20px, border-radius 6px
- Gap между элементами: 6px
- Разделитель: 1px #e5e5e5
- Счетчик: цвет #d18043 (furnita)
```

### 7. Table (Таблица счетов)

#### Header
```
- Height: ~60px
- Padding: 20px
- Border-bottom: 1px solid #e5e5e5
- Title: 16px/600
- Count: 16px/400 #737373
- Buttons: 30px height, 8px border-radius
```

#### Table Header Row
```
- Height: ~40px
- Padding: 12px 20px
- Background: transparent
- Text: 12px/500 #737373
- Border-bottom: 1px solid #e5e5e5
```

#### Table Row
```
- Height: ~60px
- Padding: 16px 20px
- Border-bottom: 1px solid #e5e5e5
- Hover: background #f5f5f5

Columns:
1. Expand button: 40px
2. Order number: 80px (с цветной полоской 1px)
3. Supplier: 200px
4. Buyer: 200px (с датой внизу)
5. Status: 150px (badge)
6. Deadline: 120px
7. Items: 120px
8. Amount: 100px (right-aligned)
9. Actions: 40px
```

#### Status Badges
```
- Height: 24px
- Padding: 6px 8px
- Border-radius: 6px
- Font: 12px/500

Colors:
- Новый: bg #f0f8eb, text #52962a
- В работе: bg #f6efd5, text #a68a26
- Производство: bg #f6efd5, text #a68a26
- Готов: bg #f0f8eb, text #52962a
- Отменен: bg #ffeeee, text #b32c2b
```

#### Expandable Content
```
- Background: #f5f5f5
- Padding: 16px 20px
- Border-top: 1px solid #e5e5e5
- Показывает детали заказа
```

### 8. Menu (Боковое меню)

```
Structure:
- Width: 72px
- Fixed right
- Two sections: top and bottom
- Each section: border, border-radius 20px, padding 16px

Button:
- Size: 40x40px
- Border-radius: 8px
- Padding: 12px 16px (для центрирования иконки)
- Icon: 16x16px
- Hover: background #f5f5f5
- Active: background #d18043, color white

Counter Badge:
- Size: 20x20px
- Border-radius: 12px
- Background: #d18043
- Position: absolute, top -6px, right -6px
- Text: 12px/600 white

Divider:
- Height: 14px (с padding 9px сверху/снизу)
- Line: 1px #e5e5e5
```

### 9. Исправления багов

#### Bug 1: Толстые столбцы в Sales Widget
**Проблема**: Столбцы слишком толстые
**Решение**: Ширина 6px, gap ~7px (точно 13.38px между центрами)

#### Bug 2: Выцветшие цвета в Active Orders
**Проблема**: Цвета слишком бледные
**Решение**: Использовать правильные цвета:
- #f6efd5 (не rgba с низкой opacity)
- rgba(103,187,52,0.1) (правильная прозрачность)
- #ffeeee (не слишком бледный)

#### Bug 3: Overflow в виджетах
**Проблема**: Контент выходит за границы
**Решение**:
- Фиксированная высота 236px
- overflow: hidden на Card
- min-width: 0 на flex children
- text-overflow: ellipsis где нужно

#### Bug 4: Таблица не по дизайну
**Проблема**: Неправильная структура, нет expandable rows
**Решение**: Полностью переписать с правильной структурой

#### Bug 5: Меню не реализовано
**Проблема**: Меню вообще не соответствует дизайну
**Решение**: Создать с нуля по спецификации

### 10. Правила разработки

```typescript
// DO ✅
- Использовать точные размеры из спецификации
- Фиксированная высота виджетов 236px
- Правильные цвета (не приблизительные)
- Spacing по сетке 4px
- Border-radius по спецификации
- Overflow: hidden где нужно

// DON'T ❌
- Не использовать приблизительные размеры
- Не добавлять тени без указания
- Не использовать неправильные цвета
- Не игнорировать overflow
- Не делать толстые столбцы в графиках
```

---

**Версия**: 2.0
**Дата**: 2026-03-02
**Статус**: Полная спецификация для реализации
