# --- Variables ---
# Vue.js Service
SERVICE_NAME := frontend
BUILD_DIR    := dist
# This Makefile uses Bun as the package manager.
BUN          := bun

# This Makefile assumes a .env file is present for service config (for Docker).
ENV_FILE     := .env.production

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
	@echo "  run           Run the Vue.js dev server (with HMR) using Bun."
	@echo "  build         Build the Vue.js application for production."
	@echo "  install       Install dependencies using Bun."
	@echo "  lint          Run the ESLint linter."
	@echo ""
	@echo "--------------------------"
	@echo "  Docker Environment     "
	@echo "--------------------------"
	@echo "  up            Start the service in the background using Docker Compose."
	@echo "  down          Stop and remove the Docker Compose service and network."
	@echo "  logs          Follow the logs of the running service."
	@echo "  rebuild       Force a rebuild of the Docker image and restart the service."
	@echo ""
	@echo "--------------------------"
	@echo "  Housekeeping           "
	@echo "--------------------------"
	@echo "  clean         Run 'make down' and remove build artifacts & dependencies."
	@echo "  help          Show this help message."


# ====================================================================================
# DEVELOPMENT & BUILDING (Vue.js / Bun)
# ====================================================================================

.PHONY: run build install lint

## run: Run the Vue.js dev server.
run: install
	@echo "==> Starting Vue.js dev server for '$(SERVICE_NAME)'..."
	@$(BUN) run dev

## build: Install dependencies, then build the application.
build: install
	@echo "==> Building application '$(SERVICE_NAME)'..."
	@$(BUN) run build
	@echo "==> Build complete: ./$(BUILD_DIR)"

## install: Install dependencies using Bun.
install:
	@echo "==> Installing dependencies with Bun..."
	@$(BUN) install

## lint: Run the linter.
lint:
	@echo "==> Linting code..."
	@$(BUN) run lint


# ====================================================================================
# DOCKER ENVIRONMENT (using Docker Compose)
# ====================================================================================

.PHONY: up down logs rebuild

$(ENV_FILE):
	@if [ ! -f "$@" ]; then \
		echo "==> WARNING: .env.production file not found. It might be required by your Docker setup."; \
	fi

up: $(ENV_FILE)
	@echo "==> Starting '$(SERVICE_NAME)' stack with Docker Compose..."
	@docker compose up -d

down:
	@echo "==> Stopping and removing Docker Compose service..."
	@docker compose down -v --remove-orphans

logs:
	@echo "==> Tailing logs for '$(SERVICE_NAME)'. Press Ctrl+C to exit."
	@docker compose logs -f $(SERVICE_NAME)

rebuild:
	@echo "==> Rebuilding and restarting '$(SERVICE_NAME)' service..."
	@docker compose up -d --build --force-recreate


# ====================================================================================
# HOUSEKEEPING
# ====================================================================================

.PHONY: clean

clean: down
	@echo "==> Cleaning up build artifacts and node_modules..."
	@$(RM) $(BUILD_DIR) node_modules
	@echo "==> Cleanup complete."