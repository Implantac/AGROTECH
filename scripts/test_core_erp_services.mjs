import assert from 'assert';

console.log('================================================================');
console.log('🧪 TESTE DE VALIDAÇÃO: MICROSSERVIÇOS CORE ERP SUPER AGTECH');
console.log('================================================================');

// 1. Teste do Custeio ABC
import { CusteioABCService } from '../services/core-erp/src/custeio-abc.service.ts';

const custeioService = new CusteioABCService();
const resultadoCusto = custeioService.calcularCustoOperacao({
  talhaoId: 'talhao-gleba-sul',
  areaTalhaoHectares: 250,
  horasTrabalhadas: 12.5,
  custoHoraMaquina: 320.0, // R$ 320/h (Trator + Pulverizador + Diesel)
  taxaHoraOperador: 48.0,  // R$ 48/h
  itensCalda: [
    {
      insumoId: 'ins-01',
      nomeInsumo: 'Fungicida Fox Xpro',
      categoria: 'DEFENSIVO',
      dosePorHectare: 0.5,
      custoMedioUnitario: 240.0 // R$ 120/ha
    },
    {
      insumoId: 'ins-02',
      nomeInsumo: 'Adjuvante Aureo',
      categoria: 'ADJUVANTE',
      dosePorHectare: 0.25,
      custoMedioUnitario: 36.0 // R$ 9/ha
    }
  ],
  precoPrevistoSacaVenda: 130.0 // R$ 130/saca
});

console.log('\n[1/5] Testando Custeio ABC...');
assert.strictEqual(resultadoCusto.custoTotalInsumos, 32250.0); // (250*0.5*240) + (250*0.25*36) = 30000 + 2250 = 32250
assert.strictEqual(resultadoCusto.custoTotalMaquina, 4000.0); // 12.5 * 320 = 4000
assert.strictEqual(resultadoCusto.custoTotalMaoDeObra, 600.0); // 12.5 * 48 = 600
assert.strictEqual(resultadoCusto.custoTotalOperacao, 36850.0); // 32250 + 4000 + 600
assert.strictEqual(resultadoCusto.custoPorHectare, 147.4); // 36850 / 250 = 147.40
assert.strictEqual(resultadoCusto.breakEvenSacasPorHectare, 1.13); // 147.4 / 130 = 1.13 sc/ha
console.log(`   ✓ Custo total R$ ${resultadoCusto.custoTotalOperacao.toFixed(2)} e Break-Even ${resultadoCusto.breakEvenSacasPorHectare} sc/ha calculados com precisão.`);

// 2. Teste do LCDPR com Rateio de Condomínio Familiar
import { LCDPRService } from '../services/core-erp/src/lcdpr.service.ts';

const lcdprService = new LCDPRService();
const txtLcdpr = lcdprService.gerarArquivoLCDPR(
  2026,
  {
    cpf: '123.456.789-00',
    nome: 'Carlos Eduardo Silva',
    percentualParticipacao: 60,
    titularPrincipal: true
  },
  [
    {
      codigoImovel: '001',
      nomeFazenda: 'Fazenda Santa Maria',
      numeroCar: 'MT-5107909-XXXXXXXX',
      municipioIbge: '5107909',
      uf: 'MT',
      tipoExploracao: '2' // Condomínio
    }
  ],
  [
    {
      codigoConta: '001',
      banco: '001',
      agencia: '1234',
      numeroConta: '56789-0'
    }
  ],
  [
    {
      cpf: '123.456.789-00',
      nome: 'Carlos Eduardo Silva',
      percentualParticipacao: 60,
      titularPrincipal: true
    },
    {
      cpf: '987.654.321-11',
      nome: 'Helena Maria Silva',
      percentualParticipacao: 40,
      titularPrincipal: false
    }
  ],
  [
    {
      data: '2026-03-15',
      codigoImovel: '001',
      codigoConta: '001',
      tipoDocumento: '1',
      numeroDocumento: '10542',
      historico: 'VENDA DE SOJA DISPONIVEL 5000 SC',
      cpfCnpjParticipante: '00.111.222/0001-33',
      tipoLancamento: '1', // Receita
      valorTotalOriginal: 650000.0 // R$ 650.000,00
    },
    {
      data: '2026-04-10',
      codigoImovel: '001',
      codigoConta: '001',
      tipoDocumento: '1',
      numeroDocumento: '4589',
      historico: 'AQUISICAO DE ADUBO NPK FERTILIZANTES',
      cpfCnpjParticipante: '33.222.111/0001-00',
      tipoLancamento: '2', // Despesa
      valorTotalOriginal: 200000.0 // R$ 200.000,00
    }
  ]
);

