import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
}

export interface ToastNotificationProps {
  toasts?: ToastItem[];
  onDismiss?: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts = [],
  onDismiss = () => {}
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-slide-up transition-all ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-200'
              : toast.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/50 text-amber-200'
              : 'bg-slate-900/95 border-blue-500/50 text-blue-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
            <div className="text-xs">
              <strong className="block font-bold text-white mb-0.5">
                {toast.type === 'success' ? 'Lançamento Confirmado' : toast.type === 'warning' ? 'Atenção' : 'Notificação'}
              </strong>
              <p className="text-slate-300 leading-snug">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
