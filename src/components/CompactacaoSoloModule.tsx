import React, { useState } from 'react';
import {
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Tractor,
  Download,
  Gauge,
  Sliders,
  Sparkles,
  MapPin,
  TrendingDown,
  Info
} from 'lucide-react';

interface PontoPenetrometria {
  id: string;
  pontoAmostral: string;
  talhao: string;
  coordenadas: string;
  camadasMPa: {
    faixaCm: string;
    profundidadeMaxCm: number;
    mpa: number;
    status: 'LIVRE' | 'ALERTA' | 'CRITICO';
  }[];
  profundidadePeGradeCm: number | null;
  regulagemHasteEscarificadorCm: number | null;
}

const PONTOS_AMOSTRAIS_INICIAIS: PontoPenetrometria[] = [
  {
    id: 'pt-01',
    pontoAmostral: 'Ponto Grid 12 - Cabeceira de Manobra',
    talhao: 'Talhão T-04 (Pivô Central Sul)',
    coordenadas: '-12.5482, -55.7214',
    camadasMPa: [
      { faixaCm: '0-10 cm', profundidadeMaxCm: 10, mpa: 1.25, status: 'LIVRE' },
      { faixaCm: '10-20 cm', profundidadeMaxCm: 20, mpa: 2.85, status: 'CRITICO' },
      { faixaCm: '20-30 cm', profundidadeMaxCm: 30, mpa: 2.20, status: 'CRITICO' },
      { faixaCm: '30-40 cm', profundidadeMaxCm: 40, mpa: 1.65, status: 'ALERTA' },
      { faixaCm: '40-50 cm', profundidadeMaxCm: 50, mpa: 1.10, status: 'LIVRE' },
    ],
    profundidadePeGradeCm: 20,
    regulagemHasteEscarificadorCm: 25,
  },
  {
    id: 'pt-02',
    pontoAmostral: 'Ponto Grid 28 - Centro do Talhão',
    talhao: 'Talhão T-01 (Sede)',
    coordenadas: '-12.5510, -55.7190',
    camadasMPa: [
      { faixaCm: '0-10 cm', profundidadeMaxCm: 10, mpa: 0.95, status: 'LIVRE' },
      { faixaCm: '10-20 cm', profundidadeMaxCm: 20, mpa: 1.35, status: 'LIVRE' },
      { faixaCm: '20-30 cm', profundidadeMaxCm: 30, mpa: 1.45, status: 'LIVRE' },
      { faixaCm: '30-40 cm', profundidadeMaxCm: 40, mpa: 1.20, status: 'LIVRE' },
      { faixaCm: '40-50 cm', profundidadeMaxCm: 50, mpa: 0.90, status: 'LIVRE' },
    ],
    profundidadePeGradeCm: null,
    regulagemHasteEscarificadorCm: null,
  },
  {
    id: 'pt-03',
    pontoAmostral: 'Ponto Grid 45 - Rastro Rodotrem/Transbordo',
    talhao: 'Talhão T-02 (Cerrado Alto)',
    coordenadas: '-12.5620, -55.7340',
    camadasMPa: [
      { faixaCm: '0-10 cm', profundidadeMaxCm: 10, mpa: 1.40, status: 'LIVRE' },
      { faixaCm: '10-20 cm', profundidadeMaxCm: 20, mpa: 2.60, status: 'CRITICO' },
      { faixaCm: '20-30 cm', profundidadeMaxCm: 30, mpa: 1.95, status: 'ALERTA' },
      { faixaCm: '30-40 cm', profundidadeMaxCm: 40, mpa: 1.35, status: 'LIVRE' },
      { faixaCm: '40-50 cm', profundidadeMaxCm: 50, mpa: 1.05, status: 'LIVRE' },
    ],
    profundidadePeGradeCm: 20,
    regulagemHasteEscarificadorCm: 25,
  },
];

