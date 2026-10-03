import React from 'react';
import { Droplets, Thermometer, Wind, X, ShieldCheck } from 'lucide-react';

interface DeltaTModalProps {
  isOpen: boolean;
  onClose: () => void;
  estacao?: string;
  tempArC?: number;
  tempBulboUmidoC?: number;
  umidadeRelativaPct?: number;
  ventoKmH?: number;
  deltaTC?: number;
  mensagemTecnica?: string;
}

export const DeltaTModal: React.FC<DeltaTModalProps> = ({
  isOpen,
  onClose,
  estacao = 'Estação Davis Vantage Pro2 Plus • Sede Gleba 1 (Sorriso/MT)',
  tempArC = 26.8,
  tempBulboUmidoC = 21.6,
  umidadeRelativaPct = 62,
  ventoKmH = 7.5,
  deltaTC = 5.2,
  mensagemTecnica = 'Condições ideais para pulverização foliar. Gotas com máxima deposição e mínima perda por deriva ou evaporação.',
}) => {
  if (!isOpen) return null;

  const isOptimal = deltaTC >= 2.0 && deltaTC <= 8.0 && ventoKmH >= 3.0 && ventoKmH <= 12.0;

  return (
    <div className="fixed inset-0 z-[1250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full shadow-2xl text-slate-900 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Monitoramento Psicrométrico de Delta T (ΔT)
              </h3>
              <p className="text-xs text-slate-500">{estacao}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">Valor Atual de Delta T:</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono text-emerald-800">
                {deltaTC} °C
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {isOptimal ? 'JANELA SEGURA' : 'ALERTA TÉCNICO'}
              </span>
            </div>
          </div>

          {/* Barra de Faixas de Delta T */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0°C (Inversão)</span>
              <span className="text-emerald-700 font-bold">2°C a 8°C (Janela Ideal)</span>
              <span>12°C (Evaporação)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 flex overflow-hidden">
              <div className="w-[16%] bg-amber-400" title="0°C a 2°C: Risco de Inversão"></div>
              <div className="w-[50%] bg-emerald-600" title="2°C a 8°C: Faixa Ideal"></div>
              <div className="w-[34%] bg-rose-500" title="> 8°C: Risco de Evaporação"></div>
            </div>
          </div>

          <p className="text-xs text-emerald-900 font-medium leading-relaxed bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
            {mensagemTecnica}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-500 block">TEMP. SECO</span>
            <span className="font-bold text-slate-900 text-sm">{tempArC}°C</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-500 block">TEMP. ÚMIDO</span>
            <span className="font-bold text-sky-700 text-sm">{tempBulboUmidoC}°C</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-500 block">UMIDADE REL.</span>
            <span className="font-bold text-emerald-700 text-sm">{umidadeRelativaPct}%</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-500 block">VELOC. VENTO</span>
            <span className="font-bold text-amber-700 text-sm">{ventoKmH} km/h</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 space-y-1">
          <p className="font-bold text-slate-800">
            Regra Agronômica Internacional ASABE S572:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[10px]">
            <li><strong>Abaixo de 2°C:</strong> As gotas não assentam; risco severo de deriva por inversão térmica.</li>
            <li><strong>Entre 2°C e 8°C:</strong> Janela de ouro. Deposição máxima da calda no alvo foliar.</li>
            <li><strong>Acima de 8°C:</strong> A gota evapora antes de tocar na folha; ineficiência química severa.</li>
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
