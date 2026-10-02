import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Bot,
  User,
  Zap,
  Filter,
  Layers,
  CloudRain,
  Fuel,
  Bug,
  Tractor,
  DollarSign,
  Activity,
  ShieldCheck,
  Wheat,
  Scale,
  Droplets
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export interface InsightAgronomico {
  id: string;
  prioridade: 'CRITICA' | 'ALTA' | 'MODERADA' | 'INFORMATIVA';
  categoria: 'FITOSSANITARIA' | 'MECANICA_DIESEL' | 'CLIMATICA' | 'FINANCEIRA' | 'ZOOTECNICA' | 'QUALIDADE_HF' | 'BIOENERGIA';
  titulo: string;
  diagnostico: string;
  fatoresCruzados: {
    icone: React.ElementType;
    label: string;
    dado: string;
  }[];
  recomendacaoAcao: string;
  impactoEstimado: string;
  dataGeracao: string;
  acaoBotaoTexto?: string;
}

interface CopilotSafraModuleProps {
  profileId?: string;
}

const INSIGHTS_GRAOS: InsightAgronomico[] = [
  {
    id: 'ins-01',
    prioridade: 'CRITICA',
    categoria: 'FITOSSANITARIA',
    titulo: 'Disparo Imediato de Pulverização no TAL-02 (Janela Ideal Delta T Hoje)',
    diagnostico:
      'Cruzamento multivariável detectou densidade de percevejo-marrom (2.8/m) estourando o NDE (2.0/m) no TAL-02. O módulo de agrometeorologia indica que a janela segura de pulverização (Delta T entre 2 e 8) ocorrerá hoje das 16:30 às 19:00, com previsão de chuva contínua em 48h.',
    fatoresCruzados: [
      { icone: Bug, label: 'MIP NDE', dado: '2.8 percevejos/m (Crítico)' },
      { icone: CloudRain, label: 'Janela Delta T', dado: 'Hoje 16h30 - 19h00 (Ideal)' },
      { icone: Layers, label: 'Estoque Defensivo', dado: '620 L Engeo Pleno em Sede' },
      { icone: Tractor, label: 'Pulverizador', dado: 'Patriot 350 Disponível (Oficina OK)' },
    ],
    recomendacaoAcao:
      'Entrar imediatamente com o pulverizador Case Patriot 350 aplicando 0.25 L/ha de Engeo Pleno + adjuvante Nimbus antes do anoitecer.',
    impactoEstimado: 'Evita perda de até 3.4 sacas/ha por abortamento de vagens (R$ 170.800 protegidos).',
    dataGeracao: 'Hoje, há 15 min',
    acaoBotaoTexto: 'Disparar Ordem de Aplicação',
  },
  {
    id: 'ins-02',
    prioridade: 'ALTA',
    categoria: 'MECANICA_DIESEL',
    titulo: 'Anomalia de Consumo de Diesel no Trator New Holland T8 (+22.8% vs Meta)',
    diagnostico:
      'O módulo de Comboio registrou abastecimento de 495 L para 13h trabalhadas (38.07 L/h) durante gradagem pesada no TAL-04. A meta de fábrica para esta operação é de 31.0 L/h. O sensor CAN Bus indica RPM médio excessivo (2.150 RPM) com patinagem de 14.8%.',
    fatoresCruzados: [
      { icone: Fuel, label: 'Consumo Real', dado: '38.07 L/h (+22.8% desvio)' },
      { icone: Tractor, label: 'CAN Bus RPM', dado: '2.150 RPM (Trabalhando sob rotação alta)' },
      { icone: DollarSign, label: 'Custo Adicional', dado: '+ R$ 41,71 / hora trabalhada' },
    ],
    recomendacaoAcao:
      'Instruir o operador a subir uma marcha e reduzir a aceleração (Gear Fast, Run Slow) para operar a 1.750 RPM, ou calibrar a pressão dos pneus para reduzir patinagem.',
    impactoEstimado: 'Economia estimada de R$ 5.420 em diesel nos próximos 7 dias de preparo de solo.',
    dataGeracao: 'Hoje, há 1h',
    acaoBotaoTexto: 'Notificar Mecânico Chefe',
  },
  {
    id: 'ins-03',
    prioridade: 'MODERADA',
    categoria: 'CLIMATICA',
    titulo: 'Frente Fria com 75mm em 48h: Antecipar Janela de Colheita do TAL-01',
    diagnostico:
      'Estação IoT e modelo meteorológico ECMWF projetam 75mm de precipitação acumulada a partir de sábado. O TAL-01 está com 85% maturado e umidade de grão em 14.2%. Se a colheita atrasar, a umidade subirá para >17%, gerando descontos de balança de até 3.8%.',
    fatoresCruzados: [
      { icone: CloudRain, label: 'Previsão Chuva', dado: '75mm em 48h (Sábado/Domingo)' },
      { icone: Layers, label: 'Maturidade TAL-01', dado: '85% pronto para corte' },
      { icone: Tractor, label: 'Colheitadeira', dado: 'JD S790 alocada e revisada' },
    ],
    recomendacaoAcao:
      'Mobilizar duas colheitadeiras para turno estendido nesta sexta-feira para colher os 180 hectares restantes do talhão.',
    impactoEstimado: 'Economia de R$ 38.500 em descontos de umidade e quebra por abertura de vagens.',
    dataGeracao: 'Hoje, há 3h',
    acaoBotaoTexto: 'Reordenar Escala de Colheita',
  },
  {
    id: 'ins-04',
    prioridade: 'INFORMATIVA',
    categoria: 'FINANCEIRA',
    titulo: 'Oportunidade de Hedge: Relação de Troca Barter Soja/Adubo em Mínima Histórica',
    diagnostico:
      'Com a cotação da saca de soja em R$ 132,00 e o frete ferroviário estabilizado, a relação de troca para compra de fertilizante cloreto de potássio (KCl) para a safra 26/27 atingiu 18.2 sc/ton (melhor patamar dos últimos 18 meses).',
    fatoresCruzados: [
      { icone: DollarSign, label: 'Preço Saca', dado: 'R$ 132,00 / sc FOB Sorriso' },
      { icone: TrendingUp, label: 'Relação Troca', dado: '18.2 sc/ton (Média histórica: 22.5)' },
    ],
    recomendacaoAcao:
      'Travar contrato de Barter de 1.500 toneladas de KCl com a trading vinculando CPR física para liquidação em maio/2027.',
    impactoEstimado: 'Redução de 19% no custo previsto de adubação da próxima safra.',
    dataGeracao: 'Ontem',
    acaoBotaoTexto: 'Abrir Módulo Barter',
  },
];

