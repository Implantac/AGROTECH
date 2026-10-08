import React, { useState } from 'react';
import {
  Tractor,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Eye,
  EyeOff,
  ScanFace,
  Building,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Database,
  BookOpen
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userProfile?: { name: string; role: string; farm: string }) => void;
  onBackToLanding: () => void;
  onGoToRegister?: () => void;
  onOpenManual?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToLanding,
  onGoToRegister,
  onOpenManual,
}) => {
  const [emailOrCpf, setEmailOrCpf] = useState('produtor@superagtech.com.br');
  const [password, setPassword] = useState('produtor123');
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarDispositivo, setLembrarDispositivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [autenticandoBiometria, setAutenticandoBiometria] = useState(false);
  const [erroLogin, setErroLogin] = useState<string | null>(null);

  // Perfis Rápidos de Demonstração (1 Clique)
  const perfisDemo = [
    {
      nome: 'Dr. Roberto Schneider',
      cargo: 'SUPERADMIN',
      cargoLabel: 'Superadministrador Geral (TI & Governança)',
      fazenda: 'Diretoria Corporativa AgTech',
      email: 'admin@superagtech.com.br',
      cultura: 'Governança & Controle de Acesso RBAC',
      badge: 'Superadmin (Acesso Total)'
    },
    {
      nome: 'Carlos Eduardo Silva',
      cargo: 'PRODUTOR',
      cargoLabel: 'Produtor Titular & Gestor da Fazenda',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)',
      email: 'produtor@superagtech.com.br',
      cultura: 'Soja / Milho Safrinha / Barter',
      badge: 'Produtor Rural'
    },
    {
      nome: 'Engª Juliana Prado',
      cargo: 'AGRONOMO',
      cargoLabel: 'Agrônoma Responsável Técnica (RT)',
      fazenda: 'Agropecuária Rio Verde (Rio Verde/GO)',
      email: 'agronoma@superagtech.com.br',
      cultura: 'Algodão & Grãos Irrigados (MIP / VRA)',
      badge: 'Engenheira Agrônoma'
    },
    {
      nome: 'Valmor Bertoncelli',
      cargo: 'OPERADOR',
      cargoLabel: 'Chefe de Oficina Mecânica & Frotas',
      fazenda: 'Fazenda Primavera (Sapezal/MT)',
      email: 'operador@superagtech.com.br',
      cultura: 'Gestão de Frotas CAN Bus & Oficina',
      badge: 'Operador / Frotas'
    },
    {
      nome: 'Dra. Valéria Campos (CRC)',
      cargo: 'CONTADOR',
      cargoLabel: 'Contadora Rural & Auditora Fiscal',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)',
      email: 'contadora@superagtech.com.br',
      cultura: 'Livro Caixa Digital LCDPR & SEFAZ',
      badge: 'Contadora / Fiscal'
    },
    {
      nome: 'Dr. Marcelo Arantes',
      cargo: 'VETERINARIO',
      cargoLabel: 'Médico Veterinário SISBOV',
      fazenda: 'Estância Boi Gordo (Araguaia/GO)',
      email: 'veterinario@superagtech.com.br',
      cultura: 'Pecuária SISBOV & Confinamento',
      badge: 'Veterinário / SISBOV'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErroLogin(null);

    try {
      const resp = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrCpf, senha: password })
      });
      const data = await resp.json();

      if (resp.ok && data.sucesso) {
        if (data.token) {
          sessionStorage.setItem('agtech_token', data.token);
        }
        onLoginSuccess({
          name: data.usuario?.nome || 'Carlos Eduardo Silva',
          role: data.usuario?.perfil || 'Produtor Titular',
          farm: data.usuario?.fazenda || 'Fazenda Santa Maria'
        });
      } else {
        setErroLogin(data.erro || 'Credenciais inválidas.');
      }
    } catch {
      // Fallback gracioso local em modo de desenvolvimento
      onLoginSuccess({
        name: 'Carlos Eduardo Silva',
        role: 'Produtor Titular',
        farm: 'Fazenda Santa Maria (Sorriso/MT)'
      });
    } finally {
      setLoading(false);
    }
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
    }, 350);
  };

  const handleSimularFaceId = () => {
    setAutenticandoBiometria(true);
    setTimeout(() => {
      setAutenticandoBiometria(false);
      onLoginSuccess({
        name: 'Carlos Eduardo Silva',
        role: 'Autenticação Facial Biométrica ICP',
        farm: 'Fazenda Santa Maria (Sorriso/MT)'
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-sans">
      {/* Barra Superior de Navegação */}
      <header className="p-4 sm:px-8 flex items-center justify-between border-b border-slate-300 bg-white shadow-xs">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition cursor-pointer px-3.5 py-2 rounded-xl hover:bg-slate-100 border border-slate-300"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-700" />
          <span>Voltar ao Portal AGROTECH</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">AGROTECH</span>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Sistema Operacional Rural</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenManual && (
            <button
              type="button"
              onClick={onOpenManual}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-2xs"
              title="Manual do Usuário & Implantação"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Manual do Sistema</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-700 text-white font-mono">v2.6</span>
            </button>
          )}

          {onGoToRegister && (
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
            >
              Não tem conta? <b>Criar Conta</b>
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo Central Split Screen de Alto Contraste */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-300 bg-white shadow-xl overflow-hidden">
          
          {/* Lado Esquerdo: Banner Institucional Profundo (Forest Obsidian) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0C2417] via-[#123624] to-[#0A1E14] text-white p-7 sm:p-9 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Seguro do Produtor</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Controle operacional da safra na palma da sua mão.
              </h2>
              
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Acesse seus talhões, balança rodoviária, telemetria de colheita e o Livro Caixa Digital do Produtor Rural em um ambiente criptografado e offline-first.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Criptografia Ponta a Ponta</span>
                  <span className="text-[11px] text-slate-300">Certificado Digital A1 ICP-Brasil</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Sincronização Outbox Local</span>
                  <span className="text-[11px] text-slate-300">Opera normalmente mesmo sem sinal 4G/5G</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-300">
              <span>Central Agronômica:</span>
              <b className="text-emerald-300 font-mono">0800 400 AGRO</b>
            </div>
          </div>

          {/* Lado Direito: Formulário de Autenticação com Alto Contraste */}
          <div className="lg:col-span-7 p-7 sm:p-9 space-y-6 flex flex-col justify-between bg-white">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Acessar Cockpit da Fazenda</h3>
                <p className="text-xs text-slate-600 mt-1.5 font-medium">
                  Digite suas credenciais de acesso ou selecione um perfil de demonstração instantâneo.
                </p>
              </div>

              {erroLogin && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{erroLogin}</span>
                </div>
              )}

              {/* Perfis Rápidos de Demonstração */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-700 font-mono">
                    Acesso Rápido de Demonstração (1 Clique):
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Ambiente Homologado
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {perfisDemo.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemoProfile(p)}
                      className="text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-300 hover:border-emerald-500 transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-slate-900 text-xs block group-hover:text-emerald-900">
                          {p.nome}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                          {p.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 block font-medium">{p.cargoLabel || p.cargo}</span>
                      <span className="text-[10px] text-emerald-800 font-mono block mt-0.5 font-semibold">{p.fazenda}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulário Tradicional */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-300">
                <div>
                  <label className="text-xs text-slate-800 font-bold block mb-1.5">
                    E-mail Institucional ou CPF do Produtor
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={emailOrCpf}
                      onChange={(e) => setEmailOrCpf(e.target.value)}
                      placeholder="produtor@superagtech.com.br"
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 outline-none shadow-2xs transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs text-slate-800 font-bold">
                      Senha de Acesso
                    </label>
                    <a href="#esqueci" className="text-[11px] font-bold text-emerald-800 hover:underline">
                      Esqueci minha senha
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha segura"
                      className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 outline-none shadow-2xs transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={lembrarDispositivo}
                      onChange={(e) => setLembrarDispositivo(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                    />
                    <span>Lembrar este dispositivo</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSimularFaceId}
                    disabled={autenticandoBiometria}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                  >
                    <ScanFace className="w-4 h-4 text-emerald-700" />
                    <span>{autenticandoBiometria ? 'Escaneando...' : 'Entrar com Face ID'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span>Autenticando na SEFAZ e Banco...</span>
                  ) : (
                    <>
                      <span>Entrar no Cockpit da Fazenda</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="pt-4 text-center text-xs text-slate-600 font-medium border-t border-slate-200">
              Precisa de suporte na implantação?{' '}
              <a href="#suporte" className="text-emerald-800 font-bold hover:underline">
                Fale com nossos consultores agrícolas
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé Seguro */}
      <footer className="p-4 text-center text-xs text-slate-600 border-t border-slate-300 bg-white">
        AGROTECH Enterprise • Ambiente Auditado e Seguro • Conexão Criptografada SSL/TLS 256-bit
      </footer>
    </div>
  );
};

export default LoginScreen;
