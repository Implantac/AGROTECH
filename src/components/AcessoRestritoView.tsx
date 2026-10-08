import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AcessoRestritoViewProps {
  moduleName: string;
  moduleId: string;
  userRole: string;
  userName: string;
  isSuperAdminUser: boolean;
  onOpenSuperadminModal?: () => void;
  onReturnToAllowedModule: () => void;
}

export const AcessoRestritoView: React.FC<AcessoRestritoViewProps> = ({
  moduleName,
  moduleId,
  userRole,
  userName,
  isSuperAdminUser,
  onOpenSuperadminModal,
  onReturnToAllowedModule,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 mx-auto flex items-center justify-center shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            CONTROLE DE ACESSO RBAC
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Acesso Restrito ao Recurso
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            O módulo <strong>{moduleName}</strong> (<span className="font-mono text-slate-500">{moduleId}</span>) não faz parte do pacote de recursos padrão atribuído ao perfil{' '}
            <strong className="text-slate-900">{userRole}</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Usuário Autenticado:</span>
            <span className="font-bold text-slate-900">{userName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Perfil Ativo:</span>
            <span className="font-bold text-slate-800">{userRole}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-200 pt-2">
            <span className="text-slate-500">Status de Liberação:</span>
            <span className="text-amber-800 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Requer Liberação pelo Superadmin
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReturnToAllowedModule}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Recursos Permitidos
          </button>

          {isSuperAdminUser && onOpenSuperadminModal && (
            <button
              onClick={onOpenSuperadminModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Liberar este Recurso (Superadmin)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
