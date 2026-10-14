# MANUAL COMPLETO E DEFINITIVO DE OPERAÇÃO, IMPLANTAÇÃO E TELEMETRIA
## AGROTECH — O Sistema Operacional da Empresa Rural
**Documento Técnico Oficial • Versão 3.0 Enterprise • Padrão Agro-Industrial Brasileiro**

---

## SUMÁRIO GERAL COMPLETO (29 SEÇÕES OPERACIONAIS)

1. [Visão Geral, Arquitetura e Ergonomia Visual (60-30-10)](#1-visão-geral-arquitetura-e-ergonomia-visual-60-30-10)
2. [Acesso, Autenticação e Perfis Operacionais (RBAC)](#2-acesso-autenticação-e-perfis-operacionais-rbac)
3. [Navegação e Cockpit Central de Comando](#3-navegação-e-cockpit-central-de-comando)
4. [Configuração de Módulos Produtivos e Culturas da Safra](#4-configuração-de-módulos-produtivos-e-culturas-da-safra)
5. [Mapeamento Geoespacial, Talhões e Cadastro Ambiental Rural (CAR)](#5-mapeamento-geoespacial-talhões-e-cadastro-ambiental-rural-car)
6. [Manual de Instalação Física do Chicote Telemático CAN Bus (SAE J1939 / ISO 11783)](#6-manual-de-instalação-física-do-chicote-telemático-can-bus-sae-j1939--iso-11783)
7. [Protocolo de Validação e Comissionamento In Loco com Operadores](#7-protocolo-de-validação-e-comissionamento-in-loco-com-operadores)
8. [Monitoramento Psicrométrico de Delta T (ASABE S572) e Aplicações](#8-monitoramento-psicrométrico-de-delta-t-asabe-s572-e-aplicações)
9. [Resiliência Offline-First e Sincronização de Campo (Princípio 12 - Outbox Pattern)](#9-resiliência-offline-first-e-sincronização-de-campo-princípio-12---outbox-pattern)
10. [Módulo Fiscal: NF-e do Produtor (Mod. 55) e LCDPR SPED 0013](#10-módulo-fiscal-nf-e-do-produtor-mod-55-e-lcdpr-sped-0013)
11. [ESG & Due Diligence Antidesmatamento Europeu (EUDR 2023/1115)](#11-esg--due-diligence-antidesmatamento-europeu-eudr-20231115)
12. [Gestão Financeira, CPR Eletrônica B3 e Hedge Cambial NDF](#12-gestão-financeira-cpr-eletrônica-b3-e-hedge-cambial-ndf)
13. [Zoneamento de Risco Climático (ZARC) e RenovaBio (CBIOs)](#13-zoneamento-de-risco-climático-zarc-e-renovabio-cbios)
14. [Governança e Matriz de Permissões RBAC Superadmin](#14-governança-e-matriz-de-permissões-rbac-superadmin)
15. [Resolução de Problemas, Suporte e Dúvidas Frequentes (FAQ)](#15-resolução-de-problemas-suporte-e-dúvidas-frequentes-faq)
16. [Guia de Instalação Local e Servidor On-Premises na Fazenda](#16-guia-de-instalação-local-e-servidor-on-premises-na-fazenda)
17. [Guia de Hospedagem e Deploy nas Principais Nuvens do Brasil](#17-guia-de-hospedagem-e-deploy-nas-principais-nuvens-do-brasil)
18. [Módulo Fiscal Avançado SEFAZ: Assinatura XMLDSig ICP-Brasil e Contingência EPEC](#18-módulo-fiscal-avançado-sefaz-assinatura-xmldsig-icp-brasil-e-contingência-epec)
19. [Reforma Tributária da EC 132/2023: Split Payment, IBS, CBS e Auditoria dos Regimes Fiscais Agro](#19-reforma-tributária-da-ec-1322023-split-payment-ibs-cbs-e-auditoria-dos-regimes-fiscais-agro)
20. [Conciliação Bancária OFX Automática e Injeção no SPED LCDPR (Registro Q100)](#20-conciliação-bancária-ofx-automática-e-injeção-no-sped-lcdpr-registro-q100)
21. [Prescrição em Taxa Variável VRA ISO-XML (ISO 11783-10) e Pen-Drive ISOBUS](#21-prescrição-em-taxa-variável-vra-iso-xml-iso-11783-10-e-pen-drive-isobus)
22. [Copilot Agronômico: Ordem de Tanque D.A.L.E. e Carência Fitossanitária (LMR)](#22-copilot-agronômico-ordem-de-tanque-dale-e-carência-fitossanitária-lmr)
23. [OEE Agrícola de Frotas e Manutenção Preditiva CAN Bus](#23-oee-agrícola-de-frotas-e-manutenção-preditiva-can-bus)
24. [Defesa Sanitária Agropecuária: Emissão de CFO Vegetal e e-GTA Animal (MAPA/INDEA)](#24-defesa-sanitária-agropecuária-emissão-de-cfo-vegetal-e-e-gta-animal-mapaindea)
25. [Financiamento Rural Oficial (Plano Safra BACEN MCR) e Dossiê Bancário SCR](#25-financiamento-rural-oficial-plano-safra-bacen-mcr-e-dossiê-bancário-scr)
26. [Segurança e Saúde no Trabalho Rural (NR-31) e eSocial Rural (Evento S-2240)](#26-segurança-e-saúde-no-trabalho-rural-nr-31-e-esocial-rural-evento-s-2240)
27. [Rastreabilidade Digital de Grãos por Lote e Passaporte EUDR com QR Code](#27-rastreabilidade-digital-de-grãos-por-lote-e-passaporte-eudr-com-qr-code)
28. [Faturamento SaaS Billing e Assinaturas via Pix BACEN em Tempo Real](#28-faturamento-saas-billing-e-assinaturas-via-pix-bacen-em-tempo-real)
29. [Painel de Credenciais Corporativas e Mascaramento de Segredos de Campo](#29-painel-de-credenciais-corporativas-e-mascaramento-de-segredos-de-campo)

---

## 1. VISÃO GERAL, ARQUITETURA E ERGONOMIA VISUAL (60-30-10)

O **AGROTECH** foi projetado para ser o **Sistema Operacional Completo da Empresa Rural**, operando desde a cabine de tratores e colheitadeiras sem conectividade até as diretorias financeiras e tradings internacionais.

![Visão Geral da Plataforma AGROTECH Enterprise](screenshot_platform_overview.png)
*Figura 1: Visão Geral da Interface Principal do AGROTECH — Layout limpo com paleta 60-30-10, Topbar único de 50px e Left Sidebar.*

### 1.1. Ergonomia e Paleta Oficial 60-30-10
Para eliminar a fadiga visual e proporcionar leitura nítida em tablets e monitores sob a forte luminosidade solar do campo:
- **60% Fundo Neutro Dominante**: Off-white luminoso (`#F7F9F5` ou `#F8FAF6`) com cartões brancos e bordas suaves em ardósia clara (`#E2E8F0`).
- **30% Estrutura Corporativa**: Ardósia e cinza escuro (`#0F172A`) na Left Sidebar, cabeçalhos modais e tabelas técnicas.
- **10% Acentos Direcionadores**: Verde Floresta Nobre (`#1D4B38` / `#1B4D3E`) reservado com exclusividade para botões de ação primária (CTAs), confirmações e status verificados.

---

## 2. ACESSO, AUTENTICAÇÃO E PERFIS OPERACIONAIS (RBAC)

![Tela de Acesso e Seleção de Perfil Operacional](screenshot_login_design.png)
*Figura 2: Tela de Acesso e Login — Simulação de perfis com um clique e credenciais multi-tenant.*

### 2.1. Como Acessar o Sistema
1. Abra o navegador no endereço da plataforma (ex: `http://localhost:3000`, `http://localhost:5173` ou o link da nuvem).
2. Na tela de login, informe seu e-mail e senha corporativa ou utilize o seletor de **Perfis Rápidos** para demonstração e homologação:
   - **Superadmin (Titular / Proprietário)**: `admin@superagtech.com.br`
   - **Agrônoma Responsável Técnica (RT)**: `juliana.prado@superagtech.com.br`
   - **Operador de Frotas / Maquinário**: `operador.valmor@superagtech.com.br`
   - **Contadora Fiscal Rural**: `valeria.contabil@superagtech.com.br`
   - **Médico Veterinário**: `veterinario.marcelo@superagtech.com.br`
3. Clique em **Entrar no Sistema Operacional**.

### 2.2. Entendendo os Perfis de Acesso (RBAC)
Cada colaborador enxerga estritamente o que compete à sua função:
- **Operador**: Vê apenas telemetria, apontamentos rápidos de colheita/plantio e ordens de serviço. As abas fiscais, contábeis e de barter ficam ocultas.
- **Agrônomo**: Tem acesso irrestrito a laudos de solo, receituário agronômico, ZARC, balanço hídrico FAO-56 e prescrições VRA.
- **Contador**: Visualiza Livro Caixa Digital (LCDPR), notas fiscais SEFAZ e demonstrativos DRE.
- **Superadmin**: Possui autoridade exclusiva para delegar módulos extras a outros perfis.

---

## 3. NAVEGAÇÃO E COCKPIT CENTRAL DE COMANDO

![TopBar e Navegação Rápida](screenshot_platform_topbar.png)
*Figura 3: Topbar de 50px — Cotações em tempo real da B3, indicador de Delta T, status de sincronização e busca universal.*

### 3.1. Recursos do Topbar Superior (50px de Altura)
- **Busca Universal (Ctrl + K)**: Pressione `Ctrl + K` em qualquer tela para abrir a *Command Palette*. Digite o nome de qualquer módulo, talhão, máquina ou comando rápido para navegar instantaneamente sem usar o mouse.
- **Cotações Agrícolas em Tempo Real**: Visualize os preços vigentes da Soja B3, Milho, Boi Gordo e Câmbio Dólar PTAX.
- **Monitor Psicrométrico Delta T**: Exibe o índice atual de pulverização (`ΔT 5.2°C - Janela Ideal`). Clique para abrir a simulação psicrométrica completa.
- **Status Offline Sync**: Indicador luminoso verde com pulso que confirma que a fila de sincronização em segundo plano está ativa.
- **Dossiê Bancário**: Atalho direto para gerar o relatório consolidado de capacidade produtiva para financiamentos bancários (Plano Safra).
- **Manual do Sistema**: Botão direto para abrir o manual de implantação e guia telemático.
- **Botão Novo Lançamento**: Permite abrir a central rápida de apontamentos de campo em 1 clique.

---

## 4. CONFIGURAÇÃO DE MÓDULOS PRODUTIVOS E CULTURAS DA SAFRA

![Configuração de Módulos e Culturas Agrícolas](screenshot_module_config_culturas.png)
*Figura 4: Seletor Interativo de Culturas e Atividades da Safra.*

### 4.1. Como Customizar os Módulos da Sua Fazenda
1. Na barra lateral esquerda, clique em **Configurar Módulos**.
2. **Aba Culturas Agrícolas**: Selecione as lavouras plantadas na safra atual (Soja, Milho Safrinha, Algodão HVI, Cana-de-Açúcar, Café, Silvicultura, etc.).
3. **Aba Pecuária & Especiais**: Marque as atividades zootécnicas ativas (Gado de Corte, Confinamento, Pecuária de Leite, Piscicultura, Biofábrica On-Farm).
4. **Revisar e Salvar**: Clique em **Salvar Configurações**. A barra lateral e os atalhos serão reorganizados para exibir somente os módulos selecionados, limpando a tela de qualquer distração desnecessária.

---

## 5. MAPEAMENTO GEOESPACIAL, TALHÕES E CADASTRO AMBIENTAL RURAL (CAR)

![Mapeamento Geoespacial e Talhões SICAR WGS84](screenshot_gis_map.png)
*Figura 5: Mapa SIG e Gestão de Talhões Georreferenciados.*

### 5.1. Como Importar o CAR e Delimitar Talhões
1. No menu principal, clique em **Mapeamento SIG / Talhões**.
2. Clique no botão **Importar CAR (.geojson / .shp)** no topo do mapa.
3. Selecione o arquivo exportado do portal SICAR da fazenda.
4. O motor geoespacial do AGROTECH processará o polígono e calculará automaticamente:
   - Área Total da Fazenda em hectares na projeção geodésica WGS84.
   - Perímetro de Reserva Legal (20% a 80%) e Áreas de Preservação Permanente (APP).
   - Divisão dos talhões produtivos com centróides e cálculo de área agricultável útil.
5. Para visualizar índices de vegetação, ative a camada **Sentinel-2 L2A** e alterne entre **NDVI** (Índice de Vigor Vegetativo) e **NDRE** (Clorofila e Nitrogênio na biomassa densa).

![Visualização de Biomassa NDRE no Mapa](screenshot_gis_map_ndre.png)
*Figura 6: Camada de Vigor Vegetativo NDRE processada por sensoriamento remoto.*

---

## 6. MANUAL DE INSTALAÇÃO FÍSICA DO CHICOTE TELEMÁTICO CAN BUS (SAE J1939 / ISO 11783)

![Telemetria de Frotas e Monitoramento de Maquinário](screenshot_domain_frotas.png)
*Figura 7: Painel de Telemetria de Frotas — Acompanhamento de rotação, temperatura, horímetro e consumo.*

### 6.1. Requisitos de Segurança e Ferramental
- **Segurança Obrigatória**: Desligue a chave geral da máquina e desconecte o cabo negativo da bateria antes de tocar em qualquer conector.
- **Ferramental Recomendado**: Multímetro digital calibrado com escala de continuidade/Ohms, alicate desencapador de fios, fita isolante auto-fusão e abraçadeiras de nylon UV.

### 6.2. Pinagem do Conector Deutsch HD10 de 9 Pinos (J1939-13)
O conector padrão de diagnóstico fica localizado na cabine, abaixo da coluna de direção ou na caixa de relés:

```
       CONECTOR DEUTSCH 9 PINOS (J1939-13 TIPO 1 / TIPO 2)
                            (Vista Frontal)

                             [ B: VCC ]   [ A: GND ]
                                 \           /
                       [ C: CAN_H ]---\-----/--- [ J: Ignição ]
                                       \   /
                       [ D: CAN_L ]-----( O )--- [ H: OEM ]
                                       /                          [ E: SHLD ]----/-----\--- [ G: ISOBUS ]
                                     /                                         [ F: ISOBUS ]
```

| Pino | Identificação | Cor do Fio | Finalidade Técnica |
| :---: | :--- | :--- | :--- |
| **Pino A** | **GND (Terra)** | Preto | Aterramento no chassi do veículo |
| **Pino B** | **VCC (+12V/+24V)** | Vermelho | Alimentação direta da bateria com **fusível 3A** a < 20cm |
| **Pino C** | **CAN_H (High)** | Amarelo | Sinal positivo SAE J1939 (2.5V a 3.5V) |
| **Pino D** | **CAN_L (Low)** | Verde | Sinal negativo SAE J1939 (1.5V a 2.5V) |
| **Pino E** | **CAN_SHLD (Blindagem)** | Malha Nua | Blindagem aterrada em **um único ponto** |
| **Pino J** | **Ignição (KL15)** | Branco | Pós-chave para ligar/desligar o modem automaticamente |

### 6.3. Verificações Técnicas Cruciais
1. **Terminação de 60 Ohms**: Com a máquina desligada, meça entre o Pino C e o Pino D com o multímetro. O valor deve ser de **60 Ohms** (± 3 Ω). Se marcar 120 Ohms, um resistor de ponta de linha está rompido.
2. **Par Trançado**: Os condutores CAN_H e CAN_L devem possuir no mínimo **33 a 50 espiras por metro** para imunidade contra o alternador.
3. **Proteção Contra Picos e Surtos (Load Dump)**: Instale um Fusível de 3A e diodo TVS de 36V/600W na linha de energia para proteger o modem contra descargas indutivas (*load dump*).
4. **Antenas**: Fixe a antena GNSS RTK no centro do teto da cabine, longe de calhas e escapamentos.

---

## 7. PROTOCOLO DE VALIDAÇÃO E COMISSIONAMENTO IN LOCO COM OPERADORES

Execute este teste prático na cabine junto com o operador da máquina:

### 7.1. Checklist Estático
- [x] Conector Deutsch travado mecanicamente com o anel de baioneta girado.
- [x] Porta-fusível com fusível de 3A instalado e conectado à linha de força.
- [x] LED de alimentação do gateway aceso em verde fixo.
- [x] LED de comunicação CAN piscando rapidamente (tráfego de mensagens).
- [x] LED GNSS/GPS aceso (sinal travado com precisão métrica).

### 7.2. Checklist Dinâmico com Motor em Operação
1. **Ligue o motor da máquina**:
   - No AGROTECH, abra a tela de **Telemetria de Frotas**.
   - Compare o **RPM do Tacômetro (PGN 61444)**: deve ser idêntico ao mostrador do painel.
   - Verifique a **Pressão de Óleo (PGN 65263)**: deve oscilar entre 3.0 e 5.5 bar.
   - Acompanhe a **Temperatura do Líquido de Arrefecimento (PGN 65262)**: deve subir suavemente e estabilizar entre 82°C e 94°C.
2. **Teste de Deslocamento**:
   - O operador deve engatar a marcha e rodar 50 metros no pátio.
   - Verifique se a velocidade indicada em km/h e o rastro do GPS atualizam no mapa sem atrasos.

---

## 8. MONITORAMENTO PSICROMÉTRICO DE DELTA T (ASABE S572) E APLICAÇÕES

![Monitor Psicrométrico Delta T ASABE S572](screenshot_modal_delta_t.png)
*Figura 8: Modal Psicrométrico de Delta T — Análise da janela de pulverização em tempo real.*

### 8.1. Como Tomar Decisões de Pulverização com Delta T (ΔT)
- **O que é**: É a diferença entre o bulbo seco e o bulbo úmido da atmosfera calculada conforme a norma ASABE S572.1.
- **Faixas Decisórias**:
  - **ΔT < 2.0°C (PERIGO DE INVERSÃO TÉRMICA)**: Gotas ficam flutuando no ar e podem derivar para lavouras vizinhas. **NÃO APLIQUE**.
  - **2.0°C ≤ ΔT ≤ 8.0°C (JANELA IDEAL)**: Condição ótima para absorção estomática foliar e evaporação controlada. **PULVERIZE COM CONFIANÇA**.
  - **ΔT > 8.0°C (EVAPORAÇÃO SEVERA)**: Gotas evaporam antes de atingir o alvo biológico. Se indispensável aplicar, aumente o tamanho da gota (bicos de indução de ar) e use adjuvantes anti-evaporantes.

---

## 9. RESILIÊNCIA OFFLINE-FIRST E SINCRONIZAÇÃO DE CAMPO (PRINCÍPIO 12 - OUTBOX PATTERN)

![Cockpit de Sincronização Offline Outbox](screenshot_modal_sync.png)
*Figura 9: Cockpit de Sincronização Offline-First e Fila de Auditoria Outbox.*

![Visualização no Smartphone ou Tablet de Campo](screenshot_mobile_view.png)
*Figura 10: Interface Responsiva Mobile Cockpit para Operadores no Talhão.*

### 9.1. Como Funciona a Operação no Talhão Sem Internet (Offline Outbox Pattern)
1. Quando o operador entra em uma área sem sinal de celular (ou ativa o Modo Avião), o aplicativo continua funcionando normalmente graças ao **Service Worker v2**.
2. Cada apontamento (colheita, abastecimento, troca de turno) é gravado no banco de dados local com status `PENDING`.
3. Ao retornar ao alcance do Wi-Fi da sede ou cobertura 4G, o sistema sincroniza automaticamente o lote de operações com o servidor.
4. Caso haja alguma divergência de versão (outro usuário alterou o mesmo talhão enquanto offline), o sistema marca com status `CONFLICT` e permite ao gestor revisar e decidir qual versão manter com um clique.

---

## 10. MÓDULO FISCAL: NF-E DO PRODUTOR (MOD. 55) E LCDPR SPED 0013

![Emissor Fiscal e Livro Caixa Digital do Produtor Rural](screenshot_domain_fiscal.png)
*Figura 11: Módulo Fiscal — Emissão de NF-e e Geração de Arquivo SPED LCDPR.*

### 10.1. Como Emitir Nota Fiscal Eletrônica (NF-e Mod. 55)
1. Acesse o menu **Fiscal & Tributário**.
2. Selecione o tipo de operação: **Venda de Produção**, **Remessa para Armazenamento** ou **Barter de Insumos**.
3. Selecione o cliente (Trading ou Cooperativa) e informe a quantidade de sacas ou toneladas.
4. O sistema calcula automaticamente o ICMS com diferimento estadual, retenção de Funrural e gera a chave de acesso de 44 dígitos no módulo 11.
5. Clique em **Emitir e Transmitir à SEFAZ**. Havendo certificado A1 configurado, a autorização oficial em produção é processada em menos de 2 segundos.

### 10.2. Como Exportar o Livro Caixa Digital (LCDPR)
1. Na aba **LCDPR SPED**, clique em **Gerar Arquivo do Exercício**.
2. O sistema compila todas as entradas e saídas bancárias no layout 0013 da Receita Federal.
3. Faça o download do arquivo `.txt` gerado e importe diretamente no programa validador oficial da Receita Federal com zero pendências de conciliação.

---

## 11. ESG & DUE DILIGENCE ANTIDESMATAMENTO EUROPEU (EUDR 2023/1115)

### 11.1. Como Emitir a Declaração de Due Diligence (DDS)
1. No menu principal, selecione **ESG & Conformidade EUDR**.
2. Selecione o lote de soja, milho, café, cacau ou carne bovina destinado à exportação.
3. Clique em **Gerar Declaração Due Diligence**.
4. O sistema cruza os limites do talhão com o satélite PRODES e valida que não houve supressão vegetal após 31/12/2020.
5. É gerado o código de rastreabilidade compatível com o portal **TRACES NT** da União Europeia, acompanhado do cálculo de pegada de carbono (kg CO2e/t) e hash criptográfico SHA-256.

---

## 12. GESTÃO FINANCEIRA, CPR ELETRÔNICA B3 E HEDGE CAMBIAL NDF

![Hedge Cambial NDF e Contratos de Barter CPR](screenshot_domain_hedge.png)
*Figura 12: Módulo Financeiro — Controle de Trava de Câmbio NDF e Emissão de CPRs de Barter B3.*

### 12.1. Como Travar Câmbio e Emitir CPR de Barter
1. Acesse **Comercialização & Barter**.
2. Para travar insumos (fertilizantes, químicos, sementes) contra entrega de safra futura, informe o pacote de insumos e o volume de sacas prometidas.
3. Clique em **Emitir CPR-Física Eletrônica**.
4. O sistema gera a minuta da CPR conforme a Lei 13.986/2020 e registra o protocolo simulado para depósito em entidade autorizada pelo Banco Central (B3).
5. No módulo de Hedge, acompanhe as ordens de **NDF (Non-Deliverable Forward)** para blindar a receita em Reais contra a volatilidade do Dólar.

---

## 13. ZONEAMENTO DE RISCO CLIMÁTICO (ZARC) E RENOVABIO (CBIOS)

### 13.1. Consulta ZARC para Seguro Rural (PSR e Proagro)
1. Acesse **Zoneamento de Risco ZARC**.
2. Selecione seu município, o tipo de solo (Arenoso, Médio ou Argiloso) e o ciclo da variedade.
3. O sistema calcula a probabilidade de estresse hídrico decendial:
   - **Risco 20% (Baixo)**: Habilita até 40% de desconto na subvenção governamental do seguro rural (PSR).
   - **Risco > 40% ou Inapto**: Alerta sobre risco crítico e bloqueia concessão de crédito oficial fora da janela agronômica recomendada.

### 13.2. Cálculo de Créditos de Carbono RenovaBio (CBIOs)
1. Acesse **Calculadora RenovaBio (Lei 13.576/2017)**.
2. Informe o volume de biocombustível produzido (Etanol, Biodiesel, Biometano) e a fração de biomassa com CAR ativo.
3. O sistema aplica a Nota de Eficiência Energético-Ambiental (NEEA) e exibe os **CBIOs emitíveis na B3**, o valor bruto estimado e o valor líquido após custódia e taxa de certificação.

---

## 14. GOVERNANÇA E MATRIZ DE PERMISSÕES RBAC SUPERADMIN

![Matriz de Governança RBAC Exclusiva do Superadmin](screenshot_rbac_superadmin_matrix.png)
*Figura 13: Matriz de Permissões RBAC — Governança estrita acessível apenas pelo Superadmin.*

### 14.1. Como Liberar Recursos Especiais a um Usuário
1. Como Superadmin, abra o menu inferior esquerdo e clique em **Gerenciar Matriz de Acesso**.
2. Selecione o perfil desejado (ex: `OPERADOR`).
3. Marque os módulos adicionais solicitados pelo colaborador (ex: liberar acesso à aba de *MIP Manejo de Pragas* para um operador sênior).
4. Clique em **Salvar e Propagar Permissões**. A alteração entra em vigor instantaneamente em toda a rede da fazenda.

---

## 15. RESOLUÇÃO DE PROBLEMAS, SUPORTE E DÚVIDAS FREQUENTES (FAQ)

### P1: O que fazer se o LED CAN do gateway não piscar?
- **R**: Verifique se os pinos C (CAN_H) e D (CAN_L) não estão invertidos no conector Deutsch. Meça a resistência com multímetro: se marcar 0 Ohm, os fios estão em curto; se marcar 120 Ohms, conecte o resistor de terminação.

### P2: O sistema emite nota fiscal mesmo se a SEFAZ estadual cair?
- **R**: Sim. O AGROTECH possui contingência automática offline EPEC gerando o DANFE com QR Code de segurança para transporte imediato da carga de grãos. Ao retornar o webservice da SEFAZ, o XML é reconciliado automaticamente.

### P3: Os operadores de campo podem apagar registros acidentalmente?
- **R**: Não. O perfil de operador só possui permissão de inclusão de novos apontamentos. Todas as exclusões ou alterações retroativas exigem senha do Administrador ou do Agrônomo responsável, com registro no log de auditoria.

---

## 16. GUIA DE INSTALAÇÃO LOCAL E SERVIDOR ON-PREMISES NA FAZENDA

A instalação local (on-premises) é altamente recomendada para a sede da fazenda, garantindo que o escritório e as oficinas operem com latência zero (menos de 2ms) mesmo se a conexão externa via satélite ou rádio oscilar.

### 16.1. Requisitos Mínimos e Recomendados de Hardware
| Componente | Requisito Mínimo (Fazenda até 2.000 ha) | Recomendado (Grupo Agro > 2.000 ha / Multiusuário) |
| :--- | :--- | :--- |
| **Processador (CPU)** | Intel Core i3 / AMD Ryzen 3 (4 Núcleos) | Intel Core i7 / Xeon / AMD Ryzen 7 (8+ Núcleos) |
| **Memória RAM** | 8 GB DDR4 | 16 GB a 32 GB DDR4/DDR5 ECC |
| **Armazenamento** | SSD SATA 256 GB | SSD NVMe M.2 512 GB ou 1 TB (Leitura > 3.000 MB/s) |
| **Sistema Operacional** | Ubuntu Server 22.04 / 24.04 LTS (ou Debian 12) | Ubuntu Server 24.04 LTS x86_64 |
| **Conexão de Rede** | Roteador Gigabit Ethernet (1000 Mbps) | Switch Gerenciável Gigabit + Ponto de Acesso Wi-Fi 6 |
| **Alimentação** | No-Break Senoidal 1.200 VA (com bateria externa) | No-Break Online Dupla Conversão 3 kVA com gerador |

### 16.2. Instalação Rápida Automatizada via Docker Compose (Recomendado)
O AGROTECH disponibiliza uma arquitetura conteinerizada completa com isolamento de processos, reinicialização automática em caso de queda de energia e persistência em volumes mapeados:

```bash
# 1. Atualizar os pacotes do servidor Linux
sudo apt update && sudo apt upgrade -y

# 2. Instalar o Docker Engine e Docker Compose Plugin
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Clonar o repositório oficial do AGROTECH
cd /opt
sudo git clone https://github.com/Implantac/AGROTECH.git
cd AGROTECH

# 4. Iniciar os containers em segundo plano (Dual-bind portas 3000 e 5173)
sudo docker compose up -d --build

# 5. Verificar o status e logs de inicialização
sudo docker compose ps
sudo docker compose logs -f agtech-app
```

O sistema estará imediatamente acessível nos navegadores de todos os computadores, tablets e smartphones conectados ao Wi-Fi da fazenda pelo endereço `http://IP_DO_SERVIDOR:3000` ou `http://IP_DO_SERVIDOR:5173`.

### 16.3. Instalação Manual Bare-Metal (Node.js 20+ LTS)
Caso prefira rodar diretamente no sistema operacional sem Docker:

```bash
# 1. Instalar o Node.js v20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# 2. Verificar versões instaladas
node -v  # Deve retornar v20.x ou superior
npm -v   # Deve retornar v10.x ou superior

# 3. Baixar o sistema e instalar o gerenciador de processos PM2
cd /var/www
sudo git clone https://github.com/Implantac/AGROTECH.git
cd AGROTECH
sudo npm install -g pm2

# 4. Executar os testes automatizados para validar a integridade
npm test

# 5. Iniciar o AGROTECH com inicialização automática no boot do servidor
pm2 start server.cjs --name "agrotech-server"
pm2 save
pm2 startup
```

---

## 17. GUIA DE HOSPEDAGEM E DEPLOY NAS PRINCIPAIS NUVENS DO BRASIL

Para empresas rurais com múltiplas unidades produtivas ou que necessitam de acesso remoto seguro por agrônomos em trânsito, escritórios na capital e tradings parceiras, o AGROTECH deve ser hospedado em um provedor de nuvem com data center localizado no Brasil para assegurar baixa latência e conformidade com a LGPD.

### 17.1. Panorama das Opções de Hospedagem no Brasil
| Provedor | Modalidade Indicada | Região / Data Center | Custo Estimado | Vantagem Principal |
| :--- | :--- | :--- | :--- | :--- |
| **Locaweb** | Servidor VPS Linux | São Paulo (Brasil) | R$ 80 a R$ 220 / mês | Faturamento em Reais via boleto/NF e suporte 24/7 em português |
| **KingHost** | Cloud VPS | Porto Alegre / Curitiba | R$ 75 a R$ 190 / mês | Baixa latência no Sul/Sudeste e painel amigável |
| **HostGator Brasil** | VPS Linux KVM | São Paulo (Brasil) | R$ 90 a R$ 250 / mês | Suporte nacional e excelente custo-benefício |
| **UOL Host** | Cloud Server | São Paulo (Brasil) | R$ 110 a R$ 300 / mês | Infraestrutura nacional consolidada e alta disponibilidade |
| **AWS América do Sul** | EC2 / ECS Fargate | `sa-east-1` (São Paulo) | US$ 30 a US$ 90 / mês | Escalabilidade ilimitada, integração com S3 e RDS PostGIS |
| **Google Cloud (GCP)**| Compute Engine / Run | `southamerica-east1` (SP) | US$ 35 a US$ 100 / mês | Rede óptica de altíssima velocidade e Cloud SQL PostGIS |
| **Oracle Cloud (OCI)** | Ampere A1 (Always Free) / E4 | Vinhedo / São Paulo | Gratuito a R$ 150 / mês | Camada gratuita robusta (4 OCPUs, 24GB RAM) em data center no Brasil |

---

### 17.2. Passo a Passo de Deploy em VPS Nacional (Locaweb / KingHost / HostGator)

#### Passo 1: Contratação do Servidor VPS
1. Acesse o portal do provedor escolhido (ex: [Locaweb VPS](https://www.locaweb.com.br/vps/) ou [HostGator VPS](https://www.hostgator.com.br/servidor-vps)).
2. Selecione o plano com no mínimo **4 GB de RAM**, **2 vCPUs** e **SSD de 60 GB**.
3. Escolha o Sistema Operacional **Ubuntu 24.04 LTS (64 bits)**.
4. Conclua a contratação e anote o **IP Público Dedicado** fornecido (ex: `200.145.89.20`).

#### Passo 2: Registro de Domínio .com.br no Registro.br
1. Acesse [Registro.br](https://registro.br) e pesquise o domínio da sua empresa (ex: `agroindustriasantaluzia.com.br`).
2. Conclua o registro com o CNPJ da empresa rural.
3. No painel de **Configuração de DNS**, crie dois apontamentos do tipo **A**:
   - Nome: `@` (raiz) ➔ Dados: `200.145.89.20` (IP do seu VPS).
   - Nome: `sistema` (ou `app`) ➔ Dados: `200.145.89.20`.

#### Passo 3: Configuração do Servidor e Firewall
Conecte-se via SSH com seu terminal:
```bash
ssh root@200.145.89.20

# Configurar o firewall UFW fechando todas as portas exceto SSH e Web segura
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (Let's Encrypt)
ufw allow 443/tcp   # HTTPS Criptografado
ufw enable

# Instalar Docker e Git
apt update && apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx
```

#### Passo 4: Clonagem e Execução do AGROTECH
```bash
cd /var/www
git clone https://github.com/Implantac/AGROTECH.git
cd AGROTECH

# Iniciar o sistema isolado em container Docker
docker compose up -d --build
```

#### Passo 5: Configuração do Nginx Reverso com SSL/TLS 1.3 Gratuito
Crie o arquivo de configuração do proxy reverso em `/etc/nginx/sites-available/agrotech`:
```nginx
server {
    server_name sistema.agroindustriasantaluzia.com.br;

    client_max_body_size 64M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```
Ative o site e gere o certificado criptografado oficial ICP / Let's Encrypt:
```bash
ln -s /etc/nginx/sites-available/agrotech /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

certbot --nginx -d sistema.agroindustriasantaluzia.com.br --non-interactive --agree-tos -m financeiro@agroindustriasantaluzia.com.br --redirect
```

Pronto! Seu AGROTECH estará no ar em `https://sistema.agroindustriasantaluzia.com.br` com cadeado verde, TLS 1.3 e alta velocidade no Brasil inteiro.

---

### 17.3. Deploy em Nuvem AWS América do Sul (`sa-east-1` São Paulo)
Para operações corporativas que demandam arquitetura multi-região ou integração com serviços gerenciados:

```bash
# 1. Criar uma instância EC2 t3a.medium ou t4g.medium (Ubuntu 24.04 LTS) na região sa-east-1 (São Paulo)
# 2. Configurar o Security Group permitindo inbound:
#    - Porta 22 (SSH restrito ao IP do escritório)
#    - Portas 80 e 443 (Abertas para tráfego web mundial)

# 3. Associar um Elastic IP fixo para evitar alteração de IP em reinicializações
# 4. Conectar à instância e clonar o AGROTECH:
ssh -i "chave-agro.pem" ubuntu@ec2-sa-east-1.compute.amazonaws.com
sudo apt update && sudo apt install -y docker.io docker-compose git
git clone https://github.com/Implantac/AGROTECH.git
cd AGROTECH
sudo docker compose up -d --build
```

---

### 17.4. Checklist Final de Produção & Hardening de Segurança
Antes de liberar o sistema para todos os colaboradores da fazenda em ambiente de nuvem:
- [ ] **Variáveis de Ambiente**: Assegure-se de que o arquivo `.env.production` contenha um `JWT_SECRET` forte gerado com `openssl rand -hex 32`.
- [ ] **Certificado Digital A1**: Configure o certificado digital da fazenda no painel "Certificado A1 & APIs" e teste a SEFAZ autorizadora da sua UF.
- [ ] **Proteção Anti-Brute-Force**: Instale o `fail2ban` no servidor para banir tentativas suspeitas de invasão por SSH (`sudo apt install -y fail2ban`).
- [ ] **Backups Externos**: Configure a rotina de envio dos arquivos de banco para um bucket S3 ou servidor secundário com retenção mínima de 12 meses para atendimento fiscal.

---

## 18. MÓDULO FISCAL AVANÇADO SEFAZ: ASSINATURA XMLDSIG ICP-BRASIL E CONTINGÊNCIA EPEC

O AGROTECH integra um motor criptográfico nativo para emissão de Documentos Fiscais Eletrônicos (DF-e) com validação rígida de assinatura digital e comunicação direta com os WebServices das Secretarias de Fazenda estaduais.

### 18.1. Fluxo de Assinatura Digital XMLDSig RSA-SHA1
1. **Padrão ICP-Brasil**: O documento fiscal XML (NF-e modelo 55 ou NFC-e modelo 65) é envelopado conforme os manuais técnicos do ENCAT.
2. **Cálculo do DigestValue**: É efetuada a canonicalização C14N da tag `<infNFe>`, seguida pelo cálculo do hash SHA-1 / SHA-256 codificado em Base64.
3. **Assinatura RSA com Certificado A1**: A chave privada do certificado digital `.pfx` assina o DigestValue gerando a tag `<SignatureValue>`.
4. **Validação Criptográfica Antes do Envio**: O sistema executa uma validação em memória. Qualquer divergência de hash ou tentativa de adulteração de campos após a assinatura bloqueia a transmissão com alerta imediato.

### 18.2. Protocolo de Contingência EPEC (Evento Prévio de Emissão em Contingência)
Quando o WebService da SEFAZ estadual (ex: SEFAZ-MT, SEFAZ-GO, SEFAZ-PR) entra em indisponibilidade ou falha de timeout:
1. **Detecção Automática**: O sistema identifica a queda na conexão mTLS ou código de indisponibilidade SEFAZ.
2. **Geração do Evento 110140**: O AGROTECH estrutura o lote EPEC contendo chave de acesso de 44 dígitos com tipo de emissão `4` (EPEC), dados do emitente, destinatário, valor total e ICMS.
3. **Transmissão ao Ambiente Nacional da Receita Federal (AN)**: O evento é transmitido ao servidor central nacional da RFB, que retorna o protocolo de autorização EPEC.
4. **Liberação do Transporte**: O DANFE é impresso com a tarja oficial de contingência EPEC e QR Code, liberando o caminhão de grãos para transporte rodoviário regular.
5. **Reconciliação Estadual em até 168 horas**: Quando a SEFAZ de origem restabelece operação, o AGROTECH envia automaticamente o arquivo XML definitivo para homologação na UF, encerrando a pendência sem nenhuma intervenção manual.

---

## 19. REFORMA TRIBUTÁRIA DA EC 132/2023: SPLIT PAYMENT, IBS, CBS E AUDITORIA DOS REGIMES FISCAIS AGRO

O sistema operacional AGROTECH foi concebido em conformidade com as diretrizes da Emenda Constitucional nº 132/2023 e as Leis Complementares que instituem o novo Sistema Tributário Nacional.

### 19.1. Alíquotas de Transição e Benefícios Agropecuários
- **CBS (Contribuição sobre Bens e Serviços)**: Tributo federal com taxa de teste inicial de 0,9%.
- **IBS (Imposto sobre Bens e Serviços)**: Tributo compartilhado entre Estados e Municípios com taxa de teste de 0,1%.
- **Cesta Básica Nacional de Alimentos**: Alíquota zero (100% de desoneração) para grãos in natura (soja, arroz, feijão, milho), leite fluído e hortifrutícolas.
- **Insumos Agropecuários e Alimentos Essenciais**: Redução de 60% nas alíquotas padrão de IBS e CBS para fertilizantes, sementes certificadas e defensivos devidamente registrados no MAPA.

### 19.2. Mecanismo de Split Payment Automático
Ao liquidar transações de venda de commodities através do sistema bancário:
1. O AGROTECH calcula a parcela de IBS/CBS devida na operação.
2. Na liquidação financeira (via Pix, TED ou Cobrança Bancária), o montante tributário é automaticamente segregado e recolhido à conta da Receita Federal e Comitê Gestor do IBS.
3. O valor líquido é creditado na conta do produtor rural, eliminando riscos de inadimplência fiscal ou autuações futuras.

### 19.3. Auditoria dos 4 Regimes Fiscais do Agronegócio
1. **Produtor Pessoa Física (PF)**: Apuração pelo Livro Caixa (LCDPR) com limite de receita bruta até R$ 4,8 milhões ou opção pelo resultado presumido de 20%.
2. **Simples Nacional Rural**: Enquadramento simplificado para agroindústrias de pequeno porte e cooperativas familiares.
3. **Lucro Presumido**: Base de cálculo de 8% da receita bruta da atividade rural, aplicável a empresas agropecuárias de médio porte.
4. **Lucro Real**: Regime obrigatório para grupos com receita anual acima de R$ 78 milhões, com escrituração contábil completa, apuração de créditos não-cumulativos sobre insumos, diesel, energia elétrica e depreciação acelerada incentivada de maquinário agrícola (Lei 11.051/2004).

---

## 20. CONCILIAÇÃO BANCÁRIA OFX AUTOMÁTICA E INJEÇÃO NO SPED LCDPR (REGISTRO Q100)

A conciliação financeira do AGROTECH elimina a digitação manual de notas e despesas, convertendo extratos bancários brutos diretamente na escrituração fiscal oficial do produtor rural.

### 20.1. Como Importar Extrato Bancário OFX
1. Acesse o menu **Fiscal & Tributário** ➔ **Conciliação Bancária OFX**.
2. Clique em **Importar Arquivo OFX (.ofx)**.
3. O parser processa o cabeçalho bancário (identificando Banco, Agência, Conta Corrente e Moeda BRL).
4. As transações de crédito e débito são submetidas ao motor semântico de inteligência agropecuária:
   - **Venda de Safra / Grãos**: Mapeado para Código de Participante, Nota Fiscal e categoria de Entrada da Atividade Rural.
   - **Adubos, Químicos e Sementes**: Mapeado para Insumos Agrícolas (Registro Q100 tipo saída `2`).
   - **Combustível e Lubrificantes**: Classificado como Despesa de Combustível/Comboio.
   - **Folha de Pagamento Rural**: Classificado como Encargos Trabalhistas / Diárias de Campo.
5. Clique em **Confirmar Conciliação e Injetar no LCDPR**. Todos os lançamentos são instantaneamente formatados nos padrões dos registros Q100 e 9999 da Receita Federal.

---

## 21. PRESCRIÇÃO EM TAXA VARIÁVEL VRA ISO-XML (ISO 11783-10) E PEN-DRIVE ISOBUS

A agricultura de precisão moderna exige comunicação universal entre o software de gestão e os computadores de bordo dos tratores e distribuidores de insumos.

### 21.1. Geração de Prescrição ISO 11783
1. No menu **Agricultura de Precisão**, acesse **Prescrições VRA**.
2. Selecione o talhão alvo e o produto a ser aplicado (ex: *Fosfato Monoamônico MAP*, *Cloreto de Potássio KCl* ou *Calcário Dolomítico*).
3. O sistema cruza os laudos de análise química de solo com o mapa de biomassa de satélite Sentinel-2 e gera a grade de doses variáveis em kg/ha.
4. Clique em **Gerar Arquivo TASKDATA.XML (ISO-XML)**.
5. O pacote padronizado é compilado contendo as tags normativas `<TSK>`, `<PDT>`, `<VPN>` e `<PNT>` georreferenciadas na projeção WGS84.

### 21.2. Como Carregar o Arquivo no Pen-Drive para a Cabine
1. Formate um pen-drive USB de boa qualidade no sistema de arquivos **FAT32**.
2. Crie uma pasta na raiz com o nome exato: `TASKDATA` (todas as letras maiúsculas).
3. Salve o arquivo `TASKDATA.XML` dentro dessa pasta `/TASKDATA/`.
4. Conecte o pen-drive no monitor da cabine da máquina:
   - **John Deere (GreenStar 3 / Gen 4 CommandCenter)**: Acesse *Gerenciador de Arquivos* ➔ *Importar Tarefas do USB* ➔ Selecione a prescrição.
   - **Trimble (TMX-2050 / GFX-750)**: Vá em *Configuração de Campo* ➔ *Tarefas ISO-XML* ➔ *Carregar do Pen-Drive*.
   - **Case IH / New Holland (AFS Pro 700 / IntelliView IV)**: Acesse *Gerenciamento de Dados* ➔ *USB* ➔ *Prescrição em Taxa Variável*.
5. A máquina lerá a grade e regulará a abertura das comportas ou esteiras automaticamente conforme a posição do GPS RTK no talhão.

---

## 22. COPILOT AGRONÔMICO: ORDEM DE TANQUE D.A.L.E. E CARÊNCIA FITOSSANITÁRIA (LMR)

Erros na sequência de adição de produtos no tanque do pulverizador causam reações químicas indesejadas, decantação de calda (*calda talhada*), perda de eficácia biológica e quebra de bombas e bicos.

### 22.1. O Protocolo Universal de Preparo D.A.L.E.
O AGROTECH calcula e exibe a ordem científica mandatória para cada ordem de pulverização emitida:
1. **D — Dispersão (Pós e Grânulos)**:
   - Adicionar primeiro quando o tanque estiver com 50% de água e agitação ligada.
   - Produtos WG (Grânulos Dispersíveis em Água) e WP (Pó Molhável).
2. **A — Agitação e Líquidos Solúveis**:
   - Manter agitação constante e adicionar Suspensões Concentradas (SC) e Concentrados Solúveis (SL).
3. **L — Líquidos Emulsionáveis**:
   - Adicionar com o tanque a 75% da capacidade: Concentrados Emulsionáveis (EC) e Dispersões em Óleo (OD).
4. **E — Emulsão, Adjuvantes e Nutrição Foliar**:
   - Adicionar por último: óleos minerais/vegetais, redutores de deriva, adjuvantes siliconados e fertilizantes foliares quelatizados.

### 22.2. Auditoria de Carência e LMR (Limite Máximo de Resíduos)
- O sistema verifica a data prevista da colheita contra o **Período de Carência (dias de intervalo de segurança)** cadastrado na bula oficial do defensivo junto ao MAPA (Agrofit).
- Caso o operador tente programar uma aplicação cuja carência ultrapasse a data da colheita, o sistema emite um alerta impeditivo em vermelho, prevenindo a retenção da carga por excesso de resíduos químicos nos portos de exportação.

---

## 23. OEE AGRÍCOLA DE FROTAS E MANUTENÇÃO PREDITIVA CAN BUS

O índice de Eficiência Global dos Equipamentos (OEE - *Overall Equipment Effectiveness*) mede a produtividade real do parque de máquinas da fazenda.

### 23.1. As Três Dimensões do OEE Agrícola
O AGROTECH calcula o OEE em tempo real a partir dos dados do barramento CAN Bus J1939:
$$	ext{OEE} = 	ext{Disponibilidade} 	imes 	ext{Desempenho} 	imes 	ext{Qualidade}$$
- **Disponibilidade**: Razão entre o tempo em que o trator/colheitadeira esteve trabalhando com motor ligado e o tempo total programado no turno (descontando manutenções não-programadas e abastecimentos demorados).
- **Desempenho**: Comparação entre a velocidade real de deslocamento no talhão e a velocidade agronômica ideal configurada (evitando perdas por velocidade excessiva no plantio).
- **Qualidade**: Área efetivamente trabalhada sem sobreposições de passadas ou falhas de rastro do piloto automático.

### 23.2. Gatilhos de Manutenção Preditiva do Motor
O motor telemático do AGROTECH monitora continuamente as mensagens PGN da máquina e dispara alertas imediatos:
- **Alerta de Óleo Lubrificante**: Disparado com 20 horas de antecedência ao atingir 250h ou 500h de trabalho.
- **Temperatura de Arrefecimento > 102°C**: Alerta crítico de superaquecimento (limpeza de radiador ou nível de líquido).
- **Pressão de Óleo < 1.5 bar com Motor em Carga**: Alerta com alarme sonoro na cabine e envio de notificação WhatsApp à oficina para parada preventiva imediata, evitando fundição de motor.

---

## 24. DEFESA SANITÁRIA AGROPECUÁRIA: EMISSÃO DE CFO VEGETAL E E-GTA ANIMAL (MAPA/INDEA)

A conformidade sanitária é pré-requisito indispensável para comercialização interestadual e exportação de carnes e grãos.

### 24.1. Emissão de CFO (Certificado Fitossanitário de Origem)
1. Acesse **Defesa Sanitária & Rastreabilidade** ➔ **Certificado CFO**.
2. Conforme a **Instrução Normativa MAPA nº 33/2016**, informe os dados da propriedade, Unidade de Produção (UP) e o lote de sementes ou grãos a transportar.
3. O sistema atesta a ausência de pragas quarentenárias de relevância (*Helicoverpa armigera*, Ferrugem Asiática *Phakopsora pachyrhizi* e planta daninha *Amaranthus palmeri*).
4. O Engenheiro Agrônomo RT da fazenda assina eletronicamente com seu número de CREA e registro oficial de habilitador no órgão de defesa agropecuária (ex: INDEA-MT, IAPAR-PR, CDA-SP).
5. É gerado o CFO com validade oficial de até 30 dias para acompanhar a Nota Fiscal e o Manifesto de Carga.

### 24.2. Emissão de e-GTA (Guia de Trânsito Animal Eletrônica)
1. Acesse o módulo **Pecuária / Confinamento** ➔ **Guia de Trânsito Animal (e-GTA)**.
2. Selecione a finalidade da movimentação (Abate em Frigorífico SIF, Engorda em Confinamento, Reprodução ou Leilão).
3. Selecione o lote de bovinos com as respectivas categorias etárias (Machos de 24 a 36 meses, Fêmeas, Bezerros).
4. O sistema valida os atestados sanitários obrigatórios:
   - **Febre Aftosa**: Certificação de Área Livre Sem Vacinação (conforme Portaria MAPA 665/2024).
   - **Brucelose B19/RB51**: Declaração de fêmeas vacinadas no rebanho de origem.
   - **Raiva dos Herbívoros**: Registro de vacinação anual ativa.
5. Gera o número oficial de rastreamento com código de barras e hash criptográfico para fiscalização nos postos fiscais de fronteira.

---

## 25. FINANCIAMENTO RURAL OFICIAL (PLANO SAFRA BACEN MCR) E DOSSIÊ BANCÁRIO SCR

Obter crédito rural oficial com taxas equalizadas pelo Tesouro Nacional exige rigorosa comprovação cadastral, ambiental e agronômica perante as instituições financeiras.

### 25.1. Simulador de Linhas de Crédito do Plano Safra (BACEN MCR)
O AGROTECH possui simulador atualizado com as regras do Manual de Crédito Rural (MCR):
- **PRONAF (Agricultura Familiar)**: Taxas subsidiadas de 3,0% a 6,0% a.a. para custeio e investimento.
- **PRONAMP (Médio Produtor Rural)**: Taxa equalizada de 8,0% a.a. para produtores com receita bruta anual até R$ 3 milhões.
- **Moderfrota**: Financiamento de tratores, colheitadeiras e pulverizadores novos com taxas de 10,5% a.a. e prazos de até 7 anos.
- **Proirriga**: Linha exclusiva para implantação de pivôs centrais e reservatórios de água.
- **PCA (Programa de Construção e Ampliação de Armazéns)**: Apoio para silos graneleiros com até 12 anos de amortização.
- **Inovagro**: Aquisição de tecnologias de telemetria, drones e softwares de precisão.

### 25.2. Como Gerar o Dossiê Bancário Padronizado BACEN MCR
1. No menu superior ou na aba de Financiamentos, clique em **Gerar Dossiê Bancário**.
2. Selecione a instituição financeira parceira (Banco do Brasil, Sicredi, Sicoob, Bradesco, Santander ou Caixa).
3. O AGROTECH compila automaticamente em um único relatório técnico:
   - Polígonos das glebas georreferenciadas com número de recibo do SICAR ativo.
   - Comprovação de enquadramento agronômico no Zoneamento de Risco Climático (ZARC).
   - Histórico comprovado de produtividade das últimas 5 safras (sacas/ha).
   - Capacidade de pagamento com base no fluxo de caixa projetado do Livro Caixa Digital.
   - Balanço patrimonial simplificado com inventário de máquinas e maquinários avaliados pela tabela FIPE/Agro.
4. Faça o download do arquivo PDF/JSON pronto para envio direto à gerência agro do banco, reduzindo o tempo de aprovação de 45 dias para menos de 5 dias úteis.

---

## 26. SEGURANÇA E SAÚDE NO TRABALHO RURAL (NR-31) E ESOCIAL RURAL (EVENTO S-2240)

A Norma Regulamentadora nº 31 estabelece os preceitos a serem observados na organização e no ambiente de trabalho rural para garantir segurança física e jurídica à propriedade.

### 26.1. Checklist de Auditoria NR-31 na Fazenda
Acesse **Segurança no Trabalho Rural (NR-31)** e execute a verificação mensal:
1. **Instalações e Alojamentos (NR-31.5)**: Condições térmicas, ventilação, camas com colchões certificados e banheiros higienizados na proporção de 1 sanitário por grupo de 10 trabalhadores.
2. **Frentes de Trabalho no Campo (NR-31.15)**: Disponibilidade de água fresca e potável em garrafas térmicas fornecidas pela fazenda, toldo/área de vivência para refeições e kit de primeiros socorros.
3. **Agrotóxicos e Adjuvantes (NR-31.7)**:
   - Fornecimento gratuito e higienização dos EPIs adequados (avental impermeável, respirador com filtro de carvão ativado, viseira facial, luvas de nitrila e botas de cano alto).
   - Depósito de defensivos exclusivo, fechado a chave, ventilado, com piso impermeável e bacia de contenção contra vazamentos.
4. **Operadores de Máquinas (NR-31.12)**: Comprovação do curso de capacitação de 40 horas e reciclagem bienal arquivada no prontuário do colaborador.

### 26.2. Como Gerar o Evento S-2240 para o eSocial Rural
1. No módulo de SST, selecione o colaborador rural (ex: *Tratorista/Aplicador de Defensivos*).
2. O sistema preenche a tabela de ambientes de trabalho e riscos ambientais conforme a Tabela 24 do eSocial (Físicos, Químicos como agrotóxicos fosforados/piretróides, e Biológicos).
3. Clique em **Gerar Evento S-2240 (.xml)**.
4. O AGROTECH exporta o arquivo XML oficial no layout S-1.2 com assinatura SHA-256 pronto para transmissão ao portal do eSocial ou integração via software contábil.

---

## 27. RASTREABILIDADE DIGITAL DE GRÃOS POR LOTE E PASSAPORTE EUDR COM QR CODE

A rastreabilidade fim-a-fim assegura prêmio de qualidade na comercialização e atende aos requisitos mandatórios da Instrução Normativa Conjunta MAPA/ANVISA nº 02/2018 e da GlobalG.A.P.

### 27.1. Cadastro e Rastreamento do Lote de Grãos
1. Acesse **Rastreabilidade de Grãos & Silos**.
2. Ao receber a colheita no pátio da fazenda, informe o talhão de origem, cultivar plantada e silo pulmão de destino.
3. Registre a análise física comercial de recebimento:
   - **Umidade do Grão**: Padrão exportação ideal entre 13,0% e 14,0%. Se superior, o sistema direciona para o secador.
   - **Impurezas**: Tolerância máxima de 1,0%.
   - **Avarias e Ardidos**: Tolerância máxima de 4,0%.
4. Clique em **Emitir Passaporte Digital do Lote**.
5. O sistema gera uma página pública de auditoria com QR Code dinâmico, contendo:
   - Coordenadas geodésicas exatas do talhão onde o lote foi plantado e colhido.
   - Histórico fitossanitário completo (todas as aplicações de fungicidas, inseticidas e adubos realizadas).
   - Hash de integridade criptográfica SHA-256 comprovando conformidade com a regulamentação antidesmatamento europeia EUDR.

---

## 28. FATURAMENTO SAAS BILLING E ASSINATURAS VIA PIX BACEN EM TEMPO REAL

O AGROTECH disponibiliza um sistema de subscrição e faturamento transparente para cooperativas, condomínios agrícolas e propriedades rurais com múltiplas fazendas.

### 28.1. Planos de Assinatura Disponíveis
- **Plano Starter (Pequeno Produtor)**: Até 500 hectares, 3 usuários e módulos essenciais de campo.
- **Plano Pro Enterprise (Médio e Grande Produtor)**: Hectares ilimitados, telemetria CAN Bus J1939 em tempo real, SPED LCDPR, emissor fiscal NF-e SEFAZ e suporte prioritário.
- **Plano Corporativo / Tradings**: Multi-fazendas, API aberta e personalização de marca.

### 28.2. Fluxo de Pagamento Instantâneo via Pix BACEN
1. No menu lateral ou no rodapé do sistema, clique em **Assinatura & Faturamento**.
2. Escolha o plano desejado e selecione a modalidade de faturamento (Mensal ou Anual com desconto de 2 meses).
3. O sistema comunica com o gateway financeiro e gera instantaneamente:
   - Código Pix Copia-e-Cola com identificador único de fim-a-fim (TxID).
   - QR Code dinâmico do Banco Central para leitura direta no aplicativo de qualquer banco cooperativo ou tradicional.
4. Após o pagamento no celular, o webhook do BACEN confirma a liquidação em menos de 3 segundos, emitindo o recibo fiscal NFS-e e ativando a licença em todas as telas da fazenda sem necessidade de recarregar a página.

---

## 29. PAINEL DE CREDENCIAIS CORPORATIVAS E MASCARAMENTO DE SEGREDOS DE CAMPO

A segurança da informação é mandatória para evitar fraudes fiscais e vazamento de dados patrimoniais da fazenda.

### 29.1. Gerenciamento de Certificado Digital A1 (.pfx)
1. Como Superadmin, abra o menu inferior e selecione **Configurações de Credenciais**.
2. Faça o upload do arquivo de certificado digital `.pfx` ou `.p12` da empresa rural emitido por autoridade certificadora credenciada na ICP-Brasil (Serasa, Certisign, Soluti, etc.).
3. Informe a senha de proteção da chave privada e selecione a UF autorizadora da sua inscrição estadual.
4. Clique em **Testar Comunicação SEFAZ**: o sistema executa um handshake mTLS contra o webservice da Receita Estadual e reporta o status do serviço (`107 - Serviço em Operação`) e a latência de rede em milissegundos.

### 29.2. Mascaramento de Chaves de API e Código de Segurança CSC
- Todos os segredos corporativos (tokens de webhook, códigos CSC de emissão fiscal, senhas de bancos e chaves de satélite) são gravados com criptografia em repouso e exibidos na tela com máscara protetora (`••••••••9182`), garantindo que curiosos ou operadores no escritório não tenham acesso a informações confidenciais.

---

*AGROTECH Enterprise • O Sistema Operacional da Empresa Rural • Todos os direitos reservados.*
