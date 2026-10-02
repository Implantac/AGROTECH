import React, { useState, useMemo } from 'react';
import {
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
  Activity,
  Award,
  Lock,
  Key,
  FileCode,
  MapPin,
  FileCheck,
  Search,
  Copy,
  Check,
  Hash,
  ExternalLink
} from 'lucide-react';
import {
  SefazGeoService,
  CertificadoA1Info,
  NFeAssinadaEnvelope,
  AnaliseSobreposicaoCAR,
  DecomposicaoChaveNFe
} from '../services/sefazGeoService';

export const SefazGeoAuditorModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certificado' | 'assinador_nfe' | 'geo_car' | 'validador_chave'>('certificado');

  // Certificado Digital A1
  const [certInfo] = useState<CertificadoA1Info>(SefazGeoService.verificarCertificadoA1());

  // NF-e Assinada
  const [numeroNFe, setNumeroNFe] = useState<string>('000049281');
  const [serieNFe, setSerieNFe] = useState<string>('1');
  const [valorTotalNFe, setValorTotalNFe] = useState<number>(185400.0);
  const [nfeAssinada, setNfeAssinada] = useState<NFeAssinadaEnvelope>(() =>
    SefazGeoService.assinarNFe('000049281', '1', 185400.0)
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

  // Disparar Assinatura
  const handleAssinarNFe = () => {
    const envelope = SefazGeoService.assinarNFe(numeroNFe, serieNFe, valorTotalNFe);
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

  return (
    <div className="space-y-6">
      {/* Top Banner do Módulo */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Auditoria Fiscal & Conformidade Geoespacial
            </span>
            <span className="text-xs text-slate-600">SEFAZ / Receita Federal / IBAMA / SICAR</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" /> SEFAZ Geo-Auditor & Assinador ICP-Brasil A1
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Certificação digital de documentos fiscais eletrônicos (NF-e/MDF-e 4.00) com verificação rigorosa de polígonos CAR e validação oficial de chaves SEFAZ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-800/80 bg-emerald-950/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Certificado A1 Válido (245 dias)
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Autoridade Emissora</span>
            <Key className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-black text-white">{certInfo.emissor}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ICP-Brasil Válido até {certInfo.dataValidade}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Último DigestValue SHA-256</span>
            <FileCode className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold text-cyan-400 truncate">{nfeAssinada.digestValue}</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Canonicalização C14N Ativa
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sobreposição APP</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{analiseCar.pctAppSobreposta}%</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Preservada & Protegida
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Crédito Rural & Tradings</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">LIBERADO</div>
          <div className="text-[11px] text-slate-600 font-medium mt-1">
            Zero embargo IBAMA
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('certificado')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'certificado'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          1. Certificado Digital A1 (.pfx)
        </button>

        <button
          onClick={() => setActiveTab('assinador_nfe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'assinador_nfe'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          2. Emissor & Assinador NF-e 4.00
        </button>

        <button
          onClick={() => setActiveTab('geo_car')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'geo_car'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          3. Auditoria Geo CAR / IBAMA
        </button>

        <button
          onClick={() => setActiveTab('validador_chave')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'validador_chave'
              ? 'bg-indigo-600 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-900 hover:bg-slate-800 border border-slate-200'
          }`}
        >
          <Hash className="w-4 h-4" />
          4. Validador Chave SEFAZ 44 Dígitos (Mód. 11)
        </button>
      </div>

      {/* Conteúdo Aba 1: Certificado */}
      {activeTab === 'certificado' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            Detalhes da Chave Privada e Certificado Digital ICP-Brasil
          </h3>
          <p className="text-xs text-slate-600">
            O certificado A1 fica armazenado de forma criptografada em cofre de chaves (Key Vault) com renovação assistida e disparo de webhook 30 dias antes do vencimento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-slate-600 block font-semibold">Titular do Certificado:</span>
              <p className="text-white font-bold text-sm">{certInfo.nomeTitular}</p>
              <span className="text-slate-600 block font-semibold mt-2">CNPJ do Produtor / Empresa:</span>
              <p className="font-mono text-cyan-400 font-bold">{certInfo.cnpjCpf}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-slate-600 block font-semibold">Autoridade Certificadora (AC):</span>
              <p className="text-white font-bold">{certInfo.emissor}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-600">Validade:</span>
                <span className="text-emerald-400 font-bold font-mono">Até {certInfo.dataValidade}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full w-[70%]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Assinador NF-e */}
      {activeTab === 'assinador_nfe' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              Simulador de Emissão & Assinatura XML W3C C14N
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Número NF-e:</label>
                <input
                  type="text"
                  value={numeroNFe}
                  onChange={(e) => setNumeroNFe(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Série:</label>
                <input
                  type="text"
                  value={serieNFe}
                  onChange={(e) => setSerieNFe(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Valor Total (R$):</label>
                <input
                  type="number"
                  value={valorTotalNFe}
                  onChange={(e) => setValorTotalNFe(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleAssinarNFe}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs transition-all shadow-md flex items-center gap-2"
            >
              <FileCode className="w-4 h-4" />
              Assinar Digitalmente e Transmitir à SEFAZ
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">XML Assinado & Envelope SOAP SEFAZ:</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                {nfeAssinada.statusSefaz}
              </span>
            </div>
            <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-900 overflow-x-auto max-h-64">
              {nfeAssinada.xmlAssinado}
            </pre>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Geo CAR */}
      {activeTab === 'geo_car' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              Auditoria de Polígono do Talhão vs CAR Oficial
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Área Total do Talhão (ha):</label>
                <input
                  type="number"
                  value={areaTalhaoHa}
                  onChange={(e) => setAreaTalhaoHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Sobreposição com APP (ha):</label>
                <input
                  type="number"
                  value={appSobrepostaHa}
                  onChange={(e) => setAppSobrepostaHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Sobreposição com Embargo IBAMA (ha):</label>
                <input
                  type="number"
                  value={embargoIbamaHa}
                  onChange={(e) => setEmbargoIbamaHa(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <button
                onClick={handleAuditarGeo}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Executar Auditoria Territorial
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Resultado da Conformidade Ambiental & EUDR
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600">Classificação de Risco:</span>
                <span className="font-bold text-emerald-400 font-mono">{analiseCar.statusConformidade}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600">Elegibilidade para Crédito Bancário:</span>
                <span className={`font-bold font-mono ${analiseCar.aptoCreditoRural ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {analiseCar.aptoCreditoRural ? '100% HABILITADO' : 'BLOQUEADO'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Reserva Legal Calculada:</span>
                <span className="font-bold text-cyan-400 font-mono">{analiseCar.sobreposicaoReservaLegalHa} ha (20%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Validador Chave SEFAZ 44 Dígitos */}
      {activeTab === 'validador_chave' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-indigo-400" />
                  Validador e Decompositor Oficial de Chave de Acesso SEFAZ (44 Dígitos)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Audita a integridade matemática do Dígito Verificador (Módulo 11 pesos 2 a 9) e decodifica UF, AAMM, CNPJ, Modelo, Série, Número e Código de Segurança.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChaveInput('51260900123456000199550010000492811100000008')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 rounded-lg text-xs font-semibold transition"
                >
                  Exemplo Válido
                </button>
                <button
                  onClick={() => setChaveInput('51260900123456000199550010000492811100000009')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 rounded-lg text-xs font-semibold transition"
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
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl p-3.5 pr-24 text-white font-mono text-sm tracking-widest placeholder:tracking-normal placeholder:text-slate-600 outline-none"
                maxLength={50}
              />
              <button
                onClick={handleCopiarChave}
                className="absolute right-2.5 top-2.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            {/* Status Geral de Validação */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-medium ${
                analiseChave.valida
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              }`}
            >
              {analiseChave.valida ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div className="flex-1">
                <span className="font-bold block text-sm">
                  {analiseChave.valida ? 'Chave Autêntica & Dígito Módulo 11 Válido' : 'Falha na Validação da Chave SEFAZ'}
                </span>
                <span>{analiseChave.mensagem}</span>
              </div>
              <div className="text-right font-mono text-xs font-bold">
                DV Informado: <b className="text-white">{analiseChave.dvInformado}</b> | Calculado: <b className={analiseChave.valida ? 'text-emerald-400' : 'text-rose-400'}>{analiseChave.dvCalculado}</b>
              </div>
            </div>

            {/* Decomposição dos 9 Campos da Chave */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px] block">1. UF do Emitente (cUF):</span>
                <p className="text-white font-bold font-mono text-sm mt-0.5">{analiseChave.estadoNome}</p>
                <span className="text-[10px] text-slate-500 font-mono">Código IBGE: {analiseChave.cUF}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px] block">2. Ano e Mês de Emissão (AAMM):</span>
                <p className="text-white font-bold font-mono text-sm mt-0.5">{analiseChave.anoMesFormatado || '-'}</p>
                <span className="text-[10px] text-slate-500 font-mono">AAMM: {analiseChave.aamm}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px] block">3. CNPJ do Emitente:</span>
                <p className="text-cyan-400 font-bold font-mono text-sm mt-0.5">{analiseChave.cnpjFormatado || '-'}</p>
                <span className="text-[10px] text-slate-500 font-mono">14 Dígitos RFB</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px] block">4. Modelo Fiscal (mod):</span>
                <p className="text-white font-bold font-mono text-sm mt-0.5">{analiseChave.modeloDescricao}</p>
                <span className="text-[10px] text-slate-500 font-mono">Modelo {analiseChave.modelo}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px] block">5. Série & 6. Número (nNF):</span>
                <p className="text-white font-bold font-mono text-sm mt-0.5">
                  Série {analiseChave.serie} • NF nº {analiseChave.numeroNFe}
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Emissão em lote</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 text-[11px] block">7. Tipo Emissão & 8. Código Aleatório:</span>
                <p className="text-white font-bold font-mono text-sm mt-0.5">{analiseChave.tipoEmissaoDescricao}</p>
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
