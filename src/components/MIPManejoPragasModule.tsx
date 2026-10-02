import React, { useState } from 'react';
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Layers,
  MapPin,
  TrendingUp,
  FileCheck,
  Search,
  Sparkles,
  ShieldAlert,
  Flame,
  Calendar,
  UserCheck
} from 'lucide-react';
import { TALHOES_INICIAIS, TalhaoData } from '../data/mockAgroData';

export interface AmostragemMIP {
  id: string;
  talhaoId: string;
  pontoNome: string;
  coordenadas: [number, number];
  dataAmostragem: string;
  avaliador: string;
  estadioFenologico: string;
  cultura: string;
  alvoPraga: string;
  alvoCientifico: string;
  metodoAmostragem: 'PANO_DE_BATIDA' | 'DESFOLHA_PCT' | 'CONTAGEM_VISUAL' | 'ARMADILHA_DELTA';
  valorEncontrado: number; // ex: 2.8 percevejos/m, ou 18% desfolha
  unidadeMedida: string;
  ndeReferencia: number; // Nível de Dano Econômico
  nivelAcao: number; // Gatilho de pulverização preventiva
  status: 'NORMAL' | 'ATENCAO' | 'CRITICO';
  recomendacaoQuimica: string;
  principioAtivoSugerido: string;
  doseSugerida: string;
  carenciaDias: number;
}

const AMOSTRAGENS_INICIAIS: AmostragemMIP[] = [
  {
    id: 'mip-01',
    talhaoId: 'talhao-02',
    pontoNome: 'Ponto P-04 (Bordadura Leste)',
    coordenadas: [-12.545, -55.705],
    dataAmostragem: '2026-09-24',
    avaliador: 'Eng. Agr. Lucas Zanetti (CREA-MT)',
    estadioFenologico: 'R5.1 (Início do Enchimento de Grãos)',
    cultura: 'Soja BMX Desafio',
    alvoPraga: 'Percevejo-marrom',
    alvoCientifico: 'Euschistus heros',
    metodoAmostragem: 'PANO_DE_BATIDA',
    valorEncontrado: 2.8,
    unidadeMedida: 'insetos/metro',
    ndeReferencia: 2.0,
    nivelAcao: 1.7,
    status: 'CRITICO',
    recomendacaoQuimica: 'Engeo Pleno S + Óleo Adjuvante Nimbus',
    principioAtivoSugerido: 'Tiametoxam + Lambda-cialotrina',
    doseSugerida: '0.25 L/ha',
    carenciaDias: 21,
  },
  {
    id: 'mip-02',
    talhaoId: 'talhao-04',
    pontoNome: 'Ponto P-02 (Centro Talhão)',
    coordenadas: [-12.562, -55.708],
    dataAmostragem: '2026-09-25',
    avaliador: 'Téc. Agrícola Rafael Souza',
    estadioFenologico: 'V6 (Desenvolvimento Vegetativo)',
    cultura: 'Soja Monsoy 5947',
    alvoPraga: 'Lagarta-falsa-medideira',
    alvoCientifico: 'Chrysodeixis includens',
    metodoAmostragem: 'DESFOLHA_PCT',
    valorEncontrado: 18.0,
    unidadeMedida: '% desfolha',
    ndeReferencia: 30.0,
    nivelAcao: 20.0,
    status: 'ATENCAO',
    recomendacaoQuimica: 'Intrepid Edge / Dipel Biológico',
    principioAtivoSugerido: 'Metoxifenozida + Espinetoram',
    doseSugerida: '0.15 L/ha',
    carenciaDias: 14,
  },
  {
    id: 'mip-03',
    talhaoId: 'talhao-01',
    pontoNome: 'Ponto P-01 (Cabeceira Norte)',
    coordenadas: [-12.544, -55.720],
    dataAmostragem: '2026-09-23',
    avaliador: 'Eng. Agr. Lucas Zanetti (CREA-MT)',
    estadioFenologico: 'R4 (Vagens Formadas)',
    cultura: 'Soja Monsoy 5947',
    alvoPraga: 'Ferrugem Asiática',
    alvoCientifico: 'Phakopsora pachyrhizi',
    metodoAmostragem: 'CONTAGEM_VISUAL',
    valorEncontrado: 0.0,
    unidadeMedida: 'urédias/cm²',
    ndeReferencia: 0.1,
    nivelAcao: 0.05,
    status: 'NORMAL',
    recomendacaoQuimica: 'Prevenção com Fox Xpro no fechamento',
    principioAtivoSugerido: 'Trifloxistrobina + Protioconazol + Bixafen',
    doseSugerida: '0.50 L/ha',
    carenciaDias: 30,
  },
  {
    id: 'mip-04',
    talhaoId: 'talhao-05',
    pontoNome: 'Ponto P-03 (Baixada do Córrego)',
    coordenadas: [-12.572, -55.722],
    dataAmostragem: '2026-09-24',
    avaliador: 'Téc. Agrícola Rafael Souza',
    estadioFenologico: 'V4 (Milho Safrinha)',
    cultura: 'Milho KWS 9010',
    alvoPraga: 'Lagarta-do-cartucho',
    alvoCientifico: 'Spodoptera frugiperda',
    metodoAmostragem: 'CONTAGEM_VISUAL',
    valorEncontrado: 22.0,
    unidadeMedida: '% plantas com raspagem Davis ≥ 3',
    ndeReferencia: 20.0,
    nivelAcao: 15.0,
    status: 'CRITICO',
    recomendacaoQuimica: 'Prêmio 200 SC + Tracer',
    principioAtivoSugerido: 'Clorantraniliprole',
    doseSugerida: '0.10 L/ha',
    carenciaDias: 14,
  },
  {
    id: 'mip-05',
    talhaoId: 'talhao-03',
    pontoNome: 'Ponto P-05 (Raio Pivô 01)',
    coordenadas: [-12.560, -55.722],
    dataAmostragem: '2026-09-25',
    avaliador: 'Eng. Agr. Lucas Zanetti (CREA-MT)',
    estadioFenologico: 'V5',
    cultura: 'Soja TMG 2381',
    alvoPraga: 'Mosca-branca',
    alvoCientifico: 'Bemisia tabaci',
    metodoAmostragem: 'CONTAGEM_VISUAL',
    valorEncontrado: 3.5,
    unidadeMedida: 'ninfas/folíolo',
    ndeReferencia: 10.0,
    nivelAcao: 6.0,
    status: 'NORMAL',
    recomendacaoQuimica: 'Monitoramento semanal; população estável',
    principioAtivoSugerido: 'Piriproxifem (se atingir 6 ninfas)',
    doseSugerida: '0.40 L/ha',
    carenciaDias: 21,
  },
];

