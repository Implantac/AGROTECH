import React, { useState } from 'react';
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
  FileCheck
} from 'lucide-react';
import { SefazGeoService, CertificadoA1Info, NFeAssinadaEnvelope, AnaliseSobreposicaoCAR } from '../services/sefazGeoService';

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

  // Disparar Assinatura
  const handleAssinarNFe = () => {
    const envelope = SefazGeoService.assinarNFe(numeroNFe, serieNFe, valorTotalNFe);
    setNfeAssinada(envelope);
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

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Módulo 94 • Assinatura SEFAZ A1 & Auditoria Geo CAR
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                SHA-256 XMLDSig • Módulo 11 • Conformidade EUDR
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🏛️ Emissor SEFAZ, Certificado A1 & Validador CAR / SIGEF
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Gestão de chaves criptográficas com Certificado Digital A1 (.pfx), canonicalização C14N e cálculo de DigestValue para NF-e/MDF-e da SEFAZ, acoplado ao cruzamento geoespacial de polígonos com o CAR e Embargos do IBAMA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificado A1</span>
              <span className="text-xl font-black text-emerald-400">{certInfo.status}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{certInfo.diasValidadeRestantes} dias rest.</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status CAR/EUDR</span>
              <span className="text-xl font-black text-cyan-400">100% APTO</span>
              <span className="text-[10px] text-cyan-400/80 block mt-0.5">Zero Embargo</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Autoridade Emissora</span>
            <Key className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-black text-white">{certInfo.emissor}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ICP-Brasil Válido até {certInfo.dataValidade}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Último DigestValue SHA-256</span>
            <FileCode className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold text-cyan-400 truncate">{nfeAssinada.digestValue}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Canonicalização C14N Ativa
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sobreposição APP</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{analiseCar.pctAppSobreposta}%</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Preservada & Protegida
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Crédito Rural & Tradings</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">LIBERADO</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Zero embargo IBAMA
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('certificado')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'certificado'
              ? 'bg-indigo-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          1. Certificado Digital A1 (.pfx)
        </button>

        <button
          onClick={() => setActiveTab('assinador_nfe')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'assinador_nfe'
              ? 'bg-indigo-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          2. Emissor & Assinador NF-e 4.00
        </button>

        <button
          onClick={() => setActiveTab('geo_car')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'geo_car'
              ? 'bg-indigo-500 text-white shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          3. Auditoria Geo CAR / IBAMA
        </button>
      </div>

      {/* Conteúdo Aba 1: Certificado */}
      {activeTab === 'certificado' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            Detalhes da Chave Privada e Certificado Digital ICP-Brasil
          </h3>
          <p className="text-xs text-slate-400">
            O certificado A1 fica armazenado de forma criptografada em cofre de chaves (Key Vault) com renovação assistida e disparo de webhook 30 dias antes do vencimento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block">Titular:</span>
              <span className="font-bold text-white text-sm">{certInfo.nomeTitular}</span>
              <span className="text-slate-400 block mt-2">CNPJ / CPF:</span>
              <span className="font-mono text-cyan-400">{certInfo.cnpjCpf}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block">Emissor Oficial:</span>
              <span className="font-bold text-white text-sm">{certInfo.emissor}</span>
              <span className="text-slate-400 block mt-2">Validade Restante:</span>
              <span className="font-mono text-emerald-400 font-bold">{certInfo.diasValidadeRestantes} dias</span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Assinador NF-e */}
      {activeTab === 'assinador_nfe' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              Parâmetros da NF-e para Assinatura
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Número da NF-e:</label>
                <input
                  type="text"
                  value={numeroNFe}
                  onChange={(e) => setNumeroNFe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Série:</label>
                <input
                  type="text"
                  value={serieNFe}
                  onChange={(e) => setSerieNFe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Valor Total (R$):</label>
                <input
                  type="number"
                  value={valorTotalNFe}
                  onChange={(e) => setValorTotalNFe(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <button
                onClick={handleAssinarNFe}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Gerar XML & Assinar com Certificado A1
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              Envelope XML Assinado & DigestValue SHA-256
            </h3>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Chave de Acesso:</span>
                <span className="font-mono text-cyan-400 font-bold">{nfeAssinada.chaveAcesso}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status SEFAZ:</span>
                <span className="font-mono text-emerald-400 font-bold">{nfeAssinada.statusSefaz}</span>
              </div>
            </div>

            <textarea
              readOnly
              value={nfeAssinada.xmlAssinado}
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-slate-300 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Geo CAR */}
      {activeTab === 'geo_car' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              Simulador de Interseção de Polígonos
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Área Total do Talhão (ha):</label>
                <input
                  type="number"
                  value={areaTalhaoHa}
                  onChange={(e) => setAreaTalhaoHa(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sobreposição com APP (ha):</label>
                <input
                  type="number"
                  value={appSobrepostaHa}
                  onChange={(e) => setAppSobrepostaHa(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sobreposição com Embargo IBAMA (ha):</label>
                <input
                  type="number"
                  value={embargoIbamaHa}
                  onChange={(e) => setEmbargoIbamaHa(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
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

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Resultado da Conformidade Ambiental & EUDR
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Classificação de Risco:</span>
                <span className="font-bold text-emerald-400 font-mono">{analiseCar.statusConformidade}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Elegibilidade para Crédito Bancário:</span>
                <span className={`font-bold font-mono ${analiseCar.aptoCreditoRural ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {analiseCar.aptoCreditoRural ? '100% HABILITADO' : 'BLOQUEADO'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Reserva Legal Calculada:</span>
                <span className="font-bold text-cyan-400 font-mono">{analiseCar.sobreposicaoReservaLegalHa} ha (20%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SefazGeoAuditorModule;
