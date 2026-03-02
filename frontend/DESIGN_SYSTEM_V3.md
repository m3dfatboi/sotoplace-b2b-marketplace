# Modern B2B Marketplace Design System

## Design Philosophy
- **Data-first**: Информация важнее декора
- **Efficiency**: Минимум кликов для действий
- **Clarity**: Четкая визуальная иерархия
- **Modern**: Актуальные тренды 2026

## Colors

### Primary Palette
```css
--primary-500: #d18043;      /* Main brand color */
--primary-600: #a76636;      /* Hover states */
--primary-400: #e09a5f;      /* Light variant */
--primary-50: #fef6f0;       /* Backgrounds */
```

### Neutrals
```css
--gray-950: #0a0a0a;         /* Darkest text */
--gray-900: #1f1f1f;         /* Primary text */
--gray-700: #525252;         /* Secondary text */
--gray-500: #737373;         /* Tertiary text */
--gray-400: #a3a3a3;         /* Disabled text */
--gray-300: #d4d4d4;         /* Borders */
--gray-200: #e5e5e5;         /* Dividers */
--gray-100: #f5f5f5;         /* Backgrounds */
--gray-50: #fafafa;          /* Subtle backgrounds */
--white: #ffffff;
```

### Semantic Colors
```css
--success-500: #67bb34;
--success-600: #52962a;
--success-50: #f0f8eb;

--error-500: #e03636;
--error-600: #b32c2b;
--error-50: #ffeeee;

--warning-500: #d0ad2f;
--warning-600: #a68a26;
--warning-50: #f6efd5;

--info-500: #3b82f6;
--info-600: #2563eb;
--info-50: #eff6ff;
```

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Scale
```css
/* Display */
--text-4xl: 36px / 600 / 40px;  /* Page titles */
--text-3xl: 30px / 600 / 36px;  /* Section titles */

/* Headings */
--text-2xl: 24px / 600 / 32px;  /* Card titles */
--text-xl: 20px / 600 / 28px;   /* Subsection titles */
--text-lg: 18px / 600 / 28px;   /* Small headings */

/* Body */
--text-base: 16px / 400 / 24px; /* Body text */
--text-sm: 14px / 400 / 20px;   /* Secondary text */
--text-xs: 12px / 400 / 16px;   /* Captions */

/* Medium weight variants */
--text-base-medium: 16px / 500 / 24px;
--text-sm-medium: 14px / 500 / 20px;
--text-xs-medium: 12px / 500 / 16px;
```

## Spacing

### Scale (8px base)
```
4px   - xs   - Tight spacing
8px   - sm   - Small gaps
12px  - base - Default gaps
16px  - md   - Medium gaps
24px  - lg   - Large gaps
32px  - xl   - Section spacing
48px  - 2xl  - Page sections
64px  - 3xl  - Major sections
```

## Components

### Cards
```css
background: white;
border: 1px solid var(--gray-200);
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
padding: 24px;

/* Hover state */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
transition: box-shadow 200ms ease;
```

### Buttons

**Primary**
```css
background: var(--primary-500);
color: white;
height: 40px;
padding: 0 20px;
border-radius: 8px;
font: 14px / 500;
transition: all 150ms ease;

hover: background: var(--primary-600);
       transform: translateY(-1px);
       box-shadow: 0 4px 8px rgba(209, 128, 67, 0.2);
```

**Secondary**
```css
background: white;
border: 1px solid var(--gray-300);
color: var(--gray-900);
height: 40px;
padding: 0 20px;
border-radius: 8px;

hover: background: var(--gray-50);
       border-color: var(--gray-400);
```

**Ghost**
```css
background: transparent;
color: var(--gray-700);
height: 40px;
padding: 0 16px;

hover: background: var(--gray-100);
```

### Inputs
```css
height: 40px;
padding: 0 12px;
border: 1px solid var(--gray-300);
border-radius: 8px;
font: 14px / 400;

focus: border-color: var(--primary-500);
       box-shadow: 0 0 0 3px var(--primary-50);
```

### Badges
```css
height: 24px;
padding: 0 8px;
border-radius: 6px;
font: 12px / 500;

/* Status variants */
success: bg var(--success-50), color var(--success-600);
error: bg var(--error-50), color var(--error-600);
warning: bg var(--warning-50), color var(--warning-600);
info: bg var(--info-50), color var(--info-600);
```

## Layout

### Sidebar
```
Width: 240px (expanded), 64px (collapsed)
Background: white
Border: 1px solid var(--gray-200)
Padding: 16px
```

### Header
```
Height: 64px
Background: white
Border-bottom: 1px solid var(--gray-200)
Padding: 0 24px
```

### Content Area
```
Padding: 24px
Max-width: 1440px
Background: var(--gray-50)
```

## Animations

### Transitions
```css
/* Default */
transition: all 150ms ease;

/* Smooth */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce */
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Hover Effects
- Cards: lift + shadow
- Buttons: lift + color change
- Links: color change
- Icons: scale(1.1)

## Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## Icons
- Size: 20px (default), 16px (small), 24px (large)
- Stroke: 1.5px
- Style: Outline (Lucide React)

---

**Version**: 3.0
**Date**: 2026-03-02
**Status**: Active