console.log('\n[2/5] Testando Geração do LCDPR com Rateio Societário...');
assert.ok(txtLcdpr.includes('0000|LCDPR|0013|12345678900|CARLOS EDUARDO SILVA'));
assert.ok(txtLcdpr.includes('0050|001|12345678900|CARLOS EDUARDO SILVA|6000'));
// 60% de R$ 650.000 = R$ 390.000,00 (39000000 centavos)
assert.ok(txtLcdpr.includes('000039000000|P|000039000000'));
// 60% de R$ 200.000 = R$ 120.000,00 (saldo acumulado R$ 390.000 - R$ 120.000 = R$ 270.000,00)
assert.ok(txtLcdpr.includes('000012000000|P|000027000000'));
assert.ok(txtLcdpr.includes('9999|CARLOS EDUARDO SILVA|12345678900|9'));
console.log('   ✓ Layout oficial RFB e rateio societário de 60% gerados e validados.');

// 3. Teste do Parser de NF-e & Custo Médio Ponderado Móvel
import { NFeParserAlmoxarifadoService } from '../services/core-erp/src/nfe-parser-almoxarifado.service.ts';

const nfeService = new NFeParserAlmoxarifadoService();
const xmlExemploNFe = `
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe51261000111222000133550010000105421888999994">
      <ide>
        <nNF>10542</nNF>
        <serie>1</serie>
        <dhEmi>2026-10-02T10:00:00-03:00</dhEmi>
      </ide>
      <emit>
        <CNPJ>00111222000133</CNPJ>
        <xNome>AGROQUIMICA DO CERRADO LTDA</xNome>
      </emit>
      <dest>
        <CPF>12345678900</CPF>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>GLIFO-480</cProd>
          <xProd>HERBICIDA GLIFOSATO 480 SL</xProd>
          <NCM>38089324</NCM>
          <CFOP>5102</CFOP>
          <uCom>L</uCom>
          <qCom>1000.0000</qCom>
          <vUnCom>42.0000</vUnCom>
          <vProd>42000.00</vProd>
          <vFrete>1500.00</vFrete>
          <vDesc>500.00</vDesc>
        </prod>
        <imposto>
          <IPI>
            <vIPI>1260.00</vIPI>
          </IPI>
        </imposto>
        <rastro>
          <nLote>LOTE-GLIFO-2026B</nLote>
          <dVal>2028-10-01</dVal>
        </rastro>
      </det>
      <total>
        <ICMSTot>
          <vNF>44260.00</vNF>
          <vFrete>1500.00</vFrete>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>
`;

console.log('\n[3/5] Testando Parser de NF-e da SEFAZ & Custo Médio Móvel...');
const dadosNFe = nfeService.parseXmlNFe(xmlExemploNFe);
assert.strictEqual(dadosNFe.chaveAcesso44, '51261000111222000133550010000105421888999994');
assert.strictEqual(dadosNFe.numeroNota, '10542');
assert.strictEqual(dadosNFe.itens.length, 1);
const itemNFe = dadosNFe.itens[0];
assert.strictEqual(itemNFe.quantidade, 1000);
assert.strictEqual(itemNFe.valorFreteRateado, 1500);
assert.strictEqual(itemNFe.valorIpiNaoRecuperavel, 1260);
assert.strictEqual(itemNFe.desconto, 500);
assert.strictEqual(itemNFe.numeroLote, 'LOTE-GLIFO-2026B');

