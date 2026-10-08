import React, { useState } from 'react';
import {
  Sun,
  Zap,
  BatteryCharging,
  CheckCircle2,
  Download,
  Calculator
} from 'lucide-react';

interface UsinaSolar {
  id: string;
  nomeUsina: string;
  potenciaKwp: number;
  geracaoMensalMediaKwh: number;
  consumoMensalKwh: number;
  economiaAnualRs: number;
  custoImplantacaoRs: number;
  paybackAnos: number;
  finalidadeAtendimento: string;
  inversores: string;
  modulosQtd: number;
}

const USINAS_INICIAIS: UsinaSolar[] = [
  {
    id: 'usn-01',
    nomeUsina: 'Usina Fotovoltaica Central Pivô 01 & 02',
    potenciaKwp: 680,
    geracaoMensalMediaKwh: 94770,
    consumoMensalKwh: 86500,
    economiaAnualRs: 1000771.20,
    custoImplantacaoRs: 2450000,
    paybackAnos: 2.45,
    finalidadeAtendimento: 'Alimentação dos Pivôs de Irrigação 01 e 02 (Alta Tensão A4 Rural)',
    inversores: '4x Sungrow SG125HX com Smart String',
    modulosQtd: 1240,
  },
  {
    id: 'usn-02',
    nomeUsina: 'Usina Solar Silos & Secagem de Grãos',
    potenciaKwp: 450,
    geracaoMensalMediaKwh: 62700,
    consumoMensalKwh: 58000,
    economiaAnualRs: 662112.00,
    custoImplantacaoRs: 1680000,
    paybackAnos: 2.54,
    finalidadeAtendimento: 'Moega, Elevadores e Fornalha de Secagem na Entressafra',
    inversores: '3x Huawei SUN2000-100KTL',
    modulosQtd: 820,
  },
  {
    id: 'usn-03',
    nomeUsina: 'Microgeração Sede & Oficina Mecânica',
    potenciaKwp: 75,
    geracaoMensalMediaKwh: 10450,
    consumoMensalKwh: 9200,
    economiaAnualRs: 110352.00,
    custoImplantacaoRs: 285000,
    paybackAnos: 2.58,
    finalidadeAtendimento: 'Alojamentos, Escritório Corporativo e Oficina de Frotas',
    inversores: '1x Fronius Tauro 50kW',
    modulosQtd: 140,
  },
];

