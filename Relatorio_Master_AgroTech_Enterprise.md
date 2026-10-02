# AGROTECH ENTERPRISE — O SISTEMA OPERACIONAL DA EMPRESA RURAL
## Relatório Executivo de Engenharia de Produto, Arquitetura e Implementação

---

### 1. Visão Geral & Posicionamento Oficial
- **Posicionamento**: "O sistema operacional da empresa rural."
- **Headline Oficial**: *"A inteligência que conecta toda a sua operação agrícola."*
- **Subheadline Oficial**: *"Gestão agrícola, máquinas, produção, custos, estoque, mercado, financeiro e inteligência em uma única plataforma."*
- **Identidade Visual**: Paleta cromática natural e corporativa (Verde floresta `#285943`, Verde agrícola `#5F8F52`, Verde suave `#8FBF88`, Areia `#F4F0E6`, Fundo `#F7F9F5`, Texto escuro `#26332A`, Texto secundário `#66736A`), sem tons neon e sem saturação agressiva.

---

### 2. Os 4 Questionamentos Fundamentais do Gestor Rural
Respondidos diretamente na Landing Page e no Dashboard operacional com rastreabilidade de dados:
1. **Quanto custou produzir cada saca neste talhão?**
   - Resposta via Custeio ABC: Insumos, diesel, hora-máquina e mão de obra alocados ao hectare e ao metro quadrado.
2. **Minhas máquinas estão trabalhando ou paradas agora?**
   - Resposta via Telemetria CAN Bus J1939 / ISOBUS 11783: Status de ignição, velocidade operacional, consumo de combustível (L/h e L/ha) e índice OEE em tempo real.
3. **Qual é o meu resultado financeiro real consolidado?**
   - Resposta via DRE por Talhão e Safra, Fluxo de Caixa Diário e Livro Caixa Digital do Produtor Rural (LCDPR).
4. **Quando e quanto devo vender da minha produção futura?**
   - Resposta via Preço de Equilíbrio (Break-Even), Contratos de Barter com CPR Financeira e cotações da B3/CBOT.

---

### 3. Storytelling Integrado em 7 Capítulos (Seção 8 da Especificação)
1. **Sua operação está ficando mais complexa**: O aumento de área, frotas conectadas e exigências fiscais expõem o gargalo da gestão fragmentada em planilhas.
2. **Tudo conectado em uma única plataforma**: Eliminação de silos com a unificação de talhão, oficina mecânica, balança, silos, banco e escritório contábil.
3. **Controle sua operação**: Do planejamento de semeadura ao romaneio de colheita com apontamentos offline em campo.
4. **Controle suas máquinas**: Monitoramento universal de telemetria multimarcas (John Deere, Case IH, New Holland, Valtra, Massey Ferguson, Jacto).
5. **Saiba quanto sua operação realmente custa**: Custo real apurado por talhão, por variedade de semente e por atividade mecânica.
6. **Transforme dados em decisões**: O que está acontecendo, por que aconteceu, o que vai acontecer e qual é a recomendação imediata.
7. **Cobertura de 12 Atividades e Setores Agrícolas**:
   - Grãos e Grandes Culturas (Soja, Milho, Algodão, Trigo, Arroz)
   - Pecuária Intensiva, Confinamento e SISBOV RFID
   - Culturas Perenes e Silvicultura (Café, Cana-de-Açúcar, Citros, Eucalipto)
   - Hortifrúti, Hidroponia e Cultivos Nobres
   - Logística de Granéis, Frete ANTT e Armazenagem em Silos
   - Crédito Rural, Barter Multi-Commodity e CPR Verde
   - Mercado de Carbono (SBCE e GHG Protocol)
   - Máquinas, Oficinas e Telemetria CAN Bus

---

### 4. Demonstração Interativa do Sistema (Seção 9 da Especificação)
Simulador interativo permitindo que o produtor explore 6 perspectivas operacionais antes de contratar:
- **Cockpit Executivo & Dashboard BI**: Visão consolidada da safra, produtividade média, margem líquida e alertas urgentes.
- **Mobile no Talhão (Offline)**: Interface de campo para celular/tablet com fila local de sincronização Outbox Pattern.
- **Mapa Interativo dos Talhões**: Georreferenciamento SIG com NDVI de satélite, alertas de pragas e status de colheita.
- **Máquinas & Telemetria em Tempo Real**: Velocidade, consumo instantâneo L/h, horímetro e alarmes de manutenção preventiva.
- **Custos Reais & DRE por Talhão**: Custeio ABC detalhado (Sementes, Fertilizantes, Defensivos, Diesel, Mão de Obra).
- **Assistente Digital com IA**: Consultas executivas reais com origem auditável dos dados da fazenda.

---

### 5. Onboarding Progressivo em 4 Etapas (`RegisterOnboardingScreen.tsx`)
Fluxo de autosserviço desenhado para transição sem atrito da Landing Page para a Plataforma:
- **Etapa 1: Acesso do Gestor**: Nome completo, e-mail institucional e senha corporativa.
- **Etapa 2: Propriedade Rural**: Nome da fazenda, município, estado e área total (ha).
- **Etapa 3: Tipo de Operação & Culturas**: Segmento (Grãos, Pecuária, etc.) e seleção de culturas (Soja, Milho, Algodão, Café, etc.).
- **Etapa 4: Primeiro Talhão**: Nome do primeiro talhão e metragem em hectares para disponibilização imediata do Cockpit.
- **Integração Real**: Chamada direta à API `/api/v1/auth/register`, isolamento multi-tenant (`tenantId`) e geração de token de sessão.

---

