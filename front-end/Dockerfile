FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --silent

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]