export const MIPManejoPragasModule: React.FC = () => {
  const [amostragens, setAmostragens] = useState<AmostragemMIP[]>(AMOSTRAGENS_INICIAIS);
  const [talhaoFiltro, setTalhaoFiltro] = useState<string>('TODOS');
  const [statusFiltro, setStatusFiltro] = useState<string>('TODOS');
  const [mostrarModalNova, setMostrarModalNova] = useState<boolean>(false);
  const [notificacaoSucesso, setNotificacaoSucesso] = useState<string | null>(null);

  // Estados da Calculadora de NDE
  const [calcCustoControle, setCalcCustoControle] = useState<number>(85.0); // R$/ha
  const [calcPrecoSaca, setCalcPrecoSaca] = useState<number>(130.0); // R$/sc
  const [calcProdutividade, setCalcProdutividade] = useState<number>(65.0); // sc/ha
  const [calcDanoUnitario, setCalcDanoUnitario] = useState<number>(0.005); // sc de perda por percevejo/m

  // Fórmula Embrapa: NDE = C / (P * Y * D)
  const calcNDE = calcCustoControle / (calcPrecoSaca * calcProdutividade * calcDanoUnitario);
  const calcNA = calcNDE * 0.85;

  // Formulário de Nova Amostragem
  const [formTalhaoId, setFormTalhaoId] = useState<string>('talhao-01');
  const [formPontoNome, setFormPontoNome] = useState<string>('Ponto P-06 (Novo Ponto)');
  const [formAlvoPraga, setFormAlvoPraga] = useState<string>('Percevejo-marrom');
  const [formAlvoCientifico, setFormAlvoCientifico] = useState<string>('Euschistus heros');
  const [formMetodo, setFormMetodo] = useState<AmostragemMIP['metodoAmostragem']>('PANO_DE_BATIDA');
  const [formValor, setFormValor] = useState<number>(2.4);
  const [formUnidade, setFormUnidade] = useState<string>('insetos/metro');
  const [formEstadio, setFormEstadio] = useState<string>('R5.2 (Enchimento Médio)');

  const amostragensFiltradas = amostragens.filter((a) => {
    if (talhaoFiltro !== 'TODOS' && a.talhaoId !== talhaoFiltro) return false;
    if (statusFiltro !== 'TODOS' && a.status !== statusFiltro) return false;
    return true;
  });

  const totalAmostragens = amostragens.length;
  const criticosCount = amostragens.filter((a) => a.status === 'CRITICO').length;
  const atencaoCount = amostragens.filter((a) => a.status === 'ATENCAO').length;
  const normaisCount = amostragens.filter((a) => a.status === 'NORMAL').length;

  const handleSalvarAmostragem = (e: React.FormEvent) => {
    e.preventDefault();

    let ndeRef = 2.0;
    let naRef = 1.7;
    let recQuimica = 'Avaliar aplicação conforme receituário';
    let pAtivo = 'Fórmula técnica recomendada';
    let dose = '0.20 L/ha';
    let carencia = 14;

    if (formAlvoPraga.includes('Percevejo')) {
      ndeRef = Number(calcNDE.toFixed(2));
      naRef = Number(calcNA.toFixed(2));
      recQuimica = 'Engeo Pleno S ou Talisman';
      pAtivo = 'Tiametoxam + Lambda-cialotrina';
      dose = '0.25 L/ha';
      carencia = 21;
    } else if (formAlvoPraga.includes('Lagarta')) {
      ndeRef = 20.0;
      naRef = 15.0;
      recQuimica = 'Prêmio 200 SC / Coragen';
      pAtivo = 'Clorantraniliprole';
      dose = '0.10 L/ha';
      carencia = 14;
    } else {
      ndeRef = 10.0;
      naRef = 6.0;
      recQuimica = 'Sivanto Prime / Oberon';
      pAtivo = 'Flupiradifurona';
      dose = '0.35 L/ha';
      carencia = 21;
    }

    let statusCalc: 'NORMAL' | 'ATENCAO' | 'CRITICO' = 'NORMAL';
    if (formValor >= ndeRef) {
      statusCalc = 'CRITICO';
    } else if (formValor >= naRef) {
      statusCalc = 'ATENCAO';
    }

    const nova: AmostragemMIP = {
      id: `mip-${Date.now()}`,
      talhaoId: formTalhaoId,
      pontoNome: formPontoNome,
      coordenadas: [-12.550, -55.718],
      dataAmostragem: new Date().toISOString().split('T')[0],
      avaliador: 'Monitor de Campo (Apontamento Mobile)',
      estadioFenologico: formEstadio,
      cultura: TALHOES_INICIAIS.find((t) => t.id === formTalhaoId)?.cultura || 'Soja',
      alvoPraga: formAlvoPraga,
      alvoCientifico: formAlvoCientifico,
      metodoAmostragem: formMetodo,
      valorEncontrado: Number(formValor),
      unidadeMedida: formUnidade,
      ndeReferencia: ndeRef,
      nivelAcao: naRef,
      status: statusCalc,
      recomendacaoQuimica: recQuimica,
      principioAtivoSugerido: pAtivo,
      doseSugerida: dose,
      carenciaDias: carencia,
    };

    setAmostragens([nova, ...amostragens]);
    setMostrarModalNova(false);
    setNotificacaoSucesso(`Amostragem cadastrada no talhão com sucesso! Status: ${statusCalc}`);
    setTimeout(() => setNotificacaoSucesso(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#EAF4E7] p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">MIP & Proteção de Culturas</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  Embrapa Soja / NDE
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  GPS Geolocalizado
                </span>
              </div>
              <p className="text-sm text-[#66736A] mt-0.5">
                Manejo Integrado de Pragas, Doenças e Plantas Daninhas com cálculo de Nível de Dano Econômico (NDE) e gatilho de pulverização.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarModalNova(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Amostragem de Campo
          </button>
        </div>
      </div>

      {notificacaoSucesso && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notificacaoSucesso}</span>
          </div>
          <button onClick={() => setNotificacaoSucesso(null)} className="text-xs text-emerald-400 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* Cards de Resumo Epidemiológico / Monitoramento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] p-4 rounded-xl">
          <div className="flex items-center justify-between text-[#66736A] mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Pontos Monitorados</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-[#1D4B38]">{totalAmostragens} pontos</div>
          <p className="text-xs text-slate-500 mt-1">Grade regular de 1 ponto a cada 10 ha</p>
        </div>

        <div className="bg-rose-950/30 border border-rose-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-rose-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Gatilho NDE Estourado</span>
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-200">{criticosCount} críticos</div>
          <p className="text-xs text-rose-400/80 mt-1">Exigem pulverização imediata (&lt; 24h)</p>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Nível de Ação / Atenção</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-200">{atencaoCount} talhões</div>
          <p className="text-xs text-amber-400/80 mt-1">Próximos ao NDE; reamostrar em 48h</p>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Infestação Baixa / Seguro</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-200">{normaisCount} seguros</div>
          <p className="text-xs text-emerald-400/80 mt-1">Controle biológico natural preservado</p>
        </div>
      </div>

      {/* Grid de 2 Colunas: Matriz de Calor por Talhão + Calculadora Interativa NDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa de Risco de Infestação dos Talhões (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#1D4B38] flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                Mapa de Risco de Infestação por Talhão (Status MIP)
              </h2>
              <p className="text-xs text-[#66736A]">Classificação agronômica baseada no ponto mais crítico do talhão</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
              Safra 2025/2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TALHOES_INICIAIS.map((talhao) => {
              const amostragensDoTalhao = amostragens.filter((a) => a.talhaoId === talhao.id);
              const temCritico = amostragensDoTalhao.some((a) => a.status === 'CRITICO');
              const temAtencao = amostragensDoTalhao.some((a) => a.status === 'ATENCAO');

              let cardBg = 'bg-[#F7F9F5] border-emerald-700/40 hover:border-emerald-500';
              let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              let badgeText = 'SEGURO';

              if (temCritico) {
                cardBg = 'bg-rose-950/20 border-rose-600/60 hover:border-rose-400';
                badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                badgeText = 'CRÍTICO (PULVERIZAR)';
              } else if (temAtencao) {
                cardBg = 'bg-amber-950/20 border-amber-600/60 hover:border-amber-400';
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                badgeText = 'ATENÇÃO (REVISITAR)';
              }

              return (
                <div
                  key={talhao.id}
                  onClick={() => setTalhaoFiltro(talhao.id === talhaoFiltro ? 'TODOS' : talhao.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${cardBg} ${
                    talhaoFiltro === talhao.id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#26332A] text-sm">{talhao.codigo}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {badgeText}
                    </span>
                  </div>
                  <div className="text-xs text-[#26332A] font-medium truncate">{talhao.nome}</div>
                  <div className="text-[11px] text-[#66736A] mt-1">{talhao.cultura} • {talhao.areaHa} ha</div>

                  <div className="mt-3 pt-2 border-t border-[#EAF4E7]/80 flex items-center justify-between text-xs">
                    <span className="text-[#66736A]">Amostragens:</span>
                    <span className="font-semibold text-[#26332A]">{amostragensDoTalhao.length} pontos</span>
                  </div>
                  {amostragensDoTalhao.length > 0 && (
                    <div className="text-[11px] text-[#66736A] mt-1 truncate">
                      Alvo: <span className="text-[#26332A] font-medium">{amostragensDoTalhao[0].alvoPraga}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculadora Interativa NDE (1 col) */}
        <div className="bg-white border border-[#EAF4E7] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-[#1D4B38]">Calculadora de NDE</h2>
            </div>
            <p className="text-xs text-[#66736A] mb-4">
              Ajuste as variáveis de mercado e custo para calcular o Nível de Dano Econômico exato pela fórmula da Embrapa:
            </p>

            <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] font-mono text-center text-xs text-amber-300 mb-4">
              NDE = Custo / (Preço × Produtividade × Dano)
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#26332A] block mb-1">Custo do Controle (Defensivo + Aplicação):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={calcCustoControle}
                    onChange={(e) => setCalcCustoControle(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A]"
                  />
                  <span className="text-[#66736A] font-mono">R$/ha</span>
                </div>
              </div>

              <div>
                <label className="text-[#26332A] block mb-1">Preço da Saca (Soja/Milho):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={calcPrecoSaca}
                    onChange={(e) => setCalcPrecoSaca(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A]"
                  />
                  <span className="text-[#66736A] font-mono">R$/sc</span>
                </div>
              </div>

              <div>
                <label className="text-[#26332A] block mb-1">Produtividade Esperada:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={calcProdutividade}
                    onChange={(e) => setCalcProdutividade(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A]"
                  />
                  <span className="text-[#66736A] font-mono">sc/ha</span>
                </div>
              </div>

              <div>
                <label className="text-[#26332A] block mb-1">Dano Físico por Inseto/m:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    value={calcDanoUnitario}
                    onChange={(e) => setCalcDanoUnitario(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-1.5 text-[#26332A]"
                  />
                  <span className="text-[#66736A] font-mono">sc/m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#26332A] font-medium">NDE Calculado:</span>
              <span className="text-lg font-bold text-emerald-300 font-mono">{calcNDE.toFixed(2)} insetos/m</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#66736A]">
              <span>Nível de Ação Preventivo (85%):</span>
              <span className="font-mono text-amber-300 font-semibold">{calcNA.toFixed(2)} insetos/m</span>
            </div>
            <div className="mt-2 text-[11px] text-[#66736A] border-t border-emerald-900/50 pt-2">
              Se amostragem &ge; {calcNDE.toFixed(2)} insetos/m, o prejuízo da praga supera o custo de entrar com o pulverizador.
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Amostragens de Campo com Filtros e Ações */}
      <div className="bg-white border border-[#EAF4E7] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#EAF4E7] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#1D4B38] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Registro de Amostragens Georreferenciadas & Diagnóstico
            </h2>
            <p className="text-xs text-[#66736A]">
              Histórico de coletas com cálculo de gatilho NDE e recomendação agronômica imediata
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-1.5 text-xs text-[#26332A]">
              <Filter className="w-3.5 h-3.5 text-[#66736A]" />
              <span>Talhão:</span>
              <select
                value={talhaoFiltro}
                onChange={(e) => setTalhaoFiltro(e.target.value)}
                className="bg-transparent text-[#26332A] focus:outline-none cursor-pointer"
              >
                <option value="TODOS" className="bg-slate-900">Todos os Talhões</option>
                {TALHOES_INICIAIS.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900">{t.codigo} - {t.nome}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-1.5 text-xs text-[#26332A]">
              <span>Status:</span>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="bg-transparent text-[#26332A] focus:outline-none cursor-pointer"
              >
                <option value="TODOS" className="bg-slate-900">Todos os Status</option>
                <option value="CRITICO" className="bg-slate-900 text-rose-400">Crítico (Pulverizar)</option>
                <option value="ATENCAO" className="bg-slate-900 text-amber-400">Atenção (Monitorar)</option>
                <option value="NORMAL" className="bg-slate-900 text-emerald-400">Normal (Seguro)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] text-[#66736A] uppercase tracking-wider font-semibold border-b border-[#EAF4E7]">
              <tr>
                <th className="px-4 py-3.5">Talhão & Ponto</th>
                <th className="px-4 py-3.5">Alvo / Praga</th>
                <th className="px-4 py-3.5">Estádio Fenológico</th>
                <th className="px-4 py-3.5">Densidade / Amostragem</th>
                <th className="px-4 py-3.5">NDE / Gatilho</th>
                <th className="px-4 py-3.5">Status & Diagnóstico</th>
                <th className="px-4 py-3.5">Recomendação / Calda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {amostragensFiltradas.map((amostra) => {
                const talhao = TALHOES_INICIAIS.find((t) => t.id === amostra.talhaoId);

                let statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3" /> Seguro
                  </span>
                );

                if (amostra.status === 'CRITICO') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit animate-pulse">
                      <Flame className="w-3 h-3 text-rose-400" /> Pulverizar Imediato
                    </span>
                  );
                } else if (amostra.status === 'ATENCAO') {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3 text-amber-400" /> Nível de Ação
                    </span>
                  );
                }

                return (
                  <tr key={amostra.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#26332A]">
                        {talhao ? `${talhao.codigo} - ${talhao.nome}` : amostra.talhaoId}
                      </div>
                      <div className="text-[11px] text-[#66736A] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {amostra.pontoNome}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {amostra.dataAmostragem} • {amostra.avaliador}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#26332A]">{amostra.alvoPraga}</div>
                      <div className="text-[11px] text-[#66736A] italic">{amostra.alvoCientifico}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
                        {amostra.metodoAmostragem.replace(/_/g, ' ')}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-[#26332A]">
                      <div className="font-medium">{amostra.estadioFenologico}</div>
                      <div className="text-[11px] text-[#66736A]">{amostra.cultura}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono text-sm font-bold text-[#1D4B38]">
                        {amostra.valorEncontrado} {amostra.unidadeMedida}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-[#26332A] font-mono">
                        NDE: <span className="font-bold text-rose-400">{amostra.ndeReferencia}</span>
                      </div>
                      <div className="text-[#66736A] font-mono text-[11px]">
                        Ação: <span className="text-amber-400">{amostra.nivelAcao}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">{statusBadge}</td>

                    <td className="px-4 py-3.5">
                      <div className="text-[#26332A] font-medium">{amostra.recomendacaoQuimica}</div>
                      <div className="text-[11px] text-[#66736A]">
                        {amostra.principioAtivoSugerido} • {amostra.doseSugerida}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        Carência: {amostra.carenciaDias} dias (Conforme Receita)
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Amostragem */}
      {mostrarModalNova && (
        <div className="fixed inset-0 z-50 bg-[#F7F9F5] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAF4E7]">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-400" />
                Registrar Amostragem de Campo (MIP)
              </h3>
              <button
                onClick={() => setMostrarModalNova(false)}
                className="text-[#66736A] hover:text-[#26332A] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarAmostragem} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="text-[#26332A] block mb-1 font-medium">Talhão Amostrado:</label>
                <select
                  value={formTalhaoId}
                  onChange={(e) => setFormTalhaoId(e.target.value)}
                  className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-2 text-[#26332A]"
                >
                  {TALHOES_INICIAIS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.codigo} - {t.nome} ({t.cultura})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#26332A] block mb-1 font-medium">Identificação do Ponto:</label>
                <input
                  type="text"
                  value={formPontoNome}
                  onChange={(e) => setFormPontoNome(e.target.value)}
                  className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-2 text-[#26332A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#26332A] block mb-1 font-medium">Praga / Alvo:</label>
                  <select
                    value={formAlvoPraga}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormAlvoPraga(val);
                      if (val.includes('Percevejo')) {
                        setFormAlvoCientifico('Euschistus heros');
                        setFormUnidade('insetos/metro');
                        setFormMetodo('PANO_DE_BATIDA');
                      } else if (val.includes('Lagarta')) {
                        setFormAlvoCientifico('Chrysodeixis includens');
                        setFormUnidade('% desfolha');
                        setFormMetodo('DESFOLHA_PCT');
                      } else {
                        setFormAlvoCientifico('Bemisia tabaci');
                        setFormUnidade('ninfas/folíolo');
                        setFormMetodo('CONTAGEM_VISUAL');
                      }
                    }}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-2 text-[#26332A]"
                  >
                    <option value="Percevejo-marrom">Percevejo-marrom (E. heros)</option>
                    <option value="Lagarta-falsa-medideira">Lagarta-falsa-medideira</option>
                    <option value="Lagarta-do-cartucho">Lagarta-do-cartucho (Spodoptera)</option>
                    <option value="Mosca-branca">Mosca-branca (B. tabaci)</option>
                    <option value="Bicudo-do-algodoeiro">Bicudo-do-algodoeiro</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#26332A] block mb-1 font-medium">Estádio Fenológico:</label>
                  <input
                    type="text"
                    value={formEstadio}
                    onChange={(e) => setFormEstadio(e.target.value)}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-2 text-[#26332A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#26332A] block mb-1 font-medium">Contagem / Densidade:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formValor}
                    onChange={(e) => setFormValor(Number(e.target.value))}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-2 text-[#26332A] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#26332A] block mb-1 font-medium">Unidade de Medida:</label>
                  <input
                    type="text"
                    value={formUnidade}
                    onChange={(e) => setFormUnidade(e.target.value)}
                    className="w-full bg-[#F7F9F5] border border-slate-700 rounded-lg px-3 py-2 text-[#26332A]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] text-[11px] text-[#66736A]">
                O sistema calculará automaticamente o NDE em relação ao custo de controle e indicará se o ponto exige emissão imediata de ordem de pulverização.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#EAF4E7]">
                <button
                  type="button"
                  onClick={() => setMostrarModalNova(false)}
                  className="px-4 py-2 rounded-xl text-[#66736A] hover:text-[#26332A] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Confirmar Amostragem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MIPManejoPragasModule;
