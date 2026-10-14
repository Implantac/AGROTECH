@echo off
REM ==============================================================================
REM AGROTECH ENTERPRISE — SCRIPT DE INSTALAÇÃO UNIVERSAL PARA WINDOWS
REM Compatível com Windows 10, Windows 11 e Windows Server 2016/2019/2022
REM ==============================================================================

chcp 65001 >nul
title AGROTECH Enterprise — Instalador Windows

echo ================================================================
echo 🌾 AGROTECH ENTERPRISE — O SISTEMA OPERACIONAL DA EMPRESA RURAL
echo    Instalador Automatizado para Windows (Local / On-Premises)
echo ================================================================
echo.

REM 1. Verifica se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js não foi encontrado no seu computador!
    echo.
    echo Por favor, instale o Node.js v20 LTS baixando em:
    echo https://nodejs.org/ (Versão LTS recomendada)
    echo.
    echo Após instalar, reabra este arquivo para prosseguir.
    pause
    exit /b 1
)

echo [1/4] Verificando versão do Node.js...
node -v
echo.

REM 2. Configuração do arquivo .env
echo [2/4] Configurando arquivo de ambiente (.env)...
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo [OK] Arquivo .env criado a partir de .env.example
    ) else (
        echo NODE_ENV=production> .env
        echo PORT=3000>> .env
        echo HOST=0.0.0.0>> .env
        echo JWT_SECRET=agrotech_enterprise_windows_secret_2026>> .env
        echo STORAGE_ENGINE=STANDALONE_LOCAL>> .env
        echo [OK] Arquivo .env básico criado.
    )
) else (
    echo [OK] Arquivo .env já existe e foi preservado.
)
echo.

REM 3. Criação de pastas necessárias
echo [3/4] Verificando pastas de dados...
if not exist data mkdir data
if not exist data\certificados mkdir data\certificados
if not exist logs mkdir logs
if not exist app_static mkdir app_static
if not exist public mkdir public

if not exist data\agtech_db.json (
    if exist data\agtech_db.backup.json (
        copy data\agtech_db.backup.json data\agtech_db.json >nul
    )
)
echo [OK] Estrutura de dados pronta.
echo.

REM 4. Inicialização do Servidor
echo [4/4] Iniciando o servidor AGROTECH Enterprise...
echo.
echo ================================================================
echo 🎉 AGROTECH PRONTO PARA USO!
echo ================================================================
echo.
echo Abra o navegador e acesse:
echo   http://localhost:3000  ou  http://localhost:5173
echo.
echo Pressione CTRL+C para encerrar o servidor quando desejar.
echo ================================================================
echo.

node server.cjs
pause
