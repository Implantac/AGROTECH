import React, { useState } from 'react';
import {
  Truck,
  Scale,
  Droplets,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ROMANEIOS_COLHEITA_INICIAIS, RomaneioColheitaData, TALHOES_INICIAIS } from '../data/mockAgroData';

export const RomaneioColheitaModule: React.FC = () => {
  const [romaneios, setRomaneios] = useState<RomaneioColheitaData[]>(ROMANEIOS_COLHEITA_INICIAIS);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);

  // Form states para pesagem do caminhão
  const [talhaoOrigemId, setTalhaoOrigemId] = useState('talhao-06');
  const [placa, setPlaca] = useState('BRA-9X21 (Bitrem 9 Eixos)');
  const [motorista, setMotorista] = useState('Edson Arantes');
  const [pesoBruto, setPesoBruto] = useState<number>(56800);
  const [tara, setTara] = useState<number>(18900);
  const [umidade, setUmidade] = useState<number>(14.5);
  const [impureza, setImpureza] = useState<number>(1.1);

  // Cálculos automáticos de desconto de armazém
  const pesoLiquidoInicial = pesoBruto - tara; // 37.900 kg
  const descontoUmidadeKg =
    umidade > 14.0 ? Math.round(pesoLiquidoInicial * ((umidade - 14.0) / 100) * 1.25) : 0;
  const descontoImpurezaKg =
    impureza > 1.0 ? Math.round(pesoLiquidoInicial * ((impureza - 1.0) / 100)) : 0;
  const pesoLiquidoFinal = pesoLiquidoInicial - descontoUmidadeKg - descontoImpurezaKg;
  const sacas60kgCalculadas = Number((pesoLiquidoFinal / 60).toFixed(1));

  const handleEmitirRomaneio = () => {
    const novo: RomaneioColheitaData = {
      id: `rom-0${romaneios.length + 1}`,
      numeroRomaneio: `ROM-2026-0019${romaneios.length + 1}`,
      dataHora: '25/09/2026 11:30',
      talhaoOrigemId,
      placaCaminhao: placa,
      motoristaNome: motorista,
      pesoBrutoKg: pesoBruto,
      taraCaminhaoKg: tara,
      pesoLiquidoKg: pesoLiquidoInicial,
      umidadePercentual: umidade,
      descontoUmidadeKg,
      impurezaPercentual: impureza,
      descontoImpurezaKg,
      pesoLiquidoFinalKg: pesoLiquidoFinal,
      sacas60kgFinal: sacas60kgCalculadas,
      armazemDestino: 'Terminal Ferroviário Rumo / Cargill Sinop',
      status: 'EM_TRANSITO',
    };

    setRomaneios([novo, ...romaneios]);
    setModalNovoOpen(false);
    alert(`✓ Romaneio ${novo.numeroRomaneio} emitido com sucesso!
Peso Líquido Final: ${pesoLiquidoFinal.toLocaleString('pt-BR')} kg (${sacas60kgCalculadas} sacas limpas e secas).`);
  };

  const totalSacasRomaneadas = romaneios.reduce((acc, curr) => acc + curr.sacas60kgFinal, 0);
  const totalCargas = romaneios.length;

  return (
    <div className="space-y-6">
      {/* Top Banner de Romaneios e Balança */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" /> Balança Rodoviária & Rastreabilidade de Grãos
            </span>
            <span className="text-xs text-slate-400">Escoamento da Safra • Fazenda Santa Helena</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" /> Romaneios de Carga, Pesagem e Descontos Técnicos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cálculo automático de descontos por umidade (base 14%) e impureza (base 1%) para acompanhar a NFP-e de transporte.
          </p>
        </div>

        <button
          onClick={() => setModalNovoOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Pesar Caminhão na Balança
        </button>
      </div>

      {/* Cards de Resumo da Colheita do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Cargas Romaneadas Hoje</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {totalCargas} <span className="text-xs font-normal text-slate-400">caminhões</span>
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">Balança Rodoviária Ativa</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Volume Líquido Limpo e Seco</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {totalSacasRomaneadas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-slate-400">sc</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">{(totalSacasRomaneadas * 60 / 1000).toFixed(1)} toneladas líquidas</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Média de Umidade Recebida</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400 font-mono">
            14.3%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Dentro da margem de segurança</span>
        </div>
      </div>

      {/* Tabela de Romaneios de Carga */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white">Romaneios Emitidos (Balança da Fazenda)</h3>
            <p className="text-xs text-slate-400">Rastreabilidade ponta a ponta desde o talhão até o armazém geral</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Romaneio / Data</th>
                <th className="px-4 py-3">Veículo / Motorista</th>
                <th className="px-4 py-3">Talhão Origem</th>
                <th className="px-4 py-3 text-right">Peso Líquido Inicial</th>
                <th className="px-4 py-3 text-center">Umidade / Impureza</th>
                <th className="px-4 py-3 text-right text-emerald-400">Peso Final (Limpo/Seco)</th>
                <th className="px-4 py-3 text-right text-amber-400 font-bold">Sacas (60kg)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {romaneios.map((rom) => {
                const talhao = TALHOES_INICIAIS.find((t) => t.id === rom.talhaoOrigemId);

                return (
                  <tr key={rom.id} className="hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-white block">{rom.numeroRomaneio}</span>
                      <span className="text-[10px] text-slate-400">{rom.dataHora}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-200 block">{rom.placaCaminhao}</span>
                      <span className="text-[10px] text-slate-400">{rom.motoristaNome}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-400">{talhao?.codigo}</span>
                      <span className="text-[10px] text-slate-400 block">{talhao?.nome}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      {rom.pesoLiquidoKg.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      <span className={rom.umidadePercentual > 14 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {rom.umidadePercentual}% U
                      </span>
                      <span className="text-slate-500 mx-1">|</span>
                      <span className={rom.impurezaPercentual > 1 ? 'text-amber-400' : 'text-slate-300'}>
                        {rom.impurezaPercentual}% Imp
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">
                      {rom.pesoLiquidoFinalKg.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-amber-400">
                      {rom.sacas60kgFinal.toFixed(1)} sc
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rom.status === 'DESCARREGADO_ARMAZEM'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-blue-950 text-blue-400'
                        }`}
                      >
                        {rom.status === 'DESCARREGADO_ARMAZEM' ? 'Descarregado' : 'Em Trânsito'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          alert(`Imprimindo Ticket de Balança & Romaneio de Carga ${rom.numeroRomaneio} com QR Code para acompanhar NFP-e.`)
                        }
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold border border-slate-700 flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3 h-3 text-slate-400" /> Imprimir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Pesagem */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full shadow-2xl text-slate-200 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" /> Nova Pesagem na Balança Rodoviária
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Placa do Caminhão</label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Motorista</label>
                  <input
                    type="text"
                    value={motorista}
                    onChange={(e) => setMotorista(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Talhão de Origem (Colheita)</label>
                <select
                  value={talhaoOrigemId}
                  onChange={(e) => setTalhaoOrigemId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {TALHOES_INICIAIS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.codigo} - {t.nome} ({t.cultura})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Peso Bruto (kg)</label>
                  <input
                    type="number"
                    value={pesoBruto}
                    onChange={(e) => setPesoBruto(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tara do Caminhão (kg)</label>
                  <input
                    type="number"
                    value={tara}
                    onChange={(e) => setTara(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Umidade (% sensor)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={umidade}
                    onChange={(e) => setUmidade(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Impureza (% peneira)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={impureza}
                    onChange={(e) => setImpureza(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
                  />
                </div>
              </div>

              {/* Prévia dos Cálculos de Desconto */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Peso Líquido Inicial:</span>
                  <span className="font-mono">{pesoLiquidoInicial.toLocaleString('pt-BR')} kg</span>
                </div>
                <div className="flex justify-between text-amber-400 text-[11px]">
                  <span>Desconto de Umidade + Impureza:</span>
                  <span className="font-mono">-{descontoUmidadeKg + descontoImpurezaKg} kg</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 border-t border-slate-800 pt-1">
                  <span>Peso Líquido Final:</span>
                  <span className="font-mono">{pesoLiquidoFinal.toLocaleString('pt-BR')} kg ({sacas60kgCalculadas} sc)</span>
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
                onClick={handleEmitirRomaneio}
                className="px-4 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
              >
                Emitir Ticket & Romaneio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
