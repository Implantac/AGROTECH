import React, { useState } from 'react';
import {
  Sun,
  Zap,
  TrendingUp,
  DollarSign,
  Calculator,
  Download,
  CheckCircle2,
  AlertCircle,
  BatteryCharging,
  Layers,
  Sparkles,
  Droplet
} from 'lucide-react';

interface UsinaSolarRural {
  id: string;
  nomeUsina: string;
  finalidadeAtendimento: string;
  potenciaKwp: number;
  inversores: string;
  modulosQtd: number;
  geracaoMensalKwh: number;
  consumoMensalKwh: number;
  saldoCreditosKwh: number;
  custoImplantacaoRs: number;
  economiaAnualRs: number;
  paybackAnos: number;
  statusConexao: 'CONECTADA_ON_GRID' | 'EXPANSAO_FASE_2';
}

const USINAS_INICIAIS: UsinaSolarRural[] = [
  {
    id: 'usina-01',
    nomeUsina: 'UFV 01 - Usina Solar Pivô Central (750 kWp)',
    finalidadeAtendimento: 'Alimentação 100% Fotovoltaica de 2 Pivôs Centrais (240 ha)',
    potenciaKwp: 750,
    inversores: '2x Inversores Centrais Sungrow 350kW com Trackers 1P',
    modulosQtd: 1360,
    geracaoMensalKwh: 94770,
    consumoMensalKwh: 64700,
    saldoCreditosKwh: 30070,
    custoImplantacaoRs: 2450000.0,
    economiaAnualRs: 1000771.2,
    paybackAnos: 2.45,
    statusConexao: 'CONECTADA_ON_GRID',
  },
  {
    id: 'usina-02',
    nomeUsina: 'UFV 02 - Usina Solar Sede & Armazém (450 kWp)',
    finalidadeAtendimento: 'Secador de Grãos, Silos, Almoxarifado e Escritório Central',
    potenciaKwp: 450,
    inversores: '4x Inversores String Huawei 100kW (Estrutura Solo Fixa)',
    modulosQtd: 818,
    geracaoMensalKwh: 56860,
    consumoMensalKwh: 48200,
    saldoCreditosKwh: 8660,
    custoImplantacaoRs: 1480000.0,
    economiaAnualRs: 600441.6,
    paybackAnos: 2.46,
    statusConexao: 'CONECTADA_ON_GRID',
  },
  {
    id: 'usina-03',
    nomeUsina: 'UFV 03 - Usina Solar Confinamento & Biofábrica (300 kWp)',
    finalidadeAtendimento: 'Misturadores de Ração, Biorreatores Inox e Bombeamento',
    potenciaKwp: 300,
    inversores: '3x Inversores Deye 100kW com Sistema Híbrido',
    modulosQtd: 545,
    geracaoMensalKwh: 37900,
    consumoMensalKwh: 32000,
    saldoCreditosKwh: 5900,
    custoImplantacaoRs: 1020000.0,
    economiaAnualRs: 400224.0,
    paybackAnos: 2.55,
    statusConexao: 'CONECTADA_ON_GRID',
  },
];

