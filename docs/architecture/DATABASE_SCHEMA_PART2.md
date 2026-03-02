# Схема базы данных Sotoplace - Часть 2

## 8. Аналитика и метрики

### company_analytics
Агрегированная аналитика по компаниям для дашбордов.

```sql
CREATE TYPE period_type AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');

CREATE TABLE company_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    period_type period_type NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Метрики продаж
    total_orders_count INTEGER DEFAULT 0,
    completed_orders_count INTEGER DEFAULT 0,
    cancelled_orders_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    average_order_value DECIMAL(15, 2) DEFAULT 0,

    -- Метрики производства
    production_load_percentage DECIMAL(5, 2),
    on_time_delivery_rate DECIMAL(5, 2),
    quality_issues_count INTEGER DEFAULT 0,

    -- Метрики закупок
    total_purchases DECIMAL(15, 2) DEFAULT 0,
    active_suppliers_count INTEGER DEFAULT 0,

    -- Лидеры (топ-5)
    top_products JSONB DEFAULT '[]',
    top_clients JSONB DEFAULT '[]',
    top_suppliers JSONB DEFAULT '[]',

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (company_id, period_type, period_start)
);

CREATE INDEX idx_company_analytics_company ON company_analytics(company_id, period_start DESC);
```

**top_products (JSONB):**
```json
[
  {"product_id": "uuid", "product_name": "Верстак", "revenue": 150000, "orders_count": 5},
  {"product_id": "uuid", "product_name": "Стол", "revenue": 120000, "orders_count": 8}
]
```

### order_analytics
Детальная аналитика по заказам.

```sql
CREATE TABLE order_analytics (
    order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,

    -- Временные метрики
    time_to_approval INTERVAL,
    time_to_production INTERVAL,
    time_to_completion INTERVAL,
    total_duration INTERVAL,

    -- Финансовые метрики
    profit_margin DECIMAL(5, 2),
    cost_breakdown JSONB DEFAULT '{}',

    -- Метрики качества
    revisions_count INTEGER DEFAULT 0,
    quality_issues_count INTEGER DEFAULT 0,
    customer_satisfaction_score DECIMAL(3, 2),

    -- Метрики коммуникации
    messages_count INTEGER DEFAULT 0,
    response_time_avg INTERVAL,

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**cost_breakdown (JSONB):**
```json
{
  "materials": 50000,
  "labor": 30000,
  "overhead": 10000,
  "subcontractors": 20000,
  "logistics": 5000
}
```

### user_performance
Метрики производительности пользователей.

```sql
CREATE TABLE user_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Для менеджеров
    orders_managed_count INTEGER DEFAULT 0,
    orders_completed_count INTEGER DEFAULT 0,
    average_deal_size DECIMAL(15, 2),
    conversion_rate DECIMAL(5, 2),

    -- Для конструкторов
    blueprints_created_count INTEGER DEFAULT 0,
    blueprints_approved_count INTEGER DEFAULT 0,
    average_approval_time INTERVAL,

    -- Общие метрики
    active_days_count INTEGER DEFAULT 0,
    messages_sent_count INTEGER DEFAULT 0,
    response_time_avg INTERVAL,

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (user_id, company_id, period_start)
);

CREATE INDEX idx_user_performance_user ON user_performance(user_id, period_start DESC);
CREATE INDEX idx_user_performance_company ON user_performance(company_id, period_start DESC);
```

---

## 9. Уведомления

### notifications
Уведомления для пользователей.

```sql
CREATE TYPE notification_type AS ENUM (
    'order_status_change',
    'new_message',
    'blueprint_approval',
    'payment_received',
    'deadline_approaching',
    'new_contractor_request',
    'contractor_response',
    'system_announcement'
);

CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),

    type notification_type NOT NULL,
    priority notification_priority DEFAULT 'normal',

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    -- Ссылки на объекты
    related_order_id UUID REFERENCES orders(id),
    related_chat_id UUID REFERENCES chats(id),
    related_blueprint_id UUID REFERENCES blueprints(id),

    action_url TEXT,
    action_data JSONB DEFAULT '{}',

    -- Статус
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    is_archived BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE NOT is_read;
CREATE INDEX idx_notifications_company ON notifications(company_id, created_at DESC);
```

### notification_preferences
Настройки уведомлений пользователя.

```sql
CREATE TABLE notification_preferences (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    preferences JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (user_id, company_id)
);
```

**preferences (JSONB):**
```json
{
  "order_status_change": {
    "email": true,
    "push": true,
    "sms": false
  },
  "new_message": {
    "email": false,
    "push": true,
    "sms": false
  },
  "deadline_approaching": {
    "email": true,
    "push": true,
    "sms": true
  },
  "blueprint_approval": {
    "email": true,
    "push": true,
    "sms": false
  }
}
```

### notification_queue
Очередь отправки уведомлений.

```sql
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'webhook');
CREATE TYPE queue_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');

CREATE TABLE notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,

    channel notification_channel NOT NULL,
    recipient TEXT NOT NULL,

    status queue_status DEFAULT 'pending',
    attempts_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_queue_status ON notification_queue(status, scheduled_for);
CREATE INDEX idx_queue_notification ON notification_queue(notification_id);
```

---

## 10. Аудит и логирование

### audit_logs
Журнал всех действий пользователей (иммутабельный).

```sql
CREATE TYPE audit_action AS ENUM (
    'create', 'update', 'delete', 'view',
    'approve', 'reject', 'export',
    'login', 'logout', 'permission_change'
);

CREATE TYPE audit_entity AS ENUM (
    'order', 'product', 'user', 'company',
    'blueprint', 'message', 'payment', 'settings'
);

CREATE TYPE audit_result AS ENUM ('success', 'failure', 'partial');

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Кто и где
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    ip_address INET,
    user_agent TEXT,

    -- Что
    action audit_action NOT NULL,
    entity_type audit_entity NOT NULL,
    entity_id UUID NOT NULL,

    -- Детали
    description TEXT,
    changes JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',

    -- Результат
    status audit_result DEFAULT 'success',
    error_message TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Партиции по месяцам
CREATE TABLE audit_logs_2026_03 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_company ON audit_logs(company_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
```

**changes (JSONB):**
```json
{
  "status": {"old": "draft", "new": "approved"},
  "total_amount": {"old": 100000, "new": 120000},
  "assigned_manager_id": {"old": null, "new": "uuid"}
}
```

### user_sessions
Активные сессии пользователей.

```sql
CREATE TYPE logout_reason AS ENUM ('manual', 'timeout', 'forced', 'security');

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),

    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    is_active BOOLEAN DEFAULT true,
    logout_at TIMESTAMP WITH TIME ZONE,
    logout_reason logout_reason
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id, is_active);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash) WHERE is_active = true;
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at) WHERE is_active = true;
```

### entity_history
История изменений критичных объектов.

```sql
CREATE TYPE history_entity AS ENUM ('order', 'product', 'company', 'blueprint');
CREATE TYPE change_type AS ENUM ('created', 'updated', 'deleted', 'restored');

CREATE TABLE entity_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type history_entity NOT NULL,
    entity_id UUID NOT NULL,
    version_number INTEGER NOT NULL,

    -- Снимок состояния
    snapshot JSONB NOT NULL,

    -- Метаданные изменения
    changed_by_user_id UUID REFERENCES users(id),
    change_type change_type NOT NULL,
    change_description TEXT,
    changed_fields TEXT[] DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(entity_type, entity_id, version_number)
);

CREATE INDEX idx_entity_history_entity ON entity_history(entity_type, entity_id, version_number DESC);
CREATE INDEX idx_entity_history_user ON entity_history(changed_by_user_id, created_at DESC);
```

### active_viewers
Кто сейчас просматривает объект (для real-time индикации).

```sql
CREATE TYPE viewer_entity AS ENUM ('order', 'blueprint', 'chat');

CREATE TABLE active_viewers (
    entity_type viewer_entity NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),

    started_viewing_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    PRIMARY KEY (entity_type, entity_id, user_id)
);

