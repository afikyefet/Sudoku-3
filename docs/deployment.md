# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- MongoDB (runs as a service in Compose)
- .env files for backend and frontend

## Steps

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```
2. The backend will be available at `http://localhost:5000` (serves API and frontend static files)
3. The frontend will be available at `http://localhost` (if using Nginx container)
4. Health check: `GET /health` on backend
5. Use PM2 for process management in production (already in Dockerfile)

## Environment Variables
- See `.env.example` in both backend and frontend for all required variables.

## Production Build
- Frontend is built and served as static files from the backend in production.
- All secrets/configs are read from environment variables.
