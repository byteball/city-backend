# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

EXPOSE 3000

# Install dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy sources and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./