import React, { useState } from 'react';
import {
  Trees,
  Sprout,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  ChevronRight,
  Info,
  Calculator,
} from 'lucide-react';

interface PiqueteILPF {
  id: string;
  identificacao: string;
  areaHa: number;
  forrageira: string;
  componenteFlorestal: string;
  taxaLotacaoUA: number;
  diasPastejo: number;
  gmdKgCabDia: number;
  massaPalhadaKgHa: number;
  alturaEntradaCm: number;
  alturaSaidaCm: number;
  statusManejo: 'PASTEJO_ATIVO' | 'ROTACIONADO' | 'REBROTA';
}

const PIQUETES_INICIAIS: PiqueteILPF[] = [
  {
    id: 'ilpf-01',
    identificacao: 'Módulo 01 - ILP Soja + Braquiária Ruziziensis',
    areaHa: 450,
    forrageira: 'Brachiaria ruziziensis cv. BRS Integra',
    componenteFlorestal: 'Sem árvores (Consórcio Grão-Pasto)',
    taxaLotacaoUA: 1.8,
    diasPastejo: 95,
    gmdKgCabDia: 0.85,
    massaPalhadaKgHa: 4600,
    alturaEntradaCm: 30,
    alturaSaidaCm: 15,
    statusManejo: 'PASTEJO_ATIVO',
  },
  {
    id: 'ilpf-02',
    identificacao: 'Módulo 02 - ILPF Trissistema (Soja + Milho + Eucalipto)',
    areaHa: 350,
    forrageira: 'Brachiaria brizantha cv. Piatã',
    componenteFlorestal: 'Eucalipto Clone I-144 (Fileiras Duplas 20x4m)',
    taxaLotacaoUA: 1.6,
    diasPastejo: 85,
    gmdKgCabDia: 0.92,
    massaPalhadaKgHa: 5200,
    alturaEntradaCm: 35,
    alturaSaidaCm: 18,
    statusManejo: 'PASTEJO_ATIVO',
  },
  {
    id: 'ilpf-03',
    identificacao: 'Módulo 03 - ILP Braquiária + Níger + Crotalária',
    areaHa: 280,
    forrageira: 'Mix Ruziziensis + Crotalaria spectabilis',
    componenteFlorestal: 'Sem árvores (Manejo Biológico de Nematoides)',
    taxaLotacaoUA: 1.4,
    diasPastejo: 75,
    gmdKgCabDia: 0.78,
    massaPalhadaKgHa: 6100,
    alturaEntradaCm: 40,
    alturaSaidaCm: 20,
    statusManejo: 'REBROTA',
  },
];

