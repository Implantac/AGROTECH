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
  Award,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  Compass,
  Star,
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
  RotateCcw
} from 'lucide-react';

interface PublicLandingPageProps {
  onGoToLogin: () => void;
  onEnterPlatformDirectly: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGoToLogin,
  onEnterPlatformDirectly,
}) => {
  // Estado dos Planos & Perfil do Cliente
  const [faturamentoPeriodo, setFaturamentoPeriodo] = useState<'ANUAL' | 'MENSAL'>('ANUAL');
  const [perfilProdutor, setPerfilProdutor] = useState<'GRAOS' | 'PECUARIA' | 'MISTO' | 'CANA_USINAS'>('GRAOS');
  
  // Calculadora Interativa de ROI
  const [areaHaCalculadora, setAreaHaCalculadora] = useState<number>(1800);
  const [culturaCalculadora, setCulturaCalculadora] = useState<'SOJA_MILHO' | 'ALGODAO' | 'CAFE' | 'PECUARIA'>('SOJA_MILHO');

  // FAQs Accordion
  const [faqAberta, setFaqAberta] = useState<number | null>(0);

  // Cálculos dinâmicos de ROI
  const retornoEstimado = useMemo(() => {
    let sacasGanhasHa = 2.4;
    let precoSaca = 132.0;
    let economiaDieselPorHa = 48.50;
    let economiaAduboPorHa = 74.0;

    if (culturaCalculadora === 'ALGODAO') {
      sacasGanhasHa = 4.2;
      precoSaca = 185.0;
      economiaDieselPorHa = 92.0;
      economiaAduboPorHa = 145.0;
    } else if (culturaCalculadora === 'CAFE') {
      sacasGanhasHa = 3.1;
      precoSaca = 1200.0 / 60; // saca café
      economiaDieselPorHa = 38.0;
      economiaAduboPorHa = 110.0;
    } else if (culturaCalculadora === 'PECUARIA') {
      sacasGanhasHa = 1.8; // @ ganhas
      precoSaca = 245.0; // @ boi
      economiaDieselPorHa = 22.0;
      economiaAduboPorHa = 45.0;
    }

    const ganhoProdutividadeTotal = areaHaCalculadora * sacasGanhasHa * precoSaca;
    const economiaInsumosTotal = areaHaCalculadora * (economiaDieselPorHa + economiaAduboPorHa);
    const economiaGlosasFiscais = Math.min(280000, areaHaCalculadora * 32.0);
    const retornoTotalAnual = ganhoProdutividadeTotal + economiaInsumosTotal + economiaGlosasFiscais;

    return {
      ganhoProdutividadeTotal,
      economiaInsumosTotal,
      economiaGlosasFiscais,
      retornoTotalAnual,
      paybackDias: Math.max(14, Math.round(365 / (retornoTotalAnual / 18500)))
    };
  }, [areaHaCalculadora, culturaCalculadora]);

  // Comparativo com Concorrentes
  const criteriosComparativo = [
    {
      criterio: 'Telemetria Multimarcas (John Deere, Case, New Holland, Jacto)',
      superAgtech: 'Nativa (CAN Bus J1939 + ISOBUS)',
      totvs: 'Apenas integrações caras de terceiros',
      fieldview: 'Foco apenas em mapas próprios',
      aegro: 'Apenas horímetro manual',
    },
    {
      criterio: 'Balança Rodoviária 80t com Descontos Oficiais CONAB',
      superAgtech: 'Integrada com captura de peso e romaneio',
      totvs: 'Requer módulo adicional pesado',
      fieldview: 'Não possui módulo de balança',
      aegro: 'Não possui cálculo de umidade/impureza CONAB',
    },
    {
      criterio: 'Fiscal Rural Completo (LCDPR, SEFAZ NF-e 44 dígitos, MDF-e, CIOT)',
      superAgtech: '100% Automático e Auditado',
      totvs: 'Complexo, voltado a contadores',
      fieldview: 'Zero suporte fiscal brasileiro',
      aegro: 'Básico (Sem MDF-e e sem CIOT ANTT)',
    },
    {
      criterio: 'Barter Digital, CPR-Física e Registro B3',
      superAgtech: 'Simulador de Razão de Troca + CPR',
      totvs: 'Módulo de tesouraria legado',
      fieldview: 'Inexistente',
      aegro: 'Inexistente',
    },
    {
      criterio: 'Pecuária Intensiva (SISBOV RFID 134.2 kHz + e-GTA INDEA/MAPA)',
      superAgtech: 'Completo com rastreabilidade Hilton',
      totvs: 'Requer ERP Pecuária separado',
      fieldview: 'Inexistente (Apenas agricultura)',
      aegro: 'Inexistente',
    },
    {
      criterio: 'Operação 100% Offline no Campo (PWA + Fila RabbitMQ)',
      superAgtech: 'Totalmente funcional sem internet',
      totvs: 'Requer conexão ou app secundário',
      fieldview: 'App móvel parcial',
      aegro: 'App parcial com sincronismo lento',
    },
    {
      criterio: 'Arquitetura Modular (135 Módulos sob medida)',
      superAgtech: 'Ativação modular por cultura e perfil',
      totvs: 'Pacote monolítico engessado',
      fieldview: 'Limitado a grãos',
      aegro: 'Fixo (Tamanho único)',
    },
    {
      criterio: 'Custo Total de Implantação e Mensalidade (TCO)',
      superAgtech: 'Acessível, sem taxa de setup abusiva',
      totvs: 'R$ 50k a R$ 200k de implantação',
      fieldview: 'Cobrança por hectare em dólar',
      aegro: 'Médio / Elevado para multifazendas',
    },
  ];

  const faqs = [
    {
      pergunta: 'O Super AgTech funciona mesmo sem sinal de internet no meio do talhão?',
      resposta: 'Sim! Toda a arquitetura foi desenvolvida como Progressive Web App (PWA) Offline-First. Você pode lançar abastecimentos de comboio, pesagens na balança, aplicações de defensivos, monitoramento de pragas MIP e romaneios diretamente do smartphone ou tablet. Assim que o aparelho reencontra conexão Wi-Fi ou 4G, a fila atômica local sincroniza os pacotes via RabbitMQ com garantia ACID.'
    },
    {
      pergunta: 'Como funciona a integração com as máquinas da minha frota (John Deere, Case IH, etc.)?',
      resposta: 'Nossa plataforma possui o OEM Telematics Gateway e receptores de barramento CAN Bus J1939 / ISOBUS. Conectamos via API direta na nuvem dos fabricantes (John Deere Operations Center, AFS Connect, MyPLM Connect, Climate FieldView) ou via telemetria edge instalada diretamente no trator, colheitadeira ou pulverizador.'
    },
    {
      pergunta: 'O módulo fiscal atende às exigências da Receita Federal e da SEFAZ para o LCDPR?',
      resposta: 'Atende rigorosamente ao leiaute oficial do Livro Caixa Digital do Produtor Rural (LCDPR), com apuração automática de receitas e despesas por talhão, rateio de condomínios rurais familiares conforme o percentual de cada titular, cálculo de Funrural/Senar, e emissor com validador oficial de chave de acesso de 44 dígitos com Módulo 11.'
    },
    {
      pergunta: 'Posso contratar apenas os módulos que a minha fazenda utiliza?',
      resposta: 'Sim! Nosso Gerenciador de Subscrição Inteligente molda o sistema ao seu perfil. Se você é um pecuarista de corte, a plataforma desliga automaticamente módulos de colheita de grãos e foca em SISBOV, e-GTA, manejo de pastagens e confinamento. Se produz café especial ou cana-de-açúcar, módulos de moenda, ATR e terreiros suspensos são ativados.'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Barra de Topo Institucional */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-500 to-teal-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Tractor className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">SUPER AGTECH</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  ENTERPRISE v9.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Farm Intelligence, Telemetria & ERP Rural Integrado</p>
            </div>
          </div>

          {/* Links de Navegação */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#recursos" className="hover:text-amber-400 transition">Recursos</a>
            <a href="#comparativo" className="hover:text-amber-400 transition">Comparativo</a>
            <a href="#calculadora" className="hover:text-amber-400 transition">Calculadora ROI</a>
            <a href="#planos" className="hover:text-amber-400 transition">Planos & Preços</a>
            <a href="#depoimentos" className="hover:text-amber-400 transition">Casos de Sucesso</a>
            <a href="#faq" className="hover:text-amber-400 transition">FAQ</a>
          </nav>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition border border-slate-700/80 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Entrar
            </button>
            <button
              onClick={onEnterPlatformDirectly}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <span>Acessar Demo Ao Vivo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION DE ALTO IMPACTO */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        {/* Elementos Gráficos de Fundo (Campos & Satélites) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="agro-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="rgba(16, 185, 129, 0.4)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#agro-grid)" />
          </svg>
        </div>

        {/* Brilhos Atmosféricos (Dourado de Safra + Esmeralda de Vegetação) */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/20 via-emerald-500/15 to-transparent blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Promocional */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                A Plataforma Rural Mais Completa da América Latina
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            {/* Headline Matadora */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              A Inteligência Rural que <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Multiplica a Produtividade</span> e Blinda a sua Margem.
            </h1>

            {/* Subheadline Persuasiva */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              O único ecossistema agropecuário brasileiro que integra <b>Telemetria Multimarcas em Tempo Real</b>, <b>Agronomia Preditiva FAO-56</b>, <b>Balança Rodoviária com Descontos CONAB</b>, <b>Fiscal LCDPR/SEFAZ</b> e <b>Barter na B3</b> em uma experiência <b>100% Offline-First</b>.
            </p>

            {/* CTAs Principais */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onEnterPlatformDirectly}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Tractor className="w-5 h-5 text-slate-950" />
                <span>Explorar Plataforma Completa (135 Módulos)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToLogin}
                className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm border border-slate-700 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Área do Produtor • Fazer Login</span>
              </button>
            </div>

            {/* Selos de Confiança */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Homologado Receita Federal & SEFAZ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Descontos Oficiais CONAB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Rastreabilidade SISBOV / MAPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Compatível com Certificado Digital A1</span>
              </div>
            </div>
          </div>

          {/* Mockup Interativo Flutuante do Sistema */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-slate-700/80 bg-slate-900/90 p-3 sm:p-5 shadow-2xl shadow-black/80 backdrop-blur-xl">
            {/* Barra da Janela */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="font-mono text-[11px] text-slate-400 ml-2">app.superagtech.com.br • Fazenda Santa Helena</span>
              </div>
              <span className="font-bold text-amber-400 font-mono text-[11px]">Sincronização em Tempo Real via RabbitMQ</span>
            </div>

            {/* Painel Interno Prévia */}
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Balança Rodoviária 80t</span>
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">37.445 kg <span className="text-xs font-normal text-emerald-400">(624.1 sc)</span></p>
                <div className="text-[11px] text-slate-400">
                  Ticket #09418 • Descontos CONAB apurados automaticamente
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Psicrometria & Janela Delta T</span>
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-cyan-400 font-mono">4.8°C <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">IDEAL</span></p>
                <div className="text-[11px] text-slate-400">
                  Condições de pulverização liberadas sem deriva nem evaporação
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">LCDPR & DRE por Talhão</span>
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-emerald-400 font-mono">R$ 58,62 <span className="text-xs font-normal text-slate-400">/ sc líquida</span></p>
                <div className="text-[11px] text-slate-400">
                  Rateio automático entre 3 condôminos familiares registrado
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: COMPARATIVO COM OS GIGANTES DO MERCADO */}
      <section id="comparativo" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              ANÁLISE COMPARATIVA IMPLACÁVEL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Por que o Super AgTech supera os softwares tradicionais do mercado?
            </h2>
            <p className="text-sm text-slate-400">
              Comparamos nossa plataforma lado a lado com as maiores ferramentas do agronegócio (TOTVS Agro, Climate FieldView, Aegro e Siagri).
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-300 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4 font-bold text-white w-1/4">Recursos Críticos de Safra</th>
                  <th className="p-4 font-black text-amber-400 bg-amber-500/10 border-x border-amber-500/20">
                    SUPER AGTECH (v9.5)
                  </th>
                  <th className="p-4 text-slate-400">TOTVS Agro</th>
                  <th className="p-4 text-slate-400">Climate FieldView</th>
                  <th className="p-4 text-slate-400">Aegro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {criteriosComparativo.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-semibold text-white">{item.criterio}</td>
                    <td className="p-4 font-bold text-emerald-400 bg-amber-500/5 border-x border-amber-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.superAgtech}</span>
                    </td>
                    <td className="p-4 text-slate-400">{item.totvs}</td>
                    <td className="p-4 text-slate-400">{item.fieldview}</td>
                    <td className="p-4 text-slate-400">{item.aegro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: CALCULADORA INTERATIVA DE ROI */}
      <section id="calculadora" className="py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                SIMULADOR DE ECONOMIA REAL NA FAZENDA
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Calcule o retorno sobre o investimento para a sua área cultivada.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Nossos clientes recuperam 100% do valor da assinatura anual em menos de 30 dias de operação, através da redução do consumo de diesel, eliminação de sobreposição de defensivos e auditoria fiscal contínua.
              </p>

              {/* Sliders da Calculadora */}
              <div className="space-y-4 pt-2">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Área Cultivada da Propriedade</span>
                    <span className="text-amber-400 font-bold font-mono text-base">{areaHaCalculadora.toLocaleString('pt-BR')} hectares</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="15000"
                    step="100"
                    value={areaHaCalculadora}
                    onChange={(e) => setAreaHaCalculadora(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>200 ha</span>
                    <span>5.000 ha</span>
                    <span>15.000 ha</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-medium block">Atividade Agrícola Predominante:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'SOJA_MILHO', label: 'Soja / Milho' },
                      { id: 'ALGODAO', label: 'Algodão' },
                      { id: 'CAFE', label: 'Café Especial' },
                      { id: 'PECUARIA', label: 'Pecuária Corte' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCulturaCalculadora(c.id as any)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                          culturaCalculadora === c.id
                            ? 'bg-amber-500 text-slate-950 font-black shadow'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
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
            <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  ECONOMIA & GANHO LÍQUIDO ESTIMADO POR SAFRA
                </span>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 font-mono">
                  R$ {retornoEstimado.retornoTotalAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Payback do investimento na plataforma em aproximadamente <b>{retornoEstimado.paybackDias} dias</b>.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Ganho de Produtividade (+2.4 sc/ha com MIP e VRA):</span>
                  <span className="font-mono font-bold text-white">
                    R$ {retornoEstimado.ganhoProdutividadeTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Economia em Diesel (-18%) e Adubo Taxa Variável:</span>
                  <span className="font-mono font-bold text-cyan-400">
                    R$ {retornoEstimado.economiaInsumosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Prevenção de Glosas e Multas Fiscais (LCDPR/SEFAZ):</span>
                  <span className="font-mono font-bold text-amber-400">
                    R$ {retornoEstimado.economiaGlosasFiscais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full py-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Garantir Essa Economia na Próxima Safra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PLANOS QUE SE MOLDAM AO PERFIL DO CLIENTE */}
      <section id="planos" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              PLANOS TRANSPARENTES QUE CABEM NO BOLSO DO PRODUTOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Investimento dimensionado para o tamanho e a vocação da sua terra.
            </h2>
            <p className="text-sm text-slate-400">
              Sem taxas escondidas. Ative apenas os módulos que você usa ou contrate a suíte completa com desconto anual.
            </p>

            {/* Alternador Mensal / Anual */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${faturamentoPeriodo === 'MENSAL' ? 'text-white' : 'text-slate-500'}`}>
                Faturamento Mensal
              </span>
              <button
                onClick={() => setFaturamentoPeriodo(prev => prev === 'ANUAL' ? 'MENSAL' : 'ANUAL')}
                className="w-14 h-7 bg-slate-800 rounded-full p-1 transition-all relative border border-slate-700"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-amber-400 transition-all ${
                    faturamentoPeriodo === 'ANUAL' ? 'translate-x-7 bg-emerald-400' : 'translate-x-0'
                  }`}
                ></div>
              </button>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${faturamentoPeriodo === 'ANUAL' ? 'text-emerald-400' : 'text-slate-500'}`}>
                Faturamento Anual <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">Economize 20%</span>
              </span>
            </div>
          </div>

          {/* Cards dos 3 Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PLANO 1: Produtor Solo */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Produtor Solo / Familiar</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Até 600 ha</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '490' : '590'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / mês</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal para agricultores familiares e médios produtores que precisam de gestão financeira, fiscal e romaneios sem complicações.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Livro Caixa Digital (LCDPR) & Rateio Familiar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Balança Rodoviária com Descontos CONAB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Operação 100% Offline PWA no Celular</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Agrometeorologia & Janela Delta T</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até 3 Usuários Simultâneos</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGoToLogin}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
              >
                Começar com o Produtor Solo
              </button>
            </div>

            {/* PLANO 2: Safra Prime (O Mais Vendido) */}
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/80 p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl shadow-amber-500/20 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                MAIS ESCOLHIDO PELOS PRODUTORES
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase">Safra Prime & Precisão</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Até 3.500 ha</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
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
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Telemetria de Frotas CAN Bus J1939 em Tempo Real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Barter Multi-Commodity & CPR Registrada B3</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>MDF-e SEFAZ & Emissão de CIOT ANTT</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Dossiê Bancário A4 Oficial para Crédito Rural</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Até 12 Usuários & Suporte WhatsApp Prioritário</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterPlatformDirectly}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                Experimentar Safra Prime Grátis
              </button>
            </div>

            {/* PLANO 3: Grupo Agro & Enterprise */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Grupo Agro & Corporativo</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Área Ilimitada</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    R$ {faturamentoPeriodo === 'ANUAL' ? '2.490' : '2.990'}
                  </span>
                  <span className="text-xs text-slate-400 font-normal"> / mês</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Para grupos agrícolas, usinas de etanol, cooperativas, algodoeiras e pecuária intensiva com múltiplos CNPJs.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><b>Todos os 135 Módulos Habilitados</b></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multifazendas & Consolidação Contábil Holding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pecuária SISBOV RFID Individual & e-GTA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Termometria de Silos & Aeração Automatizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>API RESTful Aberta para Integração com SAP/Totvs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Gerente de Contas Dedicado & SLA 99.9%</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGoToLogin}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
              >
                Falar com Especialista Agro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: CASOS DE SUCESSO & DEPOIMENTOS */}
      <section id="depoimentos" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              QUEM USA, RECOMENDA NO COCKPIT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Histórias reais de quem transformou hectares em rentabilidade.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "O Super AgTech substituiu três ferramentas antigas que não conversavam entre si. Agora nosso tratorista faz o apontamento no celular sem internet e quando chega na sede o LCDPR e a DRE já estão prontos."
              </p>
              <div className="border-t border-slate-800 pt-3">
                <span className="font-bold text-white text-xs block">Carlos Eduardo Berton</span>
                <span className="text-[11px] text-slate-400">Fazenda Primavera • 4.200 ha (Sorriso/MT)</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "A balança rodoviária com cálculo oficial CONAB economizou mais de R$ 80.000 em descontos indevidos na última colheita de milho safrinha. O romaneio sai impresso na hora sem divergências."
              </p>
              <div className="border-t border-slate-800 pt-3">
                <span className="font-bold text-white text-xs block">Mariana Siqueira Faria</span>
                <span className="text-[11px] text-slate-400">Agropecuária Rio Verde • 6.800 ha (Rio Verde/GO)</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Conseguimos o custeio do Plano Safra no Banco do Brasil em apenas 48 horas porque o Dossiê Bancário A4 saiu completo com CAR, EUDR e fluxo de caixa auditado."
              </p>
              <div className="border-t border-slate-800 pt-3">
                <span className="font-bold text-white text-xs block">Eng. Roberto Brandão</span>
                <span className="text-[11px] text-slate-400">Grupo Agrícola Aliança • 12.000 ha (Luís Eduardo Magalhães/BA)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">DÚVIDAS FREQUENTES</span>
            <h2 className="text-3xl font-black text-white">Tudo o que você precisa saber antes de começar.</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setFaqAberta(faqAberta === idx ? null : idx)}
                  className="w-full p-5 text-left text-sm font-bold text-white flex justify-between items-center gap-4 hover:text-amber-400 transition cursor-pointer"
                >
                  <span>{faq.pergunta}</span>
                  {faqAberta === idx ? (
                    <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
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

      {/* FOOTER CORPORATIVO */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Tractor className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white">SUPER AGTECH • BRASIL</span>
              <p className="text-[11px] text-slate-500">Tecnologia Agropecuária de Precisão & ERP Rural Enterprise</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <a href="#recursos" className="hover:text-white transition">Recursos</a>
            <a href="#planos" className="hover:text-white transition">Planos de Subscrição</a>
            <a href="#comparativo" className="hover:text-white transition">TOTVS vs Aegro vs AgTech</a>
            <button onClick={onGoToLogin} className="hover:text-amber-400 transition cursor-pointer">Login do Produtor</button>
            <button onClick={onEnterPlatformDirectly} className="hover:text-emerald-400 transition cursor-pointer">Demo Interativa</button>
          </div>

          <p className="text-[11px] text-slate-500">
            © 2026 Super AgTech. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
