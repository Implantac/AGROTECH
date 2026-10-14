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

REM 3. Criação de pastas necessárias e inicialização do Banco de Dados
echo [3/4] Verificando pastas e inicializando banco de dados limpo...
if not exist data mkdir data
if not exist data\certificados mkdir data\certificados
if not exist data\backups mkdir data\backups
if not exist logs mkdir logs
if not exist app_static mkdir app_static
if not exist public mkdir public

if not exist data\agtech_db.json (
    echo [*] Inicializando banco de dados ACID limpo de producao...
    node scripts\init_clean_db.cjs
) else (
    echo [OK] Banco de dados existente detectado em data\agtech_db.json.
)
echo [OK] Estrutura e banco de dados prontos.
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
echo ----------------------------------------------------------------
echo 🔐 CREDENCIAIS DO USUARIO ADMINISTRADOR (ACESSO TOTAL):
echo ----------------------------------------------------------------
echo   E-mail : admin@agrotech.com.br (ou admin@superagtech.com.br)
echo   Senha  : admin123
echo   Perfil : SUPERADMIN (Acesso Total irrestrito a todos os recursos)
echo ----------------------------------------------------------------
echo.
echo Pressione CTRL+C para encerrar o servidor quando desejar.
echo ================================================================
echo.

node server.cjs
pause
