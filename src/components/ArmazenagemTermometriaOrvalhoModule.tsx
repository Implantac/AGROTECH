import React, { useState, useMemo } from 'react';
import {
  Warehouse,
  Thermometer,
  Wind,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Scale,
} from 'lucide-react';

interface SiloArmazenagemStatus {
  id: string;
  silo: string;
  capacidadeToneladas: number;
  graoArmazenado: 'SOJA' | 'MILHO' | 'TRIGO' | 'ARROZ_CASCA';
  temperaturaMediaGraosC: number;
  temperaturaPontoMaisQuenteC: number;
  umidadeGraosPct: number;
  statusAeracao: 'AERACAO_LIGADA' | 'AERACAO_BLOQUEADA' | 'CONDENSACAO_ALERTA';
  potenciaVentiladoresCv: number;
}

export const ArmazenagemTermometriaOrvalhoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'silos' | 'psicrometria' | 'termometria' | 'simulador'>('silos');

  // Parâmetros do Simulador
  const [toneladasArmazenadasTotal, setToneladasArmazenadasTotal] = useState<number>(35000);
  const [temperaturaMediaGraosC, setTemperaturaMediaGraosC] = useState<number>(26.5);
  const [temperaturaAmbienteC, setTemperaturaAmbienteC] = useState<number>(18.0);
  const [umidadeRelativaAmbientePct, setUmidadeRelativaAmbientePct] = useState<number>(62.0);
  const [precoSacaSojaReais, setPrecoSacaSojaReais] = useState<number>(132.5);
  const [perdaEvitadaDeterioracaoPct, setPerdaEvitadaDeterioracaoPct] = useState<number>(1.2);

  const [silos, setSilos] = useState<SiloArmazenagemStatus[]>([
    {
      id: 'SILO-01',
      silo: 'Silo Vertical 01 (Base Oeste)',
      capacidadeToneladas: 12000,
      graoArmazenado: 'SOJA',
      temperaturaMediaGraosC: 22.4,
      temperaturaPontoMaisQuenteC: 24.8,
      umidadeGraosPct: 13.2,
      statusAeracao: 'AERACAO_LIGADA',
      potenciaVentiladoresCv: 150,
    },
    {
      id: 'SILO-02',
      silo: 'Silo Vertical 02 (Base Central)',
      capacidadeToneladas: 12000,
      graoArmazenado: 'MILHO',
      temperaturaMediaGraosC: 25.8,
      temperaturaPontoMaisQuenteC: 29.2,
      umidadeGraosPct: 13.8,
      statusAeracao: 'AERACAO_LIGADA',
      potenciaVentiladoresCv: 150,
    },
    {
      id: 'SILO-03',
      silo: 'Silo Pulmão 03 (Recebimento)',
      capacidadeToneladas: 6000,
      graoArmazenado: 'SOJA',
      temperaturaMediaGraosC: 28.5,
      temperaturaPontoMaisQuenteC: 33.1,
      umidadeGraosPct: 14.5,
      statusAeracao: 'CONDENSACAO_ALERTA',
      potenciaVentiladoresCv: 75,
    },
  ]);

  const metricas = useMemo(() => {
    // Cálculo do Ponto de Orvalho (Magnus-Tetens)
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperaturaAmbienteC) / (b + temperaturaAmbienteC)) + Math.log(umidadeRelativaAmbientePct / 100);
    const pontoOrvalhoC = Number(((b * alpha) / (a - alpha)).toFixed(1));

    const aeracaoSegura = temperaturaAmbienteC < temperaturaMediaGraosC && pontoOrvalhoC < (temperaturaMediaGraosC - 4.0);
    const riscoCondensacao = pontoOrvalhoC >= (temperaturaMediaGraosC - 2.0);

    const sacasTotais = Number(((toneladasArmazenadasTotal * 1000) / 60).toFixed(0));
    const sacasSalvasAno = Number(((sacasTotais * perdaEvitadaDeterioracaoPct) / 100).toFixed(0));
    const valorPreservadoReais = Number((sacasSalvasAno * precoSacaSojaReais).toFixed(2));

    return {
      pontoOrvalhoC,
      aeracaoSegura,
      riscoCondensacao,
      sacasTotais,
      sacasSalvasAno,
      valorPreservadoReais,
    };
  }, [
    toneladasArmazenadasTotal,
    temperaturaMediaGraosC,
    temperaturaAmbienteC,
    umidadeRelativaAmbientePct,
    precoSacaSojaReais,
    perdaEvitadaDeterioracaoPct,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-[#EAF4E7] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Warehouse className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Armazenagem de Grãos, Termometria & Ponto de Orvalho
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Módulo 134 • Termometria Pendular Wireless & Psicrometria
              </span>
            </div>
            <p className="text-sm text-[#66736A] mt-1">
              Acionamento inteligente de ventiladores centrais baseado no equilíbrio higroscópico e ponto de orvalho, eliminando mofo de teto e queima por calor fermentativo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de Aeração
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Ponto de Orvalho Ambiente</span>
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.pontoOrvalhoC}°C
          </p>
          <span className="text-xs text-amber-400 mt-1 block">
            {umidadeRelativaAmbientePct}% UR externa a {temperaturaAmbienteC}°C
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Decisão do Algoritmo</span>
            <Wind className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {metricas.aeracaoSegura ? 'LIGAR AERAÇÃO' : 'BLOQUEAR AERAÇÃO'}
          </p>
          <span className="text-xs text-[#66736A] mt-1 block">
            {metricas.aeracaoSegura ? 'Condição favorável sem reumedecimento' : 'Risco de condensação interna'}
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Perda Física Evitada</span>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.sacasSalvasAno.toLocaleString('pt-BR')} sc
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            {perdaEvitadaDeterioracaoPct}% preservado do lote armazenado
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-[#EAF4E7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#66736A]">Patrimônio Preservado</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.valorPreservadoReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Valor financeiro protegido contra micotoxinas
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('silos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'silos'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Silos & Pêndulos
        </button>

        <button
          onClick={() => setActiveTab('psicrometria')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'psicrometria'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          Psicrometria & Orvalho
        </button>

        <button
          onClick={() => setActiveTab('termometria')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'termometria'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Detecção de Focos de Calor
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-[#66736A] hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'silos' && (
        <div className="bg-slate-900/40 rounded-2xl border border-[#EAF4E7] p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-amber-400" />
            Monitoramento Térmico Contínuo por Pêndulos Digitais
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332A]">
              <thead className="text-xs uppercase bg-[#F7F9F5] text-[#66736A]">
                <tr>
                  <th className="px-4 py-3">Unidade Silo</th>
                  <th className="px-4 py-3">Grão</th>
                  <th className="px-4 py-3">Capacidade</th>
                  <th className="px-4 py-3">Temp Média</th>
                  <th className="px-4 py-3">Ponto Crítico</th>
                  <th className="px-4 py-3">Umidade</th>
                  <th className="px-4 py-3">Status Aeração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {silos.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">{s.silo}</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{s.graoArmazenado}</td>
                    <td className="px-4 py-3">{s.capacidadeToneladas.toLocaleString('pt-BR')} ton</td>
                    <td className="px-4 py-3">{s.temperaturaMediaGraosC}°C</td>
                    <td className="px-4 py-3 font-bold text-rose-400">{s.temperaturaPontoMaisQuenteC}°C</td>
                    <td className="px-4 py-3">{s.umidadeGraosPct}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {s.statusAeracao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'psicrometria' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Equilíbrio Higroscópico (EMC)</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              O grão ganha ou perde umidade dependendo da umidade relativa e temperatura do ar injetado. A aeração só é permitida quando o EMC está alinhado com 13.0% de umidade da soja.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Faixa de Aeração Permitida:</span>
              <span className="text-sm font-bold text-amber-400 block">UR externa entre 55% e 70%</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Prevenção do Ponto de Orvalho</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Se o ponto de orvalho do ar for superior à temperatura do telhado do silo, o vapor condensa e goteja na camada superior da massa, formando uma crosta podre em poucos dias.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Margem Térmica de Segurança:</span>
              <span className="text-sm font-bold text-emerald-400 block">Diferencial de pelo menos 4.0°C</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Resfriamento Noturno Automatizado</h4>
            </div>
            <p className="text-xs text-[#66736A]">
              Algoritmo de IA liga os motores das 22h às 06h aproveitando a tarifa de energia branca fora de ponta e ar ambiente 8°C mais frio.
            </p>
            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7]/80">
              <span className="text-xs text-[#66736A]">Economia na Conta de Luz:</span>
              <span className="text-sm font-bold text-yellow-400 block">Até 45% menos custos elétricos</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'termometria' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Detecção Precoce de Focos de Caruncho & Respiração Biológica
          </h3>
          <p className="text-sm text-[#66736A]">
            Qualquer elevação abrupta superior a 1.5°C em um único sensor pendular indica foco biológico de ataque de insetos (Sitophilus zeamais) ou bolsa de umidade residual. O sistema direciona o fluxo de aeração para o setor exato.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Sensores por Cabo</span>
              <p className="text-lg font-bold text-white mt-1">12 sensores / pêndulo</p>
              <span className="text-[11px] text-[#66736A]">Mapeamento 3D da massa</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Alarme de Proliferação</span>
              <p className="text-lg font-bold text-rose-400 mt-1">Acima de 32°C</p>
              <span className="text-[11px] text-rose-400">Expurgo com fosfina recomendado</span>
            </div>

            <div className="p-4 bg-[#F7F9F5]/50 rounded-xl border border-[#EAF4E7]">
              <span className="text-xs text-[#66736A]">Conformidade CONAB</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Padrão Tipo 1</p>
              <span className="text-[11px] text-[#66736A]">Zero avariados por queima</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-[#EAF4E7] space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Simulador de Eficiência Termométrica & Perdas Evitadas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-[#66736A]">Toneladas Armazenadas</label>
              <input
                type="number"
                value={toneladasArmazenadasTotal}
                onChange={(e) => setToneladasArmazenadasTotal(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Temp Média Grãos (°C)</label>
              <input
                type="number"
                step="0.5"
                value={temperaturaMediaGraosC}
                onChange={(e) => setTemperaturaMediaGraosC(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">Temp Ambiente Externa (°C)</label>
              <input
                type="number"
                step="0.5"
                value={temperaturaAmbienteC}
                onChange={(e) => setTemperaturaAmbienteC(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#66736A]">UR Ambiente Externa (%)</label>
              <input
                type="number"
                step="1"
                value={umidadeRelativaAmbientePct}
                onChange={(e) => setUmidadeRelativaAmbientePct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#66736A] block">Ponto de Orvalho Calculado:</span>
              <span className="text-base font-bold text-amber-400">
                {metricas.pontoOrvalhoC}°C ({metricas.aeracaoSegura ? 'Seguro para aeração' : 'Condensação eminente'})
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#66736A] block">Perda Evitada na Safra:</span>
              <span className="text-xl font-bold text-emerald-400">
                R$ {metricas.valorPreservadoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
