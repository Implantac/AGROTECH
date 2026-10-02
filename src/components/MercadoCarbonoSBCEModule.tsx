import React, { useState, useMemo } from 'react';
import {
  Globe,
  Coins,
  TrendingDown,
  TrendingUp,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Leaf,
  FileCheck2,
  Info
} from 'lucide-react';

interface ProjetoRemocao {
  id: string;
  nome: string;
  metodologia: 'PLANTIO_DIRETO_CONTINUO' | 'ILPF_PASTAGEM' | 'RESERVA_LEGAL_EXCEDENTE' | 'BIOCHAR_COMPOSTAGEM';
  areaHa: number;
  remocaoTonCo2Ano: number;
  statusCertificacao: 'AUDITADO_SBCE' | 'EM_VERIFICACAO_VERRA';
}

export const MercadoCarbonoSBCEModule: React.FC = () => {
  const [projetos, setProjetos] = useState<ProjetoRemocao[]>([
    {
      id: 'SBCE-01',
      nome: 'Manejo Plantio Direto Permanente (Palhada & Biologia)',
      metodologia: 'PLANTIO_DIRETO_CONTINUO',
      areaHa: 2400,
      remocaoTonCo2Ano: 1250,
      statusCertificacao: 'AUDITADO_SBCE',
    },
    {
      id: 'SBCE-02',
      nome: 'ILPF Boi Safrinha (Ciclagem Forrageira)',
      metodologia: 'ILPF_PASTAGEM',
      areaHa: 850,
      remocaoTonCo2Ano: 620,
      statusCertificacao: 'AUDITADO_SBCE',
    },
    {
      id: 'SBCE-03',
      nome: 'Excedente de Vegetação Nativa (Cota de Reserva Ambiental CRA)',
      metodologia: 'RESERVA_LEGAL_EXCEDENTE',
      areaHa: 420,
      remocaoTonCo2Ano: 480,
      statusCertificacao: 'EM_VERIFICACAO_VERRA',
    },
  ]);

  const [precoCreditoSbceReais, setPrecoCreditoSbceReais] = useState<number>(68.0); // R$ 68,00 por t CO2eq
  const [valorCusteioBancarioReais, setValorCusteioBancarioReais] = useState<number>(8500000); // R$ 8.5 milhões no Plano Safra
  const [descontoJurosVerdePct, setDescontoJurosVerdePct] = useState<number>(1.75); // -1.75% a.a. desconto verde
  const [emissaoTotalFazendaTon, setEmissaoTotalFazendaTon] = useState<number>(550); // Emissões Escopo 1 (diesel, fertilizantes)

  // Cálculos do SBCE e Finanças Sustentáveis
  const sbceMetrics = useMemo(() => {
    // 1. Total de Remoções Auditadas
    const remocoesTotaisTonAno = projetos.reduce((acc, p) => acc + p.remocaoTonCo2Ano, 0);

    // 2. Saldo Líquido Positivo de Carbono (Carbon Negative Farm)
    const saldoLiquidoTonCo2Ano = Math.max(0, remocoesTotaisTonAno - emissaoTotalFazendaTon);

    // 3. Receita Direta da Venda de Créditos de Remoção
    const receitaVendaCreditosReais = saldoLiquidoTonCo2Ano * precoCreditoSbceReais;

    // 4. Economia Financeira no Financiamento Rural Verde (Plano Safra / BNDES ABC+)
    // Desconto na taxa de juros bancária anual
    const economiaJurosBancariosReais = valorCusteioBancarioReais * (descontoJurosVerdePct / 100.0);

    // 5. Benefício Econômico Global Integrado
    const beneficioEconomicoTotalReais = receitaVendaCreditosReais + economiaJurosBancariosReais;

    // 6. Intensidade de Emissão por Hectare Total
    const areaTotalFazendaHa = projetos.reduce((acc, p) => acc + p.areaHa, 0);
    const beneficioPorHaReais = areaTotalFazendaHa > 0 ? beneficioEconomicoTotalReais / areaTotalFazendaHa : 0;

    return {
      remocoesTotaisTonAno,
      saldoLiquidoTonCo2Ano,
      receitaVendaCreditosReais,
      economiaJurosBancariosReais,
      beneficioEconomicoTotalReais,
      areaTotalFazendaHa,
      beneficioPorHaReais,
    };
  }, [
    projetos,
    precoCreditoSbceReais,
    valorCusteioBancarioReais,
    descontoJurosVerdePct,
    emissaoTotalFazendaTon,
  ]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Mercado Regulado de Carbono • SBCE & Finanças Verdes
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
                    SBCE • Artigo 6 Paris • CPR Verde
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Monetização de remoções florestais e de solo, créditos auditados e deságio de juros bancários no Plano Safra Verde.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Fazenda Carbono Negativo ({sbceMetrics.saldoLiquidoTonCo2Ano.toLocaleString('pt-BR')} t CO₂eq saldo)
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Saldo Líquido de Remoções */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Remoção Líquida</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            +{sbceMetrics.saldoLiquidoTonCo2Ano.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-slate-600">t CO₂eq/ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Remoção: {sbceMetrics.remocoesTotaisTonAno} t vs {emissaoTotalFazendaTon} t emitidas.
          </p>
        </div>

        {/* KPI 2: Economia de Juros Bancários */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Deságio de Juros (Plano Safra)</span>
            <Landmark className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            R$ {sbceMetrics.economiaJurosBancariosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-slate-600">/ ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Bonificação: -{descontoJurosVerdePct}% a.a. sobre R$ {(valorCusteioBancarioReais / 1000000).toFixed(1)}M.
          </p>
        </div>

        {/* KPI 3: Venda de Créditos */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Receita Venda de Créditos</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            R$ {sbceMetrics.receitaVendaCreditosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cotação SBCE: R$ {precoCreditoSbceReais.toFixed(2)}/t CO₂eq.
          </p>
        </div>

        {/* KPI 4: Benefício Econômico Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Benefício Verde Total</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {sbceMetrics.beneficioEconomicoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Retorno: +R$ {sbceMetrics.beneficioPorHaReais.toFixed(2)}/ha em finanças sustentáveis.
          </p>
        </div>
      </div>

      {/* Grid Principal: Metodologias e Parâmetros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Projetos de Descarbonização */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                Projetos & Ativos de Sequestro na Fazenda
              </h3>
              <p className="text-xs text-slate-600">
                Projetos certificados com rastreabilidade satelital MRV (Monitoramento, Relato e Verificação).
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {projetos.length} Projetos Ativos
            </span>
          </div>

          <div className="space-y-3">
            {projetos.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-xs font-bold border border-teal-500/30">
                      {p.id}
                    </span>
                    <h4 className="text-xs font-bold text-white">{p.nome}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    {p.statusCertificacao.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                  <span>Área: <strong className="text-white">{p.areaHa.toLocaleString('pt-BR')} ha</strong></span>
                  <span>Remoção Anual: <strong className="text-emerald-400">+{p.remocaoTonCo2Ano.toLocaleString('pt-BR')} t CO₂eq</strong></span>
                  <span>Taxa: <strong className="text-cyan-400">{(p.remocaoTonCo2Ano / p.areaHa).toFixed(2)} t CO₂/ha</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Técnico SBCE */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes do Sistema Brasileiro de Comércio de Emissões (SBCE):
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Mercado Cap-and-Trade:</strong> Empresas com emissões acima de 25 mil t CO₂eq/ano são obrigadas a compensar sua pegada comprando créditos no SBCE.
              </li>
              <li>
                <strong>Não-Obrigatoriedade e Oportunidade do Agro:</strong> O setor primário agrícola não é tributado pelas emissões biológicas, atuando exclusivamente como ofertante de créditos de remoção de alta liquidez.
              </li>
              <li>
                <strong>CPR Verde & Desconto Bancário:</strong> A Cédula de Produto Rural Verde formaliza o ativo ambiental e viabiliza a redução compulsória das taxas de juros no Banco do Brasil, Sicredi e Bradesco.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Financeiros */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-cyan-400" />
            Parâmetros Financeiros Verdes
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço do Crédito SBCE (R$/t CO₂)</label>
              <input
                type="number"
                value={precoCreditoSbceReais}
                onChange={(e) => setPrecoCreditoSbceReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Volume de Custeio Bancário (R$)</label>
              <input
                type="number"
                step="500000"
                value={valorCusteioBancarioReais}
                onChange={(e) => setValorCusteioBancarioReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Desconto de Juros Verde (% a.a.)</span>
                <span className="text-cyan-400 font-mono font-bold">-{descontoJurosVerdePct}% a.a.</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.25"
                value={descontoJurosVerdePct}
                onChange={(e) => setDescontoJurosVerdePct(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Emissões Totais da Fazenda (t CO₂/ano)</label>
              <input
                type="number"
                value={emissaoTotalFazendaTon}
                onChange={(e) => setEmissaoTotalFazendaTon(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Economia no Custeio:</span>
                <span className="text-cyan-400 font-mono font-bold">
                  R$ {sbceMetrics.economiaJurosBancariosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Venda no Mercado:</span>
                <span className="text-amber-400 font-mono font-bold">
                  R$ {sbceMetrics.receitaVendaCreditosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Lucro Verde Total:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {sbceMetrics.beneficioEconomicoTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ano
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
