# ==========================================
# SUPER AGTECH - PRODUCTION MULTI-STAGE DOCKERFILE
# ==========================================

# Estágio 1: Build da Aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Otimização de Cache das dependências
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# Cópia do código fonte
COPY . .

# Compilação e Geração do Bundle Otimizado
RUN npm run build

# Estágio 2: Imagem Final de Execução de Alta Performance (Nginx Alpine)
FROM nginx:alpine-slim

# Remove configurações padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copia configuração customizada otimizada para SPA + Gzip + PWA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia artefatos compilados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposição da Porta HTTP
EXPOSE 80

# Healthcheck nativo
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando de Inicialização do Nginx
CMD ["nginx", "-g", "daemon off;"]