### 6. Planos de Assinatura SaaS Transparentes (Seção 12 da Especificação)
- **START (R$ 590/mês)**: Gestão de até 1.000 hectares, cadastro de até 3 propriedades, app de campo offline ilimitado, emissão de NF-e e suporte técnico.
- **PROFESSIONAL (R$ 1.490/mês — Mais Escolhido)**: Gestão de até 5.000 hectares, telemetria CAN Bus ilimitada, DRE por talhão, rateio societário LCDPR, auditoria EUDR/CAR e IA copiloto de safra.
- **ENTERPRISE (Personalizado)**: Áreas acima de 5.000 hectares, múltiplos CNPJs, integração ERP corporativo (SAP/TOTVS), SLA 99,9% com gerente de conta dedicado.
- **Seletor de Pagamento**: Chave Mensal / Anual com 20% de desconto institucional.

---

### 7. Validação Técnica, Testes e Conformidade
- **Suíte de Testes do Motor Agro**: 113 testes de regras agronômicas e financeiras aprovados (`test_core_engine.mjs`).
- **Suíte de Testes da Landing Page e Onboarding**: 100% dos testes aprovados (`test_landing_and_login.mjs`).
- **Suíte de Microserviços Core ERP**: 5 de 5 suítes aprovadas com 100% de precisão matemática (`scripts/test_core_erp_services.mjs`).
- **Pipeline CI/CD Completo**: 6 de 6 etapas aprovadas (`scripts/ci_test.sh`).
- **Auditoria SSR e Renderização**: 100% dos 45 módulos especializados renderizados no servidor sem exceções (`verify_render.mjs`).
- **Motor Offline Outbox Pattern (Princípio 12 & 2)**:
  - Backend com endpoints `/api/v1/sync/batch`, `/api/v1/sync/outbox` e `/api/v1/sync/outbox/resolve` com rastreabilidade total e resolução de conflitos (`PENDING`, `SYNCING`, `SYNCED`, `FAILED`, `CONFLICT`).
  - Sem mascaramento de erros em desconexões ou falhas de rádio; diagnóstico real persistido para reenvio idempotente.
  - Interface do operador com formulário de apontamento em campo imediato (Abastecimento, MIP, Pesagem e Calda).
- **Emissão Fiscal Rigorosa (Princípio 15)**:
  - Segregação explícita entre `HOMOLOGACAO` (aviso sem valor fiscal) e `PRODUCAO` (bloqueio por ausência de certificado A1 ICP-Brasil em `/api/v1/sefaz/nfe/emitir`).
- **Design System Rural Oficial**:
  - Paleta orgânica `#F7F9F5` (fundo off-white), `#1D4B38` / `#285943` (verde floresta), `#5F8F52` (verde agrícola) e `#EAF4E7` (verde suave) aplicada em todos os modais e componentes.
- **Compilação de Produção**: `tsc -b && vite build` finalizado com 0 erros de tipagem em 2.057 módulos.
- **Servidor Ativo**: `server.cjs` rodando e respondendo HTTP 200 em `0.0.0.0:5173`.

---

### 8. Harmonização Visual UI/UX & Resiliência Operacional (Princípios 1 a 5)
- **Harmonização da Paleta Rural Autêntica (107 Módulos)**:
  - Substituição de esquemas escuros por paleta orgânica adaptada à luz solar do campo:
    - Fundo Principal: `#F7F9F5` (Off-white natural)
    - Painéis e Superfícies: `#FFFFFF` com bordas sutis em `#EAF4E7`
    - Elementos Primários de Destaque: `#1D4B38` (Verde Floresta Escuro) e `#285943` (Verde Floresta)
    - Indicadores Agronômicos & Acentos: `#5F8F52` (Verde Agrícola) e `#8FBF88` (Verde Suave)
    - Grãos e Comercialização: `#D9B65D` / `#F4F0E6` (Areia e Dourado)
    - Telemetria e Recursos Hídricos: `#7DA9C4` (Azul Céu)
    - Tipografia: `#26332A` (Grafite Principal) e `#66736A` (Grafite Secundário)
- **Componentes Centrais Modernizados**:
  - `AgroMap.tsx` e painel de inspeção de talhão com estatísticas agronômicas, NDVI Sentinel-2 e custos ABC em tempo real.
  - `RomaneioColheitaModule.tsx` com display digital de balança rodoviária, cálculo automático de quebra por umidade/impureza segundo tabela CONAB e emissão rastreável.
  - `ComercializacaoBarterModule.tsx` com registro de CPR eletrônica vinculada à B3, acompanhamento de entregas e cálculo de paridade fazenda.
  - `LogisticaFretesModule.tsx` com emissão de MDF-e, cálculo de frete por piso mínimo ANTT e monitoramento de frota pesada.
  - `GlobalQuickEntryModal.tsx` com formulários rápidos de campo para pesagem animal, apontamento de calda, leitura de cocho e DLS.
  - `NotificationCenterModal.tsx` e `QuickAccessModal.tsx` com filtros de severidade e atalhos rápidos (`Ctrl+K`).
- **Resiliência e Integridade de Dados (`agroApiService.ts`)**:
  - Eliminação de fallbacks mascaradores de falhas: o sistema agora reporta explicitamente estados `ONLINE`, `DEGRADED` ou `OFFLINE`.
  - Emissão fiscal transparente com bloqueio preventivo de transmissões de produção sem certificado digital A1 ICP-Brasil credenciado.
  - Retenção idempotente no Outbox IndexedDB móvel durante desconexões de rádio ou celular na lavoura.
- **Cobertura de Testes Expandida**: 129 testes automatizados no Motor de Regras Agro + 5 suítes no Core ERP + suíte E2E da Landing Page/Login.
