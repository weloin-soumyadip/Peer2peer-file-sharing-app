# ==============================================================================
# STAGE 1: Development with Hot Reloading (Dev Target)
# ==============================================================================
FROM golang:1.26-alpine AS dev

RUN apk update && apk add --no-cache git

WORKDIR /app

# Install air for hot reloading
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]

# ==============================================================================
# STAGE 2: Build the Go binary (For Production)
# ==============================================================================
FROM golang:1.26-alpine AS builder

# Install build dependencies if needed
RUN apk update && apk add --no-cache git

# Set the working directory
WORKDIR /app

# Copy dependency files first to leverage Docker's caching mechanism
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire source code
COPY . .

# Compile the application.
# CGO_ENABLED=0 builds a statically-linked binary, ensuring it runs on minimal OS environments.
# GOOS=linux target compilation for Linux kernel inside containers.
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# ==============================================================================
# STAGE 3: Run the Go binary (For Production)
# ==============================================================================
FROM alpine:latest

# Install CA certificates to support secure external HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Copy static assets and folder structure expected by the app
COPY --from=builder /app/web ./web
COPY --from=builder /app/uploads ./uploads

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["./main"]
