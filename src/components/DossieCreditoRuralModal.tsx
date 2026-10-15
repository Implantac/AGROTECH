import React, { useState } from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  X,
  ShieldCheck,
  Building,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';

interface DossieCreditoRuralModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmName?: string;
  farmArea?: string;
}

export const DossieCreditoRuralModal: React.FC<DossieCreditoRuralModalProps> = ({
  isOpen,
  onClose,
  farmName = 'Fazenda Santa Helena',
  farmArea = '4.200 ha'
}) => {
  const [linhaCredito, setLinhaCredito] = useState<'PRONAMP_CUSTEIO' | 'MODERFROTA' | 'CUSTEIO_GERAL'>('PRONAMP_CUSTEIO');
  const [valorSolicitado, setValorSolicitado] = useState<number>(1250000);
  const [bancoDestino, setBancoDestino] = useState<string>('Banco do Brasil');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const protocolo = `DOSSIE-MCR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const dataEmissao = new Date().toLocaleDateString('pt-BR');
  const hashSha256 = '8f4c93a1b0e4d7729f635c91a03e5c9b74d281e04fa69b5c338e91d842b109cc';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative bg-white border border-slate-300 rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-10 space-y-6 overflow-hidden print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Topbar do Modal (Oculto em Impressão) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono border border-emerald-300">
                  BACEN MCR SEÇÃO 2-1
                </span>
                <span className="text-[11px] text-slate-500 font-medium font-mono">PROTOCOLO: {protocolo}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                Dossiê Técnico da Fazenda para Crédito Rural
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controles de Simulação (Ocultos na Impressão) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          <div>
            <label className="text-[10px] font-bold font-mono text-slate-600 uppercase block mb-1">
              Linha de Financiamento
            </label>
            <select
              value={linhaCredito}
              onChange={(e) => setLinhaCredito(e.target.value as any)}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="PRONAMP_CUSTEIO">PRONAMP Custeio (8,0% a.a.)</option>
              <option value="MODERFROTA">Moderfrota Máquinas (10,5% a.a.)</option>
              <option value="CUSTEIO_GERAL">Custeio Geral Empresarial (12,0% a.a.)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold font-mono text-slate-600 uppercase block mb-1">
              Instituição Financeira
            </label>
            <select
              value={bancoDestino}
              onChange={(e) => setBancoDestino(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Banco do Brasil">Banco do Brasil</option>
              <option value="Sicredi">Sicredi</option>
              <option value="Sicoob">Sicoob</option>
              <option value="Bradesco">Bradesco Rural</option>
              <option value="Santander">Santander Agro</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold font-mono text-slate-600 uppercase block mb-1">
              Valor Solicitado (R$)
            </label>
            <input
              type="number"
              value={valorSolicitado}
              onChange={(e) => setValorSolicitado(Number(e.target.value))}
              className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              step="50000"
            />
          </div>
        </div>

        {/* =========================================================================
            CORPO DO DOCUMENTO TÉCNICO FORMAL (IMPRESSÃO / AUDITORIA BANCÁRIA)
           ========================================================================= */}
        <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-800 bg-white print:border-none print:p-0">
          {/* Cabeçalho do Laudo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-emerald-800 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-bold font-mono text-emerald-800 uppercase tracking-widest block">
                REPÚBLICA FEDERATIVA DO BRASIL • SISTEMA NACIONAL DE CRÉDITO RURAL
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                PROJETO TÉCNICO DE ENQUADRAMENTO MCR - SAFRA 2026/2027
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Emissão eletrônica auditada pelo AGROTECH Enterprise Platform para {bancoDestino}
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-600 shrink-0">
              <span className="block font-bold text-slate-900">Emissão: {dataEmissao}</span>
              <span className="block text-emerald-700 font-bold">Status: APTO PARA PROTOCOLO</span>
            </div>
          </div>

          {/* 1. Identificação do Proponente e Imóvel Rural */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-emerald-700" />
              <span>1. Identificação do Proponente e Imóvel Rural</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Proponente:</span>
                <span className="font-bold text-slate-900">Schneider Agronegócios Ltda</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">CPF / CNPJ:</span>
                <span className="font-bold text-slate-900 font-mono">04.812.049/0001-20</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Propriedade:</span>
                <span className="font-bold text-slate-900">{farmName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">CAR Inscrito:</span>
                <span className="font-bold text-slate-900 font-mono">MT-5107909-E8192841029</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Área Total:</span>
                <span className="font-bold text-slate-900">{farmArea}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Área Financiada:</span>
                <span className="font-bold text-emerald-800 font-mono">420,50 ha (Soja Grãos)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Reserva Legal (20%):</span>
                <span className="font-bold text-slate-900">151,20 ha (Preservada)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">ZARC Clima:</span>
                <span className="font-bold text-emerald-700">Risco 20% (Ótimo)</span>
              </div>
            </div>
          </div>

          {/* 2. Planejamento Agronômico e Estimativa de Receita */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>2. Capacidade de Pagamento e Projeção de Safra</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Produtividade Média:</span>
                <span className="font-bold text-slate-900 text-sm">68,5 sc/ha</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Volume Estimado:</span>
                <span className="font-bold text-slate-900 text-sm">28.804 sacas</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Preço Base Soja Sorriso:</span>
                <span className="font-bold text-slate-900 text-sm">R$ 136,50 / sc</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Receita Bruta da Área:</span>
                <span className="font-bold text-emerald-800 text-sm">R$ 3.931.746,00</span>
              </div>
            </div>
          </div>

          {/* 3. Cronograma Físico-Financeiro de Desembolso */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>3. Cronograma Físico-Financeiro de Desembolso (BACEN)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-[10px] font-mono text-slate-600 uppercase">
                  <tr>
                    <th className="p-2.5">Etapa Agronômica</th>
                    <th className="p-2.5">Mês de Aplicação</th>
                    <th className="p-2.5 text-center">% Rateio</th>
                    <th className="p-2.5 text-right">Valor da Parcela (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-900">1. Adubação de Base, Corretivos e Pré-Plantio</td>
                    <td className="p-2.5 text-slate-600">Setembro/2026</td>
                    <td className="p-2.5 text-center text-slate-800 font-bold">45%</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      R$ {(valorSolicitado * 0.45).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-900">2. Sementes Certificadas e Defensivos Químicos</td>
                    <td className="p-2.5 text-slate-600">Novembro/2026</td>
                    <td className="p-2.5 text-center text-slate-800 font-bold">35%</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      R$ {(valorSolicitado * 0.35).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-slate-900">3. Operação de Colheita, Óleo Diesel e Logística</td>
                    <td className="p-2.5 text-slate-600">Fevereiro/2027</td>
                    <td className="p-2.5 text-center text-slate-800 font-bold">20%</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      R$ {(valorSolicitado * 0.20).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold">
                    <td colSpan={2} className="p-2.5 font-sans text-emerald-950 uppercase text-[11px]">
                      Total do Financiamento Solicitado
                    </td>
                    <td className="p-2.5 text-center text-emerald-900">100%</td>
                    <td className="p-2.5 text-right text-emerald-900 text-sm">
                      R$ {valorSolicitado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Certidão Socioambiental & Due Diligence EUDR */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>4. Certidão de Regularidade Socioambiental e Desmatamento Zero (EUDR)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold font-mono">
                CONFORME PRODES
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              O imóvel rural não possui sobreposição com terras indígenas homologadas, unidades de conservação de proteção integral ou embargos do IBAMA. Cadastro Ambiental Rural ativo e retificado. Marco temporal de desmatamento zero cumprido integralmente.
            </p>
            <div className="pt-2 text-[10px] font-mono text-slate-500 break-all border-t border-emerald-200">
              HASH SHA-256 DO PROJETO: {hashSha256}
            </div>
          </div>

          {/* Assinaturas Formais */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs text-slate-600 font-medium">
            <div className="border-t border-slate-300 pt-2 space-y-0.5">
              <span className="block font-bold text-slate-900">Schneider Agronegócios Ltda</span>
              <span className="block text-[11px] text-slate-500">Proponente / Produtor Rural Titular</span>
            </div>
            <div className="border-t border-slate-300 pt-2 space-y-0.5">
              <span className="block font-bold text-slate-900">Eng. Agrônomo Responsável Técnico</span>
              <span className="block text-[11px] text-slate-500">CREA-MT 12849/D • ART Vinculada</span>
            </div>
          </div>
        </div>

        {/* Rodapé de Ações do Modal (Oculto em Impressão) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{isCopied ? 'Link Copiado!' : 'Compartilhar com Gerente'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Imprimir / Salvar Dossiê em PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
