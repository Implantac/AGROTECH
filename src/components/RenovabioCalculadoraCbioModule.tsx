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
  const [activeTab, setActiveTab] = useState<'certificados' | 'renovacalc' | 'b3mercado' | 'simulador'>('certificados');

  // Parâmetros do Simulador
  const [etanolProduzidoM3, setEtanolProduzidoM3] = useState<number>(45000);
  const [fracaoBiomassaElegivelPct, setFracaoBiomassaElegivelPct] = useState<number>(93.5);
  const [notaEficienciaEnergeticaGCo2Mj, setNotaEficienciaEnergeticaGCo2Mj] = useState<number>(62.8);
  const [precoMedioCbioB3Reais, setPrecoMedioCbioB3Reais] = useState<number>(95.0);
  const [custoAuditoriaRenovabioReais, setCustoAuditoriaRenovabioReais] = useState<number>(140000);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-200 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Recycle className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Créditos de Descarbonização CBIO & RenovaBio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">CBIOs Emitidos</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.cbiosGerados.toLocaleString('pt-BR')} CBIOs
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            1 CBIO = 1 ton de CO2eq evitada
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Receita Bruta B3</span>
            <DollarSign className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.receitaBrutaCbiosReais / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-teal-400 mt-1 block">
            R$ {precoMedioCbioB3Reais.toFixed(2)} por título negociado
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Adicional por Litro</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            +{metricas.adicionalPorLitroEtanolCentavos} ¢/L
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            Margem extra sobre a venda do etanol
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Elegibilidade CAR</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {fracaoBiomassaElegivelPct}%
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
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
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Certificados Emitidos
        </button>

        <button
          onClick={() => setActiveTab('renovacalc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'renovacalc'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Calculadora RenovaCalc (NEEA)
        </button>

        <button
          onClick={() => setActiveTab('b3mercado')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'b3mercado'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Leilões & Pregão B3
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'certificados' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Recycle className="w-5 h-5 text-emerald-400" />
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
              <tbody className="divide-y divide-slate-800/60">
                {certificados.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-white">
                      <span>{c.usinaEmissora}</span>
                      <span className="text-[11px] block font-mono text-slate-600">{c.id}</span>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{c.biocombustivel}</td>
                    <td className="px-4 py-3 font-mono">{c.volumeProduzidoM3.toLocaleString('pt-BR')} m³</td>
                    <td className="px-4 py-3 font-semibold text-teal-400">{c.elegibilidadeBiomassaPct}%</td>
                    <td className="px-4 py-3">{c.neeaNotaEficienciaGCo2Mj}</td>
                    <td className="px-4 py-3 font-bold text-white">{c.cbiosEmitidosTotal.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Nota de Eficiência (NEEA)</h4>
            </div>
            <p className="text-xs text-slate-600">
              Diferença entre a intensidade de carbono da gasolina fóssil (87.4 gCO2/MJ) e do etanol produzido pela usina. Quanto menor a emissão industrial, maior a geração de CBIOs.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">NEEA Homologada:</span>
              <span className="text-sm font-bold text-emerald-400 block">62.8 gCO2eq/MJ de energia limpa</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h4 className="text-sm font-semibold text-white">Fração Elegível da Biomassa</h4>
            </div>
            <p className="text-xs text-slate-600">
              Auditoria geoespacial de cada talhão de fornecedor de cana. Talhões sem CAR ativo ou com desmatamento após 2018 são expurgados do cômputo da elegibilidade.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-xs text-slate-600">Índice de Elegibilidade:</span>
              <span className="text-sm font-bold text-teal-400 block">93.5% da cana entregue</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Vinhaça & Torta de Filtro</h4>
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
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            Negociação em Ambiente B3 & Metas das Distribuidoras (Compromisso Cbios)
          </h3>
          <p className="text-sm text-slate-600">
            As distribuidoras de combustíveis fósseis são obrigadas por lei a adquirir CBIOs anualmente para comprovar a descarbonização da sua matriz de vendas, garantindo demanda e liquidez perene no pregão da B3.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Cotação Atual B3</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">R$ 95,00 / CBIO</p>
              <span className="text-[11px] text-slate-600">Liquidez D+1 garantida</span>
            </div>

            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-600">Custódia Registrada</span>
              <p className="text-lg font-bold text-teal-400 mt-1">Banco Escriturador</p>
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
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-200 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Simulador de Faturamento RenovaBio & Impacto por Litro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Etanol Produzido (m³)</label>
              <input
                type="number"
                value={etanolProduzidoM3}
                onChange={(e) => setEtanolProduzidoM3(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Biomassa Elegível (%)</label>
              <input
                type="number"
                step="0.5"
                value={fracaoBiomassaElegivelPct}
                onChange={(e) => setFracaoBiomassaElegivelPct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Nota NEEA (gCO2/MJ)</label>
              <input
                type="number"
                step="0.5"
                value={notaEficienciaEnergeticaGCo2Mj}
                onChange={(e) => setNotaEficienciaEnergeticaGCo2Mj(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Preço CBIO B3 (R$)</label>
              <input
                type="number"
                step="1"
                value={precoMedioCbioB3Reais}
                onChange={(e) => setPrecoMedioCbioB3Reais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-600 block">Total de CBIOs Gerados:</span>
              <span className="text-base font-bold text-emerald-400">
                {metricas.cbiosGerados.toLocaleString('pt-BR')} CBIOs escriturados
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-600 block">Lucro Líquido RenovaBio:</span>
              <span className="text-xl font-bold text-teal-400">
                R$ {metricas.lucroLiquidoCbiosReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
