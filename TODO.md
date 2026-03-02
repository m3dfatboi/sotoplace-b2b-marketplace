# TODO - Sotoplace Development Tasks

## 🎯 Текущий спринт

### ✅ Завершено в этой сессии (2026-03-02)
- ✅ Инициализация frontend проекта (Next.js 14 + TypeScript + TailwindCSS)
- ✅ Настройка дизайн-системы из Figma (цвета, шрифты, отступы)
- ✅ Создание базовых UI компонентов (Button, Card)
- ✅ Реализация виджетов дашборда (5 виджетов)
- ✅ Таблица заказов с фильтрами
- ✅ Mock данные для маркетплейса
- ✅ Настройка React Query, Zustand, Recharts
- ✅ Боковое меню навигации

### 🔄 В процессе
- [ ] **Frontend дашборд - требует переработки дизайна**
  - Текущая версия не соответствует требованиям
  - Нужно переделать виджеты и layout
  - Улучшить визуальное представление данных

### Следующие задачи
- [ ] Переработать дизайн главной страницы дашборда
- [ ] Добавить графики и визуализации
- [ ] Реализовать фильтры и поиск в таблице
- [ ] Создать страницы: каталог товаров, детали заказа
- [ ] Интеграция frontend с backend API
- [ ] Аутентификация на frontend
- [ ] Production deployment
- [ ] CI/CD pipeline

---

## 📋 Backlog по приоритетам

### Приоритет 1: Аутентификация и базовые API (Критично)

#### Auth endpoints
- ✅ POST /api/v1/auth/register - регистрация пользователя
- ✅ POST /api/v1/auth/login - вход (получение токенов)
- ✅ POST /api/v1/auth/login/form - OAuth2 login для Swagger
- [ ] POST /api/v1/auth/refresh - обновление access token
- [ ] POST /api/v1/auth/logout - выход

#### User management
- ✅ GET /api/v1/users/me - профиль текущего пользователя
- ✅ PATCH /api/v1/users/me - обновить профиль
- ✅ POST /api/v1/users/me/change-password - смена пароля

#### Middleware и dependencies
- ✅ JWT authentication middleware
- ✅ get_current_user dependency
- ✅ get_current_active_user dependency
- [ ] require_role decorator
- [ ] require_permission decorator

### Приоритет 2: Управление компаниями (Важно)

#### Company endpoints
- ✅ POST /api/v1/companies - создать компанию
- [ ] GET /api/v1/companies - список компаний (для админов)
- ✅ GET /api/v1/companies/my - мои компании
- ✅ GET /api/v1/companies/{id} - получить компанию
- ✅ PATCH /api/v1/companies/{id} - обновить компанию
- [ ] DELETE /api/v1/companies/{id} - удалить компанию

#### Company members
- ✅ POST /api/v1/companies/{id}/members - добавить участника
- ✅ GET /api/v1/companies/{id}/members - список участников
- [ ] PATCH /api/v1/companies/{id}/members/{user_id} - обновить роль
- [ ] DELETE /api/v1/companies/{id}/members/{user_id} - удалить участника

#### Company settings
- [ ] GET /api/v1/companies/{id}/settings - получить настройки
- [ ] PATCH /api/v1/companies/{id}/settings - обновить настройки

### Приоритет 3: Каталог товаров (Важно)

#### Product endpoints
- ✅ POST /api/v1/products - создать товар
- ✅ GET /api/v1/products - список товаров (с фильтрами)
- ✅ GET /api/v1/products/{id} - получить товар
- ✅ PATCH /api/v1/products/{id} - обновить товар
- ✅ DELETE /api/v1/products/{id} - удалить товар
- ✅ POST /api/v1/products/{id}/publish - опубликовать товар

#### Product variants
- ✅ POST /api/v1/products/{id}/variants - добавить вариант
- ✅ GET /api/v1/products/{id}/variants - список вариантов
- ✅ PATCH /api/v1/products/{id}/variants/{variant_id} - обновить
- ✅ DELETE /api/v1/products/{id}/variants/{variant_id} - удалить

