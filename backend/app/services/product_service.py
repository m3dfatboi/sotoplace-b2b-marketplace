"""Product service for business logic"""

from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Product, ProductVariant
from app.schemas.product import ProductCreate, ProductUpdate, ProductVariantCreate


class ProductService:
    """Service for product-related business logic"""

    @staticmethod
    async def create_product(
        db: AsyncSession,
        product_data: ProductCreate,
        creator_id: UUID,
    ) -> Product:
        """
        Create a new product

        Args:
            db: Database session
            product_data: Product creation data
            creator_id: User creating the product

        Returns:
            Created product
        """
        product = Product(
            company_id=product_data.company_id,
            name=product_data.name,
            description=product_data.description,
            category=product_data.category,
            base_price=product_data.base_price,
            price_type=product_data.price_type,
            is_customizable=product_data.is_customizable,
            images=product_data.images,
            specifications=product_data.specifications,
            created_by=creator_id,
        )

        db.add(product)
        await db.commit()
        await db.refresh(product)

        return product

    @staticmethod
    async def get_by_id(db: AsyncSession, product_id: UUID) -> Optional[Product]:
        """Get product by ID"""
        result = await db.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def search_products(
        db: AsyncSession,
        company_id: Optional[UUID] = None,
        category: Optional[str] = None,
        search: Optional[str] = None,
        is_published: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Product]:
        """
        Search products with filters

        Args:
            db: Database session
            company_id: Filter by company
            category: Filter by category
            search: Search in name and description
            is_published: Filter by published status
            skip: Pagination offset
            limit: Pagination limit

        Returns:
            List of products
        """
        query = select(Product)

        # Apply filters
        if company_id:
            query = query.where(Product.company_id == company_id)
        if category:
            query = query.where(Product.category == category)
        if search:
            query = query.where(
                or_(
                    Product.name.ilike(f"%{search}%"),
                    Product.description.ilike(f"%{search}%"),
                )
            )
        if is_published is not None:
            query = query.where(Product.is_published == is_published)

        # Apply pagination
        query = query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def update_product(
        db: AsyncSession,
        product: Product,
        product_data: ProductUpdate,
    ) -> Product:
        """Update product"""
        if product_data.name is not None:
            product.name = product_data.name
        if product_data.description is not None:
            product.description = product_data.description
        if product_data.category is not None:
            product.category = product_data.category
        if product_data.base_price is not None:
            product.base_price = product_data.base_price
        if product_data.price_type is not None:
            product.price_type = product_data.price_type
        if product_data.is_customizable is not None:
            product.is_customizable = product_data.is_customizable
        if product_data.images is not None:
            product.images = product_data.images
        if product_data.specifications is not None:
            product.specifications = product_data.specifications
        if product_data.is_published is not None:
            product.is_published = product_data.is_published

        await db.commit()
        await db.refresh(product)

        return product

    @staticmethod
    async def publish_product(db: AsyncSession, product: Product) -> Product:
        """Publish product (make visible in catalog)"""
        product.is_published = True
        await db.commit()
        await db.refresh(product)

        return product

    @staticmethod
    async def unpublish_product(db: AsyncSession, product: Product) -> Product:
        """Unpublish product (hide from catalog)"""
        product.is_published = False
        await db.commit()
        await db.refresh(product)

        return product

    @staticmethod
    async def delete_product(db: AsyncSession, product: Product) -> None:
        """Delete product"""
        await db.delete(product)
        await db.commit()

    @staticmethod
    async def create_variant(
        db: AsyncSession,
        product_id: UUID,
        variant_data: ProductVariantCreate,
    ) -> ProductVariant:
        """Create product variant"""
        variant = ProductVariant(
            product_id=product_id,
            name=variant_data.name,
            sku=variant_data.sku,
            price_modifier=variant_data.price_modifier,
            attributes=variant_data.attributes,
            stock_quantity=variant_data.stock_quantity,
        )

        db.add(variant)
        await db.commit()
        await db.refresh(variant)

        return variant

    @staticmethod
    async def get_product_variants(
        db: AsyncSession,
        product_id: UUID,
    ) -> List[ProductVariant]:
        """Get all variants of a product"""
        result = await db.execute(
            select(ProductVariant).where(ProductVariant.product_id == product_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_variant_by_id(
        db: AsyncSession,
        variant_id: UUID,
    ) -> Optional[ProductVariant]:
        """Get variant by ID"""
        result = await db.execute(
            select(ProductVariant).where(ProductVariant.id == variant_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def calculate_variant_price(
        product: Product,
        variant: ProductVariant,
    ) -> float:
        """
        Calculate final price for variant

        Args:
            product: Product
            variant: Product variant

        Returns:
            Final price (base_price + price_modifier)
        """
        base = float(product.base_price) if product.base_price else 0
        modifier = float(variant.price_modifier) if variant.price_modifier else 0
        return base + modifier
