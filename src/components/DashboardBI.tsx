import React from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  AlertCircle,
  Sprout,
  ArrowUpRight,
  ShieldCheck,
  Fuel,
  Users,
  Tractor,
  Sliders,
  ChevronRight,
  Sparkles,
  Droplet,
  Flame,
  Radio,
  Milk,
  Heart,
  Scale,
  Factory
} from 'lucide-react';
import { TALHOES_INICIAIS, TalhaoData } from '../data/mockAgroData';

interface DashboardBIProps {
  onSelectTalhao: (talhao: TalhaoData) => void;
  profileId?: string;
  onNavigate?: (moduleId: string) => void;
  onOpenModuleConfig?: () => void;
}

export const DashboardBI: React.FC<DashboardBIProps> = ({
  onSelectTalhao,
  profileId = 'AGRICULTURA_GRAOS',
  onNavigate,
  onOpenModuleConfig,
}) => {
  const totalAreaHa = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.areaHa, 0);
  const totalCustoABC = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.custoTotalABC, 0);
  const custoMedioHa = totalCustoABC / totalAreaHa;
  const breakEvenMedio =
    TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.breakEvenScHa, 0) / TALHOES_INICIAIS.length;

  const isPecuaria = profileId === 'PECUARIA_CORTE_LEITE';
  const isHF = profileId === 'HORTIFRUTI_FLORICULTURA';
  const isBioenergia = profileId === 'BIOENERGIA_SUCROALCOOLEIRO';
  const isMisto = profileId === 'AGROPECUARIA_MISTA';

  return (
    <div className="space-y-6">
      {/* Banner de Contexto Operacional Ativo */}
      <div className="bg-white border border-[#EAF4E7] p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4E7] border border-[#8FBF88] flex items-center justify-center text-xl shrink-0">
            {isPecuaria ? '🐂' : isHF ? '🍓' : isBioenergia ? '🎋' : isMisto ? '🚜' : '🌾'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#26332A]">
                Dashboard Executivo •{' '}
                {isPecuaria
                  ? 'Pecuária de Corte, Leite & Confinamento'
                  : isHF
                  ? 'Hortifrúti, HF & Cultivo Protegido'
                  : isBioenergia
                  ? 'Bioenergia, Usina Sucroalcooleira & RenovaBio'
                  : isMisto
                  ? 'Agropecuária Integrada (Grãos + Pecuária / ILPF)'
                  : 'Lavouras de Grãos & Commodities'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#EAF4E7] text-[#285943] border border-[#8FBF88]">
                Módulos Filtrados
              </span>
            </div>
            <p className="text-xs text-[#66736A]">
              {isPecuaria
                ? 'Indicadores zootécnicos, ganho de peso diário, termometria de cocho e rastreabilidade individual RFID.'
                : isHF
                ? 'Produtividade de hortaliças, controle de brix, condutividade elétrica da fertirrigação e estufas.'
                : isBioenergia
                ? 'Balanço de moenda, açúcar recuperável ATR, cogeração de bagaço e créditos RenovaBio CBIO.'
                : 'Custos baseados em atividades ABC, taxa variável VRA, balança e cotações de commodities em tempo real.'}
            </p>
          </div>
        </div>

        {onOpenModuleConfig && (
          <button
            onClick={onOpenModuleConfig}
            className="px-3 py-1.5 rounded-xl bg-[#F7F9F5] hover:bg-[#EAF4E7] text-[#26332A] hover:text-[#26332A] border border-[#EAF4E7] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap self-end sm:self-auto"
          >
            <Sliders className="w-3.5 h-3.5 text-[#285943]" />
            <span>Configurar Módulos da Conta</span>
          </button>
        )}
      </div>

      {/* 4 Cards de KPIs Principais Dinâmicos de Acordo com a Atividade */}
      {isPecuaria ? (
        /* KPIS DE PECUÁRIA */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Rebanho Total Ativo
                </span>
                <p className="text-2xl font-black text-[#26332A] mt-1">12.450 cab</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 100%
              </span>
              <span>Identificados com RFID ISO 11784</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Ganho Médio Diário (GMD)
                </span>
                <p className="text-2xl font-black text-[#285943] mt-1">
                  1.46 <span className="text-sm font-semibold text-[#66736A]">kg/dia</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E7] border border-[#8FBF88] flex items-center justify-center text-[#285943]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">Meta: 1.35 kg/dia</span>
              <span>(+8.1% vs planejado no cocho)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Custo por @ Produzida
                </span>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  R$ 164,80 <span className="text-sm font-semibold text-[#66736A]">/@</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">B3: R$ 242,00/@</span>
              <span>(Margem: +R$ 77,20/@ líquida)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Taxa de Lotação em Pasto
                </span>
                <p className="text-2xl font-black text-purple-400 mt-1">
                  2.6 <span className="text-sm font-semibold text-[#66736A]">UA/ha</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span>Mombaça + Piquetes Rotacionados</span>
            </div>
          </div>
        </div>
      ) : isHF ? (
        /* KPIS DE HORTIFRÚTI / HF */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Produtividade Comercial Média
                </span>
                <p className="text-2xl font-black text-[#26332A] mt-1">42.8 t/ha</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E7] border border-[#8FBF88] flex items-center justify-center text-[#285943]">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">94.2% Classe Extra A1</span>
              <span>(Menor descarte)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Teor de Açúcares (Grau Brix)
                </span>
                <p className="text-2xl font-black text-amber-400 mt-1">15.2 °Bx</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">Premium Gourmet</span>
              <span>(Padrão exportação)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Preço Médio Realizado
                </span>
                <p className="text-2xl font-black text-[#285943] mt-1">R$ 74,50 / cx</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">Margem Líquida: 46.8%</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Eficiência Fertirrigação
                </span>
                <p className="text-2xl font-black text-cyan-400 mt-1">CE 2.2 mS/cm</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Droplet className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span>pH 5.95 • Tanques A + B automáticos</span>
            </div>
          </div>
        </div>
      ) : isBioenergia ? (
        /* KPIS DE BIOENERGIA / CANA */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Moagem Acumulada Safra
                </span>
                <p className="text-2xl font-black text-[#26332A] mt-1">2.840.000 t</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Factory className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">Ritmo: 22.000 t/dia</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  ATR Médio Industrial
                </span>
                <p className="text-2xl font-black text-[#285943] mt-1">139.6 kg/t</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E7] border border-[#8FBF88] flex items-center justify-center text-[#285943]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span>Eficiência RTC: 97.6% Moenda/Difusor</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Créditos RenovaBio CBIO
                </span>
                <p className="text-2xl font-black text-teal-400 mt-1">94.500 CBIO</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">R$ 8,74M na B3</span>
              <span>(Biomassa 92% elegível)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Cogeração de Vapor & Energia
                </span>
                <p className="text-2xl font-black text-cyan-400 mt-1">67 bar / 48 MW</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Fuel className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span>Bagaço 100% aproveitado na caldeira</span>
            </div>
          </div>
        </div>
      ) : (
        /* KPIS DE GRÃOS & COMMODITIES (PADRÃO / GERAL) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Desembolso Acumulado
                </span>
                <p className="text-2xl font-black text-[#26332A] mt-1">
                  R$ {totalCustoABC.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 100%
              </span>
              <span>Apropriado nos talhões via ABC</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Custo Real Médio / Hectare
                </span>
                <p className="text-2xl font-black text-[#285943] mt-1">
                  R$ {custoMedioHa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E7] border border-[#8FBF88] flex items-center justify-center text-[#285943]">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span>Insumos + Máquinas + Mão de Obra</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Ponto de Equilíbrio (Break-Even)
                </span>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  {breakEvenMedio.toFixed(1)} <span className="text-sm font-semibold text-[#66736A]">sc/ha</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span className="text-[#285943] font-bold">Meta: 68 sc/ha</span>
              <span>(Margem Segurança: 50.7%)</span>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-[#66736A] uppercase tracking-wider">
                  Área Total Monitorada
                </span>
                <p className="text-2xl font-black text-[#26332A] mt-1">
                  {totalAreaHa.toLocaleString('pt-BR')} <span className="text-sm font-semibold text-[#66736A]">ha</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#66736A]">
              <span>6 Talhões Ativos com PostGIS</span>
            </div>
          </div>
        </div>
      )}

      {/* Composição Real de Custos (Custeio ABC Adaptativo) */}
      <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#26332A] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#285943]" />{' '}
              {isPecuaria
                ? 'Composição de Custos da Pecuária (Nutrição, Frotas & Sanidade)'
                : isHF
                ? 'Composição de Custos de Hortifrúti (Fertirrigação & Colheita)'
                : isBioenergia
                ? 'Composição de Custos Sucroalcooleiros (CCT & Agrícola)'
                : 'Composição Real de Custo Agrícola (Custeio ABC)'}
            </h3>
            <p className="text-xs text-[#66736A] mt-0.5">
              Superando planilhas fragmentadas com rateio matemático real
            </p>
          </div>
          <span className="text-xs font-mono bg-emerald-950 text-[#285943] border border-emerald-800 px-3 py-1 rounded-full font-bold">
            Metodologia Baseada em Atividades
          </span>
        </div>

        {/* Barra de Progresso Visual Segmentada */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#F7F9F5] mb-4 border border-[#EAF4E7]">
          {isPecuaria ? (
            <>
              <div className="bg-emerald-500 h-full w-[61%]" title="Nutrição & Cocho (61%)"></div>
              <div className="bg-amber-500 h-full w-[18%]" title="Tratores & Distribuição (18%)"></div>
              <div className="bg-purple-500 h-full w-[12%]" title="Sanidade & Brincos RFID (12%)"></div>
              <div className="bg-blue-500 h-full w-[9%]" title="Campeiros & Gestão (9%)"></div>
            </>
          ) : (
            <>
              <div className="bg-emerald-500 h-full w-[66%]" title="Insumos (66%)"></div>
              <div className="bg-amber-500 h-full w-[23%]" title="Máquinas e Combustível (23%)"></div>
              <div className="bg-blue-500 h-full w-[11%]" title="Mão de Obra Operadores (11%)"></div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isPecuaria ? (
            <>
              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex items-center justify-between text-xs text-[#66736A] mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-[#285943]">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Nutrição & Ração (61%)
                  </span>
                  <span className="font-mono">R$ 100,50 / @</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Silagem de milho, farelo de soja, DDG de milho e núcleo mineral com monensina sódica.
                </p>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex items-center justify-between text-xs text-[#66736A] mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Misturadores & Diesel (18%)
                  </span>
                  <span className="font-mono">R$ 29,66 / @</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Tratores comboio de distribuição, vagão forrageiro desensilador e pás carregadeiras.
                </p>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex items-center justify-between text-xs text-[#66736A] mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-purple-400">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span> Sanidade & SISBOV (21%)
                  </span>
                  <span className="font-mono">R$ 34,64 / @</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Vacinas clostridioses, vermífugos, brincos eletrônicos RFID UHF e mão de obra de curral.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex items-center justify-between text-xs text-[#66736A] mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-[#285943]">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Insumos Agrícolas (66%)
                  </span>
                  <span className="font-mono">R$ 1.048,00 / ha</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Sementes tratadas, fungicidas, inseticidas, fertilizantes foliares e adjuvantes.
                </p>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex items-center justify-between text-xs text-[#66736A] mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Máquinas & Diesel (23%)
                  </span>
                  <span className="font-mono">R$ 365,20 / ha</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Horímetro trabalhado, consumo de diesel S10, taxa de depreciação e manutenção preventiva.
                </p>
              </div>

              <div className="bg-[#F7F9F5] p-4 rounded-xl border border-[#EAF4E7]">
                <div className="flex items-center justify-between text-xs text-[#66736A] mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-blue-400">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Mão de Obra (11%)
                  </span>
                  <span className="font-mono">R$ 174,70 / ha</span>
                </div>
                <p className="text-xs text-[#66736A]">
                  Horas-homem de tratoristas, aplicadores técnicos e encargos trabalhistas rurais.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Atalhos Rápidos Operacionais para Módulos Específicos */}
      {onNavigate && (
        <div className="bg-white border border-[#EAF4E7] p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#66736A] font-bold uppercase text-[10px] tracking-wider">
            Atalhos Diretos da Atividade:
          </span>
          <div className="flex flex-wrap gap-2">
            {isPecuaria ? (
              <>
                <button
                  onClick={() => onNavigate('ZOOTECNIA')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🐂 Manejo Zootécnico</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('CONFINAMENTO')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🥩 Confinamento & Cocho</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('BOVINOCULTURA_SISBOV_RFID')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>📡 SISBOV RFID Cota Hilton</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('SILAGEM_FORRAGEM')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌾 Silagem & Forragem</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
              </>
            ) : isHF ? (
              <>
                <button
                  onClick={() => onNavigate('OLERICULTURA_HF')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🥬 Olericultura & HF</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('FERTIRRIGACAO_INJECAO_MULTICANAL')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>💧 Fertirrigação CE/pH</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('CULTIVO_PROTEGIDO_HIDROPONIA')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌿 Estufas Hidropônicas</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
              </>
            ) : isBioenergia ? (
              <>
                <button
                  onClick={() => onNavigate('CANA_DE_ACUCAR_ATR')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🎋 Cana ATR & Sacarose</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('RENOVABIO_CALCULADORA_CBIO')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌱 Calculadora CBIO RenovaBio</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('MOENDA_DIFUSOR_CANA_EXTRACAO')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>⚙️ Moenda & Difusores</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('PRECISAO')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌱 Taxa Variável VRA</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('MIP')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🐛 Manejo MIP & NDE</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('SILOS')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🏭 Silos & Armazenagem</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
                <button
                  onClick={() => onNavigate('BARTER')}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F9F5] hover:bg-[#F7F9F5] border border-[#EAF4E7] text-slate-200 font-bold hover:text-[#26332A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🤝 Comercialização Barter</span>
                  <ChevronRight className="w-3 h-3 text-[#66736A]" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tabela de Performance por Talhão / Lote de Produção */}
      <div className="bg-white border border-[#EAF4E7] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-[#EAF4E7] flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-[#26332A]">
              {isPecuaria
                ? 'Consolidação de Desempenho por Lote de Pasto & Curral de Confinamento'
                : 'Consolidação Econômica e Fitossanitária por Talhão'}
            </h3>
            <p className="text-xs text-[#66736A]">
              {isPecuaria
                ? 'Rastreabilidade individual, ganho médio e custo por arroba por subdivisão'
                : 'Clique em qualquer talhão para inspecionar a geometria no SIG'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#26332A]">
            <thead className="bg-[#F7F9F5] text-[#66736A] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">
                  {isPecuaria ? 'Lote / Subdivisão' : 'Código / Nome'}
                </th>
                <th className="px-4 py-3 text-right">
                  {isPecuaria ? 'Cabeças' : 'Área (ha)'}
                </th>
                <th className="px-4 py-3">
                  {isPecuaria ? 'Raça / Categoria' : 'Cultura / Variedade'}
                </th>
                <th className="px-4 py-3 text-right">
                  {isPecuaria ? 'GMD Médio' : 'Custo Total ABC'}
                </th>
                <th className="px-4 py-3 text-right text-[#285943]">
                  {isPecuaria ? 'Custo / @' : 'Custo / ha'}
                </th>
                <th className="px-4 py-3 text-right text-amber-400 font-bold">
                  {isPecuaria ? 'SISBOV / Destino' : 'Break-Even (sc/ha)'}
                </th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isPecuaria ? (
                <>
                  <tr className="hover:bg-[#F7F9F5]/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#26332A]">Curral A1 - Confinamento</span>
                      <span className="text-[10px] text-[#66736A] block">Terminação 90 Dias</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#26332A]">450 cab</td>
                    <td className="px-4 py-3 text-[#26332A]">Nelore Machos Inteiros</td>
                    <td className="px-4 py-3 text-right font-mono text-[#285943] font-bold">1.58 kg/dia</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#285943]">R$ 162,40/@</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">100% Cota Hilton</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-[#285943] border border-emerald-800">
                        ABATE EM 18 DIAS
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigate && onNavigate('CONFINAMENTO')}
                        className="px-2.5 py-1 bg-[#F7F9F5] hover:bg-[#EAF4E7] text-slate-200 rounded text-[10px] font-bold border border-[#EAF4E7] cursor-pointer"
                      >
                        Ver Cocho
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F7F9F5]/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#26332A]">Curral A2 - Confinamento</span>
                      <span className="text-[10px] text-[#66736A] block">Cruza Industrial Angus</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#26332A]">380 cab</td>
                    <td className="px-4 py-3 text-[#26332A]">F1 Angus x Nelore</td>
                    <td className="px-4 py-3 text-right font-mono text-[#285943] font-bold">1.64 kg/dia</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#285943]">R$ 168,90/@</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">Carnes Nobres Gourmet</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-[#285943] border border-emerald-800">
                        EM TERMINAÇÃO
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigate && onNavigate('CONFINAMENTO')}
                        className="px-2.5 py-1 bg-[#F7F9F5] hover:bg-[#EAF4E7] text-slate-200 rounded text-[10px] font-bold border border-[#EAF4E7] cursor-pointer"
                      >
                        Ver Cocho
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F7F9F5]/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#26332A]">Pasto Rotacionado P04</span>
                      <span className="text-[10px] text-[#66736A] block">Mombaça Irrigado</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#26332A]">620 cab</td>
                    <td className="px-4 py-3 text-[#26332A]">Novilhas Nelore Recria</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">0.82 kg/dia</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#285943]">R$ 138,50/@</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">Reposição Fazenda</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                        PASTEJO ATIVO
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigate && onNavigate('ZOOTECNIA')}
                        className="px-2.5 py-1 bg-[#F7F9F5] hover:bg-[#EAF4E7] text-slate-200 rounded text-[10px] font-bold border border-[#EAF4E7] cursor-pointer"
                      >
                        Ver Manejo
                      </button>
                    </td>
                  </tr>
                </>
              ) : (
                TALHOES_INICIAIS.map((talhao) => {
                  const custoPorHa = talhao.custoTotalABC / talhao.areaHa;
                  return (
                    <tr
                      key={talhao.id}
                      className="hover:bg-[#F7F9F5]/60 cursor-pointer transition-colors"
                      onClick={() => onSelectTalhao(talhao)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#26332A]">{talhao.codigo}</span>
                        <span className="text-[10px] text-[#66736A] block">{talhao.nome}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-200">
                        {talhao.areaHa.toFixed(1)} ha
                      </td>
                      <td className="px-4 py-3 text-[#26332A] font-medium">{talhao.cultura}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-200">
                        R$ {talhao.custoTotalABC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#285943]">
                        R$ {custoPorHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-amber-400">
                        {talhao.breakEvenScHa.toFixed(1)} sc/ha
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            talhao.status === 'PULVERIZADO'
                              ? 'bg-emerald-950 text-[#285943] border border-emerald-800'
                              : talhao.status === 'PLANTADO'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : talhao.status === 'PREPARO'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-purple-950 text-purple-400 border border-purple-800'
                          }`}
                        >
                          {talhao.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTalhao(talhao);
                          }}
                          className="px-2.5 py-1 bg-[#F7F9F5] hover:bg-[#EAF4E7] text-slate-200 rounded text-[10px] font-bold border border-[#EAF4E7] cursor-pointer"
                        >
                          Ver no SIG
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