#### Product search
- ✅ GET /api/v1/products?search=query - поиск товаров
- [ ] GET /api/v1/products/categories - список категорий
- [ ] GET /api/v1/products/tags - популярные теги

### Приоритет 4: Управление заказами (Критично)

#### Order endpoints
- ✅ POST /api/v1/orders - создать заказ
- ✅ GET /api/v1/orders - список заказов
- ✅ GET /api/v1/orders/{id} - получить заказ
- ✅ PATCH /api/v1/orders/{id} - обновить заказ
- ✅ DELETE /api/v1/orders/{id} - отменить заказ

#### Order items
- ✅ POST /api/v1/orders/{id}/items - добавить позицию
- ✅ GET /api/v1/orders/{id}/items - список позиций
- ✅ PATCH /api/v1/orders/{id}/items/{item_id} - обновить позицию
- ✅ DELETE /api/v1/orders/{id}/items/{item_id} - удалить позицию

#### Order workflow
- ✅ Status transitions через PATCH /api/v1/orders/{id}
- ✅ Assign manager/constructor через PATCH
- ✅ Auto-calculate order total
- ✅ Order number generation

### Приоритет 5: Сервисы (Важно)

#### User service
- ✅ UserService.create() - создание пользователя
- ✅ UserService.authenticate() - аутентификация
- ✅ UserService.get_by_email() - поиск по email
- ✅ UserService.update() - обновление профиля
- ✅ UserService.change_password() - смена пароля

#### Company service
- ✅ CompanyService.create() - создание компании
- ✅ CompanyService.add_member() - добавление участника
- ✅ CompanyService.update_member_role() - изменение роли
- ✅ CompanyService.check_permission() - проверка прав

#### Order service
- ✅ OrderService.create() - создание заказа
- ✅ OrderService.update_status() - изменение статуса
- ✅ OrderService.calculate_total() - расчет суммы
- ✅ OrderService.validate_transition() - валидация перехода статуса

#### Product service
- ✅ ProductService.create() - создание товара
- ✅ ProductService.search() - поиск товаров
- ✅ ProductService.publish() - публикация товара

### Приоритет 6: Тестирование (Важно)

#### Unit tests
- ✅ tests/test_auth.py - тесты аутентификации (7 тестов)
- ✅ tests/test_users.py - тесты пользователей (5 тестов)
- ✅ tests/test_companies.py - тесты компаний (6 тестов)
- ✅ tests/test_products.py - тесты товаров (7 тестов)
- ✅ tests/test_orders.py - тесты заказов (9 тестов)
- ✅ tests/test_notifications.py - тесты уведомлений (11 тестов) - NEW!
- ✅ tests/test_blueprints.py - тесты чертежей (9 тестов) - NEW!

#### Integration tests
- ✅ tests/test_integration.py - полные e2e workflows (2 теста)
  * Complete order workflow (registration → order → completion)
  * Product catalog workflow (create → publish → search)

#### Test fixtures
- ✅ tests/conftest.py - общие fixtures (db_session, client, auth_headers)
- [ ] tests/factories.py - фабрики для тестовых данных (опционально)

**Total: 56+ tests with comprehensive coverage**

### Приоритет 7: Дополнительные модули (Желательно)

#### Чаты и сообщения
- ✅ POST /api/v1/chats - создать чат
- ✅ GET /api/v1/chats - список чатов
- ✅ POST /api/v1/chats/{id}/messages - отправить сообщение
- ✅ GET /api/v1/chats/{id}/messages - получить сообщения
- ✅ PATCH /api/v1/chats/{id}/participants/{user_id}/read - отметить прочитанным
- ✅ POST /api/v1/chats/{id}/participants - добавить участника
- ✅ GET /api/v1/chats/{id}/participants - список участников
- ✅ DELETE /api/v1/chats/{id}/participants/{user_id} - удалить участника
- ✅ WebSocket /ws/chats/{id} - real-time чат

