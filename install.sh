#!/usr/bin/env bash
# ==============================================================================
# AGROTECH ENTERPRISE — SCRIPT DE INSTALAÇÃO UNIVERSAL AUTOMATIZADA
# Compatível com Ubuntu 20.04/22.04/24.04 LTS, Debian 11/12, CentOS e Fedora
# ==============================================================================

set -e

# Cores para exibição no terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}🌾 AGROTECH ENTERPRISE — O SISTEMA OPERACIONAL DA EMPRESA RURAL${NC}"
echo -e "${GREEN}   Instalador Universal Automatizado v3.0 (Local / On-Prem / VPS)${NC}"
echo -e "${GREEN}================================================================${NC}\n"

# 1. Verificação de permissões de root
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}[!] Recomendamos executar como root ou via sudo para instalar dependências e serviços.${NC}"
fi

INSTALL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$INSTALL_DIR"

echo -e "${BLUE}[1/5] Verificando ambiente de execução e dependências...${NC}"

# Detecta gerenciador de pacotes
if command -v apt-get >/dev/null 2>&1; then
  PKG_MANAGER="apt"
elif command -v dnf >/dev/null 2>&1; then
  PKG_MANAGER="dnf"
elif command -v yum >/dev/null 2>&1; then
  PKG_MANAGER="yum"
else
  PKG_MANAGER="unknown"
fi

# Instala Node.js 20 LTS se não existir
if ! command -v node >/dev/null 2>&1; then
  echo -e "${YELLOW}[*] Node.js não encontrado. Instalando Node.js v20 LTS...${NC}"
  if [ "$PKG_MANAGER" = "apt" ]; then
    apt-get update -qq
    apt-get install -y -qq curl ca-certificates gnupg git
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y -qq nodejs
  elif [ "$PKG_MANAGER" = "dnf" ] || [ "$PKG_MANAGER" = "yum" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    $PKG_MANAGER install -y nodejs git
  fi
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js detectado: ${NODE_VERSION}${NC}"

# 2. Configuração do arquivo de variáveis de ambiente .env
echo -e "\n${BLUE}[2/5] Configurando variáveis de ambiente (.env)...${NC}"
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    # Gera uma chave JWT secreta de 64 caracteres hexadecimais aleatória
    RANDOM_JWT=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n' 2>/dev/null || date +%s%N | sha256sum | head -c 64)
    sed -i "s/super_agrotech_enterprise_jwt_secret_change_me_in_production_2026/$RANDOM_JWT/g" .env
    echo -e "${GREEN}✓ Arquivo .env gerado com chave JWT criptográfica exclusiva.${NC}"
  else
    cat <<EOF > .env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n' 2>/dev/null || date +%s)
STORAGE_ENGINE=STANDALONE_LOCAL
EOF
    echo -e "${GREEN}✓ Arquivo .env criado com configurações padrão.${NC}"
  fi
else
  echo -e "${GREEN}✓ Arquivo .env existente preservado.${NC}"
fi

# 3. Criação de diretórios necessários e inicialização do Banco de Dados
echo -e "\n${BLUE}[3/5] Verificando estrutura de dados e inicializando banco limpo...${NC}"
mkdir -p data/certificados data/backups logs public app_static

# Inicializa ou restaura o banco de dados limpo para produção
if [ ! -f data/agtech_db.json ]; then
  echo -e "${YELLOW}[*] Banco de dados não encontrado. Inicializando banco limpo de produção...${NC}"
  node scripts/init_clean_db.cjs
else
  echo -e "${GREEN}✓ Banco de dados existente detectado em data/agtech_db.json.${NC}"
  echo -e "Deseja resetar para o estado inicial 100% limpo de fábrica? (Recomendado para novas implantações)"
  read -p "Resetar banco? (s/N): " RESET_DB
  if [ "$RESET_DB" = "s" ] || [ "$RESET_DB" = "S" ]; then
    node scripts/init_clean_db.cjs
  fi
fi
echo -e "${GREEN}✓ Estrutura e banco de dados prontos.${NC}"

# 4. Modo de Execução: Docker ou Bare-Metal (PM2 / Systemd)
echo -e "\n${BLUE}[4/5] Escolha a modalidade de execução desejada:${NC}"
echo "1) Serviço Local / Bare-Metal com PM2 ou Node (Recomendado para instalação rápida)"
echo "2) Container Docker Compose (com PostgreSQL / PostGIS 16)"
echo "3) Instalação como Serviço do Sistema (systemd / inicialização automática no boot)"
read -p "Opção [Padrão: 1]: " OPCAO_INSTALL
OPCAO_INSTALL=${OPCAO_INSTALL:-1}

case "$OPCAO_INSTALL" in
  2)
    if command -v docker >/dev/null 2>&1; then
      echo -e "${GREEN}[*] Inicializando containers com Docker Compose...${NC}"
      docker compose up -d --build
      echo -e "${GREEN}✓ Containers ativos e operacionais!${NC}"
    else
      echo -e "${RED}[X] Docker não está instalado. Prossiga com a opção 1 ou instale o docker primeiro.${NC}"
      OPCAO_INSTALL=1
    fi
    ;;
  3)
    if [ -d /etc/systemd/system ]; then
      echo -e "${GREEN}[*] Registrando serviço systemd agrotech.service...${NC}"
      cp infra/systemd/agrotech.service /etc/systemd/system/agrotech.service
      sed -i "s|/opt/agtech-platform|$INSTALL_DIR|g" /etc/systemd/system/agrotech.service
      systemctl daemon-reload
      systemctl enable agrotech.service
      systemctl restart agrotech.service
      echo -e "${GREEN}✓ Serviço agrotech.service instalado e ativo no boot do sistema!${NC}"
    else
      echo -e "${YELLOW}[!] Systemd não disponível neste ambiente. Usando inicialização direta.${NC}"
      OPCAO_INSTALL=1
    fi
    ;;
