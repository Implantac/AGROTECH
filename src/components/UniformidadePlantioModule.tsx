import React, { useState } from 'react';
import {
  Tractor,
  Sliders,
  CheckCircle2,
  Download,
  Gauge,
  Info
} from 'lucide-react';

interface LinhaPlantadeiraAuditada {
  numeroLinha: number;
  dosadorTipo: string;
  pressaoVacuoMbar: number;
  velocidadePlantioKmh: number;
  espacamentosCm: number[];
}

const LINHAS_AUDITADAS_INICIAIS: LinhaPlantadeiraAuditada[] = [
  {
    numeroLinha: 1,
    dosadorTipo: 'Pneumático Precision Planting vSet2',
    pressaoVacuoMbar: 48,
    velocidadePlantioKmh: 5.5,
    espacamentosCm: [14.2, 14.5, 14.1, 13.9, 14.8, 14.0, 14.4, 14.3, 14.2, 14.6], // Linha excelente
  },
  {
    numeroLinha: 8,
    dosadorTipo: 'Pneumático Precision Planting vSet2',
    pressaoVacuoMbar: 62, // Vácuo excessivo causando duplas
    velocidadePlantioKmh: 5.5,
    espacamentosCm: [14.0, 6.8, 14.2, 7.1, 14.5, 13.8, 6.5, 14.4, 14.1, 14.7], // Muitas duplas
  },
  {
    numeroLinha: 16,
    dosadorTipo: 'Pneumático Precision Planting vSet2',
    pressaoVacuoMbar: 34, // Vácuo baixo causando falhas
    velocidadePlantioKmh: 7.8, // Velocidade alta
    espacamentosCm: [14.5, 28.2, 14.1, 29.5, 14.0, 14.4, 30.1, 13.9, 14.2, 14.8], // Muitas falhas
  },
];

