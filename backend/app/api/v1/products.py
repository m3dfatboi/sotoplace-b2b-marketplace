"""Product API endpoints"""

from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_active_user
from app.db import get_db
from app.models import Company, CompanyMember, Product, ProductVariant, User
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
    ProductVariantCreate,
    ProductVariantResponse,
    ProductVariantUpdate,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a new product

    User must be admin or manager of the company
    """
    # Check if user is member with appropriate role
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product_data.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role.in_(["admin", "manager"]),
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or manager can create products",
        )

    # Create product
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
        created_by=current_user.id,
    )

    db.add(product)
    await db.commit()
    await db.refresh(product)

    return product


@router.get("", response_model=List[ProductResponse])
async def list_products(
    company_id: Optional[UUID] = Query(None, description="Filter by company"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    is_published: Optional[bool] = Query(None, description="Filter by published status"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of records to return"),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    List products with filters

    - **company_id**: filter by company
    - **category**: filter by category
    - **search**: search in name and description
    - **is_published**: filter by published status
    - **skip**: pagination offset
    - **limit**: pagination limit (max 100)
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
    products = result.scalars().all()

    return products


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get product by ID
    """
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update product

    User must be admin or manager of the company
    """
    # Get product
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check permissions
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role.in_(["admin", "manager"]),
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or manager can update products",
        )

    # Update fields
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


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete product

    User must be admin of the company
    """
    # Get product
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check permissions (only admin can delete)
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role == "admin",
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete products",
        )

    await db.delete(product)
    await db.commit()


@router.post("/{product_id}/publish", response_model=ProductResponse)
async def publish_product(
    product_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Publish product (make it visible in catalog)

    User must be admin or manager of the company
    """
    # Get product
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check permissions
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role.in_(["admin", "manager"]),
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or manager can publish products",
        )

    product.is_published = True
    await db.commit()
    await db.refresh(product)

    return product


# Product Variants endpoints

@router.post("/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED)
async def create_product_variant(
    product_id: UUID,
    variant_data: ProductVariantCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Create a product variant

    User must be admin or manager of the company
    """
    # Get product
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check permissions
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role.in_(["admin", "manager"]),
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or manager can create variants",
        )

    # Create variant
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


@router.get("/{product_id}/variants", response_model=List[ProductVariantResponse])
async def list_product_variants(
    product_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    List all variants of a product
    """
    result = await db.execute(
        select(ProductVariant).where(ProductVariant.product_id == product_id)
    )
    variants = result.scalars().all()

    return variants


@router.patch("/{product_id}/variants/{variant_id}", response_model=ProductVariantResponse)
async def update_product_variant(
    product_id: UUID,
    variant_id: UUID,
    variant_data: ProductVariantUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Update product variant

    User must be admin or manager of the company
    """
    # Get product
    product_result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = product_result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check permissions
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role.in_(["admin", "manager"]),
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or manager can update variants",
        )

    # Get variant
    variant_result = await db.execute(
        select(ProductVariant).where(
            ProductVariant.id == variant_id,
            ProductVariant.product_id == product_id,
        )
    )
    variant = variant_result.scalar_one_or_none()

    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variant not found",
        )

    # Update fields
    if variant_data.name is not None:
        variant.name = variant_data.name
    if variant_data.sku is not None:
        variant.sku = variant_data.sku
    if variant_data.price_modifier is not None:
        variant.price_modifier = variant_data.price_modifier
    if variant_data.attributes is not None:
        variant.attributes = variant_data.attributes
    if variant_data.stock_quantity is not None:
        variant.stock_quantity = variant_data.stock_quantity
    if variant_data.is_available is not None:
        variant.is_available = variant_data.is_available

    await db.commit()
    await db.refresh(variant)

    return variant


@router.delete("/{product_id}/variants/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product_variant(
    product_id: UUID,
    variant_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete product variant

    User must be admin or manager of the company
    """
    # Get product
    product_result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    product = product_result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check permissions
    member_result = await db.execute(
        select(CompanyMember).where(
            CompanyMember.company_id == product.company_id,
            CompanyMember.user_id == current_user.id,
            CompanyMember.role.in_(["admin", "manager"]),
            CompanyMember.is_active == True,
        )
    )
    member = member_result.scalar_one_or_none()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or manager can delete variants",
        )

    # Get variant
    variant_result = await db.execute(
        select(ProductVariant).where(
            ProductVariant.id == variant_id,
            ProductVariant.product_id == product_id,
        )
    )
    variant = variant_result.scalar_one_or_none()

    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Variant not found",
        )

    await db.delete(variant)
    await db.commit()
