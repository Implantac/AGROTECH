#!/usr/bin/env bash
# ==============================================================================
# AGROTECH ENTERPRISE — PARADA DO SERVIDOR (LINUX / MACOS)
# ==============================================================================
if command -v pm2 >/dev/null 2>&1; then
  pm2 stop agrotech-server 2>/dev/null || true
  echo "✓ AGROTECH parado no PM2."
else
  pkill -f "node server.cjs" 2>/dev/null || true
  echo "✓ Processos Node.js do AGROTECH encerrados."
fi
