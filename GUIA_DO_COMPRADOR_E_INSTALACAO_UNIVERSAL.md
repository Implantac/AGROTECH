# GUIA OFICIAL DO COMPRADOR E MANUAL DE INSTALAÇÃO UNIVERSAL
## AGROTECH ENTERPRISE — O SISTEMA OPERACIONAL DA EMPRESA RURAL
**Documentação Comercial, Arquitetura de Software e Guia de Deploy Multi-Ambiente (v3.0 Enterprise)**

---

## 1. APRESENTAÇÃO COMERCIAL DO PRODUTO & MODELO DE NEGÓCIOS

Parabéns pela aquisição do código-fonte do **AGROTECH Enterprise**! Você acaba de adquirir o mais completo, robusto e moderno sistema operacional para gestão do agronegócio desenvolvido no Brasil, cobrindo as 40 dimensões agro-industriais exigidas por produtores, cooperativas e tradings.

### 1.1. Oportunidades Comerciais para Quem Adquire o Código-Fonte
Com a posse deste código-fonte proprietário e integral, você está habilitado a:
1. **Comercializar como SaaS (Software as a Service)**: Cobrar mensalidades ou anuidades por fazenda, talhão ou módulo ativo (R$ 490 a R$ 4.500/mês por cliente).
2. **Implantação White-Label**: Customizar o sistema com o logotipo, cores e domínio de cooperativas, tradings, revendas de insumos ou grupos agrícolas.
3. **Venda de Licença Perpétua On-Premises**: Instalar o sistema em servidores locais na sede de grandes fazendas com suporte técnico e customizações sob demanda (tickets de R$ 30.000 a R$ 150.000 por projeto).
4. **Consultoria e Integrações Telemáticas**: Prestar serviços de instalação de gateways CAN Bus (SAE J1939) em tratores e colheitadeiras, auditoria ESG/EUDR e consultoria fiscal de reforma tributária (EC 132/2023).

### 1.2. Destaques Tecnológicos do AGROTECH
- **Arquitetura Híbrida de Armazenamento**: Opera tanto em modo Standalone (com motor embutido ACID POSIX JSON e hot-backup automático para latência zero) quanto conectado a instâncias corporativas de **PostgreSQL 16 com extensão geoespacial PostGIS 3.4**.
- **Ergonomia Visual 60-30-10 & Tipografia Humanizada**: Paleta moderna profissional sem poluição visual (*60% Neutro Luminoso `#F8FAF6`, 30% Ardósia Estrutural `#0F172A`, 10% Verde Floresta Nobre `#1B4D3E`*), acompanhada pelas fontes *Plus Jakarta Sans* e *Outfit*.
- **Offline Outbox Pattern (Princípio 12)**: Continua operando na cabine do maquinário ou no talhão sem sinal de celular (PWA Service Worker v2), gravando apontamentos em fila local e sincronizando com resolução de conflitos assim que o operador chega à sede da fazenda.
- **Motor Fiscal ICP-Brasil Real**: Assinatura digital XMLDSig RSA-SHA1 de notas fiscais NF-e modelo 55, contingência EPEC (Evento 110140 com prazo de 168h), escrituração SPED do Livro Caixa Digital (LCDPR) com conciliação OFX bancária e motor da Reforma Tributária (Split Payment, IBS e CBS).

---

## 2. ESTRUTURA DE DIRETÓRIOS E COMPONENTES DO CÓDIGO-FONTE

O código foi arquitetado de forma modular, desacoplada e limpa:

```text
agtech-platform/
├── app_static/                 # Build de produção compilado e otimizado (HTML, CSS, JS e assets)
├── data/                       # Diretório de persistência de dados
│   ├── agtech_db.json          # Banco de dados operacional em formato estruturado ACID
│   ├── agtech_db.backup.json   # Backup a quente sincronizado a cada transação
│   └── certificados/           # Diretório seguro para Certificados Digitais A1 (.pfx)
├── infra/                      # Infraestrutura e migrações
│   ├── migrations/             # Migrações SQL oficiais para PostgreSQL / PostGIS
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_barter_frete_irrigacao_solo.sql
│   │   └── 003_billing_and_audit.sql
│   ├── nginx/                  # Configuração de proxy reverso com SSL e SSE
│   │   └── agrotech.conf
│   └── systemd/                # Unidade de serviço para inicialização no boot do Linux
│       └── agrotech.service
├── public/                     # Ativos públicos e Service Worker PWA (sw.js, manifest.json)
├── scripts/                    # 18 Suítes de testes automatizados E2E e utilitários
├── src/                        # Código-fonte da aplicação React + TypeScript
│   ├── components/             # Mais de 135 módulos especializados do agronegócio
│   └── services/               # Motores lógicos (SEFAZ, OFX, ZARC, ISO-XML, Telemetria)
├── .env.example                # Modelo oficial de variáveis de ambiente
├── docker-compose.yml          # Orquestração conteinerizada (App + PostgreSQL PostGIS)
├── Dockerfile                  # Imagem Docker leve baseada em Node.js Alpine
├── install.sh                  # Instalador automatizado para Linux (1 clique)
├── install-windows.bat         # Instalador automatizado para Windows (1 clique)
├── start.sh / stop.sh          # Scripts rápidos de inicialização e parada
├── server.cjs                  # Servidor backend Node.js (Dual-binding 3000 e 5173)
├── MANUAL_IMPLANTACAO_E_USO_AGROTECH.md # Manual técnico completo (29 seções)
└── MANUAL_ILUSTRADO_AGROTECH.html       # Manual interativo ilustrado pronto para navegação
```

---

## 3. REQUISITOS DE SISTEMA & HARDWARE

O AGROTECH foi otimizado para rodar com eficiência extrema e baixo consumo de recursos:

| Perfil de Uso | Processador (CPU) | Memória RAM | Armazenamento | Sistema Operacional |
|:---|:---|:---|:---|:---|
| **Desenvolvimento / Teste Local** | 2 Núcleos (Intel/AMD/Apple M) | 4 GB | 5 GB livres | Windows 10/11, macOS, Linux |
| **Sede de Fazenda (On-Premises)** | 4 Núcleos (Core i3/i5/Ryzen 3) | 8 GB | 60 GB SSD | Ubuntu 22.04/24.04 LTS |
| **Servidor VPS Nuvem (Até 100 usuários)**| 2 a 4 vCPUs | 4 a 8 GB | 60 a 100 GB SSD | Ubuntu 24.04 LTS (64-bit) |
| **Cluster Corporativo Multi-Fazendas** | 8+ vCPUs | 16 a 32 GB | 250+ GB NVMe | Ubuntu Server / Debian 12 |

---

## 4. INSTALAÇÃO RÁPIDA EM 1 CLIQUE (SCRIPTS AUTOMATIZADOS)

### 4.1. Instalação em Linux / Ubuntu / Debian (1 Comando)
Basta clonar ou extrair os arquivos e executar o instalador oficial:

```bash
cd agtech-platform
chmod +x install.sh
sudo ./install.sh
```

O instalador verificará o Node.js, configurará o arquivo `.env` com chaves criptográficas geradas aleatoriamente, criará a estrutura de dados e permitirá que você escolha rodar via Docker, como serviço de sistema (`systemd`) ou com PM2.

