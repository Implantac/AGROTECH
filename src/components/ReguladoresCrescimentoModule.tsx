import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Sprout,
  Activity,
  Award,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Layers,
} from 'lucide-react';

interface TratamentoRegulador {
  id: string;
  cultura: string;
  principioAtivo: string;
  funcaoFisiologica: string;
  estadioFenologico: string;
  dosagemRecomendada: string;
  incrementoEsperadoPct: number;
  custoTratamentoHaReais: number;
  status: 'APLICACAO_PLANEJADA' | 'JANELA_IDEAL' | 'TRATAMENTO_EXECUTADO';
}

export const ReguladoresCrescimentoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tratamentos' | 'fisiologia' | 'culturas' | 'simulador'>('tratamentos');

  // Parâmetros do Simulador
  const [areaTratadaHa, setAreaTratadaHa] = useState<number>(40);
  const [culturaSelecionada, setCulturaSelecionada] = useState<string>('Manga Tommy Atkins (Semiárido)');
  const [incrementoProdutividadePct, setIncrementoProdutividadePct] = useState<number>(28.0);
  const [custoAplicacaoHaReais, setCustoAplicacaoHaReais] = useState<number>(2400.0);
  const [receitaBaseHaReais, setReceitaBaseHaReais] = useState<number>(32000.0);

  const [tratamentos, setTratamentos] = useState<TratamentoRegulador[]>([
    {
      id: 'REG-01',
      cultura: 'Manga Tommy Atkins / Palmer (Vale do São Francisco)',
      principioAtivo: 'Paclobutrazol (PBZ 250 g/L)',
      funcaoFisiologica: 'Bloqueio de giberelinas & Indução Floral de Precisão',
      estadioFenologico: 'Fluxo Vegetativo Maduro (Solo úmido via gotejo)',
      dosagemRecomendada: '1.0 g i.a. por metro de diâmetro de copa',
      incrementoEsperadoPct: 28.0,
      custoTratamentoHaReais: 2400.0,
      status: 'JANELA_IDEAL',
    },
    {
      id: 'REG-02',
      cultura: 'Uva de Mesa BRS Vitória / Crimson (Petrolina - PE)',
      principioAtivo: 'Ácido Giberélico (GA3 10% Pó Solúvel)',
      funcaoFisiologica: 'Raleio químico de cachos & Alongamento de bagas sem semente',
      estadioFenologico: 'Plena Florada e Bagas com 4 a 6 mm',
      dosagemRecomendada: '20 a 40 ppm via pulverização direta no cacho',
      incrementoEsperadoPct: 35.0,
      custoTratamentoHaReais: 3100.0,
      status: 'TRATAMENTO_EXECUTADO',
    },
    {
      id: 'REG-03',
      cultura: 'Algodão Safra Cheia (Oeste da Bahia)',
      principioAtivo: 'Cloreto de Mepiquat (Pix 250 g/L)',
      funcaoFisiologica: 'Redução de internódios & Redirecionamento de energia para maçãs',
      estadioFenologico: 'Emissão dos Primeiros Botões Florais (B1)',
      dosagemRecomendada: '15 a 25 g i.a./ha em doses fracionadas',
      incrementoEsperadoPct: 18.5,
      custoTratamentoHaReais: 480.0,
      status: 'APLICACAO_PLANEJADA',
    },
  ]);

  const metricas = useMemo(() => {
    const receitaIncrementadaHaReais = Number(
      (receitaBaseHaReais * (1 + incrementoProdutividadePct / 100)).toFixed(2)
    );
    const beneficioLiquidoHaReais = Number(
      (receitaIncrementadaHaReais - receitaBaseHaReais - custoAplicacaoHaReais).toFixed(2)
    );
    const roiTratamento = custoAplicacaoHaReais > 0 ? Number((beneficioLiquidoHaReais / custoAplicacaoHaReais).toFixed(1)) : 0;
    const beneficioTotalGeralReais = Number((beneficioLiquidoHaReais * areaTratadaHa).toFixed(2));

    return {
      receitaIncrementadaHaReais,
      beneficioLiquidoHaReais,
      roiTratamento,
      beneficioTotalGeralReais,
    };
  }, [areaTratadaHa, incrementoProdutividadePct, custoAplicacaoHaReais, receitaBaseHaReais]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-600/20">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Reguladores de Crescimento & Fisiologia Vegetal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Módulo 119 • PBZ, Giberelinas, Mepiquat & Indução Floral
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Controle hormonal do vigor vegetativo, raleio de bagas, quebra de dormência e sincronização de colheita em fruteiras nobres e grãos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-teal-600/20"
          >
            <DollarSign className="w-4 h-4" />
            Simulador de ROI Fisiológico
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Ganho Produtivo Estimado</span>
            <Sprout className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            +{incrementoProdutividadePct.toFixed(1)}%
          </p>
          <span className="text-xs text-teal-400 mt-1 block">
            Por indução hormonal programada
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Benefício Líquido / ha</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {metricas.beneficioLiquidoHaReais.toLocaleString('pt-BR')}
          </p>
          <span className="text-xs text-emerald-400 mt-1 block">
            Já deduzido o custo de aplicação
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Retorno sobre Tratamento (ROI)</span>
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {metricas.roiTratamento}x
          </p>
          <span className="text-xs text-yellow-400 mt-1 block">
            R$ {metricas.roiTratamento} de lucro por R$ 1,00 investido
          </span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Benefício Total na Área</span>
            <Award className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            R$ {(metricas.beneficioTotalGeralReais / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-teal-400 mt-1 block">
            Em {areaTratadaHa} hectares sob manejo
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tratamentos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'tratamentos'
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          Planos de Aplicação
        </button>

        <button
          onClick={() => setActiveTab('fisiologia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'fisiologia'
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Mecanismos de Ação
        </button>

        <button
          onClick={() => setActiveTab('culturas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'culturas'
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Sprout className="w-4 h-4" />
          Manejo por Cultura
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulador'
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Simulador Econômico
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tratamentos' && (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-teal-400" />
            Tratamentos Hormonais Monitorados por Estádio Fenológico
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Cultura & Local</th>
                  <th className="px-4 py-3">Princípio Ativo</th>
                  <th className="px-4 py-3">Função Fisiológica</th>
                  <th className="px-4 py-3">Dosagem</th>
                  <th className="px-4 py-3">Ganho Estimado</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tratamentos.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{t.cultura}</td>
                    <td className="px-4 py-3 text-teal-400 font-semibold">{t.principioAtivo}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{t.funcaoFisiologica}</td>
                    <td className="px-4 py-3 font-mono text-xs">{t.dosagemRecomendada}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">+{t.incrementoEsperadoPct}%</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fisiologia' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-teal-400" />
              <h4 className="text-sm font-semibold text-white">Inibidores de Giberelinas</h4>
            </div>
            <p className="text-xs text-slate-400">
              Paclobutrazol e Uniconazol bloqueiam a rota do ent-caureno, paralisando brotações vegetativas indesejadas e redirecionando reservas de carboidratos para gemas florais.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Efeito Principal:</span>
              <span className="text-sm font-bold text-teal-400 block">Indução floral sincronizada em manga</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Giberelinas e Citocininas</h4>
            </div>
            <p className="text-xs text-slate-400">
              O ácido giberélico estimula a divisão celular na parede do ovário e o relaxamento do engaço, permitindo que bagas de uva atinjam calibre de exportação sem deformidades.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Efeito Principal:</span>
              <span className="text-sm font-bold text-emerald-400 block">Alongamento e raleio de cachos</span>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-white">Geradores de Etileno (Etefon)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Liberação lenta de etileno gasoso nos tecidos vegetais, induzindo senescência de folhas no algodão e uniformização de maturação em cana-de-açúcar e café.
            </p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400">Efeito Principal:</span>
              <span className="text-sm font-bold text-yellow-400 block">Desfolha pré-colheita mecânica</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'culturas' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            Protocolos Validados pela Embrapa Semiárido & CNPAF
          </h3>
          <p className="text-sm text-slate-400">
            O uso de reguladores de crescimento exige monitoramento rigoroso de estresse hídrico e temperatura do solo para evitar fitotoxicidade irreversível nas plantas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Manga no São Francisco</span>
              <p className="text-lg font-bold text-teal-400 mt-1">Colheita em 120 dias</p>
              <span className="text-[11px] text-slate-500">Programação precisa de embarques marítimos</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Uva de Mesa sem Semente</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">Baga de 22 a 26 mm</p>
              <span className="text-[11px] text-emerald-500/80">Atende ao mercado exigente da Europa</span>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Algodão Safra Cheia</span>
              <p className="text-lg font-bold text-white mt-1">Porte de 1.10 a 1.20 m</p>
              <span className="text-[11px] text-slate-500">Evita acamamento e apodrecimento de maçãs</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulador' && (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            Simulador de Retorno Econômico do Manejo Fisiológico
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400">Área Tratada (ha)</label>
              <input
                type="number"
                value={areaTratadaHa}
                onChange={(e) => setAreaTratadaHa(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Receita Base (R$/ha)</label>
              <input
                type="number"
                value={receitaBaseHaReais}
                onChange={(e) => setReceitaBaseHaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Ganho Produtivo (%)</label>
              <input
                type="number"
                step="0.5"
                value={incrementoProdutividadePct}
                onChange={(e) => setIncrementoProdutividadePct(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400">Custo Tratamento (R$/ha)</label>
              <input
                type="number"
                value={custoAplicacaoHaReais}
                onChange={(e) => setCustoAplicacaoHaReais(Number(e.target.value))}
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Eficiência do Investimento Fisiológico:</span>
              <span className="text-base font-bold text-teal-400">
                ROI de {metricas.roiTratamento}x (R$ {metricas.beneficioLiquidoHaReais.toLocaleString('pt-BR')}/ha líquido)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Lucro Adicional Total na Área:</span>
              <span className="text-xl font-bold text-emerald-400">
                +R$ {metricas.beneficioTotalGeralReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
