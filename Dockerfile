FROM node:18-alpine
WORKDIR /app

EXPOSE 3000

# Устанавливаем все зависимости и строим проект
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && npm prune --production

CMD ["npm", "start"]