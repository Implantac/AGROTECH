#!/usr/bin/env bash
# ==============================================================================
# AGROTECH ENTERPRISE — INICIALIZAÇÃO RÁPIDA (LINUX / MACOS)
# ==============================================================================
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

if command -v pm2 >/dev/null 2>&1; then
  pm2 start server.cjs --name "agrotech-server"
  echo "✓ AGROTECH iniciado sob PM2 (http://localhost:3000 ou http://localhost:5173)"
else
  nohup node server.cjs > logs/agrotech.log 2>&1 &
  echo "✓ AGROTECH iniciado em background (PID: $!). Acesse http://localhost:3000 ou http://localhost:5173"
fi
