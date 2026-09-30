import React, { useState } from 'react';
import {
  Landmark,
  Printer,
  ShieldCheck,
  FileCheck2,
  Scale,
  Award,
  CheckCircle2,
  X,
  QrCode,
  DollarSign,
  TrendingUp,
  Sprout,
  Building2,
  Layers,
  MapPin
} from 'lucide-react';
import { TALHOES_INICIAIS } from '../data/mockAgroData';

interface DossieBancarioCreditoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DossieBancarioCreditoModal: React.FC<DossieBancarioCreditoModalProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [bancoSelecionado, setBancoSelecionado] = useState<string>(
    'Banco do Brasil S.A. (Superintendência Agro MT)'
  );
  const [linhaCredito, setLinhaCredito] = useState<string>(
    'Plano Safra • Pronamp / Moderfrota / Custeio Verão'
  );
  const [loading, setLoading] = useState<boolean>(false);

  if (isOpen === false) return null;

  const totalAreaHa = 2450;
  const producaoEstimadaSacas = 166600;
  const valorTotalSafra = producaoEstimadaSacas * 135.0; // R$ 22.491.000,00
  const patrimonioTerra = totalAreaHa * 75000; // R$ 183.750.000,00
  const patrimonioMaquinas = 18500000; // R$ 18.500.000,00
  const limiteCusteioSugerido = totalAreaHa * 4250; // R$ 10.412.500,00

  const hashCertificacao = '4a91b2c890124de0192847120349b1a098492019481920ac8f43a9d20c151e89';
  const protocoloBacen = 'BACEN-SCR-2026-9812401';

  return (
    <div className="fixed inset-0 z-[1200] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-6 border border-slate-200">
        {/* Barra Superior de Ações */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Dossiê de Crédito Homologado BACEN
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Protocolo: {protocoloBacen}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Imprimir Dossiê A4 (PDF)
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Cabeçalho do Dossiê Bancário */}
        <div className="border border-slate-400 p-4 rounded-xl grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              SISTEMA NACIONAL DE CRÉDITO RURAL (SNCR / BACEN)
            </span>
            <h2 className="font-black text-lg text-slate-900 uppercase">
              DOSSIÊ EXECUTIVO DE QUALIFICAÇÃO & CRÉDITO RURAL
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Instituição Financeira: <strong>{bancoSelecionado}</strong>
            </p>
            <p className="text-xs text-slate-600">
              Finalidade: <strong>{linhaCredito}</strong>
            </p>
          </div>

          <div className="border-l border-slate-300 pl-4 text-center space-y-1">
            <div className="inline-block bg-emerald-50 border border-emerald-300 px-3 py-1 rounded text-xs font-mono font-black text-emerald-800">
              RATING DE CRÉDITO: AAA
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Risco Mínimo • Capacidade Plena de Pagamento</p>
            <p className="text-[11px] font-mono font-bold text-slate-800">Safra 2026/2027</p>
          </div>
        </div>

        {/* 1. Identificação do Produtor e Propriedade */}
        <div className="border border-slate-300 rounded-xl p-4 text-xs space-y-2">
          <span className="font-bold text-slate-800 uppercase text-[10px] block border-b border-slate-200 pb-1">
            1. DADOS CADASTRAIS DO PROPONENTE & PROPRIEDADE RURAL
          </span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Titular Proponente:</strong> Carlos Alberto Schneider</p>
              <p><strong>CPF / CNPJ:</strong> 18.491.029/0001-88 • <strong>Inscrição Estadual:</strong> 13.489.102-9</p>
              <p><strong>Propriedade:</strong> Fazenda Santa Helena - Glebas 01, 02 e 03</p>
              <p><strong>Município / UF:</strong> Sorriso / MT (Coordenadas: -12°32'44"S, -55°43'12"W)</p>
            </div>
            <div>
              <p><strong>Área Total:</strong> 2.450 hectares (100% Agricultável / Consolidada)</p>
              <p><strong>Cadastro Ambiental Rural (CAR):</strong> MT-5107909-84910294 (Ativo & Homologado)</p>
              <p><strong>Registro Imobiliário:</strong> Matrículas 41.829, 41.830 e 41.831 - CRI 1º Ofício Sorriso/MT</p>
              <p><strong>Certificado CCIR / INCRA:</strong> 950.128.491.029-4 (Quitação Plena ITR)</p>
            </div>
          </div>
        </div>

        {/* 2. Histórico de Produtividade & Capacidade de Pagamento */}
        <div className="border border-slate-300 rounded-xl p-4 text-xs space-y-3">
          <span className="font-bold text-slate-800 uppercase text-[10px] block border-b border-slate-200 pb-1">
            2. CAPACIDADE DE PAGAMENTO & HISTÓRICO DE PRODUTIVIDADE (3 ÚLTIMAS SAFRAS)
          </span>

          <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-500 block">SAFRA 2023/24 (SOJA)</span>
              <strong className="text-sm text-slate-900">66.5 sc/ha</strong>
              <span className="text-[10px] text-emerald-700 block">+14.2% acima média MT</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] text-slate-500 block">SAFRA 2024/25 (SOJA)</span>
              <strong className="text-sm text-slate-900">69.2 sc/ha</strong>
              <span className="text-[10px] text-emerald-700 block">+18.5% acima média MT</span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-center">
              <span className="text-[10px] text-emerald-800 block">SAFRA 2025/26 (PREVISTA)</span>
              <strong className="text-base text-emerald-900">68.4 sc/ha</strong>
              <span className="text-[10px] text-emerald-700 block">166.600 sacas totais</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px] pt-1">
            <div>
              <p><strong>Faturamento Bruto Esperado:</strong> R$ {valorTotalSafra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Custo Operacional Total (ABC):</strong> R$ 10.412.500,00 (R$ 4.250/ha)</p>
            </div>
            <div>
              <p><strong>Margem Líquida Projetada:</strong> 53.7% (R$ 12.078.500,00 de Lucro Líquido)</p>
              <p><strong>Índice de Cobertura da Dívida (ICSD):</strong> 3.82x (Altíssima liquidez)</p>
            </div>
          </div>
        </div>

        {/* 3. Garantias Reais & Patrimônio da Atividade */}
        <div className="border border-slate-300 rounded-xl p-4 text-xs space-y-2">
          <span className="font-bold text-slate-800 uppercase text-[10px] block border-b border-slate-200 pb-1">
            3. COMPOSIÇÃO DE GARANTIAS REAIS OFERECIDAS (HIPOTECA / PENHOR)
          </span>

          <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[9px] text-slate-500 block uppercase">VALOR TERRA NUA (VTN)</span>
              <strong>R$ {patrimonioTerra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              <span className="text-[9px] text-slate-500 block">Base: R$ 75.000 / ha</span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[9px] text-slate-500 block uppercase">FROTA & SILOS ARMAZENADORES</span>
              <strong>R$ {patrimonioMaquinas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              <span className="text-[9px] text-slate-500 block">John Deere + Kepler Weber</span>
            </div>

            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[9px] text-slate-500 block uppercase">PATRIMÔNIO TOTAL GARANTIDOR</span>
              <strong className="text-emerald-800">
                R$ {(patrimonioTerra + patrimonioMaquinas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
              <span className="text-[9px] text-emerald-600 block">Índice Garantia: 19.4x o crédito</span>
            </div>
          </div>
        </div>

        {/* 4. Conformidade Regulatória, Fiscal e ESG */}
        <div className="border border-slate-300 rounded-xl p-4 text-xs space-y-1.5 bg-slate-50">
          <span className="font-bold text-slate-800 uppercase text-[10px] block">
            4. CERTIDÕES DE CONFORMIDADE SOCIOAMBIENTAL & REGULATÓRIA
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              EUDR Europeu: 100% Conforme (Desmatamento Zero pós-2020)
            </p>
            <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Livro Caixa LCDPR (IN 1.903 RFB): Escrituração sem pendências
            </p>
            <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              CND Federal e FGTS: Negativas de Débito Homologadas
            </p>
            <p className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              NR-31 e Segurança do Trabalho: ASOs e Laudos em dia
            </p>
          </div>
        </div>

        {/* 5. Recomendação e Assinaturas */}
        <div className="grid grid-cols-3 gap-4 border-t border-slate-300 pt-4 text-[11px]">
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <QrCode className="w-14 h-14 text-slate-800 mb-1" />
            <span className="text-[9px] font-mono text-slate-500">Validação BACEN / SCR</span>
            <span className="text-[9px] font-mono font-bold text-slate-700 truncate w-full">
              {hashCertificacao.slice(0, 16)}...
            </span>
          </div>

          <div className="col-span-2 space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <span className="text-[10px] text-slate-500 block uppercase">PARECER DO SISTEMA EXPERTO AGTECH</span>
              <p className="font-bold text-slate-900">
                LIMITE DE CRÉDITO RECOMENDADO: R$ {limiteCusteioSugerido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-slate-600">
                Operação recomendada com enquadramento integral em taxas equalizadas do Plano Safra.
              </p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span>Super AgTech Engine v9.5 • Certificação Digital ICP-Brasil</span>
              <span className="font-mono">Homologado em {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
