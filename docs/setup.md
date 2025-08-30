# Deployment Guide

This document provides instructions for deploying the URL Shortener Microservices System using Docker Compose and Kubernetes.

---

## 1. Deploy with Docker

### 1.1. Prerequisites
- Install [Docker Desktop](https://docs.docker.com/compose/install/)

### 1.2. Clone the Repository

```sh
git clone https://github.com/ltphat2204/url-shortener.git
cd url-shortener
```

### 1.3. Configure Environment Variables

- Copy .env.example to .env in each service and update values as needed.

### 1.4. Build and Start All Services

You can use the provided Makefile to build and start all services at once:

```sh
make all
```

- Or, to build and start a specific service, use:

```sh
make <service_name>
```

Replace `<service_name>` with one of: `api-gateway`, `redirect-service`, `url-service`, `user-service`, `frontend`, `cache`.

### 1.5. Stop All Services

To stop and remove all running services:

```sh
make clean
```
### 1.6. Access the Application

- Frontend: [http://localhost:3030](http://localhost:3030)

## 2. Deploy with Kubernetes
### 2.1. Prerequisites
- Install [Docker Desktop](https://docs.docker.com/compose/install/)

- Install [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/#install-kubectl-binary-on-windows-via-direct-download-or-curl)

- Install [Helm](https://github.com/helm/helm/releases) 

- Install [Minikube](https://github.com/kubernetes/minikube/releases/tag/v1.36.0)

### 2.2. Clone the Repository

```sh
git clone https://github.com/ltphat2204/url-shortener.git
cd url-shortener
```

### 2.3. Configure Environment Variables

- Copy secret.template.yaml to secret.yaml in each service  and update values as needed.

### 2.4. Build and Start All Services
- run 
```sh
minikube start --driver=docker
minikube -p minikube docker-env | Invoke-Expression
```
**Note:**  
These commands will start Minikube and configure your terminal so that all `docker build` commands will build images directly into Minikube’s Docker environment.  

**You must run these commands in every new terminal session before building images or deploying with the Makefile.**  

If you skip this step, Kubernetes will not be able to find your locally built images.

- You can use the provided Makefile to build and start all services at once:
```sh
make k8s-deploy-all
```

-  After deploying, run the following command in a **separate terminal** (and keep it open) to enable access to services
```sh
minikube tunnel
```
### 1.6. Access the Application

- Frontend: [http://localhost:3030](http://localhost:3030)