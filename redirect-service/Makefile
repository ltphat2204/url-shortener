# --- Variables ---
# Go Service
SERVICE_NAME := redirect-service
BINARY_NAME  := $(SERVICE_NAME)
# Assumes your main.go is in a 'cmd/redirect-service' directory. Change if needed.
CMD_PATH     := ./cmd/$(SERVICE_NAME)

# Redis Dependency
REDIS_CONTAINER_NAME := dev-redis
REDIS_IMAGE          := redis:alpine
REDIS_PORT           := 6379
# This Makefile assumes a .env file is present for Redis config.
ENV_FILE             := .env

# --- Cross-Platform Helpers ---
# Set the correct 'remove file' command based on the operating system
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
	@echo "--------------------"
	@echo "  Go Service       "
	@echo "--------------------"
	@echo "  run          Start the Go service (ensures Redis is running first)."
	@echo "  build        Build the Go binary ('$(BINARY_NAME)')."
	@echo "  test         Run all Go tests."
	@echo "  tidy         Tidy and verify Go module dependencies."
	@echo "  lint         Run the static analysis linter (requires golangci-lint)."
	@echo ""
	@echo "--------------------"
	@echo "  Dependencies     "
	@echo "--------------------"
	@echo "  redis        Start the Redis container in the background."
	@echo "  redis-stop   Stop and remove the Redis container."
	@echo "  redis-logs   View the live logs of the Redis container."
	@echo ""
	@echo "--------------------"
	@echo "  Housekeeping     "
	@echo "--------------------"
	@echo "  stop         Stop all services (currently just Redis)."
	@echo "  clean        Stop Redis and remove the built Go binary."
	@echo "  help         Show this help message."


# ====================================================================================
# GO SERVICE COMMANDS
# ====================================================================================

.PHONY: run build test tidy lint

## run: Ensure Redis is running, then run the Go service.
run: redis
	@echo "==> Starting Go service '$(SERVICE_NAME)'..."
	@go run $(CMD_PATH)

## build: Tidy dependencies, then build the Go binary.
build: tidy
	@echo "==> Building binary '$(BINARY_NAME)'..."
	@go build -o $(BINARY_NAME) $(CMD_PATH)
	@echo "==> Build complete: ./$(BINARY_NAME)"

## test: Run all Go tests in verbose mode.
test:
	@echo "==> Running Go tests..."
	@go test -v ./...

## tidy: Tidy and download Go module dependencies.
tidy:
	@echo "==> Tidying Go module dependencies..."
	@go mod tidy
	@go mod verify

## lint: Run the linter (requires 'golangci-lint' to be installed).
lint:
	@echo "==> Linting code..."
	@golangci-lint run ./...


# ====================================================================================
# DEPENDENCIES (Redis)
# ====================================================================================

.PHONY: redis redis-stop redis-logs

## redis: Start the Redis container if stopped, or create it if it doesn't exist.
redis: $(ENV_FILE)
	@echo "==> Ensuring Redis container '$(REDIS_CONTAINER_NAME)' is running..."
	@docker start $(REDIS_CONTAINER_NAME) || \
	docker run -d \
		--name $(REDIS_CONTAINER_NAME) \
		-p $(REDIS_PORT):6379 \
		--env-file $(ENV_FILE) \
		$(REDIS_IMAGE)
	@echo "==> Redis is running on localhost:$(REDIS_PORT)"

## redis-stop: Stop and remove the Redis container.
redis-stop:
	@echo "==> Stopping and removing Redis container '$(REDIS_CONTAINER_NAME)'..."
	@docker stop $(REDIS_CONTAINER_NAME) || true
	@docker rm $(REDIS_CONTAINER_NAME) || true
	@echo "==> Container stopped and removed."

## redis-logs: Tail the logs of the running Redis container.
redis-logs:
	@echo "==> Tailing logs for '$(REDIS_CONTAINER_NAME)'. Press Ctrl+C to exit."
	@docker logs -f $(REDIS_CONTAINER_NAME)


# ====================================================================================
# HOUSEKEEPING
# ====================================================================================

.PHONY: stop clean

## stop: Alias for redis-stop. Stops all background services.
stop: redis-stop

## clean: Stop background services and remove build artifacts.
clean: redis-stop
	@echo "==> Cleaning up build artifacts..."
	@$(RM) $(BINARY_NAME)
	@echo "==> Cleanup complete."