const INSIGHTS_PECUARIA: InsightAgronomico[] = [
  {
    id: 'ins-pec-01',
    prioridade: 'CRITICA',
    categoria: 'ZOOTECNICA',
    titulo: 'Leitura de Cocho Zerada às 06:30 no Confinamento Lote C-04 (Risco de Acidose)',
    diagnostico:
      'A leitura matinal registrou nota 0 (cocho lambido com fundo brilhante) no piquete 04 com 280 garrotes Nelore. Lambedura rápida com fome excessiva indica suboferta severa e alto risco de acidose ruminal subclínica na primeira refeição do dia.',
    fatoresCruzados: [
      { icone: Scale, label: 'Escore de Cocho', dado: 'Nota 0 (Vazio / Lambido)' },
      { icone: Activity, label: 'GMD Médio', dado: '1.48 kg/dia (Meta: 1.65)' },
      { icone: TrendingUp, label: 'Ajuste MS', dado: '+10% MS Recomendado (+1.1 kg/cab/dia)' },
      { icone: Layers, label: 'Estoque Silagem', dado: '480 ton silagem milho disponível' },
    ],
    recomendacaoAcao:
      'Ajustar imediatamente o primeiro trato com +1.1 kg MS/cab/dia dividido em 4 fornecimentos para evitar consumo voraz e oscilação de pH ruminal.',
    impactoEstimado: 'Recupera 180g de GMD por animal/dia (+R$ 16.800 no ciclo de terminação).',
    dataGeracao: 'Hoje, há 12 min',
    acaoBotaoTexto: 'Ajustar Trato de Confinamento',
  },
  {
    id: 'ins-pec-02',
    prioridade: 'ALTA',
    categoria: 'ZOOTECNICA',
    titulo: 'Rastreabilidade Individual SISBOV & RFID: Janela de Abate Lote 12 Cota Hilton',
    diagnostico:
      'Lote 12 com 180 novilhos Nelore atingiu peso médio de 542 kg (18.1 @) e cumpriu os 90 dias de rastreabilidade obrigatória no estabelecimento rural aprovado (ERAS). Todos os brincos eletrônicos RFID foram validados no leitor portátil.',
    fatoresCruzados: [
      { icone: ShieldCheck, label: 'Auditoria SISBOV', dado: '180/180 RFID Certificados' },
      { icone: TrendingUp, label: 'Prêmio Hilton', dado: '+ R$ 8,00 / @ negociado' },
      { icone: Scale, label: 'Peso Médio', dado: '542 kg (18.1 @ líquidas)' },
    ],
    recomendacaoAcao:
      'Emitir Guia de Trânsito Animal (GTA) e agendar embarque para quinta-feira com frigorífico habilitado para a União Europeia.',
    impactoEstimado: 'Premiação de R$ 26.064,00 adicionais no faturamento do lote.',
    dataGeracao: 'Hoje, há 40 min',
    acaoBotaoTexto: 'Emitir GTA & Lançamento',
  },
  {
    id: 'ins-pec-03',
    prioridade: 'MODERADA',
    categoria: 'ZOOTECNICA',
    titulo: 'Qualidade do Leite: Tanque Resfriador 02 com CCS em 340.000 CS/mL',
    diagnostico:
      'A Contagem de Células Somáticas (CCS) do tanque 02 subiu de 210k para 340k CS/mL. O teste CMT (California Mastitis Test) detectou 4 vacas em lactação no lote 01 com inflamação subclínica nos quartos posteriores.',
    fatoresCruzados: [
      { icone: Activity, label: 'CCS Tanque', dado: '340.000 CS/mL (Alerta > 300k)' },
      { icone: Droplets, label: 'CBT / Bacteriana', dado: '18.000 UFC/mL (Excelente)' },
      { icone: ShieldCheck, label: 'Vacas Afetadas', dado: 'Brincos 104, 118, 203 e 209' },
    ],
    recomendacaoAcao:
      'Separar os 4 animais para o final da fila de ordenha mecânica, aplicar pré/pós-dipping com barreira e coletar amostra para antibiograma.',
    impactoEstimado: 'Evita penalização de R$ 0,08/L na bonificação mensal do laticínio (R$ 4.320 protegidos).',
    dataGeracao: 'Hoje, há 2h',
    acaoBotaoTexto: 'Abrir Ficha Zootécnica',
  },
  {
    id: 'ins-pec-04',
    prioridade: 'INFORMATIVA',
    categoria: 'FINANCEIRA',
    titulo: 'Relação de Troca Milho/Boi Gordo em 2.2 sc/@: Travar Nutrição da Safrinha',
    diagnostico:
      'A arroba do boi gordo cotada a R$ 242,00 e o milho safrinha a R$ 42,00/sc no balcão criaram a relação de troca mais atrativa dos últimos 24 meses (2.2 sc/@ contra média histórica de 2.8 sc/@).',
    fatoresCruzados: [
      { icone: DollarSign, label: 'Arroba Boi', dado: 'R$ 242,00 / @' },
      { icone: TrendingUp, label: 'Relação Troca', dado: '2.2 sc/@ (Altamente Favorável)' },
      { icone: Layers, label: 'Demanda Safra', dado: '12.000 sacas de milho moído' },
    ],
    recomendacaoAcao:
      'Travar contrato de compra futura de 12.000 sacas de milho seco com entrega programada para o confinamento de inverno.',
    impactoEstimado: 'Redução de R$ 72.000 no custo nutricional da engorda.',
    dataGeracao: 'Ontem',
    acaoBotaoTexto: 'Simular Custo da @',
  },
];

