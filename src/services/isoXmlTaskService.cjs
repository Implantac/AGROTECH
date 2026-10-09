/**
 * AGROTECH ENTERPRISE - GERADOR DE PRESCRIÇÃO EM TAXA VARIÁVEL ISO-XML (ISO 11783-10)
 * Padrão internacional ISOBUS Task Controller (TC-BAS / TC-GEO / TC-SC)
 * Compatível com monitores de cabine:
 * - John Deere CommandCenter Gen4 / 4600 / G5
 * - Trimble GFX-750 / TMX-2050
 * - Case IH AFS Pro 700 / Pro 1200
 * - Ag Leader InCommand / New Holland IntelliView
 * - Jacto Omni 700 / Stara Topper 5500
 */

const fs = require('fs');
const path = require('path');

/**
 * Constrói o documento TASKDATA.XML segundo o padrão ISO 11783-10
 */
function gerarIsoXmlTaskData({
  taskId = `TSK-${Date.now()}`,
  taskDesignator = 'APLICACAO_ADUBO_TAXA_VARIAVEL_SAFRA_2026',
  farmName = 'FAZENDA SANTA HELENA',
  growerName = 'SCHNEIDER AGRICULTURA E PECUARIA LTDA',
  fieldId = 'TAL-01',
  fieldName = 'Talhão 01 - Pivô Norte',
  areaHa = 420.5,
  tipoOperacao = 'FERTILIZACAO_TAXA_VARIAVEL',
  produto = {
    codigo: 'ADU-MAP-01',
    nome: 'FOSFATO MONOAMONICO (MAP 11-52-00)',
    unidade: 'kg/ha'
  },
  zonasTaxaVariavel = [
    { zona: 1, descricao: 'Baixo Vigor / Alta Exigência P2O5', doseKgHa: 220.0, percentualArea: 25 },
    { zona: 2, descricao: 'Vigor Médio / Exigência Padrão', doseKgHa: 160.0, percentualArea: 50 },
    { zona: 3, descricao: 'Alto Vigor / Manutenção Residual', doseKgHa: 100.0, percentualArea: 25 }
  ],
  coordenadasBbox = {
    minLat: -12.5621,
    minLng: -55.7198,
    maxLat: -12.5482,
    maxLng: -55.7021
  }
}) {
  const dataGeracao = new Date().toISOString().split('T')[0];
  const horaGeracao = new Date().toISOString().split('T')[1].split('.')[0];

  // Cálculo da dose média e consumo total estimado
  const doseMediaKgHa = Number(
    zonasTaxaVariavel.reduce((acc, z) => acc + (z.doseKgHa * (z.percentualArea / 100)), 0).toFixed(1)
  );
  const consumoTotalEstimadoKg = Number((doseMediaKgHa * areaHa).toFixed(0));

  // Geração do XML ISO 11783-10 Schema V4
  const xmlTaskData = `<?xml version="1.0" encoding="UTF-8"?>
<!-- AGROTECH ISO 11783-10 (ISOBUS Task Controller XML) -->
<ISO11783_TaskData VersionMajor="4" VersionMinor="0" ManagementSoftwareManufacturer="AGROTECH_ENTERPRISE" ManagementSoftwareVersion="9.5.1" DataTransferLogo="1">
  <!-- Produtor Rural (Grower / Customer) -->
  <CTR A="CTR1" B="${growerName}" C="RODOVIA BR-163 KM 742" D="SORRISO" E="MT" G="BRASIL" />
  
  <!-- Fazenda (Farm) -->
  <FRM A="FRM1" B="${farmName}" I="CTR1" />
  
  <!-- Talhão Georreferenciado (Partfield) -->
  <PFD A="PFD1" B="${fieldName}" C="${Math.round(areaHa * 10000)}" D="FRM1">
    <!-- Limites do talhão para o GPS da máquina -->
    <PLN A="1">
      <LSG A="1">
        <PNT A="1" C="${coordenadasBbox.minLat}" D="${coordenadasBbox.minLng}" />
        <PNT A="2" C="${coordenadasBbox.maxLat}" D="${coordenadasBbox.minLng}" />
        <PNT A="3" C="${coordenadasBbox.maxLat}" D="${coordenadasBbox.maxLng}" />
        <PNT A="4" C="${coordenadasBbox.minLat}" D="${coordenadasBbox.maxLng}" />
        <PNT A="5" C="${coordenadasBbox.minLat}" D="${coordenadasBbox.minLng}" />
      </LSG>
    </PLN>
  </PFD>
  
  <!-- Produto Aplicado (Fertilizante / Semente / Calda) -->
  <PDT A="PDT1" B="${produto.nome}" C="1" G="${produto.codigo}" />
  
  <!-- Tarefa Operacional para a controladora do implemento -->
  <TSK A="TSK1" B="${taskDesignator}" E="PFD1" G="1">
    <!-- Grid de Taxa Variável (Grid Type 1 = Prescrição Rasterizada) -->
    <GRD A="${coordenadasBbox.minLat}" B="${coordenadasBbox.minLng}" C="0.000100" D="0.000100" E="20" F="20" G="GRD00001.BIN" H="1" />
    
    <!-- Alocação de Produto e Faixas de Taxa de Aplicação -->
    <PAN A="PDT1">
      <ASP A="1">
${zonasTaxaVariavel.map((z, idx) => `        <!-- Zona ${z.zona}: ${z.descricao} -->
        <TZN A="${idx + 1}" B="${z.doseKgHa.toFixed(2)}" />`).join('\n')}
      </ASP>
    </PAN>
  </TSK>
</ISO11783_TaskData>`;

  return {
    sucesso: true,
    padrao: 'ISO 11783-10:2015 (ISOBUS TaskData V4)',
    taskId,
    taskDesignator,
    fieldId,
    fieldName,
    areaHa,
    produto: produto.nome,
    unidade: produto.unidade,
    doseMediaKgHa,
    consumoTotalEstimadoKg,
    zonas: zonasTaxaVariavel,
    nomeArquivoIsoXml: 'TASKDATA.XML',
    conteudoXml: xmlTaskData,
    instrucoesPendriveGps: [
      '1. Crie uma pasta chamada "TASKDATA" na raiz de um pendrive formatado em FAT32.',
      '2. Salve este arquivo como "TASKDATA.XML" dentro da pasta.',
      '3. Conecte o pendrive na porta USB do monitor (John Deere Gen4, Trimble GFX ou Case Pro).',
      '4. Acesse "Gerenciador de Arquivos" -> "Importar Tarefa ISOBUS" -> Confirmar.'
    ],
    geradoEm: `${dataGeracao}T${horaGeracao}Z`
  };
}

module.exports = {
  gerarIsoXmlTaskData
};
