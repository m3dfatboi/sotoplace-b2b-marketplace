.PHONY: help install dev test lint format clean docker-up docker-down migrate

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	cd backend && pip install -r requirements.txt

dev: ## Run development server
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test: ## Run tests
	cd backend && pytest -v

test-cov: ## Run tests with coverage
	cd backend && pytest --cov=app --cov-report=html --cov-report=term

lint: ## Run linters
	cd backend && ruff check app/ tests/
	cd backend && mypy app/

format: ## Format code
	cd backend && black app/ tests/
	cd backend && ruff check app/ tests/ --fix

clean: ## Clean cache and temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +

docker-up: ## Start all services with Docker Compose
	docker-compose up -d

docker-down: ## Stop all services
	docker-compose down

docker-logs: ## Show logs from all services
	docker-compose logs -f

docker-build: ## Rebuild Docker images
	docker-compose up -d --build

migrate: ## Run database migrations
	cd backend && alembic upgrade head

migrate-create: ## Create new migration (use: make migrate-create MSG="description")
	cd backend && alembic revision --autogenerate -m "$(MSG)"

migrate-down: ## Rollback last migration
	cd backend && alembic downgrade -1

seed: ## Seed database with test data
	cd backend && python -m scripts.seed_data

db-shell: ## Connect to PostgreSQL shell
	docker-compose exec postgres psql -U postgres -d sotoplace

redis-cli: ## Connect to Redis CLI
	docker-compose exec redis redis-cli

backend-shell: ## Open shell in backend container
	docker-compose exec backend bash

setup: ## Initial setup (install + migrate)
	make install
	make migrate

reset-db: ## Reset database (WARNING: deletes all data)
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	make migrate
