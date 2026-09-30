import React, { useState, useMemo } from 'react';
import {
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  Activity,
  Sun,
  Flame,
  Scale
} from 'lucide-react';

interface TalhaoPalma {
  id: string;
  identificacao: string;
  cultivar: 'Orelha de Elefante Mexicana' | 'IPA Sertânia' | 'Miúda (Doce)';
  areaHa: number;
  densidadeCladodiosHa: number;
  idadeMeses: number;
  produtividadeEstimadaTonHa: number;
  resistenciaCochonilhaCarmim: 'IMUNE_RESISTENTE' | 'MODERADAMENTE_RESISTENTE' | 'SUSCETIVEL';
  statusCochonilha: 'LIVRE' | 'FOCO_LOCALIZADO' | 'CONTROLE_BIOLOGICO';
  previsaoCorteDias: number;
}

export const PalmaForrageiraSemiAridoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'talhoes' | 'dieta_nutricao' | 'agua_biologica' | 'simulador'>('talhoes');

  // Talhões de Palma no Semiárido
  const [talhoes] = useState<TalhaoPalma[]>([
    {
      id: 'PALMA-01',
      identificacao: 'Talhão Sertão Central 01',
      cultivar: 'Orelha de Elefante Mexicana',
      areaHa: 8,
      densidadeCladodiosHa: 35000,
      idadeMeses: 22,
      produtividadeEstimadaTonHa: 195,
      resistenciaCochonilhaCarmim: 'IMUNE_RESISTENTE',
      statusCochonilha: 'LIVRE',
      previsaoCorteDias: 30,
    },
    {
      id: 'PALMA-02',
      identificacao: 'Talhão Chapada dos Bois 02',
      cultivar: 'IPA Sertânia',
      areaHa: 7,
      densidadeCladodiosHa: 40000,
      idadeMeses: 18,
      produtividadeEstimadaTonHa: 175,
      resistenciaCochonilhaCarmim: 'IMUNE_RESISTENTE',
      statusCochonilha: 'LIVRE',
      previsaoCorteDias: 90,
    },
    {
      id: 'PALMA-03',
      identificacao: 'Talhão Baixada das Cabras 03',
      cultivar: 'Miúda (Doce)',
      areaHa: 5,
      densidadeCladodiosHa: 30000,
      idadeMeses: 24,
      produtividadeEstimadaTonHa: 160,
      resistenciaCochonilhaCarmim: 'MODERADAMENTE_RESISTENTE',
      statusCochonilha: 'CONTROLE_BIOLOGICO',
      previsaoCorteDias: 15,
    },
  ]);

  // Simulador de Segurança Forrageira & DRE
  const [areaCultivadaHa, setAreaCultivadaHa] = useState<number>(20);
  const [produtividadeTonHa, setProdutividadeTonHa] = useState<number>(180);
  const [teorMateriaSecaPct, setTeorMateriaSecaPct] = useState<number>(10.5);
  const [rebanhoBovino, setRebanhoBovino] = useState<number>(120);
  const [consumoDiarioKg, setConsumoDiarioKg] = useState<number>(35);
  const [custoImplantacaoHaReais, setCustoImplantacaoHaReais] = useState<number>(8500.0);
  const [precoEquivalenteKgForragemReais, setPrecoEquivalenteKgForragemReais] = useState<number>(0.22);

  // Cálculos do Módulo
  const metricasPalma = useMemo(() => {
    const producaoMassaVerdeTon = areaCultivadaHa * produtividadeTonHa;
    const producaoMateriaSecaTon = Number((producaoMassaVerdeTon * (teorMateriaSecaPct / 100)).toFixed(1));
    const aporteAguaBiologicaLitros = Math.round(producaoMassaVerdeTon * 1000 * (1 - teorMateriaSecaPct / 100));

    const consumoDiarioRebanhoKg = rebanhoBovino * consumoDiarioKg;
    const diasSegurancaForrageira = Math.round((producaoMassaVerdeTon * 1000) / (consumoDiarioRebanhoKg || 1));

    const valorEconomicoBiomassa = Number((producaoMassaVerdeTon * 1000 * precoEquivalenteKgForragemReais).toFixed(2));
    const custoTotalPalma = Number((areaCultivadaHa * custoImplantacaoHaReais).toFixed(2));
    const economiaLiquidaForragem = Number((valorEconomicoBiomassa - custoTotalPalma).toFixed(2));

    return {
      producaoMassaVerdeTon,
      producaoMateriaSecaTon,
      aporteAguaBiologicaLitros,
      diasSegurancaForrageira,
      valorEconomicoBiomassa,
      custoTotalPalma,
      economiaLiquidaForragem,
    };
  }, [areaCultivadaHa, produtividadeTonHa, teorMateriaSecaPct, rebanhoBovino, consumoDiarioKg, custoImplantacaoHaReais, precoEquivalenteKgForragemReais]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-lime-950/70 via-slate-900 to-slate-950 border border-lime-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-lime-500/20 text-lime-300 border border-lime-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 83 • Palma Forrageira & Pecuária Resiliente no Semiárido
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Embrapa Semiárido • Clones Resistentes
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🌵 Palma Forrageira, Água Biológica & Segurança Forrageira
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Gestão agronômica e nutricional de cactáceas forrageiras (Orelha de Elefante Mexicana e IPA Sertânia): blindagem contra Cochonilha-do-Carmim, balanceamento de fibra e nitrogênio (ureia 1%) e suprimento de água metabólica em secas extremas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Área Implantada</span>
              <span className="text-xl font-black text-lime-400">20 ha</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Superadensado</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Segurança Hídrica</span>
              <span className="text-xl font-black text-cyan-400">3,22M Litros</span>
              <span className="text-[10px] text-cyan-400/80 block mt-0.5">Água Vegetal Nativa</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-lime-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Massa Verde Disponível</span>
            <Leaf className="w-4 h-4 text-lime-400" />
          </div>
          <div className="text-2xl font-black text-white">3.600 ton MV</div>
          <div className="text-[11px] text-lime-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            378 ton de Matéria Seca Nobre (10.5% MS)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-lime-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Autonomia do Rebanho</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">857 dias</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Garantia para 120 vacas @ 35 kg/dia
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-lime-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cochonilha-do-Carmim</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100% Blindado</div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">
            Clones Imunes (OEM & IPA Sertânia)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-lime-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Economia Forragem</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 622.000,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            vs Compra Externa de Silagem de Milho
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('talhoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'talhoes'
              ? 'bg-lime-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Leaf className="w-4 h-4" />
          1. Talhões & Variedades Resistentes
        </button>

        <button
          onClick={() => setActiveTab('dieta_nutricao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dieta_nutricao'
              ? 'bg-lime-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          2. Dieta Equilibrada & Ureia 1%
        </button>

        <button
          onClick={() => setActiveTab('agua_biologica')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'agua_biologica'
              ? 'bg-lime-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          3. Reserva Hídrica Biológica
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-lime-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico de Seca
        </button>
      </div>

      {/* Conteúdo Aba 1: Talhões */}
      {activeTab === 'talhoes' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-lime-400" />
              Talhões de Palma & Resistência à Cochonilha-do-Carmim (*Dactylopius opuntiae*)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A substituição da antiga Palma Gigante pelos clones geneticamente resistentes desenvolvidos e validados pela Embrapa Semiárido e IPA salvou a bacia leiteira nordestina.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Talhão / Identificação</th>
                    <th className="py-3 px-3">Clone / Cultivar</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Densidade</th>
                    <th className="py-3 px-3">Idade</th>
                    <th className="py-3 px-3">Produtividade Est.</th>
                    <th className="py-3 px-3">Resistência Fitossanitária</th>
                    <th className="py-3 px-3">Status Cochonilha</th>
                    <th className="py-3 px-3">Previsão Corte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {talhoes.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{t.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{t.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-lime-300">{t.cultivar}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-200">{t.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{t.densidadeCladodiosHa.toLocaleString()} cladódios/ha</td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{t.idadeMeses} meses</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{t.produtividadeEstimadaTonHa} ton/ha</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {t.resistenciaCochonilhaCarmim}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-emerald-400">{t.statusCochonilha}</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-amber-400">em {t.previsaoCorteDias} dias</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Dieta & Nutrição */}
      {activeTab === 'dieta_nutricao' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-lime-400" />
              Equilíbrio Ruminal com Fibra & Nitrogênio
            </h3>
            <p className="text-xs text-slate-400">
              A palma forrageira é rica em água e carboidratos não-fibrosos de rápida digestão (semelhante ao milho moído), mas possui baixa proteína (4%) e pouca fibra efetiva. Fornecer palma isolada provoca acidose e diarreia profusa no gado.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Palma Forrageira Picada no Cocho</span>
                  <span className="text-slate-400 text-[11px]">Aporte de energia (NDT 65%) e água biológica</span>
                </div>
                <span className="font-mono font-bold text-lime-400 text-sm">65% da Dieta</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Fonte de Fibra Efetiva (Feno Buffel / Silagem Sorgo)</span>
                  <span className="text-slate-400 text-[11px]">Estímulo à ruminação e motilidade do rúmen</span>
                </div>
                <span className="font-mono font-bold text-amber-400 text-sm">25% da Dieta</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Mistura Ureia Agrícola + Sulfato de Amônio (9:1)</span>
                  <span className="text-slate-400 text-[11px]">Correção da proteína bruta (eleva de 4% para 12% PB)</span>
                </div>
                <span className="font-mono font-bold text-cyan-400 text-sm">1.0% Mistura</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Farelo Proteico (Soja ou Algodão) + Sal Mineral</span>
                  <span className="text-slate-400 text-[11px]">Nutrição completa para vacas leiteiras de 18 L/dia</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">9.0% da Dieta</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Recomendações Práticas do Cocho
            </h3>
            <p className="text-xs text-slate-400">
              Protocolo validado para evitar perdas e intoxicação por ureia:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Corte e Picagem Imediata</span>
                <span className="text-slate-400 text-[11px]">Picar a palma em picadeira mecânica no dia do fornecimento. Evitar deixar a massa verde fermentando em pilhas expostas ao sol forte do Sertão.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Homogeneização da Ureia</span>
                <span className="text-slate-400 text-[11px]">Dissolver a ureia prévia em água e regar sobre o feno triturado antes de misturar à palma, garantindo ingestão uniforme por todos os animais da baia.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Água Biológica */}
      {activeTab === 'agua_biologica' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              O "Açude Verde": Armazenamento Biológico de Água nos Cladódios
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Com mais de 89% de água em sua composição de massa verde, a palma transforma o solo semiárido em uma cisterna viva de alta eficiência fisiológica (fotossíntese CAM que abre estômatos apenas à noite).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Água Total Armazenada</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">3.222.000 L</span>
                <span className="text-[11px] text-slate-400 block">Equivalente a 200 caminhões-pipa</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Água Ingerida / Vaca / Dia</span>
                <span className="text-2xl font-black text-white font-mono">31.3 Litros</span>
                <span className="text-[11px] text-emerald-400 block">Redução de 45% na ida ao bebedouro</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Eficiência de Uso da Chuva</span>
                <span className="text-2xl font-black text-lime-400 font-mono">18.5 kg MS/mm</span>
                <span className="text-[11px] text-slate-400 block">3x mais eficiente que gramíneas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-lime-400" />
              Parâmetros da Área & Rebanho
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área de Palma Cultivada</span>
                <span className="font-mono text-lime-400">{areaCultivadaHa} hectares</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={areaCultivadaHa}
                onChange={(e) => setAreaCultivadaHa(Number(e.target.value))}
                className="w-full accent-lime-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Produtividade Bienal (ton MV/ha)</span>
                <span className="font-mono text-lime-400">{produtividadeTonHa} ton/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={produtividadeTonHa}
                onChange={(e) => setProdutividadeTonHa(Number(e.target.value))}
                className="w-full accent-lime-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Tamanho do Rebanho Atendido</span>
                <span className="font-mono text-amber-400">{rebanhoBovino} vacas</span>
              </div>
              <input
                type="range"
                min="30"
                max="400"
                step="10"
                value={rebanhoBovino}
                onChange={(e) => setRebanhoBovino(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Consumo Médio por Vaca / Dia</span>
                <span className="font-mono text-cyan-400">{consumoDiarioKg} kg MV/dia</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                step="5"
                value={consumoDiarioKg}
                onChange={(e) => setConsumoDiarioKg(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Volumoso Substituto (Silagem)</span>
                <span className="font-mono text-emerald-400">R$ {precoEquivalenteKgForragemReais.toFixed(2)} / kg</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.45"
                step="0.01"
                value={precoEquivalenteKgForragemReais}
                onChange={(e) => setPrecoEquivalenteKgForragemReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              DRE da Reserva Forrageira & Economia em Época de Seca
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Massa Verde Total</span>
                <span className="font-mono font-bold text-white text-base">
                  {metricasPalma.producaoMassaVerdeTon.toLocaleString()} ton
                </span>
                <span className="text-[10px] text-slate-400 block">{metricasPalma.producaoMateriaSecaTon} t MS</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Autonomia Seca</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {metricasPalma.diasSegurancaForrageira} dias
                </span>
                <span className="text-[10px] text-amber-400/80 block">Segurança Total</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Valor da Forragem</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricasPalma.valorEconomicoBiomassa / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-400 block">Equivalente Silagem</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Economia Líquida</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricasPalma.economiaLiquidaForragem / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Economia Real</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Valor Econômico da Biomassa Gerada ({metricasPalma.producaoMassaVerdeTon.toLocaleString()} t @ R$ {precoEquivalenteKgForragemReais.toFixed(2)}/kg):</span>
                <span className="font-mono font-bold text-emerald-400">
                  R$ {metricasPalma.valorEconomicoBiomassa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custo Total de Implantação e Condução ({areaCultivadaHa} ha @ R$ {custoImplantacaoHaReais.toFixed(2)}/ha):</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricasPalma.custoTotalPalma.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Economia Forrageira Líquida Gerada:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricasPalma.economiaLiquidaForragem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PalmaForrageiraSemiAridoModule;
