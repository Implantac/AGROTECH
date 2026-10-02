import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Download,
  Share2,
  TrendingDown,
  Cpu,
  Target,
  FileCode,
  CheckCircle2,
  Sliders,
  DollarSign,
  Satellite,
  Sun,
  Droplets,
  CloudSun,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { PRESCRICOES_TAXA_VARIAVEL, TALHOES_INICIAIS, PrescricaoTaxaVariavelData } from '../data/mockAgroData';

interface SentinelResult {
  sucesso: boolean;
  ndvi: number;
  ndwi: number;
  evi: number;
  biomassaStatus: 'MUITO_ALTA' | 'ALTA' | 'MEDIA' | 'BAIXA' | 'SOLO_EXPOSTO';
  estresseHidricoStatus: 'SEM_ESTRESSE' | 'LEVE' | 'MODERADO' | 'SEVERO';
  pixelValidoSemNuvem: boolean;
  classificacaoSclNome: string;
  fonte: string;
  timestamp: string;
}

export const AgriculturaPrecisaoModule: React.FC = () => {
  const [prescricoes] = useState<PrescricaoTaxaVariavelData[]>(PRESCRICOES_TAXA_VARIAVEL);
  const [activeTab, setActiveTab] = useState<'prescricoes' | 'sentinel2'>('prescricoes');

  // Estado do Pipeline Sentinel-2
  const [selectedTalhaoIndex, setSelectedTalhaoIndex] = useState<number>(0);
  const [b02Azul, setB02Azul] = useState<number>(0.045);
  const [b04Vermelho, setB04Vermelho] = useState<number>(0.052);
  const [b08Nir, setB08Nir] = useState<number>(0.420);
  const [b11Swir, setB11Swir] = useState<number>(0.160);
  const [sclClass, setSclClass] = useState<number>(4);
  const [loadingSentinel, setLoadingSentinel] = useState<boolean>(false);
  const [sentinelResult, setSentinelResult] = useState<SentinelResult | null>({
    sucesso: true,
    ndvi: 0.7797,
    ndwi: 0.4483,
    evi: 0.6597,
    biomassaStatus: 'MUITO_ALTA',
    estresseHidricoStatus: 'SEM_ESTRESSE',
    pixelValidoSemNuvem: true,
    classificacaoSclNome: 'VEGETACAO',
    fonte: 'Copernicus Sentinel-2 MSI Level-2A (ESA/INPE)',
    timestamp: new Date().toISOString()
  });

  const economiaTotalEstimada = prescricoes.reduce((acc, curr) => acc + curr.economiaFinanceiraEstimada, 0);

  const handleExportarIsoXml = (prescricao: PrescricaoTaxaVariavelData) => {
    alert(`✓ Arquivo de Prescrição ISO-XML (TaskData.xml) gerado com sucesso!
Talhão: ${prescricao.nomePrescricao}
Formato compatível com monitores John Deere GS4, Trimble FmX e Case IH AFS Pro 700.`);
  };

  const talhoesAmostra = [
    { nome: 'Talhão 01 - Soja Pivô Norte', b02: 0.042, b04: 0.048, b08: 0.450, b11: 0.150, scl: 4 },
    { nome: 'Talhão 02 - Milho Safrinha Sequeiro', b02: 0.050, b04: 0.065, b08: 0.380, b11: 0.180, scl: 4 },
    { nome: 'Talhão 03 - Algodão Gleba Sul', b02: 0.040, b04: 0.055, b08: 0.410, b11: 0.165, scl: 4 },
    { nome: 'Talhão 04 - Pousio / Cobertura NPK', b02: 0.075, b04: 0.120, b08: 0.220, b11: 0.240, scl: 5 },
    { nome: 'Talhão 05 - Alerta de Cobertura de Nuvens', b02: 0.280, b04: 0.290, b08: 0.310, b11: 0.250, scl: 9 }
  ];

  const handleSelectTalhaoAmostra = (index: number) => {
    setSelectedTalhaoIndex(index);
    const t = talhoesAmostra[index];
    setB02Azul(t.b02);
    setB04Vermelho(t.b04);
    setB08Nir(t.b08);
    setB11Swir(t.b11);
    setSclClass(t.scl);
  };

  const handleProcessarSentinel = async () => {
    setLoadingSentinel(true);
    try {
      const resp = await fetch('/api/v1/erp/satelite/sentinel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          b02Azul,
          b04Vermelho,
          b08Nir,
          b11Swir,
          sclClassificacao: sclClass
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setSentinelResult(data);
      } else {
        alert('Falha ao processar reflectâncias multiespectrais Sentinel-2.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o pipeline de satélite Copernicus.');
    } finally {
      setLoadingSentinel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Agricultura de Precisão - Paleta Corporativa Verde Floresta */}
      <div className="bg-gradient-to-r from-[#1D4B38] via-[#285943] to-[#3A6B4F] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#5F8F52]/40">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-50 text-[#285943] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-[#285943]" /> VRA & Sensoriamento Remoto
            </span>
            <span className="text-xs text-[#EAF4E7] font-medium">Amostragem Georreferenciada em Grid + Sentinel-2 Level-2A</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" /> Agricultura de Precisão & Satélite Multiespectral
          </h2>
          <p className="text-xs sm:text-sm text-[#EAF4E7] max-w-2xl leading-relaxed">
            Prescrições em taxa variável (VRA) para plantio e adubação com exportação ISO-XML e monitoramento de vigor vegetativo via Copernicus Sentinel-2.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-right min-w-[200px] shadow-sm">
          <span className="text-[10px] text-[#EAF4E7] uppercase font-bold tracking-wider block">Economia em Fertilizantes</span>
          <p className="text-2xl font-black text-amber-700 mt-0.5">
            R$ {economiaTotalEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-[#EAF4E7]/80 block mt-0.5">Média -18.4% de NPK</span>
        </div>
      </div>

      {/* Tabs de Seleção */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('prescricoes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'prescricoes'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          1. Prescrições em Taxa Variável (VRA)
        </button>

        <button
          onClick={() => setActiveTab('sentinel2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sentinel2'
              ? 'bg-[#285943] text-white shadow-md'
              : 'bg-slate-50 text-slate-900 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Satellite className="w-4 h-4" />
          2. Copernicus Sentinel-2 • NDVI, NDWI & EVI
        </button>
      </div>

      {/* Aba 1: Prescrições VRA */}
      {activeTab === 'prescricoes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescricoes.map((presc) => {
              const talhao = TALHOES_INICIAIS.find((t) => t.id === presc.talhaoId);

              return (
                <div
                  key={presc.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-[#5F8F52]/60 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#285943] bg-emerald-50 px-2 py-0.5 rounded border border-[#5F8F52]/30 font-bold">
                        {presc.gradeAmostragem}
                      </span>
                      <h3 className="text-base font-bold text-[#285943] mt-1.5">{presc.nomePrescricao}</h3>
                      <p className="text-xs text-slate-600">
                        Talhão: <span className="font-semibold text-slate-900">{talhao?.codigo} - {talhao?.nome}</span> ({talhao?.areaHa} ha)
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 bg-emerald-50 text-[#285943] border border-[#5F8F52]/40 rounded-full text-[10px] font-bold">
                      {presc.statusExportacaoPiloto}
                    </span>
                  </div>

                  {/* Informações da Dosagem Variável */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-600 block font-medium">Dose Mínima</span>
                      <span className="text-sm font-black text-amber-700 font-mono mt-0.5 block">
                        {presc.doseMinimaKgHa}
                      </span>
                      <span className="text-[9px] text-slate-600">kg / ha</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-600 block font-medium">Dose Média</span>
                      <span className="text-sm font-black text-emerald-700 font-mono mt-0.5 block">
                        {presc.doseMediaKgHa}
                      </span>
                      <span className="text-[9px] text-slate-600">kg / ha</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-600 block font-medium">Dose Máxima</span>
                      <span className="text-sm font-black text-[#285943] font-mono mt-0.5 block">
                        {presc.doseMaximaKgHa}
                      </span>
                      <span className="text-[9px] text-slate-600">kg / ha</span>
                    </div>
                  </div>

                  {/* Insumo Recomendado */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-600 block">Adubo / Corretivo Recomendado:</span>
                      <span className="font-bold text-slate-900">{presc.aduboRecomendado}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-600 block">Economia Gerada:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        +R$ {presc.economiaFinanceiraEstimada.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Botões de Ação para o Piloto */}
                  <div className="flex gap-2 pt-1 border-t border-slate-200">
                    <button
                      onClick={() => handleExportarIsoXml(presc)}
                      className="flex-1 py-2 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" /> Exportar ISO-XML (Piloto GS4)
                    </button>
                    <button
                      onClick={() => alert(`Shapefile vetorial (.shp) do grid de fertilidade gerado para o talhão ${talhao?.codigo}.`)}
                      className="px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-[#285943] rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparativo Econômico */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#285943] flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" /> Comparativo: Taxa Fixa Convencional vs Taxa Variável (VRA)
            </h3>
            <p className="text-xs text-slate-900 leading-relaxed">
              Na aplicação convencional com dose única uniforme, zonas de alta fertilidade natural recebem adubo desnecessário gerando saturação e lixiviação, enquanto manchas de solo pobre continuam deficientes, derrubando a produtividade. A agricultura de precisão distribui o fertilizante exatamente onde a planta necessita, gerando até <b>22% de economia direta de insumos</b> e elevando o teto produtivo da safra.
            </p>
          </div>
        </div>
      )}

      {/* Aba 2: Copernicus Sentinel-2 Pipeline */}
      {activeTab === 'sentinel2' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#285943] flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-emerald-700" />
                  Processamento de Índices Espectrais de Vegetação Sentinel-2 (BOA Level-2A)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Cálculo rigoroso de NDVI (vigor), NDWI (teor de água na folha), EVI (biomassa ajustada ao solo) e SCL (máscara de nuvens e sombras).
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-[#285943] text-xs font-bold rounded-full border border-[#5F8F52]/40 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-emerald-700" /> API REST: /api/v1/erp/satelite/sentinel
              </span>
            </div>

            {/* Presets de Talhões */}
            <div>
              <label className="text-xs font-bold text-[#285943] block mb-2">
                Selecione uma Amostra Espectral de Talhão da Fazenda:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {talhoesAmostra.map((talhao, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTalhaoAmostra(idx)}
                    className={`p-3 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                      selectedTalhaoIndex === idx
                        ? 'bg-emerald-50 border-[#285943] text-[#285943] font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="block font-semibold text-slate-900">{talhao.nome}</span>
                    <span className="font-mono text-[11px] text-emerald-700 mt-0.5 block">
                      NIR: {talhao.b08} • RED: {talhao.b04} • SCL: {talhao.scl}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuração de Bandas de Reflectância */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  B02 Azul (490nm):
                </label>
                <input
                  type="number"
                  step="0.005"
                  value={b02Azul}
                  onChange={(e) => setB02Azul(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  B04 Vermelho (665nm):
                </label>
                <input
                  type="number"
                  step="0.005"
                  value={b04Vermelho}
                  onChange={(e) => setB04Vermelho(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  B08 NIR (842nm):
                </label>
                <input
                  type="number"
                  step="0.005"
                  value={b08Nir}
                  onChange={(e) => setB08Nir(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  B11 SWIR (1610nm):
                </label>
                <input
                  type="number"
                  step="0.005"
                  value={b11Swir}
                  onChange={(e) => setB11Swir(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#285943] focus:outline-none focus:border-[#285943]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  SCL (Filtro Nuvem):
                </label>
                <select
                  value={sclClass}
                  onChange={(e) => setSclClass(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-semibold text-[#285943] focus:outline-none focus:border-[#285943]"
                >
                  <option value={4}>4 - Vegetação Saudável</option>
                  <option value={5}>5 - Solo Exposto</option>
                  <option value={3}>3 - Sombra de Nuvem</option>
                  <option value={8}>8 - Nuvem Prob. Média</option>
                  <option value={9}>9 - Nuvem Prob. Alta</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleProcessarSentinel}
                disabled={loadingSentinel}
                className="px-5 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Satellite className="w-4 h-4" />
                {loadingSentinel ? 'Processando Pixel...' : 'Calcular Índices Multiespectrais'}
              </button>
            </div>

            {/* Resultado do Processamento */}
            {sentinelResult && (
              <div className="bg-slate-50 border border-emerald-300/50 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-[#285943] font-bold text-xs rounded border border-[#5F8F52]/40">
                      SCL: {sentinelResult.classificacaoSclNome}
                    </span>
                    <span className={`text-xs font-bold ${sentinelResult.pixelValidoSemNuvem ? 'text-emerald-700' : 'text-red-600'}`}>
                      {sentinelResult.pixelValidoSemNuvem ? '✓ Pixel Válido para Análise' : '⚠️ Pixel Obstruído por Nuvem / Sombra'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600">
                    {sentinelResult.fonte}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-600 uppercase font-bold block">NDVI (Índice de Vigor)</span>
                    <span className="text-3xl font-black font-mono text-[#285943] block">{sentinelResult.ndvi}</span>
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      Biomassa: {sentinelResult.biomassaStatus}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-600 uppercase font-bold block">NDWI (Teor de Água)</span>
                    <span className="text-3xl font-black font-mono text-emerald-700 block">{sentinelResult.ndwi}</span>
                    <span className="text-[10px] font-bold text-[#285943] block">
                      Status Hídrico: {sentinelResult.estresseHidricoStatus}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-600 uppercase font-bold block">EVI (Biomassa Ajustada)</span>
                    <span className="text-3xl font-black font-mono text-amber-700 block">{sentinelResult.evi}</span>
                    <span className="text-[10px] text-slate-600 block">
                      Sem saturação de dossel denso
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgriculturaPrecisaoModule;
