import React, { useState } from 'react';
import {
  Trees,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Calculator,
  Download,
  DollarSign,
  TrendingUp,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

interface PiqueteILPF {
  id: string;
  identificacao: string;
  forrageira: string;
  componenteFlorestal: string;
  areaHa: number;
  diasPastejo: number;
  taxaLotacaoUA: number;
  gmdKgCabDia: number;
  animaisCabecas: number;
  alturaEntradaCm: number;
  alturaSaidaCm: number;
  massaPalhadaKgHa: number; // kg/ha de palhada seca remanescente
  statusManejo: 'PASTEJO_ATIVO' | 'DESSEDE_ROTACAO' | 'PREPARO_PLANTIO_DIRETO';
}

const PIQUETES_INICIAIS: PiqueteILPF[] = [
  {
    id: 'piq-01',
    identificacao: 'Módulo 01 - ILP Soja + Braquiária Ruziziensis',
    forrageira: 'Brachiaria ruziziensis cv. BRS Integra',
    componenteFlorestal: 'Sem árvores (Consórcio Grão-Pasto)',
    areaHa: 450,
    diasPastejo: 100,
    taxaLotacaoUA: 1.8,
    gmdKgCabDia: 0.95,
    animaisCabecas: 810,
    alturaEntradaCm: 25,
    alturaSaidaCm: 15,
    massaPalhadaKgHa: 4600,
    statusManejo: 'PASTEJO_ATIVO',
  },
  {
    id: 'piq-02',
    identificacao: 'Módulo 02 - ILPF Trissistema (Soja + Milho + Eucalipto)',
    forrageira: 'Brachiaria brizantha cv. Piatã',
    componenteFlorestal: 'Eucalipto Clone I-144 (Fileiras Duplas 20x4m)',
    areaHa: 350,
    diasPastejo: 110,
    taxaLotacaoUA: 1.6,
    gmdKgCabDia: 1.05,
    animaisCabecas: 560,
    alturaEntradaCm: 30,
    alturaSaidaCm: 18,
    massaPalhadaKgHa: 5200,
    statusManejo: 'PASTEJO_ATIVO',
  },
  {
    id: 'piq-03',
    identificacao: 'Módulo 03 - ILP Braquiária Paiaguás Pós-Milho',
    forrageira: 'Brachiaria brizantha cv. Paiaguás',
    componenteFlorestal: 'Sem árvores (Pastagem de Entressafra)',
    areaHa: 400,
    diasPastejo: 90,
    taxaLotacaoUA: 2.0,
    gmdKgCabDia: 0.88,
    animaisCabecas: 800,
    alturaEntradaCm: 28,
    alturaSaidaCm: 16,
    massaPalhadaKgHa: 4200,
    statusManejo: 'DESSEDE_ROTACAO',
  },
];

export const ILPFManejoRotacionadoModule: React.FC = () => {
  const [piquetes] = useState<PiqueteILPF[]>(PIQUETES_INICIAIS);
  const [selecionado, setSelecionado] = useState<PiqueteILPF>(PIQUETES_INICIAIS[0]);

  // Simulador de Desempenho Zootécnico & Palhada
  const [taxaLotacaoSimulada, setTaxaLotacaoSimulada] = useState<number>(selecionado.taxaLotacaoUA);
  const [diasPastejoSimulados, setDiasPastejoSimulados] = useState<number>(selecionado.diasPastejo);
  const [gmdSimulado, setGmdSimulado] = useState<number>(selecionado.gmdKgCabDia);
  const [precoArrobaBoi, setPrecoArrobaBoi] = useState<number>(240.0); // R$/@ boi gordo

  // Cálculos Zootécnicos e Agronômicos
  const totalAnimaisCalculado = Math.round(selecionado.areaHa * taxaLotacaoSimulada);
  const ganhoPesoVivoKg = diasPastejoSimulados * gmdSimulado * totalAnimaisCalculado;
  const producaoCarneLimpaKg = ganhoPesoVivoKg * 0.52; // 52% rendimento de carcaça
  const totalArrobasProduzidas = Number((producaoCarneLimpaKg / 15).toFixed(1));
  const arrobasPorHa = Number((totalArrobasProduzidas / selecionado.areaHa).toFixed(2));
  
  const faturamentoTotalBoi = Number((totalArrobasProduzidas * precoArrobaBoi).toFixed(2));
  const faturamentoPorHa = Number((faturamentoTotalBoi / selecionado.areaHa).toFixed(2));

  const palhadaConformeEmbrapa = selecionado.massaPalhadaKgHa >= 3500;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                <Trees className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-wide">
                    Integração Lavoura-Pecuária-Floresta (ILPF) & Boi Safrinha
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                    Embrapa ILPF
                  </span>
                </div>
                <p className="text-stone-300 text-sm mt-0.5">
                  Consórcio de grãos com forrageiras, manejo de pastagem na entressafra, arrobas por hectare e cobertura de palhada.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Plano Integrado de Rotação ILPF exportado com sucesso!')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Exportar Plano ILPF
            </button>
            <div className="text-right pl-4 border-l border-emerald-800/60 hidden sm:block">
              <div className="text-xs text-stone-400">Produtividade Entressafra</div>
              <div className="text-xl font-bold text-emerald-300">{arrobasPorHa} @/ha</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Arrobas Produzidas (@/ha)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {arrobasPorHa} <span className="text-sm font-normal text-stone-400">@/ha</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Total: {totalArrobasProduzidas.toLocaleString('pt-BR')} @ no ciclo safrinha
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Faturamento Extra na Entressafra</div>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {faturamentoTotalBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            R$ {faturamentoPorHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha sobre palhada
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Palhada Remanescente (Plantio Direto)</div>
          <div className="text-2xl font-bold text-cyan-300 mt-1">
            {selecionado.massaPalhadaKgHa.toLocaleString('pt-BR')} <span className="text-sm font-normal text-stone-400">kg/ha MS</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            Mínimo Embrapa: 3.500 kg/ha ({palhadaConformeEmbrapa ? 'Excelente cobertura' : 'Abaixo da meta'})
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-xl">
          <div className="text-xs font-medium text-stone-400">Status do Manejo</div>
          <div className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                selecionado.statusManejo === 'PASTEJO_ATIVO'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {selecionado.statusManejo === 'PASTEJO_ATIVO' ? 'PASTEJO EM ANDAMENTO' : 'ROTACIONADO'}
            </span>
          </div>
          <div className="text-xs text-stone-500 mt-1 truncate">
            {selecionado.forrageira}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Piquetes ILPF vs Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Piquetes & Telemetria do Solo/Pasto (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Módulos de Integração Lavoura-Pecuária-Floresta
                </h2>
              </div>
              <span className="text-xs text-stone-400">Rede ILPF / Embrapa Cerrados</span>
            </div>

            {/* List of Modules */}
            <div className="space-y-3 mb-6">
              {piquetes.map((piq) => {
                const isSelected = piq.id === selecionado.id;
                return (
                  <div
                    key={piq.id}
                    onClick={() => {
                      setSelecionado(piq);
                      setTaxaLotacaoSimulada(piq.taxaLotacaoUA);
                      setDiasPastejoSimulados(piq.diasPastejo);
                      setGmdSimulado(piq.gmdKgCabDia);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md'
                        : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          <Trees className="w-4 h-4 text-emerald-400" />
                          {piq.identificacao}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          Forragem: <span className="text-stone-300">{piq.forrageira}</span> • {piq.componenteFlorestal}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-stone-400">Lotação</div>
                          <div className="text-sm font-bold text-white">{piq.taxaLotacaoUA} UA/ha</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                          {piq.areaHa} ha
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pasture Grazing Metrics & Soil Straw Protection */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Regras de Manejo: Entrada x Saída do Gado & Proteção da Palhada
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Altura Entrada</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    {selecionado.alturaEntradaCm} cm
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Ponto ideal de proteína bruta</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Altura Saída (Corte)</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    {selecionado.alturaSaidaCm} cm
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Garante rebrota e palhada</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Massa Seca Palhada</div>
                  <div className="text-lg font-bold text-cyan-300 mt-1">
                    {selecionado.massaPalhadaKgHa} kg/ha
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Biomassa radicular + aérea</div>
                </div>

                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                  <div className="text-stone-400">Conforto Animal</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {selecionado.componenteFlorestal.includes('Eucalipto') ? 'ITH 68 (Excelente)' : 'Pasto Aberto'}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Sombra diminui estresse calórico</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-lg text-xs text-stone-300">
                🌱 <strong>Sinergia Solo-Planta:</strong> As raízes vigorosas da braquiária descompactam camadas profundas do solo (efeito biológico sem uso de escarificador) e reciclam potássio e fósforo para a soja seguinte.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive ILPF Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  Simulador Zootécnico da Safrinha
                </h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded">
                Boi Safrinha
              </span>
            </div>

            <p className="text-xs text-stone-400 mb-5">
              Simule a taxa de lotação, dias de pastejo e ganho médio diário (GMD) para projetar a produção de arrobas e faturamento.
            </p>

            <div className="space-y-4 text-xs">
              {/* Lotação UA */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-400 font-medium">Taxa de Lotação (UA/ha)</span>
                  <span className="text-emerald-300 font-bold">{taxaLotacaoSimulada} UA/ha</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={taxaLotacaoSimulada}
                  onChange={(e) => setTaxaLotacaoSimulada(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>1.0 UA</span>
                  <span>1.8 UA (Padrão)</span>
                  <span>3.0 UA</span>
                </div>
              </div>

              {/* Dias de Pastejo */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-400 font-medium">Período de Pastejo (Dias de Entressafra)</span>
                  <span className="text-emerald-300 font-bold">{diasPastejoSimulados} dias</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="130"
                  step="5"
                  value={diasPastejoSimulados}
                  onChange={(e) => setDiasPastejoSimulados(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>60 dias</span>
                  <span>100 dias</span>
                  <span>130 dias</span>
                </div>
              </div>

              {/* GMD */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-stone-400 font-medium">Ganho Médio Diário (GMD kg/cab/dia)</span>
                  <span className="text-emerald-300 font-bold">{gmdSimulado} kg</span>
                </div>
                <input
                  type="range"
                  min="0.60"
                  max="1.30"
                  step="0.05"
                  value={gmdSimulado}
                  onChange={(e) => setGmdSimulado(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-stone-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>0.60 kg</span>
                  <span>0.95 kg</span>
                  <span>1.30 kg</span>
                </div>
              </div>

              {/* Preço Arroba */}
              <div>
                <label className="text-stone-400 font-medium block mb-1">Preço da Arroba (R$/@ Boi Gordo)</label>
                <input
                  type="number"
                  step="5"
                  value={precoArrobaBoi}
                  onChange={(e) => setPrecoArrobaBoi(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-white font-semibold focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Results Box */}
            <div className="mt-6 p-4 bg-stone-950/80 border border-stone-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Total de Animais no Módulo:</span>
                <span className="text-white font-bold">{totalAnimaisCalculado} cabeças</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Ganho de Peso Vivo Total:</span>
                <span className="text-emerald-400 font-semibold">{ganhoPesoVivoKg.toLocaleString('pt-BR')} kg</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Produtividade Zootécnica:</span>
                <span className="text-emerald-300 font-bold text-sm">{arrobasPorHa} @/ha</span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
                <span className="font-semibold text-white">Receita Líquida Adicional:</span>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-300">
                    R$ {faturamentoTotalBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-500">
                    R$ {faturamentoPorHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha na entressafra
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
