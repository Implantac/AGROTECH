import React, { useState } from 'react';
import {
  Trash2,
  PackageCheck,
  Recycle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  Download,
  Plus,
  ShieldCheck,
  Sparkles,
  Printer
} from 'lucide-react';

export interface LoteEmbalagemVazia {
  id: string;
  produtoComercial: string;
  notaFiscalCompra: string;
  dataCompra: string;
  dataLimiteDevolucao: string;
  diasRestantes: number;
  tipoEmbalagem: 'LAVAVEL_GALAO_20L' | 'LAVAVEL_GALAO_5L' | 'NAO_LAVAVEL_SACO_ALUMINIO';
  quantidadeTotal: number;
  tripliceLavagemRealizada: boolean;
  perfuracaoInutilizacaoRealizada: boolean;
  statusDevolucao: 'DEVOLVIDO_INPEV' | 'AGENDADO' | 'ESTOQUE_FAZENDA';
}

const LOTES_EMBALAGENS_INICIAIS: LoteEmbalagemVazia[] = [
  {
    id: 'emb-01',
    produtoComercial: 'Engeo Pleno S (Tiametoxam + Lambda-cialotrina)',
    notaFiscalCompra: 'NF-e 004.819 (AgroAmazônia)',
    dataCompra: '2025-10-25',
    dataLimiteDevolucao: '2026-10-25',
    diasRestantes: 27,
    tipoEmbalagem: 'LAVAVEL_GALAO_20L',
    quantidadeTotal: 60,
    tripliceLavagemRealizada: true,
    perfuracaoInutilizacaoRealizada: true,
    statusDevolucao: 'AGENDADO',
  },
  {
    id: 'emb-02',
    produtoComercial: 'Fox Xpro (Trifloxistrobina + Protioconazol + Bixafen)',
    notaFiscalCompra: 'NF-e 004.912 (Bayer Comercial)',
    dataCompra: '2025-11-15',
    dataLimiteDevolucao: '2026-11-15',
    diasRestantes: 48,
    tipoEmbalagem: 'LAVAVEL_GALAO_5L',
    quantidadeTotal: 120,
    tripliceLavagemRealizada: true,
    perfuracaoInutilizacaoRealizada: true,
    statusDevolucao: 'ESTOQUE_FAZENDA',
  },
  {
    id: 'emb-03',
    produtoComercial: 'Glifosato Roundup Transorb',
    notaFiscalCompra: 'NF-e 003.710 (Sinagro)',
    dataCompra: '2025-08-10',
    dataLimiteDevolucao: '2026-08-10',
    diasRestantes: -49,
    tipoEmbalagem: 'LAVAVEL_GALAO_20L',
    quantidadeTotal: 150,
    tripliceLavagemRealizada: true,
    perfuracaoInutilizacaoRealizada: true,
    statusDevolucao: 'DEVOLVIDO_INPEV',
  },
  {
    id: 'emb-04',
    produtoComercial: 'Prêmio 200 SC (Clorantraniliprole)',
    notaFiscalCompra: 'NF-e 005.110 (FMC Química)',
    dataCompra: '2026-01-20',
    dataLimiteDevolucao: '2027-01-20',
    diasRestantes: 114,
    tipoEmbalagem: 'LAVAVEL_GALAO_5L',
    quantidadeTotal: 80,
    tripliceLavagemRealizada: true,
    perfuracaoInutilizacaoRealizada: true,
    statusDevolucao: 'ESTOQUE_FAZENDA',
  },
];