export const UniformidadePlantioModule: React.FC = () => {
  const [linhas] = useState<LinhaPlantadeiraAuditada[]>(LINHAS_AUDITADAS_INICIAIS);
  const [linhaSelecionada, setLinhaSelecionada] = useState<LinhaPlantadeiraAuditada>(LINHAS_AUDITADAS_INICIAIS[0]);

  // Parâmetros de Projeto
  const [espacamentoRefCm, setEspacamentoRefCm] = useState<number>(14.3); // 14,3 cm para 260.000 plantas/ha a 45cm
  const [areaTalhaoHa, setAreaTalhaoHa] = useState<number>(450);
  const [precoSacaSoja, setPrecoSacaSoja] = useState<number>(132.0);

  // Classificação Kurachi (ISO 7256-1)
  const limiteDuplaMax = 0.5 * espacamentoRefCm; // < 7.15 cm
  const limiteFalhaMin = 1.5 * espacamentoRefCm; // > 21.45 cm

  let duplasQtd = 0;
  let falhasQtd = 0;
  let normaisQtd = 0;

  linhaSelecionada.espacamentosCm.forEach((dist) => {
    if (dist < limiteDuplaMax) duplasQtd++;
    else if (dist > limiteFalhaMin) falhasQtd++;
    else normaisQtd++;
  });

  const totalAmostras = linhaSelecionada.espacamentosCm.length;
  const normalPct = Number(((normaisQtd / totalAmostras) * 100).toFixed(1));
  const duplasPct = Number(((duplasQtd / totalAmostras) * 100).toFixed(1));
  const falhasPct = Number(((falhasQtd / totalAmostras) * 100).toFixed(1));

  // Coeficiente de Variação (CV%)
  const media = linhaSelecionada.espacamentosCm.reduce((acc, v) => acc + v, 0) / totalAmostras;
  const variancia =
    linhaSelecionada.espacamentosCm.reduce((acc, v) => acc + Math.pow(v - media, 2), 0) / (totalAmostras - 1);
  const desvioPadrao = Math.sqrt(variancia);
  const cvPct = Number(((desvioPadrao / media) * 100).toFixed(1));

  // Estimativa de Quebra por Desuniformidade (0.15 sc/ha para cada 1% de CV acima de 15%)
  const cvExcedente = Math.max(0, cvPct - 15.0);
  const perdaEstimadaScHa = Number((cvExcedente * 0.15).toFixed(1));
  const prejuizoTalhaoReais = perdaEstimadaScHa * areaTalhaoHa * precoSacaSoja;

  const statusClassificacao =
    cvPct < 15.0 ? 'EXCELENTE' : cvPct <= 30.0 ? 'ACEITAVEL_REGULAR' : 'CRITICO_DESREGULADO';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
              <Tractor className="w-6 h-6 text-emerald-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Distribuição Espacial & Coeficiente de Variação (ISO 7256-1)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Singulação & Kurachi
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Auditoria de linhas de semeadura, percentual de duplas e falhas, cálculo de CV% e prevenção de quebra de safra.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Laudo de Calibração de Singulação da Plantadeira emitido!')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Laudo de Singulação
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">CV% da Linha</div>
              <div className={`text-lg font-bold ${
                cvPct < 15.0 ? 'text-emerald-700' : cvPct <= 30.0 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {cvPct}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Espaçamentos Normais (Kurachi)</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {normalPct}% <span className="text-sm font-normal text-slate-400">({normaisQtd}/{totalAmostras})</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Faixa aceitável: {limiteDuplaMax.toFixed(1)} a {limiteFalhaMin.toFixed(1)} cm
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Duplas & Falhas Detectadas</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {duplasPct}% <span className="text-xs font-normal text-slate-400">duplas</span> • {falhasPct}% <span className="text-xs font-normal text-slate-400">falhas</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Meta agronômica: &lt; 5% de duplas/falhas
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Quebra Estimada por Desuniformidade</div>
          <div className={`text-2xl font-bold mt-1 ${perdaEstimadaScHa === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {perdaEstimadaScHa} <span className="text-sm font-normal text-slate-400">sc/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            R$ {(perdaEstimadaScHa * precoSacaSoja).toFixed(2)}/ha de perda potencial
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Diagnóstico Operacional</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                statusClassificacao === 'EXCELENTE'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : statusClassificacao === 'ACEITAVEL_REGULAR'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusClassificacao === 'EXCELENTE' ? 'Calibração Perfeita' : statusClassificacao === 'ACEITAVEL_REGULAR' ? 'Alerta de Ajuste' : 'Linha Desregulada'}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            Vácuo: {linhaSelecionada.pressaoVacuoMbar} mbar • {linhaSelecionada.velocidadePlantioKmh} km/h
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Linhas Auditadas vs Simulador Econômico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Auditoria por Linha da Plantadeira (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Auditoria por Linha da Plantadeira (24 Linhas)
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Precision Planting vSet</span>
            </div>

            {/* Selector of Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              {linhas.map((l) => {
                const isSelected = l.numeroLinha === linhaSelecionada.numeroLinha;
                return (
                  <button
                    key={l.numeroLinha}
                    onClick={() => setLinhaSelecionada(l)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Linha {l.numeroLinha}</span>
                      <span className="text-[10px] text-slate-500">{l.pressaoVacuoMbar} mbar</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{l.velocidadePlantioKmh} km/h</div>
                  </button>
                );
              })}
            </div>

            {/* Visual Spacing Distribution Bar */}
            <div className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <div className="flex justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                <span>Espaçamentos Amostrados na Linha (cm)</span>
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Normal</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Dupla (&lt;{limiteDuplaMax.toFixed(1)}cm)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Falha (&gt;{limiteFalhaMin.toFixed(1)}cm)</span>
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {linhaSelecionada.espacamentosCm.map((dist, idx) => {
                  const isDupla = dist < limiteDuplaMax;
                  const isFalha = dist > limiteFalhaMin;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-center font-mono text-xs font-bold ${
                        isDupla
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : isFalha
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <div className="text-[9px] text-slate-400">#{idx + 1}</div>
                      <div>{dist.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Prescription Guidance */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  {linhaSelecionada.pressaoVacuoMbar > 55 ? (
                    <span><strong>Causa Raiz:</strong> Vácuo excessivo ({linhaSelecionada.pressaoVacuoMbar} mbar). Reduza a sucção da turbina para ~48 mbar e verifique o raspador do disco para eliminar sementes duplas no mesmo furo.</span>
                  ) : linhaSelecionada.pressaoVacuoMbar < 40 ? (
                    <span><strong>Causa Raiz:</strong> Vácuo insuficiente ({linhaSelecionada.pressaoVacuoMbar} mbar) e velocidade alta ({linhaSelecionada.velocidadePlantioKmh} km/h). Eleve a sucção e reduza a velocidade para o limite de 6.0 km/h para eliminar falhas.</span>
                  ) : (
                    <span><strong>Linha em Condição Ideal:</strong> Singulação de 100% com distribuição homogênea de plantas, maximizando o aproveitamento de radiação solar e área foliar.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Impact Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Impacto Econômico da Singulação
                </h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Quebra Oculta
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Simule o prejuízo potencial de uma plantadeira desregulada operando com alto coeficiente de variação.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Espaçamento Teórico Nominal (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={espacamentoRefCm}
                  onChange={(e) => setEspacamentoRefCm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Área Total Semeada (ha)</label>
                <input
                  type="number"
                  step="50"
                  value={areaTalhaoHa}
                  onChange={(e) => setAreaTalhaoHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Cotação da Soja (R$/sc)</label>
                <input
                  type="number"
                  step="1"
                  value={precoSacaSoja}
                  onChange={(e) => setPrecoSacaSoja(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Substitution Results Output Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">CV% Medido:</span>
                <span className={`font-bold ${cvPct < 15.0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {cvPct}% (Meta: &lt; 15%)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Perda Estimada:</span>
                <span className="text-rose-700 font-bold">
                  {perdaEstimadaScHa} sc/ha
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Prejuízo Potencial Evitado:</span>
                <span className="text-rose-700 font-bold text-base">
                  R$ {prejuizoTalhaoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-800">Retorno da Calibração da Linha</div>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    Ajustar o vácuo de {linhaSelecionada.pressaoVacuoMbar} mbar preserva até <strong>{perdaEstimadaScHa} sc/ha</strong>.
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default UniformidadePlantioModule;
