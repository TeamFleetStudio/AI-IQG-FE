# Docker Deployment Guide

## Quick Start

### Build and Run
```bash
# Build the Docker image
docker build -t ai-iqg-fe .

# Run the container
docker run -p 3000:3000 ai-iqg-fe
```

### Using Docker Compose
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Production Deployment

### Build Production Image
```bash
docker build -t ai-iqg-fe:latest .
```

### Run Production Container
```bash
docker run -d \
  --name ai-iqg-fe \
  -p 3000:3000 \
  --restart unless-stopped \
  ai-iqg-fe:latest
```

## Docker Commands Reference

```bash
# Build image
docker build -t ai-iqg-fe .

# Run container
docker run -p 3000:3000 ai-iqg-fe

# Run in background
docker run -d -p 3000:3000 --name ai-iqg-fe ai-iqg-fe

# View running containers
docker ps

# View logs
docker logs ai-iqg-fe
docker logs -f ai-iqg-fe  # Follow logs

# Stop container
docker stop ai-iqg-fe

# Remove container
docker rm ai-iqg-fe

# Remove image
docker rmi ai-iqg-fe

# Execute command in running container
docker exec -it ai-iqg-fe sh
```

## Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs
docker-compose logs -f  # Follow logs

# Rebuild images
docker-compose build
docker-compose build --no-cache  # Force rebuild

# Restart services
docker-compose restart

# View running services
docker-compose ps
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs ai-iqg-fe

# Check if port is already in use
lsof -i :3000
```

### Rebuild from scratch
```bash
# Remove containers and images
docker-compose down
docker rmi ai-iqg-fe

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Access container shell
```bash
docker exec -it ai-iqg-fe sh
```

## Image Details

- **Base Image**: `node:20-alpine`
- **Port**: `3000`
- **User**: `nextjs` (non-root for security)
- **Output**: Standalone Next.js build
- **Size**: Optimized with multi-stage build

## Environment Variables

The application uses the deployed backend at `https://iqg-api.fsgarage.in` by default. No environment variables are required.

If you need to override the API URL, you can pass it as an environment variable:

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api-url.com \
  ai-iqg-fe
```

Or in `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=https://your-api-url.com
```

