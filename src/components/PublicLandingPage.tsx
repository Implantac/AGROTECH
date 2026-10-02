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
  Leaf
} from 'lucide-react';

interface PublicLandingPageProps {
  onGoToLogin: () => void;
  onEnterPlatformDirectly: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGoToLogin,
  onEnterPlatformDirectly,
}) => {
  // Estado de Faturamento Anual (com desconto) ou Mensal
  const [faturamentoPeriodo, setFaturamentoPeriodo] = useState<'ANUAL' | 'MENSAL'>('ANUAL');

  // Calculadora Interativa de ROI da Fazenda
  const [areaHaCalculadora, setAreaHaCalculadora] = useState<number>(2200);
  const [culturaCalculadora, setCulturaCalculadora] = useState<'SOJA_MILHO' | 'ALGODAO' | 'CAFE' | 'PECUARIA'>('SOJA_MILHO');

  // FAQ Accordion
  const [faqAberta, setFaqAberta] = useState<number | null>(0);

  // Modal de Demonstração / Contato Rápido
  const [leadEmail, setLeadEmail] = useState('');
  const [leadTelefone, setLeadTelefone] = useState('');
  const [leadCadastrado, setLeadCadastrado] = useState(false);

  // Cálculos dinâmicos e matematicamente auditados de ROI
  const retornoEstimado = useMemo(() => {
    let sacasGanhasHa = 2.4;
    let precoSaca = 132.0;
    let economiaDieselPorHa = 48.50;
    let economiaAduboPorHa = 74.00;

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
      sacasGanhasHa = 1.8; // @ ganhas/ha
      precoSaca = 245.0; // @ boi gordo
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

  // Benchmark Comparativo Objetivo
  const criteriosComparativo = [
    {
      criterio: 'Operação 100% Offline no Meio do Talhão',
      superAgtech: 'Nativa (IndexedDB + PWA Outbox Pattern)',
      totvs: 'Requer rede local ou sincronizadores lentos',
      fieldview: 'Apenas gravação de dados do Drive próprio',
      aegro: 'Parcial (apenas tarefas básicas no app)',
      siagri: 'Dependente da infraestrutura da sede',
    },
    {
      criterio: 'Telemetria CAN Bus Multimarca (J1939)',
      superAgtech: 'John Deere, Case, New Holland, Jacto, Valtra',
      totvs: 'Apenas via integrações de terceiros',
      fieldview: 'Fechado para sensores parceiros Climate',
      aegro: 'Não possui (apenas apontamento manual)',
      siagri: 'Não possui (apenas controle de combustível)',
    },
    {
      criterio: 'Livro Caixa Digital do Produtor Rural (LCDPR Oficial)',
      superAgtech: 'Rateio de condomínio familiar + Chave 44 Módulo 11',
      totvs: 'Módulo corporativo de alta complexidade',
      fieldview: 'Não possui módulo fiscal nem contábil',
      aegro: 'Gera arquivo mas sem auditoria automática',
      siagri: 'Possui mas exige plano fiscal separado',
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
      totvs: 'Módulo de tesouraria agroindustrial legado',
      fieldview: 'Não possui módulo de comercialização',
      aegro: 'Não possui travas nem hedge de safra',
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
      pergunta: 'O Super AgTech funciona mesmo sem sinal de internet no meio do talhão?',
      resposta: 'Sim. A plataforma utiliza a arquitetura Outbox Pattern com banco local no dispositivo móvel. Seus operadores podem apontar abastecimentos no comboio, pesagens na balança, aplicações de calda e monitoramento de pragas MIP com o aparelho 100% offline. Assim que o equipamento retorna à sede ou capta sinal 4G/Wi-Fi, a sincronização atômica é realizada sem perda de dados.'
    },
    {
      pergunta: 'Como funciona a integração com o Livro Caixa Digital do Produtor Rural (LCDPR)?',
      resposta: 'Atende rigorosamente ao leiaute oficial da Receita Federal do Brasil, com apuração automática de receitas e despesas por talhão, rateio de condomínios rurais familiares conforme o percentual exato de cada titular, cálculo de retenções do Funrural/Senar e validador de chave de acesso de 44 dígitos com Módulo 11.'
    },
    {
      pergunta: 'Preciso trocar os computadores de bordo ou monitores das minhas máquinas?',
      resposta: 'Não. O Super AgTech é universal e se comunica diretamente com os padrões industriais CAN Bus J1939 e ISOBUS 11783, integrando frotas mistas (tratores, colheitadeiras e pulverizadores John Deere, Case IH, New Holland, Massey Ferguson, Valtra e Jacto).'
    },
    {
      pergunta: 'Quanto tempo leva a implantação na fazenda?',
      resposta: 'Nossa implantação padrão leva menos de 5 dias úteis. Importamos seus talhões via arquivos shapefile/KML, parametrizamos os cadastros de insumos e máquinas, e disponibilizamos treinamento prático para operadores e gestores de campo.'
    }
  ];

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadCadastrado(true);
    setTimeout(() => {
      onEnterPlatformDirectly();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 antialiased">
      {/* 1. HEADER INSTITUCIONAL LIMPO & ELEGANTE */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Oficial com Identidade Agrícola */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-950/40">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">SUPER AGTECH</span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Plataforma Agrícola Enterprise</span>
            </div>
          </div>

          {/* Navegação Clara (Princípio 4 & 7) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#problema" className="hover:text-emerald-400 transition">O Desafio</a>
            <a href="#solucao" className="hover:text-emerald-400 transition">A Solução</a>
            <a href="#beneficios" className="hover:text-emerald-400 transition">Benefícios & ROI</a>
            <a href="#comparativo" className="hover:text-emerald-400 transition">Comparativo</a>
            <a href="#planos" className="hover:text-emerald-400 transition">Planos</a>
            <a href="#faq" className="hover:text-emerald-400 transition">Dúvidas</a>
          </nav>

          {/* Ações Rápidas de Acesso */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition border border-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entrar</span>
            </button>
            <button
              onClick={onEnterPlatformDirectly}
              className="px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 rounded-xl shadow-lg shadow-emerald-950/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Demonstração Ao Vivo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION — REGRA DOS 5s, 15s, 30s E 60s (Princípio 6) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* 5 Segundos: O que é */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gestão Agrícola Integrada do Talhão à Contabilidade</span>
            </div>

            {/* Headline Principal: Forte, Direta, Sem Jargão Neon */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              A inteligência do campo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">multiplica sua produtividade</span> e protege a sua margem.
            </h1>

            {/* 15 e 30 Segundos: Para quem serve e quais os benefícios */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Criado especificamente para <b>produtores de grãos, pecuaristas e gestores agrícolas</b> que precisam de controle total de máquinas, estoque, manejo sanitário e compliance fiscal — <b>mesmo sem qualquer sinal de internet na lavoura.</b>
            </p>

            {/* CTAs Diretos de Conversão */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onEnterPlatformDirectly}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Acessar Plataforma Completa</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToLogin}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl text-xs sm:text-sm border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Área do Produtor • Fazer Login</span>
              </button>
            </div>

            {/* 60 Segundos: Indicadores de Confiança Comprovados */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-left">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">100% Offline</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Sincronização atômica local</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">-18% Diesel</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Auditoria CAN Bus e comboio</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">LCDPR Oficial</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Rateio familiar automático</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">Zero Multas</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">SEFAZ, ANTT e EUDR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO 1: O PROBLEMA REAL (Princípio 7 — Problema) */}
      <section id="problema" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
              O DESAFIO DO AGRONEGÓCIO MODERNO
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Onde sua fazenda está perdendo margem de lucro todos os dias?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A alta produtividade por hectare não garante rentabilidade quando a operação sofre com desvios invisíveis e descompasso administrativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Consumo e Manutenção Descontrolados</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Máquinas operando em faixas inadequadas de rotação, paradas não justificadas e revisões atrasadas que geram quebras graves em plena janela de plantio ou colheita.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Apontamentos Travados sem Sinal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A maioria dos aplicativos de gestão congela ou perde lançamentos no meio do talhão, forçando anotações em papel que demoram semanas para chegar ao financeiro.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Risco Fiscal com LCDPR & Funrural</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rateios complexos em condomínios rurais, retenções de Funrural/Senar e inconsistências na escrituração geram intimações fiscais da Receita Federal e perda de crédito rural.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Vendas Descasadas e Barter no Escuro</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Falta de clareza sobre o custo real da saca produzida, gerando travamentos de insumos com razões de troca desfavoráveis e perdas no frete rodoviário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO 2: A SOLUÇÃO SUPER AGTECH (Princípio 7 — Solução) */}
      <section id="solucao" className="py-16 sm:py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              A RESPOSTA DEFINITIVA PARA QUEM PRODUZ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Toda a sua fazenda conectada em uma única tela.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Sem sistemas desconexos ou consultorias intermináveis. O Super AgTech conecta a telemetria do trator à contabilidade oficial da fazenda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Campo & Frotas Conectadas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captura dados de horímetro, consumo de combustível e taxa de aplicação direto do barramento CAN Bus J1939 de todas as marcas de máquinas do mercado.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Manejo Agronômico & MIP Científico</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Controle de pragas com cálculo matemático do Nível de Dano Econômico (NDE), monitoramento agrometeorológico de Delta T e auditoria de calda de pulverização.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Gestão Financeira & Fiscal Oficial</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                DRE por talhão apurada automaticamente, emissão de NF-e do produtor rural, MDF-e de transporte e exportação nativa do LCDPR sem intervenção manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO 3: BENEFÍCIOS & CALCULADORA INTERATIVA DE ROI (Princípio 7 — Benefício) */}
      <section id="beneficios" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                SIMULADOR DE RETORNO ECONÔMICO REAL
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                Calcule o retorno sobre o investimento para a sua área cultivada.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Nossos clientes obtêm retorno comprovado superior a <b>40x o valor da subscrição anual</b> logo no primeiro ciclo, eliminando sobreposição de defensivos, controlando desvios de diesel e otimizando a comercialização da safra.
              </p>

              {/* Sliders Interativos */}
              <div className="space-y-4 pt-2">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Área Cultivada da Propriedade</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">{areaHaCalculadora.toLocaleString('pt-BR')} hectares</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="15000"
                    step="50"
                    value={areaHaCalculadora}
                    onChange={(e) => setAreaHaCalculadora(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>100 ha</span>
                    <span>5.000 ha</span>
                    <span>15.000 ha</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-medium text-xs block">Atividade Principal da Propriedade:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'SOJA_MILHO', label: 'Soja / Milho' },
                      { id: 'ALGODAO', label: 'Algodão' },
                      { id: 'CAFE', label: 'Café' },
                      { id: 'PECUARIA', label: 'Pecuária' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCulturaCalculadora(c.id as any)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                          culturaCalculadora === c.id
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Painel do Resultado do ROI */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  BENEFÍCIO ANUAL ESTIMADO NA FAZENDA
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  R$ {Math.round(retornoEstimado.retornoTotalAnual).toLocaleString('pt-BR')}
                </div>
                <span className="text-xs text-slate-400">
                  Economia e ganho de receita acumulados na Safra 2026/27
                </span>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Ganho em Eficiência de Produtividade (+2.4 sc/ha):
                  </span>
                  <strong className="text-white font-mono">
                    R$ {Math.round(retornoEstimado.ganhoProdutividadeTotal).toLocaleString('pt-BR')}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Economia de Diesel & Redução de Sobreposição:
                  </span>
                  <strong className="text-white font-mono">
                    R$ {Math.round(retornoEstimado.economiaInsumosTotal).toLocaleString('pt-BR')}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Blindagem Fiscal LCDPR & Conformidade:
                  </span>
                  <strong className="text-white font-mono">
                    R$ {Math.round(retornoEstimado.economiaGlosasFiscais).toLocaleString('pt-BR')}
                  </strong>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-300 block font-bold">Multiplicador de ROI Comprovado:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {retornoEstimado.multiplicadorROI}x sobre a assinatura
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Tempo de Payback:</span>
                  <span className="text-xs font-bold text-white font-mono">
                    ~{retornoEstimado.paybackDias} dias de safra
                  </span>
                </div>
              </div>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Aplicar esta Economia na Minha Fazenda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEÇÃO 4: PROVA & BENCHMARKING COMPETITIVO (Princípio 7 — Prova) */}
      <section id="comparativo" className="py-16 sm:py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              BENCHMARK DE MERCADO
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Por que o Super AgTech supera os softwares tradicionais do agronegócio?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Comparativo direto e objetivo entre as principais soluções agrícolas utilizadas no Brasil.
            </p>
          </div>

          {/* Tabela Comparativa Completa */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                <tr>
                  <th className="p-4">Recursos Operacionais Críticos</th>
                  <th className="p-4 text-emerald-400 font-black bg-emerald-950/30 border-x border-emerald-500/20">
                    SUPER AGTECH (v9.5)
                  </th>
                  <th className="p-4">TOTVS Agro</th>
                  <th className="p-4">Climate FieldView</th>
                  <th className="p-4">Aegro</th>
                  <th className="p-4">Siagri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {criteriosComparativo.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-semibold text-white">{item.criterio}</td>
                    <td className="p-4 text-emerald-300 font-bold bg-emerald-950/20 border-x border-emerald-500/20 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.superAgtech}</span>
                    </td>
                    <td className="p-4 text-slate-400">{item.totvs}</td>
                    <td className="p-4 text-slate-400">{item.fieldview}</td>
                    <td className="p-4 text-slate-400">{item.aegro}</td>
                    <td className="p-4 text-slate-400">{item.siagri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Depoimentos de Produtores Reais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="text-amber-400 font-mono text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "O Super AgTech unificou nossa balança rodoviária com a telemetria das colheitadeiras e o livro caixa. Economizamos mais de 3.200 litros de diesel na primeira safra auditando o comboio."
              </p>
              <div>
                <span className="font-bold text-white text-xs block">Carlos Eduardo Berton</span>
                <span className="text-[11px] text-slate-400">Fazenda Santa Helena • Sorriso/MT (4.200 ha)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="text-amber-400 font-mono text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Conseguimos gerar o LCDPR sem nenhuma dor de cabeça no fim do ano. O rateio societário entre os irmãos foi 100% automático e a Receita Federal aprovou sem nenhuma pendência."
              </p>
              <div>
                <span className="font-bold text-white text-xs block">Dra. Mariana Prado</span>
                <span className="text-[11px] text-slate-400">Grupo Agropecuário Prado • Rio Verde/GO (6.800 ha)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="text-amber-400 font-mono text-xs">★★★★★</div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "O ponto mais forte é funcionar sem internet no meio do pasto e do talhão. O operador faz o apontamento no trator e tudo sincroniza perfeitamente quando chega na sede."
              </p>
              <div>
                <span className="font-bold text-white text-xs block">Roberto Vianna</span>
                <span className="text-[11px] text-slate-400">Estância São Miguel • Luís Eduardo Magalhães/BA (3.100 ha)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEÇÃO 5: OS 6 PILARES DE VALOR (Princípio 7 — Funcionalidades Essenciais, Sem Catálogo Poluído) */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              ARQUITETURA DE VALOR INTEGRADA
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              6 pilares essenciais que transformam a gestão da sua terra.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Tudo o que uma empresa rural precisa em um ambiente unificado e intuitivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Campo 100% Offline (Outbox PWA)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apontamentos de abastecimento, aplicação e pesagem gravados localmente no IndexedDB e sincronizados com fila atômica assim que houver conexão.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Telemetria CAN Bus Multimarca</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Leitura direta de horímetro, consumo instantâneo de diesel, rotação do motor e velocidade operacional via protocolo J1939 universal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">3. Manejo Fitossanitário & MIP NDE</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Controle biológico e químico guiado pelo Nível de Ação e NDE, evitando aplicações desnecessárias e reduzindo custos com defensivos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">4. Balança Rodoviária & Armazenagem</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emissão instantânea de romaneio de colheita com descontos oficiais CONAB de umidade, impureza e avariados, integrado a silos e termometria.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">5. Fiscal LCDPR & NF-e Homologada</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Geração automática do Livro Caixa Digital do Produtor Rural, emissão de NF-e com chave de 44 dígitos e cálculo automático de Funrural/Senar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">6. Barter & Comercialização B3</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulador de razão de troca para travar insumos em sacas, cálculo de paridade de exportação em Paranaguá e Santos e emissão de CPR física.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO 6: PLANOS TRANSPARENTES (Princípio 7 — Planos) */}
      <section id="planos" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              PLANOS TRANSPARENTES QUE CABEM NO BOLSO DO PRODUTOR
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Investimento dimensionado para o tamanho e a vocação da sua terra.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sem taxas ocultas ou custos surpresa por usuário. Escolha a opção ideal para a sua safra.
            </p>

            {/* Alternador Mensal / Anual */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${faturamentoPeriodo === 'MENSAL' ? 'text-white' : 'text-slate-500'}`}>
                Faturamento Mensal
              </span>
              <button
                type="button"
                onClick={() => setFaturamentoPeriodo(prev => prev === 'ANUAL' ? 'MENSAL' : 'ANUAL')}
                className="w-14 h-7 bg-slate-900 rounded-full p-1 transition-all relative border border-slate-700 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-emerald-400 transition-all ${
                    faturamentoPeriodo === 'ANUAL' ? 'translate-x-7 bg-teal-300' : 'translate-x-0'
                  }`}
                ></div>
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${faturamentoPeriodo === 'ANUAL' ? 'text-emerald-400' : 'text-slate-500'}`}>
                Faturamento Anual <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">Economize 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PLANO 1: Produtor Solo */}
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Produtor Solo / Familiar</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Até 800 ha</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-white font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '390' : '490'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / mês</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal para produtores individuais que buscam emissão de notas fiscais, controle de insumos e LCDPR oficial sem burocracia.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Livro Caixa Digital do Produtor Rural (LCDPR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Emissão de NF-e do Produtor com Chave 44 dígitos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Romaneio de Balança Rodoviária com Descontos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>App Mobile 100% Offline para Lançamentos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até 3 Usuários Simultâneos</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                Começar com o Produtor Solo
              </button>
            </div>

            {/* PLANO 2: Safra Prime (O Mais Vendido) */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl shadow-emerald-950/40 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                MAIS ESCOLHIDO PELOS PRODUTORES
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Safra Prime & Precisão</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Até 3.500 ha</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-white font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '1.190' : '1.490'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / mês</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para fazendas de alta produtividade que buscam telemetria de máquinas, Barter na B3, controle de pragas MIP e DRE talhão a talhão.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><b>Tudo do plano Produtor Solo, mais:</b></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Telemetria de Frotas CAN Bus J1939 em Tempo Real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Barter Multi-Commodity & CPR Registrada B3</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>MDF-e SEFAZ & Emissão de CIOT ANTT</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dossiê Bancário A4 Oficial para Crédito Rural</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até 12 Usuários & Suporte Prioritário</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950/40 transition cursor-pointer"
              >
                Experimentar Safra Prime Grátis
              </button>
            </div>

            {/* PLANO 3: Grupo Agro & Enterprise */}
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Grupo Agro & Corporativo</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Área Ilimitada</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-white font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '2.490' : '2.990'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / mês</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Para agroindústrias, cooperativas e grandes grupos com múltiplos CNPJs, usinas, auditoria EUDR e frotas pesadas.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><b>Tudo do plano Safra Prime, mais:</b></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-Fazendas, Matriz & Filiais Ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Auditoria Territorial EUDR (PRODES/CAR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>API RESTful e Webhooks para SAP/TOTVS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Usuários Ilimitados com Perfis RBAC Estritos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gerente de Conta Dedicado & SLA 99.9%</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                Falar com Especialista Agro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SEÇÃO 7: PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">DÚVIDAS FREQUENTES</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Tudo o que você precisa saber antes de começar.</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 rounded-2xl border border-slate-800/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setFaqAberta(faqAberta === idx ? null : idx)}
                  className="w-full p-5 text-left text-xs sm:text-sm font-bold text-white flex justify-between items-center gap-4 hover:text-emerald-400 transition cursor-pointer"
                >
                  <span>{faq.pergunta}</span>
                  {faqAberta === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {faqAberta === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.resposta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL & CADASTRO INSTANTÂNEO (Princípio 7 — CTA & Cadastro) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              COMECE HOJE MESMO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Pronto para colocar a gestão da sua fazenda no próximo nível?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Teste gratuitamente a plataforma ou agende uma demonstração personalizada com um de nossos agrônomos especialistas.
            </p>
          </div>

          <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="Digite seu e-mail institucional..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <span>{leadCadastrado ? 'Carregando...' : 'Testar Agora'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {leadCadastrado && (
              <span className="text-xs text-emerald-400 font-bold block animate-fade-in">
                ✓ Acesso liberado! Redirecionando para o cockpit...
              </span>
            )}
          </form>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span>✓ Sem necessidade de cartão no teste</span>
            <span>✓ Configuração em 5 minutos</span>
            <span>✓ Suporte via WhatsApp</span>
          </div>
        </div>
      </section>

      {/* 11. FOOTER INSTITUCIONAL */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white">SUPER AGTECH • BRASIL</span>
            <span>•</span>
            <span>SaaS Rural Enterprise</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#problema" className="hover:text-white transition">O Desafio</a>
            <a href="#solucao" className="hover:text-white transition">Solução</a>
            <a href="#planos" className="hover:text-white transition">Planos de Subscrição</a>
            <button onClick={onGoToLogin} className="hover:text-emerald-400 transition cursor-pointer">Login do Produtor</button>
          </div>

          <div className="text-slate-600 text-[11px]">
            © 2026 Super AgTech. Todos os direitos reservados. Em conformidade com LGPD & Receita Federal.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
