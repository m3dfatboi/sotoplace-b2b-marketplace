# Инструкция по запуску проекта

## Быстрый старт (5 минут)

### Вариант 1: Docker (рекомендуется)

```bash
# 1. Запустить все сервисы
docker-compose up -d

# 2. Дождаться запуска (проверить статус)
docker-compose ps

# 3. Применить миграции
docker-compose exec backend alembic upgrade head

# 4. Открыть документацию API
open http://localhost:8000/docs

# 5. Проверить health
curl http://localhost:8000/health
```

### Вариант 2: Локально

```bash
# 1. Установить зависимости
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Настроить .env
cp .env.example .env
# Отредактировать DATABASE_URL и другие настройки

# 3. Запустить PostgreSQL и Redis
docker run -d --name postgres -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sotoplace \
  postgres:15-alpine

docker run -d --name redis -p 6379:6379 redis:7-alpine

# 4. Применить миграции
alembic upgrade head

# 5. Запустить сервер
uvicorn app.main:app --reload

# 6. Открыть http://localhost:8000/docs
```

## Что дальше?

### 1. Создать тестовые данные

```python
# Запустить Python shell
python

from app.db.session import AsyncSessionLocal
from app.models import User, Company, CompanyMember
from app.core.security import get_password_hash
from datetime import datetime
import asyncio
import uuid

async def create_test_data():
    async with AsyncSessionLocal() as db:
        # Создать компанию
        company = Company(
            id=uuid.uuid4(),
            name="Test Company",
            legal_name="ООО Тест",
            inn="1234567890",
            is_verified=True
        )
        db.add(company)
        await db.flush()

        # Создать пользователя
        user = User(
            id=uuid.uuid4(),
            email="admin@test.com",
            password_hash=get_password_hash("password123"),
            full_name="Admin User"
        )
        db.add(user)
        await db.flush()

        # Связать пользователя с компанией
        member = CompanyMember(
            id=uuid.uuid4(),
            user_id=user.id,
            company_id=company.id,
            role="admin",
            joined_at=datetime.utcnow()
        )
        db.add(member)

        await db.commit()
        print(f"✅ Created company: {company.id}")
        print(f"✅ Created user: {user.id}")
        print(f"📧 Email: admin@test.com")
        print(f"🔑 Password: password123")

asyncio.run(create_test_data())
```

### 2. Добавить API endpoints

Создайте файл `backend/app/api/v1/auth.py`:

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas.user import UserLogin, Token
from app.core.security import verify_password, create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    # TODO: Implement login logic
    pass
```

### 3. Запустить тесты

```bash
pytest -v
```

### 4. Проверить код

```bash
make format  # Форматирование
make lint    # Линтинг
```

## Полезные команды

```bash
# Makefile команды
make help           # Показать все команды
make dev            # Запустить dev сервер
make test           # Запустить тесты
make docker-up      # Запустить Docker
make migrate        # Применить миграции
make db-shell       # PostgreSQL shell

# Docker команды
docker-compose logs -f backend    # Логи backend
docker-compose restart backend    # Перезапуск
docker-compose down -v            # Удалить все данные

# Alembic команды
alembic current                   # Текущая версия
alembic history                   # История миграций
alembic upgrade head              # Применить все
alembic downgrade -1              # Откатить последнюю
```

## Troubleshooting

### Ошибка: "ModuleNotFoundError: No module named 'sqlalchemy'"
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Ошибка: "Connection refused" к PostgreSQL
```bash
# Проверить, запущен ли PostgreSQL
docker-compose ps postgres

# Перезапустить
docker-compose restart postgres
```

### Ошибка: "alembic.util.exc.CommandError"
```bash
# Проверить DATABASE_URL в .env
# Убедиться, что PostgreSQL запущен
# Попробовать создать БД вручную
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE sotoplace;"
```

## Документация

- **Полная документация**: `docs/`
- **Схема БД**: `docs/architecture/DATABASE_SCHEMA.md`
- **Гайд разработчика**: `docs/prompts/DEVELOPMENT_GUIDE.md`
- **API документация**: http://localhost:8000/docs

## Поддержка

Если возникли проблемы:
1. Проверьте `docs/prompts/SESSION_CONTEXT.md`
2. Посмотрите `QUICKSTART.md`
3. Изучите `docs/prompts/DEVELOPMENT_GUIDE.md`

Удачи! 🚀