// Recalcular estoque: 500L atuais a R$ 38,00/L + Entrada de 1.000L
// Valor efetivo da nota = 42000 + 1500 + 1260 - 500 = 44260 (R$ 44,26/L)
// Total acumulado = (500 * 38) + 44260 = 19000 + 44260 = 63260 para 1.500L = R$ 42,1733/L
const resultadoRecalculo = nfeService.calcularNovoCustoMedio(
  {
    insumoId: 'glifosato-480',
    quantidadeAtual: 500,
    custoMedioAtual: 38.0
  },
  itemNFe
);
assert.strictEqual(resultadoRecalculo.quantidadeNova, 1500);
assert.strictEqual(resultadoRecalculo.novoCustoMedioUnitario, 42.1733);
assert.strictEqual(resultadoRecalculo.impactoPatrimonialTotal, 63260.0);
console.log(`   ✓ XML parseado e Custo Médio recalculado com precisão: R$ 38,00 -> R$ ${resultadoRecalculo.novoCustoMedioUnitario}/L.`);

// 4. Teste do Emissor de NFP-e & Chave de Acesso Módulo 11
import { NFPeEmissorService } from '../services/core-erp/src/nfpe-emissor.service.ts';

const nfpeService = new NFPeEmissorService();

console.log('\n[4/5] Testando Emissor de NFP-e & Validação Módulo 11...');
const chaveBase43 = '5126100011122200013355001000010542188899999';
const dvCalculado = NFPeEmissorService.calcularDigitoModulo11(chaveBase43);
const chaveCompleta = `${chaveBase43}${dvCalculado}`;
assert.strictEqual(NFPeEmissorService.validarChaveAcesso44(chaveCompleta), true);
assert.strictEqual(NFPeEmissorService.validarChaveAcesso44(chaveBase43 + '0'), dvCalculado === 0);

// Testar Pré-Emissão com cálculo de Funrural
const preEmissao = nfpeService.processarPreEmissao({
  ufEmitenteCodigoIbge: '51',
  anoMesEmissao: '2610',
  cnpjCpfEmitente: '12345678900',
  modeloDocumento: '55',
  serie: '1',
  numeroNota: 10542,
  tipoEmissao: '1',
  codigoNumericoAleatorio: '88899999',
  opcaoTributacaoFunrural: 'RECEITA_BRUTA',
  destinatarioCpfCnpj: '00111222000133',
  destinatarioNome: 'CARGILL AGRICOLA S.A.',
  itens: [
    {
      numeroItem: 1,
      descricao: 'SOJA EM GRAO TRANSGENICA SAFRA 2026',
      ncm: '12019000',
      cfop: '5101',
      unidade: 'SC',
      quantidade: 1000,
      valorUnitario: 135.0,
      valorTotal: 135000.0
    }
  ]
});

assert.strictEqual(preEmissao.statusValidacao, 'APROVADO_PRE_EMISSAO');
assert.strictEqual(preEmissao.valorTotalBruto, 135000.0);
// Funrural 1.5% de R$ 135.000 = R$ 2.025,00
assert.strictEqual(preEmissao.valorFunruralRetido, 2025.0);
assert.strictEqual(preEmissao.valorLiquidoProdutor, 132975.0);
console.log(`   ✓ NFP-e pré-validada: Chave de 44 dígitos gerada com DV ${preEmissao.digitoVerificador} e retenção de Funrural R$ ${preEmissao.valorFunruralRetido.toFixed(2)}.`);

// 5. Teste da Zootecnia de Precisão & Bloqueio de Carência
import { ZootecniaPrecisaoService } from '../services/core-erp/src/zootecnia-precisao.service.ts';

const zooService = new ZootecniaPrecisaoService();

