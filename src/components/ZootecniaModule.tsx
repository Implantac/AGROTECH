import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Calendar,
  Lock,
  Unlock,
  Plus,
  Scale,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ANIMAIS_PECUARIA, AnimalPecuariaData } from '../data/mockAgroData';

export const ZootecniaModule: React.FC = () => {
  const [animais, setAnimais] = useState<AnimalPecuariaData[]>(ANIMAIS_PECUARIA);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalPecuariaData | null>(null);

  const totalAnimais = animais.length;
  const emCarencia = animais.filter((a) => a.statusSanitario === 'EM_CARENCIA').length;
  const liberados = totalAnimais - emCarencia;

  return (
    <div className="space-y-6">
      {/* Top Banner Zootecnia */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-xs font-bold">
              Zootecnia de Precisão & Trava de Carência Sanitária
            </span>
            <span className="text-xs text-slate-600">Pecuária Integrada Nelore / Cruzamento Industrial</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Rastreabilidade RFID, GMD e Período de Carência
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Conexão com bastões RFID de brete. Bloqueia automaticamente a emissão de Guia de Trânsito Animal (GTA) para abate de lotes sob efeito de medicamentos veterinários.
          </p>
        </div>

        {/* Resumo Sanitário */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-semibold">Liberados para Abate</span>
            <p className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> {liberados} cab
            </p>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-600 uppercase font-semibold">Em Carência Sanitária</span>
            <p className="text-base font-bold text-red-400 flex items-center justify-center gap-1">
              <ShieldAlert className="w-4 h-4" /> {emCarencia} cab
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Animais com RFID */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white">Lote de Bovinos Georreferenciado</h3>
            <p className="text-xs text-slate-600">Leituras de bastão RFID e balança eletrônica de brete</p>
          </div>
          <button
            onClick={() => alert('Simulador de bastão RFID ativado: aproximando leitor do animal no brete...')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" /> Ler Novo Brinco RFID
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-900">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Brinco Visual</th>
                <th className="px-4 py-3">Brinco RFID Eletrônico</th>
                <th className="px-4 py-3">Raça / Categoria</th>
                <th className="px-4 py-3 text-right">Peso Atual (Balança)</th>
                <th className="px-4 py-3 text-right text-emerald-400">GMD (kg/dia)</th>
                <th className="px-4 py-3">Lote de Pasto</th>
                <th className="px-4 py-3 text-center">Status Sanitário</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {animais.map((ani) => {
                const emQuarentena = ani.statusSanitario === 'EM_CARENCIA';

                return (
                  <tr key={ani.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-bold text-white font-mono">{ani.brincoVisual}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{ani.rfid}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">{ani.raca}</span>
                      <span className="text-[10px] text-slate-600 block">{ani.categoria}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {ani.pesoAtualKg.toFixed(1)} kg
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                      +{ani.gmdDiarioKg.toFixed(2)} kg/dia
                    </td>
                    <td className="px-4 py-3 text-slate-600">{ani.lotePasto}</td>
                    <td className="px-4 py-3 text-center">
                      {emQuarentena ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="px-2.5 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
                            <Lock className="w-3 h-3" /> Em Carência até {ani.carenciaAteData}
                          </span>
                          <span className="text-[9px] text-red-300 mt-0.5 truncate max-w-[200px]" title={ani.medicamentoAplicado}>
                            {ani.medicamentoAplicado}
                          </span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[10px] font-bold flex items-center justify-center gap-1">
                          <Unlock className="w-3 h-3" /> Liberado p/ Abate
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnimal(ani);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          emQuarentena
                            ? 'bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700'
                            : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                        }`}
                      >
                        {emQuarentena ? 'Ver Bloqueio' : 'Detalhes & GTA'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Painel de Detalhes do Animal Selecionado */}
      {selectedAnimal && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in relative">
          <button
            onClick={() => setSelectedAnimal(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-slate-800"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-950 text-blue-400 border border-blue-800 rounded-xl font-bold font-mono text-sm">
              {selectedAnimal.brincoVisual}
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Ficha Zootécnica & Histórico RFID: {selectedAnimal.rfid}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  selectedAnimal.statusSanitario === 'EM_CARENCIA'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {selectedAnimal.statusSanitario === 'EM_CARENCIA' ? 'TRAVA SANITÁRIA ATIVA' : 'LIBERADO P/ ABATE'}
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                {selectedAnimal.raca} • {selectedAnimal.categoria} • {selectedAnimal.lotePasto}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 text-[10px] block">Peso Atual</span>
              <span className="text-white font-mono font-bold text-sm">{selectedAnimal.pesoAtualKg.toFixed(1)} kg</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 text-[10px] block">Ganho Médio Diário</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">+{selectedAnimal.gmdDiarioKg.toFixed(2)} kg/dia</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 text-[10px] block">Medicamento Aplicado</span>
              <span className="text-amber-400 font-medium text-xs truncate block">{selectedAnimal.medicamentoAplicado || 'Nenhum ativo recente'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 text-[10px] block">Carência até</span>
              <span className="text-white font-mono font-bold text-sm">{selectedAnimal.carenciaAteData || 'Liberado'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
