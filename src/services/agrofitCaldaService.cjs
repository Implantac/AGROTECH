/**
 * AGROTECH ENTERPRISE - SERVIÇO DE COMPATIBILIDADE DE CALDA & AGROFIT / MAPA
 * Bula de defensivos agrícolas, ordem de adição no tanque e auditoria de LMR / Carência.
 */

// Catálogo técnico de defensivos homologados no Ministério da Agricultura (MAPA / AGROFIT)
const CATALOGO_AGROFIT = [
  {
    registroMapa: '001908',
    nomeComercial: 'Fungicida Triazol + Estrobirulina Pro',
    ingredienteAtivo: 'Trifloxistrobina (150 g/L) + Protioconazol (175 g/L)',
    classeAgronomica: 'Fungicida Sistêmico',
    grupoQuimico: 'Estrobirulina + Triazolintoina',
    formulacao: 'SC', // Suspensão Concentrada
    alvosControlados: ['Ferrugem-asiática (Phakopsora pachyrhizi)', 'Mancha-alvo (Corynespora cassiicola)', 'Cercóspora'],
    doseRecomendadaPorHa: '0.4 L/ha',
    volumeCaldaLPorHa: '100 a 150 L/ha',
    intervaloSegurancaDias: 30, // Carência para colheita
    phCaldaIdeal: { min: 5.0, max: 6.5 },
    toxicidade: 'Classe 4 (Pouco Tóxico - Faixa Azul)'
  },
  {
    registroMapa: '003298',
    nomeComercial: 'Inseticida Diamida Premium',
    ingredienteAtivo: 'Clorantraniliprole (200 g/L)',
    classeAgronomica: 'Inseticida de Ingestão e Contato',
    grupoQuimico: 'Diamida Antranílica',
    formulacao: 'SC',
    alvosControlados: ['Lagarta-do-cartucho (Spodoptera frugiperda)', 'Lagarta-falsa-medideira (Chrysodeixis includens)', 'Helicoverpa'],
    doseRecomendadaPorHa: '0.1 L/ha',
    volumeCaldaLPorHa: '80 a 120 L/ha',
    intervaloSegurancaDias: 21,
    phCaldaIdeal: { min: 5.5, max: 7.0 },
    toxicidade: 'Classe 5 (Improvável Causar Dano Agudo)'
  },
  {
    registroMapa: '007812',
    nomeComercial: 'Herbicida Glifosato 720 WG',
    ingredienteAtivo: 'Glifosato Sal de Amônio (720 g/kg)',
    classeAgronomica: 'Herbicida Sistêmico Não Seletivo',
    grupoQuimico: 'Glicina Substituída',
    formulacao: 'WG', // Grânulos Dispersíveis em Água
    alvosControlados: ['Capim-amargoso (Digitaria insularis)', 'Buva (Conyza spp.)', 'Caruru'],
    doseRecomendadaPorHa: '2.0 kg/ha',
    volumeCaldaLPorHa: '100 a 200 L/ha',
    intervaloSegurancaDias: 14,
    phCaldaIdeal: { min: 4.0, max: 5.5 },
    toxicidade: 'Classe 4'
  },
  {
    registroMapa: '005420',
    nomeComercial: 'Adjuvante Siliconado e Antideriva',
    ingredienteAtivo: 'Poliéter Polimetilsiloxano Copolímero',
    classeAgronomica: 'Adjuvante Quebrador de Tensão Superficial',
    grupoQuimico: 'Organossilicone',
    formulacao: 'SL', // Concentrado Solúvel
    alvosControlados: ['Espalhamento de gota', 'Penetração estomática', 'Antideriva'],
    doseRecomendadaPorHa: '0.05 L/ha',
    volumeCaldaLPorHa: 'Qualquer volume',
    intervaloSegurancaDias: 0,
    phCaldaIdeal: { min: 4.0, max: 7.5 },
    toxicidade: 'Classe 5'
  },
  {
    registroMapa: '008915',
    nomeComercial: 'Óleo Metilado de Soja',
    ingredienteAtivo: 'Ésteres Metílicos de Ácidos Graxos de Soja (720 g/L)',
    classeAgronomica: 'Adjuvante Protetor de Gota',
    grupoQuimico: 'Óleo Vegetal Metilado',
    formulacao: 'EC', // Concentrado Emulsionável
    alvosControlados: ['Redução de evaporação em Delta T elevado'],
    doseRecomendadaPorHa: '0.5 L/ha',
    volumeCaldaLPorHa: 'Qualquer volume',
    intervaloSegurancaDias: 0,
    phCaldaIdeal: { min: 5.0, max: 7.0 },
    toxicidade: 'Classe 5'
  }
];

