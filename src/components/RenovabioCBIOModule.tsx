import React, { useState, useMemo } from 'react';
import {
  Coins,
  Leaf,
  Factory,
  TrendingUp,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Fuel,
  Info
} from 'lucide-react';

interface ContratoUsinas {
  id: string;
  usinaNome: string;
  localizacao: string;
  volumeContratadoTon: number;
  tipoBiocombustivel: 'ETANOL_MILHO' | 'BIODIESEL_SOJA' | 'ETANOL_CANA';
  statusCertificacao: 'CERTIFICADA_ELEGIVEL' | 'AUDITORIA_EM_ANDAMENTO';
}

export const RenovabioCBIOModule: React.FC = () => {
  // Parâmetros de Produção e Entrega
  const [toneladasMilhoEntregues, setToneladasMilhoEntregues] = useState<number>(18000); // 18.000 t milho
  const [intensidadeCarbonoFazenda, setIntensidadeCarbonoFazenda] = useState<number>(31.8); // gCO2eq/MJ (RenovaCalc)
  const [precoCbioB3, setPrecoCbioB3] = useState<number>(88.50); // R$ por CBIO na B3
  const [emissaoReferenciaFossil, setEmissaoReferenciaFossil] = useState<number>(87.4); // Padrão ANP (gCO2eq/MJ gasolina/diesel)
  const [litrosEtanolPorTonMilho, setLitrosEtanolPorTonMilho] = useState<number>(415); // 415 L de etanol anidro/t
  const [densidadeEnergeticaMjL, setDensidadeEnergeticaMjL] = useState<number>(21.34); // MJ/L
  const [percentualPartilhaProdutor, setPercentualPartilhaProdutor] = useState<number>(70); // % de repasse dos CBIOs da Usina para o Produtor (Lei 14.592)

  // Contratos com Usinas de Biocombustíveis
  const [contratos, setContratos] = useState<ContratoUsinas[]>([
    {
      id: 'USN-01',
      usinaNome: 'FS Bioenergia • Lucas do Rio Verde',
      localizacao: 'Lucas do Rio Verde / MT',
      volumeContratadoTon: 10000,
      tipoBiocombustivel: 'ETANOL_MILHO',
      statusCertificacao: 'CERTIFICADA_ELEGIVEL',
    },
    {
      id: 'USN-02',
      usinaNome: 'Inpasa Agroindustrial • Sinop',
      localizacao: 'Sinop / MT',
      volumeContratadoTon: 8000,
      tipoBiocombustivel: 'ETANOL_MILHO',
      statusCertificacao: 'CERTIFICADA_ELEGIVEL',
    },
  ]);

  // Cálculos do RenovaBio e Emissão de CBIOs
  const renovaMetrics = useMemo(() => {
    // 1. Nota de Eficiência Energético-Ambiental (NEEA)
    const neea = Math.max(0, emissaoReferenciaFossil - intensidadeCarbonoFazenda);
    const elegivel = neea > 0;

    // 2. Volume de Etanol Gerado e Energia Total
    const totalLitrosEtanol = toneladasMilhoEntregues * litrosEtanolPorTonMilho;
    const energiaTotalMj = totalLitrosEtanol * densidadeEnergeticaMjL;

    // 3. Emissões de CO2 Abatidas (toneladas)
    // 1 CBIO = 1 tonelada de CO2eq evitada
    // Energia (MJ) * NEEA (g/MJ) / 1.000.000 (g para ton)
    const co2AbatidoTon = (energiaTotalMj * neea) / 1000000;
    const totalCbiosGerados = Math.floor(co2AbatidoTon);

    // 4. Repasse ao Produtor Rural (Partilha RenovaBio)
    const cbiosProdutor = Math.floor(totalCbiosGerados * (percentualPartilhaProdutor / 100));
    const receitaBrutaCbiosReais = cbiosProdutor * precoCbioB3;

    // 5. Prêmio Adicional por Saca de Milho (60kg)
    const totalSacasMilho = toneladasMilhoEntregues * (1000 / 60);
    const premioPorSacaReais = totalSacasMilho > 0 ? receitaBrutaCbiosReais / totalSacasMilho : 0;

    return {
      neea,
      elegivel,
      totalLitrosEtanol,
      energiaTotalMj,
      co2AbatidoTon,
      totalCbiosGerados,
      cbiosProdutor,
      receitaBrutaCbiosReais,
      totalSacasMilho,
      premioPorSacaReais,
    };
  }, [
    toneladasMilhoEntregues,
    intensidadeCarbonoFazenda,
    precoCbioB3,
    emissaoReferenciaFossil,
    litrosEtanolPorTonMilho,
    densidadeEnergeticaMjL,
    percentualPartilhaProdutor,
  ]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  RenovaBio & Créditos de Descarbonização (CBIOs)
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    B3 • ANP Lei 13.576
                  </span>
                </h2>
                <p className="text-sm text-[#66736A]">
                  Certificação de biomassa de milho/soja para usinas de etanol, Nota NEEA e cálculo de bônus financeiro em CBIOs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              CAR 100% Elegível RenovaBio
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Nota NEEA */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Nota de Eficiência (NEEA)</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-400">
            {renovaMetrics.neea.toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#66736A]">gCO₂eq/MJ</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Redução de {((renovaMetrics.neea / emissaoReferenciaFossil) * 100).toFixed(1)}% vs fóssil.
          </p>
        </div>

        {/* KPI 2: CBIOs Gerados */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>CBIOs do Produtor</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-400">
            {renovaMetrics.cbiosProdutor.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-[#66736A]">CBIOs ({percentualPartilhaProdutor}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total gerado na usina: {renovaMetrics.totalCbiosGerados.toLocaleString('pt-BR')} t CO₂eq.
          </p>
        </div>

        {/* KPI 3: Receita Financeira em CBIOs */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Receita em CBIOs</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-cyan-400">
            R$ {renovaMetrics.receitaBrutaCbiosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cotação B3: R$ {precoCbioB3.toFixed(2)} / CBIO.
          </p>
        </div>

        {/* KPI 4: Prêmio na Saca de Milho */}
        <div className="bg-white border border-[#EAF4E7] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#66736A] font-medium">
            <span>Prêmio Extra / Saca</span>
            <Fuel className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-white">
            +R$ {renovaMetrics.premioPorSacaReais.toFixed(2)}{' '}
            <span className="text-xs font-normal text-emerald-400">/ sc milho</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Sobre 300.000 sacas entregues às biorrefinarias.
          </p>
        </div>
      </div>

      {/* Grid Principal: Parâmetros e Contratos de Usina */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Contratos com Usinas e Balanço */}
        <div className="lg:col-span-2 bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Factory className="w-5 h-5 text-emerald-400" />
                Contratos de Fornecimento para Biorrefinarias de Etanol
              </h3>
              <p className="text-xs text-[#66736A]">
                Usinas homologadas com rastreabilidade geoespacial de biomassa elegível.
              </p>
            </div>
            <span className="text-xs font-mono text-[#66736A]">
              {contratos.length} Contratos Vigentes
            </span>
          </div>

          <div className="space-y-3">
            {contratos.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EAF4E7] text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.usinaNome}</h4>
                    <p className="text-[11px] text-[#66736A]">
                      {c.localizacao} • {c.tipoBiocombustivel.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      {c.volumeContratadoTon.toLocaleString('pt-BR')} t
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {(c.volumeContratadoTon * 16.6667).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} sacas
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold font-mono">
                    {c.statusCertificacao === 'CERTIFICADA_ELEGIVEL' ? 'Elegível' : 'Em Auditoria'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner RenovaCalc ANP */}
          <div className="p-4 bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              Diretrizes de Elegibilidade e Emissão RenovaBio (ANP):
            </div>
            <ul className="list-disc list-inside text-[#66736A] space-y-1">
              <li>
                <strong>Desmatamento Zero pós-2018:</strong> Apenas talhões sem qualquer supressão de vegetação nativa após dezembro de 2018 geram lastro de biomassa elegível.
              </li>
              <li>
                <strong>Partilha de CBIOs (Lei 14.592/2023):</strong> Garante aos produtores de biomassa cadastrados o repasse de 60% a 85% do valor financeiro dos CBIOs emitidos pela usina.
              </li>
              <li>
                <strong>Cálculo com RenovaCalc:</strong> O uso de plantio direto, adubação de precisão e plantas de cobertura reduz a intensidade de carbono da fazenda de 45 para ~31 gCO₂eq/MJ, ampliando a nota NEEA.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Simulador de Parâmetros de Carbono */}
        <div className="bg-white border border-[#EAF4E7] rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Parâmetros RenovaCalc
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#66736A] font-medium block mb-1">
                Volume de Milho Entregue (toneladas)
              </label>
              <input
                type="number"
                value={toneladasMilhoEntregues}
                onChange={(e) => setToneladasMilhoEntregues(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#66736A] font-medium">Intensidade de Carbono Fazenda</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {intensidadeCarbonoFazenda} gCO₂/MJ
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="0.5"
                value={intensidadeCarbonoFazenda}
                onChange={(e) => setIntensidadeCarbonoFazenda(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[#66736A] font-medium block mb-1">
                Preço do CBIO no Mercado B3 (R$/t CO₂)
              </label>
              <input
                type="number"
                value={precoCbioB3}
                onChange={(e) => setPrecoCbioB3(Number(e.target.value))}
                className="w-full bg-[#F7F9F5] border border-[#EAF4E7] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#66736A] font-medium">% Repasse dos CBIOs ao Produtor</span>
                <span className="text-amber-400 font-mono font-bold">
                  {percentualPartilhaProdutor}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={percentualPartilhaProdutor}
                onChange={(e) => setPercentualPartilhaProdutor(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-[#EAF4E7] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#66736A]">Volume de Etanol Anidro:</span>
                <span className="text-[#26332A] font-mono">
                  {(renovaMetrics.totalLitrosEtanol / 1000000).toFixed(2)} M Litros
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736A]">Total CBIOs Usina:</span>
                <span className="text-[#26332A] font-mono">
                  {renovaMetrics.totalCbiosGerados} CBIOs
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAF4E7] pt-2 font-bold">
                <span className="text-white">Receita Líquida Fazenda:</span>
                <span className="text-emerald-400 font-mono">
                  R$ {renovaMetrics.receitaBrutaCbiosReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
