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
  RotateCcw
} from 'lucide-react';
import { RECEITUARIOS_INICIAIS, ReceituarioAgronomicoData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const ReceituarioAgronomicoModule: React.FC = () => {
  const [receituarios, setReceituarios] = useState<ReceituarioAgronomicoData[]>(RECEITUARIOS_INICIAIS);
  const [selectedReceita, setSelectedReceita] = useState<ReceituarioAgronomicoData | null>(null);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);

  // Form states para nova receita
  const [produto, setProduto] = useState('Fox Xpro (Bayer)');
  const [alvo, setAlvo] = useState('Ferrugem Asiática (Phakopsora pachyrhizi)');
  const [dose, setDose] = useState('0.50 L / ha');
  const [talhaoId, setTalhaoId] = useState('talhao-04');

  const handleEmitirReceita = () => {
    const nova: ReceituarioAgronomicoData = {
      id: `rec-0${receituarios.length + 1}`,
      numeroReceita: `REC-2025-0048${receituarios.length + 1}`,
      numeroArt: `ART-CREA-MT-2025-91025${receituarios.length + 1}`,
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
    setModalNovoOpen(false);
    alert('✓ Receituário Agronômico emitido com ART vinculada com sucesso no CREA-MT!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner do Receituário */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Responsabilidade Técnica CREA-MT / MAPA
            </span>
            <span className="text-xs text-slate-400">Em conformidade com a Lei Federal nº 7.802</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" /> Receituário Agronômico & Anotação de Responsabilidade (ART)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toda aplicação de defensivo no campo é validada contra o receituário do engenheiro agrônomo, com travas de carência e logística reversa do inpEV.
          </p>
        </div>

        <button
          onClick={() => setModalNovoOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Emitir Novo Receituário
        </button>
      </div>

      {/* Grid de Receituários Cadastrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {receituarios.map((rec) => {
          const talhao = TALHOES_INICIAIS.find((t) => t.id === rec.talhaoAlvoId);

          return (
            <div
              key={rec.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{rec.numeroReceita}</span>
                    <span className="text-[10px] font-mono text-slate-400">({rec.numeroArt})</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{rec.produtoComercial}</h3>
                  <p className="text-xs text-slate-400 font-medium">Alvo: <span className="text-slate-200">{rec.alvoBiologico}</span></p>
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
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Talhão Destino</span>
                  <span className="font-bold text-white">
                    {talhao?.codigo} - {talhao?.nome}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Dose Prescrita</span>
                  <span className="font-bold text-emerald-400">{rec.doseRecomendada}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Carência / Intervalo</span>
                  <span className="font-bold text-amber-400">{rec.intervaloSegurancaDias} dias p/ colheita</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Reentrada na Lavoura</span>
                  <span className="font-bold text-slate-300">{rec.periodoReentradaHoras} horas</span>
                </div>
              </div>

              {/* Logística Reversa inpEV */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <b className="text-slate-300">Logística Reversa (inpEV):</b> {rec.instrucoesInpev}
                </p>
              </div>

              {/* Rodapé com Assinatura Técnica do Agrônomo */}
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Responsável Técnico</span>
                  <span className="font-semibold text-slate-300">{rec.agronomoResponsavel}</span>
                  <span className="text-[10px] text-slate-500 ml-1">({rec.creaNumero})</span>
                </div>
                <button
                  onClick={() => alert(`Imprimindo via PDF o Receituário Agronômico ${rec.numeroReceita} com ART ${rec.numeroArt}.`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" /> Imprimir Bula / ART
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Emissão de Novo Receituário */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full shadow-2xl text-slate-200 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Emitir Receituário Agronômico (CREA-MT)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Produto Comercial (Defensivo)</label>
                <select
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                >
                  <option>Fox Xpro (Bayer) - Fungicida</option>
                  <option>Engeo Pleno S (Syngenta) - Inseticida</option>
                  <option>Priori Top (Syngenta) - Fungicida</option>
                  <option>Roundup Transorb (Bayer) - Herbicida</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Alvo Biológico (Praga / Doença)</label>
                <input
                  type="text"
                  value={alvo}
                  onChange={(e) => setAlvo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Dose Recomendada / ha</label>
                  <input
                    type="text"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Talhão de Aplicação</label>
                  <select
                    value={talhaoId}
                    onChange={(e) => setTalhaoId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium text-xs"
                  >
                    {TALHOES_INICIAIS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.codigo} - {t.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalNovoOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleEmitirReceita}
                className="px-4 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
              >
                Assinar e Homologar no CREA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