export const CompactacaoSoloModule: React.FC = () => {
  const [pontos] = useState<PontoPenetrometria[]>(PONTOS_AMOSTRAIS_INICIAIS);
  const [pontoAtivo, setPontoAtivo] = useState<PontoPenetrometria>(PONTOS_AMOSTRAIS_INICIAIS[0]);

  // Simulador de Descompactação Dirigida vs Convencional em Área Total
  const [areaTotalTalhaoHa, setAreaTotalTalhaoHa] = useState<number>(450);
  const [percentualAreaCompactada, setPercentualAreaCompactada] = useState<number>(32); // 32% das manchas críticas
  const [consumoDieselEscarificadorLHa, setConsumoDieselEscarificadorLHa] = useState<number>(24.0); // 24 L/ha na haste profunda
  const [precoDieselLitro, setPrecoDieselLitro] = useState<number>(6.20);

  // Cálculos Econômicos
  const areaEscarificadaDirigidaHa = (areaTotalTalhaoHa * percentualAreaCompactada) / 100;
  const dieselConvencionalLitros = areaTotalTalhaoHa * consumoDieselEscarificadorLHa;
  const dieselDirigidoLitros = areaEscarificadaDirigidaHa * consumoDieselEscarificadorLHa;
  const dieselEconomizadoLitros = dieselConvencionalLitros - dieselDirigidoLitros;
  const economiaFinanceiraReais = dieselEconomizadoLitros * precoDieselLitro;
  const percentualEconomiaDiesel = ((dieselEconomizadoLitros / dieselConvencionalLitros) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-slate-950 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
                <Layers className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Compactação de Solo & Penetrômetro Digital (ASABE S313.3)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                    Resistência à Penetração (MPa)
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Mapeamento de pé de grade/arado, zona de impedimento radicular e escarificação dirigida com economia de diesel.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Mapa de Prescrição VRA de Profundidade de Escarificação exportado em Shapefile / ISO-XML para o monitor do trator!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-amber-950/40"
            >
              <Download className="w-4 h-4" />
              Exportar Prescrição VRA (ISO-XML)
            </button>
            <div className="text-right pl-4 border-l border-amber-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Economia no Talhão</div>
              <div className="text-xl font-bold text-amber-300">
                R$ {economiaFinanceiraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Limite Crítico ASABE (Taylor et al.)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            2.00 <span className="text-sm font-normal text-stone-400">MPa</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Impedimento mecânico severo de raízes pivotantes
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Pé de Grade Detectado</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {pontoAtivo.profundidadePeGradeCm ? `${pontoAtivo.profundidadePeGradeCm} cm` : 'Sem Impedimento'}
          </div>
          <div className="text-xs text-stone-400 mt-1">
            {pontoAtivo.profundidadePeGradeCm ? 'Camada 10-20 cm com alta densidade aparente' : 'Solo estruturado com boa macroporosidade'}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Regulagem da Haste Subsoladora</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {pontoAtivo.regulagemHasteEscarificadorCm ? `${pontoAtivo.regulagemHasteEscarificadorCm} cm` : 'N/A'}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            +5 cm de folga abaixo da camada adensada
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Economia Diesel (Dirigida vs Total)</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {percentualEconomiaDiesel}% <span className="text-sm font-normal text-stone-400">({dieselEconomizadoLitros.toFixed(0)} L)</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Escarifica apenas 32% da área onde o MPa &gt; 2.0
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Perfil Estratificado de Penetrometria vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Perfil do Solo & Gráfico de Barras de Resistência (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Perfil Estratificado de Resistência Mecânica (MPa)
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">Norma ASABE S313.3</span>
            </div>

            {/* Selector of Sample Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {pontos.map((pt) => {
                const isSelected = pt.id === pontoAtivo.id;
                const hasCritical = pt.camadasMPa.some((c) => c.status === 'CRITICO');
                return (
                  <button
                    key={pt.id}
                    onClick={() => setPontoAtivo(pt)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{pt.pontoAmostral.split(' - ')[0]}</span>
                      {hasCritical ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1 truncate">{pt.talhao}</div>
                  </button>
                );
              })}
            </div>

            {/* Depth Profile Bars Display */}
            <div className="space-y-4 bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <div className="flex justify-between text-xs text-stone-400 pb-2 border-b border-stone-800">
                <span>Camada de Solo (Profundidade)</span>
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> &lt;1.5 MPa Livre</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> 1.5-2.0 Alerta</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> &gt;2.0 Crítico</span>
                </span>
              </div>

              {pontoAtivo.camadasMPa.map((camada, idx) => {
                const barWidthPct = Math.min(100, (camada.mpa / 3.5) * 100);
                const isCritico = camada.status === 'CRITICO';
                const isAlerta = camada.status === 'ALERTA';

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white flex items-center gap-2">
                        <span className="font-mono text-stone-400">{camada.faixaCm}</span>
                        {isCritico && (
                          <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold">
                            Pé de Grade
                          </span>
                        )}
                      </span>
                      <span className={`font-mono font-bold ${isCritico ? 'text-rose-400' : isAlerta ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {camada.mpa.toFixed(2)} MPa
                      </span>
                    </div>

                    <div className="w-full bg-stone-800 h-3 rounded-full overflow-hidden relative">
                      {/* Critical line at 2.0 MPa (which is ~57.1% of 3.5 MPa scale) */}
                      <div className="absolute top-0 bottom-0 left-[57.1%] w-0.5 bg-rose-500/80 z-10" title="Limite Crítico 2.0 MPa" />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritico
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                            : isAlerta
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${barWidthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 text-stone-400 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Coordenada do Ponto: <span className="font-mono text-white">{pontoAtivo.coordenadas}</span>. Umidade gravimétrica do solo no momento da amostragem: 22.4% (Faixa friável ideal).
                </span>
              </div>
            </div>

            {/* Prescrição Integrada Mecânica + Biológica */}
            <div className="mt-4 p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-2 text-xs">
              <h4 className="font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Recomendação Agronômica Integrada (Mecânica + Biológica)
              </h4>
              <p className="text-stone-300 leading-relaxed">
                {pontoAtivo.profundidadePeGradeCm ? (
                  <>
                    A haste do escarificador/subsolador deve ser calibrada para trabalhar a <strong>{pontoAtivo.regulagemHasteEscarificadorCm} cm</strong> (5 cm abaixo da base do adensamento). Imediatamente após a operação mecânica, realizar a semeadura a lanço de <strong>Mix Descompactador (Nabo Forrageiro 6 kg/ha + Crotalaria ochroleuca 8 kg/ha)</strong> para que as raízes biológicas preservem a macroporosidade e bioporos abertos contra a recompactação pelas chuvas torrenciais.
                  </>
                ) : (
                  <>
                    Área livre de impedimento mecânico em todas as profundidades até 50 cm. <strong>Manter semeadura direta contínua</strong> sem intervenção mecânica, economizando 100% de combustível e preservando a estrutura biológica de microrganismos.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Diesel Savings & Targeted Escarification Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Escarificação Dirigida
                </h2>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                Economia VRA
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Compare os custos operacionais da subsolagem em área total versus intervenção dirigida apenas nas manchas de alto MPa.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Área Total do Talhão (ha)</label>
                <input
                  type="number"
                  step="10"
                  value={areaTotalTalhaoHa}
                  onChange={(e) => setAreaTotalTalhaoHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-stone-400 font-medium">Mancha Compactada Crítica (&gt; 2.0 MPa)</label>
                  <span className="text-amber-400 font-bold">{percentualAreaCompactada}% ({areaEscarificadaDirigidaHa.toFixed(1)} ha)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={percentualAreaCompactada}
                  onChange={(e) => setPercentualAreaCompactada(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Consumo do Trator com Escarificador (L/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={consumoDieselEscarificadorLHa}
                  onChange={(e) => setConsumoDieselEscarificadorLHa(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-400 font-medium block mb-1">Cotação do Óleo Diesel S10 (R$/L)</label>
                <input
                  type="number"
                  step="0.10"
                  value={precoDieselLitro}
                  onChange={(e) => setPrecoDieselLitro(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>
            </div>

            {/* Comparison Results Card */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Diesel em Área Total:</span>
                <span className="text-stone-300 font-mono">
                  {dieselConvencionalLitros.toLocaleString('pt-BR')} L (R$ {(dieselConvencionalLitros * precoDieselLitro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Diesel na Operação Dirigida:</span>
                <span className="text-amber-300 font-mono font-bold">
                  {dieselDirigidoLitros.toLocaleString('pt-BR')} L (R$ {(dieselDirigidoLitros * precoDieselLitro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Diesel Economizado:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {dieselEconomizadoLitros.toLocaleString('pt-BR')} L ({percentualEconomiaDiesel}%)
                </span>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Economia Financeira Líquida</div>
                  <div className="text-lg font-black text-white">
                    R$ {economiaFinanceiraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
