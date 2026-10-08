# ==========================================
# SUPER AGTECH - PRODUCTION DOCKERFILE
# ==========================================

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173
ENV JWT_SECRET=super_agro_jwt_secret_2026_xyz

# Copia manifestos de dependências
COPY package.json ./

# Copia código do servidor e diretórios estáticos
COPY server.cjs ./
COPY data/ ./data/
COPY app_static/ ./app_static/
COPY public/ ./public/

# Permissões seguras não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S agtech -u 1001 -G nodejs && \
    chown -R agtech:nodejs /app

USER agtech

EXPOSE 5173 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:5173/api/v1/health || exit 1

CMD ["node", "server.cjs"]
