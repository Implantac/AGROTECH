import React, { useState } from 'react';
import {
  Tractor,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  ChevronLeft,
  UserCheck,
  Eye,
  EyeOff,
  ScanFace,
  Building,
  Sprout,
  Compass
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userProfile?: { name: string; role: string; farm: string }) => void;
  onBackToLanding: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [emailOrCpf, setEmailOrCpf] = useState('carlos.silva@fazendasthelena.com.br');
  const [password, setPassword] = useState('agro2026');
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarDispositivo, setLembrarDispositivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [autenticandoBiometria, setAutenticandoBiometria] = useState(false);

  // Perfis Rápidos de Demonstração (1 Clique)
  const perfisDemo = [
    {
      nome: 'Carlos Eduardo Silva',
      cargo: 'Produtor Titular & Gestor',
      fazenda: 'Fazenda Santa Helena (Sorriso/MT)',
      email: 'carlos.silva@fazendasthelena.com.br',
      cultura: 'Soja / Milho Safrinha'
    },
    {
      nome: 'Dr. Marcelo Arantes',
      cargo: 'Médico Veterinário RT',
      fazenda: 'Estância Boi Gordo (Araguaia/GO)',
      email: 'marcelo.arantes@pecuariagordo.com.br',
      cultura: 'Pecuária SISBOV & Confinamento'
    },
    {
      nome: 'Engª Juliana Prado',
      cargo: 'Agrônoma Responsável Técnica',
      fazenda: 'Agropecuária Rio Verde (Rio Verde/GO)',
      email: 'juliana.prado@rioverde.agr.br',
      cultura: 'Algodão & Grãos Irrigados'
    },
    {
      nome: 'Valmor Bertoncelli',
      cargo: 'Chefe de Oficina Mecânica & Frotas',
      fazenda: 'Fazenda Primavera (Sapezal/MT)',
      email: 'valmor.mecanica@primavera.agr.br',
      cultura: 'Gestão de Frotas CAN Bus'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: 'Carlos Eduardo Silva',
        role: 'Produtor Titular',
        farm: 'Fazenda Santa Helena (Sorriso/MT)'
      });
    }, 600);
  };

  const handleSelectDemoProfile = (p: typeof perfisDemo[0]) => {
    setEmailOrCpf(p.email);
    setPassword('••••••••');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: p.nome,
        role: p.cargo,
        farm: p.fazenda
      });
    }, 400);
  };

  const handleSimularFaceId = () => {
    setAutenticandoBiometria(true);
    setTimeout(() => {
      setAutenticandoBiometria(false);
      onLoginSuccess({
        name: 'Carlos Eduardo Silva',
        role: 'Autenticação Facial Biométrica ICP',
        farm: 'Fazenda Santa Helena (Sorriso/MT)'
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Barra Superior com Voltar */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <span>Voltar à Página Principal</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-500 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Tractor className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-sm font-black text-white">SUPER AGTECH</span>
        </div>
      </header>

      {/* Conteúdo Central Split Screen */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Lado Esquerdo: Banner de Boas-Vindas & Métricas Rurais */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 space-y-8 relative overflow-hidden">
            {/* Efeito Luminoso de Fundo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Portal Seguro do Produtor
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Controle operacional de safra na palma da sua mão.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Acesse seus talhões, balança rodoviária, telemetria de colheita e o Livro Caixa Digital do Produtor Rural em um ambiente 100% criptografado e offline-first.
              </p>
            </div>

            {/* Selos de Auditoria e Status */}
            <div className="space-y-3 relative z-10">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Criptografia Ponta a Ponta</span>
                  <span className="text-[11px] text-slate-400">Certificado Digital A1 ICP-Brasil</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Fila de Sincronização Local</span>
                  <span className="text-[11px] text-slate-400">Opera normalmente mesmo sem sinal de internet</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 relative z-10 pt-2 border-t border-slate-800">
              Suporte Técnico 24/7 para Emergências na Colheita: <b>0800 400 AGRO</b>
            </div>
          </div>

          {/* Lado Direito: Formulário de Autenticação */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Acessar Cockpit da Fazenda</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Digite suas credenciais de acesso ou selecione um perfil de demonstração instantâneo.
                </p>
              </div>

              {/* Perfis de Acesso Rápido para Avaliação */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block">
                  Acesso Rápido de Demonstração (1 Clique):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {perfisDemo.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemoProfile(p)}
                      className="text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition group cursor-pointer"
                    >
                      <span className="font-bold text-white text-xs block group-hover:text-amber-300">
                        {p.nome}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{p.cargo}</span>
                      <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">{p.cultura}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulário Tradicional */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    E-mail Institucional ou CPF do Produtor
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={emailOrCpf}
                      onChange={(e) => setEmailOrCpf(e.target.value)}
                      placeholder="produtor@fazenda.com.br ou 000.000.000-00"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-300 font-semibold">
                      Senha de Acesso
                    </label>
                    <a href="#recuperar" className="text-[11px] text-amber-400 hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                    <input
                      type="checkbox"
                      checked={lembrarDispositivo}
                      onChange={(e) => setLembrarDispositivo(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Lembrar meu dispositivo no campo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSimularFaceId}
                    disabled={autenticandoBiometria}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ScanFace className="w-4 h-4 text-emerald-400" />
                    <span>{autenticandoBiometria ? 'Lendo FaceID...' : 'Entrar com Biometria'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              Ainda não tem conta na plataforma?{' '}
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-amber-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Conheça nossos planos e assine
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé Seguro */}
      <footer className="p-4 text-center text-xs text-slate-600 border-t border-slate-900">
        Super AgTech • Ambiente Certificado SSL 256-bit • Compatível com Normas LGPD & BACEN
      </footer>
    </div>
  );
};

export default LoginScreen;
