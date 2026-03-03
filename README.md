# 🎯 Sotoplace B2B Marketplace - Backend API

**Production-ready B2B marketplace backend with 82+ API endpoints**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/m3dfatboi/sotoplace-b2b-marketplace)

---

## 📊 Project Status

**Backend: 100% Complete ✅**
- 82+ API endpoints
- 11 modules
- 56+ tests
- Full documentation

**Frontend: Not included** (backend-only repository)

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone repository
git clone https://github.com/m3dfatboi/sotoplace-b2b-marketplace.git
cd sotoplace-b2b-marketplace

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Seed test data
docker-compose exec backend python -m scripts.seed_data
```

### Access

- **API Documentation**: http://localhost:8000/docs
- **Celery Flower**: http://localhost:5555

### Test Credentials

```
Admin:   admin@sotoplace.com / admin123
Manager: manager@sotoplace.com / manager123
Client:  client@sotoplace.com / client123
```

---

## 📚 Features

### Core Modules

1. **Authentication** (3 endpoints)
   - JWT token-based auth
   - User registration
   - Password management

2. **Companies** (6 endpoints)
   - Multi-tenant architecture
   - Role-based access control
   - Member management

3. **Products** (10 endpoints)
   - Product catalog
   - Variants support
   - Full-text search
   - Publishing workflow

4. **Orders** (9 endpoints)
   - Complex workflow
   - Status tracking
   - Items management
   - Auto-calculation

5. **Chats** (8 endpoints + WebSocket)
   - Real-time messaging
   - File attachments
   - Read receipts
   - Typing indicators

6. **Notifications** (10 endpoints)
   - Multi-channel (email, push, SMS)
   - Preferences management
   - Statistics

7. **Blueprints** (7 endpoints)
   - Version control
   - Approval workflow
   - File upload support

8. **Analytics** (7 endpoints)
   - Company metrics
   - Order analytics
   - Performance tracking

9. **Contractors** (10 endpoints)
   - Marketplace
   - Proposals system
   - Skills filtering

10. **Health** (5 endpoints)
    - Kubernetes probes
    - Metrics
    - Version info

11. **Background Tasks** (9 Celery tasks)
    - Email notifications
    - Analytics calculation
    - Data cleanup

---

## 🛠 Tech Stack

- **Framework**: FastAPI (async)
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0 (async)
- **Cache/Queue**: Redis 7
- **Task Queue**: Celery
- **Monitoring**: Celery Flower
- **Containerization**: Docker Compose

---

## 📖 Documentation

- [Setup Guide](SETUP.md)
- [Quick Start](QUICKSTART.md)
- [Database Schema](docs/architecture/DATABASE_SCHEMA.md)
- [System Architecture](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [API Testing Guide](API_READY.md)
- [Project Completion Report](PROJECT_COMPLETE.md)

---

## 🧪 Testing

```bash
# Run all tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=app tests/

# Run specific test file
docker-compose exec backend pytest tests/test_orders.py
```

**Test Coverage**: 56+ tests across 7 test files

---

## 🔧 Development

```bash
# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1

# View logs
docker-compose logs -f backend
```

---

## 📦 API Endpoints Summary

```
Authentication:     3 endpoints
Users:              3 endpoints
Companies:          6 endpoints
Products:          10 endpoints
Orders:             9 endpoints
Chats:              8 endpoints
Notifications:     10 endpoints
Blueprints:         7 endpoints
Analytics:          7 endpoints
Contractors:       10 endpoints
Health:             5 endpoints
WebSocket:          1 endpoint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:             82+ endpoints
```

---

## 🌟 Key Features

- ✅ Multi-tenant architecture
- ✅ Role-based access control (RBAC)
- ✅ Real-time WebSocket communication
- ✅ Background task processing
- ✅ Multi-channel notifications
- ✅ Full-text search
- ✅ File upload & versioning
- ✅ Analytics & reporting
- ✅ Comprehensive test suite
- ✅ Docker environment
- ✅ Health check endpoints
- ✅ Complete documentation

---

## 📝 License

Proprietary - Sotoplace B2B Marketplace

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## 📞 Support

For questions or issues, check the documentation or create an issue on GitHub.

---

**Repository**: https://github.com/m3dfatboi/sotoplace-b2b-marketplace

**Status**: ✅ Production Ready (Backend)

**Last Updated**: 2026-03-03
