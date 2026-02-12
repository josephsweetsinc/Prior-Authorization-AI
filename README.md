# Prior Authorization AI (PAAI)

A comprehensive FastAPI-based backend system for managing prior authorization requests with AI-powered document processing and analysis capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Development](#development)

## 🎯 Overview

Prior Authorization AI is a modern healthcare management system designed to streamline the prior authorization process. The system leverages AI (OpenAI GPT models) to analyze medical documents, automate request processing, and provide intelligent insights for healthcare providers and administrators.

### Key Features

- **AI-Powered Document Analysis**: Automated processing of medical documents using LangChain and OpenAI
- **Prior Authorization Management**: Complete workflow for ambulance request submissions and approvals
- **Real-time Notifications**: WebSocket-based real-time updates and notifications
- **Report Generation**: Automated PDF and Excel report generation
- **Dashboard Analytics**: Comprehensive statistics and KPI tracking
- **User Management**: Role-based access control (Admin, User)
- **Document Storage**: AWS S3 integration for secure document storage
- **Asynchronous Task Processing**: Celery-based background job processing

## 🛠 Technology Stack

### Core Framework
- **FastAPI** - Modern, high-performance web framework
- **Python 3.13** - Latest Python version with enhanced performance
- **Uvicorn** - ASGI server for production deployment

### Database & Caching
- **PostgreSQL 17.5** - Primary relational database
- **SQLAlchemy 2.0** - ORM with async support
- **Alembic** - Database migration management
- **Redis 7** - Caching and message broker

### AI & Document Processing
- **LangChain** - LLM application framework
- **OpenAI GPT-4** - Document analysis and processing
- **PyMuPDF** - PDF processing and rendering
- **Pillow** - Image processing

### Task Queue & Background Jobs
- **Celery** - Distributed task queue
- **Celery Beat** - Periodic task scheduler

### Cloud Services
- **AWS S3** - Document and file storage
- **Boto3** - AWS SDK for Python

### Authentication & Security
- **Python-JOSE** - JWT token generation and validation
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation and settings management

### Development Tools
- **UV** - Fast Python package installer and resolver
- **Ruff** - Extremely fast Python linter and formatter
- **MyPy** - Static type checking
- **Pytest** - Testing framework
- **Pre-commit** - Git hooks for code quality

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Terraform** - Infrastructure as Code (AWS deployment)
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
prior-authorization-ai/
├── config/                 # Application configuration
│   ├── settings.py        # Environment-based settings management
│   ├── database.py        # Database connection and session management
│   ├── logger.py          # Logging configuration
│   ├── router.py          # API router initialization
│   └── celery.py          # Celery task queue configuration
│
├── models/                # SQLAlchemy database models
│   ├── user.py           # User and authentication models
│   ├── ambulance_request.py
│   ├── notification.py
│   └── ...               # Other domain models
│
├── schemas/              # Pydantic schemas for request/response validation
│   ├── user.py
│   ├── auth.py
│   ├── report.py
│   └── ...
│
├── endpoints/            # FastAPI route handlers
│   ├── auth.py          # Authentication endpoints
│   ├── user.py          # User management endpoints
│   ├── ambulance_request.py
│   ├── reports.py       # Report generation endpoints
│   ├── dashboard.py     # Dashboard and analytics
│   ├── websocket.py     # WebSocket connections
│   └── ...
│
├── services/            # Business logic layer
│   ├── auth.py         # Authentication service
│   ├── user.py         # User management service
│   ├── ambulance_request.py
│   ├── report.py       # Report generation service
│   ├── dashboard.py    # Dashboard metrics service
│   ├── ai/             # AI-related services
│   │   ├── document_analyzer.py
│   │   └── prompts.py
│   ├── aws/            # AWS integration services
│   │   └── s3.py
│   ├── jwt/            # JWT token services
│   └── ...
│
├── dao/                # Data Access Objects (database operations)
│   ├── user.py
│   ├── ambulance_request.py
│   └── ...
│
├── dto/                # Data Transfer Objects
│   └── ...
│
├── dependencies/       # FastAPI dependency injection
│   ├── auth.py        # Authentication dependencies
│   └── ...
│
├── exceptions/         # Custom exception classes
│   ├── auth.py
│   ├── user.py
│   └── ...
│
├── core/              # Core utilities and helpers
│   ├── exception_handler.py
│   ├── service_factory.py
│   └── ...
│
├── tasks/             # Celery background tasks
│   ├── notifications.py
│   ├── reminders.py
│   └── ...
│
├── tests/             # Test suite
│   ├── endpoints/    # API endpoint tests
│   ├── services/     # Service layer tests
│   └── fixtures/     # Test fixtures and utilities
│
├── scripts/           # Utility scripts
│   └── create_admin_user.py
│
├── terraform/         # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── terraform.tfvars
│
├── .github/           # GitHub Actions workflows
│   └── workflows/
│
├── main.py           # Application entry point
├── pyproject.toml    # Project dependencies and configuration
├── Dockerfile        # Docker container definition
├── compose.yml       # Production Docker Compose
├── local.compose.yml # Local development Docker Compose
├── Makefile          # Development commands
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.13+** - [Download Python](https://www.python.org/downloads/)
- **UV** - Fast Python package manager
  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```
- **Docker & Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **PostgreSQL 17.5** (if running without Docker)
- **Redis 7** (if running without Docker)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd prior-authorization-ai
```

#### 2. Install Dependencies

```bash
make install
# or
uv sync
```

#### 3. Environment Configuration

Create a `.env.dev` file in the project root:

```bash
# API Configuration
API_TITLE=PAAI API
API_VERSION=v1
ENV=dev
LOG_LEVEL=DEBUG
DEBUG=true

# Database Configuration
DB_URL=postgresql+asyncpg://postgres:qwerty123@localhost:5432/paai_db
# Or individual parameters:
# DB_USER=postgres
# DB_PASSWORD=qwerty123
# DB_HOST=localhost
# DB_PORT=5432
# DB_DB_NAME=paai_db
# DB_SSL=false

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
# Or individual parameters:
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_DB=0

# JWT Token Settings
TOKEN_SECRET_KEY=your-secret-key-here-change-in-production
TOKEN_ALGORITHM=HS256
TOKEN_ACCESS_TOKEN_EXPIRE_MINUTES=15
TOKEN_REFRESH_TOKEN_EXPIRE_DAYS=30

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# OpenAI Configuration
LLM_OPENAI_API_KEY=your-openai-api-key
LLM_MODEL_NAME=gpt-4o-mini
LLM_TEMPERATURE=0.0
LLM_MAX_TOKENS=4096
LLM_PDF_RENDER_DPI=150
LLM_PDF_MAX_PAGES=15

# Email Configuration (optional)
EMAIL_ADMIN_EMAIL=admin@example.com
EMAIL_SMTP_HOST=localhost
EMAIL_SMTP_PORT=587
EMAIL_USE_TLS=true

# Reminder Settings
REMINDER_DAYS=[30, 15, 7]
```

#### 4. Start Infrastructure Services

Using Docker Compose (recommended):

```bash
# Start PostgreSQL, Redis, Celery Worker, and Celery Beat
docker compose -f local.compose.yml up -d
```

Or install and run services manually:
- PostgreSQL 17.5 on port 5432
- Redis 7 on port 6379

#### 5. Run Database Migrations

```bash
make migrate
# or
uv run alembic -c models/alembic.ini upgrade head
```

#### 6. Create Admin User

```bash
make create-admin EMAIL=admin@example.com PASSWORD=securepassword
# or
uv run python scripts/create_admin_user.py admin@example.com securepassword
```

### Running the Application

#### Development Mode (with auto-reload)

```bash
make run-dev
# or
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Production Mode

```bash
make run
# or
uv run python main.py
```

#### Using Docker Compose

```bash
# Start all services including API
docker compose up -d

# View logs
make compose-logs

# Stop services
make compose-down
```

The API will be available at:
- **Local**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 🌐 Deployment

### AWS EC2 Deployment (Automated)

This project includes automated deployment to AWS EC2 using Terraform and GitHub Actions.

#### Prerequisites

1. AWS Account with appropriate permissions
2. GitHub repository secrets configured:
   - `SSH_KEY` - Private SSH key for server access
   - `SSH_KEY_PUB` - Public SSH key
   - `ENV` - Production environment variables (.env file content)
   - `AWS_ACCESS_KEY_ID` - AWS IAM access key
   - `AWS_SECRET_ACCESS_KEY` - AWS IAM secret key
   - `AWS_REGION` - AWS region (e.g., us-east-1)

#### Deployment Steps

1. **Configure Infrastructure**

   Edit `terraform/terraform.tfvars` to customize your deployment:
   ```hcl
   # EC2 Instance Configuration
   ports = ["22", "80", "443"]  # Inbound ports
   type  = "t2.micro"           # Instance type
   ```

2. **Deploy Infrastructure**

   Push to the main branch or manually trigger the "Deploy Project" GitHub Action:
   ```bash
   git push origin main
   ```

   This will:
   - Create VPC and networking resources
   - Deploy EC2 instance with static Elastic IP
   - Install Docker and configure Git
   - Pull the repository and start services
   - Configure SSL (if domain is configured)

3. **Deploy Code Changes**

   For subsequent code deployments, trigger the "Deploy Changes to Dev" action or push to the deployment branch.

#### Manual Deployment

1. **Build Docker Image**
   ```bash
   docker build -t paai-api .
   ```

2. **Configure Environment**
   - Copy `.env_prod` to `.env` on the server
   - Update all production values

3. **Run with Docker Compose**
   ```bash
   docker compose up -d
   ```

4. **Run Migrations**
   ```bash
   docker compose exec paai_api uv run alembic -c models/alembic.ini upgrade head
   ```

### Environment Variables for Production

Ensure all sensitive values are properly configured in production:

- Use strong `TOKEN_SECRET_KEY`
- Configure proper database credentials
- Set up AWS IAM roles (preferred) or credentials
- Configure production email SMTP settings
- Use production-grade OpenAI API keys with appropriate rate limits

## 📚 API Documentation

### Interactive API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

#### User Management
- `GET /api/v1/user/me` - Get current user profile
- `PUT /api/v1/user/me` - Update user profile
- `GET /api/v1/user/list` - List all users (admin)

#### Ambulance Requests
- `POST /api/v1/ambulance-request` - Create new request
- `GET /api/v1/ambulance-request/{id}` - Get request details
- `PUT /api/v1/ambulance-request/{id}` - Update request
- `GET /api/v1/ambulance-request/list` - List requests with pagination

#### Reports
- `POST /api/v1/reports/generate` - Generate PDF/Excel report
- `GET /api/v1/reports/latest` - Get latest reports with statistics

#### Dashboard
- `GET /api/v1/dashboard/metrics` - Get dashboard metrics and KPIs

#### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/{id}/read` - Mark notification as read

#### WebSocket
- `WS /api/v1/ws` - WebSocket connection for real-time updates

## 🧪 Testing

### Run All Tests

```bash
make test
# or
uv run pytest
```

### Run Specific Test File

```bash
uv run pytest tests/endpoints/test_auth.py
```

### Run with Coverage

```bash
uv run pytest --cov=. --cov-report=html
```

### Test Structure

- `tests/endpoints/` - API endpoint integration tests
- `tests/services/` - Business logic unit tests
- `tests/fixtures/` - Shared test fixtures and utilities

## 💻 Development

### Code Quality Tools

#### Format Code
```bash
make format
# or
uv run ruff format .
```

#### Lint Code
```bash
make lint
# or
uv run ruff check .
```

#### Type Checking
```bash
make type-check
# or
uv run mypy .
```

#### Pre-commit Hooks

Install pre-commit hooks to automatically run checks before commits:

```bash
uv run pre-commit install
```

### Database Migrations

#### Create New Migration
```bash
make migrate-create MESSAGE="add user profile fields"
# or
uv run alembic -c models/alembic.ini revision --autogenerate -m "add user profile fields"
```

#### Apply Migrations
```bash
make migrate-up
```

#### Rollback Migration
```bash
make migrate-down
```

#### View Migration History
```bash
make migrate-history
```

### Makefile Commands

The project includes a comprehensive Makefile with helpful commands:

```bash
make help              # Show all available commands
make setup             # Initial project setup
make install           # Install dependencies
make run               # Run application
make run-dev           # Run with auto-reload
make test              # Run tests
make format            # Format code
make lint              # Lint code
make type-check        # Type checking
make clean             # Clean temporary files
make compose-up        # Start Docker services
make compose-down      # Stop Docker services
make compose-logs      # View Docker logs
make migrate           # Run migrations
make create-admin      # Create admin user
```

## 🏗 Architecture

### Layered Architecture

The application follows a clean, layered architecture:

1. **Endpoints Layer** (`endpoints/`) - FastAPI route handlers, request/response handling
2. **Services Layer** (`services/`) - Business logic, orchestration
3. **DAO Layer** (`dao/`) - Data access, database operations
4. **Models Layer** (`models/`) - SQLAlchemy ORM models
5. **Schemas Layer** (`schemas/`) - Pydantic validation schemas

### Key Design Patterns

- **Dependency Injection**: FastAPI's dependency system for service instantiation
- **Repository Pattern**: DAO layer abstracts database operations
- **Service Layer Pattern**: Business logic separated from HTTP concerns
- **Factory Pattern**: Service factory for dependency management
- **Observer Pattern**: WebSocket manager for real-time notifications

### Asynchronous Processing

- **Async/Await**: Full async support with asyncio and asyncpg
- **Background Tasks**: Celery for long-running operations
- **Periodic Tasks**: Celery Beat for scheduled jobs (reminders, cleanup)

### Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-Based Access Control**: Admin and user roles
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Pydantic schemas for all inputs

## 📝 License

[Add your license information here]

## 👥 Contributing

[Add contributing guidelines here]

## 📞 Support

For questions or issues, please contact DevOps or open an issue in the repository.

---

**Happy Coding! 🚀**
