# Sotoplace - B2B Marketplace для кастомного производства

## Описание проекта

Sotoplace - это сложная мультитенантная B2B платформа для управления заказами кастомного производства. Система поддерживает полный цикл от поиска контрагентов до производства и доставки с возможностью работы с субподрядчиками.

## Ключевые возможности

- **Мультитенантность**: Каждая компания работает в изолированном пространстве
- **Ролевая модель**: Менеджер, Конструктор, Клиент/Заказчик, Администратор компании
- **Управление заказами**: Сложный пайплайн статусов с вложенными субподрядами
- **Каталог и маркетплейс**: Публикация товаров, поиск контрагентов
- **Инжиниринг**: Загрузка чертежей, версионирование, электронное согласование
- **Чаты**: Контекстные чаты привязанные к заказам и чертежам
- **Аналитика**: Дашборды для менеджеров с метриками продаж и производства
- **Биржа труда**: Поиск временных исполнителей на проектную работу

## Технологический стек

### Backend
- **Python 3.11+**
- **FastAPI** - современный async веб-фреймворк
- **PostgreSQL 15+** - основная БД
- **SQLAlchemy 2.0** - ORM
- **Alembic** - миграции БД
- **Redis** - кэширование и очереди
- **Celery** - фоновые задачи
- **Pydantic** - валидация данных

### Frontend (планируется)
- **React 18+** / **Next.js**
- **TypeScript**
- **TailwindCSS**
- **React Query** - управление состоянием сервера

### Инфраструктура
- **Docker** + **Docker Compose**
- **Nginx** - reverse proxy
- **MinIO** / **S3** - хранение файлов
- **Prometheus** + **Grafana** - мониторинг

## Структура проекта

```
sotoplace/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Конфигурация, безопасность
│   │   ├── models/       # SQLAlchemy модели
│   │   ├── schemas/      # Pydantic схемы
│   │   ├── services/     # Бизнес-логика
│   │   └── db/           # Database utilities
│   ├── alembic/          # Миграции БД
│   ├── tests/            # Тесты
│   └── requirements.txt
├── frontend/             # React приложение
├── docs/
│   ├── architecture/     # Архитектурная документация
│   ├── api/              # API документация
│   └── prompts/          # Контекст для AI-ассистентов
└── docker-compose.yml
```

## Быстрый старт

### Требования
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker (опционально)

### Установка

1. Клонировать репозиторий:
```bash
git clone <repo-url>
cd sotoplace
```

2. Создать виртуальное окружение:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. Установить зависимости:
```bash
pip install -r requirements.txt
```

4. Настроить переменные окружения:
```bash
cp .env.example .env
# Отредактировать .env с вашими настройками
```

5. Применить миграции:
```bash
alembic upgrade head
```

6. Запустить сервер:
```bash
uvicorn app.main:app --reload
```

API будет доступно по адресу: http://localhost:8000
Документация API: http://localhost:8000/docs

## Разработка

### Создание новой миграции
```bash
alembic revision --autogenerate -m "описание изменений"
alembic upgrade head
```

### Запуск тестов
```bash
pytest
```

### Линтинг и форматирование
```bash
black app/
ruff check app/
mypy app/
```

## Документация

- [Архитектура системы](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Схема базы данных](docs/architecture/DATABASE_SCHEMA.md)
- [API документация](docs/api/)
- [Гайд для разработчиков](docs/prompts/DEVELOPMENT_GUIDE.md)

## Лицензия

Proprietary - Все права защищены
