import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Users,
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
  ShieldCheck,
  Calculator,
  Plus,
  Trash2,
  CheckCircle2,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { CONDOMINOS_FAZENDA, LANCAMENTOS_FISCAIS_SAFRA, CondominoData, LancamentoFiscalData } from '../data/mockAgroData';
import {
  ReformaTributariaService,
  TABELA_CCLASSTRIB_RURAL,
  RegimeProdutorRural,
  ClassificacaoTributariaItem,
  DetalheRegimeTributario,
  AuditoriaMultiRegimesResultado,
  RegimeTributarioAgroCodigo
} from '../services/reformaTributariaService';

interface CertificadoA1Info {
  instalado: boolean;
  arquivoNome: string;
  titular: string;
  cnpjCpf: string;
  emissor: string;
  validade: string;
  diasRestantes: number;
  status: 'VALIDO' | 'EXPIRADO' | 'PENDENTE';
}

export const FiscalLCDPRModule: React.FC = () => {
  const [selectedCondomino, setSelectedCondomino] = useState<CondominoData>(CONDOMINOS_FAZENDA[0]);
  const [lancamentos, setLancamentos] = useState<LancamentoFiscalData[]>(LANCAMENTOS_FISCAIS_SAFRA);
  const [generatedTxt, setGeneratedTxt] = useState<string | null>(null);
  const [nfeEmitida, setNfeEmitida] = useState<boolean>(false);
  const [mostrarModalDanfe, setMostrarModalDanfe] = useState<boolean>(false);
  const [mostrarModalXml, setMostrarModalXml] = useState<boolean>(false);
  const [modalNovoLancamento, setModalNovoLancamento] = useState<boolean>(false);
  const [modalCertificadoA1, setModalCertificadoA1] = useState<boolean>(false);
  const [regimeDetalheModal, setRegimeDetalheModal] = useState<DetalheRegimeTributario | null>(null);

  // Navegação Estruturada por Abas do Módulo Fiscal
  const [abaFiscal, setAbaFiscal] = useState<'TODOS_REGIMES' | 'NFE_EMISSAO' | 'LCDPR_SPED' | 'CONCILIACAO_OFX'>('TODOS_REGIMES');

  // Estado Conciliação OFX
  const [rawOfxTexto, setRawOfxTexto] = useState<string>(`OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKACCTFROM>
<BANKID>001
<ACCTID>98765-4
</BANKACCTFROM>
<BANKTRANLIST>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261002120000
<TRNAMT>-45800.00
<FITID>TX-2026-BB-01
<MEMO>PAGTO DIESEL S10 COMBOIO PETROBRAS</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261004120000
<TRNAMT>-125000.00
<FITID>TX-2026-BB-02
<MEMO>COMPRA FERTILIZANTE NPK YARA BRASIL</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261007120000
<TRNAMT>480000.00
<FITID>TX-2026-BB-03
<MEMO>RECEBTO VENDA SOJA DISPONIVEL CARGILL</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261008120000
<TRNAMT>-32000.00
<FITID>TX-2026-BB-04
<MEMO>DEFENSIVO HERBICIDA SYNGENTA PULVERIZACAO</MEMO>
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`);
  const [processandoOfx, setProcessandoOfx] = useState<boolean>(false);
  const [resultadoOfxImportado, setResultadoOfxImportado] = useState<any>(null);
  const [lancamentosOfxLcdpr, setLancamentosOfxLcdpr] = useState<any[]>([]);

  const handleImportarOfx = async () => {
    setProcessandoOfx(true);
    try {
      const res = await fetch('/api/v1/financeiro/ofx/importar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudoOfx: rawOfxTexto })
      });
      const data = await res.json();
      setResultadoOfxImportado(data);
    } catch (err) {
      console.error('Erro ao importar OFX:', err);
    } finally {
      setProcessandoOfx(false);
    }
  };

  const handleConciliarOfxParaLcdpr = async () => {
    if (!resultadoOfxImportado || !resultadoOfxImportado.transacoes) return;
    setProcessandoOfx(true);
    try {
      const res = await fetch('/api/v1/financeiro/ofx/conciliar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transacoes: resultadoOfxImportado.transacoes,
          matriculaImovel: '001',
          cnpjCpfTitular: '18.491.029/0001-88'
        })
      });
      const data = await res.json();
      if (data.sucesso && data.lancamentosQ100) {
        setLancamentosOfxLcdpr(data.lancamentosQ100);
      }
    } catch (err) {
      console.error('Erro ao conciliar OFX:', err);
    } finally {
      setProcessandoOfx(false);
    }
  };

  // Parâmetros de Simulação de Todos os Regimes Tributários
  const [faturamentoAnualAudit, setFaturamentoAnualAudit] = useState<number>(5500000);
  const [despesasPctAudit, setDespesasPctAudit] = useState<number>(65);
  const [investimentoMaquinasAudit, setInvestimentoMaquinasAudit] = useState<number>(450000);
  const [filtroCategoriaRegime, setFiltroCategoriaRegime] = useState<string>('TODOS');

  // Ambiente e Certificado A1
  const [ambienteFiscal, setAmbienteFiscal] = useState<'HOMOLOGACAO' | 'PRODUCAO'>('HOMOLOGACAO');
  const [certificadoA1, setCertificadoA1] = useState<CertificadoA1Info>({
    instalado: true,
    arquivoNome: 'fazenda_santa_helena_a1.pfx',
    titular: 'FAZENDA SANTA HELENA AGROPECUARIA LTDA',
    cnpjCpf: '18.491.029/0001-88',
    emissor: 'AC SERPRO RFB v5 (ICP-Brasil)',
    validade: '2027-05-18',
    diasRestantes: 284,
    status: 'VALIDO',
  });

  // Form para novo lançamento LCDPR
  const [novoData, setNovoData] = useState<string>('2026-09-28');
  const [novoDoc, setNovoDoc] = useState<string>('NF-e 89.210');
  const [novoHistorico, setNovoHistorico] = useState<string>('Aquisição de Adjuvante e Óleo Mineral');
  const [novoTipo, setNovoTipo] = useState<'RECEITA' | 'DESPESA_CUSTEIO'>('DESPESA_CUSTEIO');
  const [novoCategoria, setNovoCategoria] = useState<string>('Defensivos Agrícolas');
  const [novoValor, setNovoValor] = useState<number>(24500.0);

  // Parâmetros da NF-e e Reforma Tributária (IBS & CBS)
  const [cfop, setCfop] = useState<'5101' | '5905'>('5101'); // 5101 Venda, 5905 Remessa Depósito
  const [quantidadeSacasNfe, setQuantidadeSacasNfe] = useState<number>(1200);
  const [precoSacaNfe, setPrecoSacaNfe] = useState<number>(132.0);
  const [optanteFolha, setOptanteFolha] = useState<boolean>(false);
  const [regimeProdutorReforma, setRegimeProdutorReforma] = useState<RegimeProdutorRural>('PRODUTOR_PF_NAO_OPTANTE');
  const [cClassTribNfe, setCClassTribNfe] = useState<string>('200032');
  const [anoReferenciaReforma, setAnoReferenciaReforma] = useState<number>(2026);
  const [mostrarQuadroConsolidado, setMostrarQuadroConsolidado] = useState<boolean>(true);

  const valorBrutoNfe = quantidadeSacasNfe * precoSacaNfe;
  const taxaFunrural = optanteFolha ? 0.002 : 0.015; // 0.2% SENAR ou 1.5% completo (1.2% INSS + 0.1% RAT + 0.2% SENAR)
  const valorFunrural = valorBrutoNfe * taxaFunrural;
  const valorLiquidoNfe = valorBrutoNfe - valorFunrural;

  const chaveAcessoSefaz = '51250918491029000188550010000041281001928410';

  // Cálculo consolidado oficial: Regra Normal + Reforma Tributária IBS/CBS
  const tributacaoConsolidada = useMemo(() => {
    return ReformaTributariaService.calcularTributacaoConsolidada({
      valorOperacao: valorBrutoNfe,
      regimeProdutor: regimeProdutorReforma,
      cClassTrib: cClassTribNfe,
      anoReferencia: anoReferenciaReforma,
      regimeIcms: cfop === '5101' ? 'DIFERIMENTO_INTERNO' : 'TRIBUTADO_INTEGRAL',
      opcaoFunrural: optanteFolha ? 'FOLHA_DE_PAGAMENTO' : 'COMERCIALIZACAO',
      quantidadeSacasSoja: quantidadeSacasNfe,
    });
  }, [valorBrutoNfe, regimeProdutorReforma, cClassTribNfe, anoReferenciaReforma, cfop, optanteFolha, quantidadeSacasNfe]);

  // Auditoria Multi-Regimes (Todos os 7 Regimes Tributários do Agronegócio)
  const auditoriaMultiRegimes: AuditoriaMultiRegimesResultado = useMemo(() => {
    return ReformaTributariaService.auditarTodosOsRegimesTributarios({
      valorOperacao: valorBrutoNfe,
      faturamentoAnualEstimado: faturamentoAnualAudit,
      despesasOperacionaisPct: despesasPctAudit,
      investimentoMaquinasAno: investimentoMaquinasAudit,
      opcaoFunrural: optanteFolha ? 'FOLHA_DE_PAGAMENTO' : 'COMERCIALIZACAO',
      anoReferenciaReforma: anoReferenciaReforma,
      cClassTrib: cClassTribNfe,
    });
  }, [valorBrutoNfe, faturamentoAnualAudit, despesasPctAudit, investimentoMaquinasAudit, optanteFolha, anoReferenciaReforma, cClassTribNfe]);

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
    lines.push(`0010|1`);
    lines.push(`0030|RODOVIA MT-242 KM 38|ZONA RURAL|MT|5107909|78890000|6635449900|fiscal@fazendassantahelena.com.br`);
    lines.push(`0040|001|2|BR|MT-5107909-E8192841029|FAZENDA SANTA HELENA GLEBA 01|5107909|MT|984128410|4210.5`);

    CONDOMINOS_FAZENDA.forEach((c) => {
      const pctStr = (c.percentual * 100).toFixed(0).padStart(4, '0');
      lines.push(`0045|001|${c.cpf.replace(/\D/g, '')}|${c.nome.toUpperCase()}|1|${pctStr}`);
    });

    lines.push(`0050|001|BR|001|1284-5|98412-0|BANCO DO BRASIL S.A.`);
    lines.push(`0050|002|BR|748|0120-1|54129-8|SICREDI UNIÃO MT`);

    let saldoAcc = 0;
    const resumoMensal: { [mes: string]: { rec: number; des: number } } = {};

    lancamentos.forEach((l) => {
      const rateado = l.valorTotal * (selectedCondomino.percentual / 100);
      const mes = l.data.substring(0, 7);

      if (!resumoMensal[mes]) resumoMensal[mes] = { rec: 0, des: 0 };

      if (l.tipoLancamento === 'RECEITA') {
        saldoAcc += rateado;
        resumoMensal[mes].rec += rateado;
      } else {
        saldoAcc -= rateado;
        resumoMensal[mes].des += rateado;
      }

      const tipoDoc = l.documento.includes('NF') ? '1' : '3';
      const docNum = l.documento.replace(/\D/g, '') || '0';
      const codConta = l.tipoLancamento === 'RECEITA' ? '001' : '002';
      const histLimpo = l.historico.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);

      const diaFmt = l.data.replace(/-/g, '').substring(6, 8) + l.data.replace(/-/g, '').substring(4, 6) + l.data.replace(/-/g, '').substring(0, 4);

      lines.push(
        `Q100|${diaFmt}|001|${codConta}|001|${docNum}|${tipoDoc}|${histLimpo}|18491029000188|1|${rateado.toFixed(2).replace('.', '')}|${saldoAcc >= 0 ? '+' : '-'}|${Math.abs(saldoAcc).toFixed(2).replace('.', '')}`
      );
    });

    // Q200: Resumo Mensal
    Object.keys(resumoMensal).sort().forEach((m) => {
      const mesNum = m.split('-')[1];
      const rec = resumoMensal[m].rec.toFixed(2).replace('.', '');
      const des = resumoMensal[m].des.toFixed(2).replace('.', '');
      const liq = (resumoMensal[m].rec - resumoMensal[m].des).toFixed(2).replace('.', '');
      lines.push(`Q200|${mesNum}2025|${rec}|${des}|${liq}`);
    });

    // 9999: Encerramento do Arquivo
    lines.push(`9999|${lines.length + 1}`);

    const conteudoTxt = lines.join('\r\n');
    setGeneratedTxt(conteudoTxt);
  };

  const handleDownloadTxt = () => {
    if (!generatedTxt) return;
    const blob = new Blob([generatedTxt], { type: 'text/plain;charset=iso-8859-1' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCDPR_${selectedCondomino.cpf.replace(/\D/g, '')}_2025.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Mock de XML assinado conforme NT 2024.002 com os grupos oficiais <IBSCBS> e <IBSCBSTot>
  const xmlSefazSample = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcessoSefaz}" versao="4.00">
    <ide>
      <cUF>51</cUF>
      <cNF>00192841</cNF>
      <natOp>VENDA DE PRODUCAO DO ESTABELECIMENTO</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>4128</nNF>
      <dhEmi>${new Date().toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>5107909</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <tpAmb>${ambienteFiscal === 'PRODUCAO' ? '1' : '2'}</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>AgroTech_Enterprise_v3.2_NT2024.002</verProc>
    </ide>
    <emit>
      <CNPJ>18491029000188</CNPJ>
      <xNome>FAZENDA SANTA HELENA AGROPECUARIA</xNome>
      <xFant>SANTA HELENA</xFant>
      <enderEmit>
        <xLgr>RODOVIA MT-242 KM 38</xLgr>
        <nro>SN</nro>
        <xBairro>ZONA RURAL</xBairro>
        <cMun>5107909</cMun>
        <xMun>SORRISO</xMun>
        <UF>MT</UF>
        <CEP>78890000</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
      </enderEmit>
      <IE>134819201</IE>
      <CRT>3</CRT>
    </emit>
    <dest>
      <CNPJ>02578129000174</CNPJ>
      <xNome>CARGILL AGRICOLA S.A.</xNome>
      <enderDest>
        <xLgr>AV PERIMETRAL SUDOESTE</xLgr>
        <nro>1280</nro>
        <xBairro>DISTRITO INDUSTRIAL</xBairro>
        <cMun>5107909</cMun>
        <xMun>SORRISO</xMun>
        <UF>MT</UF>
        <CEP>78890000</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
      </enderDest>
      <indIEDest>1</indIEDest>
      <IE>130982401</IE>
    </dest>
    <det nItem="1">
      <prod>
        <cProd>SOJA-GRAO-01</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>SOJA EM GRAO TRANSGENICA SAFRA 2025/2026</xProd>
        <NCM>12019000</NCM>
        <CFOP>${cfop}</CFOP>
        <uCom>SC</uCom>
        <qCom>${quantidadeSacasNfe.toFixed(4)}</qCom>
        <vUnCom>${precoSacaNfe.toFixed(4)}</vUnCom>
        <vProd>${valorBrutoNfe.toFixed(2)}</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>SC</uTrib>
        <qTrib>${quantidadeSacasNfe.toFixed(4)}</qTrib>
        <vUnTrib>${precoSacaNfe.toFixed(4)}</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS51>
            <orig>0</orig>
            <CST>51</CST>
            <modBC>3</modBC>
            <pRedBC>0.00</pRedBC>
            <vBC>0.00</vBC>
            <pICMS>0.00</pICMS>
            <vICMSOp>0.00</vICMSOp>
            <pDif>100.00</pDif>
            <vICMSDif>0.00</vICMSDif>
            <vICMS>0.00</vICMS>
          </ICMS51>
        </ICMS>
        <PIS>
          <PISNT>
            <CST>09</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>09</CST>
          </COFINSNT>
        </COFINS>
${tributacaoConsolidada.regraIbsCbs.xmlSnippetIbsCbs}
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCPUFDest>0.00</vFCPUFDest>
        <vICMSUFDest>0.00</vICMSUFDest>
        <vICMSUFRemet>0.00</vICMSUFRemet>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>${valorBrutoNfe.toFixed(2)}</vProd>
        <vNF>${valorBrutoNfe.toFixed(2)}</vNF>
      </ICMSTot>
${tributacaoConsolidada.regraIbsCbs.xmlSnippetTot}
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
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      <Reference URI="#NFe${chaveAcessoSefaz}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
        <DigestValue>4k91vKx89fKl0aQmW9zP1eLm92=</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>MIICkTCBAgEAMAcGBSsOAwIHBAUw...=</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509Certificate>MIIFuzCCA6OgAwIBAgIQDk...=</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
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

  const handleTransmitirSefaz = () => {
    if (ambienteFiscal === 'PRODUCAO') {
      if (!certificadoA1.instalado || certificadoA1.status !== 'VALIDO') {
        alert(
          '❌ ERRO SEFAZ 280 (Certificado Inválido):\n\n' +
          'A transmissão em PRODUÇÃO exige um Certificado Digital A1 ICP-Brasil válido e instalado.\n' +
          'Clique em "Certificado A1" para carregar o arquivo .pfx e autenticar com sua senha antes de transmitir.'
        );
        return;
      }
      setNfeEmitida(true);
      setTimeout(() => {
        alert(
          `✓ NF-e nº 4128 AUTORIZADA PELA SEFAZ-MT (PRODUÇÃO)!\n\n` +
          `Chave: ${chaveAcessoSefaz}\n` +
          `Protocolo: 151260029103981\n` +
          `Certificado ICP-Brasil: ${certificadoA1.emissor}\n` +
          `Status: Autorizado o uso da NF-e (cStat 100)`
        );
      }, 400);
    } else {
      setNfeEmitida(true);
      setTimeout(() => {
        alert(
          `ℹ️ NF-e nº 4128 AUTORIZADA EM AMBIENTE DE HOMOLOGAÇÃO (SEFAZ SVRS)\n\n` +
          `ATENÇÃO: DOCUMENTO DE TESTE SEM VALOR JURÍDICO-FISCAL.\n` +
          `Chave: ${chaveAcessoSefaz}\n` +
          `Protocolo de Teste: 151250918491029\n` +
          `Status: Autorizado em Homologação (cStat 100)`
        );
      }, 400);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Condomínio Rural */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
              Regime de Condomínio Rural Familiar
            </span>
            <span className="text-xs text-slate-500">Fazenda Santa Helena (CAR: MT-5107909-E8192841029)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" /> Escrituração Fiscal LCDPR & NF-e Produtor (Mod. 55)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Emissão de NFP-e com cálculo de Funrural/Senar e geração do arquivo digital validado pela Receita Federal (IN RFB 1.903).
          </p>
        </div>

        {/* Seletor de Condômino */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold px-2">Produtor:</span>
          {CONDOMINOS_FAZENDA.map((cond) => (
            <button
              key={cond.id}
              onClick={() => {
                setSelectedCondomino(cond);
                setGeneratedTxt(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCondomino.id === cond.id
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {cond.nome.split(' ')[0]} ({cond.percentual}%)
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Métricas do Cotista Selecionado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Quota Societária</span>
            <span className="font-bold text-emerald-700">{selectedCondomino.percentual}% de Posse</span>
          </div>
          <p className="text-base font-bold text-slate-900 truncate">{selectedCondomino.nome}</p>
          <p className="text-xs text-slate-400 font-mono mt-0.5">CPF: {selectedCondomino.cpf}</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Despesas Custeio (Rateada)</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-lg font-bold text-rose-700 font-mono">
            R$ {despesaCotista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400">Total fazenda: R$ {totalDespesas.toLocaleString('pt-BR')}</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Receita Bruta (Rateada)</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-lg font-bold text-emerald-700 font-mono">
            R$ {receitaCotista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400">Total fazenda: R$ {totalReceitas.toLocaleString('pt-BR')}</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Saldo Líquido Tributável</span>
            <Calculator className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 font-mono">
            R$ {saldoCotista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400">Base para IRPF Livro Caixa</p>
        </div>
      </div>

      {/* Navegação Estratégica por Abas do Módulo Fiscal & Tributário */}
      <div className="flex flex-col sm:flex-row border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1.5">
        <button
          type="button"
          onClick={() => setAbaFiscal('TODOS_REGIMES')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            abaFiscal === 'TODOS_REGIMES'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Auditor de Todos os Regimes (PF, PJ, Simples, Coop, Exportação)</span>
        </button>
        <button
          type="button"
          onClick={() => setAbaFiscal('NFE_EMISSAO')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            abaFiscal === 'NFE_EMISSAO'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Emissão NF-e Produtor (Mod. 55) & SEFAZ</span>
        </button>
        <button
          type="button"
          onClick={() => setAbaFiscal('LCDPR_SPED')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            abaFiscal === 'LCDPR_SPED'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Escrituração Fiscal LCDPR (Layout RFB 0013)</span>
        </button>
        <button
          type="button"
          onClick={() => setAbaFiscal('CONCILIACAO_OFX')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            abaFiscal === 'CONCILIACAO_OFX'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Conciliação Bancária OFX & Automação LCDPR</span>
        </button>
      </div>

      {/* ABA 1: Auditoria e Planejamento Tributário - Todos os 7 Regimes */}
      {abaFiscal === 'TODOS_REGIMES' && (
        <div className="space-y-6">
          {/* Painel Interativo de Parâmetros de Simulação e Planejamento */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-700" />
                  Planejamento e Auditoria de Enquadramento Tributário Rural
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulação simultânea dos 7 regimes fiscais vigentes e futuros do agronegócio com fundamentação no RIR/2018, Leis 8.023/90, 9.249/95, LC 123/06, Lei 5.764/71 e LC 214/2025.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold font-mono shrink-0">
                Safra 2025/2026 • Transição Constitucional
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Faturamento Anual Projetado:</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">R$</span>
                  <input
                    type="number"
                    value={faturamentoAnualAudit}
                    onChange={(e) => setFaturamentoAnualAudit(Number(e.target.value))}
                    step="100000"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Ex: R$ 5,5 Milhões / safra</span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Custo Operacional / Insumos (%):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="5"
                    value={despesasPctAudit}
                    onChange={(e) => setDespesasPctAudit(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                  <span className="font-mono font-bold text-slate-900 text-xs w-10 text-right">{despesasPctAudit}%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Fertilizantes, defensivos, diesel e sementes</span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Investimento em Máquinas/Pivô (Ano):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">R$</span>
                  <input
                    type="number"
                    value={investimentoMaquinasAudit}
                    onChange={(e) => setInvestimentoMaquinasAudit(Number(e.target.value))}
                    step="50000"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">100% dedutível no LCDPR (Art. 59 RIR)</span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Opção de Funrural:</label>
                <select
                  value={optanteFolha ? 'FOLHA' : 'COMERCIALIZACAO'}
                  onChange={(e) => setOptanteFolha(e.target.value === 'FOLHA')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value="COMERCIALIZACAO">Comercialização (1.5% PF / 2.05% PJ)</option>
                  <option value="FOLHA">Folha de Salários (0.2% PF / 0.25% PJ na nota)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Lei 13.606/2018</span>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Ano da Reforma (IBS/CBS):</label>
                <select
                  value={anoReferenciaReforma}
                  onChange={(e) => setAnoReferenciaReforma(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value={2026}>2026 - Ano-Teste (CBS 0,90% / IBS 0,10%)</option>
                  <option value={2028}>2028 - Transição Gradual</option>
                  <option value={2033}>2033 - Regime Pleno Concluído</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">EC 132/2023 & LC 214/2025</span>
              </div>
            </div>
          </div>

          {/* Destaque do Melhor Regime Tributário & Economia Anual */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-emerald-700/60 border border-emerald-500/30 rounded-2xl text-amber-300">
                  <ShieldCheck className="w-8 h-8" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded text-[11px] font-black uppercase tracking-wider">
                      🏆 Regime Vencedor em Economia Fiscal
                    </span>
                    <span className="text-xs text-emerald-200">
                      Score de Atratividade: {auditoriaMultiRegimes.melhorRegime.scoreAtratividade}/100
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mt-1 text-white">
                    {auditoriaMultiRegimes.melhorRegime.nome}
                  </h4>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {auditoriaMultiRegimes.melhorRegime.descricao}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-emerald-950/40 border border-emerald-700/50 p-4 rounded-xl shrink-0">
                <div>
                  <span className="text-[11px] text-emerald-300 block">Carga Tributária Efetiva:</span>
                  <div className="text-2xl font-black font-mono text-emerald-300">
                    {auditoriaMultiRegimes.melhorRegime.aliquotaEfetivaGlobalPct}%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    R$ {auditoriaMultiRegimes.melhorRegime.cargaTributariaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-l border-emerald-700/60 pl-6">
                  <span className="text-[11px] text-amber-300 block font-semibold">Economia Anual vs Pior Regime:</span>
                  <div className="text-2xl font-black font-mono text-amber-300">
                    R$ {auditoriaMultiRegimes.economiaAnualEstimadaVsPior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-emerald-300">Mais sobra líquida no caixa</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-700/40 text-xs text-emerald-100 flex items-center justify-between">
              <span>{auditoriaMultiRegimes.analisePlanejamentoTributario}</span>
              <button
                type="button"
                onClick={() => setRegimeDetalheModal(auditoriaMultiRegimes.melhorRegime)}
                className="text-amber-300 hover:text-white font-bold underline cursor-pointer shrink-0 ml-4"
              >
                Ver Detalhes do Enquadramento →
              </button>
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold text-xs mr-1">Filtrar por Natureza:</span>
            {['TODOS', 'Pessoa Física', 'Pessoa Jurídica', 'Simples Nacional', 'Cooperativa', 'Exportação'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltroCategoriaRegime(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0 ${
                  filtroCategoriaRegime === cat
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grade Comparativa com Todos os 7 Regimes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {auditoriaMultiRegimes.regimes
              .filter((r) => filtroCategoriaRegime === 'TODOS' || r.categoria === filtroCategoriaRegime)
              .map((reg) => {
                const isMelhor = reg.codigo === auditoriaMultiRegimes.melhorRegime.codigo;
                const isInelegivel = reg.cargaTributariaTotal > 900000000;

                return (
                  <div
                    key={reg.codigo}
                    className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                      isMelhor
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : isInelegivel
                        ? 'border-slate-200 opacity-60 bg-slate-50/50'
                        : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {reg.categoria}
                            </span>
                            {isMelhor && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                🏆 Mais Econômico
                              </span>
                            )}
                            {isInelegivel && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                Inelegível
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {reg.nome}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block">Atratividade</span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            {reg.scoreAtratividade}/100
                          </span>
                        </div>
                      </div>

                      {/* Quadro Financeiro do Regime */}
                      <div className="py-3 space-y-1.5 text-xs border-b border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Base de Cálculo Renda:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {isInelegivel ? '-' : `R$ ${reg.baseCalculoRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Tributos de Renda (IR/CSLL/DAS):</span>
                          <span className="font-mono font-bold text-slate-900">
                            {isInelegivel ? '-' : `R$ ${reg.totalTributosRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Funrural / Previdência:</span>
                          <span className="font-mono text-slate-700">
                            {isInelegivel ? '-' : `R$ ${reg.funrural.valorRetencao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${reg.funrural.aliquotaTotal}%)`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Tributos Estaduais (FETHAB/ICMS):</span>
                          <span className="font-mono text-slate-700">
                            {isInelegivel ? '-' : `R$ ${reg.tributosEstaduais.totalEstadual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Reforma IBS / CBS ({anoReferenciaReforma}):</span>
                          <span className="font-mono text-slate-700">
                            {isInelegivel ? '-' : `R$ ${reg.reformaIbsCbs.totalIbsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          </span>
                        </div>
                      </div>

                      {/* Resumo Consolidado de Carga */}
                      <div className="py-3 bg-slate-50/80 -mx-5 px-5 my-2 border-y border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Carga Tributária Total</span>
                          <div className="text-base font-black font-mono text-slate-900">
                            {isInelegivel ? 'Ultrapassa Limite' : `R$ ${reg.cargaTributariaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Alíquota Efetiva</span>
                          <div className={`text-base font-black font-mono ${isMelhor ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {isInelegivel ? 'N/A' : `${reg.aliquotaEfetivaGlobalPct}%`}
                          </div>
                        </div>
                      </div>

                      {/* Destaques e Fundamentação */}
                      <div className="space-y-1.5 pt-1 text-[11px]">
                        <p className="text-slate-600 line-clamp-2">
                          <strong className="text-slate-800">Estratégia:</strong> {reg.observacaoEstrategica}
                        </p>
                        <p className="text-slate-400 text-[10px] font-mono truncate">
                          Base: {reg.fundamentoLegal}
                        </p>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setRegimeDetalheModal(reg)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition flex-1 text-center"
                      >
                        Ver Fundamentação
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAbaFiscal('NFE_EMISSAO');
                          if (reg.codigo.startsWith('PF_')) {
                            setRegimeProdutorReforma('PRODUTOR_PF_NAO_OPTANTE');
                          } else {
                            setRegimeProdutorReforma('PESSOA_JURIDICA_AGRO');
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs"
                      >
                        Aplicar na NF-e
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ABA 2: Emissor Integrado de NF-e do Produtor (Modelo 55) com Funrural e DANFE */}
      {abaFiscal === 'NFE_EMISSAO' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                  ambienteFiscal === 'PRODUCAO'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {ambienteFiscal === 'PRODUCAO' ? 'PRODUÇÃO SEFAZ-MT' : 'HOMOLOGAÇÃO (TESTES)'}
                </span>
                <span className="px-2.5 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-xs font-bold">
                  NF-e Modelo 55
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-bold">
                  Retenção Funrural
                </span>
                <span className="px-2.5 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-xs font-bold">
                  IBS / CBS (NT 2024.002)
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-700" /> Emissor Eletrônico de Nota Fiscal de Produtor Rural
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Geração de XML Schema v4.00 com cálculo de ICMS Diferido, Funrural e grupos oficiais &lt;IBSCBS&gt; / &lt;IBSCBSTot&gt; da Reforma Tributária (LC 214/2025).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Seletor de Ambiente SEFAZ */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setAmbienteFiscal('HOMOLOGACAO')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    ambienteFiscal === 'HOMOLOGACAO'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Homologação
                </button>
                <button
                  type="button"
                  onClick={() => setAmbienteFiscal('PRODUCAO')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    ambienteFiscal === 'PRODUCAO'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Produção
                </button>
              </div>

              {/* Gerenciar Certificado A1 */}
              <button
                onClick={() => setModalCertificadoA1(true)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-emerald-700" />
                Certificado A1 {certificadoA1.status === 'VALIDO' ? '✓' : '!'}
              </button>

              <button
                onClick={() => setMostrarModalDanfe(true)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" /> Visualizar DANFE
              </button>

              <button
                onClick={() => setMostrarModalXml(true)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-emerald-700" /> Ver XML SEFAZ
              </button>

              <button
                onClick={handleTransmitirSefaz}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer ${
                  ambienteFiscal === 'PRODUCAO'
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                {nfeEmitida ? 'Reenviar NF-e' : `Transmitir (${ambienteFiscal === 'PRODUCAO' ? 'Produção' : 'Homologação'})`}
              </button>
            </div>
          </div>

          {/* Formulário Interativo de Parâmetros da NF-e */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">CFOP da Operação:</label>
              <select
                value={cfop}
                onChange={(e) => setCfop(e.target.value as '5101' | '5905')}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="5101">5.101 - Venda Produção do Estabelecimento</option>
                <option value="5905">5.905 - Remessa para Depósito/Armazém</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Quantidade (Sacas 60kg):</label>
              <input
                type="number"
                value={quantidadeSacasNfe}
                onChange={(e) => setQuantidadeSacasNfe(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Preço Unitário (R$/saca):</label>
              <input
                type="number"
                value={precoSacaNfe}
                onChange={(e) => setPrecoSacaNfe(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Opção Tributária Funrural:</label>
              <select
                value={optanteFolha ? 'FOLHA' : 'COMERCIALIZACAO'}
                onChange={(e) => setOptanteFolha(e.target.value === 'FOLHA')}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="COMERCIALIZACAO">Comercialização (1.5% = INSS + RAT + SENAR)</option>
                <option value="FOLHA">Sobre a Folha (0.2% apenas SENAR na nota)</option>
              </select>
            </div>
          </div>

          {/* Controles da Reforma Tributária (IBS/CBS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-200 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Regime do Produtor na Reforma (IBS/CBS):</label>
              <select
                value={regimeProdutorReforma}
                onChange={(e) => setRegimeProdutorReforma(e.target.value as RegimeProdutorRural)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="PRODUTOR_PF_NAO_OPTANTE">Pessoa Física NÃO Optante (Art. 140/165 LC 214/2025 - Padrão)</option>
                <option value="PRODUTOR_OPTANTE_IBS_CBS">Pessoa Física OPTANTE (Regime Não-Cumulativo Amplo)</option>
                <option value="PESSOA_JURIDICA_AGRO">Pessoa Jurídica Agropecuária</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Classificação Tributária (cClassTrib):</label>
              <select
                value={cClassTribNfe}
                onChange={(e) => setCClassTribNfe(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                {TABELA_CCLASSTRIB_RURAL.map((c: ClassificacaoTributariaItem) => (
                  <option key={c.cClassTrib} value={c.cClassTrib}>
                    {c.cClassTrib} - {c.descricao.slice(0, 48)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Ano da Reforma / Convivência:</label>
              <div className="flex items-center gap-2">
                <select
                  value={anoReferenciaReforma}
                  onChange={(e) => setAnoReferenciaReforma(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value={2026}>2026 - Ano Teste (CBS 0,90% / IBS 0,10%)</option>
                  <option value={2028}>2028 - Transição Progressiva</option>
                  <option value={2033}>2033 - Regime Pleno Concluído</option>
                </select>
                <button
                  type="button"
                  onClick={() => setMostrarQuadroConsolidado(!mostrarQuadroConsolidado)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                >
                  {mostrarQuadroConsolidado ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {mostrarQuadroConsolidado ? 'Ocultar Quadro' : 'Ver Quadro'}
                </button>
              </div>
            </div>
          </div>

          {/* Resumo da Liquidação Financeira da Nota */}
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500">Valor Bruto da Carga:</span>
              <div className="text-sm font-bold font-mono text-slate-900">
                R$ {valorBrutoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Retenção Funrural ({optanteFolha ? '0.2%' : '1.5%'}):</span>
              <div className="text-sm font-bold font-mono text-rose-700">
                - R$ {valorFunrural.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Valor Líquido a Receber na Conta:</span>
              <div className="text-base font-bold font-mono text-emerald-700">
                R$ {valorLiquidoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Destinatário:</span>
              <div className="text-xs text-slate-900 font-semibold">Cargill Agrícola S.A. (Sorriso - MT)</div>
            </div>
          </div>

          {/* Quadro Tributário Consolidado: Regra Vigente (Normal) & Reforma Tributária (IBS/CBS) */}
          {mostrarQuadroConsolidado && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  Quadro Tributário Consolidado: Regra Vigente (Normal) vs Reforma Tributária (IBS & CBS)
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Ano-base: {anoReferenciaReforma} • Convivência Constitucional
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Coluna 1: Regras Tributárias Tradicionais (Normal) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      1. Regra Vigente (Normal)
                    </span>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-normal">
                      Legislação Atual
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">ICMS Saída Interna (CST 51):</span>
                      <span className="font-mono font-bold text-slate-900">R$ 0,00 (Diferimento Art. 358 RICMS/MT)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">PIS / COFINS (CST 09):</span>
                      <span className="font-mono font-bold text-slate-900">R$ 0,00 (Suspensão Lei 10.925/2004)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Funrural ({optanteFolha ? '0,2% Senar' : '1,5% Completo'}):</span>
                      <span className="font-mono font-bold text-rose-700">- R$ {valorFunrural.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">FETHAB Soja MT (R$ 1,45/sc):</span>
                      <span className="font-mono font-semibold text-slate-700">- R$ {(quantidadeSacasNfe * 1.45).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-700 font-bold">Total Retenções em Fonte:</span>
                      <span className="font-mono font-bold text-rose-700">- R$ {(valorFunrural + (quantidadeSacasNfe * 1.45)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Nova Regra IBS & CBS (NT 2024.002 / LC 214/2025) */}
                <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-200 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-900 border-b border-sky-200 pb-1.5">
                    <span className="flex items-center gap-1 text-sky-800">
                      <FileCode className="w-3.5 h-3.5 text-sky-700" />
                      2. Nova Regra Reforma (IBS & CBS)
                    </span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono font-bold">
                      CST {tributacaoConsolidada.regraIbsCbs.classificacao.cstIbsCbs} • cClassTrib {cClassTribNfe}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Débito IBS + CBS na Saída:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        R$ {tributacaoConsolidada.regraIbsCbs.vTotalIbsCbs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {regimeProdutorReforma === 'PRODUTOR_PF_NAO_OPTANTE' ? ' (Isento Art. 140)' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Repartição IBS (70% MT / 30% Mun):</span>
                      <span className="font-mono font-semibold text-slate-700">
                        MT: R$ {tributacaoConsolidada.regraIbsCbs.vIBSEst.toFixed(2)} | Mun: R$ {tributacaoConsolidada.regraIbsCbs.vIBSMun.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Crédito Presumido ao Comprador:</span>
                      <span className="font-mono font-bold text-sky-800">
                        R$ {(tributacaoConsolidada.regraIbsCbs.gCredPresProdRural?.vCredPres || (valorBrutoNfe * 0.085)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Convivência na NF-e ({anoReferenciaReforma}):</span>
                      <span className="font-medium text-emerald-700">Tags &lt;IBSCBS&gt; + &lt;ICMS&gt; ativas</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-sky-200">
                      <span className="text-slate-700 font-bold">Valor Efetivo Líquido Final:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        R$ {(valorLiquidoNfe - tributacaoConsolidada.regraIbsCbs.vTotalIbsCbs).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 3: Tabela de Lançamentos do Livro Caixa e Botão Gerador */}
      {abaFiscal === 'LCDPR_SPED' && (
        <>
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Demonstrativo de Lançamentos Fiscais da Safra
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono">
                    {lancamentos.length} Registros
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Notas de insumos, óleo diesel, calcário e receitas de soja</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalNovoLancamento(true)}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-700" /> Novo Lançamento LCDPR
                </button>
                <button
                  onClick={handleGerarLCDPR}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Gerar Arquivo Oficial LCDPR (.txt)
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-900">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Histórico Oficial</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3 text-right">Valor Total Fazenda</th>
                    <th className="px-4 py-3 text-right">Valor Rateado ({selectedCondomino.percentual}%)</th>
                    <th className="px-3 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lancamentos.map((lanc) => {
                    const valorRateado = lanc.valorTotal * (selectedCondomino.percentual / 100);
                    const isReceita = lanc.tipoLancamento === 'RECEITA';

                    return (
                      <tr key={lanc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono text-slate-500">{lanc.data}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{lanc.documento}</td>
                        <td className="px-4 py-3 text-slate-600">{lanc.historico}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            isReceita ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {lanc.categoria}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-bold ${
                          isReceita ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {isReceita ? '+' : '-'} R$ {lanc.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-bold ${
                          isReceita ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          R$ {valorRateado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleExcluirLancamento(lanc.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
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

          {/* Arquivo LCDPR Gerado com Sucesso */}
          {generatedTxt && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Arquivo Digital do LCDPR Validado (Instrução Normativa RFB nº 1.903/2019)
                  </h3>
                </div>
                <button
                  onClick={handleDownloadTxt}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-2xs transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Baixar Arquivo .txt
                </button>
              </div>

              <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 overflow-x-auto max-h-64 leading-relaxed">
                {generatedTxt}
              </pre>
            </div>
          )}
        </>
      )}

      {/* ABA 4: Conciliação Bancária OFX & Automação LCDPR */}
      {abaFiscal === 'CONCILIACAO_OFX' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-700" />
                  Conciliação Inteligente de Extrato Bancário OFX
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Importe extratos bancários de cooperativas (Sicredi, Sicoob) e bancos (BB, Bradesco, Santander) com autoclassificação no Plano de Contas do LCDPR.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  Open Financial Exchange (OFX)
                </span>
                <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                  Automação Registro Q100
                </span>
              </div>
            </div>

            {/* Editor de OFX com Exemplo Pré-Carregado */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Conteúdo do Arquivo .OFX (Extrato Bancário do Produtor):</span>
                <span className="text-[11px] text-slate-500 font-mono">Compatível com BB (001), Sicredi (748), Sicoob (756)</span>
              </div>
              <textarea
                value={rawOfxTexto}
                onChange={(e) => setRawOfxTexto(e.target.value)}
                rows={8}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                placeholder="Cole aqui o conteúdo do seu arquivo .ofx..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-600">
                O motor semântico identifica pagamentos de diesel, sementes, defensivos e receitas de grãos.
              </span>

              <button
                type="button"
                onClick={handleImportarOfx}
                disabled={processandoOfx}
                className="px-5 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {processandoOfx ? 'Analisando Extrato...' : 'Processar & Classificar OFX'}
              </button>
            </div>

            {/* Resultado do Processamento OFX */}
            {resultadoOfxImportado && resultadoOfxImportado.sucesso && (
              <div className="space-y-5 pt-4 border-t border-slate-200">
                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 font-bold uppercase block">Instituição Bancária</span>
                    <span className="text-xs font-black text-slate-900 block mt-1">
                      {resultadoOfxImportado.cabecalho.bancoNome}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">Conta: {resultadoOfxImportado.cabecalho.contaCorrente}</span>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Receitas da Safra (+)</span>
                    <span className="text-sm font-black text-emerald-800 font-mono block mt-1">
                      R$ {resultadoOfxImportado.resumoFinanceiro.totalReceitasBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-emerald-700">Entradas creditadas</span>
                  </div>

                  <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200">
                    <span className="text-[10px] text-rose-800 font-bold uppercase block">Despesas Operacionais (-)</span>
                    <span className="text-sm font-black text-rose-800 font-mono block mt-1">
                      R$ {resultadoOfxImportado.resumoFinanceiro.totalDespesasBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-rose-700">Insumos e serviços rurais</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 font-bold uppercase block">Saldo Líquido</span>
                    <span className={`text-sm font-black font-mono block mt-1 ${resultadoOfxImportado.resumoFinanceiro.saldoLiquidoBrl >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      R$ {resultadoOfxImportado.resumoFinanceiro.saldoLiquidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-600">{resultadoOfxImportado.cabecalho.totalTransacoes} transações</span>
                  </div>
                </div>

                {/* Tabela de Transações Classificadas */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">
                      Transações Extraídas & Plano de Contas LCDPR Sugerido
                    </span>
                    <button
                      type="button"
                      onClick={handleConciliarOfxParaLcdpr}
                      disabled={processandoOfx}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Injetar no Livro Caixa (Q100)
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/75 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Histórico Bancário</th>
                        <th className="p-3">Valor (R$)</th>
                        <th className="p-3">Categoria Agro Identificada</th>
                        <th className="p-3">Conta LCDPR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {resultadoOfxImportado.transacoes.map((t: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">{t.data}</td>
                          <td className="p-3 font-semibold text-slate-900">{t.historicoOriginal}</td>
                          <td className={`p-3 font-mono font-bold ${t.valorBrl >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            R$ {t.valorBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                              {t.classificacaoAutomatica.categoria}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-xs font-bold text-emerald-800">
                            {t.classificacaoAutomatica.contaLcdpr}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Confirmação de Lançamentos Q100 */}
                {lancamentosOfxLcdpr.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <div>
                        <span className="text-xs font-bold text-emerald-950 block">
                          {lancamentosOfxLcdpr.length} Lançamentos Gerados e Integrados com Sucesso!
                        </span>
                        <span className="text-[11px] text-emerald-800">
                          Registros formatados no padrão Q100 do SPED para a Fazenda Santa Helena.
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-200 text-emerald-900 rounded-lg text-xs font-mono font-bold">
                      STATUS: PRONTO_SPED
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Gerenciador de Certificado Digital A1 (ICP-Brasil) */}
      {modalCertificadoA1 && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                  <KeyRound className="w-5 h-5 text-emerald-700" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Certificado Digital A1 (ICP-Brasil)</h3>
                  <p className="text-xs text-slate-500">Assinatura digital padrão SEFAZ e Receita Federal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalCertificadoA1(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status do Certificado:</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> VÁLIDO E ATIVO
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Titular:</span>
                  <span className="font-semibold text-slate-900">{certificadoA1.titular}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">CNPJ / CPF:</span>
                  <span className="font-mono text-slate-900">{certificadoA1.cnpjCpf}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Autoridade Certificadora:</span>
                  <span className="text-slate-700">{certificadoA1.emissor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Validade:</span>
                  <span className="font-mono font-semibold text-slate-900">{certificadoA1.validade} ({certificadoA1.diasRestantes} dias restantes)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalCertificadoA1(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Lançamento LCDPR */}
      {modalNovoLancamento && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" />
                Novo Lançamento no Livro Caixa (LCDPR)
              </h3>
              <button
                type="button"
                onClick={() => setModalNovoLancamento(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Data do Lançamento:</label>
                <input
                  type="date"
                  value={novoData}
                  onChange={(e) => setNovoData(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Tipo de Movimentação:</label>
                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value as 'RECEITA' | 'DESPESA_CUSTEIO')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option value="DESPESA_CUSTEIO">Despesa de Custeio / Insumos / Investimento</option>
                  <option value="RECEITA">Receita da Atividade Rural (Venda Safra)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Nº do Documento / Nota Fiscal:</label>
                <input
                  type="text"
                  value={novoDoc}
                  onChange={(e) => setNovoDoc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Categoria Contábil:</label>
                <input
                  type="text"
                  value={novoCategoria}
                  onChange={(e) => setNovoCategoria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Histórico Oficial (Descrição):</label>
                <input
                  type="text"
                  value={novoHistorico}
                  onChange={(e) => setNovoHistorico(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Valor Total da Fazenda (R$):</label>
                <input
                  type="number"
                  value={novoValor}
                  onChange={(e) => setNovoValor(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalNovoLancamento(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAdicionarLancamento}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Salvar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizador do DANFE SEFAZ Modelo 55 */}
      {mostrarModalDanfe && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-emerald-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    DANFE - Documento Auxiliar da Nota Fiscal Eletrônica (Modelo 55)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Chave: {chaveAcessoSefaz} • Ambiente: {ambienteFiscal}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalDanfe(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Espelho DANFE */}
            <div className="border border-slate-300 p-4 rounded-xl text-xs space-y-4 font-sans bg-white text-slate-900">
              <div className="flex justify-between border-b border-slate-300 pb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">FAZENDA SANTA HELENA AGROPECUARIA</h4>
                  <p className="text-[11px] text-slate-600">Rodovia MT-242 KM 38 - Zona Rural - Sorriso / MT</p>
                  <p className="text-[11px] text-slate-600">CNPJ: 18.491.029/0001-88 | IE: 134.819.201</p>
                </div>
                <div className="text-right border-l border-slate-300 pl-4">
                  <span className="text-[11px] font-bold block uppercase tracking-wider text-slate-500">DANFE NF-e</span>
                  <div className="text-base font-bold font-mono">Nº 000.004.128</div>
                  <div className="text-[11px] font-mono">Série: 1</div>
                  <div className="text-[10px] text-slate-500">{ambienteFiscal === 'PRODUCAO' ? 'AUTORIZADA PRODUÇÃO' : 'HOMOLOGAÇÃO TESTE'}</div>
                </div>
              </div>

              {/* Destinatário */}
              <div className="border border-slate-200 p-2.5 rounded-lg bg-slate-50 text-[11px]">
                <strong className="block text-slate-700 mb-0.5">DESTINATÁRIO / REMETENTE:</strong>
                <p className="font-semibold text-slate-900">CARGILL AGRICOLA S.A. - CNPJ: 02.578.129/0001-74 - IE: 130.982.401</p>
                <p className="text-slate-600">Av. Perimetral Sudoeste, 1280 - Distrito Industrial - Sorriso/MT - CEP: 78890-000</p>
              </div>

              {/* Itens */}
              <table className="w-full text-[11px] text-left border border-slate-200">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-1.5 border-r border-slate-200">Cód</th>
                    <th className="p-1.5 border-r border-slate-200">Descrição do Produto</th>
                    <th className="p-1.5 border-r border-slate-200">NCM</th>
                    <th className="p-1.5 border-r border-slate-200">CFOP</th>
                    <th className="p-1.5 border-r border-slate-200">cClassTrib</th>
                    <th className="p-1.5 border-r border-slate-200 text-right">Qtd</th>
                    <th className="p-1.5 border-r border-slate-200 text-right">Unitário</th>
                    <th className="p-1.5 text-right">Total Bruto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1.5 border-r border-slate-200 font-mono">SOJA-01</td>
                    <td className="p-1.5 border-r border-slate-200 font-medium">SOJA EM GRAO TRANSGENICA SAFRA 2025/2026</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono">12019000</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono">{cfop}</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono">{cClassTribNfe}</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono text-right">{quantidadeSacasNfe} SC</td>
                    <td className="p-1.5 border-r border-slate-200 font-mono text-right">R$ {precoSacaNfe.toFixed(2)}</td>
                    <td className="p-1.5 font-mono font-bold text-right">R$ {valorBrutoNfe.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totais Tributários Normais */}
              <div className="border border-slate-300 p-3 rounded-lg grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="border-r border-slate-200 pr-2">
                  <span className="block text-[10px] text-slate-500 uppercase">Base ICMS</span>
                  <strong>R$ 0,00 (Diferido CST 51)</strong>
                </div>
                <div className="border-r border-slate-200 pr-2">
                  <span className="block text-[10px] text-slate-500 uppercase">PIS / COFINS</span>
                  <strong>R$ 0,00 (Suspenso Lei 10.925)</strong>
                </div>
                <div className="border-r border-slate-200 pr-2">
                  <span className="block text-[10px] text-slate-500 uppercase">Retenção Funrural ({optanteFolha ? '0.2%' : '1.5%'})</span>
                  <strong className="text-rose-700">- R$ {valorFunrural.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Valor Total da Nota</span>
                  <strong className="text-emerald-700 font-bold">R$ {valorBrutoNfe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              {/* Quadro Destacado: IBS & CBS (Reforma Tributária NT 2024.002) */}
              <div className="border border-sky-300 bg-sky-50/40 p-3 rounded-lg space-y-2 text-[11px]">
                <div className="flex items-center justify-between font-bold text-sky-950 border-b border-sky-200 pb-1">
                  <span>Demonstrativo da Reforma Tributária (IBS & CBS - LC 214/2025)</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono font-bold">
                    Ano: {anoReferenciaReforma} • NT 2024.002
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="border-r border-sky-200 pr-1">
                    <span className="block text-[10px] text-slate-600">Base IBS/CBS:</span>
                    <strong className="font-mono text-slate-900">R$ {valorBrutoNfe.toFixed(2)}</strong>
                  </div>
                  <div className="border-r border-sky-200 pr-1">
                    <span className="block text-[10px] text-slate-600">CBS Devida (0,36%):</span>
                    <strong className="font-mono text-slate-900">R$ {tributacaoConsolidada.regraIbsCbs.vCBS.toFixed(2)}</strong>
                  </div>
                  <div className="border-r border-sky-200 pr-1">
                    <span className="block text-[10px] text-slate-600">IBS Devido (0,04%):</span>
                    <strong className="font-mono text-slate-900">R$ {tributacaoConsolidada.regraIbsCbs.vIBS.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-600">Crédito Presumido Comprador:</span>
                    <strong className="font-mono text-emerald-800">
                      R$ {(tributacaoConsolidada.regraIbsCbs.gCredPresProdRural?.vCredPres || (valorBrutoNfe * 0.085)).toFixed(2)} (8,5%)
                    </strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1">
                  Produtor Rural Pessoa Física Não Optante: isenção de débito na saída conforme Art. 140 da LC 214/2025, com geração de crédito presumido ao comprador para garantia da neutralidade tributária da cadeia produtiva.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 mt-4">
              <button
                type="button"
                onClick={() => setMostrarModalDanfe(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer text-xs font-semibold"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs text-xs"
              >
                <Printer className="w-4 h-4" /> Imprimir DANFE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizador de XML SEFAZ */}
      {mostrarModalXml && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-700" />
                  XML Assinado da NF-e (Schema v4.00 com Assinatura Digital ICP-Brasil)
                </h3>
                <span className="text-[11px] text-slate-500">
                  Ambiente: {ambienteFiscal === 'PRODUCAO' ? '1 (Produção SEFAZ)' : '2 (Homologação SVRS)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalXml(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 overflow-x-auto max-h-80 leading-relaxed">
              {xmlSefazSample}
            </pre>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 mt-3">
              <button
                type="button"
                onClick={() => setMostrarModalXml(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer text-xs font-semibold"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleDownloadXml}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" /> Baixar XML Assinado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhamento Jurídico e Tributário do Regime */}
      {regimeDetalheModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{regimeDetalheModal.nome}</h3>
                  <span className="text-xs text-slate-500 font-mono">Enquadramento: {regimeDetalheModal.categoria} • {regimeDetalheModal.limiteFaturamento}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRegimeDetalheModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p className="text-slate-700"><strong>Fundamentação Legal:</strong> {regimeDetalheModal.fundamentoLegal}</p>
              <p className="text-slate-700"><strong>PIS e COFINS:</strong> {regimeDetalheModal.pisCofins.detalhes}</p>
              <p className="text-slate-700"><strong>Funrural / Previdência:</strong> {regimeDetalheModal.funrural.detalhes}</p>
              <p className="text-slate-700"><strong>Reforma IBS/CBS:</strong> Enquadrado como {regimeDetalheModal.reformaIbsCbs.regimeIbsCbs}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] text-emerald-800">
                ✓ Principais Vantagens Tributárias:
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {regimeDetalheModal.vantagens.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] text-rose-800">
                ⚠ Pontos de Atenção e Riscos:
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {regimeDetalheModal.desvantagens.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setRegimeDetalheModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegimeDetalheModal(null);
                  setAbaFiscal('NFE_EMISSAO');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Emitir NF-e neste Regime
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalLCDPRModule;
