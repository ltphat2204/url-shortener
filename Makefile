.PHONY: all clean api-gateway redirect-service url-service user-service frontend

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

all: api-gateway redirect-service url-service user-service frontend

clean:
	@echo "Cleaning up all services..."
	@cd api-gateway && make down && cd ..
	@cd redirect-service && make down && cd ..
	@cd url-service && make down && cd ..
	@cd user-service && make down && cd ..
	@cd frontend && make down && cd ..