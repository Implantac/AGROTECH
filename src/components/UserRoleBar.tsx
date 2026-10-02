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
    <div className="bg-[#1D4B38] border-b border-[#245B45] px-4 py-2 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs text-[#EAF4E7]">
      {/* Perfil & Seletor de Papel RBAC */}
      <div className="flex items-center gap-2">
        <span className="text-[#8FBF88] font-medium flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#8FBF88]" />
          <span className="hidden sm:inline">Perfil Operacional:</span>
        </span>

        <div className="flex items-center bg-[#15392A] p-1 rounded-xl border border-[#245B45] gap-1">
          <button
            onClick={() => handleSelectRole('PRODUTOR')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeRole === 'PRODUTOR'
                ? 'bg-[#5F8F52] text-white shadow-sm'
                : 'text-[#8FBF88] hover:text-white hover:bg-[#285943]'
            }`}
            title="Produtor / CEO: Acesso irrestrito a DRE, Finanças, Fazendas e Estratégia"
          >
            <Crown className="w-3 h-3 text-[#D9B65D]" />
            <span>Produtor</span>
          </button>

          <button
            onClick={() => handleSelectRole('AGRONOMO')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeRole === 'AGRONOMO'
                ? 'bg-[#5F8F52] text-white shadow-sm'
                : 'text-[#8FBF88] hover:text-white hover:bg-[#285943]'
            }`}
            title="Eng. Agrônomo: MIP, Adubação, BioAS, Manejo e ZARC"
          >
            <Sprout className="w-3 h-3 text-[#8FBF88]" />
            <span>Agrônomo</span>
          </button>

          <button
            onClick={() => handleSelectRole('OPERADOR')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeRole === 'OPERADOR'
                ? 'bg-[#5F8F52] text-white shadow-sm'
                : 'text-[#8FBF88] hover:text-white hover:bg-[#285943]'
            }`}
            title="Operador de Máquinas: Apontamentos, Frota CAN Bus e Comboio"
          >
            <Tractor className="w-3 h-3 text-[#7DA9C4]" />
            <span>Operador</span>
          </button>

          <button
            onClick={() => handleSelectRole('CONTADOR')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeRole === 'CONTADOR'
                ? 'bg-[#5F8F52] text-white shadow-sm'
                : 'text-[#8FBF88] hover:text-white hover:bg-[#285943]'
            }`}
            title="Contador / Auditor Fiscal: LCDPR, NF-e, MDF-e e Retenções"
          >
            <FileSpreadsheet className="w-3 h-3 text-[#D9B65D]" />
            <span>Contador</span>
          </button>
        </div>

        <span className="hidden md:inline text-[#8FBF88]/80 font-medium">({userName})</span>
      </div>

      {/* Cotações em Tempo Real e Status do Banco de Dados */}
      <div className="flex items-center gap-3">
        {marketQuotes && (
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#8FBF88] border-r border-[#245B45] pr-3">
            {profileId === 'PECUARIA_CORTE_LEITE' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Boi Gordo B3:</span>
                  <strong className="text-white">R$ {marketQuotes.boiGordoB3ArrobaReais || 242.0}/@</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Bezerro Nelore:</span>
                  <strong className="text-[#D9B65D]">R$ 2.150/cab</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Leite CEPEA:</span>
                  <strong className="text-[#7DA9C4]">R$ 2,78/L</strong>
                </span>
              </>
            ) : profileId === 'HORTIFRUTI_FLORICULTURA' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Tomate Ceagesp:</span>
                  <strong className="text-white">R$ 68,00/cx</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Batata Especial:</span>
                  <strong className="text-[#D9B65D]">R$ 115,00/sc</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Morango Premium:</span>
                  <strong className="text-[#C96A5B]">R$ 24,50/kg</strong>
                </span>
              </>
            ) : profileId === 'BIOENERGIA_SUCROALCOOLEIRO' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">ATR Consecana:</span>
                  <strong className="text-white">R$ 1,22/kg</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Etanol Hidratado:</span>
                  <strong className="text-[#D9B65D]">R$ 2,45/L</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">CBIO B3:</span>
                  <strong className="text-[#8FBF88]">R$ 94,50/un</strong>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Soja FOB:</span>
                  <strong className="text-white">R$ {marketQuotes.sojaFobSantosSacaReais}/sc</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-[#8FBF88]/70">Milho B3:</span>
                  <strong className="text-[#D9B65D]">R$ {marketQuotes.milhoB3SacaReais}/sc</strong>
                </span>
              </>
            )}
            <span className="flex items-center gap-1">
              <span className="text-[#8FBF88]/70">Dólar PTAX:</span>
              <strong className="text-white">R$ {marketQuotes.dolarPtaxBacen}</strong>
            </span>
          </div>
        )}

        {/* Emissão Rápida SEFAZ A1 */}
        <button
          onClick={handleTestSefaz}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#285943] hover:bg-[#1b4332] border border-[#5F8F52]/40 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
          title="Simular Emissão e Assinatura Digital A1 SEFAZ"
        >
          <FileCheck className="w-3.5 h-3.5 text-[#8FBF88]" />
          <span className="hidden sm:inline">SEFAZ A1</span>
        </button>

        {sefazSuccessMsg && (
          <span className="text-[#8FBF88] text-xs font-semibold animate-pulse flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {sefazSuccessMsg}
          </span>
        )}

        {/* Status do Backend & Banco de Dados */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#285943] border border-[#5F8F52]/50 text-[#8FBF88] text-[11px] font-semibold">
          <Database className="w-3 h-3 text-[#8FBF88]" />
          <span>PostGIS + JSON DB</span>
        </div>
      </div>
    </div>
  );
};