#### Чертежи
- ✅ POST /api/v1/blueprints - создать чертеж
- ✅ GET /api/v1/blueprints - список чертежей
- ✅ GET /api/v1/blueprints/{id} - получить чертеж с версиями
- ✅ POST /api/v1/blueprints/{id}/versions - загрузить новую версию
- ✅ GET /api/v1/blueprints/{id}/versions - получить все версии
- ✅ POST /api/v1/blueprints/{id}/versions/{version_id}/approve - согласовать
- ✅ POST /api/v1/blueprints/upload - загрузить файл

#### Уведомления
- ✅ GET /api/v1/notifications - список уведомлений
- ✅ GET /api/v1/notifications/stats - статистика уведомлений
- ✅ GET /api/v1/notifications/{id} - получить уведомление
- ✅ PATCH /api/v1/notifications/{id}/read - отметить прочитанным
- ✅ POST /api/v1/notifications/mark-all-read - отметить все прочитанными
- ✅ PATCH /api/v1/notifications/{id}/archive - архивировать
- ✅ DELETE /api/v1/notifications/{id} - удалить уведомление
- ✅ GET /api/v1/notifications/preferences/me - получить настройки
- ✅ PATCH /api/v1/notifications/preferences/me - обновить настройки

#### Загрузка файлов
- ✅ POST /api/v1/blueprints/upload - загрузить файл
- ✅ Поддержка форматов: PDF, DWG, STEP, IGES, STL, PNG, JPG
- ✅ Автоматическая структура директорий (uploads/user_id/YYYY-MM/)
- ✅ Генерация уникальных имен файлов
- ✅ Отслеживание размера файлов
- [ ] Интеграция с MinIO/S3 (опционально)

### Приоритет 8: Инфраструктура (Желательно)

#### Celery задачи
- ✅ tasks/email.py - отправка email (3 tasks)
- ✅ tasks/notifications.py - отправка уведомлений (3 tasks)
- ✅ tasks/analytics.py - расчет аналитики (3 tasks)
- ✅ Celery configuration с Redis
- ✅ Automatic retry с exponential backoff
- ✅ HTML email templates
- ✅ Celery Flower monitoring
- [ ] tasks/cleanup.py - очистка старых данных (опционально)

