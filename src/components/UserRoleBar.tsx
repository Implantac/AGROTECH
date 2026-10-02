import React, { useState } from 'react';
import {
  User,
  Crown,
  Sprout,
  Tractor,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { agroApi } from '../services/agroApiService';

export type UserProfileRole = 'PRODUTOR' | 'AGRONOMO' | 'OPERADOR' | 'CONTADOR';

interface UserRoleBarProps {
  onRoleChange?: (role: UserProfileRole) => void;
  onOpenQuickAccess?: () => void;
  profileId?: string;
}

export const UserRoleBar: React.FC<UserRoleBarProps> = ({ onRoleChange, profileId = 'AGRICULTURA_GRAOS' }) => {
  const [activeRole, setActiveRole] = useState<UserProfileRole>('PRODUTOR');
  const [userName, setUserName] = useState<string>('Dr. Fernando Silveira');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [sefazSuccessMsg, setSefazSuccessMsg] = useState<string | null>(null);

  const handleSelectRole = async (role: UserProfileRole) => {
    setIsSyncing(true);
    setActiveRole(role);
    const res = await agroApi.login(role);
    if (res && res.usuario) {
      setUserName(res.usuario.nome || `Usuário ${role}`);
    }
    if (onRoleChange) {
      onRoleChange(role);
    }
    setTimeout(() => setIsSyncing(false), 300);
  };

  const handleTestSefaz = async () => {
    setIsSyncing(true);
    let valorTotal = 158400.0;
    let discriminacao = '600 sacas de soja TMG 2381 IPRO';

    if (profileId === 'PECUARIA_CORTE_LEITE') {
      valorTotal = 78650.0;
      discriminacao = '18 cabeças de boi gordo Nelore para abate (325 @) - SISBOV / Cota Hilton';
    } else if (profileId === 'HORTIFRUTI_FLORICULTURA') {
      valorTotal = 30600.0;
      discriminacao = '450 caixas de tomate grape especial Gourmet (Brix 9.8)';
    } else if (profileId === 'BIOENERGIA_SUCROALCOOLEIRO') {
      valorTotal = 142500.0;
      discriminacao = '1.200 toneladas de cana-de-açúcar picada para moagem (ATR 142.5)';
    }

    const res = await agroApi.emitirNfeSefaz({
      valorTotal,
      discriminacao,
    });
    setIsSyncing(false);
    if (res && res.sucesso) {
      setSefazSuccessMsg(`NF-e Autorizada! Chave: ${res.chaveAcesso?.substring(0, 20)}...`);
      setTimeout(() => setSefazSuccessMsg(null), 5000);
    }
  };

  return (
    <div className="bg-[#0A2016] border-b border-[#184530] px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
      {/* Perfil & Seletor de Papel RBAC */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-300 font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span>Perfil Operacional:</span>
        </span>

        <div className="flex items-center bg-[#113323] p-0.5 rounded-lg border border-[#1E5239] gap-0.5">
          <button
            onClick={() => handleSelectRole('PRODUTOR')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeRole === 'PRODUTOR'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4B34]'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-300" />
            <span>Produtor</span>
          </button>

          <button
            onClick={() => handleSelectRole('AGRONOMO')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeRole === 'AGRONOMO'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4B34]'
            }`}
          >
            <Sprout className="w-3 h-3 text-emerald-300" />
            <span>Agrônomo</span>
          </button>

          <button
            onClick={() => handleSelectRole('OPERADOR')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeRole === 'OPERADOR'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4B34]'
            }`}
          >
            <Tractor className="w-3 h-3 text-emerald-200" />
            <span>Operador</span>
          </button>

          <button
            onClick={() => handleSelectRole('CONTADOR')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeRole === 'CONTADOR'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4B34]'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3 text-amber-300" />
            <span>Contador</span>
          </button>
        </div>

        <span className="hidden md:inline text-slate-300 font-medium text-[11px]">({userName})</span>
      </div>

      {/* Ações Técnicas & Status de Conexão */}
      <div className="flex items-center gap-2.5">
        {sefazSuccessMsg && (
          <span className="text-emerald-300 text-xs font-bold animate-pulse flex items-center gap-1 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {sefazSuccessMsg}
          </span>
        )}

        {/* Emissão Rápida SEFAZ A1 */}
        <button
          onClick={handleTestSefaz}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Simular Emissão e Assinatura Digital A1 SEFAZ"
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>SEFAZ A1</span>
        </button>

        {/* Status do Backend & Banco de Dados */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#113323] border border-[#1E5239] text-emerald-300 text-[11px] font-bold">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>PostGIS • ACID DB</span>
        </div>
      </div>
    </div>
  );
};
