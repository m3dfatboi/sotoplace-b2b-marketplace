# Архитектура системы Sotoplace

## Обзор

Sotoplace - это мультитенантная B2B платформа для управления заказами кастомного производства. Система построена на микросервисной архитектуре с использованием современных технологий.

## Архитектурные принципы

### 1. Мультитенантность
- **Изоляция данных**: Каждая компания работает в изолированном пространстве через `company_id`
- **Shared Database, Shared Schema**: Все компании используют одну БД, но данные изолированы на уровне строк
- **Row Level Security (RLS)**: PostgreSQL политики для дополнительной изоляции

### 2. Асинхронность
- **Async/Await**: Все операции с БД и I/O асинхронные
- **FastAPI**: Нативная поддержка async
- **SQLAlchemy 2.0**: Async engine и sessions
- **Background Tasks**: Celery для тяжелых операций

### 3. Безопасность
- **JWT Authentication**: Токены доступа и обновления
- **RBAC**: Ролевая модель с гранулярными правами
- **Password Hashing**: bcrypt для хеширования паролей
- **HTTPS Only**: В продакшене только защищенные соединения
- **Rate Limiting**: Защита от DDoS и брутфорса

### 4. Масштабируемость
- **Horizontal Scaling**: Можно запускать несколько инстансов API
- **Database Connection Pooling**: Эффективное использование соединений
- **Redis Caching**: Кеширование часто запрашиваемых данных
- **CDN**: Для статических файлов и изображений

## Компоненты системы

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React + Next.js)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│                    (Nginx/Traefik)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Backend    │ │   Backend    │ │   Backend    │
│  Instance 1  │ │  Instance 2  │ │  Instance N  │
│   (FastAPI)  │ │   (FastAPI)  │ │   (FastAPI)  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │    Redis     │ │   MinIO/S3   │
│   (Primary)  │ │   (Cache)    │ │   (Files)    │
└──────────────┘ └──────────────┘ └──────────────┘
        │
        ▼
┌──────────────┐
│  PostgreSQL  │
│  (Replica)   │
└──────────────┘

        ┌───────────────────────────┐
        │   Background Workers      │
        │      (Celery)             │
        └───────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │   Message Broker          │
        │      (Redis)              │
        └───────────────────────────┘
```

## Слои приложения

### 1. API Layer (app/api/)
- **Роутеры**: Определяют endpoints
- **Зависимости**: Аутентификация, авторизация
- **Валидация**: Pydantic схемы для входных данных
- **Сериализация**: Pydantic схемы для ответов

### 2. Service Layer (app/services/)
- **Бизнес-логика**: Вся логика приложения
- **Транзакции**: Управление транзакциями БД
- **Интеграции**: Взаимодействие с внешними сервисами
- **Кеширование**: Работа с Redis

### 3. Data Layer (app/models/)
- **ORM модели**: SQLAlchemy модели
- **Relationships**: Связи между таблицами
- **Валидация**: Constraints на уровне БД

### 4. Schema Layer (app/schemas/)
- **Request schemas**: Валидация входных данных
- **Response schemas**: Сериализация ответов
- **Internal schemas**: Для внутреннего использования

## Потоки данных

### Создание заказа

```
1. Client → POST /api/v1/orders
2. API Layer → Валидация OrderCreate schema
3. API Layer → Проверка прав доступа (RBAC)
4. Service Layer → Бизнес-логика создания заказа
5. Service Layer → Создание записи в БД
6. Service Layer → Создание чата для заказа
7. Service Layer → Отправка уведомлений (async task)
8. API Layer → Возврат OrderResponse
9. Client ← 201 Created + Order data
```

### Обновление статуса заказа

```
1. Manager → PATCH /api/v1/orders/{id}/status
2. API Layer → Проверка прав (только manager/admin)
3. Service Layer → Валидация перехода статуса
4. Service Layer → Обновление в БД
5. Service Layer → Логирование в audit_logs
6. Service Layer → Триггер workflow actions
7. Background Task → Отправка уведомлений
8. Background Task → Обновление аналитики
9. WebSocket → Real-time обновление для клиентов
```

## Безопасность

### Аутентификация

```python
# JWT токены
{
  "access_token": "eyJ...",  # 30 минут
  "refresh_token": "eyJ...", # 7 дней
  "token_type": "bearer"
}

# Payload
{
  "sub": "user_id",
  "exp": 1234567890,
  "company_id": "company_id",
  "role": "manager"
}
```

### Авторизация (RBAC)

```python
# Проверка прав
@require_permission("orders:update")
async def update_order(...):
    pass

# Проверка роли
@require_role(["admin", "manager"])
async def manage_users(...):
    pass

# Проверка владения
@require_ownership("order")
async def delete_order(...):
    pass
```

### Изоляция данных

```python
# Middleware устанавливает контекст
request.state.user_id = current_user.id
request.state.company_id = current_company.id

# Все запросы автоматически фильтруются
query = select(Order).where(
    Order.company_id == request.state.company_id
)
```

## Производительность

### Кеширование

```python
# Redis кеш для часто запрашиваемых данных
@cache(ttl=300)  # 5 минут
async def get_company_products(company_id: UUID):
    ...

# Инвалидация кеша
@invalidate_cache("company_products:{company_id}")
async def create_product(...):
    ...
```

### Database Optimization

- **Индексы**: На всех FK и часто используемых полях
- **Партиционирование**: audit_logs, messages по месяцам
- **Connection Pooling**: 20 соединений + 10 overflow
- **Query Optimization**: Использование select_in_load для relationships

### Background Tasks

```python
# Celery задачи для тяжелых операций
@celery_app.task
def send_email_notification(user_id: UUID, template: str):
    ...

@celery_app.task
def generate_analytics_report(company_id: UUID, period: str):
    ...

@celery_app.task
def process_blueprint_file(blueprint_id: UUID):
    ...
```

## Мониторинг и логирование

### Метрики (Prometheus)

- Request rate
- Response time
- Error rate
- Database connections
- Cache hit rate
- Celery queue size

### Логирование

```python
# Структурированные логи
logger.info(
    "Order created",
    extra={
        "order_id": order.id,
        "company_id": order.buyer_company_id,
        "user_id": current_user.id,
        "total_amount": order.total_amount,
    }
)
```

### Трейсинг (Sentry)

- Автоматический захват исключений
- Performance monitoring
- Release tracking
- User feedback

## Развертывание

### Production Stack

```yaml
# Kubernetes deployment
- API: 3+ pods (auto-scaling)
- Celery Workers: 5+ pods
- PostgreSQL: Primary + 2 Replicas
- Redis: Sentinel cluster (3 nodes)
- MinIO: Distributed mode (4+ nodes)
```

### CI/CD Pipeline

```
1. Git Push → GitHub
2. GitHub Actions → Run tests
3. Build Docker image
4. Push to registry
5. Deploy to staging
6. Run integration tests
7. Manual approval
8. Deploy to production
9. Health checks
10. Rollback if needed
```

## Будущие улучшения

1. **GraphQL API**: Для более гибких запросов
2. **Event Sourcing**: Для полной истории изменений
3. **CQRS**: Разделение read/write моделей
4. **Microservices**: Выделение отдельных сервисов (notifications, analytics)
5. **Kafka**: Для event streaming
6. **Elasticsearch**: Для полнотекстового поиска
7. **gRPC**: Для межсервисной коммуникации
