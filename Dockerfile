FROM node:20-slim

WORKDIR /app

# Install dependencies for building the application
# and for running the application
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser \
    && useradd -r -m -d /home/appuser -g appuser appuser
ENV HOME=/home/appuser

RUN chown -R appuser:appuser /app
USER appuser

COPY --chown=appuser:appuser package*.json ./
RUN npm install

COPY --chown=appuser:appuser . .
RUN npm run build && npm prune --production

EXPOSE 3000

CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:3000/health || exit 1