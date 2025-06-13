# --- Variables ---
SERVICE_NAME := api-gateway

# --- Cross-Platform Helpers ---
# This is kept for style consistency, though not used in this simplified Makefile.
ifeq ($(OS),Windows_NT)
	RM = del /F
else
	RM = rm -f
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
	@echo "  Docker Environment     "
	@echo "--------------------------"
	@echo "  up            Start the Traefik gateway using Docker Compose."
	@echo "  down          Stop and remove the Traefik gateway, network, and volumes."
	@echo "  logs          Follow the logs of the running gateway."
	@echo "  rebuild       Force a rebuild of the Docker image and restart the gateway."
	@echo ""
	@echo "--------------------------"
	@echo "  Housekeeping           "
	@echo "--------------------------"
	@echo "  clean         Run 'make down' to perform a full cleanup."
	@echo "  help          Show this help message."


# ====================================================================================
# DOCKER ENVIRONMENT (using Docker Compose)
# ====================================================================================

.PHONY: up down logs rebuild

## up: Start the Traefik gateway and any related services in detached mode.
up:
	@echo "==> Starting $(SERVICE_NAME) with Docker Compose..."
	@docker compose up -d

## down: Stop and remove all containers, networks, and volumes.
down:
	@echo "==> Stopping and removing $(SERVICE_NAME) and all related services..."
	@docker compose down -v --remove-orphans

## logs: Follow the logs of all running Docker Compose services.
logs:
	@echo "==> Tailing logs for $(SERVICE_NAME). Press Ctrl+C to exit."
	@docker compose logs -f

## rebuild: Rebuild the Docker image and restart the services.
rebuild:
	@echo "==> Rebuilding and restarting $(SERVICE_NAME)..."
	@docker compose up -d --build --force-recreate


# ====================================================================================
# HOUSEKEEPING
# ====================================================================================

.PHONY: clean

## clean: Alias for 'down'. Stops and removes all services and volumes.
clean: down
	@echo "==> Cleanup complete."