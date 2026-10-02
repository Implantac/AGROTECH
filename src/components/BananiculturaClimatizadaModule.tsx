import React, { useState, useMemo } from 'react';
import {
  Thermometer,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface ParcelaBanana {
  id: string;
  talhao: string;
  variedade: 'Grand Naine (Cavendish)' | 'Prata-Anã' | 'Williams';
  areaHa: number;
  idadeAnos: number;
  densidadeTouceirasHa: number;
  folhasSadiasMedias: number;
  indiceStoverPct: number;
  statusSigatoka: 'CONTROLADO' | 'ALERTA_PREVENTIVO' | 'INTERVENCAO_URGENTE';
  previsaoColheitaDias: number;
}

interface LoteCamaraMatural {
  id: string;
  camara: string;
  capacidadeCaixas: number;
  temperaturaAtualC: number;
  umidadeRelativaPct: number;
  co2Ppm: number;
  etilenoPpm: number;
  grauVonLoesecke: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  statusProcesso: 'RESFRIAMENTO' | 'GASAGEM_ETILENO' | 'EXAUSTAO' | 'EXPEDICAO_PRONTA';
}

export const BananiculturaClimatizadaModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fitossanitario' | 'cacho_calibre' | 'climatizacao' | 'simulador'>('fitossanitario');

  // Dados de Parcelas
  const [parcelas, setParcelas] = useState<ParcelaBanana[]>([
    {
      id: 'PARC-01',
      talhao: 'Talhão Ribeira 01-A',
      variedade: 'Grand Naine (Cavendish)',
      areaHa: 15,
      idadeAnos: 3.5,
      densidadeTouceirasHa: 1650,
      folhasSadiasMedias: 9.8,
      indiceStoverPct: 4.2,
      statusSigatoka: 'CONTROLADO',
      previsaoColheitaDias: 14,
    },
    {
      id: 'PARC-02',
      talhao: 'Talhão Jaíba Norte 02-B',
      variedade: 'Prata-Anã',
      areaHa: 18,
      idadeAnos: 2.8,
      densidadeTouceirasHa: 1800,
      folhasSadiasMedias: 9.2,
      indiceStoverPct: 5.4,
      statusSigatoka: 'CONTROLADO',
      previsaoColheitaDias: 21,
    },
    {
      id: 'PARC-03',
      talhao: 'Talhão Encosta Sul 03-C',
      variedade: 'Williams',
      areaHa: 12,
      idadeAnos: 4.1,
      densidadeTouceirasHa: 1600,
      folhasSadiasMedias: 7.9,
      indiceStoverPct: 9.8,
      statusSigatoka: 'ALERTA_PREVENTIVO',
      previsaoColheitaDias: 8,
    },
  ]);

  // Dados das Câmaras de Climatização com Etileno
  const [camaras] = useState<LoteCamaraMatural[]>([
    {
      id: 'LOTE-ET-401',
      camara: 'Câmara Climatizada 01 (Exportação)',
      capacidadeCaixas: 1440,
      temperaturaAtualC: 15.5,
      umidadeRelativaPct: 92,
      co2Ppm: 2400,
      etilenoPpm: 120,
      grauVonLoesecke: 3,
      statusProcesso: 'EXAUSTAO',
    },
    {
      id: 'LOTE-ET-402',
      camara: 'Câmara Climatizada 02 (Mercado SP/Sul)',
      capacidadeCaixas: 1200,
      temperaturaAtualC: 17.2,
      umidadeRelativaPct: 88,
      co2Ppm: 1800,
      etilenoPpm: 0,
      grauVonLoesecke: 5,
      statusProcesso: 'EXPEDICAO_PRONTA',
    },
  ]);

  // Simulador de Rentabilidade
  const [areaSimulada, setAreaSimulada] = useState<number>(45);
  const [produtividadeKgHa, setProdutividadeKgHa] = useState<number>(42000);
  const [percentualExportacao, setPercentualExportacao] = useState<number>(70);
  const [precoExportacaoReais, setPrecoExportacaoReais] = useState<number>(68.0);
  const [precoNacionalReais, setPrecoNacionalReais] = useState<number>(38.0);
  const [custoProducaoHa, setCustoProducaoHa] = useState<number>(48000.0);

  // Cálculos do Simulador
  const metricasSimuladas = useMemo(() => {
    const producaoTotalKg = areaSimulada * produtividadeKgHa;
    const totalCaixas20kg = Math.round(producaoTotalKg / 20);
    const caixasExportacao = Math.round(totalCaixas20kg * (percentualExportacao / 100));
    const caixasNacional = totalCaixas20kg - caixasExportacao;

    const receitaExportacao = caixasExportacao * precoExportacaoReais;
    const receitaNacional = caixasNacional * precoNacionalReais;
    const receitaTotal = Number((receitaExportacao + receitaNacional).toFixed(2));

    const custoTotal = Number((areaSimulada * custoProducaoHa).toFixed(2));
    const margemLiquidaTotal = Number((receitaTotal - custoTotal).toFixed(2));
    const margemLiquidaPorHa = Number((margemLiquidaTotal / areaSimulada).toFixed(2));

    return {
      producaoTotalKg,
      totalCaixas20kg,
      caixasExportacao,
      caixasNacional,
      receitaExportacao,
      receitaNacional,
      receitaTotal,
      custoTotal,
      margemLiquidaTotal,
      margemLiquidaPorHa,
    };
  }, [areaSimulada, produtividadeKgHa, percentualExportacao, precoExportacaoReais, precoNacionalReais, custoProducaoHa]);

  // Escala Von Loesecke labels
  const getLoeseckeLabel = (grau: number) => {
    switch (grau) {
      case 1: return { cor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', desc: 'Grau 1 • Verde Escuro (Colheita/Embarque Transoceânico)' };
      case 2: return { cor: 'text-emerald-300 bg-emerald-950/40 border-emerald-700', desc: 'Grau 2 • Verde Claro (Início da Climatização)' };
      case 3: return { cor: 'text-lime-300 bg-lime-950/50 border-lime-800', desc: 'Grau 3 • Mais Verde que Amarelo (Fim da Injeção de Etileno)' };
      case 4: return { cor: 'text-yellow-300 bg-yellow-950/50 border-yellow-800', desc: 'Grau 4 • Mais Amarelo que Verde (Ponto Ideal Distribuição CEAGESP)' };
      case 5: return { cor: 'text-yellow-400 bg-yellow-950/60 border-yellow-700', desc: 'Grau 5 • Amarelo com Pontas Verdes (Gôndola Supermercado)' };
      case 6: return { cor: 'text-amber-400 bg-amber-950/60 border-amber-800', desc: 'Grau 6 • Todo Amarelo (Consumo Imediato)' };
      case 7: return { cor: 'text-amber-500 bg-amber-950/70 border-amber-900', desc: 'Grau 7 • Amarelo com Pintas Pardas (Açúcar Pleno / Doce)' };
      default: return { cor: 'text-[#66736A] bg-slate-900 border-slate-700', desc: 'Não Classificado' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Módulo 79 • Bananicultura de Precisão & Cadeia Climatizada
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                GlobalG.A.P. & MAPA Export
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🍌 Bananicultura Climatizada & Monitoramento Stover
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Gestão avançada de bananicultura comercial de exportação: escala Stover de gravidade de Sigatoka-negra, desfolha cirúrgica, embolsamento com mangas tratadas, controle hermético de câmaras com gás etileno (C₂H₄) e escala Von Loesecke.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[140px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Área Ativa</span>
              <span className="text-xl font-black text-amber-400">45 ha</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">3 Talhões Comerciais</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[150px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Faturamento Estimado</span>
              <span className="text-xl font-black text-emerald-400">R$ 5,57M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">70% Exportação</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Índice Stover Médio</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">4.8%</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Meta &lt; 10.0% • Risco Mínimo de Desfolha
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Folhas Sadias no Cacho</span>
            <Leaf className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">9.5 folhas</div>
          <div className="text-[11px] text-amber-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Exigência Export: &ge; 8.0 folhas ativas
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Câmaras em Climatização</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">2.640 cx</div>
          <div className="text-[11px] text-cyan-400 font-medium mt-1">
            Temp. 15.5°C • Sem Chilling Injury (&gt;12.5°C)
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Margem Líquida / ha</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">R$ 75.900,00</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Custo: R$ 48k/ha • Lucro Líquido R$ 3,41M
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('fitossanitario')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'fitossanitario'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          1. Sigatoka & Escala Stover
        </button>

        <button
          onClick={() => setActiveTab('cacho_calibre')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cacho_calibre'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Box className="w-4 h-4" />
          2. Manejo de Cacho & Calibre
        </button>

        <button
          onClick={() => setActiveTab('climatizacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'climatizacao'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          3. Climatização com Etileno & Von Loesecke
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico Exportação
        </button>
      </div>

      {/* Conteúdo da Aba 1: Fitossanitário & Escala Stover */}
      {activeTab === 'fitossanitario' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Monitoramento de Sigatoka-Negra e Amarela (Escala Stover Modificada)
                </h3>
                <p className="text-xs text-[#66736A] mt-1">
                  Avaliação da área foliar lesionada nas folhas 1 a 10. Para assegurar maturação uniforme em contêineres marítimos, exige-se no mínimo 8 folhas sadias na colheita.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Protocolo Anti-Resistência FRAC Ativo
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Talhão / Variedade</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Densidade</th>
                    <th className="py-3 px-3">Folhas Sadias</th>
                    <th className="py-3 px-3">Índice Stover</th>
                    <th className="py-3 px-3">Status Sanitário</th>
                    <th className="py-3 px-3">Previsão Colheita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {parcelas.map((parc) => (
                    <tr key={parc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{parc.talhao}</div>
                        <div className="text-[11px] text-amber-400/90">{parc.variedade}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#26332A] font-mono">{parc.areaHa} ha</td>
                      <td className="py-3.5 px-3 text-[#26332A] font-mono">{parc.densidadeTouceirasHa} plantas/ha</td>
                      <td className="py-3.5 px-3 font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          parc.folhasSadiasMedias >= 8.5
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : 'text-amber-400 bg-amber-950/60'
                        }`}>
                          {parc.folhasSadiasMedias.toFixed(1)} folhas
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#26332A]">
                        {parc.indiceStoverPct.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3">
                        {parc.statusSigatoka === 'CONTROLADO' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Controlado (&lt;6%)
                          </span>
                        )}
                        {parc.statusSigatoka === 'ALERTA_PREVENTIVO' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Alerta Preventivo (&gt;8%)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[#26332A] font-mono">
                        em {parc.previsaoColheitaDias} dias
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-[#F7F9F5]/70 border border-[#EAF4E7] text-xs text-[#26332A] space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Diretrizes de Manejo Integrado de Sigatoka
              </div>
              <p>
                <strong>Desfolha Cirúrgica:</strong> Corte apenas dos setores com estrias necróticas na ponta ou borda das folhas (cirurgia de lâmina), mantendo o pecíolo e o limbo sadio fotossintetizante.
              </p>
              <p>
                <strong>Rotação FRAC:</strong> Alternância estrita entre DMI (Triazóis), QoI (Estrobirulinas) e fungicidas protetores multissítios (Mancozeb / Óleo Mineral Parafínico 5 a 10 L/ha) para preservar a sensibilidade de campo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: Cacho & Calibre */}
      {activeTab === 'cacho_calibre' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-400" />
              Operações de Campo no Cacho
            </h3>
            <p className="text-xs text-[#66736A]">
              Checklist de padronização para frutas destinadas aos mercados gourmet e de exportação.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Ensacamento / Embolsamento Precoce</div>
                  <div className="text-xs text-[#66736A] mt-0.5">
                    Colocação de sacos plásticos de polietileno azul (com microperfurações de 0,5 mm) tratados com repelente natural logo após a abertura da última penca. Protege contra tripes-da-erupção (*Frankliniella*), traças e queimadura solar.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Despistilagem e Corte do Coração</div>
                  <div className="text-xs text-[#66736A] mt-0.5">
                    Eliminação da inflorescência masculina (coração) a 15-20 cm da última penca funcional e remoção precoce dos restos florais/pistilos secos para evitar a podridão da ponta do charuto (*Verticillium theobromae*).
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Escoramento e Amarração das Plantas</div>
                  <div className="text-xs text-[#66736A] mt-0.5">
                    Fixação com fitilho de polipropileno em touceiras adjacentes em sistema "V" duplo, impedindo tombamento de pseudocaules pesados (&gt; 45 kg de cacho) sob vendavais tropicais.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Tabela de Calibração & Classificação MAPA
            </h3>
            <p className="text-xs text-[#66736A]">
              Medição micrométrica no fruto central da segunda penca da planta marcadora.
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Calibre Exportação Extra A</span>
                  <span className="text-[#66736A]">Dedos 39 a 44 mm • Comprimento &gt; 20 cm</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                  Prêmio +25%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Calibre Exportação Padrão</span>
                  <span className="text-[#66736A]">Dedos 34 a 38 mm • Comprimento 16 a 19 cm</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-bold font-mono">
                  Base 100%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Calibre Mercado Doméstico (CEASA)</span>
                  <span className="text-[#66736A]">Dedos 30 a 33 mm • Comprimento 14 a 16 cm</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">
                  Desconto -15%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">Refugo / Indústria Doceira</span>
                  <span className="text-[#66736A]">Frutos com defeitos graves ou &lt; 28 mm</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold font-mono">
                  R$ 0,40/kg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 3: Climatização com Etileno & Von Loesecke */}
      {activeTab === 'climatizacao' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-cyan-400" />
              Câmaras Herméticas de Climatização & Controle de Gás Etileno (C₂H₄)
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              A maturação forçada controlada rompe a dormência fisiológica sem desidratação. O teor de CO₂ é mantido &lt; 3.000 ppm via recirculação e exaustão forçada para evitar asfixia e coloração pálida.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camaras.map((c) => {
                const loesecke = getLoeseckeLabel(c.grauVonLoesecke);
                return (
                  <div key={c.id} className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{c.camara}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {c.statusProcesso}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-white border border-[#EAF4E7]">
                        <span className="text-[10px] text-[#66736A] block">Temperatura</span>
                        <span className="font-mono font-bold text-white text-sm">{c.temperaturaAtualC}°C</span>
                        <span className="text-[9px] text-emerald-400 block">&gt; 12.5°C Seguro</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EAF4E7]">
                        <span className="text-[10px] text-[#66736A] block">Umidade (UR)</span>
                        <span className="font-mono font-bold text-white text-sm">{c.umidadeRelativaPct}%</span>
                        <span className="text-[9px] text-cyan-400 block">Anti-murchamento</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-[#EAF4E7]">
                        <span className="text-[10px] text-[#66736A] block">Gás C₂H₄</span>
                        <span className="font-mono font-bold text-white text-sm">{c.etilenoPpm} ppm</span>
                        <span className="text-[9px] text-amber-400 block">Dosagem Oficial</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-lg border text-xs font-semibold ${loesecke.cor}`}>
                      {loesecke.desc}
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-[#66736A] pt-1 border-t border-[#EAF4E7]/80">
                      <span>Carga: {c.capacidadeCaixas} caixas (20 kg)</span>
                      <span>CO₂ atual: {c.co2Ppm} ppm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Guia da Escala de Cores Von Loesecke (1 a 7)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((grau) => {
                const item = getLoeseckeLabel(grau);
                return (
                  <div key={grau} className={`p-3 rounded-xl border text-center text-xs space-y-1 ${item.cor}`}>
                    <div className="font-black text-lg">Grau {grau}</div>
                    <div className="text-[10px] leading-tight opacity-90">{item.desc.split('•')[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 4: Simulador Econômico */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Parâmetros da Safra & Mercado
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Área Produtiva Total</span>
                <span className="font-mono text-amber-400">{areaSimulada} hectares</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={areaSimulada}
                onChange={(e) => setAreaSimulada(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Produtividade Média</span>
                <span className="font-mono text-amber-400">{produtividadeKgHa.toLocaleString()} kg/ha</span>
              </div>
              <input
                type="range"
                min="25000"
                max="65000"
                step="1000"
                value={produtividadeKgHa}
                onChange={(e) => setProdutividadeKgHa(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>% Destinado à Exportação</span>
                <span className="font-mono text-emerald-400">{percentualExportacao}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="5"
                value={percentualExportacao}
                onChange={(e) => setPercentualExportacao(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Caixa Exportação (20 kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoExportacaoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="45"
                max="110"
                step="1"
                value={precoExportacaoReais}
                onChange={(e) => setPrecoExportacaoReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço Caixa Nacional (CEASA)</span>
                <span className="font-mono text-amber-400">R$ {precoNacionalReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="25"
                max="60"
                step="1"
                value={precoNacionalReais}
                onChange={(e) => setPrecoNacionalReais(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              DRE Projetada & Margem Agroindustrial
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Volume Total</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricasSimuladas.producaoTotalKg / 1000).toLocaleString()} ton
                </span>
                <span className="text-[10px] text-[#66736A] block">{metricasSimuladas.totalCaixas20kg.toLocaleString()} caixas</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Caixas Export</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {metricasSimuladas.caixasExportacao.toLocaleString()} cx
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Prêmio Alto</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricasSimuladas.receitaTotal / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-[#66736A] block">Nacional + Export</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricasSimuladas.margemLiquidaTotal / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Margem Plena</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita Exportação ({percentualExportacao}%):</span>
                <span className="font-mono font-bold text-emerald-400">
                  R$ {metricasSimuladas.receitaExportacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita Mercado Nacional:</span>
                <span className="font-mono font-bold text-amber-400">
                  R$ {metricasSimuladas.receitaNacional.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Custo Total de Produção & Embalagem:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricasSimuladas.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-emerald-950/30 px-3 rounded-lg border border-emerald-800/50">
                <span className="text-white">Margem Líquida por Hectare:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricasSimuladas.margemLiquidaPorHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / ha
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BananiculturaClimatizadaModule;
