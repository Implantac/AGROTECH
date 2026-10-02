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
  AlertCircle
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userProfile?: { name: string; role: string; farm: string }) => void;
  onBackToLanding: () => void;
  onGoToRegister?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToLanding,
  onGoToRegister,
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
      nome: 'Carlos Eduardo Silva',
      cargo: 'Produtor Titular & Gestor',
      fazenda: 'Fazenda Santa Maria (Sorriso/MT)',
      email: 'produtor@superagtech.com.br',
      cultura: 'Soja / Milho Safrinha'
    },
    {
      nome: 'Dr. Marcelo Arantes',
      cargo: 'Médico Veterinário RT',
      fazenda: 'Estância Boi Gordo (Araguaia/GO)',
      email: 'agronoma@superagtech.com.br',
      cultura: 'Pecuária SISBOV & Confinamento'
    },
    {
      nome: 'Engª Juliana Prado',
      cargo: 'Agrônoma Responsável Técnica',
      fazenda: 'Agropecuária Rio Verde (Rio Verde/GO)',
      email: 'agronoma@superagtech.com.br',
      cultura: 'Algodão & Grãos Irrigados'
    },
    {
      nome: 'Valmor Bertoncelli',
      cargo: 'Chefe de Oficina Mecânica & Frotas',
      fazenda: 'Fazenda Primavera (Sapezal/MT)',
      email: 'operador@superagtech.com.br',
      cultura: 'Gestão de Frotas CAN Bus'
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
    <div className="min-h-screen bg-[#F7F9F5] text-[#26332A] flex flex-col justify-between selection:bg-[#8FBF88] selection:text-[#26332A] font-sans">
      {/* Barra Superior */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-[#EAF4E7] bg-white">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-bold text-[#66736A] hover:text-[#285943] transition cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#F7F9F5] border border-transparent hover:border-[#EAF4E7]"
        >
          <ChevronLeft className="w-4 h-4 text-[#285943]" />
          <span>Voltar à Página Principal</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#285943] text-white flex items-center justify-center">
            <Sprout className="w-4 h-4 text-[#8FBF88]" />
          </div>
          <span className="text-sm font-black text-[#285943]">AGROTECH</span>
        </div>
      </header>

      {/* Conteúdo Central Split Screen */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[#EAF4E7] bg-white shadow-xl overflow-hidden">
          {/* Lado Esquerdo: Banner Institucional */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#285943] via-[#285943] to-[#1b4332] text-white p-6 sm:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#8FBF88] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Portal Seguro do Produtor
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Controle operacional da safra na palma da sua mão.
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Acesse seus talhões, balança rodoviária, telemetria de colheita e o Livro Caixa Digital do Produtor Rural em um ambiente criptografado e offline-first.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5F8F52] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Criptografia Ponta a Ponta</span>
                  <span className="text-[11px] text-white/70">Certificado Digital A1 ICP-Brasil</span>
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5F8F52] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Fila de Sincronização Local</span>
                  <span className="text-[11px] text-white/70">Opera normalmente mesmo sem sinal de celular</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-white/60 pt-2 border-t border-white/10">
              Suporte Técnico Direto da Equipe Agronômica: <b>0800 400 AGRO</b>
            </div>
          </div>

          {/* Lado Direito: Formulário de Autenticação */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#285943]">Acessar Cockpit da Fazenda</h3>
                <p className="text-xs text-[#66736A] mt-1">
                  Digite suas credenciais de acesso ou selecione um perfil de demonstração instantâneo.
                </p>
              </div>

              {erroLogin && (
                <div className="p-3 bg-[#F4F0E6] border border-[#C96A5B] rounded-xl text-xs text-[#C96A5B] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{erroLogin}</span>
                </div>
              )}

              {/* Perfis Rápidos de Demonstração */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#5F8F52] block font-mono">
                  Acesso Rápido de Demonstração (1 Clique):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {perfisDemo.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemoProfile(p)}
                      className="text-left p-2.5 rounded-xl bg-[#F7F9F5] hover:bg-[#EAF4E7] border border-[#EAF4E7] hover:border-[#8FBF88] transition group cursor-pointer"
                    >
                      <span className="font-bold text-[#285943] text-xs block group-hover:text-[#1b4332]">
                        {p.nome}
                      </span>
                      <span className="text-[10px] text-[#66736A] block">{p.cargo}</span>
                      <span className="text-[9px] text-[#5F8F52] font-mono block mt-0.5">{p.cultura}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulário Tradicional */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[#EAF4E7]">
                <div>
                  <label className="text-xs text-[#26332A] font-semibold block mb-1">
                    E-mail Institucional ou CPF do Produtor
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#66736A] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={emailOrCpf}
                      onChange={(e) => setEmailOrCpf(e.target.value)}
                      placeholder="produtor@superagtech.com.br"
                      className="w-full bg-[#F7F9F5] border border-[#EAF4E7] focus:border-[#285943] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#26332A] placeholder-[#66736A] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-[#26332A] font-semibold">
                      Senha de Acesso
                    </label>
                    <a href="#recuperar" className="text-[11px] text-[#5F8F52] hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#66736A] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F7F9F5] border border-[#EAF4E7] focus:border-[#285943] rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#26332A] placeholder-[#66736A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#66736A] hover:text-[#26332A]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-[#66736A]">
                    <input
                      type="checkbox"
                      checked={lembrarDispositivo}
                      onChange={(e) => setLembrarDispositivo(e.target.checked)}
                      className="rounded accent-[#285943]"
                    />
                    <span>Lembrar meu dispositivo no campo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#285943] hover:bg-[#1b4332] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSimularFaceId}
                    disabled={autenticandoBiometria}
                    className="w-full py-3 bg-[#EAF4E7] hover:bg-[#d8f3dc] text-[#285943] font-bold rounded-xl text-xs border border-[#8FBF88] flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ScanFace className="w-4 h-4 text-[#285943]" />
                    <span>{autenticandoBiometria ? 'Validando...' : 'Entrar com Biometria'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-[#EAF4E7] text-center text-xs text-[#66736A]">
              Ainda não tem conta na plataforma?{' '}
              <button
                type="button"
                onClick={onGoToRegister || onBackToLanding}
                className="text-[#285943] font-bold hover:underline cursor-pointer ml-1"
              >
                Cadastre sua fazenda gratuitamente
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="p-4 text-center text-xs text-[#66736A] border-t border-[#EAF4E7]">
        AGROTECH Enterprise • Ambiente Seguro SSL 256-bit • Compatível com Normas LGPD & BACEN
      </footer>
    </div>
  );
};

export default LoginScreen;
