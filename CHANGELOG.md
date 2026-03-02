# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Database schema design (30+ tables)
- FastAPI backend with async SQLAlchemy
- Alembic migrations setup
- Docker and docker-compose configuration
- Core SQLAlchemy models:
  - User model with authentication
  - Company model (multi-tenant)
  - CompanyMember model (user-company relationships)
  - Product and ProductVariant models
  - Order, OrderItem, OrderItemSupplier models
- Security utilities (JWT, password hashing)
- Comprehensive documentation:
  - Database schema documentation
  - System architecture overview
  - Development guide
  - Quick start guide
  - Session context for AI assistants
- Development tools configuration (black, ruff, mypy)
- Makefile with common commands

## [0.1.0] - 2026-03-02

### Added
- Initial release
- Project structure and foundation
