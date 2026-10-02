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
      {/* 4 Cards de KPIs Principais Dinâmicos de Acordo com a Atividade */}
      {isPecuaria ? (
        /* KPIS DE PECUÁRIA */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Rebanho Total Ativo
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">12.450 cab</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 100%
              </span>
              <span>Identificados com RFID ISO 11784</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Ganho Médio Diário (GMD)
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  1.46 <span className="text-sm font-semibold text-slate-600">kg/dia</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">Meta: 1.35 kg/dia</span>
              <span>(+8.1% vs planejado no cocho)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Custo por @ Produzida
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  R$ 164,80 <span className="text-sm font-semibold text-slate-600">/@</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">B3: R$ 242,00/@</span>
              <span>(Margem: +R$ 77,20/@ líquida)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Taxa de Lotação em Pasto
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  2.6 <span className="text-sm font-semibold text-slate-600">UA/ha</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span>Mombaça + Piquetes Rotacionados</span>
            </div>
          </div>
        </div>
      ) : isHF ? (
        /* KPIS DE HORTIFRÚTI / HF */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Produtividade Comercial Média
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">42.8 t/ha</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">94.2% Classe Extra A1</span>
              <span>(Menor descarte)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Teor de Açúcares (Grau Brix)
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">15.2 °Bx</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">Premium Gourmet</span>
              <span>(Padrão exportação)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Preço Médio Realizado
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">R$ 74,50 / cx</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">Margem Líquida: 46.8%</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Eficiência Fertirrigação
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">CE 2.2 mS/cm</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Droplet className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span>pH 5.95 • Tanques A + B automáticos</span>
            </div>
          </div>
        </div>
      ) : isBioenergia ? (
        /* KPIS DE BIOENERGIA / CANA */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Moagem Acumulada Safra
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">2.840.000 t</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Factory className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">Ritmo: 22.000 t/dia</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  ATR Médio Industrial
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">139.6 kg/t</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span>Eficiência RTC: 97.6% Moenda/Difusor</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Créditos RenovaBio CBIO
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">94.500 CBIO</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">R$ 8,74M na B3</span>
              <span>(Biomassa 92% elegível)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Cogeração de Vapor & Energia
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">67 bar / 48 MW</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <Fuel className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span>Bagaço 100% aproveitado na caldeira</span>
            </div>
          </div>
        </div>
      ) : (
        /* KPIS DE GRÃOS & COMMODITIES (PADRÃO / GERAL) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Desembolso Acumulado
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  R$ {totalCustoABC.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> 100%
              </span>
              <span>Apropriado nos talhões via ABC</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Custo Real Médio / Hectare
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  R$ {custoMedioHa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span>Insumos + Máquinas + Mão de Obra</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Ponto de Equilíbrio (Break-Even)
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {breakEvenMedio.toFixed(1)} <span className="text-sm font-semibold text-slate-600">sc/ha</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span className="text-emerald-800 font-bold">Meta: 68 sc/ha</span>
              <span>(Margem Segurança: 50.7%)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Área Total Monitorada
                </span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {totalAreaHa.toLocaleString('pt-BR')} <span className="text-sm font-semibold text-slate-600">ha</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-600">
              <span>6 Talhões Ativos com PostGIS</span>
            </div>
          </div>
        </div>
      )}

      {/* Composição Real de Custos (Custeio ABC Adaptativo) */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-800" />{' '}
              {isPecuaria
                ? 'Composição de Custos da Pecuária (Nutrição, Frotas & Sanidade)'
                : isHF
                ? 'Composição de Custos de Hortifrúti (Fertirrigação & Colheita)'
                : isBioenergia
                ? 'Composição de Custos Sucroalcooleiros (CCT & Agrícola)'
                : 'Composição Real de Custo Agrícola (Custeio ABC)'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Superando planilhas fragmentadas com rateio matemático real
            </p>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            Metodologia Baseada em Atividades
          </span>
        </div>

        {/* Barra de Progresso Visual Segmentada */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-50 mb-4 border border-slate-200">
          {isPecuaria ? (
            <>
              <div className="bg-emerald-500 h-full w-[61%]" title="Nutrição & Cocho (61%)"></div>
              <div className="bg-amber-500 h-full w-[18%]" title="Tratores & Distribuição (18%)"></div>
              <div className="bg-purple-500 h-full w-[12%]" title="Sanidade & Brincos RFID (12%)"></div>
              <div className="bg-blue-500 h-full w-[9%]" title="Campeiros & Gestão (9%)"></div>
            </>
          ) : (
            <>
              <div className="bg-emerald-600 h-full w-[66%]" title="Insumos (66%)"></div>
              <div className="bg-slate-700 h-full w-[23%]" title="Máquinas e Combustível (23%)"></div>
              <div className="bg-emerald-400 h-full w-[11%]" title="Mão de Obra Operadores (11%)"></div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isPecuaria ? (
            <>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Nutrição & Ração (61%)
                  </span>
                  <span className="font-mono">R$ 100,50 / @</span>
                </div>
                <p className="text-xs text-slate-600">
                  Silagem de milho, farelo de soja, DDG de milho e núcleo mineral com monensina sódica.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span> Misturadores & Diesel (18%)
                  </span>
                  <span className="font-mono">R$ 29,66 / @</span>
                </div>
                <p className="text-xs text-slate-600">
                  Tratores comboio de distribuição, vagão forrageiro desensilador e pás carregadeiras.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-purple-400">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span> Sanidade & SISBOV (21%)
                  </span>
                  <span className="font-mono">R$ 34,64 / @</span>
                </div>
                <p className="text-xs text-slate-600">
                  Vacinas clostridioses, vermífugos, brincos eletrônicos RFID UHF e mão de obra de curral.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span> Insumos Agrícolas (66%)
                  </span>
                  <span className="font-mono font-bold text-slate-900">R$ 1.048,00 / ha</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sementes tratadas, fungicidas, inseticidas, fertilizantes foliares e adjuvantes.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 bg-slate-700 rounded-full"></span> Máquinas & Diesel (23%)
                  </span>
                  <span className="font-mono font-bold text-slate-900">R$ 365,20 / ha</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Horímetro trabalhado, consumo de diesel S10, taxa de depreciação e manutenção preventiva.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span> Mão de Obra (11%)
                  </span>
                  <span className="font-mono font-bold text-slate-900">R$ 174,70 / ha</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Horas-homem de tratoristas, aplicadores técnicos e encargos trabalhistas rurais.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Atalhos Rápidos Operacionais para Módulos Específicos */}
      {onNavigate && (
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 font-bold uppercase text-[10px] tracking-wider">
            Atalhos Diretos da Atividade:
          </span>
          <div className="flex flex-wrap gap-2">
            {isPecuaria ? (
              <>
                <button
                  onClick={() => onNavigate('ZOOTECNIA')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🐂 Manejo Zootécnico</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('CONFINAMENTO')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🥩 Confinamento & Cocho</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('BOVINOCULTURA_SISBOV_RFID')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>📡 SISBOV RFID Cota Hilton</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('SILAGEM_FORRAGEM')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌾 Silagem & Forragem</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
              </>
            ) : isHF ? (
              <>
                <button
                  onClick={() => onNavigate('OLERICULTURA_HF')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🥬 Olericultura & HF</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('FERTIRRIGACAO_INJECAO_MULTICANAL')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>💧 Fertirrigação CE/pH</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('CULTIVO_PROTEGIDO_HIDROPONIA')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌿 Estufas Hidropônicas</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
              </>
            ) : isBioenergia ? (
              <>
                <button
                  onClick={() => onNavigate('CANA_DE_ACUCAR_ATR')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🎋 Cana ATR & Sacarose</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('RENOVABIO_CALCULADORA_CBIO')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌱 Calculadora CBIO RenovaBio</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('MOENDA_DIFUSOR_CANA_EXTRACAO')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>⚙️ Moenda & Difusores</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('PRECISAO')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🌱 Taxa Variável VRA</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('MIP')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🐛 Manejo MIP & NDE</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('SILOS')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🏭 Silos & Armazenagem</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
                <button
                  onClick={() => onNavigate('BARTER')}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>🤝 Comercialização Barter</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tabela de Performance por Talhão / Lote de Produção */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isPecuaria
                ? 'Consolidação de Desempenho por Lote de Pasto & Curral de Confinamento'
                : 'Consolidação Econômica e Fitossanitária por Talhão'}
            </h3>
            <p className="text-xs text-slate-600">
              {isPecuaria
                ? 'Rastreabilidade individual, ganho médio e custo por arroba por subdivisão'
                : 'Clique em qualquer talhão para inspecionar a geometria no SIG'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-900">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
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
                <th className="px-4 py-3 text-right text-emerald-800">
                  {isPecuaria ? 'Custo / @' : 'Custo / ha'}
                </th>
                <th className="px-4 py-3 text-right text-slate-900 font-bold">
                  {isPecuaria ? 'SISBOV / Destino' : 'Break-Even (sc/ha)'}
                </th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPecuaria ? (
                <>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900">Curral A1 - Confinamento</span>
                      <span className="text-[10px] text-slate-600 block">Terminação 90 Dias</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">450 cab</td>
                    <td className="px-4 py-3 text-slate-900">Nelore Machos Inteiros</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-800 font-bold">1.58 kg/dia</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">R$ 162,40/@</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">100% Cota Hilton</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ABATE EM 18 DIAS
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigate && onNavigate('CONFINAMENTO')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer"
                      >
                        Ver Cocho
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900">Curral A2 - Confinamento</span>
                      <span className="text-[10px] text-slate-600 block">Cruza Industrial Angus</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">380 cab</td>
                    <td className="px-4 py-3 text-slate-900">F1 Angus x Nelore</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-800 font-bold">1.64 kg/dia</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">R$ 168,90/@</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">Carnes Nobres Gourmet</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        EM TERMINAÇÃO
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigate && onNavigate('CONFINAMENTO')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer"
                      >
                        Ver Cocho
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900">Pasto Rotacionado P04</span>
                      <span className="text-[10px] text-slate-600 block">Mombaça Irrigado</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">620 cab</td>
                    <td className="px-4 py-3 text-slate-900">Novilhas Nelore Recria</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">0.82 kg/dia</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">R$ 138,50/@</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">Reposição Fazenda</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        PASTEJO ATIVO
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onNavigate && onNavigate('ZOOTECNIA')}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer"
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
                      className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                      onClick={() => onSelectTalhao(talhao)}
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900">{talhao.codigo}</span>
                        <span className="text-[10px] text-slate-600 block">{talhao.nome}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">
                        {talhao.areaHa.toFixed(1)} ha
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-medium">{talhao.cultura}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-700">
                        R$ {talhao.custoTotalABC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">
                        R$ {custoPorHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-slate-900">
                        {talhao.breakEvenScHa.toFixed(1)} sc/ha
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            talhao.status === 'PULVERIZADO'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : talhao.status === 'PLANTADO'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : talhao.status === 'PREPARO'
                              ? 'bg-amber-950 text-slate-900 border border-amber-800'
                              : 'bg-slate-50 text-slate-800 border border-slate-200'
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
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer"
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
