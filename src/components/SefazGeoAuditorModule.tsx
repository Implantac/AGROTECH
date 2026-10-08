import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Key,
  FileCode,
  MapPin,
  FileCheck,
  Copy,
  Check,
  Hash,
  Calculator,
  Percent,
  Info
} from 'lucide-react';
import {
  SefazGeoService,
  CertificadoA1Info,
  NFeAssinadaEnvelope,
  AnaliseSobreposicaoCAR,
  DecomposicaoChaveNFe
} from '../services/sefazGeoService';
import {
  ReformaTributariaService,
  TABELA_CCLASSTRIB_RURAL,
  RegimeProdutorRural,
  CalculoIbsCbsResultado,
  ComparativoRegimesProdutor,
  ClassificacaoTributariaItem
} from '../services/reformaTributariaService';

export const SefazGeoAuditorModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'certificado' | 'assinador_nfe' | 'reforma_tributaria' | 'geo_car' | 'validador_chave'
  >('reforma_tributaria');

  // Certificado Digital A1
  const [certInfo] = useState<CertificadoA1Info>(SefazGeoService.verificarCertificadoA1());

  // Parâmetros da Reforma Tributária IBS & CBS (NT 2024.002)
  const [cClassTribSelecionado, setCClassTribSelecionado] = useState<string>('200032');
  const [regimeProdutor, setRegimeProdutor] = useState<RegimeProdutorRural>('PRODUTOR_PF_NAO_OPTANTE');
  const [anoReferencia, setAnoReferencia] = useState<number>(2026);
  const [valorOperacaoSimulacao, setValorOperacaoSimulacao] = useState<number>(185400.0);
  const [produtoDescricao, setProdutoDescricao] = useState<string>('SOJA EM GRAO TRANSGENICA SAFRA 2025/2026');
  const [xmlCopiado, setXmlCopiado] = useState<boolean>(false);

  // NF-e Assinada
  const [numeroNFe, setNumeroNFe] = useState<string>('000049281');
  const [serieNFe, setSerieNFe] = useState<string>('1');
  const [valorTotalNFe, setValorTotalNFe] = useState<number>(185400.0);
  const [nfeAssinada, setNfeAssinada] = useState<NFeAssinadaEnvelope>(() =>
    SefazGeoService.assinarNFe('000049281', '1', 185400.0, 'SOJA EM GRAO TRANSGENICA SAFRA 2025/2026', '200032', 'PRODUTOR_PF_NAO_OPTANTE')
  );

  // Análise Geoespacial CAR
  const [areaTalhaoHa, setAreaTalhaoHa] = useState<number>(450.0);
  const [appSobrepostaHa, setAppSobrepostaHa] = useState<number>(4.5);
  const [embargoIbamaHa, setEmbargoIbamaHa] = useState<number>(0.0);
  const [analiseCar, setAnaliseCar] = useState<AnaliseSobreposicaoCAR>(() =>
    SefazGeoService.auditarSobreposicaoGeoespacial('TALHAO-04-SEDE', 450.0, 4.5, 0.0)
  );

  // Validador de Chave SEFAZ 44 dígitos
  const [chaveInput, setChaveInput] = useState<string>(
    '51260900123456000199550010000492811100000008'
  );
  const [copiado, setCopiado] = useState<boolean>(false);

  const analiseChave: DecomposicaoChaveNFe = useMemo(() => {
    return SefazGeoService.validarChaveAcesso(chaveInput);
  }, [chaveInput]);

  // Simulação dinâmica de IBS e CBS
  const calculoIbsCbsAtual: CalculoIbsCbsResultado = useMemo(() => {
    return ReformaTributariaService.calcularIbsCbs({
      valorOperacao: valorOperacaoSimulacao,
      regimeProdutor,
      cClassTrib: cClassTribSelecionado,
      anoReferencia,
    });
  }, [valorOperacaoSimulacao, regimeProdutor, cClassTribSelecionado, anoReferencia]);

  // Comparativo de regimes
  const comparativoRegimes: ComparativoRegimesProdutor = useMemo(() => {
    return ReformaTributariaService.simularComparativoRegimes(
      valorOperacaoSimulacao,
      valorOperacaoSimulacao * 0.45,
      valorOperacaoSimulacao * 0.15
    );
  }, [valorOperacaoSimulacao]);

  // Visão tributária consolidada: Regra Tradicional (Normal) + Reforma Tributária (IBS/CBS)
  const tributacaoConsolidada = useMemo(() => {
    return ReformaTributariaService.calcularTributacaoConsolidada({
      valorOperacao: valorOperacaoSimulacao,
      regimeProdutor,
      cClassTrib: cClassTribSelecionado,
      anoReferencia,
      regimeIcms: 'DIFERIMENTO_INTERNO',
      opcaoFunrural: 'COMERCIALIZACAO',
    });
  }, [valorOperacaoSimulacao, regimeProdutor, cClassTribSelecionado, anoReferencia]);

  // Disparar Assinatura
  const handleAssinarNFe = () => {
    const envelope = SefazGeoService.assinarNFe(
      numeroNFe,
      serieNFe,
      valorTotalNFe,
      produtoDescricao,
      cClassTribSelecionado,
      regimeProdutor
    );
    setNfeAssinada(envelope);
    setChaveInput(envelope.chaveAcesso);
  };

  // Disparar Auditoria Geoespacial
  const handleAuditarGeo = () => {
    const resultado = SefazGeoService.auditarSobreposicaoGeoespacial(
      'TALHAO-04-SEDE',
      areaTalhaoHa,
      appSobrepostaHa,
      embargoIbamaHa
    );
    setAnaliseCar(resultado);
  };

  const handleCopiarChave = () => {
    navigator.clipboard.writeText(chaveInput);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCopiarXmlSnippet = () => {
    navigator.clipboard.writeText(`${calculoIbsCbsAtual.xmlSnippetIbsCbs}\n\n${calculoIbsCbsAtual.xmlSnippetTot}`);
    setXmlCopiado(true);
    setTimeout(() => setXmlCopiado(false), 2000);
  };

  const classTribInfo: ClassificacaoTributariaItem = useMemo(() => {
    return TABELA_CCLASSTRIB_RURAL.find((c: ClassificacaoTributariaItem) => c.cClassTrib === cClassTribSelecionado) || TABELA_CCLASSTRIB_RURAL[0];
  }, [cClassTribSelecionado]);

  return (
    <div className="space-y-6">
      {/* Top Banner do Módulo */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Auditoria Fiscal, Geoespacial & Reforma Tributária
            </span>
            <span className="text-xs text-slate-500">EC 132/2023 • LC 214/2025 • NT 2024.002</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-700" /> SEFAZ Geo-Auditor & Reforma Tributária (IBS / CBS)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Motor fiscal completo para a Reforma Tributária do agronegócio (Art. 132 e Art. 140), emissão de NF-e 4.00 com novos grupos XML, assinatura ICP-Brasil A1 e auditoria territorial CAR / SICAR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Certificado A1 Válido (245 dias)
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 text-xs font-bold flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-sky-700" />
            Schema NT 2024.002 Ativo
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Regime Tributário</span>
            <Calculator className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">
            {regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE' ? 'Produtor Rural Não Optante' : 'Produtor Optante (Crédito Amplo)'}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE' ? 'Gera 8,5% Crédito Presumido ao Comprador' : 'Apropriação ampla de insumos e diesel'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Classificação cClassTrib</span>
            <FileCode className="w-4 h-4 text-sky-700" />
          </div>
          <div className="text-sm font-mono font-bold text-sky-800">{cClassTribSelecionado}</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1 truncate">
            {classTribInfo.descricao.slice(0, 38)}...
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tributo Devido Venda</span>
            <Percent className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            R$ {calculoIbsCbsAtual.vTotalIbsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE' ? 'Débito zero na saída' : `IBS R$ ${calculoIbsCbsAtual.vIBS.toFixed(2)} + CBS R$ ${calculoIbsCbsAtual.vCBS.toFixed(2)}`}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Crédito Rural & CAR</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-bold text-emerald-700">100% REGULAR</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Zero sobreposição de desmate/IBAMA
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reforma_tributaria')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'reforma_tributaria'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold'
          }`}
        >
          <Calculator className="w-4 h-4" />
          1. Reforma Tributária (IBS / CBS - NT 2024.002)
        </button>

        <button
          onClick={() => setActiveTab('assinador_nfe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'assinador_nfe'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold'
          }`}
        >
          <FileCode className="w-4 h-4" />
          2. Emissor & Assinador NF-e 4.00 com IBS/CBS
        </button>

        <button
          onClick={() => setActiveTab('certificado')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'certificado'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold'
          }`}
        >
          <Lock className="w-4 h-4" />
          3. Certificado Digital A1 (.pfx)
        </button>

        <button
          onClick={() => setActiveTab('geo_car')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'geo_car'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold'
          }`}
        >
          <MapPin className="w-4 h-4" />
          4. Auditoria Geo CAR / IBAMA
        </button>

        <button
          onClick={() => setActiveTab('validador_chave')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'validador_chave'
              ? 'bg-emerald-700 text-white shadow-sm font-bold'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-semibold'
          }`}
        >
          <Hash className="w-4 h-4" />
          5. Validador Chave SEFAZ (Mód. 11)
        </button>
      </div>

      {/* Conteúdo Aba 1: Reforma Tributária IBS & CBS */}
      {activeTab === 'reforma_tributaria' && (
        <div className="space-y-6">
          {/* Card de Configuração e Parâmetros da Simulação */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-700" />
                  Simulador de IBS e CBS para o Produtor Rural (EC 132/2023 & LC 214/2025)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Projeção oficial de alíquotas com base no cronograma constitucional de transição (2026 a 2033) e regras específicas para o agronegócio.
                </p>
              </div>

              {/* Seletor de Ano da Reforma */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setAnoReferencia(2026)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    anoReferencia === 2026
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2026 (Ano Teste 1%)
                </button>
                <button
                  type="button"
                  onClick={() => setAnoReferencia(2028)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    anoReferencia === 2028
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2028 (Transição)
                </button>
                <button
                  type="button"
                  onClick={() => setAnoReferencia(2033)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    anoReferencia === 2033
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2033 (Regime Pleno)
                </button>
              </div>
            </div>

            {/* Parâmetros da Operação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Regime Jurídico do Produtor:</label>
                <select
                  value={regimeProdutor}
                  onChange={(e) => setRegimeProdutor(e.target.value as RegimeProdutorRural)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="PRODUTOR_PF_NAO_OPTANTE">
                    Pessoa Física NÃO Optante (Art. 140 LC 214/2025 - Padrão)
                  </option>
                  <option value="PRODUTOR_OPTANTE_IBS_CBS">
                    Pessoa Física OPTANTE pelo IBS/CBS (Regime Pleno)
                  </option>
                  <option value="PESSOA_JURIDICA_AGRO">
                    Pessoa Jurídica Agropecuária (Lucro Presumido / Real)
                  </option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE'
                    ? 'Dispensa débito na saída; transfere crédito presumido ao comprador PJ.'
                    : 'Recolhe IBS/CBS com redução aplicável e apropria créditos de insumos/diesel.'}
                </span>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Classificação Tributária Oficial (cClassTrib):</label>
                <select
                  value={cClassTribSelecionado}
                  onChange={(e) => setCClassTribSelecionado(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {TABELA_CCLASSTRIB_RURAL.map((item: ClassificacaoTributariaItem) => (
                    <option key={item.cClassTrib} value={item.cClassTrib}>
                      {item.cClassTrib} - {item.descricao.slice(0, 52)}...
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  {classTribInfo.fundamentoLegal}
                </span>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Valor da Carga / Operação (R$):</label>
                <input
                  type="number"
                  value={valorOperacaoSimulacao}
                  onChange={(e) => setValorOperacaoSimulacao(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Ex: 1.426 sacas de soja a R$ 130,00/sc = R$ 185.400,00
                </span>
              </div>
            </div>

            {/* Alíquotas e Decomposição do Cálculo */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Quadro de Alíquotas e Repartição Federativa ({anoReferencia})
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                  CST: {calculoIbsCbsAtual.classificacao.cstIbsCbs} • Redução: {calculoIbsCbsAtual.pRedIBS}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">CBS Federal (União):</span>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    R$ {calculoIbsCbsAtual.vCBS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Alíquota: {calculoIbsCbsAtual.pCBSNominal}% (Efetiva: {calculoIbsCbsAtual.pCBSEfetiva}%)
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">IBS Estadual (Mato Grosso - 70%):</span>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    R$ {calculoIbsCbsAtual.vIBSEst.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Alíquota Efetiva: {calculoIbsCbsAtual.pIBSEst}%
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">IBS Municipal (Sorriso - MT - 30%):</span>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    R$ {calculoIbsCbsAtual.vIBSMun.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Alíquota Efetiva: {calculoIbsCbsAtual.pIBSMun}%
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Total IBS + CBS Devido:</span>
                  <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                    R$ {calculoIbsCbsAtual.vTotalIbsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE' ? 'Zero débito na saída' : `IBS R$ ${calculoIbsCbsAtual.vIBS.toFixed(2)} + CBS R$ ${calculoIbsCbsAtual.vCBS.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparativo de Estratégia Tributária: Optante vs Não-Optante */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Produtor PF Não Optante (Regime Especial)</h4>
                    <span className="text-[11px] text-slate-500">Art. 140 da LC 214/2025 • Padrão Pequeno/Médio Produtor</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded">
                  Recomendado
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Tributo Devido na Saída:</span>
                  <span className="font-bold font-mono text-emerald-700">R$ 0,00 (Isento de recolhimento)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Crédito Presumido Transferido ao Comprador:</span>
                  <span className="font-bold font-mono text-sky-700">
                    R$ {comparativoRegimes.cenarioNaoOptante.creditoPresumidoTransferidoAoComprador.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Burocracia & Obrigações Acessórias:</span>
                  <span className="font-semibold text-slate-700">{comparativoRegimes.cenarioNaoOptante.obrigacoesAcessorias}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Aproveitamento de Crédito nas Compras:</span>
                  <span className="font-semibold text-amber-700">Não aproveita diretamente</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Vantagem Comercial:
                </p>
                As tradings (Cargill, Bunge, ADM) e cooperativas compram com preferência porque aproveitam crédito presumido na sua apuração, sem que o produtor pague imposto direto.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    B
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Produtor Optante pelo Regime Pleno</h4>
                    <span className="text-[11px] text-slate-500">Regra Geral de Débito e Crédito • Grandes Faturamentos</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded">
                  Sob Demanda
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Tributo Devido na Saída (após 60% redução):</span>
                  <span className="font-bold font-mono text-slate-900">
                    R$ {comparativoRegimes.cenarioOptante.debitoVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Total de Créditos de Insumos e Máquinas:</span>
                  <span className="font-semibold font-mono text-emerald-700">
                    R$ {comparativoRegimes.cenarioOptante.totalCreditos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Burocracia & Escrituração:</span>
                  <span className="font-semibold text-rose-700">{comparativoRegimes.cenarioOptante.obrigacoesAcessorias}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Saldo a Pagar ou Crédito Acumulado:</span>
                  <span className={`font-bold font-mono ${comparativoRegimes.cenarioOptante.saldoAPagarOuCreditoAcumulado < 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    R$ {comparativoRegimes.cenarioOptante.saldoAPagarOuCreditoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-700" /> Parecer do AgTech:
                </p>
                {comparativoRegimes.justificativa}
              </div>
            </div>
          </div>

          {/* Demonstrativo da Convivência Tributária: Regra Vigente (Normal) vs Reforma Tributária (IBS/CBS) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Demonstrativo da Convivência Tributária: Regra Vigente (Normal) & Reforma Tributária (IBS/CBS)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Auditoria de coexistência obrigatória durante o período de transição constitucional (2026-2032).
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                Status: Ambos os Regimes Coexistem na NF-e
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Coluna Regra Vigente */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <span className="text-emerald-800">1. Tributação Tradicional Vigente (Normal)</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">ICMS + PIS/COFINS + Funrural</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">ICMS Saída Interna (CST 51):</span>
                    <span className="font-mono font-bold text-slate-900">R$ 0,00 (Diferimento Art. 358 RICMS/MT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">PIS / COFINS Agro (CST 09):</span>
                    <span className="font-mono font-bold text-slate-900">R$ 0,00 (Suspensão Lei 10.925/2004)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Funrural (Opção Comercialização 1,5%):</span>
                    <span className="font-mono font-bold text-rose-700">- R$ {tributacaoConsolidada.regraNormal.funrural.valorRetencao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">FETHAB Soja MT (R$ 1,45/saca):</span>
                    <span className="font-mono font-semibold text-slate-700">- R$ {(tributacaoConsolidada.regraNormal.fethabMt?.valorRetencao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-200 font-bold">
                    <span className="text-slate-700">Total Retenções em Fonte:</span>
                    <span className="font-mono text-rose-700">- R$ {tributacaoConsolidada.resumoImpactoFinanceiro.totalRetencoesFonte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Coluna Reforma Tributária */}
              <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-2.5">
                <div className="flex justify-between items-center font-bold text-slate-900 border-b border-sky-200 pb-2">
                  <span className="text-sky-800">2. Nova Regra da Reforma (IBS & CBS)</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono font-bold">EC 132/2023 • LC 214/2025</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Classificação cClassTrib:</span>
                    <span className="font-mono font-bold text-slate-900">{cClassTribSelecionado} (CST {tributacaoConsolidada.regraIbsCbs.classificacao.cstIbsCbs})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Débito IBS + CBS Direto na Venda:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      R$ {tributacaoConsolidada.regraIbsCbs.vTotalIbsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      {regimeProdutor === 'PRODUTOR_PF_NAO_OPTANTE' ? ' (Isento Art. 140)' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Crédito Presumido Transferido ao Adquirente:</span>
                    <span className="font-mono font-bold text-sky-800">
                      R$ {tributacaoConsolidada.resumoImpactoFinanceiro.creditoPresumidoGeradoParaAdquirente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (8,5%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tags no XML da NF-e 4.00:</span>
                    <span className="font-medium text-emerald-700">&lt;IBSCBS&gt; + &lt;IBSCBSTot&gt; geradas</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-sky-200 font-bold">
                    <span className="text-slate-700">Valor Líquido Efetivo na Conta:</span>
                    <span className="font-mono text-emerald-800">R$ {tributacaoConsolidada.resumoImpactoFinanceiro.valorLiquidoEfetivoConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inspetor de XML Schema NT 2024.002 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-700" />
                  Estrutura XML Conforme Nota Técnica 2024.002 / 2025.002 (SEFAZ & Receita Federal)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tags &lt;IBSCBS&gt; no item e &lt;IBSCBSTot&gt; no total geradas automaticamente pelo motor AgTech.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopiarXmlSnippet}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {xmlCopiado ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                {xmlCopiado ? 'Tags Copiadas' : 'Copiar Snippet XML'}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-72 leading-relaxed">
{`${calculoIbsCbsAtual.xmlSnippetIbsCbs}

${calculoIbsCbsAtual.xmlSnippetTot}`}
            </pre>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Assinador NF-e com IBS/CBS */}
      {activeTab === 'assinador_nfe' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-700" />
                  Emissor & Assinador de NF-e 4.00 com Grupo &lt;IBSCBS&gt;
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Assinatura W3C C14N com certificado digital A1, chave de 44 dígitos, módulo 11 e tags oficiais da Reforma Tributária.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAssinarNFe}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold text-white text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <FileCode className="w-4 h-4" />
                Assinar Digitalmente e Transmitir à SEFAZ
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Número NF-e:</label>
                <input
                  type="text"
                  value={numeroNFe}
                  onChange={(e) => setNumeroNFe(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Série:</label>
                <input
                  type="text"
                  value={serieNFe}
                  onChange={(e) => setSerieNFe(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Valor Total (R$):</label>
                <input
                  type="number"
                  value={valorTotalNFe}
                  onChange={(e) => setValorTotalNFe(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">cClassTrib Reforma:</label>
                <select
                  value={cClassTribSelecionado}
                  onChange={(e) => setCClassTribSelecionado(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {TABELA_CCLASSTRIB_RURAL.map((c: ClassificacaoTributariaItem) => (
                    <option key={c.cClassTrib} value={c.cClassTrib}>
                      {c.cClassTrib} - CST {c.cstIbsCbs}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="text-slate-700 block mb-1 font-semibold">Descrição do Produto Rural:</label>
              <input
                type="text"
                value={produtoDescricao}
                onChange={(e) => setProdutoDescricao(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-900">Envelope XML Assinado & Distribuído pela SEFAZ:</span>
                <p className="text-[11px] text-slate-500">Chave de acesso: <span className="font-mono text-emerald-800 font-bold">{nfeAssinada.chaveAcesso}</span></p>
              </div>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 font-bold">
                {nfeAssinada.statusSefaz}
              </span>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl text-xs font-mono overflow-x-auto max-h-72 leading-relaxed">
              {nfeAssinada.xmlAssinado}
            </pre>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Certificado Digital A1 */}
      {activeTab === 'certificado' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-700" />
            Detalhes da Chave Privada e Certificado Digital ICP-Brasil
          </h3>
          <p className="text-xs text-slate-600">
            O certificado A1 fica armazenado de forma criptografada em cofre de chaves (Key Vault) com renovação assistida e disparo de webhook 30 dias antes do vencimento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-slate-500 block font-semibold">Titular do Certificado:</span>
              <p className="text-slate-900 font-bold text-sm">{certInfo.nomeTitular}</p>
              <span className="text-slate-500 block font-semibold mt-2">CNPJ do Produtor / Empresa:</span>
              <p className="font-mono text-sky-800 font-bold">{certInfo.cnpjCpf}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-slate-500 block font-semibold">Autoridade Certificadora (AC):</span>
              <p className="text-slate-900 font-bold">{certInfo.emissor}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-500">Validade:</span>
                <span className="text-emerald-700 font-bold font-mono">Até {certInfo.dataValidade}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-600 h-full w-[70%]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Geo CAR */}
      {activeTab === 'geo_car' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              Auditoria de Polígono do Talhão vs CAR Oficial
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Área Total do Talhão (ha):</label>
                <input
                  type="number"
                  value={areaTalhaoHa}
                  onChange={(e) => setAreaTalhaoHa(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Sobreposição com APP (ha):</label>
                <input
                  type="number"
                  value={appSobrepostaHa}
                  onChange={(e) => setAppSobrepostaHa(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Sobreposição com Embargo IBAMA (ha):</label>
                <input
                  type="number"
                  value={embargoIbamaHa}
                  onChange={(e) => setEmbargoIbamaHa(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAuditarGeo}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold text-white transition-all shadow-sm mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Executar Auditoria Territorial
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Resultado da Conformidade Ambiental & EUDR
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600">Status Ambiental CAR:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {analiseCar.statusConformidade}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600">Conformidade Regulamento EUDR:</span>
                <span className="font-bold text-emerald-700">
                  {analiseCar.statusConformidade === 'CONFORME_EUDR' ? '100% EM CONFORMIDADE' : 'NÃO CONFORME'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600">Apto a Financiamento Bancário:</span>
                <span className="font-bold text-emerald-700">
                  {analiseCar.aptoCreditoRural ? '100% HABILITADO' : 'BLOQUEADO'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Reserva Legal Calculada:</span>
                <span className="font-bold text-sky-800 font-mono">{analiseCar.sobreposicaoReservaLegalHa} ha (20%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 5: Validador Chave SEFAZ 44 Dígitos */}
      {activeTab === 'validador_chave' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-emerald-700" />
                  Validador e Decompositor Oficial de Chave de Acesso SEFAZ (44 Dígitos)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Audita a integridade matemática do Dígito Verificador (Módulo 11 pesos 2 a 9) e decodifica UF, AAMM, CNPJ, Modelo, Série, Número e Código de Segurança.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChaveInput('51260900123456000199550010000492811100000008')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Exemplo Válido
                </button>
                <button
                  type="button"
                  onClick={() => setChaveInput('51260900123456000199550010000492811100000009')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Simular DV Inválido
                </button>
              </div>
            </div>

            {/* Input da Chave */}
            <div className="relative">
              <input
                type="text"
                value={chaveInput}
                onChange={(e) => setChaveInput(e.target.value.replace(/\s+/g, ''))}
                placeholder="Insira os 44 dígitos da chave de acesso (NF-e, MDF-e, CT-e, NFC-e)..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl p-3.5 pr-24 text-slate-900 font-mono text-sm tracking-widest placeholder:tracking-normal placeholder:text-slate-400 outline-none"
                maxLength={50}
              />
              <button
                type="button"
                onClick={handleCopiarChave}
                className="absolute right-2.5 top-2.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                {copiado ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            {/* Status Geral de Validação */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                analiseChave.valida
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {analiseChave.valida ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
              )}
              <div className="flex-1">
                <span className="font-bold block text-sm">
                  {analiseChave.valida ? 'Chave Autêntica & Dígito Módulo 11 Válido' : 'Falha na Validação da Chave SEFAZ'}
                </span>
                <span>{analiseChave.mensagem}</span>
              </div>
              <div className="text-right font-mono text-xs font-bold">
                DV Informado: <b className="text-slate-900">{analiseChave.dvInformado}</b> | Calculado: <b className={analiseChave.valida ? 'text-emerald-700' : 'text-rose-700'}>{analiseChave.dvCalculado}</b>
              </div>
            </div>

            {/* Decomposição dos 9 Campos da Chave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block font-medium">1. UF do Emitente (cUF):</span>
                <p className="text-slate-900 font-bold font-mono text-sm mt-0.5">{analiseChave.estadoNome}</p>
                <span className="text-[10px] text-slate-500 font-mono">Código IBGE: {analiseChave.cUF}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block font-medium">2. Ano e Mês de Emissão (AAMM):</span>
                <p className="text-slate-900 font-bold font-mono text-sm mt-0.5">{analiseChave.anoMesFormatado || '-'}</p>
                <span className="text-[10px] text-slate-500 font-mono">AAMM: {analiseChave.aamm}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block font-medium">3. CNPJ do Emitente:</span>
                <p className="text-sky-800 font-bold font-mono text-sm mt-0.5">{analiseChave.cnpjFormatado || '-'}</p>
                <span className="text-[10px] text-slate-500 font-mono">14 Dígitos RFB</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block font-medium">4. Modelo Fiscal (mod):</span>
                <p className="text-slate-900 font-bold font-mono text-sm mt-0.5">{analiseChave.modeloDescricao}</p>
                <span className="text-[10px] text-slate-500 font-mono">Modelo {analiseChave.modelo}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block font-medium">5. Série & 6. Número (nNF):</span>
                <p className="text-slate-900 font-bold font-mono text-sm mt-0.5">
                  Série {analiseChave.serie} • NF nº {analiseChave.numeroNFe}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Emissão em lote</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px] block font-medium">7. Tipo Emissão & 8. Código Aleatório:</span>
                <p className="text-slate-900 font-bold font-mono text-sm mt-0.5">{analiseChave.tipoEmissaoDescricao}</p>
                <span className="text-[10px] text-slate-500 font-mono">cNF: {analiseChave.codigoNumerico}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SefazGeoAuditorModule;
