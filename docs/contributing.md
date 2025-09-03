# Contributing to URL Shortener

Quick guide for contributing to this microservices project.

## Overview

Microservices URL shortener with:

- **Frontend**: Vue.js + Ant Design
- **API Gateway**: Traefik
- **User Service**: Java Spring Boot + PostgreSQL
- **URL Service**: NestJS + MongoDB
- **Redirect Service**: Go + Redis

## Quick Start

### Prerequisites

- [Docker Desktop](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

### Setup

```bash
git clone https://github.com/ltphat2204/url-shortener.git
cd url-shortener

# Start all services
make all

# Or individual services
make frontend
make user-service
make url-service
make redirect-service
```

### Access

- **Frontend**: http://localhost:3030 (Docker)
- **API Gateway**: http://localhost:8081/dashboard/ (Traefik Dashboard)
- **Local dev ports**: vary by service (see individual READMEs)

## Project Structure

```
url-shortener/
├── front-end/               # Vue.js frontend
├── user-service/            # Java Spring Boot
├── url-service/             # NestJS TypeScript
├── redirect-service/        # Go service
├── api-gateway/             # Traefik config
├── cache/                   # Redis config
└── Makefile                 # Build commands
```

## Development

### 1. Create Branch

```bash
git checkout -b feature/your-feature
```

### 2. Develop in Services

**Frontend**

```bash
cd front-end
npm install && npm run dev
```

**User Service**

```bash
cd user-service
mvn spring-boot:run
```

**URL Service**

```bash
cd url-service
npm install && npm run dev
```

**Redirect Service**

```bash
cd redirect-service
go run main.go
```

### 3. Test & Build

```bash
make test                    # Test changes
make all                     # Build with Docker
```

## Standards

- Follow language conventions
- Write clear commit messages
- Test your changes

### Languages

- **JS/TS**: ESLint + Vue style guide
- **Java**: Spring Boot conventions
- **Go**: `go fmt` + proper error handling

## Commands

```bash
# Development
make all                     # Start all services
make <service-name>          # Start specific service
make clean                   # Stop all services

# Service level
make up/down                 # Start/stop service
make logs                    # View logs
make test                    # Run tests
```

## Pull Requests

1. **Format**: `[Service]: Description`
2. **Test first**: `make test && make lint`
3. **Reference issues** if applicable

### Commit Format

```
[Service]: Brief description

Details if needed
- Breaking changes
- Fixes #123
```

## Common Issues

**Docker problems**

```bash
make clean
docker system prune -f
make all
```

**Database issues**

```bash
# URL Service
cd url-service && npx prisma migrate reset

# User Service
cd user-service && make postgres
```

---

Questions? Create GitHub issues.
