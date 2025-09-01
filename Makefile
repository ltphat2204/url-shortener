# Redis Dependency
REDIS_CONTAINER_NAME := dev-redis
REDIS_IMAGE          := redis:alpine
REDIS_PORT           := 6379

# This Makefile assumes a .env file is present for Redis config.
ENV_FILE             := .env

.PHONY: all cache clean api-gateway redirect-service url-service user-service frontend k8s-build-all k8s-build-front-end k8s-build-user-service k8s-build-url-service k8s-build-redirect-service k8s-deploy-all k8s-deploy-front-end k8s-deploy-user-service k8s-deploy-url-service k8s-deploy-redirect-service  k8s-deploy-traefik k8s-deploy-traefik-crds k8s-deploy-traefik-dashboard k8s-apply-middleware k8s-apply-secrets-pvc k8s-apply-redis k8s-deploy-all k8s-deploy-load

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
	@echo "Building front-end..."
	@cd front-end &&\
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
	@cd front-end && make down && cd ..
	@cd cache && make down && cd ..
	@echo "All services cleaned up."

# Kubernetes Build
k8s-build-all: k8s-build-front-end k8s-build-user-service k8s-build-url-service k8s-build-redirect-service
	@echo "All images built!"

k8s-namespace:
	kubectl apply -f k8s/namespace.yaml

k8s-build-front-end:
	docker build -t front-end:latest ./front-end

k8s-build-user-service:
	docker build -t user-service:latest ./user-service

k8s-build-url-service:
	docker build -t url-service:latest ./url-service

k8s-build-redirect-service:
	docker build -t redirect-service:latest ./redirect-service

# Load image if already built in docker
k8s-load-images:
	minikube image load front-end:latest
	minikube image load user-service:latest
	minikube image load url-service:latest
	minikube image load redirect-service:latest

# Deploy Traefik CRDs (Custom Resource Definitions)
k8s-deploy-traefik-crds:
	kubectl apply -R -f k8s/traefik/crds/

# Deploy Traefik via Helm
k8s-deploy-traefik: k8s-namespace
	helm repo add traefik https://helm.traefik.io/traefik
	helm repo update
	helm install traefik traefik/traefik --namespace url-shortener \
		--set-string crds.install=false \
		--set "dashboard.enabled=true" \
		--set "ingressRoute.dashboard.enabled=true" \
		--set "ingressRoute.dashboard.insecure=true"
	
	kubectl wait --namespace url-shortener \
		--for=condition=available deployment \
		--selector=app.kubernetes.io/name=traefik \
		--timeout=60s

# Deploy Traefik dashboard ingress route
k8s-deploy-traefik-dashboard:
	kubectl apply -f k8s/traefik/dashboard-ingress.yaml

k8s-apply-middleware: k8s-deploy-traefik-crds
	kubectl apply -f k8s/traefik/middlewares.yaml

# Apply secrets và PVC
k8s-apply-secrets-pvc: k8s-namespace
	kubectl apply -f k8s/user-service/postgres-secret.yaml
	kubectl apply -f k8s/user-service/secret.yaml
	kubectl apply -f k8s/url-service/secret.yaml
	kubectl apply -f k8s/front-end/secret.yaml
	kubectl apply -f k8s/user-service/postgres-pvc.yaml

k8s-apply-redis:
	kubectl apply -f k8s/redis/deployment.yaml
# Deploy each service
k8s-deploy-user-service: k8s-namespace k8s-apply-middleware k8s-apply-secrets-pvc
	kubectl apply -f k8s/user-service/postgres-deployment.yaml
	kubectl wait --namespace url-shortener --for=condition=available deployment/postgres-deployment --timeout=180s
	kubectl apply -f k8s/user-service/deployment.yaml
	kubectl apply -f k8s/user-service/ingress.yaml

k8s-deploy-url-service: k8s-namespace k8s-apply-middleware k8s-apply-secrets-pvc
	kubectl apply -f k8s/url-service/mongodb-statefulset.yaml
	kubectl wait --namespace url-shortener --for=condition=ready pod/mongodb-0 --timeout=120s
	kubectl apply -f k8s/url-service/mongo-init-job.yaml
	kubectl wait --namespace url-shortener --for=condition=complete job/mongo-init-job --timeout=120s
	
	kubectl apply -f k8s/url-service/deployment.yaml
	kubectl apply -f k8s/url-service/service.yaml
	kubectl apply -f k8s/url-service/ingress.yaml

k8s-deploy-front-end: k8s-namespace k8s-apply-middleware k8s-apply-secrets-pvc
	kubectl apply -f k8s/front-end/deployment.yaml

k8s-deploy-redirect-service: k8s-namespace k8s-apply-middleware k8s-apply-redis
	kubectl wait --namespace url-shortener --for=condition=ready pod -l app=redis --timeout=120s
	kubectl apply -f k8s/redirect-service/deployment.yaml
	kubectl apply -f k8s/redirect-service/service.yaml
	kubectl apply -f k8s/redirect-service/ingress.yaml

k8s-deploy-all: k8s-build-all k8s-namespace k8s-apply-secrets-pvc
	$(MAKE) k8s-deploy-traefik
	$(MAKE) k8s-apply-middleware
	$(MAKE) k8s-deploy-traefik-dashboard
	$(MAKE) k8s-deploy-front-end
	$(MAKE) k8s-deploy-user-service
	$(MAKE) k8s-deploy-url-service
	$(MAKE) k8s-deploy-redirect-service
	minikube tunnel

k8s-deploy-load: k8s-load-images k8s-namespace k8s-apply-secrets-pvc
	$(MAKE) k8s-deploy-traefik
	$(MAKE) k8s-apply-middleware
	$(MAKE) k8s-deploy-traefik-dashboard
	$(MAKE) k8s-deploy-front-end
	$(MAKE) k8s-deploy-user-service
	$(MAKE) k8s-deploy-url-service
	$(MAKE) k8s-deploy-redirect-service