CREATE INDEX idx_active_viewers_entity ON active_viewers(entity_type, entity_id, expires_at);
CREATE INDEX idx_active_viewers_expires ON active_viewers(expires_at);
```

---

## 11. Системные таблицы

### system_settings
Глобальные настройки платформы.

```sql
CREATE TABLE system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by_user_id UUID REFERENCES users(id)
);
```

**Примеры настроек:**
```json
{
  "key": "max_file_upload_size",
  "value": {"bytes": 104857600, "human": "100MB"}
}

{
  "key": "supported_blueprint_formats",
  "value": ["pdf", "dwg", "step", "iges", "stl"]
}

{
  "key": "order_number_format",
  "value": {"prefix": "ORD", "year": true, "month": true, "sequence_length": 5}
}
```

### notification_templates
Шаблоны уведомлений.

```sql
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL,
    channel notification_channel NOT NULL,
    language VARCHAR(5) DEFAULT 'ru',

    subject_template TEXT,
    body_template TEXT NOT NULL,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(type, channel, language)
);
```

**Пример шаблона:**
```sql
INSERT INTO notification_templates (type, channel, language, subject_template, body_template)
VALUES (
    'order_status_change',
    'email',
    'ru',
    'Заказ {{order_number}} изменил статус',
    'Здравствуйте, {{user_name}}!

Статус вашего заказа {{order_number}} изменился на "{{new_status}}".

Детали заказа: {{order_url}}

С уважением,
Команда Sotoplace'
);
```

### status_workflows
Правила переходов между статусами.

```sql
CREATE TABLE status_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    from_status VARCHAR(50) NOT NULL,
    to_status VARCHAR(50) NOT NULL,

    -- Условия перехода
    required_role user_role,
    required_permissions TEXT[] DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',

    -- Автоматические действия
    triggers JSONB DEFAULT '[]',

    is_active BOOLEAN DEFAULT true,

    UNIQUE(entity_type, from_status, to_status)
);
```

**triggers (JSONB):**
```json
[
  {
    "action": "send_notification",
    "params": {
      "type": "order_status_change",
      "recipients": ["buyer", "seller", "manager"]
    }
  },
  {
    "action": "update_analytics",
    "params": {
      "metrics": ["orders_completed_count", "total_revenue"]
    }
  }
]
```

---

## Индексы для производительности

```sql
-- Критичные составные индексы
CREATE INDEX idx_orders_buyer_status_date ON orders(buyer_company_id, status, created_at DESC);
CREATE INDEX idx_orders_seller_status_date ON orders(seller_company_id, status, created_at DESC);
CREATE INDEX idx_messages_chat_date ON messages(chat_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread_date ON notifications(user_id, is_read, created_at DESC) WHERE NOT is_read;

-- Full-text search индексы
CREATE INDEX idx_products_fts ON products USING gin(
    to_tsvector('russian', name || ' ' || COALESCE(description, ''))
);
CREATE INDEX idx_companies_fts ON companies USING gin(
    to_tsvector('russian', name || ' ' || COALESCE(description, ''))
);
CREATE INDEX idx_contractor_requests_fts ON contractor_requests USING gin(
    to_tsvector('russian', title || ' ' || description)
);

-- GIN индексы для JSONB
CREATE INDEX idx_products_specs ON products USING gin(specifications);
CREATE INDEX idx_order_items_production ON order_items USING gin(production_status);
CREATE INDEX idx_company_settings ON company_settings USING gin(settings);

-- Индексы для массивов
CREATE INDEX idx_products_images ON products USING gin(images);
CREATE INDEX idx_companies_tags ON companies USING gin(tags);
CREATE INDEX idx_product_tags_array ON product_tags USING gin(tag);
```

---

## Триггеры и функции

### Автоматическое обновление updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применить ко всем таблицам с updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- И так далее для всех таблиц...
```

### Автоматическая генерация order_number

```sql
CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'ORD-' ||
                           TO_CHAR(NOW(), 'YYYY-MM-') ||
                           LPAD(nextval('order_number_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();
```

### Автоматическое логирование в audit_logs

```sql
CREATE OR REPLACE FUNCTION log_order_changes()
RETURNS TRIGGER AS $$
DECLARE
    changes_json JSONB := '{}';
    old_record JSONB;
    new_record JSONB;
BEGIN
    IF TG_OP = 'UPDATE' THEN
        old_record := to_jsonb(OLD);
        new_record := to_jsonb(NEW);

        -- Сравнить изменения
        SELECT jsonb_object_agg(key, jsonb_build_object('old', old_record->key, 'new', new_record->key))
        INTO changes_json
        FROM jsonb_each(new_record)
        WHERE old_record->key IS DISTINCT FROM new_record->key;

        INSERT INTO audit_logs (
            user_id, company_id, action, entity_type, entity_id,
            description, changes, status
        ) VALUES (
            current_setting('app.current_user_id', true)::UUID,
            NEW.buyer_company_id,
            'update',
            'order',
            NEW.id,
            'Order updated',
            changes_json,
            'success'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_order_changes
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_changes();
```

---

## Партиционирование

### Партиционирование audit_logs по месяцам

```sql
-- Создать партиции на год вперед
DO $$
DECLARE
    start_date DATE := '2026-01-01';
    end_date DATE;
    partition_name TEXT;
BEGIN
    FOR i IN 0..11 LOOP
        end_date := start_date + INTERVAL '1 month';
        partition_name := 'audit_logs_' || TO_CHAR(start_date, 'YYYY_MM');

        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs
             FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );

        start_date := end_date;
    END LOOP;
END $$;
```

### Партиционирование messages по месяцам

```sql
CREATE TABLE messages (
    -- ... columns ...
) PARTITION BY RANGE (created_at);

-- Аналогично создать партиции
```

---

## Права доступа (RLS - Row Level Security)

### Включить RLS для мультитенантности

```sql
-- Пример для таблицы products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_isolation_policy ON products
    USING (company_id = current_setting('app.current_company_id', true)::UUID);

-- Для суперпользователей (админов платформы)
CREATE POLICY products_admin_policy ON products
    USING (current_setting('app.is_superuser', true)::BOOLEAN = true);
```

---

## Миграция и сиды

### Начальные данные

```sql
-- Системные настройки
INSERT INTO system_settings (key, value, description, is_public) VALUES
('max_file_upload_size', '{"bytes": 104857600}', 'Максимальный размер загружаемого файла', true),
('supported_blueprint_formats', '["pdf", "dwg", "step", "iges", "stl"]', 'Поддерживаемые форматы чертежей', true),
('session_timeout_minutes', '{"value": 480}', 'Таймаут сессии в минутах', false);

-- Шаблоны уведомлений
INSERT INTO notification_templates (type, channel, language, subject_template, body_template) VALUES
('order_status_change', 'email', 'ru', 'Заказ {{order_number}} изменил статус',
 'Здравствуйте, {{user_name}}!\n\nСтатус вашего заказа {{order_number}} изменился на "{{new_status}}".\n\nДетали: {{order_url}}'),
('new_message', 'push', 'ru', 'Новое сообщение',
 '{{sender_name}}: {{message_preview}}');
```

---

## Оптимизация и обслуживание

### Регулярные задачи

```sql
-- Очистка старых сессий
DELETE FROM user_sessions
WHERE expires_at < NOW() - INTERVAL '7 days';

-- Очистка старых уведомлений
DELETE FROM notifications
WHERE created_at < NOW() - INTERVAL '90 days'
  AND is_archived = true;

-- Очистка expired active_viewers
DELETE FROM active_viewers
WHERE expires_at < NOW();

-- Обновление статистики
ANALYZE;
```

### Vacuum и reindex

```bash
# Регулярный vacuum
vacuumdb -d sotoplace -z -v

# Reindex для производительности
reindexdb -d sotoplace
```

---

**Итого: 30+ таблиц, полная поддержка мультитенантности, аудита и аналитики**
