import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Crown,
  Sprout,
  Tractor,
  FileSpreadsheet,
  Database,
  RefreshCw,
  TrendingUp,
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

export const UserRoleBar: React.FC<UserRoleBarProps> = ({ onRoleChange, onOpenQuickAccess, profileId = 'AGRICULTURA_GRAOS' }) => {
  const [activeRole, setActiveRole] = useState<UserProfileRole>('PRODUTOR');
  const [userName, setUserName] = useState<string>('Dr. Fernando Silveira');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [marketQuotes, setMarketQuotes] = useState<any>(null);
  const [sefazSuccessMsg, setSefazSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    agroApi.getCotacoesMercado().then((data) => {
      setMarketQuotes(data);
    });
  }, []);

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
    setTimeout(() => setIsSyncing(false), 400);
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
    <div className="bg-[#0B2318] border-b border-[#1A4533] px-4 py-2 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs text-white">
      {/* Perfil & Seletor de Papel RBAC */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-300 font-bold flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Perfil Operacional:</span>
        </span>

        <div className="flex items-center bg-[#133A27] p-1 rounded-xl border border-[#235840] gap-1 shadow-2xs">
          <button
            onClick={() => handleSelectRole('PRODUTOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeRole === 'PRODUTOR'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4F35]'
            }`}
            title="Produtor / CEO: Acesso irrestrito a DRE, Finanças, Fazendas e Estratégia"
          >
            <Crown className="w-3 h-3 text-amber-300" />
            <span>Produtor</span>
          </button>

          <button
            onClick={() => handleSelectRole('AGRONOMO')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeRole === 'AGRONOMO'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4F35]'
            }`}
            title="Eng. Agrônomo: MIP, Adubação, BioAS, Manejo e ZARC"
          >
            <Sprout className="w-3 h-3 text-emerald-300" />
            <span>Agrônomo</span>
          </button>

          <button
            onClick={() => handleSelectRole('OPERADOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeRole === 'OPERADOR'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4F35]'
            }`}
            title="Operador de Máquinas: Apontamentos, Frota CAN Bus e Comboio"
          >
            <Tractor className="w-3 h-3 text-sky-300" />
            <span>Operador</span>
          </button>

          <button
            onClick={() => handleSelectRole('CONTADOR')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeRole === 'CONTADOR'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-[#1A4F35]'
            }`}
            title="Contador / Auditor Fiscal: LCDPR, NF-e, MDF-e e Retenções"
          >
            <FileSpreadsheet className="w-3 h-3 text-amber-300" />
            <span>Contador</span>
          </button>
        </div>

        <span className="hidden md:inline text-slate-300 font-medium">({userName})</span>
      </div>

      {/* Cotações em Tempo Real e Status do Banco de Dados */}
      <div className="flex items-center gap-3">
        {marketQuotes && (
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-300 border-r border-[#235840] pr-3 font-mono">
            {profileId === 'PECUARIA_CORTE_LEITE' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Boi B3:</span>
                  <strong className="text-white font-bold">R$ {marketQuotes.boiGordoB3ArrobaReais || 242.0}/@</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Bezerro:</span>
                  <strong className="text-amber-400 font-bold">R$ 2.150/cab</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Leite CEPEA:</span>
                  <strong className="text-sky-300 font-bold">R$ 2,78/L</strong>
                </span>
              </>
            ) : profileId === 'HORTIFRUTI_FLORICULTURA' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Tomate Ceagesp:</span>
                  <strong className="text-white font-bold">R$ 68,00/cx</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Batata:</span>
                  <strong className="text-amber-400 font-bold">R$ 115,00/sc</strong>
                </span>
              </>
            ) : profileId === 'BIOENERGIA_SUCROALCOOLEIRO' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">ATR Consecana:</span>
                  <strong className="text-white font-bold">R$ 1,22/kg</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Etanol:</span>
                  <strong className="text-amber-400 font-bold">R$ 2,45/L</strong>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Soja FOB:</span>
                  <strong className="text-white font-bold">R$ {marketQuotes.sojaFobSantosSacaReais}/sc</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-sans">Milho B3:</span>
                  <strong className="text-amber-400 font-bold">R$ {marketQuotes.milhoB3SacaReais}/sc</strong>
                </span>
              </>
            )}
            <span className="flex items-center gap-1">
              <span className="text-slate-300 font-sans">Dólar:</span>
              <strong className="text-emerald-300 font-bold">R$ {marketQuotes.dolarPtaxBacen}</strong>
            </span>
          </div>
        )}

        {/* Emissão Rápida SEFAZ A1 */}
        <button
          onClick={handleTestSefaz}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Simular Emissão e Assinatura Digital A1 SEFAZ"
        >
          <FileCheck className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">SEFAZ A1</span>
        </button>

        {sefazSuccessMsg && (
          <span className="text-emerald-300 text-xs font-bold animate-pulse flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {sefazSuccessMsg}
          </span>
        )}

        {/* Status do Backend & Banco de Dados */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#133A27] border border-[#235840] text-emerald-300 text-[11px] font-bold shadow-2xs">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>PostGIS + ACID DB</span>
        </div>
      </div>
    </div>
  );
};
