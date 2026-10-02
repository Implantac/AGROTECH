import React, { useState, useMemo } from 'react';
import {
  Tractor,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Scale,
  FileText,
  CloudRain,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Users,
  Compass,
  Lock,
  Globe,
  Radio,
  Sprout,
  Cpu,
  Package,
  Wrench,
  HelpCircle,
  Clock,
  Play,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  Truck,
  Leaf,
  MapPin,
  Bot,
  Activity,
  DollarSign
} from 'lucide-react';

interface PublicLandingPageProps {
  onGoToLogin: () => void;
  onEnterPlatformDirectly: () => void;
  onGoToRegister?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGoToLogin,
  onEnterPlatformDirectly,
  onGoToRegister,
}) => {
  // Estado dos Planos & Alternador Mensal / Anual
  const [faturamentoPeriodo, setFaturamentoPeriodo] = useState<'ANUAL' | 'MENSAL'>('ANUAL');

  // Demonstração Interativa do Sistema (Seção 9)
  const [demoTabAtiva, setDemoTabAtiva] = useState<
    'DASHBOARD' | 'MOBILE' | 'MAPA' | 'MAQUINAS' | 'CUSTOS' | 'IA'
  >('DASHBOARD');

  // IA AgroTech Interativa (Seção 11)
  const [perguntaIaAtiva, setPerguntaIaAtiva] = useState<number>(0);

  // FAQ Accordion
  const [faqAberta, setFaqAberta] = useState<number | null>(0);

  // Calculadora Interativa de ROI da Fazenda
  const [areaHaCalculadora, setAreaHaCalculadora] = useState<number>(2400);
  const [culturaCalculadora, setCulturaCalculadora] = useState<'SOJA_MILHO' | 'ALGODAO' | 'CAFE' | 'PECUARIA'>('SOJA_MILHO');

  const retornoEstimado = useMemo(() => {
    let sacasGanhasHa = 2.4;
    let precoSaca = 132.0;
    let economiaDieselPorHa = 48.5;
    let economiaAduboPorHa = 74.0;

    if (culturaCalculadora === 'ALGODAO') {
      sacasGanhasHa = 4.2;
      precoSaca = 185.0;
      economiaDieselPorHa = 92.0;
      economiaAduboPorHa = 145.0;
    } else if (culturaCalculadora === 'CAFE') {
      sacasGanhasHa = 3.1;
      precoSaca = 1250.0 / 60;
      economiaDieselPorHa = 38.0;
      economiaAduboPorHa = 110.0;
    } else if (culturaCalculadora === 'PECUARIA') {
      sacasGanhasHa = 1.8;
      precoSaca = 245.0;
      economiaDieselPorHa = 22.0;
      economiaAduboPorHa = 45.0;
    }

    const ganhoProdutividadeTotal = areaHaCalculadora * sacasGanhasHa * precoSaca;
    const economiaInsumosTotal = areaHaCalculadora * (economiaDieselPorHa + economiaAduboPorHa);
    const economiaGlosasFiscais = Math.min(280000, areaHaCalculadora * 32.0);
    const retornoTotalAnual = ganhoProdutividadeTotal + economiaInsumosTotal + economiaGlosasFiscais;

    const mensalidadeEstimada = 590 + (areaHaCalculadora > 1500 ? 600 : 0) + (areaHaCalculadora > 5000 ? 1200 : 0);
    const custoAnualPlano = mensalidadeEstimada * 12;
    const multiplicadorROI = Math.round((retornoTotalAnual / custoAnualPlano) * 10) / 10;

    return {
      ganhoProdutividadeTotal,
      economiaInsumosTotal,
      economiaGlosasFiscais,
      retornoTotalAnual,
      custoAnualPlano,
      multiplicadorROI,
      paybackDias: Math.max(12, Math.round(365 / multiplicadorROI))
    };
  }, [areaHaCalculadora, culturaCalculadora]);

  // Perguntas Reais para a IA (Seção 11)
  const perguntasIa = [
    {
      pergunta: 'Como está minha safra atual?',
      resposta: 'Sua safra 2026/27 está com 92% da área plantada dentro da janela ideal. A estimativa ponderada de produtividade aponta 68.4 sc/ha na soja (2.4 sc/ha acima do histórico). Nenhum talhão apresenta estresse hídrico crítico nesta semana.',
      origem: 'Módulo SIG + Agrometeorologia + Telemetria de Plantadeiras',
      status: 'Dentro da Meta'
    },
    {
      pergunta: 'Qual talhão está apresentando maior desvio de custo?',
      resposta: 'O Talhão 04 (Gleba Norte, 420 ha) está com custo acumulado de R$ 4.890/ha, superando o orçamento em 14.2%. Causa identificada: duas reaplicações de fungicida por pressão de ferrugem asiática.',
      origem: 'DRE por Talhão + Almoxarifado + Apontamentos MIP',
      status: 'Atenção Necessária'
    },
    {
      pergunta: 'Qual máquina está com baixa utilização na frota?',
      resposta: 'O Trator John Deere 8370R (#02) operou apenas 3.8 horas/dia nesta semana, com 38% do tempo em marcha lenta no pátio. Sugestão: realocar para a frente de dessecação do Talhão 07.',
      origem: 'Telemetria CAN Bus J1939 + OEE de Frotas',
      status: 'Otimização Disponível'
    },
    {
      pergunta: 'Qual cultura está apresentando melhor margem líquida?',
      resposta: 'O Milho Safrinha travado via Barter a R$ 68,00/sc está projetando margem líquida de 41.8%, contra 29.5% da área mantida no mercado spot de balcão.',
      origem: 'Barter B3 + DRE Agrícola + Contratos Futuros',
      status: 'Oportunidade Comercial'
    },
    {
      pergunta: 'Quais operações e manutenções estão atrasadas?',
      resposta: 'A colheitadeira Case 8230 (#01) ultrapassou o gatilho de revisão preventiva de 500 horas do óleo hidráulico em 22 horas. Ordem de serviço aberta para a oficina.',
      origem: 'Oficina CAN Bus + Histórico SOS de Óleo',
      status: 'Alerta Preventivo'
    }
  ];

  // Benchmark Comparativo Objetivo
  const criteriosComparativo = [
    {
      criterio: 'Operação 100% Offline no Meio do Talhão',
      superAgtech: 'Nativa (IndexedDB + PWA Outbox Pattern)',
      totvs: 'Requer rede local ou sincronizadores complexos',
      fieldview: 'Apenas gravação de dados do Drive próprio',
      aegro: 'Parcial (apenas tarefas básicas no app)',
      siagri: 'Dependente da infraestrutura da sede',
    },
    {
      criterio: 'Telemetria CAN Bus Multimarca (J1939)',
      superAgtech: 'John Deere, Case, New Holland, Jacto, Valtra',
      totvs: 'Apenas via integrações caras de terceiros',
      fieldview: 'Fechado para monitores parceiros',
      aegro: 'Apenas apontamento manual',
      siagri: 'Apenas controle manual de diesel',
    },
    {
      criterio: 'Livro Caixa Digital do Produtor Rural (LCDPR)',
      superAgtech: 'Rateio familiar oficial + Chave 44 Módulo 11',
      totvs: 'Módulo corporativo de alta complexidade',
      fieldview: 'Não possui módulo fiscal nem contábil',
      aegro: 'Gera arquivo mas sem auditoria automática',
      siagri: 'Exige módulo contábil separado',
    },
    {
      criterio: 'MIP & Nível de Dano Econômico (NDE) Dinâmico',
      superAgtech: 'Fórmula científica Embrapa integrada',
      totvs: 'Apenas formulário básico de inspeção',
      fieldview: 'Apenas mapas de calor de estresse',
      aegro: 'Checklist simples sem cálculo de ação',
      siagri: 'Não possui módulo fitossanitário dedicado',
    },
    {
      criterio: 'Barter Multi-Commodity, CPR e Travamento na B3',
      superAgtech: 'Razão de troca e paridade portuária em tempo real',
      totvs: 'Módulo de tesouraria legado',
      fieldview: 'Não possui comercialização',
      aegro: 'Não possui travas nem hedge',
      siagri: 'Módulo isolado de comercialização',
    },
    {
      criterio: 'Conformidade Ambiental Internacional EUDR & CAR',
      superAgtech: 'Cruzamento PRODES, CAR e MapBiomas nativo',
      totvs: 'Apenas sob demanda de consultoria',
      fieldview: 'Não possui auditoria territorial',
      aegro: 'Não possui',
      siagri: 'Não possui',
    },
  ];

  const faqs = [
    {
      pergunta: 'O AGROTECH funciona mesmo sem sinal de internet no meio do talhão?',
      resposta: 'Sim. A plataforma utiliza a arquitetura Outbox Pattern com banco de dados local no dispositivo móvel. Seus operadores podem registrar abastecimentos no comboio, pesagens na balança, aplicações de calda e monitoramento de pragas MIP com o aparelho 100% offline. Assim que o equipamento retorna à sede ou capta sinal 4G/Wi-Fi, a sincronização é realizada sem perda de dados.'
    },
    {
      pergunta: 'Como funciona a integração com o Livro Caixa Digital do Produtor Rural (LCDPR)?',
      resposta: 'Atende rigorosamente ao leiaute oficial da Receita Federal do Brasil, com apuração automática de receitas e despesas por talhão, rateio de condomínios rurais familiares conforme o percentual exato de cada titular, cálculo de retenções do Funrural/Senar e validador de chave de acesso de 44 dígitos com Módulo 11.'
    },
    {
      pergunta: 'Preciso trocar os computadores de bordo ou monitores das minhas máquinas?',
      resposta: 'Não. O AGROTECH é universal e se comunica diretamente com os padrões industriais CAN Bus J1939 e ISOBUS 11783, integrando frotas mistas (tratores, colheitadeiras e pulverizadores John Deere, Case IH, New Holland, Massey Ferguson, Valtra e Jacto).'
    },
    {
      pergunta: 'Quanto tempo leva a implantação na fazenda?',
      resposta: 'Nossa implantação padrão leva menos de 5 dias úteis. Importamos seus talhões via arquivos shapefile/KML, parametrizamos os cadastros de insumos e máquinas, e disponibilizamos treinamento prático para operadores e gestores de campo.'
    }
  ];

  const handleStartRegister = () => {
    if (onGoToRegister) {
      onGoToRegister();
    } else {
      onEnterPlatformDirectly();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#8FBF88] selection:text-slate-900 antialiased">
      {/* HEADER INSTITUCIONAL ELEGANTE & LIMPO */}
      <header className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">AGROTECH</span>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">O Sistema Operacional da Empresa Rural</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#complexidade" className="hover:text-white transition">O Desafio</a>
            <a href="#plataforma" className="hover:text-white transition">A Plataforma</a>
            <a href="#demonstracao" className="hover:text-white transition">Demonstração</a>
            <a href="#operacoes" className="hover:text-white transition">Atividades</a>
            <a href="#ia" className="hover:text-white transition">IA Agrícola</a>
            <a href="#beneficios" className="hover:text-white transition">Benefícios</a>
            <a href="#planos" className="hover:text-white transition">Planos</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-emerald-50 rounded-xl transition border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Entrar</span>
            </button>
            <button
              onClick={handleStartRegister}
              className="px-4 py-2 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION — POSICIONAMENTO OFICIAL (Seção 1, 7 & 15) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-[#F7F9F5] via-[#EAF4E7]/40 to-[#F7F9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-slate-900 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>O Sistema Operacional da Empresa Rural</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              A inteligência que conecta toda a sua operação agrícola.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Gestão agrícola, máquinas, produção, custos, estoque, mercado, financeiro e inteligência em uma única plataforma integrada e sem complexidade.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStartRegister}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Começar agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-amber-50 text-slate-900 font-bold rounded-xl text-sm border border-slate-300 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Conhecer a plataforma</span>
              </button>
            </div>

            {/* Showcase Executivo: As 4 Perguntas Críticas da Safra */}
            <div className="mt-12 text-left bg-white rounded-2xl border border-slate-200 shadow-md p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wider uppercase border border-emerald-200">
                    Cockpit da Empresa Rural
                  </span>
                  <h3 className="text-xs font-bold text-slate-800">
                    As 4 Perguntas Cruciais Que o Produtor Quer Responder Todos os Dias
                  </h3>
                </div>
                <span className="text-[11px] text-slate-600 font-mono font-medium">
                  Safra 2026/27 • Dados Reais Integrados
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all group">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                    01 • Custos
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2.5 group-hover:text-emerald-900 transition-colors">
                    Quanto custou produzir cada saca neste talhão?
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    Custeio ABC real com insumos, combustível e mão de obra alocados ao metro quadrado.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all group">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                    02 • Telemetria
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2.5 group-hover:text-emerald-900 transition-colors">
                    Minhas máquinas estão trabalhando ou paradas agora?
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    Telemetria CAN Bus J1939 ao vivo: velocidade, diesel L/h, área e paradas de comboio.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all group">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                    03 • Finanças
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2.5 group-hover:text-emerald-900 transition-colors">
                    Qual é o meu resultado financeiro real consolidado?
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    DRE por safra, fluxo de caixa diário, Livro Caixa LCDPR e rateio de condomínio.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all group">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase">
                    04 • Comercial
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-2.5 group-hover:text-emerald-900 transition-colors">
                    Quando e quanto devo vender da minha produção futura?
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                    Preço de equilíbrio (break-even), contratos a termo, Barter com CPR e B3 ao vivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1 DO STORYTELLING: SUA OPERAÇÃO ESTÁ FICANDO MAIS COMPLEXA (Seção 8) */}
      <section id="complexidade" className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono bg-slate-100 border border-slate-200 px-3 py-1 rounded-full inline-block">
              O DESAFIO DA GESTÃO RURAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Sua operação está ficando mais complexa.
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              À medida que a fazenda cresce, as decisões não podem mais depender apenas de intuição ou anotações dispersas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Informações Espalhadas',
                desc: 'Dados divididos entre papéis na caminhonete, mensagens de WhatsApp e sistemas antigos que não se comunicam.'
              },
              {
                title: 'Planilhas Desatualizadas',
                desc: 'Planilhas pesadas, sujeitas a erros de fórmula e que demoram dias para mostrar o saldo real de estoque e financeiro.'
              },
              {
                title: 'Máquinas sem Controle',
                desc: 'Consumo excessivo de diesel, tempo ocioso em marcha lenta e manutenções corretivas que paralisam a colheita.'
              },
              {
                title: 'Custos Reais Desconhecidos',
                desc: 'Incerteza sobre o custo exato por saca ou arroba em cada talhão, dificultando a tomada de decisão comercial.'
              },
              {
                title: 'Dificuldade para Acompanhar Talhões',
                desc: 'Falta de visão espacial e histórica de aplicações, histórico de pragas MIP e curvas de produtividade.'
              },
              {
                title: 'Decisões Baseadas em Percepção',
                desc: 'Comercialização no escuro e travas de insumos desfavoráveis por falta de paridade portuária consolidada.'
              }
            ].map((dor, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all space-y-3 group">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs font-mono group-hover:bg-emerald-50 group-hover:text-emerald-800 group-hover:border-emerald-200 transition-colors">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">{dor.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{dor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 A 6 DO STORYTELLING: TUDO CONECTADO EM UMA ÚNICA PLATAFORMA (Seção 8) */}
      <section id="plataforma" className="py-16 sm:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              A RESPOSTA DEFINITIVA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Tudo conectado em uma única plataforma.
            </h2>
            <p className="text-sm text-slate-600">
              O AGROTECH integra cada elo da sua empresa rural em uma estrutura lógica e contínua.
            </p>
          </div>

          <div className="space-y-12">
            {/* Bloco 1: Controle sua Operação */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">SEÇÃO 3 • OPERAÇÃO AGRÍCOLA</span>
                <h3 className="text-2xl font-black text-slate-900">Controle sua operação.</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gerencie propriedades, fazendas, talhões, safras e culturas com precisão milimétrica. Planeje e registre cada etapa de plantio, manejo fitossanitário e colheita com apontamentos georreferenciados.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Propriedades', 'Fazendas', 'Talhões', 'Safras', 'Culturas', 'Plantio', 'Manejo', 'Colheita'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-slate-900 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-white font-bold border-b border-slate-700 pb-2">
                  <span className="text-white font-extrabold">Talhão 02 • Pivô Central</span>
                  <span className="text-emerald-400 font-bold">420 ha • Soja</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex justify-between"><span>Plantio Realizado:</span><b className="text-white font-bold">12/10/2026 (14.2 sementes/m)</b></div>
                  <div className="flex justify-between"><span>Manejo MIP:</span><b className="text-emerald-400 font-bold">NDE Controlado (1.2 pragas/m)</b></div>
                  <div className="flex justify-between"><span>Previsão de Colheita:</span><b className="text-amber-300 font-bold">Fevereiro/2027 (71.5 sc/ha)</b></div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Controle suas Máquinas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-300 shadow-sm">
              <div className="space-y-4 lg:order-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">SEÇÃO 4 • MÁQUINAS E FROTAS</span>
                <h3 className="text-2xl font-black text-slate-900">Controle suas máquinas.</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Supervisione toda a frota, consumo de diesel no comboio, planos preventivos por horímetro e ordens de serviço da oficina. Leitura direta de CAN Bus multimarca para identificar tempo ocioso e rotação do motor.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Frota', 'Combustível', 'Manutenção', 'Oficina', 'Operadores', 'Horas Trabalhadas', 'Telemetria'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-slate-900 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md space-y-3 font-mono text-xs lg:order-1">
                <div className="flex justify-between items-center text-white font-bold border-b border-slate-700 pb-2">
                  <span className="text-white font-extrabold">Trator John Deere 8370R (#04)</span>
                  <span className="text-emerald-400 font-bold">CAN Bus J1939</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex justify-between"><span>Horímetro Atual:</span><b className="text-white font-bold">3.421,5h</b></div>
                  <div className="flex justify-between"><span>Consumo Médio:</span><b className="text-amber-300 font-bold">28.4 L/h (-12% abaixo da meta)</b></div>
                  <div className="flex justify-between"><span>Próxima Revisão:</span><b className="text-emerald-400 font-bold">Em 78,5h (3.500h Preventiva)</b></div>
                </div>
              </div>
            </div>

            {/* Bloco 3: Saiba quanto sua operação realmente custa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">SEÇÃO 5 • CUSTOS E FINANÇAS</span>
                <h3 className="text-2xl font-black text-slate-900">Saiba quanto sua operação realmente custa.</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apure o custo agrícola real por talhão e por saca. Faça a gestão de centros de custo, movimentações de insumos no estoque, contas a pagar, contas a receber e resultado operacional líquido.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Custos Agrícolas', 'Centros de Custo', 'Insumos', 'Estoque', 'Financeiro', 'Margem', 'Resultado'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-slate-900 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-white font-bold border-b border-slate-700 pb-2">
                  <span className="text-white font-extrabold">DRE Analítica por Hectare</span>
                  <span className="text-emerald-400 font-bold">Safra 2026/27</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex justify-between"><span>Insumos & Fertilizantes:</span><b className="text-white font-bold">R$ 2.450,00/ha</b></div>
                  <div className="flex justify-between"><span>Operações & Diesel:</span><b className="text-white font-bold">R$ 840,00/ha</b></div>
                  <div className="flex justify-between"><span>Custo Total Apurado:</span><b className="text-white font-bold">R$ 4.290,00/ha (R$ 61,28/sc)</b></div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-slate-700">
                    <span>Margem Operacional Líquida:</span><b className="text-emerald-300">+53.5% (R$ 70,72/sc)</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 4: Transforme dados em decisões */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-300 shadow-sm">
              <div className="space-y-4 lg:order-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">SEÇÃO 6 • INTELIGÊNCIA & DECISÃO</span>
                <h3 className="text-2xl font-black text-slate-900">Transforme dados em decisões.</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Painéis executivos de BI, indicadores chave de desempenho, modelos estatísticos preditivos e um assistente digital para alertar sobre anomalias antes que elas custem caro.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['BI', 'Indicadores', 'Alertas', 'Previsão', 'IA', 'Riscos', 'Recomendações'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-slate-900 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-md space-y-3 font-mono text-xs lg:order-1">
                <div className="flex justify-between items-center text-white font-bold border-b border-slate-700 pb-2">
                  <span className="text-white font-extrabold">Alerta Preventivo de Pulverização</span>
                  <span className="text-rose-400 font-bold">Delta T Crítico</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex justify-between"><span>Temperatura / UR:</span><b className="text-white font-bold">32°C / 42% (Delta T = 8.2)</b></div>
                  <div className="flex justify-between"><span>Risco de Deriva e Evaporação:</span><b className="text-rose-400 font-bold">ELEVADO</b></div>
                  <div className="flex justify-between text-amber-300 font-bold pt-1.5 border-t border-slate-700">
                    <span>Recomendação do Sistema:</span><b className="text-amber-200">Suspender aplicação até 17h30</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 DO STORYTELLING: PARA DIFERENTES OPERAÇÕES AGRÍCOLAS (Seção 8) */}
      <section id="operacoes" className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              ADAPTAÇÃO POR ATIVIDADE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Para diferentes operações agrícolas.
            </h2>
            <p className="text-sm text-slate-600">
              O AGROTECH molda sua interface conforme o perfil do cliente, ativando somente o que é necessário.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: '🌱', nome: 'Grãos & Commodities', desc: 'Soja, milho, trigo, balança, romaneios e Barter B3.' },
              { icon: '🐄', nome: 'Pecuária de Corte & Leite', desc: 'Rastreabilidade SISBOV, manejo de pasto e confinamento.' },
              { icon: '☕', nome: 'Café Especial', desc: 'Rastreabilidade de lotes, terreiro suspenso e curva de secagem.' },
              { icon: '🍫', nome: 'Cacau Fino & Cabruca', desc: 'Fermentação em cochos, corte cut-test e certificações.' },
              { icon: '🍇', nome: 'Uva & Vitivinicultura', desc: 'Manejo de podas, teor °Brix e enologia de precisão.' },
              { icon: '🌾', nome: 'Cana-de-Açúcar & Usinas', desc: 'Cálculo de ATR, corte, transbordo e moenda contínua.' },
              { icon: '🌳', nome: 'Silvicultura & Eucalipto', desc: 'Inventário florestal contínuo e cubagem rigorosa.' },
              { icon: '🥬', nome: 'Hortifrúti & HF', desc: 'Rastreabilidade MAPA, estufas e hidroponia.' },
              { icon: '🐖', nome: 'Suinocultura', desc: 'Maternidade climatizada, creche e manejo de dejetos.' },
              { icon: '🐔', nome: 'Avicultura', desc: 'Postura comercial, galpões e conversão alimentar.' },
              { icon: '🐟', nome: 'Aquicultura & Piscicultura', desc: 'Qualidade de água, aeração e biometria de peixes.' },
              { icon: '🐝', nome: 'Apicultura & Mel', desc: 'Colmeias com rastreabilidade floral e extração de mel.' },
            ].map((op, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-300 hover:border-emerald-300 transition space-y-1.5"
              >
                <div className="text-2xl mb-1">{op.icon}</div>
                <h4 className="text-xs font-bold text-slate-900">{op.nome}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{op.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 9: DEMONSTRAÇÃO DO SISTEMA — VEJA O AGROTECH EM AÇÃO (Seção 9) */}
      <section id="demonstracao" className="py-16 sm:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              EXPERIÊNCIA REAL DO PRODUTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Veja o AGROTECH em ação.
            </h2>
            <p className="text-sm text-slate-600">
              Interface limpa, rápida e desenhada para o gestor rural brasileiro.
            </p>
          </div>

          {/* Abas de Demonstração */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'DASHBOARD', label: 'Dashboard Principal' },
              { id: 'MOBILE', label: 'Mobile no Talhão' },
              { id: 'MAPA', label: 'Mapa de Talhões' },
              { id: 'MAQUINAS', label: 'Frotas & Telemetria' },
              { id: 'CUSTOS', label: 'DRE & Custos' },
              { id: 'IA', label: 'Assistente Digital IA' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDemoTabAtiva(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  demoTabAtiva === tab.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Janela de Demonstração de Interface Real */}
          <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden p-6 sm:p-8">
            {demoTabAtiva === 'DASHBOARD' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Cockpit Executivo da Safra 2026/27</h4>
                    <p className="text-xs text-slate-600">Fazenda Santa Maria • 3.450 hectares monitorados</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-slate-900 font-bold">100% dos Talhões Mapeados</span>
                    <span className="px-2.5 py-1 rounded bg-amber-50 text-slate-900">Colheita: 68% Concluída</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <span className="text-[11px] text-slate-600 block">Produtividade Média Ponderada</span>
                    <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">71.2 sc/ha</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">+3.8% acima da safra passada</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <span className="text-[11px] text-slate-600 block">Custo Médio Operacional</span>
                    <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">R$ 61,40/sc</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Dentro do orçamento planejado</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <span className="text-[11px] text-slate-600 block">Máquinas em Operação</span>
                    <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">14 / 16 ativas</span>
                    <span className="text-[10px] text-slate-600">87.5% de disponibilidade OEE</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300">
                    <span className="text-[11px] text-slate-600 block">Margem Líquida Projetada</span>
                    <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">52.8%</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">R$ 1.842.000 de resultado líquido</span>
                  </div>
                </div>
              </div>
            )}

            {demoTabAtiva === 'MOBILE' && (
              <div className="max-w-md mx-auto bg-slate-50 p-5 rounded-3xl border border-slate-300 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-700" />
                    Modo Campo Offline Ativo
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-slate-900 font-mono">0 Pendências</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-300 space-y-1">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">Último Lançamento no Talhão:</span>
                  <p className="text-xs font-bold text-slate-900">Abastecimento Comboio • 380 L Diesel S10</p>
                  <span className="text-[10px] text-emerald-700 block">Gravado localmente na Outbox com ACID local</span>
                </div>
                <button
                  type="button"
                  onClick={onEnterPlatformDirectly}
                  className="w-full py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Simular Lançamento Offline no Simulador Mobile
                </button>
              </div>
            )}

            {demoTabAtiva === 'MAPA' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span className="font-bold text-slate-900">Georreferenciamento SIG & Camadas Satelitais</span>
                  <span>Sistema PostGIS 3.4 Spatial Conectado</span>
                </div>
                <div className="h-64 bg-emerald-50/60 rounded-2xl border border-emerald-300 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <MapPin className="w-8 h-8 text-slate-900" />
                  <span className="text-sm font-bold text-slate-900">Visualizador Espacial de Talhões Ativo</span>
                  <p className="text-xs text-slate-600 max-w-md">
                    Integração com Sentinel-2 NDVI, polígonos shapefile e alertas de sobreposição territorial em tempo real.
                  </p>
                </div>
              </div>
            )}

            {demoTabAtiva === 'MAQUINAS' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Telemetria CAN Bus J1939 em Tempo Real</span>
                  <span className="text-emerald-700 font-mono text-xs">Latência: 12ms</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-600 block uppercase">Pulverizador Jacto Uniport</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">85 L/ha • 18 km/h</span>
                    <span className="text-[10px] text-emerald-700">Taxa de Aplicação Perfeita</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-600 block uppercase">Colheitadeira John Deere S780</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">Umidade 13.9% • Perda 0.8%</span>
                    <span className="text-[10px] text-emerald-700">Dessecação dentro do padrão</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
                    <span className="text-[10px] text-slate-600 block uppercase">Trator Case Magnum 340</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">Horímetro: 2.190h</span>
                    <span className="text-[10px] text-slate-900">Próxima troca de filtro em 60h</span>
                  </div>
                </div>
              </div>
            )}

            {demoTabAtiva === 'CUSTOS' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Demonstrativo de Resultado do Exercício por Talhão</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-slate-900 font-bold">LCDPR Integrado</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Receita Bruta com Grãos (32.400 sacas):</span>
                    <strong className="text-slate-900 font-mono">R$ 4.276.800,00</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">(-) Custo Operacional Efetivo (Insumos + Frota):</span>
                    <strong className="text-rose-700 font-mono">- R$ 1.980.400,00</strong>
                  </div>
                  <div className="flex justify-between py-1 text-slate-900 font-bold text-sm">
                    <span>Resultado Operacional Líquido do Condomínio:</span>
                    <strong className="font-mono">+ R$ 2.296.400,00</strong>
                  </div>
                </div>
              </div>
            )}

            {demoTabAtiva === 'IA' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-900 font-bold">
                  <Bot className="w-4 h-4 text-emerald-700" />
                  <span>Assistente Digital AgroTech • Conectado à Base de Dados Real do Tenant</span>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-300 space-y-2 text-xs">
                  <p className="font-bold text-slate-900">Pergunta do Gestor: "Onde estamos com o maior gargalo de diesel nesta safra?"</p>
                  <p className="text-slate-900 leading-relaxed">
                    "Identificamos que a frente de dessecação do Talhão 08 apresentou consumo de 34.2 L/h, contra a meta de 28.0 L/h. Causa: trabalho com rotação do motor a 2.100 RPM em velocidade incompatível com a topografia."
                  </p>
                  <span className="text-[10px] text-slate-600 block font-mono">
                    Origem dos dados: Telemetria CAN Bus J1939 + Apontamentos de Comboio
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 10: BENEFÍCIOS — MAIS CONTROLE. MENOS COMPLEXIDADE (Seção 10) */}
      <section id="beneficios" className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              VALOR COMPROVADO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Mais controle. Menos complexidade.
            </h2>
            <p className="text-sm text-slate-600">
              Criado para que o produtor gaste menos tempo com burocracia e mais tempo cuidando da lavoura.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { titulo: 'Operação', desc: 'Controle tudo o que acontece no campo com apontamentos simples que qualquer operador domina.' },
              { titulo: 'Produtividade', desc: 'Compare o planejado versus o realizado safra a safra para entender os gargalos.' },
              { titulo: 'Custos', desc: 'Saiba exatamente onde seu dinheiro está sendo consumido, talhão por talhão.' },
              { titulo: 'Máquinas', desc: 'Controle utilização, plano de manutenção e abastecimento para evitar paradas não programadas.' },
              { titulo: 'Estoque', desc: 'Evite excessos, desvios e perdas por validade de defensivos e sementes tratadas.' },
              { titulo: 'Mercado', desc: 'Acompanhe cotações da B3 e CBOT e trave contratos de Barter na hora certa.' },
              { titulo: 'Financeiro', desc: 'Tenha visão real do fluxo de caixa e do livro caixa sem surpresas tributárias.' },
              { titulo: 'Inteligência', desc: 'Receba alertas e recomendações automáticas para agir antes do problema se agravar.' },
            ].map((card, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-300 space-y-2">
                <span className="text-xs font-bold text-emerald-700 block uppercase tracking-wider font-mono">
                  {card.titulo}
                </span>
                <p className="text-xs text-slate-900 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 11: IA AGROTECH — SEU GESTOR DIGITAL AGRÍCOLA (Seção 11) */}
      <section id="ia" className="py-16 sm:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              INTELIGÊNCIA BASEADA EM DADOS REAIS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Seu gestor digital agrícola.
            </h2>
            <p className="text-sm text-slate-600">
              Faça perguntas em linguagem natural e receba respostas apoiadas diretamente nos dados do seu tenant.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lista de Perguntas */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2 font-mono">
                Selecione uma Análise:
              </span>
              {perguntasIa.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPerguntaIaAtiva(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer text-xs font-bold ${
                    perguntaIaAtiva === idx
                      ? 'bg-white border-[#5F8F52] text-slate-900 shadow-md'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.pergunta}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-slate-900">
                      {item.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Painel de Resposta da IA com Origem de Dados */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-lg space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {perguntasIa[perguntaIaAtiva].pergunta}
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-semibold">Análise contextual gerada em tempo real</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-900 leading-relaxed">
                  {perguntasIa[perguntaIaAtiva].resposta}
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block font-mono">
                    Rastreabilidade da Origem dos Dados (Princípio 11):
                  </span>
                  <span className="text-xs font-mono text-slate-900 font-semibold block">
                    {perguntasIa[perguntaIaAtiva].origem}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-600 border-t border-slate-200">
                <span>✓ Dados estritamente isolados pelo seu Tenant ID</span>
                <button
                  type="button"
                  onClick={onEnterPlatformDirectly}
                  className="text-slate-900 font-bold hover:underline cursor-pointer"
                >
                  Abrir Módulo Completo de BI →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 12: PLANOS SAAS CONFIGURÁVEIS (Seção 12) */}
      <section id="planos" className="py-16 sm:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              ESTRUTURA DE SUBSCRIÇÃO TRANSPARENTE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Planos dimensionados para sua operação.
            </h2>
            <p className="text-sm text-slate-600">
              Sem surpresas ou taxas ocultas. Escolha o nível de capacidade adequado para a sua terra.
            </p>

            {/* Alternador Mensal / Anual */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${faturamentoPeriodo === 'MENSAL' ? 'text-slate-900' : 'text-slate-600'}`}>
                Faturamento Mensal
              </span>
              <button
                type="button"
                onClick={() => setFaturamentoPeriodo(prev => prev === 'ANUAL' ? 'MENSAL' : 'ANUAL')}
                className="w-14 h-7 bg-emerald-50 rounded-full p-1 transition-all relative border border-emerald-300 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-emerald-700 transition-all ${
                    faturamentoPeriodo === 'ANUAL' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                ></div>
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${faturamentoPeriodo === 'ANUAL' ? 'text-slate-900' : 'text-slate-600'}`}>
                Faturamento Anual <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-slate-900 text-[10px] border border-emerald-300">Economize 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PLANO 1: START */}
            <div className="bg-slate-50 rounded-3xl border border-slate-300 p-8 space-y-6 flex flex-col justify-between hover:border-emerald-300 transition">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 uppercase font-mono">START</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-900 font-mono border border-slate-300">Até 800 ha</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '390' : '490'}
                  </span>
                  <span className="text-xs text-slate-600"> / mês</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para operações familiares e pequenos produtores que precisam de controle de talhões, estoque e emissão de notas com LCDPR.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-900 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Até 1 Propriedade e 800 hectares</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Livro Caixa Digital do Produtor Rural (LCDPR)</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Emissão de NF-e do Produtor</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>App Mobile 100% Offline (Outbox)</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Até 3 Usuários</span></li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleStartRegister}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 font-bold text-xs border border-slate-300 transition cursor-pointer shadow-sm"
              >
                Começar agora
              </button>
            </div>

            {/* PLANO 2: PROFESSIONAL */}
            <div className="bg-white rounded-3xl border-2 border-emerald-700 p-8 space-y-6 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                MAIS ESCOLHIDO
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 uppercase font-mono">PROFESSIONAL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-slate-900 font-mono">Até 3.500 ha</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '1.190' : '1.490'}
                  </span>
                  <span className="text-xs text-slate-600"> / mês</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para fazendas de alta produtividade que buscam telemetria de máquinas CAN Bus, Barter na B3, controle MIP e DRE talhão a talhão.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-900 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span><b>Tudo do plano Start, mais:</b></span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Telemetria CAN Bus J1939 em Tempo Real</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Barter Multi-Commodity & CPR na B3</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>MDF-e SEFAZ & Emissão de CIOT ANTT</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Até 12 Usuários & Suporte Prioritário</span></li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleStartRegister}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                Começar agora
              </button>
            </div>

            {/* PLANO 3: ENTERPRISE */}
            <div className="bg-slate-50 rounded-3xl border border-slate-300 p-8 space-y-6 flex flex-col justify-between hover:border-emerald-300 transition">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 uppercase font-mono">ENTERPRISE</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-900 font-mono border border-slate-300">Área Ilimitada</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '2.490' : '2.990'}
                  </span>
                  <span className="text-xs text-slate-600"> / mês</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Para agroindústrias, cooperativas e grandes grupos com múltiplos CNPJs, usinas, auditoria territorial EUDR e frotas pesadas.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-900 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span><b>Tudo do plano Professional, mais:</b></span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Multi-Fazendas, Matriz & Filiais Ilimitadas</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Auditoria Territorial EUDR (PRODES/CAR)</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>API RESTful e Webhooks para ERPs Legados</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" /><span>Usuários Ilimitados com RBAC Estrito</span></li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleStartRegister}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-900 font-bold text-xs border border-slate-300 transition cursor-pointer shadow-sm"
              >
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 13: CTA FINAL — SUA OPERAÇÃO JÁ É GRANDE DEMAIS PARA DEPENDER DE PLANILHAS (Seção 13) */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-950 via-emerald-900 to-[#0A1F15] border-b border-emerald-800 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Sua operação já é grande demais para depender de planilhas.
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium">
            Tenha uma visão completa da sua empresa rural em uma única plataforma unificada.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartRegister}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Começar agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToLogin}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm border border-emerald-500/50 transition cursor-pointer"
            >
              <span>Acessar minha conta</span>
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 14: FOOTER PROFISSIONAL (Seção 14) */}
      <footer className="py-16 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-base font-black text-slate-900">AGROTECH</span>
              </div>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                O sistema operacional da empresa rural. Conectando campo, máquinas, estoque, financeiro e inteligência de ponta a ponta.
              </p>
              <span className="text-[11px] text-emerald-700 block font-mono">
                PostGIS 3.4 Spatial • Outbox PWA Offline • ISO 11783 CAN Bus
              </span>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Plataforma</h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#plataforma" className="hover:text-white">Operação Agrícola</a></li>
                <li><a href="#plataforma" className="hover:text-white">Máquinas & Frotas</a></li>
                <li><a href="#plataforma" className="hover:text-white">Estoque de Insumos</a></li>
                <li><a href="#plataforma" className="hover:text-white">DRE por Talhão</a></li>
                <li><a href="#ia" className="hover:text-white">Assistente de IA</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Recursos & Soluções</h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#operacoes" className="hover:text-white">Para Produtores de Grãos</a></li>
                <li><a href="#operacoes" className="hover:text-white">Para Pecuária SISBOV</a></li>
                <li><a href="#operacoes" className="hover:text-white">Para Café & Cana</a></li>
                <li><a href="#planos" className="hover:text-white">Planos de Subscrição</a></li>
                <li><a href="#demonstracao" className="hover:text-white">Demonstração Interativa</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Suporte & Legal</h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#faq" className="hover:text-white">Dúvidas Frequentes</a></li>
                <li><span className="text-slate-600">Termos de Uso</span></li>
                <li><span className="text-slate-600">Privacidade & LGPD</span></li>
                <li><button onClick={onGoToLogin} className="hover:text-white cursor-pointer">Login do Produtor</button></li>
                <li><span className="text-slate-900 font-bold">0800 400 AGRO</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <span>© 2026 AGROTECH Sistemas Agrícolas S.A. Todos os direitos reservados.</span>
            <span>Ambiente Auditado e Conforme com Normas da Receita Federal & BACEN</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
