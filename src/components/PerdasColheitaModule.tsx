import React, { useState } from 'react';
import {
  Tractor,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  SlidersHorizontal,
  Scale,
  Sparkles
} from 'lucide-react';

interface AmostragemPerda {
  id: string;
  talhaoNome: string;
  cultura: 'Soja' | 'Milho Safrinha';
  colheitadeira: string;
  operador: string;
  dataHora: string;
  graosM2: number;
  pmsGramas: number;
  perdaPreColheitaScHa: number;
  perdaPlataformaScHa: number;
  perdaInternaScHa: number; // rotor/peneira
  areaTalhaoHa: number;
  statusAuditoria: 'CONFORME' | 'ALERTA_MODERADO' | 'CRITICO';
}

const AMOSTRAGENS_INICIAIS: AmostragemPerda[] = [
  {
    id: 'prd-01',
    talhaoNome: 'Talhão 01 - Sede / Pivô',
    cultura: 'Soja',
    colheitadeira: 'John Deere S790 (Draper 45ft)',
    operador: 'Robson Silveira',
    dataHora: '2026-09-28 10:45',
    graosM2: 84,
    pmsGramas: 175,
    perdaPreColheitaScHa: 0.25,
    perdaPlataformaScHa: 0.95,
    perdaInternaScHa: 1.25,
    areaTalhaoHa: 500,
    statusAuditoria: 'CRITICO',
  },
  {
    id: 'prd-02',
    talhaoNome: 'Talhão 02 - Chapadão Alto',
    cultura: 'Soja',
    colheitadeira: 'Case IH Axial-Flow 8250 (Draper 40ft)',
    operador: 'Valdir Mendonça',
    dataHora: '2026-09-28 09:15',
    graosM2: 32,
    pmsGramas: 172,
    perdaPreColheitaScHa: 0.15,
    perdaPlataformaScHa: 0.35,
    perdaInternaScHa: 0.42,
    areaTalhaoHa: 420,
    statusAuditoria: 'CONFORME',
  },
  {
    id: 'prd-03',
    talhaoNome: 'Talhão 04 - Corredor Norte',
    cultura: 'Soja',
    colheitadeira: 'New Holland CR 8.90 Dual Rotor (Draper 45ft)',
    operador: 'Carlos Eduardo',
    dataHora: '2026-09-27 16:30',
    graosM2: 52,
    pmsGramas: 170,
    perdaPreColheitaScHa: 0.20,
    perdaPlataformaScHa: 0.62,
    perdaInternaScHa: 0.65,
    areaTalhaoHa: 380,
    statusAuditoria: 'ALERTA_MODERADO',
  },
];