#### Мониторинг
- ✅ Celery Flower (http://localhost:5555)
- [ ] Prometheus metrics
- [ ] Health check endpoints
- [ ] Sentry integration
- [ ] Logging configuration

#### CI/CD
- [ ] GitHub Actions workflow
- [ ] Automated tests
- [ ] Docker build and push
- [ ] Deployment scripts

---

## ✅ Выполнено

### Инфраструктура
- ✅ Инициализирован git репозиторий
- ✅ Создана структура проекта
- ✅ Настроен Docker Compose
- ✅ Настроен Alembic для миграций

### Модели и схемы
- ✅ 18 SQLAlchemy моделей
- ✅ 24+ Pydantic схемы
- ✅ Первая миграция БД (001_initial_schema.py)

### Документация
- ✅ README.md
- ✅ SETUP.md
- ✅ QUICKSTART.md
- ✅ STATUS.md
- ✅ CONTRIBUTING.md
- ✅ DATABASE_SCHEMA.md (2 части)
- ✅ SYSTEM_ARCHITECTURE.md
- ✅ DEVELOPMENT_GUIDE.md
- ✅ SESSION_CONTEXT.md

### Конфигурация
- ✅ FastAPI приложение
- ✅ Database session management
- ✅ Security utilities (JWT, password hashing)
- ✅ Settings через Pydantic
- ✅ CORS настройки

---

## 📝 Заметки

### Текущая сессия (2026-03-02) - Frontend Start ⚠️

**Создан frontend проект:**
- ✅ Next.js 14 + TypeScript + TailwindCSS
- ✅ 38 файлов, ~1200 строк кода
- ✅ Дизайн-система из Figma (цвета, шрифты)
- ✅ 5 виджетов дашборда:
  - Активные заказы (круговая диаграмма)
  - Выручка за месяц (3.45M ₽)
  - Статистика каталога (товары, модерация)
  - Топ товаров (с фото мебели)
  - Последние события (активность)
- ✅ Таблица заказов (поставщик → покупатель)
- ✅ Mock данные (6 заказов, 5 товаров, 4 события)
- ✅ Боковое меню (справа)
- ✅ React Query + Zustand + Recharts

**Проблемы:**
- ⚠️ Дизайн не соответствует ожиданиям
- ⚠️ Требуется полная переработка интерфейса
- ⚠️ Layout и виджеты нужно переделать

**Следующая сессия:**
- Переработать дизайн дашборда с нуля
- Улучшить визуализацию данных
- Добавить графики и анимации
- Реализовать правильный layout

**Общая статистика проекта:**
- Backend: 82+ endpoints, 56+ tests ✅
- Frontend: 38 файлов, требует доработки ⚠️
- ~13,000+ строк кода (backend + frontend)

### Предыдущие сессии (2026-03-02) - Backend Complete ✅
**Добавлено в этой сессии:**
- ✅ **WebSocket для real-time чатов:**
  - Подключение/отключение пользователей
  - Broadcast сообщений всем участникам
  - Typing indicators (индикаторы набора текста)
  - Read receipts (отметки о прочтении)
  - User join/leave notifications
  - Connection manager для управления соединениями

- ✅ **Система уведомлений (10 endpoints):**
  - Список уведомлений с фильтрами
  - Статистика уведомлений
  - Отметка прочитанным/непрочитанным
  - Массовая отметка всех как прочитанных
  - Архивирование уведомлений
  - Удаление уведомлений
  - Настройки уведомлений по каналам (email, push, sms)
  - Персональные настройки для каждой компании

- ✅ **Система чертежей (7 endpoints):**
  - Создание чертежей для заказов
  - Версионирование чертежей
  - Загрузка новых версий
  - Workflow согласования (approve/reject)
  - Комментарии к согласованиям
  - История версий
  - Поддержка форматов: PDF, DWG, STEP, IGES, STL

- ✅ **Загрузка файлов:**
  - Endpoint для загрузки файлов
  - Автоматическая структура директорий
  - Генерация уникальных имен
  - Отслеживание размера файлов
  - Поддержка изображений (PNG, JPG)

**Итого за сессию: +25 новых endpoints, 3 новых модуля**

**Общая статистика проекта:**
- 25 коммитов
- 8 API модулей
- 60+ endpoints
- 4 бизнес-сервиса
- 18 SQLAlchemy моделей
- 35+ Pydantic схем
- 30+ тестов
- ~12,000+ строк кода

### Предыдущая сессия (2026-03-02) - ЗАВЕРШЕНА ✅
- ✅ Создан полный фундамент проекта
- ✅ Все базовые модели и схемы готовы
- ✅ Первая миграция создана
- ✅ Документация полная (17 файлов)
- ✅ **API endpoints полностью реализованы (35+):**
  - Authentication (3 endpoints)
  - Users (3 endpoints)
  - Companies (6 endpoints)
  - Products (10 endpoints)
  - Orders (9 endpoints)
- ✅ **Business Services (4 сервиса):**
  - UserService, CompanyService, ProductService, OrderService
- ✅ **Comprehensive Test Suite (30+ тестов):**
  - Unit tests для всех endpoints
  - Integration tests для e2e workflows
  - Test coverage: Auth, Users, Companies, Products, Orders
- ✅ **Инфраструктура:**
  - Database seeding script
  - Utility functions
  - Docker environment
  - Makefile commands

### Следующая сессия
- **ВАЖНО:** Прочитать TODO.md в начале сессии!
- Добавить Celery tasks для email уведомлений
- Реализовать аналитику и дашборды
- Добавить contractor marketplace (биржа контрагентов)
- Рассмотреть frontend разработку (React/Next.js)
- Добавить больше тестов для новых модулей

---

## 🔗 Полезные ссылки

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/)
- [Pydantic](https://docs.pydantic.dev/)
- [Alembic](https://alembic.sqlalchemy.org/)

---

**Последнее обновление:** 2026-03-02
**Статус:** Фундамент готов, начинаем разработку API