export const EnergiaSolarIrrigacaoModule: React.FC = () => {
  const [usinas] = useState<UsinaSolarRural[]>(USINAS_INICIAIS);
  const [usinaSelecionada, setUsinaSelecionada] = useState<UsinaSolarRural>(USINAS_INICIAIS[0]);

  // Simulador Dinâmico de Tarifa e Compensação (Lei 14.300/22)
  const [tarifaKwhRs, setTarifaKwhRs] = useState<number>(0.88); // R$/kWh Energisa MT
  const [horasSolPlenoHsp, setHorasSolPlenoHsp] = useState<number>(5.4); // Sorriso/MT

  // Cálculos Técnicos Atualizados
  const geracaoRecalculadaMensal = Number(
    (usinaSelecionada.potenciaKwp * horasSolPlenoHsp * 30 * 0.78).toFixed(0)
  );
  const saldoCreditos = Math.max(0, geracaoRecalculadaMensal - usinaSelecionada.consumoMensalKwh);
  const economiaMensalBruta = Number((Math.min(usinaSelecionada.consumoMensalKwh, geracaoRecalculadaMensal) * tarifaKwhRs).toFixed(2));
  const creditosExcedentesMensais = Number((saldoCreditos * tarifaKwhRs).toFixed(2));
  const economiaAnualTotal = Number(((economiaMensalBruta + creditosExcedentesMensais) * 12).toFixed(2));
  const paybackRecalculado = Number((usinaSelecionada.custoImplantacaoRs / economiaAnualTotal).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-stone-950 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl">
                <Sun className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Energia Solar Rural & Eletrificação de Pivôs (Lei 14.300)
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Geração Distribuída GD
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Autoconsumo remoto para pivôs centrais, secadores de grãos e compensação tarifária de créditos (SCEE).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Balanço Energético e Telemetria Solar exportados com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-amber-900/30"
            >
              <Download className="w-4 h-4" />
              Balanço Solar
            </button>
            <div className="text-right pl-4 border-l border-amber-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Economia Anual Total</div>
              <div className="text-xl font-bold text-emerald-300">
                R$ {economiaAnualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Geração Fotovoltaica Mensal</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {geracaoRecalculadaMensal.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">kWh</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Média de {horasSolPlenoHsp} HSP (Horas de Sol Pleno)
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Créditos Excedentes Injetados</div>
          <div className="text-2xl font-bold text-teal-300 mt-1">
            +{saldoCreditos.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">kWh/mês</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            R$ {creditosExcedentesMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em créditos na Energisa
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Payback do Investimento</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {paybackRecalculado} <span className="text-sm font-normal text-stone-400">anos</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Investimento: R$ {usinaSelecionada.custoImplantacaoRs.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Status Operacional</div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% OPERANDO ON-GRID
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {usinaSelecionada.potenciaKwp} kWp instalados
          </div>
        </div>
      </div>

      {/* Main Dual Column: Usinas vs Simulador Tarifário */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lista de Usinas Solares (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Usinas Solares Fotovoltaicas da Fazenda
                </h2>
              </div>
              <span className="text-xs text-stone-400">Telemetria IoT de Inversores</span>
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
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          {u.nomeUsina}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {u.finalidadeAtendimento}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Potência</div>
                          <div className="text-sm font-bold text-amber-300">{u.potenciaKwp} kWp</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                          {u.modulosQtd} módulos
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Technical Inverter & Tracker Info */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-amber-400" />
                Dados do Sistema: {usinaSelecionada.nomeUsina}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Inversores & Trackers</div>
                  <div className="text-sm font-bold text-white mt-1">
                    {usinaSelecionada.inversores}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Rastreamento solar biaxial</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Consumo da Carga</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    {usinaSelecionada.consumoMensalKwh.toLocaleString('pt-BR')} kWh/mês
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Motores dos pivôs e bombas</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Economia Anual</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    R$ {economiaAnualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Sem risco de bandeira tarifária</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tarifa & Payback Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador de Tarifa & Payback
                </h2>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                Energisa MT
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule a irradiação solar e a tarifa da distribuidora para apurar o tempo exato de retorno do investimento fotovoltaico.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-stone-400 font-medium block mb-1">Tarifa de Energia com Impostos (R$/kWh)</label>
                <input
                  type="number"
                  step="0.05"
                  value={tarifaKwhRs}
                  onChange={(e) => setTarifaKwhRs(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-400 font-medium">Irradiação Solar Local (HSP kWh/m²/dia)</span>
                  <span className="text-amber-300 font-bold">{horasSolPlenoHsp} HSP</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="6.2"
                  step="0.1"
                  value={horasSolPlenoHsp}
                  onChange={(e) => setHorasSolPlenoHsp(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>4.5 HSP (Sul/Sudeste)</span>
                  <span>5.4 HSP (Centro-Oeste MT)</span>
                  <span>6.2 HSP (Nordeste/BA)</span>
                </div>
              </div>
            </div>

            {/* Financial Result Card */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Economia Mensal na Fatura:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  R$ {economiaMensalBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Créditos de Energia Injetados:</span>
                <span className="text-teal-300 font-semibold">
                  + R$ {creditosExcedentesMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Retorno do Investimento:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">{paybackRecalculado} anos</div>
                  <div className="text-[10px] text-emerald-500">
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
