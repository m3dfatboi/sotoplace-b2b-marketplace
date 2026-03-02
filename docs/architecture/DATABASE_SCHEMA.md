# Схема базы данных Sotoplace

## Обзор

База данных спроектирована для поддержки мультитенантной B2B платформы с изоляцией данных на уровне компаний. Используется PostgreSQL 15+ с поддержкой JSONB, full-text search и партиционирования.

## Принципы проектирования

1. **Мультитенантность**: Большинство таблиц содержат `company_id` для изоляции данных
2. **Аудит**: Все изменения логируются в `audit_logs`
3. **Версионирование**: Критичные объекты имеют историю в `entity_history`
4. **Soft delete**: Используется `is_active`/`is_deleted` вместо физического удаления
5. **Timestamps**: Все таблицы имеют `created_at` и `updated_at`

---

## 1. Пользователи и аутентификация

### users
Основная таблица пользователей системы.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
```

**Поля:**
- `id` - UUID пользователя
- `email` - уникальный email для входа
- `password_hash` - bcrypt хеш пароля
- `phone` - телефон (опционально)
- `full_name` - полное имя
- `avatar_url` - ссылка на аватар
- `is_active` - активен ли аккаунт
- `last_login_at` - последний вход

### company_members
Связь пользователей с компаниями (многие-ко-многим) с ролями.

```sql
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'constructor', 'client');

CREATE TABLE company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,

    UNIQUE(user_id, company_id)
);

CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_company_members_company ON company_members(company_id);
CREATE INDEX idx_company_members_role ON company_members(company_id, role);
```

**Роли:**
- `admin` - администратор компании (все права)
- `manager` - менеджер (управление сделками, аналитика)
- `constructor` - конструктор (работа с чертежами)
- `client` - клиент (просмотр каталога, заказы)

**Permissions (JSONB):**
```json
{
  "orders": {"create": true, "read": true, "update": true, "delete": false},
  "products": {"create": true, "read": true, "update": true, "delete": true},
  "analytics": {"view_all": true, "export": true},
  "users": {"invite": true, "manage_roles": false}
}
```

---

## 2. Компании (Tenants)

### companies
Основная таблица компаний-контрагентов.

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    inn VARCHAR(20),
    description TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_companies_public ON companies(is_public) WHERE is_public = true;
CREATE INDEX idx_companies_tags ON companies USING gin(tags);
CREATE INDEX idx_companies_search ON companies USING gin(
    to_tsvector('russian', name || ' ' || COALESCE(description, ''))
);
```

**Поля:**
- `tags` - массив тегов для поиска по специализации (["металлообработка", "сборка мебели"])
- `is_verified` - прошла ли компания верификацию
- `is_public` - видна ли в публичном каталоге

### company_settings
Настройки и реквизиты компании.

```sql
CREATE TYPE catalog_visibility AS ENUM ('public', 'private', 'selective');

CREATE TABLE company_settings (
    company_id UUID PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
    bank_details JSONB,
    billing_address JSONB,
    shipping_address JSONB,
    catalog_visibility catalog_visibility DEFAULT 'public',
    settings JSONB DEFAULT '{}'
);
```

**bank_details (JSONB):**
```json
{
  "bank_name": "Сбербанк",
  "bik": "044525225",
  "account": "40702810000000000000",
  "correspondent_account": "30101810400000000225"
}
```

**address (JSONB):**
```json
{
  "country": "RU",
  "city": "Москва",
  "street": "ул. Ленина",
  "building": "10",
  "office": "5А",
  "postal_code": "123456",
  "coordinates": {"lat": 55.751244, "lon": 37.618423}
}
```

---

## 3. Товары и каталог

### products
Товары и услуги компаний.

```sql
CREATE TYPE price_type AS ENUM ('fixed', 'negotiable', 'custom');

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    base_price DECIMAL(15, 2),
    price_type price_type DEFAULT 'fixed',
    is_customizable BOOLEAN DEFAULT false,
    images TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    qr_code_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_products_company ON products(company_id, is_published);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_search ON products USING gin(
    to_tsvector('russian', name || ' ' || COALESCE(description, ''))
);
```

