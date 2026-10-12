# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

# Etapa 2: prod Nginx
FROM nginx:alpine

# Copiar los archivos compilados desde la Etapa 1 a la carpeta pública de Nginx
COPY --from=build /app/dist/frontend-gestor/browser /usr/share/nginx/html

EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]

