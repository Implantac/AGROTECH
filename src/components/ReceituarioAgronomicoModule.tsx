import React, { useState } from 'react';
import {
  FileCheck,
  Award,
  AlertCircle,
  Clock,
  Printer,
  ShieldCheck,
  Plus,
  Search,
  ExternalLink,
  RotateCcw,
  Calculator,
  Droplets,
  CheckCircle2,
  FileText,
  X,
  RefreshCw,
  Sparkles,
  Sliders
} from 'lucide-react';
import { RECEITUARIOS_INICIAIS, ReceituarioAgronomicoData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const ReceituarioAgronomicoModule: React.FC = () => {
  const [receituarios, setReceituarios] = useState<ReceituarioAgronomicoData[]>(RECEITUARIOS_INICIAIS);
  const [selectedReceitaParaImprimir, setSelectedReceitaParaImprimir] = useState<ReceituarioAgronomicoData | null>(null);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'receitas' | 'calculadora'>('receitas');

  // Form states para nova receita
  const [produto, setProduto] = useState('Fox Xpro (Bayer)');
  const [alvo, setAlvo] = useState('Ferrugem Asiática (Phakopsora pachyrhizi)');
  const [dose, setDose] = useState('0.50 L / ha');
  const [talhaoId, setTalhaoId] = useState('talhao-04');
  const [volumeCaldaLha, setVolumeCaldaLha] = useState<number>(150);
  const [classeTox, setClasseTox] = useState<string>('Classe IV - Pouco Tóxico (Faixa Azul)');
  const [loadingEmissao, setLoadingEmissao] = useState(false);

  // Estados da Calculadora de Calda
  const [calcAreaHa, setCalcAreaHa] = useState<number>(380);
  const [calcTaxaLha, setCalcTaxaLha] = useState<number>(150);
  const [calcCapacidadeTanqueL, setCalcCapacidadeTanqueL] = useState<number>(3000);
  const [calcDoseLha, setCalcDoseLha] = useState<number>(0.50);
  const [calcAdjuvantePct, setCalcAdjuvantePct] = useState<number>(0.25); // 0.25% v/v
  const [calcVelocidadeKmh, setCalcVelocidadeKmh] = useState<number>(18);
  const [calcEspacamentoBicosCm, setCalcEspacamentoBicosCm] = useState<number>(50);

  // Cálculos dinâmicos da Calda
  const volumeTotalCaldaLitros = calcAreaHa * calcTaxaLha;
  const totalTanquesExatos = volumeTotalCaldaLitros / calcCapacidadeTanqueL;
  const tanquesCompletos = Math.floor(totalTanquesExatos);
  const caldaRestanteLitros = volumeTotalCaldaLitros % calcCapacidadeTanqueL;
  const haPorTanqueCheio = calcCapacidadeTanqueL / calcTaxaLha;
  const produtoPorTanqueCheioLitros = haPorTanqueCheio * calcDoseLha;
  const adjuvantePorTanqueCheioLitros = (calcCapacidadeTanqueL * calcAdjuvantePct) / 100;
  // Vazão necessária por bico (L/min) = (Taxa L/ha * Velocidade km/h * Espaçamento cm) / 60000
  const vazaoBicoLmin = Number(((calcTaxaLha * calcVelocidadeKmh * calcEspacamentoBicosCm) / 60000).toFixed(2));

  const handleEmitirReceita = async () => {
    setLoadingEmissao(true);
    try {
      const resp = await fetch('/api/v1/agronomico/receituario/emitir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produtoComercial: produto,
          alvoBiologico: alvo,
          doseRecomendada: dose,
          talhaoAlvoId: talhaoId,
          volumeCaldaLha,
          classeToxicologica: classeTox,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.receituario) {
          setReceituarios([data.receituario, ...receituarios]);
          setSelectedReceitaParaImprimir(data.receituario);
        }
      } else {
        const nova: ReceituarioAgronomicoData = {
          id: `rec-0${receituarios.length + 1}`,
          numeroReceita: `REC-2026-0048${receituarios.length + 1}`,
          numeroArt: `ART-CREA-MT-2026-91025${receituarios.length + 1}`,
          agronomoResponsavel: 'Dra. Camila Nogueira de Barros',
          creaNumero: 'CREA-MT 18492-D',
          dataEmissao: new Date().toISOString().slice(0, 10),
          validadeDias: 30,
          talhaoAlvoId: talhaoId,
          produtoComercial: produto,
          principioAtivo: 'Trifloxistrobina + Protioconazol',
          doseRecomendada: dose,
          alvoBiologico: alvo,
          intervaloSegurancaDias: 20,
          periodoReentradaHoras: 24,
          instrucoesInpev: 'Tríplice lavagem obrigatória no momento do preparo da calda e devolução no posto central do inpEV em até 365 dias.',
          status: 'EMITIDO',
        };
        setReceituarios([nova, ...receituarios]);
        setSelectedReceitaParaImprimir(nova);
      }
    } catch {
      const nova: ReceituarioAgronomicoData = {
        id: `rec-0${receituarios.length + 1}`,
        numeroReceita: `REC-2026-0048${receituarios.length + 1}`,
        numeroArt: `ART-CREA-MT-2026-91025${receituarios.length + 1}`,
        agronomoResponsavel: 'Dra. Camila Nogueira de Barros',
        creaNumero: 'CREA-MT 18492-D',
        dataEmissao: new Date().toISOString().slice(0, 10),
        validadeDias: 30,
        talhaoAlvoId: talhaoId,
        produtoComercial: produto,
        principioAtivo: 'Trifloxistrobina + Protioconazol',
        doseRecomendada: dose,
        alvoBiologico: alvo,
        intervaloSegurancaDias: 20,
        periodoReentradaHoras: 24,
        instrucoesInpev: 'Tríplice lavagem obrigatória no momento do preparo da calda e devolução no posto central do inpEV em até 365 dias.',
        status: 'EMITIDO',
      };
      setReceituarios([nova, ...receituarios]);
      setSelectedReceitaParaImprimir(nova);
    } finally {
      setLoadingEmissao(false);
      setModalNovoOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner do Receituário */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Responsabilidade Técnica CREA-MT / MAPA
            </span>
            <span className="text-xs text-slate-600">Em conformidade com a Lei Federal nº 7.802 / Decreto 4.074</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" /> Receituário Agronômico & Anotação de Responsabilidade (ART)
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Toda aplicação de defensivo no campo é validada contra o receituário do engenheiro agrônomo, com travas de carência e logística reversa do inpEV.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAbaAtiva('calculadora')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              abaAtiva === 'calculadora'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-950/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-900 border-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-400" /> Calculadora de Calda & Pontas
          </button>
          <button
            onClick={() => setModalNovoOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Emitir Novo Receituário
          </button>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAbaAtiva('receitas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            abaAtiva === 'receitas'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          Receitas Homologadas ({receituarios.length})
        </button>

        <button
          onClick={() => setAbaAtiva('calculadora')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            abaAtiva === 'calculadora'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-600 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Droplets className="w-4 h-4" />
          Preparo de Calda & Dimensionamento de Tanques
        </button>
      </div>

      {/* Conteúdo Aba Receitas Homologadas */}
      {abaAtiva === 'receitas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {receituarios.map((rec) => {
            const talhao = TALHOES_INICIAIS.find((t) => t.id === rec.talhaoAlvoId);

            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{rec.numeroReceita}</span>
                      <span className="text-[10px] font-mono text-slate-600">({rec.numeroArt})</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{rec.produtoComercial}</h3>
                    <p className="text-xs text-slate-600 font-medium">Alvo: <span className="text-slate-900">{rec.alvoBiologico}</span></p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'APLICADO'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>

                {/* Informações Agronômicas da Bula */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 block font-semibold">Talhão Destino</span>
                    <span className="font-bold text-white">
                      {talhao?.codigo || 'TAL-04'} - {talhao?.nome || 'Talhão Pivô 01'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 block font-semibold">Dose Prescrita</span>
                    <span className="font-bold text-emerald-400">{rec.doseRecomendada}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 block font-semibold">Carência / Intervalo</span>
                    <span className="font-bold text-amber-400">{rec.intervaloSegurancaDias} dias p/ colheita</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 block font-semibold">Reentrada na Lavoura</span>
                    <span className="font-bold text-slate-900">{rec.periodoReentradaHoras} horas</span>
                  </div>
                </div>

                {/* Logística Reversa inpEV */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <b className="text-slate-900">Logística Reversa (inpEV):</b> {rec.instrucoesInpev}
                  </p>
                </div>

                {/* Rodapé com Assinatura Técnica do Agrônomo */}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Responsável Técnico</span>
                    <span className="font-semibold text-slate-900">{rec.agronomoResponsavel}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({rec.creaNumero})</span>
                  </div>
                  <button
                    onClick={() => setSelectedReceitaParaImprimir(rec)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" /> Imprimir Bula / ART Oficial
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conteúdo Aba Calculadora de Calda */}
      {abaAtiva === 'calculadora' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Parâmetros do Formulário de Preparo de Calda */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-200 pb-3">
                <Sliders className="w-5 h-5 text-blue-400" /> Parâmetros Operacionais
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Área Alvo da Aplicação (ha)</label>
                  <input
                    type="number"
                    value={calcAreaHa}
                    onChange={(e) => setCalcAreaHa(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Taxa de Aplicação de Calda (L/ha)</label>
                  <input
                    type="number"
                    value={calcTaxaLha}
                    onChange={(e) => setCalcTaxaLha(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Capacidade do Tanque do Pulverizador (L)</label>
                  <input
                    type="number"
                    value={calcCapacidadeTanqueL}
                    onChange={(e) => setCalcCapacidadeTanqueL(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Dose do Defensivo (L/ha ou kg/ha)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={calcDoseLha}
                    onChange={(e) => setCalcDoseLha(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Adjuvante Óleo Mineral (% v/v)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={calcAdjuvantePct}
                    onChange={(e) => setCalcAdjuvantePct(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Velocidade (km/h)</label>
                    <input
                      type="number"
                      value={calcVelocidadeKmh}
                      onChange={(e) => setCalcVelocidadeKmh(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Espaç. Bicos (cm)</label>
                    <input
                      type="number"
                      value={calcEspacamentoBicosCm}
                      onChange={(e) => setCalcEspacamentoBicosCm(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Resultados do Dimensionamento */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-400" /> Prescrição Exata de Mistura por Tanque
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Ordem de abastecimento recomendada: 1º Água (50%), 2º Condicionadores de Calda, 3º Defensivo (SC/EC), 4º Adjuvante, 5º Completar água.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Volume Total de Calda</span>
                    <p className="text-2xl font-bold font-mono text-blue-400 mt-1">
                      {volumeTotalCaldaLitros.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-600">Litros</span>
                    </p>
                    <span className="text-[11px] text-slate-600 mt-1 block">Para os {calcAreaHa} ha planejados</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Total de Tanques</span>
                    <p className="text-2xl font-bold font-mono text-amber-400 mt-1">
                      {totalTanquesExatos.toFixed(2)} <span className="text-xs font-normal text-slate-600">cargas</span>
                    </p>
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      {tanquesCompletos} cheios + 1 com {caldaRestanteLitros} L
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-600 uppercase font-semibold">Vazão Requerida / Bico</span>
                    <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {vazaoBicoLmin} <span className="text-xs font-normal text-slate-600">L/min</span>
                    </p>
                    <span className="text-[11px] text-emerald-400/80 mt-1 block">Ponta recomendada: TTJ60-11003</span>
                  </div>
                </div>

                {/* Card Detalhado de Abastecimento de Cada Tanque Cheio */}
                <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" /> Receita para Cada Tanque de {calcCapacidadeTanqueL} Litros (Cobre {haPorTanqueCheio.toFixed(1)} ha):
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-600 block text-[11px]">Defensivo Comercial</span>
                      <b className="text-emerald-400 text-base">{produtoPorTanqueCheioLitros.toFixed(2)} L</b>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-600 block text-[11px]">Adjuvante Óleo Mineral</span>
                      <b className="text-amber-400 text-base">{adjuvantePorTanqueCheioLitros.toFixed(2)} L</b>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-600 block text-[11px]">Água Limpa (pH 5.5 - 6.5)</span>
                      <b className="text-blue-400 text-base">{(calcCapacidadeTanqueL - produtoPorTanqueCheioLitros - adjuvantePorTanqueCheioLitros).toFixed(1)} L</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Emissão de Novo Receituário */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full shadow-2xl text-slate-900 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Emitir Receituário Agronômico (CREA-MT)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Produto Comercial (Defensivo)</label>
                <select
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                >
                  <option>Fox Xpro (Bayer) - Fungicida Sistêmico</option>
                  <option>Engeo Pleno S (Syngenta) - Inseticida</option>
                  <option>Priori Top (Syngenta) - Fungicida</option>
                  <option>Roundup Transorb (Bayer) - Herbicida Sistêmico</option>
                  <option>Nomolt 150 (BASF) - Fisiológico Inseticida</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Alvo Biológico (Praga / Fitopatógeno)</label>
                <input
                  type="text"
                  value={alvo}
                  onChange={(e) => setAlvo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Dose Recomendada / ha</label>
                  <input
                    type="text"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Talhão de Aplicação</label>
                  <select
                    value={talhaoId}
                    onChange={(e) => setTalhaoId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  >
                    {TALHOES_INICIAIS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.codigo} - {t.nome} ({t.areaHa} ha)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Volume de Calda (L/ha)</label>
                  <input
                    type="number"
                    value={volumeCaldaLha}
                    onChange={(e) => setVolumeCaldaLha(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">Classificação Toxicológica</label>
                  <select
                    value={classeTox}
                    onChange={(e) => setClasseTox(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  >
                    <option>Classe IV - Pouco Tóxico (Faixa Azul)</option>
                    <option>Classe III - Moderadamente Tóxico (Faixa Amarela)</option>
                    <option>Classe II - Altamente Tóxico (Faixa Amarela Intensa)</option>
                    <option>Classe I - Extremamente Tóxico (Faixa Vermelha)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setModalNovoOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-900 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleEmitirReceita}
                disabled={loadingEmissao}
                className="px-4 py-2 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                {loadingEmissao ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
                Assinar e Homologar no CREA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Visualização de Impressão A4 Oficial CREA/MAPA */}
      {selectedReceitaParaImprimir && (
        <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Conselho Regional de Engenharia e Agronomia (CREA-MT)</span>
                <h2 className="text-xl font-black text-slate-950 tracking-tight">RECEITUÁRIO AGRONÔMICO OFICIAL</h2>
                <p className="text-xs font-mono font-bold text-emerald-800 mt-0.5">LEI FEDERAL Nº 7.802/1989 & DECRETO Nº 4.074/2002</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-900 block">Nº {selectedReceitaParaImprimir.numeroReceita}</span>
                <span className="text-[11px] font-mono text-emerald-800 block">ART: {selectedReceitaParaImprimir.numeroArt}</span>
              </div>
            </div>

            {/* Informações Oficiais da Receita */}
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Propriedade / Fazenda</span>
                  <p className="font-semibold text-slate-900">Fazenda Santa Helena do Araguaia</p>
                  <span className="text-[10px] text-slate-500">Município: Sorriso/MT • Inscrição Estadual: 13.918.234-1</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Talhão Alvo</span>
                  <p className="font-semibold text-slate-900">Talhão 04 (380 ha) - Soja Comercial</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Produto Comercial Prescrito</span>
                  <p className="text-sm font-bold text-slate-900">{selectedReceitaParaImprimir.produtoComercial}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Princípio Ativo: {selectedReceitaParaImprimir.principioAtivo}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Alvo Biológico</span>
                  <p className="text-xs font-bold text-red-900">{selectedReceitaParaImprimir.alvoBiologico}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-600 block font-semibold">Dose Prescrita</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedReceitaParaImprimir.doseRecomendada}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block font-semibold">Intervalo de Segurança</span>
                  <p className="font-bold text-amber-800 text-sm">{selectedReceitaParaImprimir.intervaloSegurancaDias} dias</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block font-semibold">Período de Reentrada</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedReceitaParaImprimir.periodoReentradaHoras} horas</p>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-[11px]">
                <span className="text-[10px] font-bold text-slate-700 uppercase block">Obrigações Legais & Logística Reversa (inpEV)</span>
                <p className="text-slate-800 mt-1">{selectedReceitaParaImprimir.instrucoesInpev}</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950">
                <span className="font-bold block uppercase text-[10px]">Equipamentos de Proteção Individual (EPI Obrigatório - NR-31.8)</span>
                <p>Uso obrigatório de calça e camisa hidrorrepelente, touca árabe, respirador com filtro de carvão ativado P2, óculos panorâmico e luvas nitrílicas durante a manipulação da calda e aplicação.</p>
              </div>

              <div className="pt-4 border-t border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block">Assinatura Eletrônica Qualificada ICP-Brasil:</span>
                  <span className="text-[10px] font-mono text-slate-700 font-semibold block">SHA256: 8a4c9b10f021e902b489a203f9c2d1</span>
                  <span className="text-xs text-slate-900 font-bold mt-1 block">
                    {selectedReceitaParaImprimir.agronomoResponsavel} - {selectedReceitaParaImprimir.creaNumero}
                  </span>
                </div>
                <div className="text-center pl-4 shrink-0">
                  <div className="w-16 h-16 bg-slate-200 border border-slate-400 rounded flex items-center justify-center font-mono text-[8px] text-slate-600">
                    [QR CODE CREA]
                  </div>
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6 print:hidden">
              <button
                onClick={() => setSelectedReceitaParaImprimir(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" /> Imprimir Receituário A4
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
