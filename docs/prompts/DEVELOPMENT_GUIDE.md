# Гайд для разработчиков Sotoplace

## Начало работы

### Требования
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (опционально)

### Установка через Docker (рекомендуется)

1. Клонировать репозиторий:
```bash
git clone <repo-url>
cd sotoplace
```

2. Запустить все сервисы:
```bash
docker-compose up -d
```

3. Применить миграции:
```bash
docker-compose exec backend alembic upgrade head
```

4. API доступно по адресу: http://localhost:8000
5. Документация API: http://localhost:8000/docs
6. Celery Flower: http://localhost:5555

### Установка локально

1. Создать виртуальное окружение:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

2. Установить зависимости:
```bash
pip install -r requirements.txt
```

3. Настроить .env:
```bash
cp .env.example .env
# Отредактировать .env с вашими настройками
```

4. Запустить PostgreSQL и Redis (через Docker):
```bash
docker run -d --name postgres -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sotoplace \
  postgres:15-alpine

docker run -d --name redis -p 6379:6379 redis:7-alpine
```

5. Применить миграции:
```bash
alembic upgrade head
```

6. Запустить сервер:
```bash
uvicorn app.main:app --reload
```

## Работа с базой данных

### Создание миграции
```bash
# Автогенерация миграции на основе изменений в моделях
alembic revision --autogenerate -m "описание изменений"

# Ручное создание миграции
alembic revision -m "описание изменений"
```

### Применение миграций
```bash
# Применить все миграции
alembic upgrade head

# Применить конкретную миграцию
alembic upgrade <revision_id>

# Откатить последнюю миграцию
alembic downgrade -1

# Откатить все миграции
alembic downgrade base
```

### Просмотр истории миграций
```bash
alembic history
alembic current
```

## Структура проекта

```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   └── v1/           # API версия 1
│   │       ├── auth.py   # Аутентификация
│   │       ├── users.py  # Пользователи
│   │       ├── companies.py
│   │       ├── products.py
│   │       └── orders.py
│   ├── core/             # Конфигурация
│   │   ├── config.py     # Настройки приложения
│   │   └── security.py   # JWT, хеширование
│   ├── db/               # База данных
│   │   └── session.py    # Подключение к БД
│   ├── models/           # SQLAlchemy модели
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── company.py
│   │   ├── product.py
│   │   └── order.py
│   ├── schemas/          # Pydantic схемы
│   │   ├── user.py
│   │   ├── company.py
│   │   └── ...
│   ├── services/         # Бизнес-логика
│   │   ├── user_service.py
│   │   ├── order_service.py
│   │   └── ...
│   └── main.py           # Главный файл приложения
├── alembic/              # Миграции
│   ├── versions/         # Файлы миграций
│   └── env.py
├── tests/                # Тесты
│   ├── conftest.py
│   ├── test_users.py
│   └── ...
├── requirements.txt
├── Dockerfile
└── alembic.ini
```

## Разработка новых фич

### 1. Создание новой модели

```python
# app/models/example.py
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import BaseModel

class Example(BaseModel):
    __tablename__ = "examples"

    name = Column(String(255), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
```

### 2. Создание Pydantic схем

```python
# app/schemas/example.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class ExampleBase(BaseModel):
    name: str = Field(..., max_length=255)

class ExampleCreate(ExampleBase):
    company_id: UUID

class ExampleUpdate(BaseModel):
    name: str | None = None

class ExampleResponse(ExampleBase):
    id: UUID
    company_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### 3. Создание сервиса

```python
# app/services/example_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.example import Example
from app.schemas.example import ExampleCreate, ExampleUpdate

class ExampleService:
    @staticmethod
    async def create(db: AsyncSession, data: ExampleCreate) -> Example:
        example = Example(**data.model_dump())
        db.add(example)
        await db.commit()
        await db.refresh(example)
        return example

    @staticmethod
    async def get_by_id(db: AsyncSession, example_id: UUID) -> Example | None:
        result = await db.execute(
            select(Example).where(Example.id == example_id)
        )
        return result.scalar_one_or_none()
```

### 4. Создание API endpoint

```python
# app/api/v1/examples.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas.example import ExampleCreate, ExampleResponse
from app.services.example_service import ExampleService

router = APIRouter(prefix="/examples", tags=["examples"])

@router.post("/", response_model=ExampleResponse)
async def create_example(
    data: ExampleCreate,
    db: AsyncSession = Depends(get_db),
):
    return await ExampleService.create(db, data)

@router.get("/{example_id}", response_model=ExampleResponse)
async def get_example(
    example_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    example = await ExampleService.get_by_id(db, example_id)
    if not example:
        raise HTTPException(status_code=404, detail="Example not found")
    return example
```

### 5. Регистрация роутера

```python
# app/main.py
from app.api.v1 import examples

app.include_router(examples.router, prefix="/api/v1")
```

## Тестирование

### Запуск тестов
```bash
# Все тесты
pytest

# С покрытием
pytest --cov=app --cov-report=html

# Конкретный файл
pytest tests/test_users.py

# Конкретный тест
pytest tests/test_users.py::test_create_user -v
```

### Пример теста
```python
# tests/test_users.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/users/",
            json={
                "email": "test@example.com",
                "password": "password123",
                "full_name": "Test User"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"
```

## Линтинг и форматирование

```bash
# Форматирование кода
black app/ tests/

# Проверка стиля
ruff check app/ tests/

# Автофикс
ruff check app/ tests/ --fix

# Проверка типов
mypy app/
```

## Полезные команды

### Docker
```bash
# Пересобрать контейнеры
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f backend

# Выполнить команду в контейнере
docker-compose exec backend bash

# Остановить все сервисы
docker-compose down

# Удалить все данные
docker-compose down -v
```

### База данных
```bash
# Подключиться к PostgreSQL
docker-compose exec postgres psql -U postgres -d sotoplace

# Создать бэкап
docker-compose exec postgres pg_dump -U postgres sotoplace > backup.sql

# Восстановить из бэкапа
docker-compose exec -T postgres psql -U postgres sotoplace < backup.sql
```

## Отладка

### Использование debugger
```python
# Добавить breakpoint
import pdb; pdb.set_trace()

# Или в Python 3.7+
breakpoint()
```

### Логирование
```python
import logging

logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
```

## Best Practices

1. **Всегда используйте async/await** для операций с БД
2. **Используйте Pydantic** для валидации входных данных
3. **Изолируйте бизнес-логику** в сервисах
4. **Пишите тесты** для критичной функциональности
5. **Используйте type hints** везде
6. **Документируйте API** через docstrings
7. **Следуйте принципу DRY** (Don't Repeat Yourself)
8. **Используйте транзакции** для связанных операций

## Troubleshooting

### Проблема: Ошибка подключения к БД
```bash
# Проверить, запущен ли PostgreSQL
docker-compose ps postgres

# Проверить логи
docker-compose logs postgres
```

### Проблема: Миграции не применяются
```bash
# Проверить текущую версию
alembic current

# Проверить историю
alembic history

# Откатить и применить заново
alembic downgrade -1
alembic upgrade head
```

### Проблема: Импорты не работают
```bash
# Убедиться, что виртуальное окружение активировано
which python

# Переустановить зависимости
pip install -r requirements.txt --force-reinstall
```

## Дополнительные ресурсы

- [FastAPI документация](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 документация](https://docs.sqlalchemy.org/en/20/)
- [Alembic документация](https://alembic.sqlalchemy.org/)
- [Pydantic документация](https://docs.pydantic.dev/)
