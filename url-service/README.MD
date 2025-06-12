# URL Shortener Service

A microservice for creating, managing, and retrieving short URLs, with support for user-specific URL management and pagination.

## Features

- **Create Short URL**: Generate a short URL for a given destination URL.
- **Get URL by Short Code**: Retrieve details of a short URL.
- **Get Short Code by Destination URL**: Find the short code for a given destination URL.
- **List URLs by User ID**: Retrieve a paginated list of short URLs for a specific user.
- **Delete Short URL**: Delete a short URL by its short code.

## Architecture

This service is designed as a standalone microservice:
- **URL Shortener Service** (this service): Handles the creation, retrieval, and deletion of short URLs.
- **MongoDB**: Persistent storage for URL data using Prisma ORM.
- **NestJS**: Framework for building the service with a RESTful API.

The flow for key operations is:
1. **Create**: A request generates a unique short code and stores URL data in MongoDB.
2. **Retrieve**: Fetches URL data by short code or user ID with pagination support.
3. **Delete**: Removes a short URL from the database by its short code.

## Configuration

Set the following environment variables in a `.env` file:
- `DATABASE_URL`: MongoDB connection string (e.g., `mongodb://localhost:27017/url-shortener`)
- `short_code_length`: Length of the short code (default: `7`)
- `REDIRECT_SERVICE_URL`: Base URL for the redirect service (e.g., `http://localhost:8080/`)

## API Endpoints

### Create Short URL
```
POST /url
```
**Request Body:**
```json
{
  "destination_url": "https://example.com",
  "title": "Example",
  "description": "An example URL",
  "user_id": 1
}
```
**Response:**
```json
{
  "new_short_record": {
    "id": "60c72b2f9b1d8e2b3c4d5e6f",
    "title": "Example",
    "description": "An example URL",
    "destination_url": "https://example.com",
    "short_url": "http://localhost:8080/abc123",
    "user_id": 1
  }
}
```

### Get URL by Short Code
```
GET /url/:shortCode
```
**Response:**
```json
{
  "data": {
    "short_url_id": "60c72b2f9b1d8e2b3c4d5e6f",
    "title": "Example",
    "description": "An example URL",
    "short_code": "abc123",
    "destination_url": "https://example.com",
    "user_id": 1,
    "created_at": "2023-06-13T01:12:00.000Z"
  }
}
```

### List URLs by User ID
```
GET /url/user/:userId?page=1&limit=10
```
**Response:**
```json
{
  "data": [
    {
      "id": "60c72b2f9b1d8e2b3c4d5e6f",
      "title": "Example",
      "description": "An example URL",
      "short_code": "abc123",
      "destination_url": "https://example.com",
      "user_id": 1,
      "create_at": "2023-06-13T01:12:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 1,
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

### Delete Short URL
```
DELETE /url/:shortCode
```
**Response:**
```json
{
  "message": "Short URL deleted successfully."
}
```

## Running the Service

### Using npm
1. Clone the repository:
   ```bash
   git clone https://github.com/ltphat2204/url-shortener.git
   cd url-shortener
   cd url-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Prisma:
   ```bash
   npx prisma generate
   ```
4. Start the service:
   ```bash
   npm run start
   ```

The service will be available at `http://localhost:3000` (or the port specified in your NestJS configuration).

### Using Docker Compose
This is the recommended way to run locally as it sets up the redirect service, and Redis.

```bash
docker-compose up
```

## Example Usage

1. **Create a Short URL**:
   ```bash
   curl -X POST http://localhost:3000/url -H "Content-Type: application/json" -d '{"destination_url": "https://example.com", "title": "Example", "description": "An example URL", "user_id": 1}'
   ```

2. **Get URL by Short Code**:
   ```bash
   curl http://localhost:3000/url/abc123
   ```

3. **Get Short Code by Destination URL**:
   ```bash
   curl -X POST http://localhost:3000/url/getShortCode -H "Content-Type: application/json" -d '{"destination_url": "https://example.com"}'
   ```

4. **List URLs by User ID**:
   ```bash
   curl http://localhost:3000/url/user/1?page=1&limit=10
   ```

5. **Delete Short URL**:
   ```bash
   curl -X DELETE http://localhost:3000/url/abc123
   ```