# System Architecture
1. Overview
This document describes the architecture of the URL Shortener Microservices System. The system is designed for scalability, independent development, and independent deployment of each service. It leverages modern technologies and follows the microservices pattern to ensure each component can be developed and scaled independently.

2. Architecture Diagram
![System Architecture Diagram](diagrams/LogicalView.png)

3. Component Descriptions
- Frontend: 

Built with Vue.js and AntDesign, the frontend provides a user-friendly interface for creating, viewing, and managing short URLs. It communicates with backend services via the API Gateway.
- API Gateway:

Implemented using Traefik, the API Gateway routes incoming requests to the appropriate backend services, handles load balancing, and provides a single entry point for the system.
- User Service:

Developed in Java with Spring Boot, this service manages user authentication, registration, and Google OAuth login. It stores user data in PostgreSQL and issues JWT tokens for secure communication.
- URL Service:

Built with TypeScript and NestJS, this service handles the creation, retrieval, and deletion of short URLs. It uses MongoDB for persistent storage.

- Redirect Service:

Written in Go using Gin Gonic, the redirect service resolves short URLs and redirects users to the original destination. It uses Redis for fast lookup and is designed to handle high concurrency.

4. Design Decisions
- Microservices Architecture:

The system is split into independent services to allow for separate development, deployment, and scaling.
- Technology Choices:

Java (Spring Boot) for robust authentication and security.
TypeScript (NestJS) for flexible and scalable API development.
Go (Gin) for high-performance redirection.
Vue.js for a modern frontend experience.
Redis, MongoDB, PostgreSQL for optimized data storage.

5. Scalability & Deployment
- All services are containerized using Docker and orchestrated with Kubernetes.
- Each service can be deployed, updated, and scaled independently.
- The API Gateway manages routing and load balancing.
- Persistent data is stored in dedicated databases (PostgreSQL, MongoDB, Redis).