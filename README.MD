# URL Shortener Microservices Project

This repository contains a microservices-based URL shortener with independent development and deployment. This repository is constructed for educational purposes, showcasing how to build a scalable and maintainable system using modern technologies.

## Case Study

We have to build a URL shortener service that allows users to create short URLs, view their created URLs, and delete them. The service should support user authentication, including Google login. The redirect service should handle **100.000** concurrent requests to the short URLs and redirect users to the destination URLs within **1 second**. The system should designed to be scalable, with each service independently deployable and developed. The system should combine the many teams with various technologies and programming languages, including Java, TypeScript, Go, and Vue.js.

## Services
- **Frontend**: Vue.js + AntDesign UI for user interaction.
- **API Gateway**: Traefik, routes requests to backend services.
- **User Service**: Handles authentication, registration, and Google login (Java with Spring Boot, Spring Security, OAuth2 client, PostgreSQL).
- **URL Service**: Manages URL creation, viewing, and deletion (TypeScript with NestJS, MongoDB).
- **Redirect Service**: Redirects shortened URLs to destination URLs (Go with Gin Gonic, Redis, two instances with Traefik load balancing).

## Setup
1. Clone the repository: `git clone https://github.com/ltphat2204/url-shortener.git`
2. Navigate to a service directory (e.g., `cd frontend`) and follow its README.
3. Use `docker-compose.yml` for local development: `docker-compose up`.

> **Note**: For production, each service should be deployed independently, and the API Gateway should be configured to route requests to the appropriate services. See [setup.md](docs/setup.md) for detailed instructions.

## Architecture
See [architecture.md](docs/architecture.md) for details.

## Contributing
See [contributing.md](docs/contributing.md) for guidelines.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgements

This project is inspired by real-world URL shortener services (e.g., Bitly, TinyURL) and aims to provide a practical example of microservices architecture. Special thanks to PhD. Ngo Huy Bien, MSc. Ho Tuan Thanh (VNU, HCMUS) and MSc. Ngo Ngoc Dang Khoa (VNU, HCMUS) for the guidance and support in the development of this project.
