import React, { useState, useMemo } from 'react';
import {
  Recycle,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  CheckCircle2,
  Sliders,
  Scale,
  ShieldCheck,
  Landmark,
} from 'lucide-react';

interface CertificadoRenovabio {
  id: string;
  usinaEmissora: string;
  biocombustivel: 'ETANOL_HIDRATADO' | 'ETANOL_ANIDRO' | 'BIODIESEL_B100' | 'BIOMETANO';
  volumeProduzidoM3: number;
  elegibilidadeBiomassaPct: number;
  neeaNotaEficienciaGCo2Mj: number;
  cbiosEmitidosTotal: number;
  precoVendaCbioB3: number;
  statusCertificacao: 'CERTIFICADA_ANP' | 'EM_AUDITORIA_VERDE' | 'RENOVACALC_ATUALIZADA';
}

export const RenovabioCalculadoraCbioModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certificados' | 'renovacalc' | 'b3mercado' | 'simulador' | 'auditoriaElegibilidade'>('certificados');

  // Parâmetros do Simulador
  const [etanolProduzidoM3, setEtanolProduzidoM3] = useState<number>(45000);
  const [fracaoBiomassaElegivelPct, setFracaoBiomassaElegivelPct] = useState<number>(93.5);
  const [notaEficienciaEnergeticaGCo2Mj, setNotaEficienciaEnergeticaGCo2Mj] = useState<number>(62.8);
  const [precoMedioCbioB3Reais, setPrecoMedioCbioB3Reais] = useState<number>(95.0);
  const [custoAuditoriaRenovabioReais, setCustoAuditoriaRenovabioReais] = useState<number>(140000);

  // Estado Auditoria Marco 2018 & Emissão CBIOs
  const [carAuditoria, setCarAuditoria] = useState<string>('MT-5107909-E8192841029');
  const [anoAberturaArea, setAnoAberturaArea] = useState<number>(2014);
  const [volumeSojaBiodieselTon, setVolumeSojaBiodieselTon] = useState<number>(28000);
  const [auditandoElegibilidade, setAuditandoElegibilidade] = useState<boolean>(false);
  const [resultadoElegibilidade, setResultadoElegibilidade] = useState<any>(null);
  const [resultadoEmissaoCbio, setResultadoEmissaoCbio] = useState<any>(null);

  const handleAuditarElegibilidadeRenovabio = async () => {
    setAuditandoElegibilidade(true);
    try {
      const resEleg = await fetch('/api/v1/renovabio/elegibilidade/auditar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carNumero: carAuditoria,
          anoAberturaArea: anoAberturaArea,
          sobreposicaoTerrasProtegidas: false
        })
      });
      const dataEleg = await resEleg.json();
      setResultadoElegibilidade(dataEleg);

      // Calcula também a emissão em tempo real
      const resEmissao = await fetch('/api/v1/renovabio/cbio/calcular-emissao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          culturaBiomassa: 'SOJA_PARA_BIODIESEL',
          volumeProducaoTon: volumeSojaBiodieselTon,
          intensidadeCarbonoAgricolaGCo2Mj: 24.8,
          cotacaoCbioB3Brl: precoMedioCbioB3Reais
        })
      });
      const dataEmissao = await resEmissao.json();
      setResultadoEmissaoCbio(dataEmissao);
    } catch (err) {
      console.error('Erro na auditoria RenovaBio:', err);
    } finally {
      setAuditandoElegibilidade(false);
    }
  };

  const [certificados, setCertificados] = useState<CertificadoRenovabio[]>([
    {
      id: 'CBIO-2026-081',
      usinaEmissora: 'Bioenergia Centro-Oeste S/A',
      biocombustivel: 'ETANOL_HIDRATADO',
      volumeProduzidoM3: 45000,
      elegibilidadeBiomassaPct: 93.5,
      neeaNotaEficienciaGCo2Mj: 62.8,
      cbiosEmitidosTotal: 56832,
      precoVendaCbioB3: 95.0,
      statusCertificacao: 'CERTIFICADA_ANP',
    },
    {
      id: 'CBIO-2026-082',
      usinaEmissora: 'Agropecuária Vale do Tijuco',
      biocombustivel: 'BIODIESEL_B100',
      volumeProduzidoM3: 20000,
      elegibilidadeBiomassaPct: 88.0,
      neeaNotaEficienciaGCo2Mj: 58.2,
      cbiosEmitidosTotal: 24500,
      precoVendaCbioB3: 94.2,
      statusCertificacao: 'CERTIFICADA_ANP',
    },
    {
      id: 'CBIO-2026-083',
      usinaEmissora: 'Biometano Sustentável Paulista',
      biocombustivel: 'BIOMETANO',
      volumeProduzidoM3: 15000,
      elegibilidadeBiomassaPct: 98.0,
      neeaNotaEficienciaGCo2Mj: 74.5,
      cbiosEmitidosTotal: 24100,
      precoVendaCbioB3: 96.5,
      statusCertificacao: 'RENOVACALC_ATUALIZADA',
    },
  ]);

  const metricas = useMemo(() => {
    const volumeElegivelM3 = Number(((etanolProduzidoM3 * fracaoBiomassaElegivelPct) / 100).toFixed(1));
    const fatorCbioPorM3 = Number(((notaEficienciaEnergeticaGCo2Mj / 1000) * 21.5).toFixed(4));
    const cbiosGerados = Number((volumeElegivelM3 * fatorCbioPorM3).toFixed(0));
    const receitaBrutaCbiosReais = Number((cbiosGerados * precoMedioCbioB3Reais).toFixed(2));
    const lucroLiquidoCbiosReais = Number((receitaBrutaCbiosReais - custoAuditoriaRenovabioReais).toFixed(2));
    const adicionalPorLitroEtanolCentavos = etanolProduzidoM3 > 0 ? Number(((receitaBrutaCbiosReais / (etanolProduzidoM3 * 1000)) * 100).toFixed(2)) : 0;

    return {
      volumeElegivelM3,
      cbiosGerados,
      receitaBrutaCbiosReais,
      lucroLiquidoCbiosReais,
      adicionalPorLitroEtanolCentavos,
    };
  }, [
    etanolProduzidoM3,
    fracaoBiomassaElegivelPct,
    notaEficienciaEnergeticaGCo2Mj,
    precoMedioCbioB3Reais,
    custoAuditoriaRenovabioReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Recycle className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Créditos de Descarbonização CBIO & RenovaBio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                Módulo 135 • Calculadora RenovaCalc & Custódia B3
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Avaliação de ciclo de vida (ACV) do poço à roda, elegibilidade territorial CAR sem desmatamento pós-2018 e emissão de títulos CBIO escriturados na B3.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador RenovaBio
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">CBIOs Emitidos</span>
            <Award className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {metricas.cbiosGerados.toLocaleString('pt-BR')} CBIOs
          </p>
          <span className="text-xs text-emerald-700 mt-1 block">
            1 CBIO = 1 ton de CO2eq evitada
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Receita Bruta B3</span>
            <DollarSign className="w-5 h-5 text-teal-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            R$ {(metricas.receitaBrutaCbiosReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-teal-700 mt-1 block">
            R$ {precoMedioCbioB3Reais.toFixed(2)} por título negociado
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Adicional por Litro</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            +{metricas.adicionalPorLitroEtanolCentavos} ¢/L
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Margem extra sobre a venda do etanol
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Elegibilidade CAR</span>
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {fracaoBiomassaElegivelPct}%
          </p>
          <span className="text-xs text-emerald-700 mt-1 block">
            Biomassa 100% livre de desmatamento
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('certificados')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'certificados'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Layers className="w-4 h-4" />
          Certificados Emitidos
        </button>

        <button
          onClick={() => setActiveTab('renovacalc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'renovacalc'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Calculadora RenovaCalc (NEEA)
        </button>

        <button
          onClick={() => setActiveTab('b3mercado')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'b3mercado'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Leilões & Pregão B3
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>

        <button
          onClick={() => setActiveTab('auditoriaElegibilidade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'auditoriaElegibilidade'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs cursor-pointer'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold cursor-pointer'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Auditoria Marco 2018 (ANP & B3)
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'certificados' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Recycle className="w-5 h-5 text-emerald-700" />
            Certificados ANP Homologados para Comercialização
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="text-xs uppercase bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Certificado / Usina</th>
                  <th className="px-4 py-3">Biocombustível</th>
                  <th className="px-4 py-3">Volume (m³)</th>
                  <th className="px-4 py-3">Elegibilidade</th>
                  <th className="px-4 py-3">NEEA (gCO2/MJ)</th>
                  <th className="px-4 py-3">CBIOs Gerados</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificados.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <span>{c.usinaEmissora}</span>
                      <span className="text-[11px] block font-mono text-slate-600">{c.id}</span>
                    </td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{c.biocombustivel}</td>
                    <td className="px-4 py-3 font-mono">{c.volumeProduzidoM3.toLocaleString('pt-BR')} m³</td>
                    <td className="px-4 py-3 font-semibold text-teal-700">{c.elegibilidadeBiomassaPct}%</td>
                    <td className="px-4 py-3">{c.neeaNotaEficienciaGCo2Mj}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.cbiosEmitidosTotal.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        {c.statusCertificacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'renovacalc' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-semibold text-slate-900">Nota de Eficiência (NEEA)</h4>
            </div>
            <p className="text-xs text-slate-600">
              Diferença entre a intensidade de carbono da gasolina fóssil (87.4 gCO2/MJ) e do etanol produzido pela usina. Quanto menor a emissão industrial, maior a geração de CBIOs.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">NEEA Homologada:</span>
              <span className="text-sm font-bold text-emerald-700 block">62.8 gCO2eq/MJ de energia limpa</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <h4 className="text-sm font-semibold text-slate-900">Fração Elegível da Biomassa</h4>
            </div>
            <p className="text-xs text-slate-600">
              Auditoria geoespacial de cada talhão de fornecedor de cana. Talhões sem CAR ativo ou com desmatamento após 2018 são expurgados do cômputo da elegibilidade.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Índice de Elegibilidade:</span>
              <span className="text-sm font-bold text-teal-700 block">93.5% da cana entregue</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-slate-900">Vinhaça & Torta de Filtro</h4>
            </div>
            <p className="text-xs text-slate-600">
              A substituição de adubos nitrogenados químicos pela recirculação de vinhaça concentrada e torta de filtro reduz a pegada agrícola em até 18%.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Bônus RenovaCalc:</span>
              <span className="text-sm font-bold text-yellow-400 block">+4.2 CBIOs por mil metros cúbicos</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'b3mercado' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-700" />
            Negociação em Ambiente B3 & Metas das Distribuidoras (Compromisso Cbios)
          </h3>
          <p className="text-sm text-slate-600">
            As distribuidoras de combustíveis fósseis são obrigadas por lei a adquirir CBIOs anualmente para comprovar a descarbonização da sua matriz de vendas, garantindo demanda e liquidez perene no pregão da B3.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Cotação Atual B3</span>
              <p className="text-lg font-bold text-emerald-700 mt-1">R$ 95,00 / CBIO</p>
              <span className="text-[11px] text-slate-600">Liquidez D+1 garantida</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Custódia Registrada</span>
              <p className="text-lg font-bold text-teal-700 mt-1">Banco Escriturador</p>
              <span className="text-[11px] text-slate-600">Emissão 100% eletrônica</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Meta Anual Brasil</span>
              <p className="text-lg font-bold text-yellow-400 mt-1">42 Milhões de CBIOs</p>
              <span className="text-[11px] text-slate-600">Meta compulsória estabelecida pelo CNPE</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-xs">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            Simulador de Faturamento RenovaBio & Impacto por Litro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Etanol Produzido (m³)</label>
              <input
                type="number"
                value={etanolProduzidoM3}
                onChange={(e) => setEtanolProduzidoM3(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Biomassa Elegível (%)</label>
              <input
                type="number"
                step="0.5"
                value={fracaoBiomassaElegivelPct}
                onChange={(e) => setFracaoBiomassaElegivelPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Nota NEEA (gCO2/MJ)</label>
              <input
                type="number"
                step="0.5"
                value={notaEficienciaEnergeticaGCo2Mj}
                onChange={(e) => setNotaEficienciaEnergeticaGCo2Mj(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço CBIO B3 (R$)</label>
              <input
                type="number"
                step="1"
                value={precoMedioCbioB3Reais}
                onChange={(e) => setPrecoMedioCbioB3Reais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Total de CBIOs Gerados:</span>
              <span className="text-base font-bold text-emerald-700">
                {metricas.cbiosGerados.toLocaleString('pt-BR')} CBIOs escriturados
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Lucro Líquido RenovaBio:</span>
              <span className="text-xl font-bold text-teal-700">
                R$ {metricas.lucroLiquidoCbiosReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Aba 5: Auditoria Marco 2018 (ANP & B3) */}
      {activeTab === 'auditoriaElegibilidade' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Auditoria de Elegibilidade RenovaBio (Marco 27/11/2018) & Projeção B3
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Validação de desmatamento zero via PRODES/INPE, cálculo de NEEA comparativa e receita líquida em leilões B3.
              </p>
            </div>

            <button
              onClick={handleAuditarElegibilidadeRenovabio}
              disabled={auditandoElegibilidade}
              className="px-5 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Recycle className="w-4 h-4" />
              {auditandoElegibilidade ? 'Auditando Satélite...' : 'Executar Auditoria & Calcular CBIOs'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Número do CAR da Fazenda</label>
              <input
                type="text"
                value={carAuditoria}
                onChange={(e) => setCarAuditoria(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Ano de Consolidação / Abertura</label>
              <input
                type="number"
                value={anoAberturaArea}
                onChange={(e) => setAnoAberturaArea(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Marco limite da ANP: 2018</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Volume de Soja para Biodiesel (ton)</label>
              <input
                type="number"
                value={volumeSojaBiodieselTon}
                onChange={(e) => setVolumeSojaBiodieselTon(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {resultadoElegibilidade && (
            <div className="bg-slate-50 border border-emerald-300/60 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Status: {resultadoElegibilidade.statusElegibilidade}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Fator de Elegibilidade: {resultadoElegibilidade.fatorElegibilidadePercentual}% • Marco Temporal 2018 Atendido
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                  APTO CERTIFICAGRO ANP
                </span>
              </div>

              {resultadoEmissaoCbio && resultadoEmissaoCbio.sucesso && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">NEEA da Cultura</span>
                    <span className="text-base font-black text-emerald-800 font-mono block mt-1">
                      {resultadoEmissaoCbio.calculoNeea.neeaGCo2Mj} g CO₂eq/MJ
                    </span>
                    <span className="text-[10px] text-slate-500">Eficiência vs fóssil (86,5 g/MJ)</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">CBIOs Gerados</span>
                    <span className="text-base font-black text-emerald-800 font-mono block mt-1">
                      {resultadoEmissaoCbio.saldoCbios.totalCbiosEmitidos.toLocaleString('pt-BR')} Títulos
                    </span>
                    <span className="text-[10px] text-slate-500">1 CBIO = 1 t CO₂ evitada</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block">Receita Líquida B3</span>
                    <span className="text-base font-black text-emerald-700 font-mono block mt-1">
                      R$ {resultadoEmissaoCbio.saldoCbios.receitaLiquidaProdutorBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500">Cotação: R$ {resultadoEmissaoCbio.saldoCbios.cotacaoCbioBrl}/CBIO</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