### 4.2. Instalação em Windows (Windows 10, 11 ou Windows Server)
1. Certifique-se de ter o **Node.js v20 LTS** instalado ([Download oficial](https://nodejs.org/)).
2. Dê um duplo-clique no arquivo `install-windows.bat`.
3. O script criará o ambiente, inicializará o banco de dados limpo e iniciará o servidor instantaneamente.
4. Para inicializações futuras, basta dar duplo-clique em `start-windows.bat`.

### 4.3. Banco de Dados Limpo de Fábrica & Usuário Administrador Inicial (Acesso Total)
O instalador automatizado executa o script `scripts/init_clean_db.cjs`, garantindo que o comprador receba o sistema **100% funcional e com zero dados mockados ou resíduos de testes**:
- **0 talhões fictícios**: Pronto para você importar seu arquivo CAR real (GeoJSON, KML ou Shapefile).
- **0 máquinas fictícias**: Pronto para cadastrar seus tratores e colheitadeiras e conectar a telemetria CAN Bus.
- **0 notas fiscais ou lançamentos de teste**: Auditoria e livro caixa 100% zerados para sua escrituração contábil real.
- **0 logs de webhook ou filas residuais**: Histórico de auditoria limpo.

#### Credenciais do Administrador Mestre Inicial:
- **E-mail**: `admin@agrotech.com.br` *(ou alias `admin@superagtech.com.br`)*
- **Senha Inicial**: `admin123`
- **Perfil de Acesso**: `SUPERADMIN` *(Acesso irrestrito a todas as áreas, parametrizações e governança)*

#### Roteiro dos Cadastros Iniciais (Primeiros Passos do Cliente):
1. **Cadastro da Fazenda**: Acesse a plataforma e informe a Razão Social, CNPJ, Inscrição Estadual e Município da sua propriedade rural.
2. **Georreferenciamento dos Talhões**: Vá ao menu *Agricultura de Precisão / AgroMap* e importe o polígono do seu CAR ou demarque os pivôs e glebas.
3. **Cadastro da Frota**: Acesse *Telemetria de Frotas* para registrar os equipamentos e gerar as tags de telemetria CAN Bus J1939.
4. **Certificado Digital A1**: No menu lateral em *Credenciais do Tenant*, importe o arquivo `.pfx` do seu Certificado Digital ICP-Brasil e teste a conexão com a SEFAZ do seu estado.
5. **Delegação de Acessos**: Utilize a tela de governança RBAC para convidar os agrônomos, operadores e contadores da sua equipe.

---

## 5. INSTALAÇÃO MANUAL PASSO A PASSO (BARE-METAL)

Se preferir configurar o ambiente manualmente sem utilizar os instaladores automáticos:

### Passo 1: Instalar o Node.js v20 LTS
No Ubuntu/Debian:
```bash
sudo apt update && sudo apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Deve retornar v20.x
```

### Passo 2: Configurar o Arquivo `.env`
```bash
cp .env.example .env
# Edite as variáveis conforme sua infraestrutura
nano .env
```

### Passo 3: Inicializar o Servidor com PM2
O PM2 assegura que o sistema reinicie automaticamente se houver reboot do servidor ou falha de energia:
```bash
sudo npm install -g pm2
pm2 start server.cjs --name "agrotech-server"
pm2 save
pm2 startup
```

Pronto! Acesse pelo navegador em:
- `http://localhost:3000` (ou `http://SEU_IP:3000`)
- `http://localhost:5173` (Dual-binding ativo)

---

## 6. INSTALAÇÃO VIA DOCKER & DOCKER COMPOSE

Para ambientes corporativos que exigem isolamento de containers e banco relacional PostgreSQL com extensão geoespacial PostGIS:

```bash
# 1. Certifique-se de ter o Docker e Docker Compose instalados
docker -v
docker compose version

# 2. Iniciar todos os serviços em segundo plano
docker compose up -d --build

# 3. Verificar o status dos containers
docker compose ps
```

O Docker Compose iniciará automaticamente:
- Container `agro_postgres`: PostgreSQL 16 com extensão PostGIS 3.4 mapeado na porta `5432`, aplicando automaticamente as migrações em `infra/migrations/`.
- Container `super_agtech_production`: Aplicação AGROTECH mapeada nas portas `3000` e `5173`.

---

## 7. GUIA DE DEPLOY EM SERVIDORES DE HOSPEDAGEM (VPS / NUVEM)

### 7.1. Provedores Nacionais Recomendados
Para garantir conformidade com a LGPD e latência inferior a 15ms no território brasileiro:
- **Locaweb**: Servidor VPS Linux (Planos a partir de R$ 80/mês). Faturamento em Reais via boleto/NF.
- **KingHost**: Cloud Server VPS no Sul/Sudeste.
- **HostGator Brasil**: VPS Linux KVM em data center nacional.
- **UOL Host**: Cloud corporativo de alta disponibilidade.

### 7.2. Provedores Internacionais de Baixo Custo
- **Contabo**: VPS com 4 vCPUs e 8 GB RAM por ~US$ 6/mês.
- **Hetzner**: Excelente desempenho com processadores AMD EPYC.
- **DigitalOcean**: Droplet Standard ou Basic (US$ 24 a US$ 48/mês).

### 7.3. Passo a Passo Completo de Publicação em VPS Linux
Acesse seu VPS via SSH:
```bash
ssh root@SEU_IP_PUBLICO

# 1. Atualizar o sistema e instalar dependências
apt update && apt upgrade -y
apt install -y curl git ufw nginx certbot python3-certbot-nginx

# 2. Clonar o projeto no diretório /var/www
cd /var/www
git clone https://github.com/Implantac/AGROTECH.git agrotech
cd agrotech

# 3. Configurar ambiente
cp .env.example .env

# 4. Iniciar com PM2
npm install -g pm2
pm2 start server.cjs --name "agrotech"
pm2 save && pm2 startup

# 5. Configurar o Nginx Reverso
cp infra/nginx/agrotech.conf /etc/nginx/sites-available/agrotech
# Substitua 'sistema.suafazenda.com.br' pelo seu domínio real
sed -i 's/sistema.suafazenda.com.br/app.seudominio.com.br/g' /etc/nginx/sites-available/agrotech
ln -s /etc/nginx/sites-available/agrotech /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 6. Gerar Certificado SSL/TLS Gratuito com Renovação Automática
certbot --nginx -d app.seudominio.com.br --non-interactive --agree-tos -m seu-email@seudominio.com.br --redirect

# 7. Configurar Firewall UFW
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Seu sistema estará no ar com HTTPS seguro e cadeado verde em `https://app.seudominio.com.br`!

---

## 8. COMO CUSTOMIZAR A MARCA (WHITE-LABEL)

O AGROTECH foi estruturado para que você possa alterar a identidade da aplicação com facilidade:

1. **Nome da Plataforma e Títulos**:
   - Edite o arquivo `index.html` alterando a tag `<title>` e as meta tags de descrição.
   - No arquivo `server.cjs`, altere o campo `posicionamento` e `nome` no endpoint `/api/v1/health`.
2. **Logotipo e Favicon**:
   - Substitua o arquivo `public/favicon.svg` pelo ícone da sua empresa.
   - O logotipo do Topbar e da barra lateral pode ser ajustado diretamente em `src/App.tsx`.
3. **Paleta de Cores Institucionais**:
   - O projeto segue o padrão Tailwind CSS. Para personalizar a cor primária de Verde Floresta (`#1B4D3E`) para o azul ou verde da sua empresa, basta substituir os códigos hexadecimais no arquivo `src/index.css`.

---

## 9. POLÍTICA DE BACKUP & SEGURANÇA DE DADOS

### 9.1. Backup Automático do Motor Embutido
O motor ACID do AGROTECH executa gravações atômicas via POSIX `fs.writeFileSync` sincronizado, acompanhado por um espelho quente contínuo em `data/agtech_db.backup.json`. 

### 9.2. Script de Backup Diário para Armazenamento Externo
Para criar backups compactados diários e enviá-los para um NAS, servidor secundário ou bucket S3:

```bash
#!/bin/bash
DESTINO="/backups/agrotech"
ORIGEM="/var/www/agrotech/data"
DATA=$(date +%Y%m%d_%H%M%S)

mkdir -p "$DESTINO"
tar -czf "$DESTINO/backup_agro_$DATA.tar.gz" "$ORIGEM"
# Manter os últimos 30 dias de backup
find "$DESTINO" -name "backup_agro_*.tar.gz" -mtime +30 -delete
```

---

## 10. VALIDAÇÃO E SUÍTE DE TESTES AUTOMATIZADOS (18 TESTES E2E)

Para certificar que o sistema está 100% operacional no seu servidor recém-instalado, execute o comando oficial de auditoria:

```bash
npm test
```

A suíte executará e homologará os 18 pilares da aplicação:
1. `test_billing_webhook_e2e.mjs` — SaaS Billing, Pix BACEN e reconciliação.
2. `test_telemetry_gis_e2e.mjs` — CAN Bus J1939, CAR WGS84 e PostGIS.
3. `test_rbac_governance.mjs` — Governança dos 6 perfis RBAC.
4. `test_offline_outbox_e2e.mjs` — Operação offline e sincronização Outbox.
5. `test_esg_lcdpr_e2e.mjs` — Due Diligence EUDR e Livro Caixa SPED.
6. `test_zarc_renovabio_e2e.mjs` — Zoneamento ZARC e CBIOs RenovaBio.
7. `test_tenant_credentials_e2e.mjs` — Mascaramento e Certificado Digital A1.
8. `test_manual_and_telematics_guide.mjs` — Manuais e guias telemáticos.
9. `test_reforma_tributaria_ibscbs_e2e.mjs` — Split Payment, IBS e CBS.
10. `test_todos_os_regimes_tributarios_e2e.mjs` — Lucro Real, Presumido, Simples e PF.
11. `test_security_auth_hardening_e2e.mjs` — PBKDF2 FIPS e Rate Limiting.
12. `test_database_persistence_e2e.mjs` — Persistência, concorrência e migrations.
13. `test_real_sefaz_telemetry_hardening_e2e.mjs` — SEFAZ XMLDSig e Contingência EPEC.
14. `test_isoxml_and_remotesensing_e2e.mjs` — Prescrições ISO-XML e índices NDVI/NDRE.
15. `test_todas_as_melhorias_estrategicas_e2e.mjs` — Ordem de Calda DALE e OEE.
16. `test_barter_sanidade_balancohidrico_e2e.mjs` — CPR Digital B3, CFO e e-GTA.
17. `test_plano_safra_nr31_renovabio_e2e.mjs` — Plano Safra MCR, NR-31 e eSocial S-2240.
18. `test_ofx_e_cockpit_e2e.mjs` — Conciliação Bancária OFX e LCDPR Q100.

---

## 11. SUPORTE TÉCNICO & TERMOS DA LICENÇA

Este pacote concede ao comprador o direito irrevogável de uso, modificação, personalização e revenda do sistema ou de seus serviços derivados em conformidade com as cláusulas do contrato comercial.

Para dúvidas técnicas adicionais, consulte os manuais inclusos no pacote:
- `MANUAL_IMPLANTACAO_E_USO_AGROTECH.md` (Documentação detalhada com 29 seções operacionais)
- `MANUAL_ILUSTRADO_AGROTECH.html` (Manual gráfico interativo pronto para navegação web e impressão)

---
*AGROTECH Enterprise • Sistema Operacional da Empresa Rural • Todos os direitos reservados.*
