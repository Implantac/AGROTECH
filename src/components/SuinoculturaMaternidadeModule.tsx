import React, { useState, useMemo } from 'react';
import {
  Heart,
  Thermometer,
  ShieldCheck,
  Award,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';

interface LoteMaternidade {
  id: string;
  sala: string;
  matrizesAtivas: number;
  nascidosVivosMedia: number;
  taxaEsmagamentoPct: number;
  pesoMedioDesmameKg: number;
  tempEscamoteadorGraus: number;
  status: 'PARTO_ASSISTIDO' | 'COLOSTRAGEM_ATIVA' | 'DESMAME_PROGRAMADO';
}

export const SuinoculturaMaternidadeModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'salas' | 'esmagamento' | 'creep_feeding' | 'simulador'>('salas');

  // Parâmetros do Simulador
  const [matrizesParidasMes, setMatrizesParidasMes] = useState<number>(150);
  const [nascidosVivosPorParto, setNascidosVivosPorParto] = useState<number>(16.0);
  const [taxaEsmagamentoConvencionalPct, setTaxaEsmagamentoConvencionalPct] = useState<number>(10.5);
  const [taxaEsmagamentoSensorizadaPct, setTaxaEsmagamentoSensorizadaPct] = useState<number>(3.5);
  const [pesoDesmameKg, setPesoDesmameKg] = useState<number>(6.8);
  const [precoKgLeitaoDesmamadoReais, setPrecoKgLeitaoDesmamadoReais] = useState<number>(14.5);

  const [salas, setSalas] = useState<LoteMaternidade[]>([
    {
      id: 'MAT-01',
      sala: 'Maternidade A (Topigs Norsvin TN70)',
      matrizesAtivas: 48,
      nascidosVivosMedia: 16.4,
      taxaEsmagamentoPct: 3.2,
      pesoMedioDesmameKg: 6.9,
      tempEscamoteadorGraus: 33.5,
      status: 'COLOSTRAGEM_ATIVA',
    },
    {
      id: 'MAT-02',
      sala: 'Maternidade B (DanBred DB70)',
      matrizesAtivas: 52,
      nascidosVivosMedia: 16.8,
      taxaEsmagamentoPct: 3.8,
      pesoMedioDesmameKg: 6.7,
      tempEscamoteadorGraus: 32.8,
      status: 'PARTO_ASSISTIDO',
    },
    {
      id: 'MAT-03',
      sala: 'Maternidade C (Agroceres PIC Camborough)',
      matrizesAtivas: 50,
      nascidosVivosMedia: 15.9,
      taxaEsmagamentoPct: 3.1,
      pesoMedioDesmameKg: 7.1,
      tempEscamoteadorGraus: 33.0,
      status: 'DESMAME_PROGRAMADO',
    },
  ]);

  const metricas = useMemo(() => {
    const totalLeitoesNascidosVivos = Math.round(matrizesParidasMes * nascidosVivosPorParto);
    const mortesConvencionais = Math.round(
      totalLeitoesNascidosVivos * (taxaEsmagamentoConvencionalPct / 100)
    );
    const mortesSensorizadas = Math.round(
      totalLeitoesNascidosVivos * (taxaEsmagamentoSensorizadaPct / 100)
    );
    const leitoesSalvosPorTecnologia = mortesConvencionais - mortesSensorizadas;

    const leitoesDesmamadosTotal = totalLeitoesNascidosVivos - mortesSensorizadas;
    const receitaBrutaLoteReais = Number(
      (leitoesDesmamadosTotal * pesoDesmameKg * precoKgLeitaoDesmamadoReais).toFixed(2)
    );
    const receitaAdicionalSalvaReais = Number(
      (leitoesSalvosPorTecnologia * pesoDesmameKg * precoKgLeitaoDesmamadoReais).toFixed(2)
    );

    return {
      totalLeitoesNascidosVivos,
      mortesSensorizadas,
      leitoesSalvosPorTecnologia,
      leitoesDesmamadosTotal,
      receitaBrutaLoteReais,
      receitaAdicionalSalvaReais,
    };
  }, [
    matrizesParidasMes,
    nascidosVivosPorParto,
    taxaEsmagamentoConvencionalPct,
    taxaEsmagamentoSensorizadaPct,
    pesoDesmameKg,
    precoKgLeitaoDesmamadoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-600/20">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Suinocultura de Precisão: Maternidade 4.0
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Módulo 117 • Hiperprolificidade, Anti-Esmagamento & Creep Feeding
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Escamoteadores aquecidos por sensores térmicos, redução de mortalidade perinatal para menos de 4% e desmame vigoroso aos 21 dias.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-pink-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador Anti-Esmagamento
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Nascidos Vivos / Parto</span>
            <Heart className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {nascidosVivosPorParto.toFixed(1)} leitões
          </p>
          <span className="text-xs text-pink-400 mt-1 block">
            {metricas.totalLeitoesNascidosVivos.toLocaleString('pt-BR')} no mês
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Leitões Salvos (Sensores)</span>
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            +{metricas.leitoesSalvosPorTecnologia} leitões
          </p>
          <span className="text-xs text-emerald-700 mt-1 block">
            Esmagamento reduzido para {taxaEsmagamentoSensorizadaPct}%
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Faturamento Mensal Lote</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            R$ {(metricas.receitaBrutaLoteReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            {metricas.leitoesDesmamadosTotal} desmamados @ {pesoDesmameKg} kg
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Receita Salva / Mês</span>
            <Award className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            R$ {(metricas.receitaAdicionalSalvaReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-700 mt-1 block">
            Ganho direto por IoT na maternidade
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('salas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'salas'
              ? 'bg-pink-50 text-pink-800 border border-pink-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Layers className="w-4 h-4" />
          Salas de Maternidade
        </button>

        <button
          onClick={() => setActiveTab('esmagamento')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'esmagamento'
              ? 'bg-pink-50 text-pink-800 border border-pink-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Anti-Esmagamento & IoT
        </button>

        <button
          onClick={() => setActiveTab('creep_feeding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'creep_feeding'
              ? 'bg-pink-50 text-pink-800 border border-pink-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          Colostragem & Creep Feeding
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-pink-50 text-pink-800 border border-pink-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'salas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            Salas de Parição Climatizadas com Escamoteadores Automatizados
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Sala / Linhagem</th>
                  <th className="px-4 py-3">Matrizes</th>
                  <th className="px-4 py-3">Nascidos Vivos</th>
                  <th className="px-4 py-3">Esmagamento (%)</th>
                  <th className="px-4 py-3">Peso Desmame</th>
                  <th className="px-4 py-3">Temp. Escamoteador</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salas.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-bold text-slate-900">{s.sala}</td>
                    <td className="px-4 py-3">{s.matrizesAtivas} porcas</td>
                    <td className="px-4 py-3 font-bold text-pink-400">{s.nascidosVivosMedia} leitões</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{s.taxaEsmagamentoPct}%</td>
                    <td className="px-4 py-3">{s.pesoMedioDesmameKg} kg</td>
                    <td className="px-4 py-3 text-yellow-400 font-semibold">{s.tempEscamoteadorGraus}°C</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'esmagamento' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-pink-400" />
              <h4 className="text-sm font-semibold text-slate-900">Câmera Térmica & Visão Computacional</h4>
            </div>
            <p className="text-xs text-slate-600">
              Sensor óptico detecta quando a matriz inicia movimento de deitar e emite sinal sonoro de alerta ou ativação de jato de ar para afastar os leitões da zona de risco.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Eficácia Anti-Esmagamento:</span>
              <span className="text-sm font-bold text-emerald-700 block">-66.7% nas mortes nas primeiras 72h</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-slate-900">Escamoteador com Piso Aquecido</h4>
            </div>
            <p className="text-xs text-slate-600">
              O leitão recém-nascido necessita de 32°C a 34°C, enquanto a porca necessita de 18°C a 20°C. O microclima do ninho atrai o leitão para longe do corpo da matriz.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Temperatura Ideal do Ninho:</span>
              <span className="text-sm font-bold text-yellow-400 block">33.0°C nas primeiras 48h</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-semibold text-slate-900">Gaiola com Barra de Proteção Inclinada</h4>
            </div>
            <p className="text-xs text-slate-600">
              Barras laterais tubulares que desaceleram a descida da matriz ao chão, permitindo tempo de fuga e reação dos leitões menores.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Meta Zootécnica:</span>
              <span className="text-sm font-bold text-emerald-700 block">taxa menor que 4.0% de esmagamento</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'creep_feeding' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-pink-400" />
            Manejo do Colostro nas Primeiras 6 Horas & Ração Pré-Inicial
          </h3>
          <p className="text-sm text-slate-600">
            A ingestão mínima de 250g de colostro por leitão garante imunoglobulinas maternas essenciais. O fornecimento de ração peletizada com plasma a partir do 7º dia treina o trato gastrointestinal para o desmame sem quebra de curva.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Ingestão Mínima de Colostro</span>
              <p className="text-lg font-bold text-emerald-700 mt-1">superior a 250g / leitão</p>
              <span className="text-[11px] text-emerald-500/80">Nas primeiras 6 horas pós-parto</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Início do Creep Feeding</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">7º dia de vida</p>
              <span className="text-[11px] text-slate-500">Ração altamente palatável em comedouro raso</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Peso Meta de Desmame (21d)</span>
              <p className="text-lg font-bold text-slate-900 mt-1">superior a 6.5 kg</p>
              <span className="text-[11px] text-slate-500">Garante ganho compensatório na creche</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-pink-400" />
            Simulador de Sobrevivência & Receita de Leitões Salvos por Tecnologia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Matrizes Paridas / Mês</label>
              <input
                type="number"
                value={matrizesParidasMes}
                onChange={(e) => setMatrizesParidasMes(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Nascidos Vivos / Parto</label>
              <input
                type="number"
                step="0.1"
                value={nascidosVivosPorParto}
                onChange={(e) => setNascidosVivosPorParto(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Esmagamento Sensorizado (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxaEsmagamentoSensorizadaPct}
                onChange={(e) => setTaxaEsmagamentoSensorizadaPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço Leitão Desmamado (R$/kg)</label>
              <input
                type="number"
                step="0.1"
                value={precoKgLeitaoDesmamadoReais}
                onChange={(e) => setPrecoKgLeitaoDesmamadoReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Impacto da Tecnologia IoT no Mês:</span>
              <span className="text-base font-bold text-emerald-700">
                +{metricas.leitoesSalvosPorTecnologia} leitões preservados com vida
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Receita Adicional Gerada no Mês:</span>
              <span className="text-xl font-bold text-emerald-700">
                +R$ {metricas.receitaAdicionalSalvaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
