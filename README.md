# 🌾 AGROTECH Enterprise • O Sistema Operacional da Empresa Rural
**Plataforma Agro-Industrial Completa • Versão 3.0 Enterprise**

[![Node.js](https://img.shields.io/badge/Node.js-20.x%20LTS-1B4D3E.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-0F172A.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Design%20System-60--30--10%20Agro%20Modern-166534.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/Storage-PostgreSQL%2016%20%2B%20PostGIS-336791.svg)](https://postgis.net/)
[![SEFAZ](https://img.shields.io/badge/Fiscal-SEFAZ%20XMLDSig%20%2B%20EPEC-7C3AED.svg)](https://www.nfe.fazenda.gov.br/)
[![Tests](https://img.shields.io/badge/E2E%20Tests-18%2F18%20Passed%20(100%25)-10B981.svg)](./scripts)

---

## 📌 Visão Geral

O **AGROTECH Enterprise** é o sistema operacional definitivo da empresa rural, integrando em uma única arquitetura de alta performance desde a telemetria telemática de cabine (CAN Bus J1939) e monitoramento geoespacial por satélite (Sentinel-2), até a escrituração fiscal da Receita Federal (SPED LCDPR) e o mercado financeiro (CPR Digital registrada na B3 e simulação do Plano Safra).

Projetado tanto para operação local na sede da fazenda (com latência zero e suporte a contingência offline) quanto para hospedagem em nuvem multi-tenant para cooperativas e grupos agrícolas.

---

## 🚀 Instalação Rápida em 1 Clique

### No Linux (Ubuntu / Debian / CentOS / Fedora):
```bash
git clone https://github.com/Implantac/AGROTECH.git
cd AGROTECH
chmod +x install.sh
sudo ./install.sh
```

### No Windows (Windows 10, 11 ou Windows Server):
1. Tenha o **Node.js v20 LTS** instalado.
2. Dê um duplo-clique no arquivo `install-windows.bat`.

### Via Docker & Docker Compose:
```bash
docker compose up -d --build
```

Acesse no navegador: **`http://localhost:3000`** ou **`http://localhost:5173`** (Dual-binding ativo).

### 🔐 Credenciais do Usuário Administrador Inicial (Acesso Total)
Após a instalação automatizada, o sistema já estará configurado com banco de dados ACID limpo de fábrica e um usuário Administrador Mestre pronto para o primeiro login e parametrizações da fazenda:
- **E-mail**: `admin@agrotech.com.br` *(ou alias `admin@superagtech.com.br`)*
- **Senha Inicial**: `admin123`
- **Perfil de Acesso**: `SUPERADMIN` (Acesso irrestrito a todos os 135 módulos do sistema)
- **Status do Banco**: 100% limpo (0 talhões de teste, 0 frotas fictícias, 0 notas mockadas)

---

## 💎 Pilares Arquiteturais & Funcionalidades

1. **Telemetria de Frotas CAN Bus J1939 / ISOBUS**:
   - Decodificação de PGNs de motor em tempo real (RPM, temperatura, pressão de óleo, horímetro e consumo L/h).
   - Streaming Server-Sent Events (SSE) sem buffer em `/api/v1/telemetria/stream`.
   - Fila de contingência *Store-and-Forward* para áreas rurais sem sinal de celular.
2. **Módulo Fiscal SEFAZ & Reforma Tributária EC 132/2023**:
   - Assinatura digital XMLDSig RSA-SHA1 com Certificado Digital A1 (.pfx) padrão ICP-Brasil.
   - Contingência EPEC (Evento 110140) com transmissão para o Ambiente Nacional e conciliação em 168h.
   - Motor tributário com Split Payment, IBS (0,1%), CBS (0,9%), Cesta Básica Nacional (Alíquota Zero) e suporte aos 4 regimes rurais (PF, Simples, Presumido e Real).
3. **Conciliação Bancária OFX & SPED LCDPR**:
   - Importação de extratos `.ofx` (Sicredi, Banco do Brasil, Sicoob, Bradesco, Itaú).
   - Autoclassificação semântica de insumos, diesel, safra e salários.
   - Escrituração instantânea dos registros Q100 e 9999 do Livro Caixa Digital do Produtor Rural.
4. **Prescrições VRA ISO-XML (ISO 11783-10)**:
   - Geração de pacote `TASKDATA.XML` para monitores John Deere, Trimble e Case IH via pen-drive FAT32.
5. **Copilot Agronômico & Defesa Sanitária**:
   - Sequência científica de preparo de calda D.A.L.E. e controle de carência LMR.
   - Emissão de CFO vegetal (IN MAPA 33/2016) e e-GTA animal para áreas livres de febre aftosa.
6. **Financiamento Rural & Crédito**:
   - Simulador oficial do Plano Safra (BACEN MCR): Pronaf, Pronamp, Moderfrota e Proirriga.
   - Emissão do Dossiê Bancário Padronizado SCR / MCR com glebas do CAR.
7. **SST Rural NR-31 & eSocial Rural**:
   - Checklist de conformidade trabalhista e geração do Evento S-2240 (layout S-1.2) assinado.
8. **ESG & Rastreabilidade EUDR**:
   - Due Diligence antidesmatamento (Marco 31/12/2020) integrado ao TRACES NT da União Europeia.
   - Passaporte digital de lote com QR Code e integridade SHA-256.

---

## 📚 Documentação Técnica e Manuais Inclusos

- **`GUIA_DO_COMPRADOR_E_INSTALACAO_UNIVERSAL.md`**: Guia comercial completo para quem adquiriu o código-fonte, cobrindo modelos de monetização (SaaS / White-label), deploy em VPS nacional (Locaweb, KingHost, HostGator) e nuvens internacionais (AWS, Contabo, Hetzner).
- **`MANUAL_IMPLANTACAO_E_USO_AGROTECH.md`**: Manual técnico operacional completo com 29 seções detalhadas passo a passo.
- **`MANUAL_ILUSTRADO_AGROTECH.html`**: Manual gráfico interativo com navegação lateral e estilos para impressão em PDF.
- **`Relatorio_Master_AgroTech_Enterprise.md`**: Relatório executivo com as 40 seções de homologação técnica.

---

## 🧪 Testes Automatizados (18 Suítes E2E)

Execute a qualquer momento para validar 100% da integridade da aplicação:
```bash
npm test
```

---

## 📄 Licença Comercial

Código-fonte comercial concedido para uso, personalização e exploração econômica. Todos os direitos reservados.
