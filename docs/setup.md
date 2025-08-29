# Deployment Guide

This document provides instructions for deploying the URL Shortener Microservices System using Docker Compose and Kubernetes.

---

## 1. Deploy with Docker Compose

### 1.1. Prerequisites
- Install [Docker Desktop](https://docs.docker.com/compose/install/)

### 1.2. Clone the Repository

```sh
git clone https://github.com/ltphat2204/url-shortener.git
cd url-shortener

### 1.3. Configure Environment Variables

- Copy .env.example to .env and update values as needed.

### 1.4. Build and Start All Services

You can use the provided Makefile to build and start all services at once:

```sh
make all
```

Or, to build and start a specific service, use:

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