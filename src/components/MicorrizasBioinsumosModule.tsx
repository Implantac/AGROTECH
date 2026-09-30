import React, { useState, useMemo } from 'react';
import {
  Sprout,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  Sliders,
  Scale,
  Microscope,
} from 'lucide-react';

interface LoteInoculanteFma {
  id: string;
  lote: string;
  especiesMicorrizicas: string;
  veiculoSuporte: string;
  esporosPorGrama: number;
  taxaColonizacaoAlvoPct: number;
  glebaAplicacao: string;
  areaHa: number;
  status: 'EM_COLONIZACAO' | 'ANALISE_RADICULAR' | 'APLICADO_COM_SUCESSO';
}

export const MicorrizasBioinsumosModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lotes' | 'fisiologia' | 'glomalina' | 'simulador'>('lotes');

  // Parâmetros do Simulador
  const [areaInoculadaHa, setAreaInoculadaHa] = useState<number>(1200);
  const [custoInoculanteHaReais, setCustoInoculanteHaReais] = useState<number>(68.0);
  const [reducaoAduboFosfatadoPct, setReducaoAduboFosfatadoPct] = useState<number>(30.0);
  const [aduboFosfatadoPadraoKgHa, setAduboFosfatadoPadraoKgHa] = useState<number>(250.0);
  const [precoKgAduboFosfatadoReais, setPrecoKgAduboFosfatadoReais] = useState<number>(4.2);

  const [lotes, setLotes] = useState<LoteInoculanteFma[]>([
    {
      id: 'FMA-LOT-01',
      lote: 'Inoculante BioMicorriza Soja Turbo',
      especiesMicorrizicas: 'Rhizophagus clarus + Gigaspora margarita',
      veiculoSuporte: 'Turfa Esterilizada + Polímero Hidroretentor',
      esporosPorGrama: 1200,
      taxaColonizacaoAlvoPct: 75.0,
      glebaAplicacao: 'Gleba Sul (Talhões 01 a 06)',
      areaHa: 600,
      status: 'APLICADO_COM_SUCESSO',
    },
    {
      id: 'FMA-LOT-02',
      lote: 'BioInoculante Milho Cerrado Forte',
      especiesMicorrizicas: 'Glomus intraradices + Acaulospora scrobiculata',
      veiculoSuporte: 'Vermiculita Ultrafina Micronizada',
      esporosPorGrama: 950,
      taxaColonizacaoAlvoPct: 70.0,
      glebaAplicacao: 'Gleba Norte (Pivôs 02 e 03)',
      areaHa: 400,
      status: 'ANALISE_RADICULAR',
    },
    {
      id: 'FMA-LOT-03',
      lote: 'FMA Pastagem & Crotalária Fix',
      especiesMicorrizicas: 'Dentiscutata heterogama',
      veiculoSuporte: 'Grafite Lubrificante para Plantadeira',
      esporosPorGrama: 800,
      taxaColonizacaoAlvoPct: 65.0,
      glebaAplicacao: 'Gleba Integração ILPF',
      areaHa: 200,
      status: 'EM_COLONIZACAO',
    },
  ]);

  const metricas = useMemo(() => {
    const aduboFosfatadoEconomizadoKgHa = Number(((aduboFosfatadoPadraoKgHa * reducaoAduboFosfatadoPct) / 100).toFixed(1));
    const economiaFosfatadoHaReais = Number((aduboFosfatadoEconomizadoKgHa * precoKgAduboFosfatadoReais).toFixed(2));
    const ganhoLiquidoHaReais = Number((economiaFosfatadoHaReais - custoInoculanteHaReais).toFixed(2));
    const economiaTotalGlebaReais = Number((ganhoLiquidoHaReais * areaInoculadaHa).toFixed(2));
    const roiBioinsumoFma = custoInoculanteHaReais > 0 ? Number((ganhoLiquidoHaReais / custoInoculanteHaReais).toFixed(1)) : 0;
    const aduboEconomizadoTotalTon = Number(((aduboFosfatadoEconomizadoKgHa * areaInoculadaHa) / 1000).toFixed(1));

    return {
      aduboFosfatadoEconomizadoKgHa,
      economiaFosfatadoHaReais,
      ganhoLiquidoHaReais,
      economiaTotalGlebaReais,
      roiBioinsumoFma,
      aduboEconomizadoTotalTon,
    };
  }, [
    areaInoculadaHa,
    custoInoculanteHaReais,
    reducaoAduboFosfatadoPct,
    aduboFosfatadoPadraoKgHa,
    precoKgAduboFosfatadoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Microscope className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Bioinsumos & Fungos Micorrízicos Arbusculares (FMA)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Módulo 129 • Ciclagem Biológica de Fósforo & Glomalina
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Simbiose micorrízica com expansão do volume radicular em até 100x, solubilização de fósforo fixado no solo tropical e agregação estrutural de carbono com glomalina.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Fosfatado
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Economia Total da Gleba</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.economiaTotalGlebaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {metricas.ganhoLiquidoHaReais.toFixed(2)} líquido / hectare
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Adubo P Poupado</span>
            <Scale className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.aduboEconomizadoTotalTon} ton
          </p>
          <span className="text-xs text-teal-400 mt-1 block">
            -{metricas.aduboFosfatadoEconomizadoKgHa} kg/ha de adubo fosfatado
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Retorno do Bioinsumo</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.roiBioinsumoFma}x ROI
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            R$ 4,63 economizados por R$ 1,00 investido
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Colonização Radicular</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            74.0%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Rede de hifas ativas no perfil do solo
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('lotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'lotes'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Lotes de Inoculante
        </button>

        <button
          onClick={() => setActiveTab('fisiologia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'fisiologia'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Simbiose & Absorção de P
        </button>

        <button
          onClick={() => setActiveTab('glomalina')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'glomalina'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Glomalina & Estrutura do Solo
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'lotes' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-emerald-400" />
            Lotes Formulados de Inoculantes Micorrízicos (FMA)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Inoculante / Produto</th>
                  <th className="px-4 py-3">Espécies Fúngicas</th>
                  <th className="px-4 py-3">Veículo</th>
                  <th className="px-4 py-3">Esporos/g</th>
                  <th className="px-4 py-3">Gleba</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lotes.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{l.lote}</td>
                    <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{l.especiesMicorrizicas}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{l.veiculoSuporte}</td>
                    <td className="px-4 py-3 font-bold text-white">{l.esporosPorGrama}</td>
                    <td className="px-4 py-3 text-slate-300">{l.glebaAplicacao}</td>
                    <td className="px-4 py-3">{l.areaHa} ha</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fisiologia' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Extensão da Riçosfera</h4>
            </div>
            <p className="text-xs text-slate-400">
              As hifas extrarradiculares penetram em microporos do solo inacessíveis aos pelos radiculares da planta, aumentando o volume de absorção em até 100 vezes.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Comprimento de Hifas:</span>
              <span className="text-sm font-bold text-emerald-400 block">superior a 25 metros de hifas por cm³ de solo</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-teal-400" />
              <h4 className="text-sm font-semibold text-white">Solubilização de Fósforo (P)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Exsudação de fosfatases e ácidos orgânicos pelas hifas fúngicas que rompem a ligação do fosfato com óxidos de ferro e alumínio em latossolos vermelhos.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Eficiência de Aproveitamento:</span>
              <span className="text-sm font-bold text-teal-400 block">Elevação de 18% para 42% do P aplicado</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Tolerância a Veranicos</h4>
            </div>
            <p className="text-xs text-slate-400">
              Aumento da síntese de aquaporinas nas membranas celulares das raízes, mantendo a turgidez foliar mesmo sob déficit hídrico transitório de até 14 dias.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Condutância Estomática:</span>
              <span className="text-sm font-bold text-yellow-400 block">Manutenção da fotossíntese em seca</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'glomalina' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Produção de Glomalina & Agregação Estável de Matéria Orgânica
          </h3>
          <p className="text-sm text-slate-400">
            A glomalina é uma glicoproteína hidrofóbica secretada pelas micorrizas que atua como uma &quot;cola biológica&quot;, unindo partículas de argila e silte em macroagregados estáveis à água, protegendo o carbono orgânico por décadas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Glomalina no Solo</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">4.2 mg/g solo</p>
              <span className="text-[11px] text-slate-400">Resistente à degradação térmica</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Macroagregados Estáveis</span>
              <p className="text-lg font-bold text-teal-400 mt-1">superior a 82%</p>
              <span className="text-[11px] text-slate-400">Aumento da aeração e infiltração</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Créditos de Carbono</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">+1.4 t CO2eq/ha/ano</p>
              <span className="text-[11px] text-slate-400">Elegível para CPR Verde</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Simulador de Redução de Adubo Fosfatado & ROI de Bioinsumo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Área Inoculada (ha)</label>
              <input
                type="number"
                value={areaInoculadaHa}
                onChange={(e) => setAreaInoculadaHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Inoculante (R$/ha)</label>
              <input
                type="number"
                step="2"
                value={custoInoculanteHaReais}
                onChange={(e) => setCustoInoculanteHaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Redução de Adubo P (%)</label>
              <input
                type="number"
                step="5"
                value={reducaoAduboFosfatadoPct}
                onChange={(e) => setReducaoAduboFosfatadoPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Preço Adubo P (R$/kg)</label>
              <input
                type="number"
                step="0.2"
                value={precoKgAduboFosfatadoReais}
                onChange={(e) => setPrecoKgAduboFosfatadoReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Economia Líquida por Hectare:</span>
              <span className="text-base font-bold text-emerald-400">
                R$ {metricas.ganhoLiquidoHaReais.toFixed(2)} / ha líquido poupado
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Economia Total na Safra:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.economiaTotalGlebaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
