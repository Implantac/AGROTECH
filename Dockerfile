# ==========================================
# SUPER AGTECH ENTERPRISE - DOCKERFILE PROD
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Definir variáveis de ambiente seguras
ENV NODE_ENV=production
ENV PORT=5173
ENV SECONDARY_PORT=3000

# Copia manifestos de dependências
COPY package.json ./

# Copia código do servidor e diretórios estáticos
COPY server.cjs ./
COPY data/ ./data/
COPY src/ ./src/
COPY infra/ ./infra/
COPY app_static/ ./app_static/
COPY public/ ./public/

# Cria diretórios de dados e logs com permissão não-root
RUN mkdir -p /app/data /app/logs && \
    chown -R node:node /app

# Muda para usuário não-privilegiado (Princípio 10 - Segurança)
USER node

# Expõe as portas de acesso
EXPOSE 5173
EXPOSE 3000

# Healthcheck nativo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5173/api/v1/health || exit 1

# Inicialização com cluster e store ACID
CMD ["node", "server.cjs"]