const INSIGHTS_HORTIFRUTI: InsightAgronomico[] = [
  {
    id: 'ins-hf-01',
    prioridade: 'CRITICA',
    categoria: 'QUALIDADE_HF',
    titulo: 'Pico de Brix & Janela Ideal de Colheita de Tomate Grape na Estufa 02',
    diagnostico:
      'Amostragem com refratômetro digital óptico registrou 9.8°Bx nos frutos do terço médio. A previsão de pico térmico de 34°C hoje à tarde pode provocar amolecimento pericárpico se a colheita passar das 10h da manhã.',
    fatoresCruzados: [
      { icone: Sparkles, label: 'Teor Açúcar', dado: '9.8°Bx (Classe Gourmet Especial)' },
      { icone: Activity, label: 'Firmeza Polpa', dado: '4.8 kgf/cm² (Excelente)' },
      { icone: Clock, label: 'Janela Colheita', dado: '06h00 às 09h30 (Ideal)' },
      { icone: Layers, label: 'Câmara Fria', dado: '8.5°C Preparada' },
    ],
    recomendacaoAcao:
      'Deslocar equipe de 6 colhedores para a Estufa 02 às 06:30 para colher 450 caixas de 20kg antes do aumento de temperatura.',
    impactoEstimado: 'Premiação de R$ 18,00/caixa no Ceasa (R$ 8.100,00 de margem adicional).',
    dataGeracao: 'Hoje, há 20 min',
    acaoBotaoTexto: 'Lançar Colheita HF',
  },
  {
    id: 'ins-hf-02',
    prioridade: 'ALTA',
    categoria: 'QUALIDADE_HF',
    titulo: 'Condutividade Elétrica (CE) Elevada no Gotejamento da Estufa 01 (2.6 mS/cm)',
    diagnostico:
      'A forte evapotranspiração do meio-dia concentrou os sais na solução de fertirrigação do substrato de fibra de coco, elevando a CE para 2.6 mS/cm (limite crítico seguro: 2.2 mS/cm), com risco de queima de bordos foliares.',
    fatoresCruzados: [
      { icone: Activity, label: 'CE Substrato', dado: '2.6 mS/cm (Crítico > 2.2)' },
      { icone: Droplets, label: 'pH da Calda', dado: '5.85 (Faixa Ideal)' },
      { icone: TrendingUp, label: 'Drenagem', dado: '12% (Meta: 20-25%)' },
    ],
    recomendacaoAcao:
      'Modular a injeção do canal A e aplicar pulso rápido de água pura desmineralizada com 20% de drenagem para lixiviar sais acumulados.',
    impactoEstimado: 'Protege os 2.800 vasos contra queima de raízes e queda prematura de frutos.',
    dataGeracao: 'Hoje, há 45 min',
    acaoBotaoTexto: 'Ajustar Fertirrigação',
  },
  {
    id: 'ins-hf-03',
    prioridade: 'MODERADA',
    categoria: 'FITOSSANITARIA',
    titulo: 'MIP HF: Nível de Ação para Ácaro-Rajado Atingido na Estufa 03 (Morango)',
    diagnostico:
      'Monitoramento com lupa de bolso 20x identificou média de 1.4 ácaros-rajados (Tetranychus urticae) por folíolo. A área entrará em colheita em 5 dias, o que proíbe o uso de agroquímicos de carência longa.',
    fatoresCruzados: [
      { icone: Bug, label: 'População Ácaro', dado: '1.4 ninfas/folíolo (Alerta)' },
      { icone: ShieldCheck, label: 'Carência Química', dado: 'Proibido colheita c/ defensivo' },
      { icone: Layers, label: 'Controle Biológico', dado: 'Neoseiulus californicus em geladeira' },
    ],
    recomendacaoAcao:
      'Liberar 4 frascos de ácaros predadores biológicos (Neoseiulus californicus) ao entardecer garantindo controle sem resíduos químicos.',
    impactoEstimado: 'Mantém conformidade GlobalGAP e evita perda de até 35% na produção de morangos.',
    dataGeracao: 'Hoje, há 2h',
    acaoBotaoTexto: 'Registrar Manejo Biológico',
  },
  {
    id: 'ins-hf-04',
    prioridade: 'INFORMATIVA',
    categoria: 'FINANCEIRA',
    titulo: 'Cotação CEAGESP & Demanda Aquecida por Folhosas Hidropônicas (+42%)',
    diagnostico:
      'Queda de oferta na região serrana por excesso de chuva elevou a cotação da alface americana para R$ 38,00/caixa (+42% vs semana anterior). A Estufa Hidropônica 04 possui 18.000 pés no ponto ótimo.',
    fatoresCruzados: [
      { icone: DollarSign, label: 'Preço Caixa', dado: 'R$ 38,00 (+42% na semana)' },
      { icone: Wheat, label: 'Disponibilidade', dado: '18.000 pés prontos' },
    ],
    recomendacaoAcao:
      'Programar colheita em 2 turnos e fechar contrato de entrega direta para rede de supermercados regional.',
    impactoEstimado: 'Receita extraordinária de R$ 34.200 no fechamento da semana.',
    dataGeracao: 'Ontem',
    acaoBotaoTexto: 'Ver Expedição HF',
  },
];

