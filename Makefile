# Redis Dependency
REDIS_CONTAINER_NAME := dev-redis
REDIS_IMAGE          := redis:alpine
REDIS_PORT           := 6379

# This Makefile assumes a .env file is present for Redis config.
ENV_FILE             := .env

.PHONY: all cache clean api-gateway redirect-service url-service user-service frontend

api-gateway:
	@echo "Building api-gateway..."
	@cd api-gateway &&\
	make up &&\
	cd ..

redirect-service:
	@echo "Building redirect-service..."
	@cd redirect-service &&\
	make up &&\
	cd ..

url-service:
	@echo "Building url-service..."
	@cd url-service &&\
	make up &&\
	cd ..

user-service:
	@echo "Building user-service..."
	@cd user-service &&\
	make up &&\
	cd ..

frontend:
	@echo "Building frontend..."
	@cd frontend &&\
	make up &&\
	cd ..

cache:
	@echo "Building cache..."
	@cd cache &&\
	make up &&\
	cd ..

all: api-gateway cache redirect-service url-service user-service frontend

clean:
	@echo "Cleaning up all services..."
	@cd api-gateway && make down && cd ..
	@cd redirect-service && make down && cd ..
	@cd url-service && make down && cd ..
	@cd user-service && make down && cd ..
	@cd frontend && make down && cd ..
	@cd cache && make down && cd ..
	@echo "All services cleaned up."