console.log('\n[5/5] Testando Zootecnia de Precisão & Bloqueio Sanitário...');
const animalTeste = {
  brincoVisual: 'BR-9840',
  rfidEletronico: '982000123456789',
  raca: 'Nelore Mocho',
  categoria: 'BOI_MAGRO',
  lotePastoId: 'confinamento-piquete-03',
  historicoPesagens: [
    { dataPesagem: '2026-07-01', pesoKg: 380.0 },
    { dataPesagem: '2026-10-01', pesoKg: 520.0 } // 92 dias: +140 kg = GMD de 1.522 kg/dia
  ],
  historicoSanitario: [
    {
      id: 'med-01',
      medicamento: 'Dectomax Injetável (Doramectina)',
      principioAtivo: 'Doramectina 1%',
      dataAplicacao: '2026-09-20',
      carenciaDiasAbate: 35, // Carência legal: 35 dias -> Liberação em 2026-10-25
      loteMedicamento: 'LOTE-DEC-88',
      responsavelTecnicoCrmv: 'CRMV-MT 4589'
    }
  ]
};

// Teste 1: Na data atual (2026-10-02), o animal tem apenas 12 dias de aplicação e ainda está sob carência!
const desempenhoBloqueado = zooService.calcularDesempenho(
  animalTeste,
  new Date('2026-10-02T12:00:00Z'),
  54.0 // 54% rendimento de carcaça
);

assert.strictEqual(desempenhoBloqueado.pesoAtualKg, 520.0);
assert.strictEqual(desempenhoBloqueado.ganhoTotalKg, 140.0);
assert.strictEqual(desempenhoBloqueado.gmdKgPorDia, 1.522);
// 520 kg * 0.54 / 15 = 18.72 @
assert.strictEqual(desempenhoBloqueado.projecaoArrobasLiquidas, 18.72);
assert.strictEqual(desempenhoBloqueado.statusSanitario.emCarencia, true);
assert.strictEqual(desempenhoBloqueado.statusSanitario.diasRestantesMaximo, 23); // 35 - 12 = 23 dias
assert.strictEqual(desempenhoBloqueado.aptoParaAbate, false); // Bloqueado sanitariamente!
console.log(`   ✓ Animal de 520 kg (+1.522 kg/dia GMD) bloqueado para abate devido a 23 dias restantes de carência sanitária.`);

// Teste 2: Após 2026-10-25, o período de carência é superado e o animal é liberado
const desempenhoLiberado = zooService.calcularDesempenho(
  animalTeste,
  new Date('2026-10-26T12:00:00Z'),
  54.0
);
assert.strictEqual(desempenhoLiberado.statusSanitario.emCarencia, false);
assert.strictEqual(desempenhoLiberado.aptoParaAbate, true);
console.log('   ✓ Animal automaticamente liberado para abate após o decurso do período regulamentar MAPA.');

// 6. Teste de Barter & CPR Valuation (Lei 13.986/2020)
import { BarterCPRValuationService } from '../services/core-erp/src/barter-cpr.service.ts';

const barterService = new BarterCPRValuationService();

console.log('\n[6/7] Testando Barter & Paridade de Exportação (Nova Lei do Agro)...');
const paridade = barterService.calcularParidadeExportacao({
  precoCbotUsdPorBushel: 11.83,
  taxaCambioPtaxBacen: 5.4150,
  premioFobUsdPorBushel: 0.45,
  custoFreteInteriorPorSaca: 14.50,
  despesasElevacaoPortuariaPorSaca: 3.20,
  impostosTaxasPorSaca: 0.85
});

assert.strictEqual(paridade.precoFobUsdPorBushel, 12.28);
assert.strictEqual(paridade.custoLogisticaTotalPorSaca, 18.55);
assert.ok(paridade.precoFobReaisPorSaca > 140.0);
assert.ok(paridade.paridadeFazendaLiquidaPorSaca > 120.0);

const avaliacaoBarter = barterService.avaliarContratoBarter({
  numeroContrato: 'BARTER-2026-SOJA-01',
  compradorOuTrading: 'CARGILL AGRÍCOLA S.A.',
  pacoteInsumos: {
    id: 'pct-adubo-01',
    descricao: 'Adubação NPK YaraBela 500 ton',
    valorTotalReais: 2430000.0 // R$ 2.430.000,00
  },
  precoTravadoSaca: 135.0, // R$ 135/sc
  margemSegurancaPct: 10,
  areaPenhorHectares: 800,
  produtividadeEsperadaSacasHa: 68
});

