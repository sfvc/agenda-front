# Etapa 1: Construcción
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Usar Nginx para servir el contenido estático
FROM nginx:1.19-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/share/nginx/html

# Nuevas variables de entorno
ARG PORT=80
ARG VITE_API_URL
ENV PORT=$PORT
ENV VITE_API_URL=$VITE_API_URL

# Exponer el puerto configurado
EXPOSE ${PORT}

# Copiar la carpeta 'dist' al directorio de Nginx
COPY ./dist /usr/share/nginx/html

# Copiar un archivo de configuración de Nginx personalizado si es necesario
COPY nginx.conf /etc/nginx/nginx.conf

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]