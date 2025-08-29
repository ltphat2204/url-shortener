# Frontend

Vue.js frontend for URL shortening service with user management and analytics.

## Features

- Shorten URLs with custom aliases
- User authentication (email/password + Google OAuth)
- URL management dashboard with analytics
- Bulk operations

## Tech Stack

- Vue 3 + Composition API
- Ant Design Vue
- Vue Router 4
- Vite

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.production
```

### Environment Variables

```env
# EmailJS (for OTP verification)
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_PRIVATE_KEY=your_private_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id

# API
VITE_API_GATEWAY_BASE_URL=http://localhost
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
bun test:unit

# Lint code
bun lint
```

## Docker

```bash
docker-compose up
```

## Project Structure

```
src/
├── components/         # Reusable components
├── composables/        # Vue composition functions
├── services/           # API calls
├── views/              # Pages
├── router/             # Routing config
└── utils/              # Helper functions
└── assets/             # Static resources
```
