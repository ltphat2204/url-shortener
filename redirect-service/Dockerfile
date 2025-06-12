FROM golang:1.24.3-alpine AS builder

WORKDIR /app

# Copy go mod files to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application, pointing to the correct package directory
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/redirect-service

# --- Final Stage ---
FROM alpine:3.19

# Add root certificates for making HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose the port the application runs on
EXPOSE 8080

# Run the binary
CMD ["./main"]