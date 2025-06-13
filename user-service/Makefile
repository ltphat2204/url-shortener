# --- Variables ---
# Java Spring Service
SERVICE_NAME := user-service
# Assumes you are using the Maven wrapper.
BUILD_TOOL   := ./mvnw
# Standard location for the built JAR file from Maven's 'package' phase
JAR_FILE_PATH := target/

# Postgres Dependency (for local 'make run')
DB_CONTAINER_NAME := dev-postgres
DB_IMAGE          := postgres:17-alpine
DB_PORT           := 5432
DB_VOLUME         := dev-postgres-data
DB_NAME           := users
DB_USER           := postgres
DB_PASSWORD       := 12345
# This Makefile can use a .env file for Docker Compose if needed.
ENV_FILE          := .env

# --- Cross-Platform Helpers ---
# Set the correct 'remove directory' command based on the operating system
ifeq ($(OS),Windows_NT)
	RM = rmdir /s /q
else
	RM = rm -rf
endif


# ====================================================================================
# HELPERS
# ====================================================================================

.PHONY: help
## help: Show this help message.
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "--------------------------"
	@echo "  Development & Building "
	@echo "--------------------------"
	@echo "  run           Run the Spring Boot application locally (with devtools hot-reload)."
	@echo "  build         Build the executable JAR file using Maven."
	@echo "  test          Run all Java tests using Maven."
	@echo "  clean-build   Remove previous build artifacts (the 'target' directory)."
	@echo ""
	@echo "--------------------------"
	@echo "  Docker Environment     "
	@echo "--------------------------"
	@echo "  up            Start all services in the background using Docker Compose."
	@echo "  down          Stop and remove all Docker Compose services and networks."
	@echo "  logs          Follow the logs of all running services."
	@echo "  rebuild       Force a rebuild of the Docker images and restart services."
	@echo ""
	@echo "--------------------------"
	@echo "  Local Dependencies     "
	@echo "--------------------------"
	@echo "  postgres      Start the local PostgreSQL container for development."
	@echo "  postgres-stop Stop and remove the local PostgreSQL container."
	@echo "  postgres-logs Follow the logs of the local PostgreSQL container."
	@echo "  postgres-shell Open a 'psql' shell in the local PostgreSQL container."
	@echo ""
	@echo "--------------------------"
	@echo "  Housekeeping           "
	@echo "--------------------------"
	@echo "  clean         Run 'make down', 'make postgres-stop' and remove build artifacts."
	@echo "  help          Show this help message."


# ====================================================================================
# DEVELOPMENT & BUILDING (Java / Spring Boot with Maven)
# ====================================================================================

.PHONY: run build test clean-build

## run: Ensure local DB is running, then run the Spring Boot application.
run: postgres
	@echo "==> Starting Spring Boot service '$(SERVICE_NAME)'..."
	@echo "==> Note: Your service must be configured (e.g., application-dev.properties) to connect to localhost:$(DB_PORT)."
	@$(BUILD_TOOL) spring-boot:run

## build: Build the executable JAR file.
build:
	@echo "==> Building application '$(SERVICE_NAME)'..."
	@$(BUILD_TOOL) package
	@echo "==> Build complete: $(JAR_FILE_PATH)"

## test: Run all Java tests.
test:
	@echo "==> Running Java tests..."
	@$(BUILD_TOOL) test

## clean-build: Remove the target directory.
clean-build:
	@echo "==> Cleaning up build directory..."
	@$(BUILD_TOOL) clean


# ====================================================================================
# DOCKER ENVIRONMENT (using Docker Compose)
# ====================================================================================

.PHONY: up down logs rebuild

## up: Start all services defined in docker-compose.yml.
up:
	@echo "==> Starting '$(SERVICE_NAME)' stack with Docker Compose..."
	@docker compose up -d

## down: Stop and remove all containers, networks, and volumes from Docker Compose.
down:
	@echo "==> Stopping and removing all Docker Compose services and volumes..."
	@docker compose down -v --remove-orphans

## logs: Follow the logs of all running Docker Compose services.
logs:
	@echo "==> Tailing logs for all services. Press Ctrl+C to exit."
	@docker compose logs -f

## rebuild: Rebuild the Docker image and restart the services via Docker Compose.
rebuild:
	@echo "==> Rebuilding and restarting all services..."
	@docker compose up -d --build --force-recreate


# ====================================================================================
# LOCAL DEPENDENCIES (PostgreSQL for 'make run')
# ====================================================================================

.PHONY: postgres postgres-stop postgres-logs postgres-shell

## postgres: Start the local PostgreSQL container if stopped, or create it if it doesn't exist.
postgres:
	@echo "==> Ensuring local PostgreSQL container '$(DB_CONTAINER_NAME)' is running..."
	@docker start $(DB_CONTAINER_NAME) >/dev/null 2>&1 || \
	docker run -d \
		--name $(DB_CONTAINER_NAME) \
		-p $(DB_PORT):5432 \
		-e POSTGRES_DB=$(DB_NAME) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-v $(DB_VOLUME):/var/lib/postgresql/data \
		$(DB_IMAGE)
	@echo "==> Local PostgreSQL is running on localhost:$(DB_PORT)"

## postgres-stop: Stop and remove the local PostgreSQL container.
postgres-stop:
	@echo "==> Stopping and removing local PostgreSQL container '$(DB_CONTAINER_NAME)'..."
	@docker stop $(DB_CONTAINER_NAME) >/dev/null 2>&1 || true
	@docker rm $(DB_CONTAINER_NAME) >/dev/null 2>&1 || true
	@echo "==> Container stopped and removed."

## postgres-logs: Tail the logs of the running local PostgreSQL container.
postgres-logs:
	@echo "==> Tailing logs for '$(DB_CONTAINER_NAME)'. Press Ctrl+C to exit."
	@docker logs -f $(DB_CONTAINER_NAME)

## postgres-shell: Open an interactive psql shell to the local PostgreSQL container.
postgres-shell:
	@echo "==> Connecting to PostgreSQL shell in '$(DB_CONTAINER_NAME)'..."
	@docker exec -it $(DB_CONTAINER_NAME) psql -U $(DB_USER) -d $(DB_NAME)

# ====================================================================================
# HOUSEKEEPING
# ====================================================================================

.PHONY: clean

## clean: Stop all environments (Compose and local) and remove build artifacts.
clean: down postgres-stop clean-build
	@echo "==> Full cleanup complete."