// Ordem técnica de preparo de calda (Norma D.A.L.E. / A.L.E.S.P. consagrada pela Embrapa e Sindiveg)
const HIERARQUIA_FORMULACOES = {
  'WP': { ordem: 1, grupo: 'Pós Molháveis e Hidrossolúveis', descricao: 'Pré-misturar e diluir primeiro em 50% de água no tanque' },
  'WG': { ordem: 2, grupo: 'Grânulos Dispersíveis em Água', descricao: 'Adicionar com boa agitação para dispersão mecânica' },
  'DF': { ordem: 3, grupo: 'Grânulos Fluidos Secos', descricao: 'Agitação constante no agitador hidráulico do pulverizador' },
  'SC': { ordem: 4, grupo: 'Suspensões Concentradas', descricao: 'Líquidos particulados densos, nunca misturar direto com óleos puros' },
  'SL': { ordem: 5, grupo: 'Concentrados Solúveis / Soluções Líquidas', descricao: 'Solúveis em água, mexer vigorosamente' },
  'EC': { ordem: 6, grupo: 'Concentrados Emulsionáveis', descricao: 'Formam emulsão leitosa em água, adicionar perto do fim' },
  'EW': { ordem: 7, grupo: 'Emulsão Óleo em Água', descricao: 'Adicionar após formulações aquosas' },
  'ADJ': { ordem: 8, grupo: 'Adjuvantes e Espalhantes', descricao: 'Penúltimo passo, para não gerar excesso de espuma' },
  'OLEO': { ordem: 9, grupo: 'Óleos Vegetais / Minerais', descricao: 'Último componente antes de completar o volume total de água' }
};

/**
 * Calcula e gera a Ordem Oficial de Mistura de Calda para o pulverizador
 */
function calcularOrdemTanque(itensCalda = []) {
  if (!itensCalda || itensCalda.length === 0) {
    itensCalda = [
      { nome: 'Glifosato 720 WG', formulacao: 'WG', dosePorHa: '2.0 kg/ha' },
      { nome: 'Fungicida Protioconazol', formulacao: 'SC', dosePorHa: '0.4 L/ha' },
      { nome: 'Inseticida Diamida', formulacao: 'SC', dosePorHa: '0.1 L/ha' },
      { nome: 'Adjuvante Siliconado', formulacao: 'SL', dosePorHa: '0.05 L/ha' },
      { nome: 'Óleo Metilado de Soja', formulacao: 'EC', dosePorHa: '0.5 L/ha' }
    ];
  }

  const itensOrdenados = itensCalda.map(item => {
    const fUpper = (item.formulacao || 'SC').toUpperCase();
    const config = HIERARQUIA_FORMULACOES[fUpper] || { ordem: 5, grupo: 'Outras Formulações', descricao: 'Adicionar com agitação normal' };
    return {
      ...item,
      ordemPrioridade: config.ordem,
      grupoFormulacao: config.grupo,
      recomendacaoPreparo: config.descricao
    };
  }).sort((a, b) => a.ordemPrioridade - b.ordemPrioridade);

  // Verificação de incompatibilidade química (ex: Glifosato com calda alcalina ou óleo antes de pó)
  const alertasCompatibilidade = [];
  const temGlyphosate = itensCalda.some(i => (i.nome || '').toLowerCase().includes('glifosato'));
  const temCobreOuCalcio = itensCalda.some(i => (i.nome || '').toLowerCase().match(/cobre|cálcio|calcio/));
  
  if (temGlyphosate && temCobreOuCalcio) {
    alertasCompatibilidade.push({
      nivel: 'CRITICO',
      tipo: 'INCOMPATIBILIDADE_QUIMICA',
      mensagem: 'Glifosato quelatiza com íons Cobre/Cálcio, reduzindo drasticamente a eficácia do herbicida. Usar tanques separados ou condicionador de água sulfato de amônio.'
    });
  }

  return {
    sucesso: true,
    metodologia: 'Protocolo D.A.L.E. / Sindiveg & Embrapa Soja',
    totalPassos: itensOrdenados.length + 2,
    passoAPasso: [
      {
        passo: 1,
        acao: 'Abastecer 50% a 70% do reservatório com água limpa e ligar agitação contínua.',
        tipo: 'AGUA_BASE'
      },
      ...itensOrdenados.map((item, idx) => ({
        passo: idx + 2,
        produto: item.nome,
        formulacao: item.formulacao,
        dosePorHa: item.dosePorHa,
        acao: `Adicionar [${item.formulacao}] ${item.nome} (${item.grupoFormulacao}). ${item.recomendacaoPreparo}`,
        tipo: 'INJECAO_PRODUTO'
      })),
      {
        passo: itensOrdenados.length + 2,
        acao: 'Completar o volume restante do tanque com água mantendo a agitação ligada até o fim da aplicação em campo.',
        tipo: 'COMPLETAR_TANQUE'
      }
    ],
    alertasCompatibilidade,
    phRecomendadoCalda: 'Entre 5.0 e 6.0 (usar redutor de pH se a água do poço estiver alcalina)'
  };
}

