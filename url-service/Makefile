# --- Variables ---
# Node.js Service
SERVICE_NAME := url-service
BUILD_DIR    := dist
# This Makefile uses npm as the package manager.
NPM          := npm

# Mongo Dependency (for local 'make run')
MONGO_CONTAINER_NAME := dev-mongo
MONGO_IMAGE          := mongo:latest
MONGO_PORT           := 27017
MONGO_VOLUME         := dev-mongo-data
# This Makefile assumes a .env file is present for service config.
ENV_FILE             := .env

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
	@echo "  run           Run the NestJS service in development mode (with hot-reload)."
	@echo "  build         Build the NestJS application for production."
	@echo "  test          Run all tests using Jest."
	@echo "  install       Install Node.js dependencies and generate Prisma client."
	@echo "  lint          Run the ESLint linter."
	@echo ""
	@echo "--------------------------"
	@echo "  Database & Migrations  "
	@echo "--------------------------"
	@echo "  migrate       Create and apply a new database migration via Prisma."
	@echo "  generate      Regenerate the Prisma Client from your schema."
	@echo "  db-push       Push schema changes to the DB without creating migration files."
	@echo "  format        Format the schema.prisma file."
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
	@echo "  mongo         Start the local MongoDB container for development."
	@echo "  mongo-stop    Stop and remove the local MongoDB container."
	@echo "  mongo-logs    Follow the logs of the local MongoDB container."
	@echo "  mongo-shell   Open a 'mongosh' shell in the local MongoDB container."
	@echo ""
	@echo "--------------------------"
	@echo "  Housekeeping           "
	@echo "--------------------------"
	@echo "  clean         Run 'make down', 'make mongo-stop' and remove build artifacts."
	@echo "  help          Show this help message."


# ====================================================================================
# DEVELOPMENT & BUILDING (Node.js / NestJS)
# ====================================================================================

.PHONY: run build test install lint

## run: Ensure dependencies and DB are ready, then run the NestJS service.
run: install mongo
	@echo "==> Starting NestJS service '$(SERVICE_NAME)' in dev mode..."
	@echo "==> Note: Your service must be configured (via .env) to connect to localhost:$(MONGO_PORT)."
	@$(NPM) run start:dev

## build: Install dependencies, then build the application.
build: install
	@echo "==> Building application '$(SERVICE_NAME)'..."
	@$(NPM) run build
	@echo "==> Build complete: ./$(BUILD_DIR)"

## test: Run all unit and e2e tests.
test:
	@echo "==> Running tests..."
	@$(NPM) run test

## install: Install Node.js dependencies and generate the Prisma client.
install:
	@echo "==> Installing Node.js dependencies..."
	@$(NPM) install
	@make generate

## lint: Run the linter.
lint:
	@echo "==> Linting code..."
	@$(NPM) run lint


# ====================================================================================
# DATABASE & MIGRATIONS (Prisma)
# ====================================================================================

.PHONY: migrate generate db-push format

## migrate: Ensure DB is running, then create and apply a new migration.
migrate: mongo
	@echo "==> Applying database migrations with Prisma..."
	@$(NPM) exec -- prisma migrate dev

## generate: Regenerate the Prisma Client.
generate:
	@echo "==> Generating Prisma Client..."
	@$(NPM) exec -- prisma generate

## db-push: Ensure DB is running, then push the schema to the database.
db-push: mongo
	@echo "==> Pushing schema to the database (no migration file created)..."
	@$(NPM) exec -- prisma db push

## format: Format the Prisma schema file.
format:
	@echo "==> Formatting Prisma schema..."
	@$(NPM) exec -- prisma format


# ====================================================================================
# DOCKER ENVIRONMENT (using Docker Compose)
# ====================================================================================

.PHONY: up down logs rebuild

$(ENV_FILE):
	@if [ ! -f "$@" ]; then \
		echo "==> ERROR: .env file not found. Please create it before running 'make up'."; \
		exit 1; \
	fi

up: $(ENV_FILE)
	@echo "==> Starting '$(SERVICE_NAME)' stack with Docker Compose..."
	@docker compose up -d

down:
	@echo "==> Stopping and removing all Docker Compose services and volumes..."
	@docker compose down -v --remove-orphans

logs:
	@echo "==> Tailing logs for all services. Press Ctrl+C to exit."
	@docker compose logs -f

rebuild:
	@echo "==> Rebuilding and restarting all services..."
	@docker compose up -d --build --force-recreate


# ====================================================================================
# LOCAL DEPENDENCIES (MongoDB for 'make run')
# ====================================================================================

.PHONY: mongo mongo-stop mongo-logs mongo-shell

mongo:
	@echo "==> Ensuring local MongoDB container '$(MONGO_CONTAINER_NAME)' is running..."
	@docker start $(MONGO_CONTAINER_NAME) >/dev/null 2>&1 || \
	docker run -d \
		--name $(MONGO_CONTAINER_NAME) \
		-p $(MONGO_PORT):27017 \
		-v $(MONGO_VOLUME):/data/db \
		$(MONGO_IMAGE)
	@echo "==> Local MongoDB is running on localhost:$(MONGO_PORT)"

mongo-stop:
	@echo "==> Stopping and removing local MongoDB container '$(MONGO_CONTAINER_NAME)'..."
	@docker stop $(MONGO_CONTAINER_NAME) >/dev/null 2>&1 || true
	@docker rm $(MONGO_CONTAINER_NAME) >/dev/null 2>&1 || true
	@echo "==> Container stopped and removed."

mongo-logs:
	@echo "==> Tailing logs for '$(MONGO_CONTAINER_NAME)'. Press Ctrl+C to exit."
	@docker logs -f $(MONGO_CONTAINER_NAME)

mongo-shell:
	@echo "==> Connecting to MongoDB shell in '$(MONGO_CONTAINER_NAME)'..."
	@docker exec -it $(MONGO_CONTAINER_NAME) mongosh


# ====================================================================================
# HOUSEKEEPING
# ====================================================================================

.PHONY: clean

clean: down mongo-stop
	@echo "==> Cleaning up build artifacts..."
	@$(RM) $(BUILD_DIR) node_modules
	@echo "==> Cleanup complete."