import React, { useState } from 'react';
import {
  Layers,
  Activity,
  CheckCircle2,
  Tractor,
  Download,
  Sparkles,
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
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
              <Layers className="w-6 h-6 text-amber-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Compactação de Solo & Penetrômetro Digital (ASABE S313.3)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                  Resistência à Penetração (MPa)
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Mapeamento de pé de grade/arado, zona de impedimento radicular e escarificação dirigida com economia de diesel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Mapa de Prescrição VRA de Profundidade de Escarificação exportado em Shapefile / ISO-XML para o monitor do trator!')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Exportar Prescrição VRA (ISO-XML)
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Economia no Talhão</div>
              <div className="text-lg font-bold text-amber-700">
                R$ {economiaFinanceiraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Limite Crítico ASABE (Taylor et al.)</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            2.00 <span className="text-sm font-normal text-slate-400">MPa</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Impedimento mecânico severo de raízes
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Pé de Grade Detectado</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {pontoAtivo.profundidadePeGradeCm ? `${pontoAtivo.profundidadePeGradeCm} cm` : 'Sem Impedimento'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {pontoAtivo.profundidadePeGradeCm ? 'Camada 10-20 cm com alta densidade aparente' : 'Solo estruturado com boa macroporosidade'}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Regulagem da Haste Subsoladora</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {pontoAtivo.regulagemHasteEscarificadorCm ? `${pontoAtivo.regulagemHasteEscarificadorCm} cm` : 'N/A'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            +5 cm de folga abaixo do adensamento
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Economia Diesel (Dirigida vs Total)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {percentualEconomiaDiesel}% <span className="text-sm font-normal text-slate-400">({dieselEconomizadoLitros.toFixed(0)} L)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Escarifica apenas 32% da área onde o MPa &gt; 2.0
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Perfil Estratificado de Penetrometria vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Perfil do Solo & Gráfico de Barras de Resistência (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Perfil Estratificado de Resistência Mecânica (MPa)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Norma ASABE S313.3</span>
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
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{pt.pontoAmostral.split(' - ')[0]}</span>
                      {hasCritical ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 truncate">{pt.talhao}</div>
                  </button>
                );
              })}
            </div>

            {/* Depth Profile Bars Display */}
            <div className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <div className="flex justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
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
                      <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="font-mono text-slate-500">{camada.faixaCm}</span>
                        {isCritico && (
                          <span className="px-1.5 py-0.2 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[10px] font-bold">
                            Pé de Grade
                          </span>
                        )}
                      </span>
                      <span className={`font-mono font-bold ${isCritico ? 'text-rose-700' : isAlerta ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {camada.mpa.toFixed(2)} MPa
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-[57.1%] w-0.5 bg-rose-600 z-10" title="Limite Crítico 2.0 MPa" />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritico
                            ? 'bg-rose-500'
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

              <div className="pt-2 text-slate-600 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Coordenada do Ponto: <span className="font-mono text-slate-900 font-semibold">{pontoAtivo.coordenadas}</span>. Umidade gravimétrica: 22.4% (Faixa friável ideal).
                </span>
              </div>
            </div>

            {/* Prescrição Integrada Mecânica + Biológica */}
            <div className="mt-4 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-xs">
              <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Recomendação Agronômica Integrada (Mecânica + Biológica)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {pontoAtivo.profundidadePeGradeCm ? (
                  <>
                    A haste do escarificador/subsolador deve ser calibrada para trabalhar a <strong>{pontoAtivo.regulagemHasteEscarificadorCm} cm</strong> (5 cm abaixo da base do adensamento). Imediatamente após a operação mecânica, realizar a semeadura a lanço de <strong>Mix Descompactador (Nabo Forrageiro 6 kg/ha + Crotalaria ochroleuca 8 kg/ha)</strong> para que as raízes biológicas preservem a macroporosidade contra a recompactação.
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
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tractor className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Escarificação Dirigida
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Economia VRA
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Compare os custos operacionais da subsolagem em área total versus intervenção dirigida apenas nas manchas de alto MPa.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Área Total do Talhão (ha)</label>
                <input
                  type="number"
                  step="10"
                  value={areaTotalTalhaoHa}
                  onChange={(e) => setAreaTotalTalhaoHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-600 font-medium">Mancha Compactada Crítica (&gt; 2.0 MPa)</label>
                  <span className="text-amber-800 font-bold">{percentualAreaCompactada}% ({areaEscarificadaDirigidaHa.toFixed(1)} ha)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={percentualAreaCompactada}
                  onChange={(e) => setPercentualAreaCompactada(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Consumo do Trator com Escarificador (L/ha)</label>
                <input
                  type="number"
                  step="1"
                  value={consumoDieselEscarificadorLHa}
                  onChange={(e) => setConsumoDieselEscarificadorLHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Cotação do Óleo Diesel S10 (R$/L)</label>
                <input
                  type="number"
                  step="0.10"
                  value={precoDieselLitro}
                  onChange={(e) => setPrecoDieselLitro(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Comparison Results Card */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Diesel em Área Total:</span>
                <span className="text-slate-800 font-mono">
                  {dieselConvencionalLitros.toLocaleString('pt-BR')} L (R$ {(dieselConvencionalLitros * precoDieselLitro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Diesel na Operação Dirigida:</span>
                <span className="text-amber-800 font-mono font-bold">
                  {dieselDirigidoLitros.toLocaleString('pt-BR')} L (R$ {(dieselDirigidoLitros * precoDieselLitro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Diesel Economizado:</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {dieselEconomizadoLitros.toLocaleString('pt-BR')} L ({percentualEconomiaDiesel}%)
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Economia Financeira Líquida</div>
                  <div className="text-lg font-black text-emerald-900">
                    R$ {economiaFinanceiraReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default CompactacaoSoloModule;