export const ILPFManejoRotacionadoModule: React.FC = () => {
  const [piquetes] = useState<PiqueteILPF[]>(PIQUETES_INICIAIS);
  const [selecionado, setSelecionado] = useState<PiqueteILPF>(PIQUETES_INICIAIS[0]);

  // Controles de Simulação Interativa Zootécnica
  const [taxaLotacaoSimulada, setTaxaLotacaoSimulada] = useState<number>(selecionado.taxaLotacaoUA);
  const [diasPastejoSimulados, setDiasPastejoSimulados] = useState<number>(selecionado.diasPastejo);
  const [gmdSimulado, setGmdSimulado] = useState<number>(selecionado.gmdKgCabDia);
  const [precoArrobaBoi, setPrecoArrobaBoi] = useState<number>(240);

  // Cálculos Zootécnicos e Financeiros Embrapa ILPF
  const pesoAnimalPadraoKg = 450; // 1 UA = 450 kg peso vivo
  const totalAnimaisCalculado = Math.round(
    taxaLotacaoSimulada * selecionado.areaHa * (450 / pesoAnimalPadraoKg)
  );
  const ganhoPesoVivoKg = totalAnimaisCalculado * diasPastejoSimulados * gmdSimulado;
  const rendimentoCarcacaPct = 0.52;
  const totalArrobasProduzidas = Number(((ganhoPesoVivoKg * rendimentoCarcacaPct) / 15).toFixed(1));
  const arrobasPorHa = Number((totalArrobasProduzidas / selecionado.areaHa).toFixed(2));
  const faturamentoTotalBoi = totalArrobasProduzidas * precoArrobaBoi;
  const faturamentoPorHa = Number((faturamentoTotalBoi / selecionado.areaHa).toFixed(2));

  const palhadaConformeEmbrapa = selecionado.massaPalhadaKgHa >= 3500;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl">
              <Trees className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Integração Lavoura-Pecuária-Floresta (ILPF) & Boi Safrinha
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full">
                Embrapa ILPF
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Consórcio de grãos com forrageiras, pastejo intensivo de entressafra, arrobas por hectare e garantia de palhada para plantio direto.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right pr-4 border-r border-slate-200 hidden sm:block">
            <div className="text-xs text-slate-500 font-medium">Produtividade Entressafra</div>
            <div className="text-xl font-black text-emerald-800">{arrobasPorHa} @/ha</div>
          </div>
          <button
            onClick={() => alert('Plano Integrado de Rotação ILPF exportado com sucesso!')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Exportar Plano ILPF</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Arrobas Produzidas (@/ha)</div>
          <div className="text-3xl font-black text-emerald-800 mt-1">
            {arrobasPorHa} <span className="text-xs font-bold text-slate-500">@/ha</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Total: {totalArrobasProduzidas.toLocaleString('pt-BR')} @ no ciclo safrinha
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Faturamento Extra na Entressafra</div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            R$ {faturamentoTotalBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-800 mt-1 font-semibold">
            R$ {faturamentoPorHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha sobre palhada
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Palhada Remanescente (Plantio Direto)</div>
          <div className="text-3xl font-black text-sky-800 mt-1">
            {selecionado.massaPalhadaKgHa.toLocaleString('pt-BR')} <span className="text-xs font-bold text-slate-500">kg/ha MS</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Mínimo Embrapa: 3.500 kg/ha ({palhadaConformeEmbrapa ? 'Excelente cobertura' : 'Abaixo da meta'})
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-600">Status do Manejo</div>
          <div className="mt-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                selecionado.statusManejo === 'PASTEJO_ATIVO'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-sky-100 text-sky-900 border border-sky-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              {selecionado.statusManejo === 'PASTEJO_ATIVO' ? 'PASTEJO EM ANDAMENTO' : 'ROTACIONADO'}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1.5 truncate font-medium">
            {selecionado.forrageira}
          </div>
        </div>
      </div>

      {/* Main Dual Column: Piquetes ILPF vs Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Piquetes & Telemetria do Solo/Pasto (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Módulos de Integração Lavoura-Pecuária-Floresta
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Rede ILPF / Embrapa Cerrados</span>
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
                        ? 'bg-emerald-50 border-emerald-500 shadow-2xs ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Trees className="w-4 h-4 text-emerald-700" />
                          <span>{piq.identificacao}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Forragem: <span className="font-semibold text-slate-800">{piq.forrageira}</span> • {piq.componenteFlorestal}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[11px] text-slate-500 font-medium">Lotação</div>
                          <div className="text-sm font-bold text-slate-900">{piq.taxaLotacaoUA} UA/ha</div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg">
                          {piq.areaHa} ha
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pasture Grazing Metrics & Soil Straw Protection */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Regras de Manejo: Entrada x Saída do Gado & Proteção da Palhada</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Altura Entrada</div>
                  <div className="text-lg font-black text-emerald-800 mt-1">
                    {selecionado.alturaEntradaCm} cm
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Proteína bruta ideal</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Altura Saída (Corte)</div>
                  <div className="text-lg font-black text-amber-800 mt-1">
                    {selecionado.alturaSaidaCm} cm
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Garante rebrota e palhada</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Massa Seca Palhada</div>
                  <div className="text-lg font-black text-sky-800 mt-1">
                    {selecionado.massaPalhadaKgHa} kg/ha
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Biomassa radicular</div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <div className="text-slate-500 font-medium">Conforto Animal</div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {selecionado.componenteFlorestal.includes('Eucalipto') ? 'ITH 68 (Ótimo)' : 'Pasto Aberto'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sombra diminui estresse</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium">
                🌱 <strong>Sinergia Solo-Planta:</strong> As raízes vigorosas da braquiária descompactam camadas profundas do solo (efeito biológico sem uso de escarificador) e reciclam potássio e fósforo para a soja seguinte.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive ILPF Calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Simulador Zootécnico da Safrinha
                </h2>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Boi Safrinha
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-5">
              Simule a taxa de lotação, dias de pastejo e ganho médio diário (GMD) para projetar a produção de arrobas e faturamento.
            </p>

            <div className="space-y-4 text-xs">
              {/* Lotação UA */}
              <div>
                <div className="flex justify-between mb-1.5 font-semibold text-slate-700">
                  <span>Taxa de Lotação (UA/ha)</span>
                  <span className="text-emerald-800 font-bold font-mono">{taxaLotacaoSimulada} UA/ha</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={taxaLotacaoSimulada}
                  onChange={(e) => setTaxaLotacaoSimulada(Number(e.target.value))}
                  className="w-full accent-emerald-700 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>1.0 UA</span>
                  <span>1.8 UA (Padrão)</span>
                  <span>3.0 UA</span>
                </div>
              </div>

              {/* Dias de Pastejo */}
              <div>
                <div className="flex justify-between mb-1.5 font-semibold text-slate-700">
                  <span>Período de Pastejo (Dias de Entressafra)</span>
                  <span className="text-emerald-800 font-bold font-mono">{diasPastejoSimulados} dias</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="130"
                  step="5"
                  value={diasPastejoSimulados}
                  onChange={(e) => setDiasPastejoSimulados(Number(e.target.value))}
                  className="w-full accent-emerald-700 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>60 dias</span>
                  <span>100 dias</span>
                  <span>130 dias</span>
                </div>
              </div>

              {/* GMD */}
              <div>
                <div className="flex justify-between mb-1.5 font-semibold text-slate-700">
                  <span>Ganho Médio Diário (GMD kg/cab/dia)</span>
                  <span className="text-emerald-800 font-bold font-mono">{gmdSimulado} kg</span>
                </div>
                <input
                  type="range"
                  min="0.60"
                  max="1.30"
                  step="0.05"
                  value={gmdSimulado}
                  onChange={(e) => setGmdSimulado(Number(e.target.value))}
                  className="w-full accent-emerald-700 bg-slate-200 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>0.60 kg</span>
                  <span>0.95 kg</span>
                  <span>1.30 kg</span>
                </div>
              </div>

              {/* Preço Arroba */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1.5">Preço da Arroba (R$/@ Boi Gordo)</label>
                <input
                  type="number"
                  step="5"
                  value={precoArrobaBoi}
                  onChange={(e) => setPrecoArrobaBoi(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Results Box */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total de Animais no Módulo:</span>
                <span className="text-slate-900 font-bold">{totalAnimaisCalculado} cabeças</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Ganho de Peso Vivo Total:</span>
                <span className="text-emerald-800 font-bold font-mono">{ganhoPesoVivoKg.toLocaleString('pt-BR')} kg</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Produtividade Zootécnica:</span>
                <span className="text-emerald-800 font-black text-sm">{arrobasPorHa} @/ha</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Receita Líquida Adicional:</span>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-800">
                    R$ {faturamentoTotalBoi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
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