export const EnergiaSolarIrrigacaoModule: React.FC = () => {
  const [usinas] = useState<UsinaSolar[]>(USINAS_INICIAIS);
  const [usinaSelecionada, setUsinaSelecionada] = useState<UsinaSolar>(USINAS_INICIAIS[0]);

  // Simulador de Créditos e Tarifa
  const [tarifaKwhRs, setTarifaKwhRs] = useState<number>(0.88); // R$ 0,88 / kWh
  const [horasSolPlenoHsp, setHorasSolPlenoHsp] = useState<number>(5.4); // 5.4 HSP Mato Grosso

  // Cálculos Recalculados
  const geracaoRecalculadaMensal = Math.round(usinaSelecionada.potenciaKwp * horasSolPlenoHsp * 30 * 0.81); // PR de 81%
  const saldoCreditos = Math.max(0, geracaoRecalculadaMensal - usinaSelecionada.consumoMensalKwh);
  const economiaMensalBruta = Math.min(geracaoRecalculadaMensal, usinaSelecionada.consumoMensalKwh) * tarifaKwhRs;
  const creditosExcedentesMensais = saldoCreditos * tarifaKwhRs * 0.85; // Compensação líquida
  const economiaAnualTotal = (economiaMensalBruta + creditosExcedentesMensais) * 12;
  const paybackRecalculado = Number((usinaSelecionada.custoImplantacaoRs / economiaAnualTotal).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl">
              <Sun className="w-6 h-6 text-amber-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Energia Solar Rural & Eletrificação de Pivôs (Lei 14.300)
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  Geração Distribuída GD
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Autoconsumo remoto para pivôs centrais, secadores de grãos e compensação tarifária de créditos (SCEE).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Balanço Energético e Telemetria Solar exportados com sucesso!')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Balanço Solar
            </button>
            <div className="text-right pl-4 border-l border-slate-200 hidden sm:block">
              <div className="text-[11px] text-slate-500">Economia Anual Total</div>
              <div className="text-lg font-bold text-emerald-700">
                R$ {economiaAnualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Geração Fotovoltaica Mensal</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {geracaoRecalculadaMensal.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-400">kWh</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Média de {horasSolPlenoHsp} HSP (Horas de Sol Pleno)
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Créditos Excedentes Injetados</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            +{saldoCreditos.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-400">kWh/mês</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            R$ {creditosExcedentesMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em créditos na distribuidora
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Payback do Investimento</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {paybackRecalculado} <span className="text-sm font-normal text-slate-400">anos</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Investimento: R$ {usinaSelecionada.custoImplantacaoRs.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="text-xs font-medium text-slate-500">Status Operacional</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% OPERANDO ON-GRID
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {usinaSelecionada.potenciaKwp} kWp instalados
          </div>
        </div>
      </div>

      {/* Main Dual Column: Usinas vs Simulador Tarifário */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Usinas Solares (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Usinas Solares Fotovoltaicas da Fazenda
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Telemetria IoT de Inversores</span>
            </div>

            {/* List of Solar Plants */}
            <div className="space-y-3 mb-6">
              {usinas.map((u) => {
                const isSelected = u.id === usinaSelecionada.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setUsinaSelecionada(u)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-600" />
                          {u.nomeUsina}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {u.finalidadeAtendimento}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Potência</div>
                          <div className="text-sm font-bold text-amber-800">{u.potenciaKwp} kWp</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                          {u.modulosQtd} módulos
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Technical Inverter & Tracker Info */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-amber-600" />
                Dados do Sistema: {usinaSelecionada.nomeUsina}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Inversores & Trackers</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {usinaSelecionada.inversores}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Rastreamento solar biaxial</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Consumo da Carga</div>
                  <div className="text-lg font-bold text-sky-700 mt-1">
                    {usinaSelecionada.consumoMensalKwh.toLocaleString('pt-BR')} kWh/mês
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Motores dos pivôs e bombas</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="text-slate-500">Economia Anual</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    R$ {economiaAnualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sem risco de bandeira tarifária</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tarifa & Payback Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Simulador de Tarifa & Payback
                </h2>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Energisa MT
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5">
              Simule a irradiação solar e a tarifa da distribuidora para apurar o tempo exato de retorno do investimento fotovoltaico.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Tarifa de Energia com Impostos (R$/kWh)</label>
                <input
                  type="number"
                  step="0.05"
                  value={tarifaKwhRs}
                  onChange={(e) => setTarifaKwhRs(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-medium">Irradiação Solar Local (HSP kWh/m²/dia)</span>
                  <span className="text-amber-800 font-bold">{horasSolPlenoHsp} HSP</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="6.2"
                  step="0.1"
                  value={horasSolPlenoHsp}
                  onChange={(e) => setHorasSolPlenoHsp(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>4.5 HSP (Sul/Sudeste)</span>
                  <span>5.4 HSP (Centro-Oeste MT)</span>
                  <span>6.2 HSP (Nordeste/BA)</span>
                </div>
              </div>
            </div>

            {/* Financial Result Card */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Economia Mensal na Fatura:</span>
                <span className="text-emerald-700 font-bold text-sm">
                  R$ {economiaMensalBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Créditos de Energia Injetados:</span>
                <span className="text-sky-700 font-semibold">
                  + R$ {creditosExcedentesMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Retorno do Investimento:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-700">{paybackRecalculado} anos</div>
                  <div className="text-[10px] text-emerald-800">
                    Garantia dos módulos: 25 anos (22+ anos de energia grátis)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default EnergiaSolarIrrigacaoModule;
