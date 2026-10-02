import React, { useState, useMemo } from 'react';
import {
  Trees,
  Scale,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Leaf,
  Info
} from 'lucide-react';

interface TalhaoFlorestal {
  id: string;
  nome: string;
  especieClone: string; // Eucalyptus urograndis (Clone I144, AEC 1528)
  idadeAnos: number;
  areaHa: number;
  dapCm: number;
  alturaMediaM: number;
  arvoresPorHa: number;
  finalidade: 'CELULOSE' | 'SERRARIA_DESBASTE' | 'BIOMASSA_ENERGIA';
}

export const SilviculturaManejoFlorestalModule: React.FC = () => {
  const [talhoes, setTalhoes] = useState<TalhaoFlorestal[]>([
    {
      id: 'TAL-FLOR-01',
      nome: 'Horto Florestal Três Lagoas • Talhão A',
      especieClone: 'Eucalyptus urograndis (Clone AEC 1528)',
      idadeAnos: 6.8,
      areaHa: 280,
      dapCm: 18.2,
      alturaMediaM: 26.5,
      arvoresPorHa: 1111,
      finalidade: 'CELULOSE',
    },
    {
      id: 'TAL-FLOR-02',
      nome: 'Horto Florestal Ribas • Talhão B',
      especieClone: 'Eucalyptus grandis x urophylla (I144)',
      idadeAnos: 4.5,
      areaHa: 350,
      dapCm: 14.5,
      alturaMediaM: 20.0,
      arvoresPorHa: 1111,
      finalidade: 'CELULOSE',
    },
    {
      id: 'TAL-FLOR-03',
      nome: 'Maciço Florestal Mutum • Talhão C',
      especieClone: 'Corymbia torelliana x citriodora',
      idadeAnos: 9.2,
      areaHa: 160,
      dapCm: 24.0,
      alturaMediaM: 29.0,
      arvoresPorHa: 800,
      finalidade: 'SERRARIA_DESBASTE',
    },
  ]);

  const [talhaoSelecionadoId, setTalhaoSelecionadoId] = useState<string>('TAL-FLOR-01');
  const [precoM3MadeiraReais, setPrecoM3MadeiraReais] = useState<number>(118.0); // R$ 118,00/m³ em pé
  const [custoPlantioPorHaReais, setCustoPlantioPorHaReais] = useState<number>(6800.0); // Custo de implantação/manutenção

  const talhaoAtivo = useMemo(
    () => talhoes.find((t) => t.id === talhaoSelecionadoId) || talhoes[0],
    [talhoes, talhaoSelecionadoId]
  );

  // Cálculos Técnicos do Motor de Silvicultura e Dendrometria
  const silviMetrics = useMemo(() => {
    // 1. Volume Individual da Árvore (Modelo Spurr com fator de forma = 0.48)
    // V = (PI / 40000) * DAP^2 * Altura * FatorForma
    const areaBasalM2 = (Math.PI / 40000.0) * Math.pow(talhaoAtivo.dapCm, 2);
    const volumeArvoreM3 = areaBasalM2 * talhaoAtivo.alturaMediaM * 0.48;

    // 2. Volume em Pé por Hectare e Total do Talhão (m³)
    const volumePorHaM3 = volumeArvoreM3 * talhaoAtivo.arvoresPorHa;
    const volumeTotalTalhaoM3 = volumePorHaM3 * talhaoAtivo.areaHa;

    // 3. Incremento Médio Anual (IMA em m³/ha/ano)
    const imaM3HaAno = talhaoAtivo.idadeAnos > 0 ? volumePorHaM3 / talhaoAtivo.idadeAnos : 0;

    // Classificação da Produtividade Florestal
    let classificacaoIma: 'EXCEPCIONAL' | 'ALTA_PRODUTIVIDADE' | 'MEDIA' | 'BAIXA' = 'ALTA_PRODUTIVIDADE';
    if (imaM3HaAno >= 48.0) classificacaoIma = 'EXCEPCIONAL';
    else if (imaM3HaAno >= 38.0) classificacaoIma = 'ALTA_PRODUTIVIDADE';
    else if (imaM3HaAno >= 28.0) classificacaoIma = 'MEDIA';
    else classificacaoIma = 'BAIXA';

    // 4. Sequestro de Carbono em Madeira em Pé (t CO2eq/ha)
    // Densidade básica média = 0.50 t/m³, Carbono na madeira = ~50%, Estequiometria C->CO2 = 3.67
    // Fator = 0.50 * 0.50 * 3.67 ~ 0.9175 t CO2eq por m³ de madeira
    const co2SequestradoHaTon = volumePorHaM3 * 0.26 * 3.67;
    const co2SequestradoTotalTon = co2SequestradoHaTon * talhaoAtivo.areaHa;

    // 5. Viabilidade Financeira do Corte
    const faturamentoTotalMadeiraReais = volumeTotalTalhaoM3 * precoM3MadeiraReais;
    const faturamentoPorHaReais = volumePorHaM3 * precoM3MadeiraReais;
    const lucroLiquidoHaReais = faturamentoPorHaReais - custoPlantioPorHaReais;
    const roiFlorestal = custoPlantioPorHaReais > 0 ? faturamentoPorHaReais / custoPlantioPorHaReais : 0;

    return {
      volumeArvoreM3,
      volumePorHaM3,
      volumeTotalTalhaoM3,
      imaM3HaAno,
      classificacaoIma,
      co2SequestradoHaTon,
      co2SequestradoTotalTon,
      faturamentoTotalMadeiraReais,
      faturamentoPorHaReais,
      lucroLiquidoHaReais,
      roiFlorestal,
    };
  }, [talhaoAtivo, precoM3MadeiraReais, custoPlantioPorHaReais]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Trees className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Silvicultura de Precisão & Manejo Florestal Sustentável
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    FSC • PEFC Certificado
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Inventário dendrométrico (DAP e Altura), Incremento Médio Anual (IMA m³/ha/ano) e corte raso/desbaste para celulose.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              IMA: {silviMetrics.imaM3HaAno.toFixed(1)} m³/ha/ano ({silviMetrics.classificacaoIma})
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: IMA */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Incremento Médio (IMA)</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {silviMetrics.imaM3HaAno.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#66736A]">m³/ha/ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Meta celulose: &gt; 42.0 m³/ha/ano aos 7 anos.
          </p>
        </div>

        {/* KPI 2: Volume em Pé por Hectare */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Volume em Pé</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            {silviMetrics.volumePorHaM3.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#66736A]">m³/ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total do talhão: {silviMetrics.volumeTotalTalhaoM3.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} m³ ({talhaoAtivo.areaHa} ha).
          </p>
        </div>

        {/* KPI 3: Carbono Sequestrado */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Estoque de Carbono</span>
            <Leaf className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {silviMetrics.co2SequestradoHaTon.toFixed(0)}{' '}
            <span className="text-xs font-normal text-[#66736A]">t CO₂eq/ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total sequestrado: {silviMetrics.co2SequestradoTotalTon.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} t CO₂eq.
          </p>
        </div>

        {/* KPI 4: Faturamento por Hectare */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Receita Florestal / ha</span>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            R$ {silviMetrics.faturamentoPorHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-400">/ ha</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total talhão: R$ {silviMetrics.faturamentoTotalMadeiraReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}.
          </p>
        </div>
      </div>

      {/* Grid Principal: Talhões Florestais e Parâmetros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lista de Talhões de Eucalipto */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trees className="w-5 h-5 text-emerald-400" />
                Macronúcleos Florestais & Inventário Contínuo
              </h3>
              <p className="text-xs text-[#66736A]">
                Idade, clones de alta performance e diâmetro à altura do peito (DAP 1,30m).
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {talhoes.length} Talhões Cadastrados
            </span>
          </div>

          <div className="space-y-3">
            {talhoes.map((t) => {
              const isSelected = t.id === talhaoSelecionadoId;
              return (
                <div
                  key={t.id}
                  onClick={() => setTalhaoSelecionadoId(t.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg'
                      : 'bg-[#F7F9F5] border-[#EAF4E7] hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                        {t.id}
                      </span>
                      <h4 className="text-xs font-bold text-white">{t.nome}</h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#66736A]">
                      {t.areaHa} ha • {t.idadeAnos} anos • {t.finalidade.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-300/80 font-mono">
                    Clone: {t.especieClone}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
                    <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                      <span className="text-slate-500 block text-[10px]">DAP Médio</span>
                      <span className="text-white font-bold">{t.dapCm.toFixed(1)} cm</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                      <span className="text-slate-500 block text-[10px]">Altura Média</span>
                      <span className="text-cyan-400 font-bold">{t.alturaMediaM.toFixed(1)} m</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                      <span className="text-slate-500 block text-[10px]">Densidade</span>
                      <span className="text-amber-400 font-bold">{t.arvoresPorHa} árv/ha</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-[#EAF4E7]">
                      <span className="text-slate-500 block text-[10px]">Status de Corte</span>
                      <span className={t.idadeAnos >= 6.5 ? 'text-emerald-400 font-bold' : 'text-[#66736A] font-bold'}>
                        {t.idadeAnos >= 6.5 ? 'Apto Corte Raso' : 'Em Crescimento'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Técnico da Silvicultura */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Manejo Silvicultural no Cerrado:
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Ponto de Inflexão do IMA:</strong> O corte raso para celulose deve ser executado quando o Incremento Corrente Anual (ICA) cruza o Incremento Médio Anual (IMA), tipicamente aos 6,5 a 7,2 anos.
              </li>
              <li>
                <strong>Conservação de Água e Solo:</strong> O cultivo em curvas de nível e manutenção dos resíduos de casca e ponteiras na floresta preserva a umidade do solo e recircula fósforo e potássio.
              </li>
              <li>
                <strong>Certificação FSC/PEFC:</strong> Garante aos compradores globais que a madeira não provém de conversão de vegetação nativa pós-1994, com auditoria rigorosa de conservação da biodiversidade.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Parâmetros Financeiros e Mercadológicos */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Parâmetros Comerciais
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">Preço da Madeira em Pé (R$/m³)</label>
              <input
                type="number"
                value={precoM3MadeiraReais}
                onChange={(e) => setPrecoM3MadeiraReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">Custo de Implantação e Condução (R$/ha)</label>
              <input
                type="number"
                value={custoPlantioPorHaReais}
                onChange={(e) => setCustoPlantioPorHaReais(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Quadro Resumo Financeiro */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Volume por Árvore:</span>
                <span className="text-[#26332A] font-mono">
                  {silviMetrics.volumeArvoreM3.toFixed(3)} m³ / árvore
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Lucro Líquido por Hectare:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  +R$ {silviMetrics.lucroLiquidoHaReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / ha
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Retorno sobre Investimento:</span>
                <span className="text-cyan-400 font-mono">
                  {silviMetrics.roiFlorestal.toFixed(1)}x ({((silviMetrics.roiFlorestal - 1) * 100).toFixed(0)}% ROI)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