const INSIGHTS_BIOENERGIA: InsightAgronomico[] = [
  {
    id: 'ins-bio-01',
    prioridade: 'CRITICA',
    categoria: 'BIOENERGIA',
    titulo: 'Pico de Açúcar Total Recuperável (ATR) no Bloco Norte: 142.5 kg/ton',
    diagnostico:
      'Amostragem de cana-crua da variedade RB867515 atingiu 142.5 kg ATR/ton. Modelo ECMWF projeta chuva de 45mm em 72h, o que causará diluição dos sólidos solúveis e queda do ATR para ~134 kg/ton.',
    fatoresCruzados: [
      { icone: Sparkles, label: 'ATR Atual', dado: '142.5 kg/t (Pico Máximo Safra)' },
      { icone: CloudRain, label: 'Previsão Chuva', dado: '45mm em 72h' },
      { icone: Tractor, label: 'Frente de Corte', dado: 'Frente #04 Alocada' },
      { icone: Activity, label: 'Extração Moenda', dado: '97.4% Eficiência RTC' },
    ],
    recomendacaoAcao:
      'Deslocar 4 colhedoras de cana picada para o Bloco Norte em turno contínuo para colher 6.800 toneladas antes das chuvas.',
    impactoEstimado: 'Garante R$ 138.720 adicionais em receita de etanol e açúcar VHP.',
    dataGeracao: 'Hoje, há 25 min',
    acaoBotaoTexto: 'Reordenar Frentes de Colheita',
  },
  {
    id: 'ins-bio-02',
    prioridade: 'ALTA',
    categoria: 'BIOENERGIA',
    titulo: 'Desvio Operacional: Desgaste de Martelos no Desfibrador de Cana #02',
    diagnostico:
      'O índice de células abertas (Open Cell) caiu de 89.5% para 83.2% antes da moenda 1. Isso elevou a umidade do bagaço em 2.4% e reduziu a geração de vapor na caldeira.',
    fatoresCruzados: [
      { icone: Activity, label: 'Open Cell', dado: '83.2% (Meta: > 88%)' },
      { icone: Fuel, label: 'Umidade Bagaço', dado: '52.4% (+2.4% desvio)' },
      { icone: TrendingUp, label: 'Consumo Vapor', dado: '510 kg vapor/ton cana' },
    ],
    recomendacaoAcao:
      'Virar os martelos do desfibrador na parada programada de limpeza de 4h amanhã às 06:00.',
    impactoEstimado: 'Recupera 0.7% na extração RTC (+R$ 18.200/dia em açúcar).',
    dataGeracao: 'Hoje, há 1h',
    acaoBotaoTexto: 'Agendar Manutenção de Moenda',
  },
  {
    id: 'ins-bio-03',
    prioridade: 'INFORMATIVA',
    categoria: 'FINANCEIRA',
    titulo: 'Geração de Créditos de Descarbonização RenovaBio (12.800 CBIOs)',
    diagnostico:
      'Balanço de massa do canavial fechou com 94.8% de elegibilidade ambiental certificada pelo CAR e satélite. Foram emitidos 12.800 CBIOs pela empresa inspetora credenciada pela ANP.',
    fatoresCruzados: [
      { icone: ShieldCheck, label: 'Elegibilidade CAR', dado: '94.8% da biomassa' },
      { icone: TrendingUp, label: 'CBIOs Gerados', dado: '12.800 créditos' },
      { icone: DollarSign, label: 'Cotação B3', dado: 'R$ 94,50 / CBIO' },
    ],
    recomendacaoAcao:
      'Registrar e escriturar os 12.800 CBIOs na B3 para liquidação na próxima sessão quinzenal.',
    impactoEstimado: 'Faturamento de R$ 1.209.600,00 sem custo incremental de produção.',
    dataGeracao: 'Ontem',
    acaoBotaoTexto: 'Escriturar CBIOs na B3',
  },
];

