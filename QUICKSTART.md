# Quick Start Guide

## Быстрый старт с Docker (рекомендуется)

### 1. Запустить все сервисы
```bash
docker-compose up -d
```

Это запустит:
- PostgreSQL (порт 5432)
- Redis (порт 6379)
- Backend API (порт 8000)
- Celery Worker
- Celery Flower (порт 5555)

### 2. Применить миграции
```bash
docker-compose exec backend alembic upgrade head
```

### 3. Открыть документацию API
http://localhost:8000/docs

### 4. Проверить статус
```bash
curl http://localhost:8000/health
```

## Быстрый старт локально

### 1. Установить зависимости
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Настроить .env
```bash
cp .env.example .env
# Отредактировать .env
```

### 3. Запустить PostgreSQL и Redis
```bash
docker run -d --name postgres -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sotoplace \
  postgres:15-alpine

docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 4. Применить миграции
```bash
alembic upgrade head
```

### 5. Запустить сервер
```bash
uvicorn app.main:app --reload
```

## Использование Makefile

```bash
# Показать все команды
make help

# Установить зависимости
make install

# Запустить dev сервер
make dev

# Запустить тесты
make test

# Форматировать код
make format

# Запустить Docker
make docker-up

# Применить миграции
make migrate

# Создать новую миграцию
make migrate-create MSG="add users table"
```

## Полезные команды

### Docker
```bash
# Просмотр логов
docker-compose logs -f backend

# Перезапуск сервиса
docker-compose restart backend

# Остановить все
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

# Восстановить
docker-compose exec -T postgres psql -U postgres sotoplace < backup.sql
```

### Миграции
```bash
# Создать миграцию
alembic revision --autogenerate -m "описание"

# Применить
alembic upgrade head

# Откатить
alembic downgrade -1

# История
alembic history
```

## Первые шаги после установки

### 1. Создать тестовую компанию и пользователя
```python
# Через Python shell
from app.db.session import AsyncSessionLocal
from app.models import User, Company, CompanyMember
from app.core.security import get_password_hash
import asyncio

async def create_test_data():
    async with AsyncSessionLocal() as db:
        # Создать компанию
        company = Company(
            name="Test Company",
            legal_name="ООО Тест",
            inn="1234567890"
        )
        db.add(company)
        await db.flush()

        # Создать пользователя
        user = User(
            email="admin@test.com",
            password_hash=get_password_hash("password123"),
            full_name="Admin User"
        )
        db.add(user)
        await db.flush()

        # Связать пользователя с компанией
        member = CompanyMember(
            user_id=user.id,
            company_id=company.id,
            role="admin",
            joined_at=datetime.utcnow()
        )
        db.add(member)

        await db.commit()
        print(f"Created company: {company.id}")
        print(f"Created user: {user.id}")

asyncio.run(create_test_data())
```

### 2. Протестировать API
```bash
# Health check
curl http://localhost:8000/health

# Получить документацию
curl http://localhost:8000/openapi.json
```

## Troubleshooting

### Проблема: Порт уже занят
```bash
# Найти процесс на порту 8000
lsof -i :8000

# Убить процесс
kill -9 <PID>
```

### Проблема: База данных не подключается
```bash
# Проверить, запущен ли PostgreSQL
docker-compose ps postgres

# Проверить логи
docker-compose logs postgres

# Перезапустить
docker-compose restart postgres
```

### Проблема: Миграции не применяются
```bash
# Проверить текущую версию
alembic current

# Откатить и применить заново
alembic downgrade base
alembic upgrade head
```

## Дополнительная информация

- Полная документация: `docs/`
- Схема БД: `docs/architecture/DATABASE_SCHEMA.md`
- Гайд разработчика: `docs/prompts/DEVELOPMENT_GUIDE.md`
- Контекст для AI: `docs/prompts/SESSION_CONTEXT.md`