**specifications (JSONB):**
```json
{
  "material": "Сталь",
  "dimensions": {"length": 2000, "width": 800, "height": 750, "unit": "mm"},
  "weight": {"value": 50, "unit": "kg"},
  "color_options": ["черный", "белый", "серый"],
  "lead_time_days": 14
}
```

### product_variants
Варианты комплектации товара.

```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    price_modifier DECIMAL(15, 2) DEFAULT 0,
    attributes JSONB DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
```

**attributes (JSONB):**
```json
{
  "color": "черный",
  "size": "L",
  "material": "металл"
}
```

### product_tags
Теги для поиска товаров.

```sql
CREATE TABLE product_tags (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (product_id, tag)
);

CREATE INDEX idx_product_tags_tag ON product_tags(tag);
```

---

## 4. Заказы и сделки

### orders
Основная таблица заказов/сделок.

```sql
CREATE TYPE order_status AS ENUM (
    'draft', 'negotiation', 'approved', 'in_production',
    'assembly', 'quality_check', 'shipping', 'delivered',
    'completed', 'cancelled'
);

CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    parent_order_id UUID REFERENCES orders(id),

    -- Стороны сделки
    buyer_company_id UUID NOT NULL REFERENCES companies(id),
    seller_company_id UUID NOT NULL REFERENCES companies(id),
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    assigned_manager_id UUID REFERENCES users(id),
    assigned_constructor_id UUID REFERENCES users(id),

    -- Статусы
    status order_status DEFAULT 'draft',
    payment_status payment_status DEFAULT 'pending',

    -- Финансы
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'RUB',
    payment_terms TEXT,

    -- Даты
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    deadline TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Метаданные
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_orders_buyer ON orders(buyer_company_id, status, created_at DESC);
CREATE INDEX idx_orders_seller ON orders(seller_company_id, status, created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_parent ON orders(parent_order_id);
CREATE INDEX idx_orders_manager ON orders(assigned_manager_id);
```

**order_number генерация:**
```
ORD-2026-03-00001
```

### order_items
Позиции в заказе.

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    parent_item_id UUID REFERENCES order_items(id),

    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,

    -- Статусы производства
    production_status JSONB DEFAULT '{}',

    specifications JSONB DEFAULT '{}',
    attachments TEXT[] DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_parent ON order_items(parent_item_id);
```

**production_status (JSONB):**
```json
{
  "ТР": {"status": "completed", "completed_at": "2026-03-01T10:00:00Z"},
  "ОК": {"status": "in_progress", "started_at": "2026-03-02T09:00:00Z"},
  "УП": {"status": "pending"},
  "СК": {"status": "pending"},
  "СБ": {"status": "pending"}
}
```

### order_item_suppliers
Связь позиций с субподрядчиками.

```sql
CREATE TABLE order_item_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    supplier_company_id UUID NOT NULL REFERENCES companies(id),
    sub_order_id UUID REFERENCES orders(id),
    status VARCHAR(50),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_item_suppliers_item ON order_item_suppliers(order_item_id);
CREATE INDEX idx_item_suppliers_supplier ON order_item_suppliers(supplier_company_id);
```

---

## 5. Чаты и сообщения

### chats
Чаты привязанные к контексту.

```sql
CREATE TYPE chat_type AS ENUM ('order', 'blueprint', 'general', 'support');

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type chat_type NOT NULL,
    order_id UUID REFERENCES orders(id),
    blueprint_id UUID REFERENCES blueprints(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_chats_order ON chats(order_id);
CREATE INDEX idx_chats_blueprint ON chats(blueprint_id);
```

### chat_participants
Участники чатов.

```sql
CREATE TYPE participant_role AS ENUM ('owner', 'participant', 'observer');

CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    role participant_role DEFAULT 'participant',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,

    UNIQUE(chat_id, user_id)
);

