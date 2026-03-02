# TODO - Sotoplace Development Tasks

## 🎯 Текущий спринт

### В работе
- [ ] CRUD endpoints для Products
- [ ] CRUD endpoints для Orders

### Следующие задачи
- [ ] Тестирование API endpoints
- [ ] Добавить фильтры и пагинацию
- [ ] Создать сервисы для бизнес-логики

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
- [ ] POST /api/v1/products - создать товар
- [ ] GET /api/v1/products - список товаров (с фильтрами)
- [ ] GET /api/v1/products/{id} - получить товар
- [ ] PATCH /api/v1/products/{id} - обновить товар
- [ ] DELETE /api/v1/products/{id} - удалить товар
- [ ] POST /api/v1/products/{id}/publish - опубликовать товар

#### Product variants
- [ ] POST /api/v1/products/{id}/variants - добавить вариант
- [ ] GET /api/v1/products/{id}/variants - список вариантов
- [ ] PATCH /api/v1/products/{id}/variants/{variant_id} - обновить
- [ ] DELETE /api/v1/products/{id}/variants/{variant_id} - удалить

#### Product search
- [ ] GET /api/v1/products/search - поиск товаров
- [ ] GET /api/v1/products/categories - список категорий
- [ ] GET /api/v1/products/tags - популярные теги

### Приоритет 4: Управление заказами (Критично)

#### Order endpoints
- [ ] POST /api/v1/orders - создать заказ
- [ ] GET /api/v1/orders - список заказов
- [ ] GET /api/v1/orders/{id} - получить заказ
- [ ] PATCH /api/v1/orders/{id} - обновить заказ
- [ ] PATCH /api/v1/orders/{id}/status - изменить статус
- [ ] DELETE /api/v1/orders/{id} - отменить заказ

#### Order items
- [ ] POST /api/v1/orders/{id}/items - добавить позицию
- [ ] PATCH /api/v1/orders/{id}/items/{item_id} - обновить позицию
- [ ] DELETE /api/v1/orders/{id}/items/{item_id} - удалить позицию

#### Order workflow
- [ ] POST /api/v1/orders/{id}/approve - согласовать заказ
- [ ] POST /api/v1/orders/{id}/assign-manager - назначить менеджера
- [ ] POST /api/v1/orders/{id}/assign-constructor - назначить конструктора

### Приоритет 5: Сервисы (Важно)

#### User service
- [ ] UserService.create() - создание пользователя
- [ ] UserService.authenticate() - аутентификация
- [ ] UserService.get_by_email() - поиск по email
- [ ] UserService.update() - обновление профиля
- [ ] UserService.change_password() - смена пароля

#### Company service
- [ ] CompanyService.create() - создание компании
- [ ] CompanyService.add_member() - добавление участника
- [ ] CompanyService.update_member_role() - изменение роли
- [ ] CompanyService.check_permission() - проверка прав

#### Order service
- [ ] OrderService.create() - создание заказа
- [ ] OrderService.update_status() - изменение статуса
- [ ] OrderService.calculate_total() - расчет суммы
- [ ] OrderService.validate_transition() - валидация перехода статуса

#### Product service
- [ ] ProductService.create() - создание товара
- [ ] ProductService.search() - поиск товаров
- [ ] ProductService.publish() - публикация товара

### Приоритет 6: Тестирование (Важно)

#### Unit tests
- [ ] tests/test_auth.py - тесты аутентификации
- [ ] tests/test_users.py - тесты пользователей
- [ ] tests/test_companies.py - тесты компаний
- [ ] tests/test_products.py - тесты товаров
- [ ] tests/test_orders.py - тесты заказов

#### Integration tests
- [ ] tests/integration/test_order_flow.py - полный цикл заказа
- [ ] tests/integration/test_auth_flow.py - регистрация и вход

#### Test fixtures
- [ ] tests/conftest.py - общие fixtures
- [ ] tests/factories.py - фабрики для тестовых данных

### Приоритет 7: Дополнительные модули (Желательно)

#### Чаты и сообщения
- [ ] POST /api/v1/chats - создать чат
- [ ] GET /api/v1/chats - список чатов
- [ ] POST /api/v1/chats/{id}/messages - отправить сообщение
- [ ] GET /api/v1/chats/{id}/messages - получить сообщения
- [ ] WebSocket /ws/chats/{id} - real-time чат

#### Чертежи
- [ ] POST /api/v1/blueprints - загрузить чертеж
- [ ] GET /api/v1/blueprints/{id} - получить чертеж
- [ ] POST /api/v1/blueprints/{id}/versions - новая версия
- [ ] POST /api/v1/blueprints/{id}/approve - согласовать

#### Уведомления
- [ ] GET /api/v1/notifications - список уведомлений
- [ ] PATCH /api/v1/notifications/{id}/read - отметить прочитанным
- [ ] GET /api/v1/notifications/preferences - настройки
- [ ] PATCH /api/v1/notifications/preferences - обновить настройки

#### Загрузка файлов
- [ ] POST /api/v1/upload - загрузить файл
- [ ] GET /api/v1/files/{id} - получить файл
- [ ] DELETE /api/v1/files/{id} - удалить файл
- [ ] Интеграция с MinIO/S3

### Приоритет 8: Инфраструктура (Желательно)

#### Celery задачи
- [ ] tasks/email.py - отправка email
- [ ] tasks/notifications.py - отправка уведомлений
- [ ] tasks/analytics.py - расчет аналитики
- [ ] tasks/cleanup.py - очистка старых данных

#### Мониторинг
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

### Текущая сессия (2026-03-02)
- Создан полный фундамент проекта
- Все базовые модели и схемы готовы
- Первая миграция создана
- Документация полная
- Готов к разработке API endpoints

### Следующая сессия
- Начать с аутентификации (POST /api/v1/auth/register, /login)
- Реализовать JWT middleware
- Добавить базовые CRUD endpoints

---

## 🔗 Полезные ссылки

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/)
- [Pydantic](https://docs.pydantic.dev/)
- [Alembic](https://alembic.sqlalchemy.org/)

---

**Последнее обновление:** 2026-03-02
**Статус:** Фундамент готов, начинаем разработку API