/**
 * Validação de Período de Carência (Limite Máximo de Resíduos - LMR) para colheita
 */
function validarCarenciaColheita({ cultura, dataAplicacao, dataPrevisaoColheita, produtosAplicados = [] }) {
  const dAplic = new Date(dataAplicacao || new Date().toISOString());
  const dColheita = new Date(dataPrevisaoColheita || new Date(Date.now() + 35 * 86400000).toISOString());
  const diasEntreAplicacaoEColheita = Math.floor((dColheita - dAplic) / (1000 * 60 * 60 * 24));

  const relatorioProdutos = produtosAplicados.map(prod => {
    const agrofitRef = CATALOGO_AGROFIT.find(c => c.nomeComercial.toLowerCase().includes(prod.nome?.toLowerCase()) || c.ingredienteAtivo.toLowerCase().includes(prod.ingredienteAtivo?.toLowerCase())) || {
      intervaloSegurancaDias: prod.intervaloSegurancaDias || 21,
      toxicidade: 'Classe 4'
    };

    const carenciaExigida = agrofitRef.intervaloSegurancaDias;
    const aprovado = diasEntreAplicacaoEColheita >= carenciaExigida;

    return {
      produto: prod.nome,
      ingredienteAtivo: prod.ingredienteAtivo || agrofitRef.ingredienteAtivo,
      carenciaDiasExigida: carenciaExigida,
      diasAteColheita: diasEntreAplicacaoEColheita,
      statusCarencia: aprovado ? 'CONFORME_LMR_LIBERADO' : 'BLOQUEADO_CARENCIA_ATIVA',
      diasFaltantesParaLiberacao: aprovado ? 0 : carenciaExigida - diasEntreAplicacaoEColheita
    };
  });

  const todosAprovados = relatorioProdutos.every(r => r.statusCarencia === 'CONFORME_LMR_LIBERADO');

  return {
    sucesso: true,
    cultura: cultura || 'Soja em Grãos',
    diasAteColheita: diasEntreAplicacaoEColheita,
    aptoParaColheita: todosAprovados,
    statusLmr: todosAprovados ? 'LMR_CONFORME_EXPORTACAO_LIBERADA' : 'RISCO_RESIDUO_CARENCIA_NAO_ATINGIDA',
    produtos: relatorioProdutos
  };
}

module.exports = {
  CATALOGO_AGROFIT,
  calcularOrdemTanque,
  validarCarenciaColheita
};
