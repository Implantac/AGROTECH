import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Box,
  Truck,
  Leaf,
  Filter,
  DollarSign,
  Activity,
  Award,
  Trees,
  Wind,
  Droplets
} from 'lucide-react';

interface PomarPecan {
  id: string;
  identificacao: string;
  cultivar: 'Barton (Polinizadora)' | 'Shawnee' | 'Choctaw' | 'Imperial';
  idadePomarAnos: number;
  areaHa: number;
  produtividadeNisKgHa: number;
  rendimentoAmendoaPct: number;
  metadesInteirasPct: number;
  statusManejo: 'COLHEITA_MECANICA_SHAKER' | 'PODA_PENETRACAO_LUZ' | 'ADUBACAO_ZINCO_FOLIAR';
}

export const NozPecanPomaresModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pomares' | 'qualidade' | 'sanidade' | 'simulador'>('pomares');

  // Pomares de Noz-Pecan
  const [pomares] = useState<PomarPecan[]>([
    {
      id: 'PECAN-POMAR-01',
      identificacao: 'Pomar Sul 01 • Cachoeira do Sul RS (Barton & Shawnee)',
      cultivar: 'Barton (Polinizadora)',
      idadePomarAnos: 14,
      areaHa: 25,
      produtividadeNisKgHa: 2300,
      rendimentoAmendoaPct: 54.5,
      metadesInteirasPct: 84.0,
      statusManejo: 'COLHEITA_MECANICA_SHAKER',
    },
    {
      id: 'PECAN-POMAR-02',
      identificacao: 'Pomar Serra 02 • Anta Gorda RS (Choctaw Nobre)',
      cultivar: 'Choctaw',
      idadePomarAnos: 12,
      areaHa: 15,
      produtividadeNisKgHa: 2100,
      rendimentoAmendoaPct: 53.0,
      metadesInteirasPct: 80.0,
      statusManejo: 'ADUBACAO_ZINCO_FOLIAR',
    },
  ]);

  // Simulador Econômico
  const [areaPomarHa, setAreaPomarHa] = useState<number>(40);
  const [produtividadeNisKgHa, setProdutividadeNisKgHa] = useState<number>(2200);
  const [rendimentoAmendoaPct, setRendimentoAmendoaPct] = useState<number>(54.0);
  const [precoKgAmendoaReais, setPrecoKgAmendoaReais] = useState<number>(58.0);
  const [custoManejoHaReais, setCustoManejoHaReais] = useState<number>(24000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const producaoTotalNisKg = areaPomarHa * produtividadeNisKgHa;
    const amendoasLimpasKg = Number((producaoTotalNisKg * (rendimentoAmendoaPct / 100)).toFixed(1));
    const receitaBrutaReais = Number((amendoasLimpasKg * precoKgAmendoaReais).toFixed(2));
    const custoTotalReais = Number((areaPomarHa * custoManejoHaReais).toFixed(2));
    const lucroLiquidoReais = Number((receitaBrutaReais - custoTotalReais).toFixed(2));
    const margemLiquidaPct = Number(((lucroLiquidoReais / (receitaBrutaReais || 1)) * 100).toFixed(1));

    return {
      producaoTotalNisKg,
      amendoasLimpasKg,
      receitaBrutaReais,
      custoTotalReais,
      lucroLiquidoReais,
      margemLiquidaPct,
    };
  }, [
    areaPomarHa,
    produtividadeNisKgHa,
    rendimentoAmendoaPct,
    precoKgAmendoaReais,
    custoManejoHaReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5" />
                Módulo 106 • Nozes Pecan & Pomares Nobres
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Carya illinoinensis • 54% Rendimento Amêndoa
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🌰 Noz-Pecan de Precisão, Colheita Shaker & Amêndoas Halves
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Manejo intensivo de pomares de noz-pecan: nutrição foliar com zinco para superação da alternância bienal de produção, vibração mecânica de troncos (shaker), secagem rápida para umidade inferior a 4.5% e quebra pneumática para metades nobres inteiras.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Noz em Casca</span>
              <span className="text-xl font-black text-amber-400">88.000 kg</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">40 ha Pomar</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faturamento</span>
              <span className="text-xl font-black text-emerald-400">R$ 2,75M</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">65.2% Margem</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rendimento de Amêndoa</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">54.0% Carne</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Padrão Exportação Fancy
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Metades Inteiras (Halves)</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">82.0% Integridade</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Zero Quebra Excessiva em Farelos
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nutrição de Zinco (Zn)</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">&gt; 65 mg/kg Foliar</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Combate a "Orelha-de-Rato"
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Líquido Anual</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 1.796.160,00</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            R$ 44.904,00 por hectare
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pomares')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pomares'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Trees className="w-4 h-4" />
          1. Pomares & Cultivares
        </button>

        <button
          onClick={() => setActiveTab('qualidade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'qualidade'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          2. Quebra Mecânica & Metades Halves
        </button>

        <button
          onClick={() => setActiveTab('sanidade')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'sanidade'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          3. Sarna da Pecan & Zinco Foliar
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Pomares */}
      {activeTab === 'pomares' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Trees className="w-5 h-5 text-amber-400" />
              Talhões de Nogueira-Pecan em Idade Reprodutiva
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A nogueira-pecan é uma espécie longeva que atinge estabilidade a partir do 10º ano de plantio. O espaçamento padrão de 10m x 10m (100 árvores/ha) exige podas de desbaste e iluminação para garantir boa taxa de fixação de frutos nas pontas dos ramos.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Pomar / Local</th>
                    <th className="py-3 px-3">Cultivar Principal</th>
                    <th className="py-3 px-3">Idade</th>
                    <th className="py-3 px-3">Área (ha)</th>
                    <th className="py-3 px-3">Produtividade</th>
                    <th className="py-3 px-3">Rendimento Amêndoa</th>
                    <th className="py-3 px-3">Metades Inteiras</th>
                    <th className="py-3 px-3">Manejo Atual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {pomares.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{p.identificacao}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-amber-300 font-semibold">{p.cultivar}</td>
                      <td className="py-3.5 px-3 font-mono text-white">{p.idadePomarAnos} anos</td>
                      <td className="py-3.5 px-3 font-mono text-white">{p.areaHa} ha</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{p.produtividadeNisKgHa} kg/ha</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">{p.rendimentoAmendoaPct}%</td>
                      <td className="py-3.5 px-3 font-mono text-amber-300">{p.metadesInteirasPct}%</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.statusManejo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Qualidade */}
      {activeTab === 'qualidade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Processamento Pós-Colheita & Classificação
            </h3>
            <p className="text-xs text-slate-400">
              Etapas industriais de secagem e despeliculagem para evitar rancidez oxidativa:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Secagem Imediata em Silos de Fluxo Cruzado</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  A noz recém-colhida possui 12% a 15% de umidade e deve ser reduzida para 4.0% a 4.5% em menos de 48 horas sob ar morno (32°C).
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white block">Quebra Pneumática de Baixo Impacto</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Preserva as amêndoas em metades simétricas (Halves), que alcançam preço 70% superior a pedaços ou farinhas de noz.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Perfil Nutricional e Ácidos Graxos
            </h3>
            <p className="text-xs text-slate-400">
              Composição de gorduras saudáveis da noz-pecan:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Ácido Oleico (Ômega-9 Cardioprotetor):</span>
                <span className="font-mono font-bold text-emerald-400">62.0% dos Lipídios</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Embalagem com Atmosfera Modificada:</span>
                <span className="font-mono font-bold text-cyan-400">Injeção de Nitrogênio (Zero Oxigênio)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Sanidade */}
      {activeTab === 'sanidade' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Manejo da Sarna da Pecan (Venturia effusa) & Nutrição de Zinco
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              A sarna ataca o epicarpo (casca verde) e as folhas jovens em primaveras chuvosas. O zinco é o micronutriente chave: sem aplicações foliares repetidas no início da brotação, as folhas ficam lanceoladas e deformadas ("orelha-de-rato"), paralisando a safra do ano seguinte.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Teor Foliar de Zinco</span>
                <span className="text-2xl font-black text-white font-mono">72 mg/kg</span>
                <span className="text-[11px] text-emerald-400 block">Faixa Ideal (superior a 65 mg/kg)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Monitoramento de Sarna</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">Zero Lesões Ativas</span>
                <span className="text-[11px] text-slate-400 block">Fungicidas protetores na brotação</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Colheita Shaker</span>
                <span className="text-2xl font-black text-amber-400 font-mono">98% Eficiência</span>
                <span className="text-[11px] text-slate-400 block">Vibração de 3 segundos por árvore</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              Parâmetros do Pomar de Pecan
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Área do Pomar (ha)</span>
                <span className="font-mono text-amber-400">{areaPomarHa} hectares</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={areaPomarHa}
                onChange={(e) => setAreaPomarHa(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Produtividade NIS (kg/ha)</span>
                <span className="font-mono text-cyan-400">{produtividadeNisKgHa} kg/ha</span>
              </div>
              <input
                type="range"
                min="1000"
                max="3500"
                step="100"
                value={produtividadeNisKgHa}
                onChange={(e) => setProdutividadeNisKgHa(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Preço Amêndoa Limpa (R$/kg)</span>
                <span className="font-mono text-emerald-400">R$ {precoKgAmendoaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="40.0"
                max="85.0"
                step="1.0"
                value={precoKgAmendoaReais}
                onChange={(e) => setPrecoKgAmendoaReais(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>Custo de Manejo e Indústria por Ha</span>
                <span className="font-mono text-rose-400">R$ {custoManejoHaReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="12000"
                max="40000"
                step="1000"
                value={custoManejoHaReais}
                onChange={(e) => setCustoManejoHaReais(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Retorno Financeiro da Pecanicultura
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Noz em Casca</span>
                <span className="font-mono font-bold text-white text-base">
                  {(metricas.producaoTotalNisKg / 1000).toFixed(0)} ton
                </span>
                <span className="text-[10px] text-slate-400 block">{areaPomarHa} ha colhidos</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amêndoas Limpas</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {(metricas.amendoasLimpasKg / 1000).toFixed(1)} ton
                </span>
                <span className="text-[10px] text-amber-400/80 block">54% rendimento</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receita Bruta</span>
                <span className="font-mono font-bold text-white text-base">
                  R$ {(metricas.receitaBrutaReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-slate-400 block">Venda Boutique / Granel</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(metricas.lucroLiquidoReais / 1000000).toFixed(2)}M
                </span>
                <span className="text-[10px] text-emerald-400/80 block">{metricas.margemLiquidaPct}% margem</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Receita com Amêndoas Processadas ({metricas.amendoasLimpasKg.toLocaleString()} kg @ R$ {precoKgAmendoaReais.toFixed(2)}):</span>
                <span className="font-mono font-bold text-white">
                  R$ {metricas.receitaBrutaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Custos de Manejo, Zinco Foliar, Colheita Mecânica e Quebra:</span>
                <span className="font-mono font-bold text-rose-400">
                  - R$ {metricas.custoTotalReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-amber-950/30 px-3 rounded-lg border border-amber-800/50">
                <span className="text-white">Lucro Líquido Anual Consolidado do Pomar:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricas.lucroLiquidoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NozPecanPomaresModule;
