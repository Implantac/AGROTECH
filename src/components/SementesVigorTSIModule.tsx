import React, { useState } from 'react';
import {
  Microscope,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Sliders,
  DollarSign,
  Plus,
  Scale,
  Sparkles,
  Layers,
  TestTubes,
  ShieldCheck
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

export interface LoteSemente {
  id: string;
  numeroLote: string;
  culturaVariedade: string;
  obtentorSemente: string;
  germinacaoPct: number;
  vigorTetrazolioPct: number;
  pmsGramas: number; // Peso de Mil Sementes (ex: 168g)
  purezaFisicaPct: number;
  tratamentoIndustrialTSI: string;
  inoculacaoBiologica: string;
  saldoSacos40kg: number;
  statusLote: 'APROVADO_PLANTIO' | 'QUARENTENA_RETESTE' | 'REPROVADO';
}

const LOTES_INICIAIS: LoteSemente[] = [
  {
    id: 'sem-01',
    numeroLote: 'LOT-2026-M5947-01',
    culturaVariedade: 'Soja Monsoy 5947 IPRO',
    obtentorSemente: 'Bayer Crop Science / AgroEste',
    germinacaoPct: 94.0,
    vigorTetrazolioPct: 92.0,
    pmsGramas: 168.5,
    purezaFisicaPct: 99.8,
    tratamentoIndustrialTSI: 'Fortenza Duo (Ciantraniliprole + Tiametoxam) + Maxim Advanced',
    inoculacaoBiologica: 'Bradyrhizobium japonicum (Semia 5079/5080) + Azospirillum brasilense',
    saldoSacos40kg: 1450,
    statusLote: 'APROVADO_PLANTIO',
  },
  {
    id: 'sem-02',
    numeroLote: 'LOT-2026-BMX-04',
    culturaVariedade: 'Soja Brasmax Desafio',
    obtentorSemente: 'GDM Genética / Sementes Petrovina',
    germinacaoPct: 91.0,
    vigorTetrazolioPct: 88.0,
    pmsGramas: 174.0,
    purezaFisicaPct: 99.7,
    tratamentoIndustrialTSI: 'Standak Top (Fipronil + Piraclostrobina + Tiofanato-metílico)',
    inoculacaoBiologica: 'Inoculante Turfa + Co-inoculação líquida',
    saldoSacos40kg: 1120,
    statusLote: 'APROVADO_PLANTIO',
  },
  {
    id: 'sem-03',
    numeroLote: 'LOT-2026-TMG-02',
    culturaVariedade: 'Soja TMG 2381 Inox',
    obtentorSemente: 'TMG Tropical / Sementes Scheffer',
    germinacaoPct: 95.0,
    vigorTetrazolioPct: 93.0,
    pmsGramas: 162.0,
    purezaFisicaPct: 99.9,
    tratamentoIndustrialTSI: 'Cruiser Advanced + Maxim XL',
    inoculacaoBiologica: 'Biomaphos (Bacillus subtilis/megaterium) + Bradyrhizobium',
    saldoSacos40kg: 1800,
    statusLote: 'APROVADO_PLANTIO',
  },
  {
    id: 'sem-04',
    numeroLote: 'LOT-2026-KWS-09',
    culturaVariedade: 'Milho Híbrido KWS 9010 VIP3',
    obtentorSemente: 'KWS Sementes do Brasil',
    germinacaoPct: 96.0,
    vigorTetrazolioPct: 94.0,
    pmsGramas: 285.0,
    purezaFisicaPct: 99.9,
    tratamentoIndustrialTSI: 'Pontecho + Maxim Quattro + Micronutrientes Zinco/Boro',
    inoculacaoBiologica: 'Azospirillum brasilense (Estirpes Ab-V5 e Ab-V6)',
    saldoSacos40kg: 850,
    statusLote: 'APROVADO_PLANTIO',
  },
];

export const SementesVigorTSIModule: React.FC = () => {
  const [lotes, setLotes] = useState<LoteSemente[]>(LOTES_INICIAIS);

  // Parâmetros da Calculadora de Plantadeira / Semeadura
  const [populacaoAlvoPlantas, setPopulacaoAlvoPlantas] = useState<number>(280000);
  const [germinacaoCalc, setGerminacaoCalc] = useState<number>(94.0);
  const [vigorCalc, setVigorCalc] = useState<number>(92.0);
  const [espacamentoLinhasMetros, setEspacamentoLinhasMetros] = useState<number>(0.45);
  const [pmsGramasCalc, setPmsGramasCalc] = useState<number>(168.0);

  // Fator efetivo de emergência em campo
  const fatorEfetivo = (germinacaoCalc / 100) * (vigorCalc / 100);
  const sementesTotaisHa = Math.round(populacaoAlvoPlantas / fatorEfetivo);
  const metrosLinearesPorHa = 10000 / espacamentoLinhasMetros;
  const sementesPorMetroLinear = Number((sementesTotaisHa / metrosLinearesPorHa).toFixed(1));
  const kgSementePorHa = Number(((sementesTotaisHa * pmsGramasCalc) / 1000000).toFixed(1));

  const totalSacosDisponiveis = lotes.reduce((acc, curr) => acc + curr.saldoSacos40kg, 0);
  const mediaGerminacao =
    lotes.reduce((acc, curr) => acc + curr.germinacaoPct, 0) / lotes.length;
  const mediaVigor =
    lotes.reduce((acc, curr) => acc + curr.vigorTetrazolioPct, 0) / lotes.length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#EAF4E7] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Microscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">Sementes, Vigor Tetrazólio & TSI</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Tetrazólio & Germinação
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  TSI Industrial
                </span>
              </div>
              <p className="text-sm text-[#66736A] mt-0.5">
                Controle de lotes de sementes, inoculação biológica (FBN), calibração de dosador de semeadora e peso de mil sementes (PMS).
              </p>
            </div>
          </div>
        </div>

        {/* Resumo Rápido de Qualidade */}
        <div className="flex items-center gap-3 bg-[#F7F9F5] p-2.5 rounded-xl border border-[#EAF4E7] text-xs font-mono">
          <div>
            <span className="text-[#66736A] block text-[10px] uppercase font-bold">Germinação Média:</span>
            <span className="text-emerald-400 font-bold">{mediaGerminacao.toFixed(1)}%</span>
          </div>
          <div className="border-l border-[#EAF4E7] pl-3">
            <span className="text-[#66736A] block text-[10px] uppercase font-bold">Vigor Médio:</span>
            <span className="text-cyan-400 font-bold">{mediaVigor.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Cards de Qualidade Fisiológica */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl">
          <div className="flex items-center justify-between text-[#66736A] mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Estoque de Sementes</span>
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-[#1D4B38] font-mono">{totalSacosDisponiveis.toLocaleString('pt-BR')} sacos</div>
          <p className="text-xs text-slate-500 mt-1">Sacos de 40 kg certificados MAPA</p>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Lotes Aprovados</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono">4 de 4 lotes</div>
          <p className="text-xs text-emerald-400/80 mt-1">Germinação &gt; 90% (Padrão Top)</p>
        </div>

        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl">
          <div className="flex items-center justify-between text-[#66736A] mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Inoculação Biológica (FBN)</span>
            <FlaskConical className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">100% Tratadas</div>
          <p className="text-xs text-slate-500 mt-1">Bradyrhizobium + Azospirillum</p>
        </div>

        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl">
          <div className="flex items-center justify-between text-[#66736A] mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Pureza Física Média</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">99.8%</div>
          <p className="text-xs text-slate-500 mt-1">Isento de sementes nocivas/daninhas</p>
        </div>
      </div>

      {/* Grid: Lotes & Laudos Laboratoriais + Calculadora de Calibração da Semeadora */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Lotes & TSI (2 colunas) */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAF4E7] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <TestTubes className="w-5 h-5 text-emerald-400" />
                Lotes Certificados & Laudos de Qualidade Fisiológica
              </h2>
              <p className="text-xs text-[#66736A]">Resultados de tetrazólio, PMS e tratamento industrial (TSI)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F5] text-[#66736A] uppercase tracking-wider font-semibold border-b border-[#EAF4E7]">
                <tr>
                  <th className="px-3.5 py-3">Lote & Variedade</th>
                  <th className="px-3.5 py-3">Germinação & Vigor</th>
                  <th className="px-3.5 py-3">PMS (Mil Sementes)</th>
                  <th className="px-3.5 py-3">Tratamento Industrial (TSI)</th>
                  <th className="px-3.5 py-3">Saldo</th>
                  <th className="px-3.5 py-3">Laudo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lotes.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-[#26332A]">{l.culturaVariedade}</div>
                      <div className="text-[11px] text-[#66736A]">{l.obtentorSemente}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{l.numeroLote}</div>
                    </td>

                    <td className="px-3.5 py-3.5">
                      <div className="font-mono font-bold text-emerald-300">
                        Germ: {l.germinacaoPct.toFixed(1)}%
                      </div>
                      <div className="text-[11px] text-cyan-300 font-mono">
                        Vigor: {l.vigorTetrazolioPct.toFixed(1)}%
                      </div>
                    </td>

                    <td className="px-3.5 py-3.5 font-mono text-[#26332A]">
                      <div className="font-bold">{l.pmsGramas} g</div>
                      <div className="text-[10px] text-slate-500">Pureza: {l.purezaFisicaPct}%</div>
                    </td>

                    <td className="px-3.5 py-3.5 space-y-0.5 max-w-xs">
                      <div className="text-[#26332A] text-[11px] font-medium">{l.tratamentoIndustrialTSI}</div>
                      <div className="text-[10px] text-cyan-400">{l.inoculacaoBiologica}</div>
                    </td>

                    <td className="px-3.5 py-3.5 font-mono font-bold text-[#26332A]">
                      {l.saldoSacos40kg} sc
                    </td>

                    <td className="px-3.5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Aprovado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculadora de Calibração da Plantadeira (1 coluna) */}
        <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-[#1D4B38]">Calibrador da Plantadeira</h2>
            </div>
            <p className="text-xs text-[#66736A] mb-4">
              Calcule a densidade de semeadura por metro linear no dosador pneumático conforme germinação e vigor:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#26332A] block mb-1">População Alvo (plantas emergidas/ha):</label>
                <input
                  type="number"
                  step="5000"
                  value={populacaoAlvoPlantas}
                  onChange={(e) => setPopulacaoAlvoPlantas(Number(e.target.value))}
                  className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#26332A] block mb-1">Germinação (%):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={germinacaoCalc}
                    onChange={(e) => setGerminacaoCalc(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#26332A] block mb-1">Vigor (%):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={vigorCalc}
                    onChange={(e) => setVigorCalc(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#26332A] block mb-1">Espaçamento (m):</label>
                  <input
                    type="number"
                    step="0.05"
                    value={espacamentoLinhasMetros}
                    onChange={(e) => setEspacamentoLinhasMetros(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#26332A] block mb-1">PMS (g):</label>
                  <input
                    type="number"
                    step="1"
                    value={pmsGramasCalc}
                    onChange={(e) => setPmsGramasCalc(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs space-y-2">
            <div className="flex justify-between items-center text-[#26332A]">
              <span>Sementes Totais Necessárias:</span>
              <span className="font-mono font-bold text-[#1D4B38]">{sementesTotaisHa.toLocaleString('pt-BR')} sem/ha</span>
            </div>
            <div className="flex justify-between items-center text-[#26332A]">
              <span>Consumo em Quilos:</span>
              <span className="font-mono font-bold text-cyan-300">{kgSementePorHa} kg/ha</span>
            </div>
            <div className="border-t border-emerald-900/50 pt-2 flex justify-between items-center">
              <span className="font-bold text-[#1D4B38]">Regulagem do Dosador:</span>
              <span className="font-mono font-extrabold text-sm text-emerald-300">
                {sementesPorMetroLinear} sementes/metro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SementesVigorTSIModule;
