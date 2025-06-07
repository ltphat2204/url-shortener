#Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

#Builder
FROM dependencies AS builder
WORKDIR /app
COPY . .
RUN npx prisma generate
RUN npm run build

#Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY prisma/schema.prisma ./prisma/
COPY --from=builder /app/dist ./dist
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]