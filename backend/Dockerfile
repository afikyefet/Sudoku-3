# Backend Dockerfile with frontend build and pm2
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Build frontend
COPY ../frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build
WORKDIR /app

# Copy frontend build to backend
RUN mkdir -p ./frontend/dist && cp -r ./frontend/dist ./frontend_dist

# Install pm2 globally
RUN npm install -g pm2

# Expose port
EXPOSE 5000

# Start with pm2
CMD ["pm2-runtime", "dist/server.js"]
