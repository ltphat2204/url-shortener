#Dependencies
FROM node:22-alpine AS dependencies
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
FROM node:22-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY prisma/schema.prisma ./prisma/
COPY --from=builder /app/dist ./dist

EXPOSE 3000
RUN npx prisma generate

CMD ["node", "dist/main.js"]