export const InpevLogisticaReversaModule: React.FC = () => {
  const [embalagens] = useState<LoteEmbalagemVazia[]>(LOTES_EMBALAGENS_INICIAIS);
  const [mostrarModalComprovante, setMostrarModalComprovante] = useState<boolean>(false);

  const totalEmbalagens = embalagens.reduce((acc, curr) => acc + curr.quantidadeTotal, 0);
  const totalDevolvidas = embalagens
    .filter((e) => e.statusDevolucao === 'DEVOLVIDO_INPEV')
    .reduce((acc, curr) => acc + curr.quantidadeTotal, 0);
  const totalAgendadas = embalagens
    .filter((e) => e.statusDevolucao === 'AGENDADO')
    .reduce((acc, curr) => acc + curr.quantidadeTotal, 0);
  const totalEstoqueFazenda = embalagens
    .filter((e) => e.statusDevolucao === 'ESTOQUE_FAZENDA')
    .reduce((acc, curr) => acc + curr.quantidadeTotal, 0);

  const percentualDevolvido = (totalDevolvidas / totalEmbalagens) * 100;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">inpEV & Logística Reversa de Embalagens</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Sistema Campo Limpo
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Lei 14.785/2023
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Controle de tríplice lavagem, inutilização por perfuração, prazos legais de devolução (365 dias) e comprovantes fiscais INDEA/MAPA.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModalComprovante(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          Emitir Comprovante de Devolução inpEV
        </button>
      </div>

      {/* Cards de Métricas de Logística Reversa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Volume de Embalagens</span>
            <Trash2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-[#1D4B38] font-mono">{totalEmbalagens} unidades</div>
          <p className="text-xs text-slate-500 mt-1">Galões 5L, 20L e sacos aluminizados</p>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Devolvidas à Central inpEV</span>
            <PackageCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono">{totalDevolvidas} unidades</div>
          <p className="text-xs text-emerald-400/80 mt-1">Recicladas e transformadas em tubos</p>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Agendamento Pendente</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-200 font-mono">{totalAgendadas} unidades</div>
          <p className="text-xs text-amber-400/80 mt-1">Vencimento em &lt; 30 dias (Alerta)</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Tríplice Lavagem Efetuada</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">100% Lavadas</div>
          <p className="text-xs text-slate-500 mt-1">Perfuradas e prontas para prensagem</p>
        </div>
      </div>

      {/* Tabela de Lotes de Embalagens e Vencimentos */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
              Controle de Lotes de Embalagens Vazias & Prazos Legais (1 Ano)
            </h2>
            <p className="text-xs text-slate-600">
              Conformidade com a fiscalização do INDEA-MT e Ministério da Agricultura (MAPA)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Produto & Nota Fiscal</th>
                <th className="px-4 py-3.5">Data Compra & Limite</th>
                <th className="px-4 py-3.5">Prazo Restante</th>
                <th className="px-4 py-3.5">Tipo & Quantidade</th>
                <th className="px-4 py-3.5">Tríplice Lavagem</th>
                <th className="px-4 py-3.5">Status inpEV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {embalagens.map((emb) => {
                let prazoBadge = (
                  <span className="text-slate-900 font-mono font-medium">
                    {emb.diasRestantes} dias restantes
                  </span>
                );

                if (emb.statusDevolucao === 'DEVOLVIDO_INPEV') {
                  prazoBadge = (
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Devolvido no Prazo
                    </span>
                  );
                } else if (emb.diasRestantes <= 30) {
                  prazoBadge = (
                    <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {emb.diasRestantes} dias (Urgente!)
                    </span>
                  );
                }

                let statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-900 border border-slate-700">
                    Galpão da Fazenda
                  </span>
                );

                if (emb.statusDevolucao === 'DEVOLVIDO_INPEV') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Devolvido na Central
                    </span>
                  );
                } else if (emb.statusDevolucao === 'AGENDADO') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 w-fit">
                      <Clock className="w-3 h-3" /> Agendado Posto Sorriso
                    </span>
                  );
                }

                return (
                  <tr key={emb.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{emb.produtoComercial}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{emb.notaFiscalCompra}</div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-900">
                      <div>Compra: {emb.dataCompra}</div>
                      <div className="text-[11px] text-slate-500">Limite: {emb.dataLimiteDevolucao}</div>
                    </td>

                    <td className="px-4 py-3.5">{prazoBadge}</td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 font-mono">{emb.quantidadeTotal} unidades</div>
                      <div className="text-[10px] text-slate-500 uppercase">{emb.tipoEmbalagem.replace(/_/g, ' ')}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tríplice Lavada
                      </div>
                      <div className="text-[10px] text-slate-500">Fundo perfurado conforme norma</div>
                    </td>

                    <td className="px-4 py-3.5">{statusBadge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal do Comprovante de Devolução Oficial inpEV */}
      {mostrarModalComprovante && (
        <div className="fixed inset-0 z-50 bg-slate-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Recycle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-[#1D4B38]">
                  Comprovante Oficial de Devolução de Embalagens Vazias (inpEV)
                </h3>
              </div>
              <button
                onClick={() => setMostrarModalComprovante(false)}
                className="text-slate-600 hover:text-slate-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  Instituto Nacional de Processamento de Embalagens Vazias - Sistema Campo Limpo
                </span>
                <h4 className="text-sm font-bold text-white">
                  Recibo de Entrega nº DEV-INPEV-2026-MT-09412
                </h4>
                <p className="text-[11px] text-slate-900">
                  Atestamos para os devidos fins legais e comprovação fiscal perante o INDEA-MT e MAPA que a propriedade <strong>FAZENDA SANTA HELENA (CAR: MT-5107909-E8192841029)</strong> realizou a entrega regular de embalagens vazias lavadas e perfuradas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-900">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Central de Recolhimento:</span>
                  <span className="font-semibold text-slate-900">Posto de Recebimento inpEV Sorriso</span>
                  <span className="text-[10px] text-slate-500 block">Rodovia BR-163, km 745 - Zona Rural</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Volume Entregue:</span>
                  <span className="font-bold text-emerald-300 font-mono text-sm">150 Galões de 20L + 80 Galões de 5L</span>
                  <span className="text-[10px] text-slate-500 block">100% Inutilizados com laudo de vistoria</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Este recibo possui validade jurídica para fins de renovação de licença ambiental estadual (SEMA-MT) e certificação socioambiental RTRS / Proterra.
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setMostrarModalComprovante(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir Comprovante INDEA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InpevLogisticaReversaModule;
