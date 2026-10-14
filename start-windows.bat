@echo off
REM ==============================================================================
REM AGROTECH ENTERPRISE — INICIALIZADOR RÁPIDO PARA WINDOWS
REM ==============================================================================
chcp 65001 >nul
title AGROTECH Enterprise Server
echo Iniciando AGROTECH Enterprise...
echo Acesse: http://localhost:3000 ou http://localhost:5173
node server.cjs
pause
