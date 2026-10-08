import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  FileCheck2,
  Landmark,
  MessageSquare,
  Satellite,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Send,
  Building2,
  Lock,
  ExternalLink,
  ChevronRight,
  BadgeAlert
} from 'lucide-react';
import { agroApi } from '../services/agroApiService';

interface ConfiguracaoCredenciaisTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

export const ConfiguracaoCredenciaisTenantModal: React.FC<ConfiguracaoCredenciaisTenantModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'sefaz' | 'bancos' | 'mensageria' | 'satelite'>('sefaz');
  const [loading, setLoading] = useState(false);
  const [testingSefaz, setTestingSefaz] = useState(false);
  const [testingMsg, setTestingMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados SEFAZ & Certificado A1
  const [ambiente, setAmbiente] = useState<'HOMOLOGACAO' | 'PRODUCAO'>('HOMOLOGACAO');
  const [ufAutorizadora, setUfAutorizadora] = useState<string>('MT');
  const [nomeArquivo, setNomeArquivo] = useState<string>('');
  const [senhaCertificado, setSenhaCertificado] = useState<string>('');
  const [cscCodigo, setCscCodigo] = useState<string>('');
  const [cscId, setCscId] = useState<string>('000001');
  const [certInfo, setCertInfo] = useState<any>(null);

  // Estados Bancários
  const [bancoPrincipal, setBancoPrincipal] = useState<string>('001 - Banco do Brasil');
  const [chavePix, setChavePix] = useState<string>('04.812.049/0001-20');
  const [tipoChavePix, setTipoChavePix] = useState<string>('CNPJ');
  const [clientIdOpenFinance, setClientIdOpenFinance] = useState<string>('bb-agro-prod-812049182');
  const [convenioCobranca, setConvenioCobranca] = useState<string>('3491820');
  const [padraoCnab, setPadraoCnab] = useState<string>('CNAB_240');

  // Estados Mensageria
  const [provedorMsg, setProvedorMsg] = useState<string>('WHATSAPP_EVOLUTION_API');
  const [instanciaMsg, setInstanciaMsg] = useState<string>('agro-alerta-fazenda-01');
  const [telefonePlantao, setTelefonePlantao] = useState<string>('+55 (66) 99988-7744');
  const [alertasAtivos, setAlertasAtivos] = useState<string[]>([
    'ALERTA_SUPERAQUECIMENTO',
    'ALERTA_PRESSAO_OLEO_BAIXA',
    'CONFLITO_OUTBOX'
  ]);

  // Estados Satélite
  const [apiKeyCopernicus, setApiKeyCopernicus] = useState<string>('copernicus_live_token_sec_9182');
  const [estacaoPropria, setEstacaoPropria] = useState<string>('INMET-A901-SORRISO-MT');

  // Carregar credenciais do backend
  useEffect(() => {
    if (isOpen) {
      loadCredentials();
    }
  }, [isOpen]);

  const loadCredentials = async () => {
    setLoading(true);
    try {
      const res = await agroApi.getTenantCredentials();
      if (res.sucesso && res.credenciais) {
        const c = res.credenciais;
        if (c.sefaz) {
          setAmbiente(c.sefaz.ambiente || 'HOMOLOGACAO');
          setUfAutorizadora(c.sefaz.ufAutorizadora || 'MT');
          setNomeArquivo(c.sefaz.nomeArquivo || '');
          setCscId(c.sefaz.cscId || '000001');
          setCertInfo(c.sefaz);
        }
        if (c.bancario) {
          setBancoPrincipal(c.bancario.bancoPrincipal || '001 - Banco do Brasil');
          setChavePix(c.bancario.chavePix || '04.812.049/0001-20');
          setTipoChavePix(c.bancario.tipoChavePix || 'CNPJ');
          setClientIdOpenFinance(c.bancario.clientId || '');
          setConvenioCobranca(c.bancario.convenioCobranca || '3491820');
          setPadraoCnab(c.bancario.padraoCnab || 'CNAB_240');
        }
        if (c.mensageria) {
          setProvedorMsg(c.mensageria.provedor || 'WHATSAPP_EVOLUTION_API');
          setInstanciaMsg(c.mensageria.instancia || 'agro-alerta-fazenda-01');
          setTelefonePlantao(c.mensageria.telefonePlantao || '+55 (66) 99988-7744');
          if (c.mensageria.alertasAtivos) setAlertasAtivos(c.mensageria.alertasAtivos);
        }
        if (c.sateliteClima) {
          setEstacaoPropria(c.sateliteClima.estacaoId || 'INMET-A901-SORRISO-MT');
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCertificate = async () => {
    if (!senhaCertificado) {
      if (onNotify) onNotify('Por favor, informe a senha do arquivo .pfx / .p12 do certificado.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const res = await agroApi.uploadCertificateA1({
        nomeArquivo: nomeArquivo || 'certificado_fazenda.pfx',
        senha: senhaCertificado,
        ambiente,
        ufAutorizadora,
        cscCodigo
      });

      if (res.sucesso) {
        setCertInfo(res.certificado);
        if (onNotify) onNotify('✓ Certificado Digital A1 validado e ativado com sucesso!', 'success');
      } else {
        if (onNotify) onNotify(res.erro || 'Falha na validação do certificado', 'warning');
      }
    } catch (e: any) {
      if (onNotify) onNotify('Erro de conexão ao processar certificado', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleTestSefaz = async () => {
    setTestingSefaz(true);
    try {
      const res = await agroApi.testSefazConnection({ uf: ufAutorizadora, ambiente });
      if (res.sucesso) {
        if (onNotify) {
          onNotify(`✓ SEFAZ ${res.uf} (${res.ambiente}): ${res.statusSefaz} (${res.latenciaMs}ms)`, 'success');
        }
      } else {
        if (onNotify) onNotify('Falha na comunicação com webservice da SEFAZ', 'warning');
      }
    } catch {
      if (onNotify) onNotify('Erro ao contatar SEFAZ', 'warning');
    } finally {
      setTestingSefaz(false);
    }
  };

  const handleTestMessaging = async () => {
    setTestingMsg(true);
    try {
      const res = await agroApi.testMessagingAlert({ telefonePlantao });
      if (res.sucesso) {
        if (onNotify) {
          onNotify(`✓ Alerta de teste entregue via ${res.canal} para ${res.destinatario}`, 'success');
        }
      } else {
        if (onNotify) onNotify('Falha no despacho de mensagem de teste', 'warning');
      }
    } catch {
      if (onNotify) onNotify('Erro no gateway de mensageria', 'warning');
    } finally {
      setTestingMsg(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const payload = {
        sefaz: {
          ambiente,
          ufAutorizadora,
          cscId
        },
        bancario: {
          bancoPrincipal,
          chavePix,
          tipoChavePix,
          clientId: clientIdOpenFinance,
          convenioCobranca,
          padraoCnab
        },
        mensageria: {
          provedor: provedorMsg,
          instancia: instanciaMsg,
          telefonePlantao,
          alertasAtivos
        },
        sateliteClima: {
          estacaoId: estacaoPropria
        }
      };

      const res = await agroApi.saveTenantCredentials(payload);
      if (res.sucesso) {
        if (onNotify) onNotify('✓ Todas as credenciais corporativas foram salvas com sucesso!', 'success');
        onClose();
      }
    } catch {
      if (onNotify) onNotify('Erro ao persistir configurações', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const toggleAlerta = (codigo: string) => {
    setAlertasAtivos(prev =>
      prev.includes(codigo) ? prev.filter(c => c !== codigo) : [...prev, codigo]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#F8FAF6] rounded-2xl shadow-2xl border border-[#E2E8DF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal - Padrão 60-30-10 Enterprise Agro Moderno */}
        <div className="px-6 py-4 bg-[#112319] text-white flex items-center justify-between border-b border-[#1C3626]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1D6F42] flex items-center justify-center text-[#6EE7B7] border border-[#2D7A4F] shadow-inner">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-white font-display">
                  Credenciais & Certificados Digitais do Tenant
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1D6F42]/30 text-[#6EE7B7] border border-[#2D7A4F] font-medium">
                  Multi-tenant Isolation
                </span>
              </div>
              <p className="text-xs text-[#8DA697]">
                Configure os certificados A1 ICP-Brasil, chaves bancárias PIX e mensageria de campo da sua propriedade.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8DA697] hover:text-white hover:bg-[#183324] p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-[#E2E8DF] bg-white gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sefaz')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sefaz'
                ? 'border-[#1D6F42] text-[#1D6F42] font-semibold'
                : 'border-transparent text-[#415446] hover:text-[#122117]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Certificado Digital A1 (SEFAZ)</span>
          </button>

          <button
            onClick={() => setActiveTab('bancos')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bancos'
                ? 'border-[#1D4B38] text-[#1D4B38] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Bancos & PIX BACEN</span>
          </button>

          <button
            onClick={() => setActiveTab('mensageria')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'mensageria'
                ? 'border-[#1D4B38] text-[#1D4B38] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensageria & Alertas (WhatsApp)</span>
          </button>

          <button
            onClick={() => setActiveTab('satelite')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'satelite'
                ? 'border-[#1D4B38] text-[#1D4B38] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>Satélites & Clima</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: SEFAZ & CERTIFICADO A1 */}
          {activeTab === 'sefaz' && (
            <div className="space-y-5">
              {/* Status do Certificado Vigente */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl ${certInfo?.certificadoA1Configurado ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {certInfo?.titular || 'Certificado Digital Não Configurado'}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        certInfo?.certificadoA1Configurado ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {certInfo?.certificadoA1Configurado ? 'ATIVO & VÁLIDO' : 'HOMOLOGAÇÃO ATIVA'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      CNPJ: <span className="font-mono text-slate-700">{certInfo?.cnpj || '04.812.049/0001-20'}</span> • Emissor: <span className="text-slate-700">{certInfo?.emissor || 'AC SERASA RFB v5'}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Validade: <span className="font-medium text-slate-800">15/10/2027</span> ({certInfo?.diasRestantesValidade || 372} dias restantes)
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTestSefaz}
                  disabled={testingSefaz}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingSefaz ? 'animate-spin' : ''}`} />
                  <span>Testar SEFAZ</span>
                </button>
              </div>

              {/* Upload de Novo Certificado */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#1D4B38]" />
                  <span>Atualizar Arquivo de Certificado A1 (.PFX / .P12)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Arquivo .pfx ou .p12
                    </label>
                    <div className="relative flex items-center border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:bg-slate-100/60 transition-colors">
                      <input
                        type="file"
                        accept=".pfx,.p12"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNomeArquivo(file.name);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex items-center gap-2.5 text-xs text-slate-600 truncate">
                        <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{nomeArquivo || 'Clique para selecionar o arquivo .pfx'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Senha do Certificado Digital
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={senhaCertificado}
                        onChange={(e) => setSenhaCertificado(e.target.value)}
                        placeholder="Digite a senha de proteção do arquivo"
                        className="w-full text-xs px-3 py-2.5 pr-9 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Ambiente de Emissão Fiscal
                    </label>
                    <select
                      value={ambiente}
                      onChange={(e) => setAmbiente(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-medium"
                    >
                      <option value="HOMOLOGACAO">HOMOLOGAÇÃO (Sem Valor Fiscal)</option>
                      <option value="PRODUCAO">PRODUÇÃO (Oficial SEFAZ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      UF Autorizadora SEFAZ
                    </label>
                    <select
                      value={ufAutorizadora}
                      onChange={(e) => setUfAutorizadora(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-medium"
                    >
                      <option value="MT">MT - Mato Grosso (SEFAZ-MT)</option>
                      <option value="PR">PR - Paraná (SEFAZ-PR)</option>
                      <option value="GO">GO - Goiás (SEFAZ-GO)</option>
                      <option value="MS">MS - Mato Grosso do Sul (SEFAZ-MS)</option>
                      <option value="RS">RS - Rio Grande do Sul (SEFAZ-RS)</option>
                      <option value="SP">SP - São Paulo (SEFAZ-SP)</option>
                      <option value="MG">MG - Minas Gerais (SEFAZ-MG)</option>
                      <option value="BA">BA - Bahia (SEFAZ-BA)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      CSC (Código de Segurança NFC-e)
                    </label>
                    <input
                      type="text"
                      value={cscCodigo}
                      onChange={(e) => setCscCodigo(e.target.value)}
                      placeholder="Token CSC de homologação/produção"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleUploadCertificate}
                    disabled={loading || !senhaCertificado}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1D4B38] hover:bg-[#285943] text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Validar e Salvar Certificado A1</span>
                  </button>
                </div>
              </div>

              {/* Informação Legal Princípio 15 */}
              <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <BadgeAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Princípio 15 (Fiscal Explícito):</strong> O AGROTECH distingue rigorosamente os ambientes de Homologação e Produção. O uso do ambiente de Produção exige certificado digital válido ICP-Brasil e prévio credenciamento da Inscrição Estadual do produtor junto à SEFAZ da respectiva UF.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BANCOS & PIX */}
          {activeTab === 'bancos' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[#1D4B38]" />
                  <span>Configuração de Conta Bancária Principal & PIX</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Instituição Financeira
                    </label>
                    <select
                      value={bancoPrincipal}
                      onChange={(e) => setBancoPrincipal(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800"
                    >
                      <option value="001 - Banco do Brasil">001 - Banco do Brasil S.A.</option>
                      <option value="748 - Sicredi">748 - Banco Cooperativo Sicredi</option>
                      <option value="756 - Sicoob">756 - Banco Cooperativo Sicoob</option>
                      <option value="237 - Bradesco">237 - Banco Bradesco S.A.</option>
                      <option value="033 - Santander">033 - Banco Santander Brasil</option>
                      <option value="341 - Itaú">341 - Itaú Unibanco S.A.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Padrão de Remessa / Retorno CNAB
                    </label>
                    <select
                      value={padraoCnab}
                      onChange={(e) => setPadraoCnab(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-medium"
                    >
                      <option value="CNAB_240">FEBRABAN CNAB 240 v10.7 (Recomendado)</option>
                      <option value="CNAB_400">FEBRABAN CNAB 400 (Legado)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Chave PIX da Fazenda
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={tipoChavePix}
                        onChange={(e) => setTipoChavePix(e.target.value)}
                        className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white shrink-0"
                      >
                        <option value="CNPJ">CNPJ</option>
                        <option value="EMAIL">E-mail</option>
                        <option value="CELULAR">Celular</option>
                        <option value="ALEATORIA">EVP</option>
                      </select>
                      <input
                        type="text"
                        value={chavePix}
                        onChange={(e) => setChavePix(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Convênio de Cobrança / Carteira
                    </label>
                    <input
                      type="text"
                      value={convenioCobranca}
                      onChange={(e) => setConvenioCobranca(e.target.value)}
                      placeholder="Número do convênio de boletos e PIX"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Client ID Open Finance (API Bancária Direta)
                  </label>
                  <input
                    type="text"
                    value={clientIdOpenFinance}
                    onChange={(e) => setClientIdOpenFinance(e.target.value)}
                    placeholder="Identificador do cliente fornecido pelo portal developers do seu banco"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Permite conciliação automática em tempo real de extratos e pagamentos a fornecedores rurais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MENSAGERIA & WHATSAPP */}
          {activeTab === 'mensageria' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#1D4B38]" />
                    <span>Notificações Críticas de Campo & WhatsApp</span>
                  </h4>
                  <button
                    onClick={handleTestMessaging}
                    disabled={testingMsg}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Send className={`w-3 h-3 ${testingMsg ? 'animate-spin' : ''}`} />
                    <span>Disparar Mensagem Teste</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Gateway de Envio
                    </label>
                    <select
                      value={provedorMsg}
                      onChange={(e) => setProvedorMsg(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800"
                    >
                      <option value="WHATSAPP_EVOLUTION_API">Evolution API (WhatsApp Corporativo)</option>
                      <option value="WHATSAPP_ZAPI">Z-API (WhatsApp Gateway)</option>
                      <option value="META_CLOUD_API">Meta WhatsApp Cloud API (Oficial)</option>
                      <option value="TWILIO_SMS">Twilio SMS Rural</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Telefone de Plantão / Gerente Geral
                    </label>
                    <input
                      type="text"
                      value={telefonePlantao}
                      onChange={(e) => setTelefonePlantao(e.target.value)}
                      placeholder="+55 (66) 99999-0000"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Gatilhos de Notificação Automática
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'ALERTA_SUPERAQUECIMENTO', label: 'Superaquecimento de Motor (> 102°C)' },
                      { id: 'ALERTA_PRESSAO_OLEO_BAIXA', label: 'Pressão Baixa de Óleo (< 1.5 bar)' },
                      { id: 'CONFLITO_OUTBOX', label: 'Conflito de Versão na Outbox Offline' },
                      { id: 'VENCIMENTO_CPR_BARTER', label: 'Vencimento de CPR de Barter' },
                      { id: 'ALERTA_SOBREROTACAO_MOTOR', label: 'Sobrerotação de Trator (> 2.250 rpm)' },
                      { id: 'ALERTA_MIP_PRAGAS', label: 'MIP: Nível de Dano Econômico Atingido' }
                    ].map(al => (
                      <label key={al.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/80">
                        <input
                          type="checkbox"
                          checked={alertasAtivos.includes(al.id)}
                          onChange={() => toggleAlerta(al.id)}
                          className="rounded text-[#1D4B38] focus:ring-[#1D4B38]"
                        />
                        <span className="text-slate-800 text-xs">{al.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SATÉLITES & CLIMA */}
          {activeTab === 'satelite' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Satellite className="w-4 h-4 text-[#1D4B38]" />
                  <span>Provedores Satelitais & Estações Meteorológicas</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Chave API Copernicus / Sentinel Hub
                    </label>
                    <input
                      type="password"
                      value={apiKeyCopernicus}
                      onChange={(e) => setApiKeyCopernicus(e.target.value)}
                      placeholder="Token de acesso ao serviço de imagens"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Identificador de Estação Própria (INMET / Davis)
                    </label>
                    <input
                      type="text"
                      value={estacaoPropria}
                      onChange={(e) => setEstacaoPropria(e.target.value)}
                      placeholder="Ex: INMET-A901-SORRISO-MT"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1D4B38] text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <p>
                    O sistema sincroniza imagens multiespectrais Sentinel-2 (L2A Bottom-Of-Atmosphere) a cada 5 dias com resolução espacial de 10 metros para cálculo de índices agronômicos (NDVI, NDRE, NDWI).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Tenant: tenant-fazenda-santa-helena
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAll}
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1D4B38] hover:bg-[#285943] text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Todas as Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
