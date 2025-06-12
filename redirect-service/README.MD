# URL Redirect Service

A microservice for handling URL redirects by fetching destination URLs from another service, with a Redis caching layer for performance.

## Features

- **Redirect Endpoint**: `GET /{short}` - Redirects to the destination URL
- **Health Check**: `GET /health` - Service health status
- **Caching**: Uses Redis to cache responses from the URL service, reducing latency and load.

## Architecture

This service is part of a microservices architecture:
- **Redirect Service** (this service): Handles redirects and caches responses.
- **Redis**: Caching layer.
- **URL Service**: Manages URL data and provides the source-of-truth API.

The flow for a request is:
1.  Request for `/{short}` arrives.
2.  The service checks Redis for the URL data.
3.  **Cache Hit**: If data is found, it's returned/used immediately.
4.  **Cache Miss**: If data is not found, the service calls the **URL Service**.
5.  The response from the URL Service is stored in Redis for future requests.
6.  The redirect is performed.

## Configuration

Set the following environment variables:
- `URL_SERVICE_BASE_URL`: Base URL of the URL service (default: `http://localhost:8081`)
- `REDIS_ADDR`: Address of the Redis server (default: `localhost:6379`)
- `REDIS_PASSWORD`: Password for the Redis server (default: none)
- `REDIS_DB`: Redis database to use (default: `0`)
- `CACHE_TTL_SECONDS`: Cache time-to-live in seconds (default: `300`)

## API Endpoints

### Redirect
```
GET /{short}
```
Redirects to the destination URL associated with the short code.

### Health Check
```
GET /health
```
Returns service status.

### Delete Cache
```
DELETE /{short}
```
Deletes the cached information for a specific short code. This is useful for forcing the service to fetch fresh data from the downstream URL Service on the next request.

**Example Request:**
```bash
curl -X DELETE http://localhost:8080/cache/abc123
```

**Success Response (200 OK):**
```json
{
  "message": "Cache for 'abc123' deleted successfully."
}
```

## Running the Service

### Using Go
```bash
go run main.go
```

### Using Docker Compose
This is the recommended way to run locally as it sets up the redirect service, and Redis.

```bash
docker-compose up
```

## Example Usage

1. **Redirect**: `curl -L http://localhost:8080/abc123`
2. **Health Check**: `curl http://localhost:8080/health`