export const PerdasColheitaModule: React.FC = () => {
  const [amostragens] = useState<AmostragemPerda[]>(AMOSTRAGENS_INICIAIS);
  const [selecionada, setSelecionada] = useState<AmostragemPerda>(AMOSTRAGENS_INICIAIS[0]);
  
  // Parâmetros Interativos de Auditoria Embrapa
  const [precoSacaSoja] = useState<number>(130.0);
  const [limiteToleravelEmbrapa] = useState<number>(1.0); // 1 sc/ha soja

  // Simulador de Regulagem Mecânica da Colheitadeira
  const [rotacaoRotor, setRotacaoRotor] = useState<number>(580); // RPM
  const [aberturaConcavo, setAberturaConcavo] = useState<number>(24); // mm
  const [rotacaoVentilador, setRotacaoVentilador] = useState<number>(940); // RPM
  const [velocidadeKmH, setVelocidadeKmH] = useState<number>(6.2); // km/h

  // Cálculos Técnicos da Amostragem Selecionada
  const gramasM2 = Number(((selecionada.graosM2 * selecionada.pmsGramas) / 1000).toFixed(2));
  const kgHaTotal = gramasM2 * 10;
  const perdaTotalScHa = Number((kgHaTotal / 60).toFixed(2));
  
  // Perda exclusiva da colheitadeira (sem pré-colheita)
  const perdaMecanicaScHa = Number((perdaTotalScHa - selecionada.perdaPreColheitaScHa).toFixed(2));
  const perdaExcedenteScHa = Number(Math.max(0, perdaMecanicaScHa - limiteToleravelEmbrapa).toFixed(2));
  const prejuizoExcedenteTalhao = Number((perdaExcedenteScHa * selecionada.areaTalhaoHa * precoSacaSoja).toFixed(2));

  // Diagnóstico de Regulagem Mecânica
  const impactoRotorConcavo =
    rotacaoRotor > 650
      ? 'Atenção: Alta rotação do rotor (>650 RPM) aumenta risco de quebra mecânica de grãos (bandinha).'
      : rotacaoRotor < 480
      ? 'Atenção: Baixa rotação do rotor (<480 RPM) causa debulha incompleta nas vagens.'
      : 'Rotação do rotor na faixa ideal para umidade atual (13.5%).';

  const impactoVentilador =
    rotacaoVentilador > 1000
      ? 'Alerta: Vento excessivo sopra grãos leves junto com a palhada nas peneiras.'
      : rotacaoVentilador < 880
      ? 'Alerta: Vento insuficiente gera excesso de impureza no tanque graneleiro.'
      : 'Fluxo de ar do ventilador limpa a palha sem arremessar grãos fora.';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
              <Scale className="w-6 h-6 text-amber-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Auditoria de Perdas na Colheita & Regulagem de Máquinas
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                  Método Embrapa
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Monitoramento de perdas na barra de corte, separação interna, ventilador e economia de sacas por hectare.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Ordem de Regulagem Mecânica enviada via Telemetria para o operador!')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Emitir Ordem de Regulagem
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Perda Mecânica Atual</div>
          <div className={`text-2xl font-bold mt-1 ${perdaMecanicaScHa > 1.0 ? 'text-rose-700' : 'text-emerald-700'}`}>
            {perdaMecanicaScHa} <span className="text-sm font-normal text-slate-400">sc/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Tolerância Embrapa: {limiteToleravelEmbrapa.toFixed(1)} sc/ha
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Perda Excedente Evitável</div>
          <div className={`text-2xl font-bold mt-1 ${perdaExcedenteScHa > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {perdaExcedenteScHa} <span className="text-sm font-normal text-slate-400">sc/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {perdaExcedenteScHa > 0 ? 'Acima do limite agronômico' : 'Operação 100% eficiente'}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Prejuízo Financeiro Talhão</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            R$ {prejuizoExcedenteTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {selecionada.areaTalhaoHa} ha @ R$ {precoSacaSoja.toFixed(2)}/sc
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Status Operacional</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                selecionada.statusAuditoria === 'CRITICO'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : selecionada.statusAuditoria === 'ALERTA_MODERADO'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {selecionada.statusAuditoria === 'CRITICO' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  REGULAGEM URGENTE
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  DENTRO DA META
                </>
              )}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {selecionada.colheitadeira}
          </div>
        </div>
      </div>

      {/* Main Grid: Machine Audits + Diagnostic vs Live Calibrator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sample Records & Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Amostragens no Rastro da Ceifadora (Armação 1 m²)
                </h2>
              </div>
              <span className="text-xs text-slate-500">Atualizado via App Campo</span>
            </div>

            {/* List of Harvest Audits */}
            <div className="space-y-3 mb-6">
              {amostragens.map((amostra) => {
                const totalSc = Number((((amostra.graosM2 * amostra.pmsGramas) / 100) / 60).toFixed(2));
                const isSelected = selecionada.id === amostra.id;
                return (
                  <div
                    key={amostra.id}
                    onClick={() => setSelecionada(amostra)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Tractor className="w-4 h-4 text-amber-700" />
                          {amostra.colheitadeira}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {amostra.talhaoNome} • Op: {amostra.operador} • {amostra.dataHora}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Contagem</div>
                          <div className="text-sm font-bold text-slate-900">{amostra.graosM2} grãos/m²</div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            amostra.statusAuditoria === 'CRITICO'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : amostra.statusAuditoria === 'ALERTA_MODERADO'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {totalSc} sc/ha
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decomposition of Losses: Pre-harvest vs Header vs Internal */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-700" />
                Decomposição Técnica das Perdas ({selecionada.colheitadeira})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Perda Pré-Colheita</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">
                    {selecionada.perdaPreColheitaScHa} sc/ha
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Vagens caídas antes da ceifa</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Perda na Plataforma (Draper)</div>
                  <div className="text-lg font-bold text-amber-700 mt-1">
                    {selecionada.perdaPlataformaScHa} sc/ha
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Molinete e navalhas de corte</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Perda Interna (Trilha/Peneiras)</div>
                  <div className="text-lg font-bold text-rose-700 mt-1">
                    {selecionada.perdaInternaScHa} sc/ha
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Rotor axial, côncavo e vento</div>
                </div>
              </div>

              {/* Loss Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Composição Total: {perdaTotalScHa} sc/ha</span>
                  <span className="text-amber-800 font-medium">Meta Máxima: 1,00 sc/ha</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    title="Pré-colheita"
                    className="bg-slate-400 h-full"
                    style={{ width: `${(selecionada.perdaPreColheitaScHa / perdaTotalScHa) * 100}%` }}
                  />
                  <div
                    title="Plataforma"
                    className="bg-amber-500 h-full"
                    style={{ width: `${(selecionada.perdaPlataformaScHa / perdaTotalScHa) * 100}%` }}
                  />
                  <div
                    title="Mecanismo Interno"
                    className="bg-rose-500 h-full"
                    style={{ width: `${(selecionada.perdaInternaScHa / perdaTotalScHa) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Cinza: Pré-colheita</span>
                  <span>Amarelo: Plataforma</span>
                  <span>Vermelho: Mecanismos Internos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calibrator & Machine Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Regulagem de Campo
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                CAN Bus Sync
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Ajuste fino dos parâmetros operacionais para mitigar perdas nas peneiras sem danificar a qualidade do grão.
            </p>

            <div className="space-y-4">
              {/* Rotor RPM Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Rotação do Rotor Axial</span>
                  <span className="text-amber-800 font-bold">{rotacaoRotor} RPM</span>
                </div>
                <input
                  type="range"
                  min="420"
                  max="750"
                  step="10"
                  value={rotacaoRotor}
                  onChange={(e) => setRotacaoRotor(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>420 RPM</span>
                  <span>Faixa Recomendada: 520 - 620 RPM</span>
                  <span>750 RPM</span>
                </div>
              </div>

              {/* Concave Clearance Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Abertura do Côncavo</span>
                  <span className="text-amber-800 font-bold">{aberturaConcavo} mm</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="35"
                  step="1"
                  value={aberturaConcavo}
                  onChange={(e) => setAberturaConcavo(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>14 mm (Fechado)</span>
                  <span>24 mm (Ideal)</span>
                  <span>35 mm (Aberto)</span>
                </div>
              </div>

              {/* Fan RPM Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Rotação do Ventilador (Limpeza)</span>
                  <span className="text-amber-800 font-bold">{rotacaoVentilador} RPM</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="1150"
                  step="10"
                  value={rotacaoVentilador}
                  onChange={(e) => setRotacaoVentilador(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>800 RPM</span>
                  <span>900 - 960 RPM</span>
                  <span>1150 RPM</span>
                </div>
              </div>

              {/* Forward Speed Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">Velocidade de Avanço da Colheitadeira</span>
                  <span className="text-amber-800 font-bold">{velocidadeKmH} km/h</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="9.0"
                  step="0.1"
                  value={velocidadeKmH}
                  onChange={(e) => setVelocidadeKmH(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>4.0 km/h</span>
                  <span>5.5 - 6.5 km/h</span>
                  <span>9.0 km/h</span>
                </div>
              </div>
            </div>

            {/* Smart Diagnostics Box */}
            <div className="mt-6 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-xs">
              <div className="text-amber-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Diagnóstico de Telemetria Integrada:
              </div>
              <p className="text-slate-600">{impactoRotorConcavo}</p>
              <p className="text-slate-600">{impactoVentilador}</p>
              {velocidadeKmH > 7.0 && (
                <p className="text-rose-700 font-medium">
                  ⚠️ Velocidade de avanço ({velocidadeKmH} km/h) sobrecarrega o côncavo e eleva perdas na plataforma. Reduza para 6.0 km/h.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default PerdasColheitaModule;