assert.strictEqual(avaliacaoBarter.sacasComprometidas, 18000.0); // 2430000 / 135 = 18000
assert.strictEqual(avaliacaoBarter.sacasComMargemGarantia, 19800.0); // 18000 * 1.10 = 19800
assert.strictEqual(avaliacaoBarter.volumeTotalKg, 1080000); // 18000 * 60 = 1080000 kg
assert.strictEqual(avaliacaoBarter.volumeProducaoTotalEsperadoSacas, 54400); // 800 * 68 = 54400
assert.strictEqual(avaliacaoBarter.percentualSafraComprometido, 33.1); // 18000 / 54400 = 33.1%
assert.strictEqual(avaliacaoBarter.statusRiscoBarter, 'SEGURO'); // < 35% comprometido
console.log(`   ✓ Paridade de exportação e contrato Barter avaliados: ${avaliacaoBarter.sacasComprometidas} sacas para R$ 2,43M de insumos (Risco: ${avaliacaoBarter.statusRiscoBarter}).`);

// 7. Teste de Frete Rodoviário Agrícola & Piso Mínimo ANTT (Lei 13.703/2018)
import { FreteRodoviarioANTTService } from '../services/core-erp/src/frete-antt.service.ts';

const freteService = new FreteRodoviarioANTTService();

console.log('\n[7/7] Testando Frete Rodoviário Agrícola & Piso Mínimo ANTT...');
const freteRodotrem = freteService.calcularPisoMinimoFrete({
  tipoVeiculo: 'RODOTREM_9_EIXOS',
  distanciaKm: 850,
  pesoCargaToneladas: 48.5,
  valorPedagioTotal: 420.0,
  tipoCarga: 'GRANEL_SOLIDO',
  retornoVazio: false
});

// Deslocamento: 850 * 10.45 = 8882.50
// Fixo carga/descarga: 820.00
// Pedágio: 420.00
// Total: 8882.50 + 820.00 + 420.00 = 10122.50
assert.strictEqual(freteRodotrem.quantidadeEixos, 9);
assert.strictEqual(freteRodotrem.custoTransporteBruto, 9702.50);
assert.strictEqual(freteRodotrem.valorTotalMinimoFrete, 10122.50);
assert.strictEqual(freteRodotrem.custoPorTonelada, 208.71); // 10122.50 / 48.5 = 208.71
assert.strictEqual(freteRodotrem.custoPorSaca60kg, 12.52); // R$ 12.52 / saca

// Validar se proposta abaixo do piso é devidamente reprovada
const validacaoAbaixo = freteService.validarTarifaProposta({
  tipoVeiculo: 'RODOTREM_9_EIXOS',
  distanciaKm: 850,
  pesoCargaToneladas: 48.5,
  valorPedagioTotal: 420.0,
  tipoCarga: 'GRANEL_SOLIDO'
}, 8500.0);
assert.strictEqual(validacaoAbaixo.aprovado, false);

// Validar se proposta acima do piso é aprovada
const validacaoAcima = freteService.validarTarifaProposta({
  tipoVeiculo: 'RODOTREM_9_EIXOS',
  distanciaKm: 850,
  pesoCargaToneladas: 48.5,
  valorPedagioTotal: 420.0,
  tipoCarga: 'GRANEL_SOLIDO'
}, 11500.0);
assert.strictEqual(validacaoAcima.aprovado, true);
console.log(`   ✓ Piso mínimo ANTT calculado: R$ ${freteRodotrem.valorTotalMinimoFrete.toFixed(2)} (R$ ${freteRodotrem.custoPorSaca60kg}/saca) com validação de conformidade legal.`);

console.log('\n================================================================');
console.log('🎉 TODOS OS 7 MICROSSERVIÇOS CORE ERP FORAM VALIDADOS COM SUCESSO!');
console.log('================================================================');
