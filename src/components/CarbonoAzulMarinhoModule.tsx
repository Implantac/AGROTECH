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
  Waves,
  Anchor,
  Droplets
} from 'lucide-react';

interface ConcessaoMarinhaCarbono {
  id: string;
  identificacao: string;
  duziasOstrasAno: number;
  conchasSecasTon: number;
  carbonoFixadoTon: number;
  co2eqCapturadoTon: number;
  nitrogenioRemovidoKg: number;
  statusCertificacao: 'VERIFICADO_BLUE_CARBON' | 'AUDITORIA_OCEANICA_OK';
}

export const CarbonoAzulMarinhoModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'biomineralizacao' | 'nutrientes' | 'creditos' | 'simulador'>('biomineralizacao');

  // Concessões Marinhas
  const [concessoes] = useState<ConcessaoMarinhaCarbono[]>([
    {
      id: 'BLUE-CARBON-01',
      identificacao: 'Parque Aquícola Baía Norte • Concessão Marinha 01',
      duziasOstrasAno: 100000,
      conchasSecasTon: 95.0,
      carbonoFixadoTon: 11.4,
      co2eqCapturadoTon: 41.8,
      nitrogenioRemovidoKg: 420.0,
      statusCertificacao: 'VERIFICADO_BLUE_CARBON',
    },
    {
      id: 'BLUE-CARBON-02',
      identificacao: 'Parque Aquícola Baía Sul • Concessão Marinha 02',
      duziasOstrasAno: 80000,
      conchasSecasTon: 76.0,
      carbonoFixadoTon: 9.12,
      co2eqCapturadoTon: 33.44,
      nitrogenioRemovidoKg: 336.0,
      statusCertificacao: 'VERIFICADO_BLUE_CARBON',
    },
  ]);

  // Simulador Econômico de Carbono Azul
  const [duziasOstrasAno, setDuziasOstrasAno] = useState<number>(180000);
  const [pesoMedioConchaSecaKgPorDuzia, setPesoMedioConchaSecaKgPorDuzia] = useState<number>(0.95);
  const [teorCarbonoNaConchaPct, setTeorCarbonoNaConchaPct] = useState<number>(12.0);
  const [precoCreditoCarbonoAzulTon, setPrecoCreditoCarbonoAzulTon] = useState<number>(185.0);
  const [premioServicoEcossistemicoReais, setPremioServicoEcossistemicoReais] = useState<number>(65000.0);

  // Cálculos do Módulo
  const metricas = useMemo(() => {
    const massaTotalConchasSecasKg = duziasOstrasAno * pesoMedioConchaSecaKgPorDuzia;
    const conchasSecasTon = Number((massaTotalConchasSecasKg / 1000).toFixed(1));
    const carbonoPuroFixadoKg = Number((massaTotalConchasSecasKg * (teorCarbonoNaConchaPct / 100)).toFixed(1));
    const co2EquivalenteTon = Number(((carbonoPuroFixadoKg * 3.6667) / 1000).toFixed(2));

    const receitaCreditosCarbonoReais = Number((co2EquivalenteTon * precoCreditoCarbonoAzulTon).toFixed(2));
    const nitrogenioRemovidoKg = Number((duziasOstrasAno * 0.0042).toFixed(1));
    const receitaTotalSustentavelReais = Number((receitaCreditosCarbonoReais + premioServicoEcossistemicoReais).toFixed(2));

    return {
      conchasSecasTon,
      carbonoPuroFixadoKg,
      co2EquivalenteTon,
      nitrogenioRemovidoKg,
      receitaCreditosCarbonoReais,
      receitaTotalSustentavelReais,
    };
  }, [
    duziasOstrasAno,
    pesoMedioConchaSecaKgPorDuzia,
    teorCarbonoNaConchaPct,
    precoCreditoCarbonoAzulTon,
    premioServicoEcossistemicoReais,
  ]);

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5" />
                Módulo 105 • Carbono Azul & Créditos Marinhos
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Biomineralização de CaCO₃ • Bioextração N/P
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              🌊 Balanço de Carbono Azul & Serviços Ecossistêmicos Marinhos
            </h2>
            <p className="text-sm text-[#26332A] max-w-3xl leading-relaxed">
              Mensuração científica da fixação biológica e sequestro permanente de carbono na estrutura mineral das conchas de moluscos bivalves (calcite e aragonite de CaCO₃), combinada com a bioextração de excesso de nitrogênio e fósforo nas águas costeiras.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">CO₂eq Fixado</span>
              <span className="text-xl font-black text-cyan-400">75.24 t</span>
              <span className="text-[10px] text-[#66736A] block mt-0.5">171 t Conchas</span>
            </div>
            <div className="bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl p-3.5 text-center min-w-[145px] shadow-inner">
              <span className="text-[10px] font-bold text-[#66736A] uppercase tracking-wider block">Créditos PSA</span>
              <span className="text-xl font-black text-emerald-400">R$ 78.919</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Tokens Verificados</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Carbonato de Cálcio</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">95% CaCO₃ Puro</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Biomineralização Estável
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Nitrogênio Bioextraído</span>
            <Filter className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">756.0 kg N / ano</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Mitigação de Eutrofização Costeira
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cotação do Carbono Azul</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">R$ 185,00 / ton</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Ágio de +40% vs Créditos Terrestres
          </div>
        </div>

        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-sm hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-[#66736A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Receita Adicional PSA</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400">R$ 78.919,40</div>
          <div className="text-[11px] text-[#66736A] font-medium mt-1">
            Pagamento por Serviços Ambientais
          </div>
        </div>
      </div>

      {/* Navegação entre Abas */}
      <div className="flex flex-wrap gap-2 border-b border-[#EAF4E7] pb-2">
        <button
          onClick={() => setActiveTab('biomineralizacao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'biomineralizacao'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Layers className="w-4 h-4" />
          1. Biomineralização de Conchas (CaCO₃)
        </button>

        <button
          onClick={() => setActiveTab('nutrientes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'nutrientes'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Filter className="w-4 h-4" />
          2. Bioextração de Nitrogênio e Fósforo
        </button>

        <button
          onClick={() => setActiveTab('creditos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'creditos'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <Award className="w-4 h-4" />
          3. Créditos de Carbono Azul & PSA
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulador'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-900 text-[#26332A] hover:bg-slate-800 border border-[#EAF4E7]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Simulador Econômico
        </button>
      </div>

      {/* Conteúdo Aba 1: Biomineralização */}
      {activeTab === 'biomineralizacao' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Fixação Mineral de Carbono em Conchas Bivalves
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Diferente da madeira (que se decompõe e devolve o CO₂ à atmosfera em décadas), a concha de ostra transforma o íon bicarbonato marinho em carbonato de cálcio cristalino (aragonita/calcita), mineral termodinamicamente estável por milhares de anos.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EAF4E7] text-[#66736A] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Parque Concessão</th>
                    <th className="py-3 px-3">Produção Dúzias</th>
                    <th className="py-3 px-3">Conchas Secas</th>
                    <th className="py-3 px-3">Carbono Puro</th>
                    <th className="py-3 px-3">CO₂eq Capturado</th>
                    <th className="py-3 px-3">Nitrogênio Removido</th>
                    <th className="py-3 px-3">Certificação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {concessoes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{c.identificacao}</div>
                        <div className="text-[11px] text-[#66736A] font-mono">{c.id}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-white">{c.duziasOstrasAno.toLocaleString()} dz</td>
                      <td className="py-3.5 px-3 font-mono text-cyan-300 font-bold">{c.conchasSecasTon} ton</td>
                      <td className="py-3.5 px-3 font-mono text-amber-300 font-bold">{c.carbonoFixadoTon} ton C</td>
                      <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">{c.co2eqCapturadoTon} ton CO₂eq</td>
                      <td className="py-3.5 px-3 font-mono text-teal-300">{c.nitrogenioRemovidoKg} kg N</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {c.statusCertificacao}
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

      {/* Conteúdo Aba 2: Nutrientes */}
      {activeTab === 'nutrientes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-400" />
              Bioextração & Despoluição Costeira
            </h3>
            <p className="text-xs text-[#66736A]">
              Ostras filtram até 200 litros de água do mar por dia por indivíduo, assimilando nutrientes de efluentes agrícolas e urbanos:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Remoção de Nitrogênio (N)</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  Cada dúzia de ostras retira cerca de 4,2 gramas de nitrogênio elementar da água, convertendo-o em proteína muscular e biomassa de concha.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="font-bold text-white block">Clarificação Óptica da Água</span>
                <span className="text-[#66736A] text-[11px] block mt-0.5">
                  A remoção de partículas suspensas aumenta a penetração solar e estimula o retorno de bancos naturais de gramas marinhas (*seagrass*).
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Reciclagem Circular da Concha
            </h3>
            <p className="text-xs text-[#66736A]">
              Destinação sustentável pós-consumo:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Calcário Agrícola de Origem Marinha:</span>
                <span className="font-mono font-bold text-emerald-400">98% Neutralização de Acidez de Solo</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] flex justify-between items-center">
                <span className="text-[#66736A]">Substrato para Novos Recifes:</span>
                <span className="font-mono font-bold text-cyan-400">Fixação de Sementes Nativas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Créditos */}
      {activeTab === 'creditos' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-400" />
              Mercado Voluntário de Carbono Azul (Blue Carbon Tokens)
            </h3>
            <p className="text-xs text-[#66736A] mb-4">
              Créditos de carbono oceânico desfrutam de forte prêmio de mercado por protegerem a biodiversidade marinha e gerarem impacto social direto para comunidades caiçaras e cooperativas de maricultores tradicionais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Permanência Geológica</span>
                <span className="text-2xl font-black text-white font-mono">&gt; 1.000 Anos</span>
                <span className="text-[11px] text-emerald-400 block">Carbonato inerte</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Metodologia Verra / Gold</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">VM0033 / Blue</span>
                <span className="text-[11px] text-[#66736A] block">Rigor MRV com telemetria</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-1">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Investidores ESG</span>
                <span className="text-2xl font-black text-blue-400 font-mono">Empresas Portuárias</span>
                <span className="text-[11px] text-[#66736A] block">Compensação de fretes marítimos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Simulador */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Parâmetros de Carbono Azul
            </h3>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Dúzias de Ostras / Ano</span>
                <span className="font-mono text-cyan-400">{duziasOstrasAno.toLocaleString()} dz</span>
              </div>
              <input
                type="range"
                min="50000"
                max="400000"
                step="10000"
                value={duziasOstrasAno}
                onChange={(e) => setDuziasOstrasAno(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Preço do Crédito de Carbono Azul (R$/t)</span>
                <span className="font-mono text-emerald-400">R$ {precoCreditoCarbonoAzulTon.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="5"
                value={precoCreditoCarbonoAzulTon}
                onChange={(e) => setPrecoCreditoCarbonoAzulTon(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#26332A] font-semibold mb-1">
                <span>Bônus de Serviço Ecossistêmico (PSA)</span>
                <span className="font-mono text-blue-400">R$ {premioServicoEcossistemicoReais.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={premioServicoEcossistemicoReais}
                onChange={(e) => setPremioServicoEcossistemicoReais(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Valor Econômico Ambiental Adicional
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Conchas Secas</span>
                <span className="font-mono font-bold text-white text-base">
                  {metricas.conchasSecasTon} ton
                </span>
                <span className="text-[10px] text-[#66736A] block">Carbonato estável</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">CO₂eq Capturado</span>
                <span className="font-mono font-bold text-cyan-400 text-base">
                  {metricas.co2EquivalenteTon} ton
                </span>
                <span className="text-[10px] text-cyan-400/80 block">Sequestro líquido</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">N Removido</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {metricas.nitrogenioRemovidoKg} kg
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Água mais limpa</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7]">
                <span className="text-[10px] text-[#66736A] uppercase tracking-wider block">Receita Verde Total</span>
                <span className="font-mono font-bold text-teal-400 text-base">
                  R$ {(metricas.receitaTotalSustentavelReais / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-teal-400/80 block">Carbono + PSA</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9F5] border border-[#EAF4E7] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Receita de Créditos de Carbono Azul ({metricas.co2EquivalenteTon} t CO₂eq @ R$ {precoCreditoCarbonoAzulTon.toFixed(2)}):</span>
                <span className="font-mono font-bold text-cyan-400">
                  R$ {metricas.receitaCreditosCarbonoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#EAF4E7]/80">
                <span className="text-[#66736A]">Pagamento por Serviços Ambientais (PSA Marinho - Despoluição e Bioextração de Nitrogênio):</span>
                <span className="font-mono font-bold text-blue-400">
                  + R$ {premioServicoEcossistemicoReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm font-black bg-cyan-950/30 px-3 rounded-lg border border-cyan-800/50">
                <span className="text-white">Receita Extra Sustentável Anual:</span>
                <span className="font-mono text-emerald-300">
                  R$ {metricas.receitaTotalSustentavelReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonoAzulMarinhoModule;
