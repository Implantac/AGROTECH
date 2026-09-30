import React, { useState, useMemo } from 'react';
import {
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
  Award,
  Droplets,
  Trees
} from 'lucide-react';

interface LoteDende {
  id: string;
  identificacao: string;
  anoPlantio: number;
  cffColhidoTon: number;
  taxaOerPct: number;
  oleoBrutoTon: number;
  oleoPalmisteTon: number;
  statusRSPO: 'CERTIFICADO_RSPO_100' | 'AUDITORIA_ANUAL_OK';
}

export const DendeiculturaRspoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plantios' | 'extracao' | 'rspo' | 'simulador'>('plantios');

  // Lotes de Dendeicultura
  const [lotes] = useState<LoteDende[]>([
    {
      id: 'DENDE-TALHAO-01',
      identificacao: 'Fazenda Rio Capim • Setor Norte (Palma Deli x Lamé)',
      anoPlantio: 2018,
      cffColhidoTon: 2500,
      taxaOerPct: 22.8,
      oleoBrutoTon: 570.0,
      oleoPalmisteTon: 62.5,
      statusRSPO: 'CERTIFICADO_RSPO_100',
    },
    {
      id: 'DENDE-TALHAO-02',
      identificacao: 'Fazenda Rio Capim • Setor Sul (Híbrido OxG Resistente ao PC)',
      anoPlantio: 2019,
      cffColhidoTon: 2500,
      taxaOerPct: 22.2,
      oleoBrutoTon: 555.0,
      oleoPalmisteTon: 62.5,
      statusRSPO: 'CERTIFICADO_RSPO_100',
    },
  ]);

  // Simulador Econômico da Dendeicultura
  const [areaHa, setAreaHa] = useState<number>(200);
  const [produtividadeCffTonHa, setProdutividadeCffTonHa] = useState<number>(25.0);
  const [taxaExtracaoOerPct, setTaxaExtracaoOerPct] = useState<number>(22.5);
  const [taxaExtracaoPalmistePct, setTaxaExtracaoPalmistePct] = useState<number>(2.5);
  const [precoTonOleoPalmaReais, setPrecoTonOleoPalmaReais] = useState<number>(4800.0);
  const [precoTonOleoPalmisteReais, setPrecoTonOleoPalmisteReais] = useState<number>(5600.0);
  const [premioCertificacaoRspoReaisTon, setPremioCertificacaoRspoReaisTon] = useState<number>(220.0);
  const [custoPorHaReais, setCustoPorHaReais] = useState<number>(14800.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoTotalCffTon = areaHa * produtividadeCffTonHa;
    const oleoPalmaBrutoTon = Number((producaoTotalCffTon * (taxaExtracaoOerPct / 100)).toFixed(1));
    const oleoPalmisteTon = Number((producaoTotalCffTon * (taxaExtracaoPalmistePct / 100)).toFixed(1));

    const receitaOleoPalma = oleoPalmaBrutoTon * precoTonOleoPalmaReais;
    const receitaPalmiste = oleoPalmisteTon * precoTonOleoPalmisteReais;
    const premioRspo = oleoPalmaBrutoTon * premioCertificacaoRspoReaisTon;
    const receitaBrutaTotalReais = Number((receitaOleoPalma + receitaPalmiste + premioRspo).toFixed(2));

    const custoTotalReais = Number((areaHa * custoPorHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaTotalReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaTotalReais || 1)) * 100).toFixed(1));

    return {
      producaoTotalCffTon,
      oleoPalmaBrutoTon,
      oleoPalmisteTon,
      receitaBrutaTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaHa,
    produtividadeCffTonHa,
    taxaExtracaoOerPct,
    taxaExtracaoPalmistePct,
    precoTonOleoPalmaReais,
    precoTonOleoPalmisteReais,
    premioCertificacaoRspoReaisTon,
    custoPorHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5" />
                Módulo 98 • Dendeicultura & Palma de Óleo Sustentável
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                Elaeis guineensis • Certificação RSPO 100%
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🌴 Dendeicultura de Precisão, CFF & Extração de Óleo (OER)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Cultivo sustentável de palma de óleo no bioma amazônico em áreas de pastagem degradada pré-2008 (ZAE-Dendê). Monitoramento de Cachos de Frutos Frescos (CFF), taxa de extração OER na usina e rastreabilidade total com certificação internacional RSPO.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Óleo Bruto (CPO)</span>
              <span className="text-xl font-black text-amber-400">1.125 ton</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">22.5% OER</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 6,34M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Prêmio RSPO Ativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Produtividade de CFF</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">25.0 t / ha / ano</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            143 plantas / ha (triângulo 9m)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Taxa de Extração (OER)</span>
            <Droplets className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">22.5% CPO</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            + 2.5% Óleo de Palmiste (PKO)
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Prêmio Verde RSPO</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">+ R$ 220 / ton</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Bônus para Usinas Sustentáveis
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 3.387.500,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Margem Líquida de 53.4%
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('plantios')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'plantios'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Trees className="w-4 h-4" />
          1. Plantios & Colheita de CFF
        </button>

        <button
          onClick={() => setActiveTab('extracao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'extracao'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          2. Usina & Taxa de Extração OER
        </button>

        <button
          onClick={() => setActiveTab('rspo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rspo'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          3. Auditoria RSPO & Desmatamento Zero
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico da Palma
        </button>
      </div>

      {/* Conteúdo Aba 1: Plantios */}
      {activeTab === 'plantios' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Trees className="w-5 h-5 text-emerald-400" />
              Lotes de Dendezeiros e Manejo em Áreas de Pastagem Recuperada
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              O dendê é a oleaginosa mais produtiva do planeta por hectare (produz até 10x mais óleo por hectare que a soja). O plantio no Brasil é estritamente regulamentado pelo Decreto 7.172/2010 (ZAE-Dendê), permitindo plantio apenas em solos antropizados.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Lote / Setor</th>
                    <th className="py-3 px-3">Ano Plantio</th>
                    <th className="py-3 px-3">CFF Colhido</th>
                    <th className="py-3 px-3">Taxa OER</th>
                    <th className="py-3 px-3">Óleo Bruto CPO</th>
                    <th className="py-3 px-3">Óleo Palmiste</th>
                    <th className="py-3 px-3">Certificação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {lotes.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{l.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{l.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-300">{l.anoPlantio}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">{l.cffColhidoTon.toLocaleString()} ton</td>
                      <td className="py-3.5 px-3 font-mono text-amber-400 font-bold">{l.taxaOerPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{l.oleoBrutoTon} ton</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400">{l.oleoPalmisteTon} ton</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {l.statusRSPO}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Extração */}
      {activeTab === 'extracao' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-amber-400" />
              Processo Industrial de Extração na Usina
            </h3>
            <p className="text-xs text-slate-400">
              Etapas contínuas de esterilização sob vapor a 140°C para inativar enzimas que degradam a acidez do óleo:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Esterilização & Debulha</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Separação mecânica dos frutos das ráquis (cachos vazios retornam como adubo orgânico ao campo).
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Digestão & Prensagem Contínua</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Prensas de rosca sem-fim extraem o óleo da polpa carnuda (mesocarpo) e liberam as nozes para quebra.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Acidez Livre (AGL)
            </h3>
            <p className="text-xs text-slate-400">
              Critério máximo para óleo de palma cru (CPO) Tipo Exportação:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Acidez Livre Atual:</span>
                <span className="font-mono font-bold text-emerald-400">2.8% AGL (&lt; 5.0% limite)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Tempo Máximo Colheita-Usina:</span>
                <span className="font-mono font-bold text-cyan-400">Menos de 24 horas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: RSPO */}
      {activeTab === 'rspo' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Critérios Globais RSPO (Roundtable on Sustainable Palm Oil)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Garantia de que o óleo produzido não provém de desmatamento de florestas primárias, não utilizou queima na preparação do solo e respeitou comunidades tradicionais e direitos trabalhistas (zero trabalho análogo à escravidão).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Auditoria Satelital</span>
                <span className="text-2xl font-black text-white font-mono">100% Conforme</span>
                <span className="text-[11px] text-emerald-400 block">Marco temporal pré-2008</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Balanço de Carbono</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">-68% CO₂eq</span>
                <span className="text-[11px] text-slate-400 block">Captura de metano do efluente POME</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Destino Comercial</span>
                <span className="text-2xl font-black text-amber-400 font-mono">Indústria de Alimentos</span>
                <span className="text-[11px] text-slate-400 block">Cosméticos e Biocombustíveis</span>
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
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Parâmetros da Dendeicultura
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área Plantada (ha)</span>
                <span className="font-mono text-emerald-400">{areaHa} hectares</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={areaHa}
                onChange={(e) => setAreaHa(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Óleo de Palma (R$/ton)</span>
                <span className="font-mono text-amber-400">R$ {precoTonOleoPalmaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="3500"
                max="6500"
                step="100"
                value={precoTonOleoPalmaReais}
                onChange={(e) => setPrecoTonOleoPalmaReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Bônus Sustentável RSPO (R$/ton)</span>
                <span className="font-mono text-cyan-400">+ R$ {premioCertificacaoRspoReaisTon.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                step="10"
                value={premioCertificacaoRspoReaisTon}
                onChange={(e) => setPremioCertificacaoRspoReaisTon(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo de Manejo e Colheita por Ha</span>
                <span className="font-mono text-rose-400">R$ {custoPorHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="9000"
                max="22000"
                step="500"
                value={custoPorHaReais}
                onChange={(e) => setCustoPorHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Dendeicultura RSPO
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cachos CFF</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoTotalCffTon / 1000).toFixed(1)}k ton
                </span>
                <span className="text-[10px] text-slate-400 block">{areaHa} ha plantados</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Óleo Bruto CPO</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {metricas.oleoPalmaBrutoTon.toFixed(0)} ton
                </span>
                <span className="text-[10px] text-amber-400/80 block">{taxaExtracaoOerPct}% OER</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaTotalReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-400 block">Com Bônus RSPO</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Receita com Óleo de Palma Bruto CPO + Bônus RSPO:</span>
                <span className="font-mono font-bold text-white">
                  R$ {(metricas.oleoPalmaBrutoTon * (precoTonOleoPalmaReais + premioCertificacaoRspoReaisTon)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Receita com Óleo de Palmiste PKO ({metricas.oleoPalmisteTon} t @ R$ {precoTonOleoPalmisteReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-amber-400">
                  + R$ {(metricas.oleoPalmisteTon * precoTonOleoPalmisteReais).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custo Total de Manejo, Coroamento e Colheita:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {(areaHa * custoPorHaReais).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DendeiculturaRspoModule;
