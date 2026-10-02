import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Sparkles,
  Info,
  X
} from 'lucide-react';

interface TickerItem {
  id: string;
  nome: string;
  valor: string;
  unidade: string;
  variacaoPct: number;
  tipo: 'ALTA' | 'BAIXA' | 'ESTAVEL';
}

interface DeltaTData {
  estacaoMeteorologica: string;
  tempArC: number;
  umidadeRelativaPct: number;
  ventoKmH: number;
  direcaoVento: string;
  tempBulboUmidoC: number;
  deltaTC: number;
  statusJanela: string;
  corAlerta: string;
  mensagemTecnica: string;
}

interface HeaderFintechBarProps {
  onOpenDossie: () => void;
}

export const HeaderFintechBar: React.FC<HeaderFintechBarProps> = ({ onOpenDossie }) => {
  const [ticker, setTicker] = useState<TickerItem[]>([
    { id: 'soja_cbot', nome: 'Soja Chicago', valor: '1.185,50', unidade: 'US$/bu', variacaoPct: +1.25, tipo: 'ALTA' },
    { id: 'milho_b3', nome: 'Milho B3 Futuro', valor: '68,40', unidade: 'R$/sc', variacaoPct: +0.60, tipo: 'ALTA' },
    { id: 'boi_gordo_b3', nome: 'Boi Gordo B3', valor: '242,50', unidade: 'R$/@', variacaoPct: +0.82, tipo: 'ALTA' },
    { id: 'dolar_ptax', nome: 'Dólar PTAX', valor: '5,4210', unidade: 'R$', variacaoPct: -0.35, tipo: 'BAIXA' },
    { id: 'ureia_cfr', nome: 'Uréia Paranaguá', valor: '385,00', unidade: 'US$/t', variacaoPct: 0.0, tipo: 'ESTAVEL' },
    { id: 'etanol_hidratado', nome: 'Etanol Paulínia', valor: '2,3420', unidade: 'R$/L', variacaoPct: +1.10, tipo: 'ALTA' },
  ]);

  const [deltaT, setDeltaT] = useState<DeltaTData>({
    estacaoMeteorologica: 'Estação Davis Vantage Pro2 Plus - Sede Gleba 1',
    tempArC: 26.8,
    umidadeRelativaPct: 62,
    ventoKmH: 7.5,
    direcaoVento: 'SE (Sudeste) 135°',
    tempBulboUmidoC: 21.6,
    deltaTC: 5.2,
    statusJanela: 'OPTIMAL',
    corAlerta: 'EMERALD',
    mensagemTecnica: 'Condições ideais para pulverização. Gotas com máxima deposição e mínima perda.',
  });

  const [modalDeltaTOpen, setModalDeltaTOpen] = useState<boolean>(false);

  // Busca dados de cotações e Delta T em tempo real
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [respTicker, respClima] = await Promise.all([
          fetch('/api/v1/mercado/ticker'),
          fetch('/api/v1/clima/delta-t'),
        ]);

        if (respTicker.ok) {
          const dataT = await respTicker.json();
          if (dataT.cotacoes) setTicker(dataT.cotacoes);
        }

        if (respClima.ok) {
          const dataC = await respClima.json();
          if (dataC.deltaTC) setDeltaT(dataC);
        }
      } catch (err) {
        // Fallback silencioso mantendo estado prévio
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#15392A] border-b border-[#245B45] px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#EAF4E7]">
      {/* Ticker Financeiro e Commodities em Rolagem Elegante */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
        <span className="text-[10px] font-black uppercase text-[#8FBF88] flex items-center gap-1 shrink-0 bg-[#1D4B38] px-2 py-0.5 rounded-lg border border-[#285943]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8FBF88] animate-pulse"></span>
          B3 • CBOT • CEPEA
        </span>

        <div className="flex items-center gap-3 shrink-0">
          {ticker.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 bg-[#1D4B38]/90 px-2.5 py-0.5 rounded-lg border border-[#285943] text-[11px] font-mono shrink-0 hover:border-[#8FBF88]/50 transition-all"
            >
              <span className="text-[#8FBF88] font-sans">{item.nome}:</span>
              <span className="text-white font-bold">{item.valor}</span>
              <span className="text-[10px] text-[#8FBF88]/70">{item.unidade}</span>
              <span
                className={`text-[10px] font-bold flex items-center ${
                  item.variacaoPct > 0
                    ? 'text-[#8FBF88]'
                    : item.variacaoPct < 0
                    ? 'text-[#C96A5B]'
                    : 'text-[#EAF4E7]'
                }`}
              >
                {item.variacaoPct > 0 ? '▲' : item.variacaoPct < 0 ? '▼' : '▬'}
                {Math.abs(item.variacaoPct)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cockpit Climático: Indicador Psicrométrico de Delta T & Ação de Dossiê */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Widget de Delta T */}
        <button
          onClick={() => setModalDeltaTOpen(true)}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
            deltaT.statusJanela === 'OPTIMAL'
              ? 'bg-[#1D4B38] border-[#285943] text-[#8FBF88] hover:bg-[#285943]'
              : 'bg-[#422C1A] border-[#D9B65D]/60 text-[#D9B65D] hover:bg-[#523720]'
          }`}
          title="Clique para ver o relatório meteorológico detalhado de pulverização"
        >
          <div className="flex items-center gap-1 font-bold">
            <Droplets className="w-3.5 h-3.5" />
            <span>ΔT {deltaT.deltaTC}°C</span>
          </div>
          <span className="h-3 w-px bg-[#285943]"></span>
          <div className="flex items-center gap-1 text-[10px] font-sans">
            <Thermometer className="w-3 h-3 text-[#8FBF88]" />
            <span>{deltaT.tempArC}°C</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-sans">
            <Wind className="w-3 h-3 text-[#8FBF88]" />
            <span>{deltaT.ventoKmH} km/h</span>
          </div>
          <span
            className={`px-1.5 py-0.2 rounded text-[9px] font-black font-sans uppercase ${
              deltaT.statusJanela === 'OPTIMAL'
                ? 'bg-[#5F8F52] text-white'
                : 'bg-[#D9B65D] text-[#26332A]'
            }`}
          >
            {deltaT.statusJanela === 'OPTIMAL' ? 'JANELA SEGURA' : 'ALERTA DERIVA'}
          </span>
        </button>

        {/* Botão de Dossiê Bancário Executivo */}
        <button
          onClick={onOpenDossie}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#285943] hover:bg-[#1b4332] text-white font-bold rounded-lg text-[11px] border border-[#5F8F52]/50 shadow-sm transition-all cursor-pointer"
          title="Compilar Dossiê Executivo de Crédito Rural (Plano Safra / Bancos)"
        >
          <FileCheck className="w-3.5 h-3.5 text-[#8FBF88]" />
          <span>Dossiê Bancário</span>
        </button>
      </div>

      {/* Modal Técnico de Análise Psicrométrica Delta T */}
      {modalDeltaTOpen && (
        <div className="fixed inset-0 z-[1250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl max-w-lg w-full shadow-2xl text-[#26332A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAF4E7] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF4E7] text-[#285943] border border-[#8FBF88] flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1D4B38]">
                    Monitoramento Psicrométrico de Delta T (ΔT)
                  </h3>
                  <p className="text-xs text-[#66736A]">{deltaT.estacaoMeteorologica}</p>
                </div>
              </div>
              <button
                onClick={() => setModalDeltaTOpen(false)}
                className="text-[#66736A] hover:text-[#1D4B38] p-1.5 rounded-lg hover:bg-[#F7F9F5] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#F7F9F5] rounded-xl border border-[#EAF4E7] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#66736A]">Valor Atual de Delta T:</span>
                <span className="text-xl font-black font-mono text-[#285943]">
                  {deltaT.deltaTC} °C
                </span>
              </div>

              {/* Barra de Faixas de Delta T */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#66736A] font-mono">
                  <span>0°C (Inversão)</span>
                  <span className="text-[#285943] font-bold">2°C a 8°C (Ideal)</span>
                  <span>12°C (Evaporação)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EAF4E7] flex overflow-hidden">
                  <div className="w-[16%] bg-amber-500" title="0°C a 2°C: Risco de Inversão"></div>
                  <div className="w-[50%] bg-[#5F8F52]" title="2°C a 8°C: Faixa Ideal"></div>
                  <div className="w-[34%] bg-rose-500" title="> 8°C: Risco de Evaporação"></div>
                </div>
              </div>

              <p className="text-xs text-[#1D4B38] font-medium leading-relaxed bg-[#EAF4E7] p-2.5 rounded-lg border border-[#8FBF88]">
                {deltaT.mensagemTecnica}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 bg-[#F7F9F5] border border-[#EAF4E7] rounded-lg">
                <span className="text-[10px] text-[#66736A] block">TEMP. SECO</span>
                <span className="font-bold text-[#1D4B38] text-sm">{deltaT.tempArC}°C</span>
              </div>
              <div className="p-2.5 bg-[#F7F9F5] border border-[#EAF4E7] rounded-lg">
                <span className="text-[10px] text-[#66736A] block">TEMP. ÚMIDO</span>
                <span className="font-bold text-[#7DA9C4] text-sm">{deltaT.tempBulboUmidoC}°C</span>
              </div>
              <div className="p-2.5 bg-[#F7F9F5] border border-[#EAF4E7] rounded-lg">
                <span className="text-[10px] text-[#66736A] block">UMIDADE REL.</span>
                <span className="font-bold text-[#5F8F52] text-sm">{deltaT.umidadeRelativaPct}%</span>
              </div>
              <div className="p-2.5 bg-[#F7F9F5] border border-[#EAF4E7] rounded-lg">
                <span className="text-[10px] text-[#66736A] block">VELOC. VENTO</span>
                <span className="font-bold text-[#A67C1E] text-sm">{deltaT.ventoKmH} km/h</span>
              </div>
            </div>

            <div className="text-[11px] text-[#66736A] pt-2 border-t border-[#EAF4E7] space-y-1">
              <p>
                <strong className="text-[#1D4B38]">Regra Agronômica Internacional (ASABE S572):</strong>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[#66736A] text-[10px]">
                <li><strong>Abaixo de 2°C:</strong> As gotas não assentam; risco severo de deriva por inversão térmica.</li>
                <li><strong>Entre 2°C e 8°C:</strong> Janela de ouro. Deposição máxima da calda no alvo foliar.</li>
                <li><strong>Acima de 8°C:</strong> A gota evapora antes de tocar na folha; ineficiência química severa.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalDeltaTOpen(false)}
                className="px-4 py-2 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