esac

if [ "$OPCAO_INSTALL" = "1" ]; then
  if command -v pm2 >/dev/null 2>&1; then
    pm2 stop agrotech-server 2>/dev/null || true
    pm2 start server.cjs --name "agrotech-server"
    pm2 save
    echo -e "${GREEN}✓ Servidor AGROTECH iniciado sob gerenciamento PM2!${NC}"
  else
    echo -e "${YELLOW}[*] PM2 não detectado. Iniciando servidor via background process...${NC}"
    nohup node server.cjs > logs/agrotech_out.log 2>&1 &
    sleep 2
    echo -e "${GREEN}✓ Servidor AGROTECH iniciado em background! Logs em logs/agrotech_out.log${NC}"
  fi
fi

# 5. Validação de Conectividade e Saúde da Aplicação
echo -e "\n${BLUE}[5/5] Testando saúde do servidor (Healthcheck)...${NC}"
sleep 2

HEALTH_CHECK_PASSED=false
for PORT_TEST in 3000 5173; do
  if curl -s -f "http://127.0.0.1:${PORT_TEST}/api/v1/health" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Endpoint http://localhost:${PORT_TEST}/api/v1/health respondeu com SUCESSO!${NC}"
    HEALTH_CHECK_PASSED=true
    break
  fi
done

if [ "$HEALTH_CHECK_PASSED" = true ]; then
  echo -e "\n${GREEN}================================================================${NC}"
  echo -e "${GREEN}🎉 AGROTECH ENTERPRISE INSTALADO COM 100% DE SUCESSO!${NC}"
  echo -e "${GREEN}================================================================${NC}"
  echo -e "Acesse a plataforma no seu navegador:"
  echo -e "  ➤ ${BLUE}http://localhost:3000${NC} ou ${BLUE}http://localhost:5173${NC}"
  echo -e "  ➤ Ou pelo IP da sua rede local (ex: http://192.168.1.xxx:3000)"
  echo -e "\n----------------------------------------------------------------"
  echo -e "🔐 ${GREEN}CREDENCIAIS DE ACESSO DO ADMINISTRADOR (ACESSO TOTAL):${NC}"
  echo -e "----------------------------------------------------------------"
  echo -e "  E-mail : ${YELLOW}admin@agrotech.com.br${NC} (ou admin@superagtech.com.br)"
  echo -e "  Senha  : ${YELLOW}admin123${NC}"
  echo -e "  Perfil : ${GREEN}SUPERADMIN (Acesso Total irrestrito a todos os recursos)${NC}"
  echo -e "----------------------------------------------------------------"
  echo -e "Cadastros Iniciais Disponíveis ao Acessar:"
  echo -e "  1. Cadastre sua Fazenda real (CNPJ, Inscrição Estadual, Município)"
  echo -e "  2. Importe o CAR (Cadastro Ambiental Rural) em GeoJSON/KML"
  echo -e "  3. Cadastre tratores e colheitadeiras para telemetria CAN Bus"
  echo -e "  4. Configure o Certificado Digital A1 (.pfx) para emissão de NF-e"
  echo -e "----------------------------------------------------------------"
  echo -e "\nPara visualizar o manual completo:"
  echo -e "  ➤ ${BLUE}MANUAL_IMPLANTACAO_E_USO_AGROTECH.md${NC} ou ${BLUE}MANUAL_ILUSTRADO_AGROTECH.html${NC}"
  echo -e "Para o guia completo do comprador do código-fonte:"
  echo -e "  ➤ ${BLUE}GUIA_DO_COMPRADOR_E_INSTALACAO_UNIVERSAL.md${NC}"
else
  echo -e "\n${YELLOW}[!] O servidor foi iniciado, mas ainda está inicializando as conexões.${NC}"
  echo -e "Verifique os logs com: tail -f logs/agrotech_out.log"
fi
