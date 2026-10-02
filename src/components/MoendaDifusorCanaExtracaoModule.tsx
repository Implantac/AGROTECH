import React, { useState, useMemo } from 'react';
import {
  Factory,
  Zap,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  Sliders,
  Scale,
  Flame,
} from 'lucide-react';

interface LinhaExtracaoCana {
  id: string;
  linha: string;
  tipoTecnologia: 'DIFUSOR_CONTINUO' | 'TERNO_MOENDA_6_ROLOS' | 'MOENDA_PRESSURIZADA';
  capacidadeTph: number;
  eficienciaExtracaoPct: number;
  polBagacoPct: number;
  aguaEmbebiçãoPct: number;
  consumoEnergiaKwhPorTon: number;
  status: 'OPERACAO_NOMINAL' | 'EMBEBICAO_ALTA' | 'MANUTENCAO_PREVENTIVA';
}

export const MoendaDifusorCanaExtracaoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'linhas' | 'balanco' | 'cogerecao' | 'simulador'>('linhas');

  // Parâmetros do Simulador
  const [toneladasCanaMoidaDia, setToneladasCanaMoidaDia] = useState<number>(14000);
  const [polCanaPct, setPolCanaPct] = useState<number>(14.2);
  const [eficienciaExtracaoPct, setEficienciaExtracaoPct] = useState<number>(97.5);
  const [polBagacoPct, setPolBagacoPct] = useState<number>(1.35);
  const [precoKgAtrReais, setPrecoKgAtrReais] = useState<number>(1.18);
  const [diasSafra, setDiasSafra] = useState<number>(210);

  const [linhas, setLinhas] = useState<LinhaExtracaoCana[]>([
    {
      id: 'LINHA-01',
      linha: 'Difusor Contínuo de Cana Desfibrada 01',
      tipoTecnologia: 'DIFUSOR_CONTINUO',
      capacidadeTph: 600,
      eficienciaExtracaoPct: 98.1,
      polBagacoPct: 1.15,
      aguaEmbebiçãoPct: 32.0,
      consumoEnergiaKwhPorTon: 14.5,
      status: 'OPERACAO_NOMINAL',
    },
    {
      id: 'LINHA-02',
      linha: 'Tandem de Moendas Pesadas 02 (6 Ternos 42x84")',
      tipoTecnologia: 'TERNO_MOENDA_6_ROLOS',
      capacidadeTph: 450,
      eficienciaExtracaoPct: 96.8,
      polBagacoPct: 1.55,
      aguaEmbebiçãoPct: 28.5,
      consumoEnergiaKwhPorTon: 22.0,
      status: 'OPERACAO_NOMINAL',
    },
  ]);

  const metricas = useMemo(() => {
    const sacarosaTotalDiaKg = Number(((toneladasCanaMoidaDia * 1000 * polCanaPct) / 100).toFixed(1));
    const sacarosaExtraidaDiaKg = Number(((sacarosaTotalDiaKg * eficienciaExtracaoPct) / 100).toFixed(1));
    const perdasSacaroseBagacoDiaKg = Number((sacarosaTotalDiaKg - sacarosaExtraidaDiaKg).toFixed(1));
    const faturamentoDiaReais = Number((sacarosaExtraidaDiaKg * precoKgAtrReais).toFixed(2));
    const faturamentoSafraReais = Number((faturamentoDiaReais * diasSafra).toFixed(2));
    const bagacoGeradoDiaTon = Number((toneladasCanaMoidaDia * 0.26).toFixed(1)); // ~260 kg bagaço / ton cana
    const bioeletricidadeMwhDia = Number(((bagacoGeradoDiaTon * 450) / 1000).toFixed(1)); // ~450 kWh por ton bagaço

    return {
      sacarosaTotalDiaKg,
      sacarosaExtraidaDiaKg,
      perdasSacaroseBagacoDiaKg,
      faturamentoDiaReais,
      faturamentoSafraReais,
      bagacoGeradoDiaTon,
      bioeletricidadeMwhDia,
    };
  }, [
    toneladasCanaMoidaDia,
    polCanaPct,
    eficienciaExtracaoPct,
    precoKgAtrReais,
    diasSafra,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Factory className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Moenda, Difusores & Extração de Caldo de Cana
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Módulo 133 • Eficiência de Extração (&gt; 97.5%) & Cogeração
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Controle da extração de sacarose na cana desfibrada, taxa de embebição composta, redução de Pol no bagaço e balanço de vapor para bioeletricidade.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador Industrial
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Moagem Diária</span>
            <Factory className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {toneladasCanaMoidaDia.toLocaleString('pt-BR')} ton/dia
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            {(toneladasCanaMoidaDia / 24).toFixed(0)} TPH em regime contínuo
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Eficiência de Extração</span>
            <Award className="w-5 h-5 text-lime-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {eficienciaExtracaoPct}%
          </p>
          <span className="text-xs text-lime-400 mt-1 block">
            Pol no bagaço final de {polBagacoPct}%
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Faturamento Diário ATR</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.faturamentoDiaReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            R$ {precoKgAtrReais.toFixed(2)} / kg de ATR extraído
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Cogeração de Energia</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.bioeletricidadeMwhDia} MWh/dia
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Vapor gerado com {metricas.bagacoGeradoDiaTon} t de bagaço
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('linhas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'linhas'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Linhas de Extração
        </button>

        <button
          onClick={() => setActiveTab('balanco')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'balanco'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Scale className="w-4 h-4" />
          Balanço de Sacarose (Pol)
        </button>

        <button
          onClick={() => setActiveTab('cogerecao')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'cogerecao'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Flame className="w-4 h-4" />
          Bagaço & Caldeira de Alta Pressão
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'linhas' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-emerald-400" />
            Operação de Moendas e Difusores Contínuos
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Equipamento</th>
                  <th className="px-4 py-3">Tecnologia</th>
                  <th className="px-4 py-3">Capacidade</th>
                  <th className="px-4 py-3">Extração</th>
                  <th className="px-4 py-3">Pol Bagaço</th>
                  <th className="px-4 py-3">Consumo Elétrico</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {linhas.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{l.linha}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{l.tipoTecnologia}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{l.capacidadeTph} TPH</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{l.eficienciaExtracaoPct}%</td>
                    <td className="px-4 py-3 font-bold text-lime-400">{l.polBagacoPct}%</td>
                    <td className="px-4 py-3 text-slate-900">{l.consumoEnergiaKwhPorTon} kWh/t</td>
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

      {activeTab === 'balanco' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Índice de Preparo (Open Cells)</h4>
            </div>
            <p className="text-xs text-slate-600">
              Desfibrador de facas pesadas operando acima de 88% de células abertas, permitindo que a água de embebição penetre no vacúolo celular sem necessidade de esmagamento excessivo.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Meta Industrial:</span>
              <span className="text-sm font-bold text-emerald-400 block">Open Cells superior a 90%</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-lime-400" />
              <h4 className="text-sm font-semibold text-white">Taxa de Embebição Composta</h4>
            </div>
            <p className="text-xs text-slate-600">
              Água de embebição aquecida a 75°C aplicada no último terno/estágio do difusor, arrastando a sacarose residual em contracorrente e minimizando o gasto de vapor na evaporação.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Taxa em Relação à Cana:</span>
              <span className="text-sm font-bold text-lime-400 block">30% a 32% sobre a massa</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Pol no Bagaço Final</h4>
            </div>
            <p className="text-xs text-slate-600">
              Indicador crítico de perda sacarina. Cada 0.1% a menos de Pol no bagaço representa mais de 14.000 kg de açúcar ou 8.000 litros de etanol a mais por dia na safra.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Limite de Excelência:</span>
              <span className="text-sm font-bold text-yellow-400 block">Pol inferior a 1.40%</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cogerecao' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-yellow-400" />
            Caldeiras Aquotubulares de 67 bar e Turbogeradores a Vapor
          </h3>
          <p className="text-sm text-slate-600">
            O bagaço desidratado (umidade inferior a 50%) alimenta caldeiras de alta pressão com geração de vapor superaquecido a 520°C, acionando turbinas de condensação para exportação de excedente à rede elétrica nacional (CCEE).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Umidade do Bagaço</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">48.5% UR</p>
              <span className="text-[11px] text-slate-600">Poder calorífico superior (PCS) elevado</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Pressão de Vapor</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">67 bar / 520°C</p>
              <span className="text-[11px] text-slate-600">Ciclo térmico de alta eficiência</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Exportação CCEE</span>
              <p className="text-lg font-bold text-white mt-1">+85 kWh/t exportados</p>
              <span className="text-[11px] text-slate-600">Receita complementar de bioeletricidade</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Simulador de Moagem & Faturamento da Safra Sucroalcooleira
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Cana Moída / Dia (ton)</label>
              <input
                type="number"
                value={toneladasCanaMoidaDia}
                onChange={(e) => setToneladasCanaMoidaDia(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Pol da Cana (%)</label>
              <input
                type="number"
                step="0.1"
                value={polCanaPct}
                onChange={(e) => setPolCanaPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Eficiência Extração (%)</label>
              <input
                type="number"
                step="0.1"
                value={eficienciaExtracaoPct}
                onChange={(e) => setEficienciaExtracaoPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço ATR (R$/kg)</label>
              <input
                type="number"
                step="0.05"
                value={precoKgAtrReais}
                onChange={(e) => setPrecoKgAtrReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Faturamento Diário de ATR:</span>
              <span className="text-base font-bold text-emerald-400">
                R$ {metricas.faturamentoDiaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / dia
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Faturamento Acumulado na Safra:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.faturamentoSafraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