CREATE INDEX idx_chat_participants_chat ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user ON chat_participants(user_id);
```

### messages
Сообщения в чатах.

```sql
CREATE TYPE message_type AS ENUM ('text', 'file', 'blueprint_version', 'status_update');

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES users(id),
    sender_company_id UUID NOT NULL REFERENCES companies(id),

    content TEXT,
    message_type message_type DEFAULT 'text',
    attachments JSONB DEFAULT '[]',
    blueprint_version_id UUID REFERENCES blueprint_versions(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX idx_messages_chat ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_user_id);
```

**attachments (JSONB):**
```json
[
  {
    "url": "https://storage.example.com/files/abc123.pdf",
    "name": "чертеж.pdf",
    "type": "application/pdf",
    "size": 1024000
  }
]
```

---

## 6. Чертежи и согласования

### blueprints
Чертежи для заказов.

```sql
CREATE TYPE blueprint_status AS ENUM ('draft', 'review', 'approved', 'rejected');

CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id),
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    current_version_id UUID,
    status blueprint_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blueprints_order ON blueprints(order_id);
CREATE INDEX idx_blueprints_item ON blueprints(order_item_id);
```

### blueprint_versions
Версии чертежей.

```sql
CREATE TYPE file_type AS ENUM ('pdf', 'dwg', 'step', 'iges', 'stl');

CREATE TABLE blueprint_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    file_type file_type NOT NULL,
    thumbnail_url TEXT,
    changes_description TEXT,
    created_by_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(blueprint_id, version_number)
);

CREATE INDEX idx_blueprint_versions_blueprint ON blueprint_versions(blueprint_id, version_number DESC);
```

### blueprint_approvals
Согласования чертежей.

```sql
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE blueprint_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blueprint_version_id UUID NOT NULL REFERENCES blueprint_versions(id) ON DELETE CASCADE,
    approver_user_id UUID NOT NULL REFERENCES users(id),
    status approval_status DEFAULT 'pending',
    comment TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(blueprint_version_id, approver_user_id)
);

CREATE INDEX idx_approvals_version ON blueprint_approvals(blueprint_version_id);
CREATE INDEX idx_approvals_user ON blueprint_approvals(approver_user_id, status);
```

---

## 7. Биржа контрагентов

### company_relationships
Связи между компаниями.

```sql
CREATE TYPE relationship_type AS ENUM ('supplier', 'client', 'partner');
CREATE TYPE relationship_status AS ENUM ('anonymous', 'revealed', 'verified');

CREATE TABLE company_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_a_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    company_b_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    status relationship_status DEFAULT 'anonymous',
    trust_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revealed_at TIMESTAMP WITH TIME ZONE,

    CHECK (company_a_id != company_b_id),
    UNIQUE(company_a_id, company_b_id)
);

CREATE INDEX idx_relationships_company_a ON company_relationships(company_a_id);
CREATE INDEX idx_relationships_company_b ON company_relationships(company_b_id);
```

### contractor_requests
Заявки на поиск исполнителей.

```sql
CREATE TYPE request_status AS ENUM ('open', 'in_progress', 'closed', 'cancelled');

CREATE TABLE contractor_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posted_by_company_id UUID NOT NULL REFERENCES companies(id),
    posted_by_user_id UUID NOT NULL REFERENCES users(id),
    order_id UUID REFERENCES orders(id),

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),
    deadline TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),

    status request_status DEFAULT 'open',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contractor_requests_company ON contractor_requests(posted_by_company_id);
CREATE INDEX idx_contractor_requests_status ON contractor_requests(status, created_at DESC);
CREATE INDEX idx_contractor_requests_skills ON contractor_requests USING gin(required_skills);
```

### contractor_responses
Отклики на заявки.

```sql
CREATE TYPE response_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE contractor_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES contractor_requests(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES users(id),

    proposal TEXT NOT NULL,
    proposed_price DECIMAL(15, 2),
    estimated_duration INTEGER,
    portfolio_links TEXT[] DEFAULT '{}',

    status response_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(request_id, company_id)
);

CREATE INDEX idx_responses_request ON contractor_responses(request_id, status);
CREATE INDEX idx_responses_company ON contractor_responses(company_id);
```

---

*Продолжение следует в части 2...*
