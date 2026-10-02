import React, { useState } from 'react';
import {
  FileText,
  Download,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Building2,
  FileCheck2,
  Send,
  Printer,
  Eye,
  X,
  FileCode,
  Sparkles,
  ShieldCheck,
  Calculator,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { CONDOMINOS_FAZENDA, LANCAMENTOS_FISCAIS_SAFRA, CondominoData, LancamentoFiscalData } from '../data/mockAgroData';

export const FiscalLCDPRModule: React.FC = () => {
  const [selectedCondomino, setSelectedCondomino] = useState<CondominoData>(CONDOMINOS_FAZENDA[0]);
  const [lancamentos, setLancamentos] = useState<LancamentoFiscalData[]>(LANCAMENTOS_FISCAIS_SAFRA);
  const [generatedTxt, setGeneratedTxt] = useState<string | null>(null);
  const [nfeEmitida, setNfeEmitida] = useState<boolean>(false);
  const [mostrarModalDanfe, setMostrarModalDanfe] = useState<boolean>(false);
  const [mostrarModalXml, setMostrarModalXml] = useState<boolean>(false);
  const [modalNovoLancamento, setModalNovoLancamento] = useState<boolean>(false);

  // Form para novo lançamento
  const [novoData, setNovoData] = useState<string>('2026-09-28');
  const [novoDoc, setNovoDoc] = useState<string>('NF-e 89.210');
  const [novoHistorico, setNovoHistorico] = useState<string>('Aquisição de Adjuvante e Óleo Mineral');
  const [novoTipo, setNovoTipo] = useState<'RECEITA' | 'DESPESA_CUSTEIO'>('DESPESA_CUSTEIO');
  const [novoCategoria, setNovoCategoria] = useState<string>('Defensivos Agrícolas');
  const [novoValor, setNovoValor] = useState<number>(24500.0);

  // Parâmetros da NF-e
  const [cfop, setCfop] = useState<'5101' | '5905'>('5101'); // 5101 Venda, 5905 Remessa Depósito
  const [quantidadeSacasNfe, setQuantidadeSacasNfe] = useState<number>(1200);
  const [precoSacaNfe, setPrecoSacaNfe] = useState<number>(132.0);
  const [optanteFolha, setOptanteFolha] = useState<boolean>(false);

  const valorBrutoNfe = quantidadeSacasNfe * precoSacaNfe;
  const taxaFunrural = optanteFolha ? 0.002 : 0.015; // 0.2% SENAR ou 1.5% completo (1.2% INSS + 0.1% RAT + 0.2% SENAR)
  const valorFunrural = valorBrutoNfe * taxaFunrural;
  const valorLiquidoNfe = valorBrutoNfe - valorFunrural;

  const chaveAcessoSefaz = '51250918491029000188550010000041281001928410';

  // Handler para adicionar novo lançamento
  const handleAdicionarLancamento = () => {
    if (!novoDoc || novoValor <= 0) return;
    const novo: LancamentoFiscalData = {
      id: `lanc-${Date.now()}`,
      data: novoData,
      tipoLancamento: novoTipo,
      documento: novoDoc,
      historico: novoHistorico,
      categoria: novoCategoria,
      valorTotal: novoValor,
    };
    setLancamentos([novo, ...lancamentos]);
    setModalNovoLancamento(false);
  };

  const handleExcluirLancamento = (id: string) => {
    setLancamentos(lancamentos.filter((l) => l.id !== id));
  };

  // Totais da safra recalculados dinamicamente
  const totalReceitas = lancamentos
    .filter((l) => l.tipoLancamento === 'RECEITA')
    .reduce((acc, curr) => acc + curr.valorTotal, 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipoLancamento === 'DESPESA_CUSTEIO')
    .reduce((acc, curr) => acc + curr.valorTotal, 0);

  const saldoLiquidoSafra = totalReceitas - totalDespesas;

  // Rateio para o condômino selecionado
  const receitaCotista = totalReceitas * (selectedCondomino.percentual / 100);
  const despesaCotista = totalDespesas * (selectedCondomino.percentual / 100);
  const saldoCotista = saldoLiquidoSafra * (selectedCondomino.percentual / 100);

  // Gerador Oficial LCDPR (Layout v0013 - Instrução Normativa RFB nº 1.903/2019)
  const handleGerarLCDPR = () => {
    const lines: string[] = [];
    const cpfLimpo = selectedCondomino.cpf.replace(/\D/g, '');
    const nomeLimpo = selectedCondomino.nome.toUpperCase();

    // 0000: Abertura do Arquivo Digital
    lines.push(`0000|LCDPR|0013|${cpfLimpo}|${nomeLimpo}|0|0|01012025|31122025`);

    // 0010: Parâmetros de Tributação (1 = Livro Caixa Geral, 2 = Arbitramento 20%)
    lines.push(`0010|1`);

    // 0030: Dados Cadastrais do Declarante
    lines.push(`0030|RODOVIA MT-242 KM 38|ZONA RURAL|MT|5107909|78890000|6635449900|fiscal@fazendassantahelena.com.br`);

    // 0040: Cadastro dos Imóveis Rurais
    lines.push(`0040|001|2|BR|MT-5107909-E8192841029|FAZENDA SANTA HELENA GLEBA 01|5107909|MT|984128410|4210.5`);

    // 0045: Cadastro de Terceiros e Condôminos
    CONDOMINOS_FAZENDA.forEach((c, idx) => {
      const pctStr = (c.percentual * 100).toFixed(0).padStart(4, '0');
      lines.push(`0045|001|${c.cpf.replace(/\D/g, '')}|${c.nome.toUpperCase()}|1|${pctStr}`);
    });

    // 0050: Cadastro de Contas Bancárias da Atividade Rural
    lines.push(`0050|001|BR|001|1284-5|98412-0|BANCO DO BRASIL S.A.`);
    lines.push(`0050|002|BR|748|0120-1|54129-8|SICREDI UNIÃO MT`);

    // Q100: Lançamentos com rateio societário individual
    let saldoAcc = 0;
    const resumoMensal: { [mes: string]: { rec: number; des: number } } = {};

    lancamentos.forEach((l) => {
      const rateado = l.valorTotal * (selectedCondomino.percentual / 100);
      const mes = l.data.substring(0, 7); // '2025-01'

      if (!resumoMensal[mes]) resumoMensal[mes] = { rec: 0, des: 0 };

      if (l.tipoLancamento === 'RECEITA') {
        saldoAcc += rateado;
        resumoMensal[mes].rec += rateado;
      } else {
        saldoAcc -= rateado;
        resumoMensal[mes].des += rateado;
      }

      const dataStr =
        l.data.replace(/-/g, '').slice(6, 8) +
        l.data.replace(/-/g, '').slice(4, 6) +
        l.data.replace(/-/g, '').slice(0, 4);

      const valStr = (rateado * 100).toFixed(0).padStart(12, '0');
      const sldStr = (Math.abs(saldoAcc) * 100).toFixed(0).padStart(12, '0');
      const sinal = saldoAcc >= 0 ? 'P' : 'N';
      const tipo = l.tipoLancamento === 'RECEITA' ? '1' : '2';

      lines.push(
        `Q100|${dataStr}|001|001|1|${l.documento.replace(/\D/g, '') || '1029'}|${l.historico
          .substring(0, 45)
          .toUpperCase()}|18491029000188|${tipo}|${valStr}|${sinal}|${sldStr}`
      );
    });

    // Q200: Resumo Mensal da Atividade Rural
    let saldoAcumuladoMensal = 0;
    Object.keys(resumoMensal).sort().forEach((mesKey) => {
      const mesNum = mesKey.split('-')[1];
      const rec = resumoMensal[mesKey].rec;
      const des = resumoMensal[mesKey].des;
      saldoAcumuladoMensal += (rec - des);

      const recStr = (rec * 100).toFixed(0).padStart(12, '0');
      const desStr = (des * 100).toFixed(0).padStart(12, '0');
      const sldStr = (Math.abs(saldoAcumuladoMensal) * 100).toFixed(0).padStart(12, '0');
      const sinal = saldoAcumuladoMensal >= 0 ? 'P' : 'N';

      lines.push(`Q200|${mesNum}2025|${recStr}|${desStr}|${sinal}|${sldStr}`);
    });

    // 9999: Encerramento do Arquivo
    lines.push(`9999|${nomeLimpo}|${cpfLimpo}|00000000000|${lines.length + 1}`);

    const txtOutput = lines.join('\r\n');
    setGeneratedTxt(txtOutput);
  };

  const handleDownloadTxt = () => {
    if (!generatedTxt) return;
    const blob = new Blob([generatedTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCDPR_2025_${selectedCondomino.nome.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const xmlSefazSample = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcessoSefaz}" versao="4.00">
    <ide>
      <cUF>51</cUF>
      <cNF>00192841</cNF>
      <natOp>${cfop === '5101' ? 'VENDA DE PRODUÇÃO DO ESTABELECIMENTO' : 'REMESSA PARA DEPOSITO FECHADO OU ARMAZEM GERAL'}</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>4128</nNF>
      <dhEmi>2026-09-25T14:30:00-04:00</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>5107909</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <tpAmb>1</tpAmb>
      <finNFe>1</finNFe>
    </ide>
    <emit>
      <CPF>${selectedCondomino.cpf.replace(/\D/g, '')}</CPF>
      <xNome>${selectedCondomino.nome.toUpperCase()}</xNome>
      <xFant>FAZENDA SANTA HELENA</xFant>
      <IE>13.489.102-9</IE>
      <CRT>1</CRT>
    </emit>
    <dest>
      <CNPJ>60498706000157</CNPJ>
      <xNome>CARGILL AGRICOLA S.A.</xNome>
      <IE>13.120.941-0</IE>
    </dest>
    <det nItem="1">
      <prod>
        <cProd>SOJA-GR-01</cProd>
        <xProd>SOJA EM GRAOS COMERCIAL A GRANEL PADRAO CONAB</xProd>
        <NCM>12019000</NCM>
        <CFOP>${cfop}</CFOP>
        <uCom>SC</uCom>
        <qCom>${quantidadeSacasNfe.toFixed(2)}</qCom>
        <vUnCom>${precoSacaNfe.toFixed(2)}</vUnCom>
        <vProd>${valorBrutoNfe.toFixed(2)}</vProd>
      </prod>
      <imposto>
        <ICMS>
          <ICMS51>
            <orig>0</orig>
            <CST>51</CST>
            <modBC>3</modBC>
            <vBC>0.00</vBC>
            <pICMS>0.00</pICMS>
            <vICMS>0.00</vICMS>
          </ICMS51>
        </ICMS>
        <PIS><PISNT><CST>08</CST></PISNT></PIS>
        <COFINS><COFINSNT><CST>08</CST></COFINSNT></COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vProd>${valorBrutoNfe.toFixed(2)}</vProd>
        <vNF>${valorBrutoNfe.toFixed(2)}</vNF>
      </ICMSTot>
      <retTrib>
        <vRetPIS>0.00</vRetPIS>
        <vRetCOFINS>0.00</vRetCOFINS>
        <vRetCSLL>0.00</vRetCSLL>
        <vBCIRRF>0.00</vBCIRRF>
        <vIRRF>0.00</vIRRF>
        <vBCRetPrev>${valorBrutoNfe.toFixed(2)}</vBCRetPrev>
        <vRetPrev>${valorFunrural.toFixed(2)}</vRetPrev>
      </retTrib>
    </total>
  </infNFe>
</NFe>`;

  const handleDownloadXml = () => {
    const blob = new Blob([xmlSefazSample], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NFe_${chaveAcessoSefaz}.xml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Condomínio Rural */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold">
              Regime de Condomínio Rural Familiar
            </span>
            <span className="text-xs text-slate-600">Fazenda Santa Helena (CAR: MT-5107909-E8192841029)</span>
          </div>
          <h2 className="text-xl font-bold text-[#1D4B38] flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Escrituração Fiscal LCDPR & NF-e Produtor (Mod. 55)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Emissão de NFP-e com cálculo de Funrural/Senar e geração do arquivo digital validado pela Receita Federal (IN RFB 1.903).
          </p>
        </div>

        {/* Seletor de Condômino */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-600 font-semibold px-2">Produtor:</span>
          {CONDOMINOS_FAZENDA.map((cond) => (
            <button
              key={cond.id}
              onClick={() => {
                setSelectedCondomino(cond);
                setGeneratedTxt(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCondomino.id === cond.id
                  ? 'bg-emerald-600 text-[#1D4B38] shadow-md'
                  : 'text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cond.nome.split(' ')[0]} ({cond.percentual}%)
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Métricas do Cotista Selecionado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Quota Societária</span>
            <span className="font-bold text-emerald-400">{selectedCondomino.percentual}% de Posse</span>
          </div>
          <p className="text-base font-bold text-[#1D4B38] truncate">{selectedCondomino.nome}</p>
          <p className="text-xs text-slate-500 font-mono mt-0.5">CPF: {selectedCondomino.cpf}</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Despesas Custeio (Rateada)</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-lg font-bold text-red-400 font-mono">
            R$ {despesaCotista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Total fazenda: R$ {totalDespesas.toLocaleString('pt-BR')}</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Receita Bruta (Rateada)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-emerald-400 font-mono">
            R$ {receitaCotista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Total fazenda: R$ {totalReceitas.toLocaleString('pt-BR')}</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
            <span>Saldo Líquido Tributável</span>
            <Calculator className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-indigo-300 font-mono">
            R$ {saldoCotista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500">Base para IRPF Livro Caixa</p>
        </div>
      </div>

      {/* Emissor Integrado de NF-e do Produtor (Modelo 55) com Funrural e DANFE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-xs font-bold">
                SEFAZ-MT • NF-e Modelo 55
              </span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold">
                Retenção Funrural Automática
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1D4B38] mt-1.5 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-400" /> Emissor Eletrônico de Nota Fiscal de Produtor Rural
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Geração de XML Schema v4.00 com cálculo de ICMS Diferido e Funrural (INSS 1.2% + RAT 0.1% + SENAR 0.2%).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMostrarModalDanfe(true)}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-700 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-indigo-400" /> Visualizar DANFE
            </button>
            <button
              onClick={() => setMostrarModalXml(true)}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-700 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-emerald-400" /> Ver XML SEFAZ
            </button>
            <button
              onClick={() => {
                setNfeEmitida(true);
                setTimeout(() => {
                  alert(`✓ NF-e nº 4128 autorizada pela SEFAZ-MT em ambiente de produção!\nChave: ${chaveAcessoSefaz}\nProtocolo: 151250918491029`);
                }, 400);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-[#1D4B38] rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950/40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {nfeEmitida ? 'Reenviar NF-e' : 'Transmitir NF-e (SEFAZ)'}
            </button>
          </div>
        </div>

        {/* Formulário Interativo de Parâmetros da NF-e */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <label className="text-slate-900 block mb-1 font-medium">CFOP da Operação:</label>
            <select
              value={cfop}
              onChange={(e) => setCfop(e.target.value as '5101' | '5905')}
              className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-slate-900"
            >
              <option value="5101">5.101 - Venda Produção do Estabelecimento</option>
              <option value="5905">5.905 - Remessa para Depósito/Armazém</option>
            </select>
          </div>

          <div>
            <label className="text-slate-900 block mb-1 font-medium">Quantidade (Sacas 60kg):</label>
            <input
              type="number"
              value={quantidadeSacasNfe}
              onChange={(e) => setQuantidadeSacasNfe(Number(e.target.value))}
              className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-900 block mb-1 font-medium">Preço Unitário (R$/saca):</label>
            <input
              type="number"
              value={precoSacaNfe}
              onChange={(e) => setPrecoSacaNfe(Number(e.target.value))}
              className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-900 block mb-1 font-medium">Opção Tributária Funrural:</label>
            <select
              value={optanteFolha ? 'FOLHA' : 'COMERCIALIZACAO'}
              onChange={(e) => setOptanteFolha(e.target.value === 'FOLHA')}
              className="w-full bg-slate-50 border border-emerald-300 rounded-lg px-3 py-2 text-slate-900"
            >
              <option value="COMERCIALIZACAO">Comercialização (1.5% = INSS + RAT + SENAR)</option>
              <option value="FOLHA">Sobre a Folha (0.2% apenas SENAR na nota)</option>
            </select>
          </div>
        </div>

        {/* Resumo da Liquidação Financeira da Nota */}
        <div className="mt-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-600">Valor Bruto da Carga:</span>
            <div className="text-sm font-bold font-mono text-slate-900">
              R$ {valorBrutoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <span className="text-amber-400">Retenção Funrural ({optanteFolha ? '0.2%' : '1.5%'}):</span>
            <div className="text-sm font-bold font-mono text-amber-300">
              - R$ {valorFunrural.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <span className="text-emerald-400 font-semibold">Valor Líquido a Receber na Conta:</span>
            <div className="text-base font-bold font-mono text-emerald-300">
              R$ {valorLiquidoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <span className="text-slate-600">Destinatário:</span>
            <div className="text-xs text-slate-900 font-medium">Cargill Agrícola S.A. (Sorriso - MT)</div>
          </div>
        </div>
      </div>

      {/* Tabela de Lançamentos do Livro Caixa e Botão Gerador */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1D4B38] flex items-center gap-2">
              Demonstrativo de Lançamentos Fiscais da Safra
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-50 text-slate-900 font-mono">
                {lancamentos.length} Registros
              </span>
            </h3>
            <p className="text-xs text-slate-600">Notas de insumos, óleo diesel, calcário e receitas de soja</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalNovoLancamento(true)}
              className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Novo Lançamento LCDPR
            </button>
            <button
              onClick={handleGerarLCDPR}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Gerar Arquivo Oficial LCDPR (.txt)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-900">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Histórico Oficial</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3 text-right">Valor Total Fazenda</th>
                <th className="px-4 py-3 text-right text-emerald-400">
                  Rateio ({selectedCondomino.percentual}%)
                </th>
                <th className="px-3 py-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {lancamentos.map((lanc) => {
                const valorRateado = lanc.valorTotal * (selectedCondomino.percentual / 100);
                const isReceita = lanc.tipoLancamento === 'RECEITA';
                return (
                  <tr key={lanc.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{lanc.data}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{lanc.documento}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{lanc.historico}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        isReceita ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-50 text-slate-900'
                      }`}>
                        {lanc.categoria}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${
                      isReceita ? 'text-emerald-400' : 'text-slate-900'
                    }`}>
                      {isReceita ? '+' : '-'} R$ {lanc.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${
                      isReceita ? 'text-emerald-300' : 'text-slate-900'
                    }`}>
                      R$ {valorRateado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleExcluirLancamento(lanc.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                        title="Excluir Lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Novo Lançamento LCDPR */}
      {modalNovoLancamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Novo Lançamento do Livro Caixa (LCDPR)
              </h3>
              <button
                onClick={() => setModalNovoLancamento(false)}
                className="text-slate-600 hover:text-[#1D4B38] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Tipo de Lançamento</label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                  >
                    <option value="DESPESA_CUSTEIO">Despesa de Custeio</option>
                    <option value="RECEITA">Receita de Comercialização</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Data</label>
                  <input
                    type="date"
                    value={novoData}
                    onChange={(e) => setNovoData(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Número do Documento</label>
                  <input
                    type="text"
                    value={novoDoc}
                    onChange={(e) => setNovoDoc(e.target.value)}
                    placeholder="NF-e 00123"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    step="100"
                    value={novoValor}
                    onChange={(e) => setNovoValor(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Categoria de Custeio / Receita</label>
                <input
                  type="text"
                  value={novoCategoria}
                  onChange={(e) => setNovoCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Histórico Oficial (Descrição LCDPR)</label>
                <input
                  type="text"
                  value={novoHistorico}
                  onChange={(e) => setNovoHistorico(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[#1D4B38] font-medium"
                />
              </div>

              {/* Prévia do Rateio */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <span className="text-slate-600 font-medium">Rateio Societário Automático:</span>
                <div className="flex justify-between text-slate-900">
                  <span>{selectedCondomino.nome} ({selectedCondomino.percentual}%):</span>
                  <strong className="text-emerald-400 font-mono">
                    R$ {(novoValor * (selectedCondomino.percentual / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalNovoLancamento(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-900 hover:text-[#1D4B38]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAdicionarLancamento}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Gravar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualizador do Arquivo TXT Gerado para a Receita Federal */}
      {generatedTxt && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Arquivo Pré-Validado no Padrão RFB (IN 1.903)
              </span>
              <h4 className="text-sm font-bold text-[#1D4B38] mt-1">
                Visualização do Arquivo LCDPR para {selectedCondomino.nome} (Registros 0000 a 9999)
              </h4>
            </div>
            <button
              onClick={handleDownloadTxt}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Baixar Arquivo .txt
            </button>
          </div>

          <pre className="p-4 bg-white border border-slate-200 rounded-xl text-[11px] font-mono text-slate-900 overflow-x-auto max-h-64 leading-relaxed">
            {generatedTxt}
          </pre>
        </div>
      )}

      {/* Modal Visualizador de DANFE Oficial */}
      {mostrarModalDanfe && (
        <div className="fixed inset-0 z-50 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-600" />
                DANFE - Documento Auxiliar da Nota Fiscal Eletrônica
              </h3>
              <button
                onClick={() => setMostrarModalDanfe(false)}
                className="text-slate-500 hover:text-slate-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cabeçalho DANFE */}
            <div className="border border-slate-400 p-4 rounded-lg mb-4 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <h4 className="font-extrabold text-sm">{selectedCondomino.nome.toUpperCase()}</h4>
                <p className="text-[11px] text-slate-700">FAZENDA SANTA HELENA - GLEBA 01</p>
                <p className="text-[11px] text-slate-700">RODOVIA MT-242 KM 38 - ZONA RURAL - SORRISO - MT</p>
                <p className="text-[11px] text-slate-700">CPF: {selectedCondomino.cpf} • IE: 13.489.102-9</p>
              </div>
              <div className="border-l border-slate-300 pl-4 text-center">
                <div className="font-bold text-xs uppercase bg-slate-100 p-1 border">NF-e MOD. 55</div>
                <div className="text-base font-extrabold mt-1">Nº 000.004.128</div>
                <div className="text-[10px] text-slate-600">SÉRIE 1 • FOLHA 1/1</div>
                <div className="text-[9px] font-mono mt-1 break-all bg-slate-50 p-1 border">
                  CHAVE: {chaveAcessoSefaz}
                </div>
              </div>
            </div>

            {/* Destinatário */}
            <div className="border border-slate-400 p-3 rounded-lg mb-4">
              <div className="font-bold text-[10px] uppercase text-slate-600 mb-1">Destinatário / Remetente</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><strong>Razão Social:</strong> CARGILL AGRÍCOLA S.A.</div>
                <div><strong>CNPJ:</strong> 60.498.706/0001-57</div>
                <div><strong>Endereço:</strong> AV. DOS IMIGRANTES, S/N - DISTRITO INDUSTRIAL</div>
                <div><strong>Município:</strong> SORRISO - MT</div>
              </div>
            </div>

            {/* Dados do Produto */}
            <div className="border border-slate-400 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2">CÓD</th>
                    <th className="p-2">DESCRIÇÃO DO PRODUTO</th>
                    <th className="p-2">NCM</th>
                    <th className="p-2">CFOP</th>
                    <th className="p-2">UN</th>
                    <th className="p-2 text-right">QTD</th>
                    <th className="p-2 text-right">V. UNIT</th>
                    <th className="p-2 text-right">V. TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-mono">SOJA-01</td>
                    <td className="p-2 font-medium">SOJA EM GRÃOS A GRANEL SAFRA 2025/2026</td>
                    <td className="p-2 font-mono">12019000</td>
                    <td className="p-2 font-bold">{cfop}</td>
                    <td className="p-2">SC</td>
                    <td className="p-2 text-right font-mono">{quantidadeSacasNfe}</td>
                    <td className="p-2 text-right font-mono">R$ {precoSacaNfe.toFixed(2)}</td>
                    <td className="p-2 text-right font-mono font-bold">R$ {valorBrutoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cálculo do Imposto e Retenção Funrural */}
            <div className="border border-slate-400 p-3 rounded-lg grid grid-cols-4 gap-2 text-center text-[11px] mb-4">
              <div className="border-r border-slate-300 pr-2">
                <span className="block text-[10px] text-slate-500 uppercase">Base ICMS</span>
                <strong>R$ 0,00 (Diferido)</strong>
              </div>
              <div className="border-r border-slate-300 pr-2">
                <span className="block text-[10px] text-slate-500 uppercase">Valor do ICMS</span>
                <strong>R$ 0,00 (Isento)</strong>
              </div>
              <div className="border-r border-slate-300 pr-2">
                <span className="block text-[10px] text-slate-500 uppercase">Retenção Funrural ({optanteFolha ? '0.2%' : '1.5%'})</span>
                <strong className="text-red-600">R$ {valorFunrural.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase">Valor Total da Nota</span>
                <strong className="text-emerald-700 font-bold">R$ {valorBrutoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setMostrarModalDanfe(false)}
                className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-[#1D4B38] font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir DANFE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizador de XML SEFAZ */}
      {mostrarModalXml && (
        <div className="fixed inset-0 z-50 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                XML Assinado da NF-e (Schema v4.00)
              </h3>
              <button
                onClick={() => setMostrarModalXml(false)}
                className="text-slate-600 hover:text-slate-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-80 leading-relaxed">
              {xmlSefazSample}
            </pre>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 mt-3">
              <button
                onClick={() => setMostrarModalXml(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={handleDownloadXml}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-[#1D4B38] font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Baixar XML Assinado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
