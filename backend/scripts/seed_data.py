"""Seed database with test data"""

import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal
from app.models import (
    Company,
    CompanyMember,
    CompanySettings,
    Order,
    OrderItem,
    Product,
    ProductVariant,
    User,
)


async def seed_data():
    """Seed database with test data"""
    async with AsyncSessionLocal() as db:
        print("🌱 Seeding database...")

        # Create users
        print("Creating users...")
        admin_user = User(
            id=uuid.uuid4(),
            email="admin@sotoplace.com",
            password_hash=get_password_hash("admin123"),
            full_name="Admin User",
            phone="+7 (999) 123-45-67",
        )
        db.add(admin_user)

        manager_user = User(
            id=uuid.uuid4(),
            email="manager@sotoplace.com",
            password_hash=get_password_hash("manager123"),
            full_name="Manager User",
            phone="+7 (999) 234-56-78",
        )
        db.add(manager_user)

        client_user = User(
            id=uuid.uuid4(),
            email="client@sotoplace.com",
            password_hash=get_password_hash("client123"),
            full_name="Client User",
            phone="+7 (999) 345-67-89",
        )
        db.add(client_user)

        await db.flush()
        print(f"✅ Created 3 users")

        # Create companies
        print("Creating companies...")
        manufacturer = Company(
            id=uuid.uuid4(),
            name="Производственная компания",
            legal_name='ООО "Производство"',
            inn="1234567890",
            description="Производство металлоконструкций и мебели",
            tags=["металлообработка", "сборка мебели", "производство"],
            is_verified=True,
            is_public=True,
        )
        db.add(manufacturer)

        buyer = Company(
            id=uuid.uuid4(),
            name="Строительная компания",
            legal_name='ООО "Стройка"',
            inn="0987654321",
            description="Строительство и ремонт",
            tags=["строительство", "ремонт"],
            is_verified=True,
            is_public=True,
        )
        db.add(buyer)

        await db.flush()
        print(f"✅ Created 2 companies")

        # Add company members
        print("Adding company members...")
        members = [
            CompanyMember(
                id=uuid.uuid4(),
                user_id=admin_user.id,
                company_id=manufacturer.id,
                role="admin",
                joined_at=datetime.utcnow(),
            ),
            CompanyMember(
                id=uuid.uuid4(),
                user_id=manager_user.id,
                company_id=manufacturer.id,
                role="manager",
                joined_at=datetime.utcnow(),
            ),
            CompanyMember(
                id=uuid.uuid4(),
                user_id=client_user.id,
                company_id=buyer.id,
                role="admin",
                joined_at=datetime.utcnow(),
            ),
        ]
        for member in members:
            db.add(member)

        await db.flush()
        print(f"✅ Added {len(members)} company members")

        # Create products
        print("Creating products...")
        products_data = [
            {
                "name": "Металлический верстак",
                "description": "Профессиональный верстак для мастерской",
                "category": "Мебель для мастерских",
                "base_price": Decimal("45000.00"),
                "specifications": {
                    "material": "Сталь",
                    "dimensions": {"length": 2000, "width": 800, "height": 850, "unit": "mm"},
                    "weight": {"value": 120, "unit": "kg"},
                    "load_capacity": {"value": 500, "unit": "kg"},
                },
            },
            {
                "name": "Офисный стол",
                "description": "Современный офисный стол с регулировкой высоты",
                "category": "Офисная мебель",
                "base_price": Decimal("25000.00"),
                "specifications": {
                    "material": "ЛДСП + металл",
                    "dimensions": {"length": 1600, "width": 800, "height": 750, "unit": "mm"},
                    "adjustable_height": True,
                },
            },
            {
                "name": "Металлический стеллаж",
                "description": "Складской стеллаж для хранения",
                "category": "Складское оборудование",
                "base_price": Decimal("15000.00"),
                "specifications": {
                    "material": "Сталь оцинкованная",
                    "dimensions": {"length": 2000, "width": 600, "height": 2000, "unit": "mm"},
                    "shelves": 5,
                    "load_per_shelf": {"value": 200, "unit": "kg"},
                },
            },
        ]

        products = []
        for product_data in products_data:
            product = Product(
                id=uuid.uuid4(),
                company_id=manufacturer.id,
                name=product_data["name"],
                description=product_data["description"],
                category=product_data["category"],
                base_price=product_data["base_price"],
                price_type="fixed",
                is_customizable=True,
                specifications=product_data["specifications"],
                is_published=True,
                created_by=admin_user.id,
            )
            db.add(product)
            products.append(product)

        await db.flush()
        print(f"✅ Created {len(products)} products")

        # Create product variants
        print("Creating product variants...")
        variants = [
            ProductVariant(
                id=uuid.uuid4(),
                product_id=products[0].id,
                name="Верстак с тумбой",
                sku="BENCH-001-DRAWER",
                price_modifier=Decimal("5000.00"),
                attributes={"with_drawer": True, "drawer_count": 3},
                stock_quantity=Decimal("10"),
            ),
            ProductVariant(
                id=uuid.uuid4(),
                product_id=products[1].id,
                name="Стол белый",
                sku="DESK-001-WHITE",
                price_modifier=Decimal("0.00"),
                attributes={"color": "белый"},
                stock_quantity=Decimal("25"),
            ),
            ProductVariant(
                id=uuid.uuid4(),
                product_id=products[1].id,
                name="Стол черный",
                sku="DESK-001-BLACK",
                price_modifier=Decimal("2000.00"),
                attributes={"color": "черный"},
                stock_quantity=Decimal("15"),
            ),
        ]
        for variant in variants:
            db.add(variant)

        await db.flush()
        print(f"✅ Created {len(variants)} product variants")

        # Create orders
        print("Creating orders...")
        order = Order(
            id=uuid.uuid4(),
            order_number="ORD-2026-03-00001",
            buyer_company_id=buyer.id,
            seller_company_id=manufacturer.id,
            created_by_user_id=client_user.id,
            assigned_manager_id=manager_user.id,
            status="approved",
            payment_status="pending",
            total_amount=Decimal("0.00"),
            currency="RUB",
            payment_terms="Предоплата 50%, остаток после доставки",
            deadline=datetime.utcnow() + timedelta(days=30),
            approved_at=datetime.utcnow(),
            notes="Срочный заказ для нового офиса",
        )
        db.add(order)
        await db.flush()

        # Create order items
        order_items = [
            OrderItem(
                id=uuid.uuid4(),
                order_id=order.id,
                product_id=products[0].id,
                name="Металлический верстак",
                description="Верстак для мастерской",
                quantity=Decimal("5"),
                unit_price=Decimal("45000.00"),
                total_price=Decimal("225000.00"),
                specifications=products[0].specifications,
            ),
            OrderItem(
                id=uuid.uuid4(),
                order_id=order.id,
                product_id=products[1].id,
                variant_id=variants[1].id,
                name="Офисный стол (белый)",
                description="Стол с регулировкой высоты",
                quantity=Decimal("10"),
                unit_price=Decimal("25000.00"),
                total_price=Decimal("250000.00"),
                specifications=products[1].specifications,
            ),
        ]

        total = Decimal("0")
        for item in order_items:
            db.add(item)
            total += item.total_price

        order.total_amount = total
        await db.flush()
        print(f"✅ Created 1 order with {len(order_items)} items")

        await db.commit()

        print("\n✅ Database seeded successfully!")
        print("\n📧 Test credentials:")
        print("  Admin:   admin@sotoplace.com / admin123")
        print("  Manager: manager@sotoplace.com / manager123")
        print("  Client:  client@sotoplace.com / client123")
        print("\n🏢 Companies:")
        print(f"  Manufacturer: {manufacturer.name} ({manufacturer.id})")
        print(f"  Buyer: {buyer.name} ({buyer.id})")
        print("\n📦 Products created: 3")
        print("📋 Orders created: 1")


if __name__ == "__main__":
    asyncio.run(seed_data())
