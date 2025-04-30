FROM node:18-slim
WORKDIR /app

EXPOSE 3000

# Устанавливаем все зависимости и строим проект
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && npm prune --production

RUN apt-get update && apt-get install -y libvips-dev --no-install-recommends && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]