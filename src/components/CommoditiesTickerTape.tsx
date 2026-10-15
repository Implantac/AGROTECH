import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, ChevronRight, BarChart3 } from 'lucide-react';

export interface CommodityItem {
  id: string;
  nome: string;
  preco: number;
  unidade: string;
  variacao: number;
  tendencia: 'ALTA' | 'BAIXA' | 'ESTAVEL' | 'FAVORAVEL';
}

interface CommoditiesTickerTapeProps {
  onOpenBarter?: () => void;
  onOpenDossie?: () => void;
}

export const CommoditiesTickerTape: React.FC<CommoditiesTickerTapeProps> = ({
  onOpenBarter,
  onOpenDossie
}) => {
  const [cotacoes, setCotacoes] = useState<CommodityItem[]>([
    { id: 'SOJA_MT', nome: 'Soja Sorriso/Sinop', preco: 136.50, unidade: 'R$/sc', variacao: +0.82, tendencia: 'ALTA' },
    { id: 'SOJA_CBOT', nome: 'Soja Chicago (CBOT)', preco: 11.85, unidade: 'US$/bu', variacao: +1.15, tendencia: 'ALTA' },
    { id: 'MILHO_B3', nome: 'Milho B3 Campinas', preco: 58.20, unidade: 'R$/sc', variacao: -0.45, tendencia: 'BAIXA' },
    { id: 'BOI_B3', nome: 'Boi Gordo B3', preco: 242.50, unidade: 'R$/@', variacao: +0.65, tendencia: 'ALTA' },
    { id: 'ALGODAO', nome: 'Algodão Pluma B3', preco: 138.00, unidade: 'R$/@', variacao: +0.12, tendencia: 'ESTAVEL' },
    { id: 'CAFE_NY', nome: 'Café Arábica NY', preco: 1180.00, unidade: 'R$/sc', variacao: +1.40, tendencia: 'ALTA' },
    { id: 'DOLAR_PTAX', nome: 'Dólar PTAX (BACEN)', preco: 5.42, unidade: 'R$', variacao: -0.28, tendencia: 'BAIXA' },
    { id: 'BARTER_MAP', nome: 'Relação Barter MAP', preco: 32.6, unidade: 'sc/ton', variacao: -1.10, tendencia: 'FAVORAVEL' }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('Ao vivo');

  const fetchCotacoes = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/v1/mercado/cotacoes');
      if (res.ok) {
        const data = await res.json();
        if (data.ticker && Array.isArray(data.ticker)) {
          setCotacoes(data.ticker);
          setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch {
      // mantém cotações padrão
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCotacoes();
    const interval = setInterval(fetchCotacoes, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#112319] text-white border-b border-[#1D3E2B] px-4 py-1.5 flex items-center justify-between text-xs overflow-hidden select-none print:hidden z-10">
      {/* Label de Abertura de Mercado */}
      <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-emerald-900/60">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono font-bold text-[10px] tracking-wider text-emerald-300 uppercase">
          MERCADO AGRO
        </span>
      </div>

      {/* Ticker Horizontal com Scroll Suave */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 px-3 flex-1">
        {cotacoes.map((item) => {
          const isPositive = item.variacao >= 0;
          return (
            <div
              key={item.id}
              className="flex items-center gap-2 whitespace-nowrap text-[11px] font-mono hover:bg-emerald-900/30 px-2 py-0.5 rounded cursor-default transition-colors shrink-0"
            >
              <span className="text-slate-300 font-sans font-medium">{item.nome}:</span>
              <span className="font-bold text-white">
                {item.unidade === 'R$' || item.unidade.startsWith('R$')
                  ? `R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : item.unidade === 'US$/bu'
                  ? `US$ ${item.preco.toFixed(2)}`
                  : `${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} ${item.unidade}`}
              </span>
              <span
                className={`flex items-center text-[10px] font-bold ${
                  item.tendencia === 'FAVORAVEL'
                    ? 'text-emerald-400'
                    : isPositive
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {isPositive ? '+' : ''}
                {item.variacao.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Ações Rápidas à Direita: Atualizar & Abrir Barter / Dossiê */}
      <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-emerald-900/60 text-[10px]">
        <button
          type="button"
          onClick={fetchCotacoes}
          className="p-1 rounded hover:bg-emerald-800/40 text-emerald-300 hover:text-white transition cursor-pointer"
          title={`Atualizar cotações (Última: ${lastUpdate})`}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        {onOpenBarter && (
          <button
            type="button"
            onClick={onOpenBarter}
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition cursor-pointer font-sans font-semibold"
            title="Abrir Simulador de Relação de Troca Barter & Cotações"
          >
            <BarChart3 className="w-3 h-3 text-emerald-400" />
            <span>Simular Barter</span>
          </button>
        )}

        {onOpenDossie && (
          <button
            type="button"
            onClick={onOpenDossie}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition cursor-pointer font-sans shadow-xs"
            title="Gerar Dossiê da Fazenda para Crédito Rural (BACEN MCR)"
          >
            <span>Dossiê Crédito</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
