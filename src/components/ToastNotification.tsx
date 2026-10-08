import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md animate-slide-up transition-all ${
            toast.type === 'success'
              ? 'bg-white border-emerald-200 text-slate-800'
              : toast.type === 'warning'
              ? 'bg-white border-amber-200 text-slate-800'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
            <div className="text-xs">
              <strong className="block font-bold text-slate-900 mb-0.5">
                {toast.type === 'success' ? 'Sucesso' : toast.type === 'warning' ? 'Atenção' : 'Notificação'}
              </strong>
              <p className="text-slate-600 leading-snug text-[11px] font-medium">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