export const CopilotSafraModule: React.FC<CopilotSafraModuleProps> = ({ profileId = 'AGRICULTURA_GRAOS' }) => {
  // Insights baseados no perfil
  const insightsBase = useMemo(() => {
    if (profileId === 'PECUARIA_CORTE_LEITE') return INSIGHTS_PECUARIA;
    if (profileId === 'HORTIFRUTI_FLORICULTURA') return INSIGHTS_HORTIFRUTI;
    if (profileId === 'BIOENERGIA_SUCROALCOOLEIRO') return INSIGHTS_BIOENERGIA;
    return INSIGHTS_GRAOS;
  }, [profileId]);

  const [insights, setInsights] = useState<InsightAgronomico[]>(insightsBase);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODOS');

  // Atualiza os insights quando o perfil mudar
  useEffect(() => {
    setInsights(insightsBase);
  }, [insightsBase]);

  // Mensagem inicial de boas-vindas contextualizada
  const mensagemInicial = useMemo(() => {
    if (profileId === 'PECUARIA_CORTE_LEITE') {
      return 'Olá! Sou o Copilot Pecuária da Fazenda Pantanal & Confinamento. Estou monitorando cochos, pesagens RFID, GMD, qualidade do leite (CCS/CBT) e pastejo rotacionado. Como posso auxiliar na gestão do rebanho agora?';
    }
    if (profileId === 'HORTIFRUTI_FLORICULTURA') {
      return 'Olá! Sou o Copilot HF & Cultivo Protegido. Monitoro refratometria de Brix, condutividade elétrica (CE), pH da fertirrigação, estufas e colheitas seletivas em tempo real. O que você gostaria de analisar?';
    }
    if (profileId === 'BIOENERGIA_SUCROALCOOLEIRO') {
      return 'Olá! Sou o Copilot Sucroenergético. Estou monitorando os teores de ATR, rendimento de moenda RTC, queima/corte de cana e emissão de CBIOs RenovaBio. Em que posso apoiar a usina agora?';
    }
    return 'Olá! Sou o Copilot Safra, assistente de IA da Fazenda Santa Helena. Estou monitorando telemetria CAN Bus, clima IoT, amostragem MIP, romaneios e DRE em tempo real. Como posso ajudar na tomada de decisão agora?';
  }, [profileId]);

  // Sugestões de perguntas rápidas por perfil
  const promptSugestoes = useMemo(() => {
    if (profileId === 'PECUARIA_CORTE_LEITE') {
      return ['Escore do Cocho Lote C-04', 'Previsão GMD Confinamento', 'Auditoria SISBOV Hilton', 'Qualidade do Leite CCS'];
    }
    if (profileId === 'HORTIFRUTI_FLORICULTURA') {
      return ['Curva de Açúcares Brix', 'Condutividade CE Gotejamento', 'MIP Ácaros na Estufa', 'Cotação Ceagesp'];
    }
    if (profileId === 'BIOENERGIA_SUCROALCOOLEIRO') {
      return ['Pico de ATR Bloco Norte', 'Eficiência Moenda RTC', 'Créditos CBIO RenovaBio', 'Aplicação de Vinhaça'];
    }
    return ['Janela Delta T Pulverização', 'Consumo Diesel New Holland T8', 'Lucro por Talhão DRE', 'Barter Soja e KCl'];
  }, [profileId]);

  // Chat com o Copilot
  const [chatMensagens, setChatMensagens] = useState<
    { remetente: 'USUARIO' | 'COPILOT'; texto: string; hora: string }[]
  >([
    {
      remetente: 'COPILOT',
      texto: mensagemInicial,
      hora: '14:20',
    },
  ]);
  const [perguntaInput, setPerguntaInput] = useState<string>('');
  const [carregandoResposta, setCarregandoResposta] = useState<boolean>(false);

  // Reinicia o chat quando muda o perfil
  useEffect(() => {
    setChatMensagens([
      {
        remetente: 'COPILOT',
        texto: mensagemInicial,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [mensagemInicial]);

  const insightsFiltrados = insights.filter((i) => {
    if (filtroCategoria !== 'TODOS' && i.categoria !== filtroCategoria) return false;
    return true;
  });

  const handleEnviarPergunta = (texto?: string) => {
    const textoUsuario = (texto || perguntaInput).trim();
    if (!textoUsuario) return;

    const horaAgora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMensagens((prev) => [...prev, { remetente: 'USUARIO', texto: textoUsuario, hora: horaAgora }]);
    setPerguntaInput('');
    setCarregandoResposta(true);

    setTimeout(() => {
      let resposta = '';
      const inputLower = textoUsuario.toLowerCase();

      // Respostas adaptadas ao perfil ativo
      if (profileId === 'PECUARIA_CORTE_LEITE') {
        if (inputLower.includes('cocho') || inputLower.includes('escore') || inputLower.includes('sobra')) {
          resposta =
            'A leitura de cocho das 06:30 no Confinamento Lote C-04 foi Nota 0 (cocho lambido com fundo seco). Recomendo aumento imediato de +10% de matéria seca (+1.1 kg MS/cab/dia) fracionada em 4 tratos para evitar acidose ruminal subclínica e voracidade.';
        } else if (inputLower.includes('gmd') || inputLower.includes('peso') || inputLower.includes('pesagem')) {
          resposta =
            'O GMD médio consolidado do rebanho em confinamento está em 1.54 kg/cab/dia (custo de R$ 225,00 por arroba produzida). No pastejo rotacionado de Brachiaria brizantha com suplementação protéica, o ganho médio é de 0.82 kg/cab/dia.';
        } else if (inputLower.includes('sisbov') || inputLower.includes('hilton') || inputLower.includes('rfid')) {
          resposta =
            'O Lote 12 (180 animais Nelore) cumpriu os 90 dias de rastreabilidade obrigatória no ERAS credenciado pelo MAPA. Todos os brincos eletrônicos RFID estão lidos e auditados, garantindo bonificação de +R$ 8,00 por arroba na Cota Hilton.';
        } else if (inputLower.includes('leite') || inputLower.includes('ccs') || inputLower.includes('tanque')) {
          resposta =
            'O Tanque 02 apresentou CCS de 340.000 CS/mL. Identificamos 4 vacas com mastite subclínica no CMT. Elas foram direcionadas para a ordenha final com descarte preventivo do leite e protocolo de pós-dipping com barreira iodada.';
        } else {
          resposta =
            `Analisei os dados zootécnicos do rebanho: 1.840 cabeças ativas, taxa de lotação média de 2.8 UA/ha nas áreas rotacionadas e 98.4% de conformidade vacinal e sanitária. Deseja simular o ponto de equilíbrio de confinamento ou emitir a lista de embarque?`;
        }
      } else if (profileId === 'HORTIFRUTI_FLORICULTURA') {
        if (inputLower.includes('brix') || inputLower.includes('acucar') || inputLower.includes('tomate')) {
          resposta =
            'A refratometria dos tomates grape da Estufa 02 registrou pico de 9.8°Bx com firmeza de polpa de 4.8 kgf/cm². Recomendo concluir a colheita antes das 10:00 da manhã para preservar o turgor dos frutos e assegurar preço de Classe Gourmet.';
        } else if (inputLower.includes('ce') || inputLower.includes('condutividade') || inputLower.includes('fertirrig')) {
          resposta =
            'A CE da solução nutritiva no gotejamento da Estufa 01 subiu para 2.6 mS/cm devido ao calor. Recomendo aplicar pulso rápido de água desmineralizada pura com 20% de drenagem para lixiviar o excesso salino da zona radicular.';
        } else if (inputLower.includes('praga') || inputLower.includes('acaro') || inputLower.includes('mip')) {
          resposta =
            'Na Estufa 03 (morango), o ácaro-rajado atingiu 1.4 ninfas/folíolo. Como a colheita se inicia em 5 dias, o uso de químicos é proibido. Devemos liberar os ácaros predadores Neoseiulus californicus ao final da tarde.';
        } else if (inputLower.includes('ceagesp') || inputLower.includes('cotacao') || inputLower.includes('mercado')) {
          resposta =
            'A cotação de folhosas no CEAGESP subiu 42% pela restrição de oferta pós-chuva na serra. Temos 18.000 pés de alface americana e rúcula hidropônica prontos para expedição imediata com margem de 58%.';
        } else {
          resposta =
            'Monitorando 14 estufas climatizadas: temperatura média de 26.4°C, VPD de 1.1 kPa (ideal para trocas gasosas) e 100% de rastreabilidade de lotes com QR Code na caixa.';
        }
      } else if (profileId === 'BIOENERGIA_SUCROALCOOLEIRO') {
        if (inputLower.includes('atr') || inputLower.includes('corte') || inputLower.includes('colheita')) {
          resposta =
            'O Bloco Norte (RB867515) atingiu 142.5 kg ATR/ton. Com a previsão de chuva de 45mm em 72h, a prioridade máxima é cortar 6.800 toneladas nesta frente para não sofrer diluição de brix.';
        } else if (inputLower.includes('moenda') || inputLower.includes('extracao') || inputLower.includes('martelo')) {
          resposta =
            'A extração RTC da Moenda 1 caiu para 96.6% pelo índice de Open Cell em 83.2% no desfibrador. Agendamos a virada dos martelos para a parada preventiva de amanhã às 06:00.';
        } else if (inputLower.includes('cbio') || inputLower.includes('renovabio') || inputLower.includes('carbono')) {
          resposta =
            'Foram validados 12.800 CBIOs pela empresa inspetora credenciada pela ANP com 94.8% de biomassa elegível. Na cotação de R$ 94,50 na B3, isso representa R$ 1,20 milhão em receita extraordinária.';
        } else {
          resposta =
            'Monitorando moagem diária de 12.000 ton de cana: eficiência de extração de 97.4%, geração de 52 kWh/ton em cogeração de vapor e aplicação de vinhaça localizada cobrindo 150 ha/semana.';
        }
      } else {
        // Padrão Grãos
        if (inputLower.includes('pulveriz') || inputLower.includes('vento') || inputLower.includes('clima')) {
          resposta =
            'Com base na estação meteorológica IoT, o Delta T atual está em 5.2 (Temperatura 27.8°C e Umidade 62%), com vento de 7.5 km/h. É uma janela EXCELENTE para pulverizar defensivos agora. Recomendo priorizar o TAL-02 onde a amostragem MIP atingiu 2.8 percevejos/m.';
        } else if (inputLower.includes('combustivel') || inputLower.includes('diesel') || inputLower.includes('trator')) {
          resposta =
            'O Trator New Holland T8 (Frota #03) está com consumo de 38.07 L/h, o que representa um desvio de +22.8% da meta do fabricante. Os demais tratores (JD 8370R) e o pulverizador Patriot estão operando com consumo dentro da conformidade (+2% de desvio). O tanque sede possui 42.800 L (autonomia de 18 dias).';
        } else if (inputLower.includes('lucro') || inputLower.includes('dre') || inputLower.includes('talhao')) {
          resposta =
            'O talhão mais rentável da fazenda atualmente é o TAL-03 (Pivô Central 01), com margem líquida de R$ 58,62 por saca e lucro total de R$ 1,58 milhão. O talhão com menor margem é o TAL-04 (R$ 38,10/sc), devido ao custo mecânico mais elevado na dessecação e preparo de solo.';
        } else {
          resposta =
            'Analisei todos os dados da safra: os 5 talhões somam 2.120,5 ha com 100% de conformidade EUDR (marco 2020 limpo). Temos 1 alerta crítico fitossanitário no TAL-02 e 1 alerta mecânico de diesel no trator T8. Deseja que eu emita uma recomendação detalhada ou calcule a margem de contribuição simulada?';
        }
      }

      setChatMensagens((prev) => [...prev, { remetente: 'COPILOT', texto: resposta, hora: horaAgora }]);
      setCarregandoResposta(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#EAF4E7] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">Copilot Safra • Inteligência Prescritiva</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Perfil: {profileId.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Telemetria & IA Conectados
                </span>
              </div>
              <p className="text-sm text-[#66736A] mt-0.5">
                Cruzamento contínuo de sensores de campo, telemetria operacional e regras agronômicas personalizadas para sua atividade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Lista de Insights Prescritivos + Chat Interativo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Feeds de Insights Prioritários */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#EAF4E7] p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-[#26332A] uppercase tracking-wider">
                Diagnósticos & Gatilhos Preditivos ({insightsFiltrados.length})
              </span>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#66736A]" />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-lg px-2.5 py-1 text-[#26332A] focus:outline-none"
              >
                <option value="TODOS">Todas as Categorias</option>
                <option value="FITOSSANITARIA">Fitossanidade & MIP</option>
                <option value="MECANICA_DIESEL">Frotas & Diesel</option>
                <option value="CLIMATICA">Clima & Delta T</option>
                <option value="FINANCEIRA">Financeiro & Comercial</option>
                <option value="ZOOTECNICA">Zootecnia & Rebanho</option>
                <option value="QUALIDADE_HF">Qualidade HF & Brix</option>
                <option value="BIOENERGIA">Bioenergia & ATR</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {insightsFiltrados.map((ins) => {
              let prioridadeBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  PRIORIDADE CRÍTICA
                </span>
              );

              if (ins.prioridade === 'ALTA') {
                prioridadeBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    PRIORIDADE ALTA
                  </span>
                );
              } else if (ins.prioridade === 'MODERADA') {
                prioridadeBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    PRIORIDADE MODERADA
                  </span>
                );
              } else {
                prioridadeBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    INFORMATIVO
                  </span>
                );
              }

              return (
                <div
                  key={ins.id}
                  className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-lg hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        {prioridadeBadge}
                        <span className="text-[10px] text-[#66736A] font-semibold uppercase tracking-wider">
                          {ins.categoria.replace(/_/g, ' ')}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] text-[#66736A] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {ins.dataGeracao}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#1D4B38]">{ins.titulo}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-[#26332A] leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {ins.diagnostico}
                  </p>

                  {/* Fatores Cruzados */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {ins.fatoresCruzados.map((fat, fIdx) => {
                      const IconComponent = fat.icone;
                      return (
                        <div key={fIdx} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                          <div className="p-1.5 bg-[#F7F9F5] text-indigo-400 rounded-lg shrink-0">
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] text-[#66736A] block truncate">{fat.label}</span>
                            <span className="text-[11px] font-bold text-[#26332A] block truncate">{fat.dado}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recomendação e Impacto */}
                  <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-[#66736A] font-medium">Ação Prescrita: </span>
                      <span className="text-emerald-400 font-semibold">{ins.recomendacaoAcao}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Impacto Financeiro Estimado:</strong> {ins.impactoEstimado}</span>
                  </div>

                  {ins.acaoBotaoTexto && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => alert(`✓ Ação executada: "${ins.acaoBotaoTexto}" processada no sistema!`)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/40 cursor-pointer"
                      >
                        {ins.acaoBotaoTexto}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 3: Chat Interativo com o Copilot Safra */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl flex flex-col h-[650px] shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#1D4B38]">Chat Copilot Agro</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online • Responde em &lt; 1s
                </span>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.remetente === 'USUARIO' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.remetente === 'COPILOT' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.remetente === 'USUARIO'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-[#F7F9F5] border border-[#EAF4E7] text-[#26332A] rounded-tl-none'
                  }`}
                >
                  <p>{msg.texto}</p>
                  <span className="text-[9px] text-[#66736A] block mt-1 text-right">{msg.hora}</span>
                </div>
                {msg.remetente === 'USUARIO' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {carregandoResposta && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-[#F7F9F5] border border-[#EAF4E7] text-[#66736A] rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                  <span>Analisando telemetria e sensores...</span>
                </div>
              </div>
            )}
          </div>

          {/* Sugestões Rápidas de Prompt */}
          <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 flex flex-wrap gap-1.5">
            {promptSugestoes.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleEnviarPergunta(p)}
                className="text-[10px] bg-[#F4F0E6] hover:bg-indigo-600/30 text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input do Chat */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEnviarPergunta();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2"
          >
            <input
              type="text"
              value={perguntaInput}
              onChange={(e) => setPerguntaInput(e.target.value)}
              placeholder="Pergunte ao Copilot sobre talhões, cocho, Brix ou diesel..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-[#26332A] placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={carregandoResposta || !perguntaInput.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
