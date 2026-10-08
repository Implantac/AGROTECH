import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Clock,
  Coins,
  Layers,
  MapPin,
  CheckCircle2,
  Flower2
} from 'lucide-react';

interface Apiario {
  id: string;
  nome: string;
  talhaoAlvo: string;
  culturaAlvo: 'SOJA' | 'CAFE' | 'CITROS' | 'GIRASSOL';
  colmeiasAtivas: number;
  raioVooKm: number;
  areaCoberturaHa: number;
  producaoMelKgAno: number;
  statusSanitario: 'SAUDAVEL' | 'REQUER_INSPECAO';
}

export const ApiculturaPolinizacaoModule: React.FC = () => {
  const [apiarios, setApiarios] = useState<Apiario[]>([
    {
      id: 'API-01',
      nome: 'Apiário Colina Leste',
      talhaoAlvo: 'Talhão 04 - Soja Safra',
      culturaAlvo: 'SOJA',
      colmeiasAtivas: 350,
      raioVooKm: 2.5,
      areaCoberturaHa: 450,
      producaoMelKgAno: 8750,
      statusSanitario: 'SAUDAVEL',
    },
    {
      id: 'API-02',
      nome: 'Apiário Reserva Sul',
      talhaoAlvo: 'Talhão 12 - Café Conilon',
      culturaAlvo: 'CAFE',
      colmeiasAtivas: 250,
      raioVooKm: 2.0,
      areaCoberturaHa: 280,
      producaoMelKgAno: 6250,
      statusSanitario: 'SAUDAVEL',
    },
    {
      id: 'API-03',
      nome: 'Apiário Bosque dos Ipês',
      talhaoAlvo: 'Talhão 08 - Girassol Safrinha',
      culturaAlvo: 'GIRASSOL',
      colmeiasAtivas: 180,
      raioVooKm: 2.2,
      areaCoberturaHa: 220,
      producaoMelKgAno: 4500,
      statusSanitario: 'SAUDAVEL',
    },
  ]);

  // Parâmetros de Simulação de Polinização Entomófila Dirigida
  const [produtividadeBaseScHa, setProdutividadeBaseScHa] = useState<number>(62.0);
  const [ganhoPolinizacaoPct, setGanhoPolinizacaoPct] = useState<number>(14.0); // +14% média Embrapa
  const [precoSacaReais, setPrecoSacaReais] = useState<number>(130.0);
  const [precoMelKgReais, setPrecoMelKgReais] = useState<number>(18.5);
  const [horaAtualPulverizacao, setHoraAtualPulverizacao] = useState<string>('10:30'); // Horário diurno de pico de forrageamento

  // Cálculos do Módulo
  const metrics = useMemo(() => {
    const totalColmeias = apiarios.reduce((acc, a) => acc + a.colmeiasAtivas, 0);
    const areaTotalPolinizadaHa = apiarios.reduce((acc, a) => acc + a.areaCoberturaHa, 0);
    const producaoMelTotalKg = apiarios.reduce((acc, a) => acc + a.producaoMelKgAno, 0);

    // Ganho agronômico na cultura
    const produtividadeComAbelhasScHa = produtividadeBaseScHa * (1 + ganhoPolinizacaoPct / 100);
    const incrementoScHa = produtividadeComAbelhasScHa - produtividadeBaseScHa;
    const ganhoAgroPorHaReais = incrementoScHa * precoSacaReais;
    const ganhoAgroTotalReais = ganhoAgroPorHaReais * areaTotalPolinizadaHa;

    // Receita direta apícola (Mel / Própolis)
    const receitaMelReais = producaoMelTotalKg * precoMelKgReais;

    // Benefício financeiro consolidado
    const beneficioTotalReais = ganhoAgroTotalReais + receitaMelReais;

    // Checagem de Bee-Safe Window (Horário seguro: antes das 06:30 ou após as 17:30)
    const [horas, minutos] = horaAtualPulverizacao.split(':').map(Number);
    const minutosDia = horas * 60 + minutos;
    const isJanelaSegura = minutosDia < 390 || minutosDia > 1050; // < 06:30 ou > 17:30

    return {
      totalColmeias,
      areaTotalPolinizadaHa,
      producaoMelTotalKg,
      produtividadeComAbelhasScHa,
      incrementoScHa,
      ganhoAgroPorHaReais,
      ganhoAgroTotalReais,
      receitaMelReais,
      beneficioTotalReais,
      isJanelaSegura,
    };
  }, [
    apiarios,
    produtividadeBaseScHa,
    ganhoPolinizacaoPct,
    precoSacaReais,
    precoMelKgReais,
    horaAtualPulverizacao,
  ]);

  return (
    <div className="space-y-6 animate-fade-in text-[#1D4B38]">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-700">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Apicultura de Precisão & Polinização Dirigida
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 font-mono border border-amber-500/30">
                    Apis mellifera • Bee-Safe Window • Embrapa
                  </span>
                </h2>
                <p className="text-sm text-slate-600">
                  Aumento de produtividade vegetal via polinização entomófila, proteção contra deriva de agroquímicos e safra de mel sustentável.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 ${
                metrics.isJanelaSegura
                  ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {metrics.isJanelaSegura ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Janela Segura (Bee-Safe ATIVA)
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  Alerta: Horário de Forrageamento Intenso
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Ganho de Produtividade */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Incremento Agronômico</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-emerald-700">
            +{metrics.incrementoScHa.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-600">sc/ha (+{ganhoPolinizacaoPct}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Passa de {produtividadeBaseScHa.toFixed(1)} para {metrics.produtividadeComAbelhasScHa.toFixed(1)} sc/ha na área de voo.
          </p>
        </div>

        {/* KPI 2: Valor Agregado na Lavoura */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Ganho Grãos/Café Polinizado</span>
            <Coins className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-amber-700">
            R$ {metrics.ganhoAgroTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            +R$ {metrics.ganhoAgroPorHaReais.toFixed(2)}/ha em {metrics.areaTotalPolinizadaHa} ha atendidos.
          </p>
        </div>

        {/* KPI 3: Produção de Mel & Própolis */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Safra de Mel Anual</span>
            <Flower2 className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-yellow-400">
            {metrics.producaoMelTotalKg.toLocaleString('pt-BR')}{' '}
            <span className="text-xs font-normal text-slate-600">kg (R$ {metrics.receitaMelReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })})</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Média de {(metrics.producaoMelTotalKg / metrics.totalColmeias).toFixed(1)} kg/colmeia/ano em {metrics.totalColmeias} caixas.
          </p>
        </div>

        {/* KPI 4: Benefício Econômico Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Retorno Integrado Total</span>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-black mt-2 font-mono text-slate-800">
            R$ {metrics.beneficioTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}{' '}
            <span className="text-xs font-normal text-emerald-700">/ ano</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Lavoura + Apicultura consorciada em simbiose biológica.
          </p>
        </div>
      </div>

      {/* Grid de Apiários e Simulador Bee-Safe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Lista de Apiários Georreferenciados */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-700" />
                Mapeamento de Apiários & Raio de Ação
              </h3>
              <p className="text-xs text-slate-600">
                Colmeias instaladas estrategicamente nas bordas de talhões e reservas legais.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600">
              {apiarios.length} Apiários Ativos
            </span>
          </div>

          <div className="space-y-3">
            {apiarios.map((a) => (
              <div
                key={a.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 font-mono text-xs font-bold border border-amber-500/30">
                      {a.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{a.nome}</h4>
                    <span className="text-[11px] text-slate-600">• {a.talhaoAlvo}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 text-[10px] font-mono border border-emerald-500/30">
                    {a.statusSanitario}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-600">
                  <span>Colmeias: <strong className="text-white">{a.colmeiasAtivas} un</strong></span>
                  <span>Raio de Voo: <strong className="text-amber-700">{a.raioVooKm} km</strong></span>
                  <span>Área Atendida: <strong className="text-sky-700">{a.areaCoberturaHa} ha</strong></span>
                  <span>Mel: <strong className="text-yellow-400">{a.producaoMelKgAno.toLocaleString('pt-BR')} kg/ano</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner de Boas Práticas Bee-Safe */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Diretrizes de Proteção aos Polinizadores (Protocolo Bee-Safe MAPA/Embrapa):
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
              <li>
                <strong>Comunicação Prévia:</strong> Notificar os apicultores com no mínimo 48 horas de antecedência de pulverizações de inseticidas num raio de 3 km.
              </li>
              <li>
                <strong>Janela Noturna de Aplicação:</strong> Realizar aplicações de defensivos exclusivamente entre as 18h e 06h, quando as abelhas estão recolhidas às colmeias.
              </li>
              <li>
                <strong>Taxa de Pegamento de Florada:</strong> Em culturas com flores hermafroditas e alógamas, o número de vagens/sementes por fruto aumenta entre 12% e 22% com 2 a 3 colmeias/ha.
              </li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Simulador de Parâmetros e Pulverização */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            Simulador de Manejo & Alerta
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Horário da Pulverização Programada</span>
                <span className="text-amber-700 font-mono font-bold">{horaAtualPulverizacao}h</span>
              </div>
              <input
                type="time"
                value={horaAtualPulverizacao}
                onChange={(e) => setHoraAtualPulverizacao(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
              {!metrics.isJanelaSegura ? (
                <p className="text-[11px] text-rose-700 mt-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Alerta: Horário de forrageamento ativo. Risco de intoxicação de colmeias!
                </p>
              ) : (
                <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Janela segura para pulverização (abelhas protegidas nas caixas).
                </p>
              )}
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Produtividade Base da Lavoura (sc/ha)</label>
              <input
                type="number"
                value={produtividadeBaseScHa}
                onChange={(e) => setProdutividadeBaseScHa(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Ganho Agronômico Estimado (%)</span>
                <span className="text-emerald-700 font-mono font-bold">+{ganhoPolinizacaoPct}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={ganhoPolinizacaoPct}
                onChange={(e) => setGanhoPolinizacaoPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço da Saca (R$)</label>
              <input
                type="number"
                value={precoSacaReais}
                onChange={(e) => setPrecoSacaReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Preço do Mel Comercializado (R$/kg)</label>
              <input
                type="number"
                value={precoMelKgReais}
                onChange={(e) => setPrecoMelKgReais(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Resumo Consolidado */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Ganho na Safra (+{metrics.incrementoScHa.toFixed(2)} sc/ha):</span>
                <span className="text-amber-700 font-mono font-bold">
                  R$ {metrics.ganhoAgroTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Venda do Mel:</span>
                <span className="text-yellow-400 font-mono font-bold">
                  R$ {metrics.receitaMelReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-white">Retorno Econômico Global:</span>
                <span className="text-emerald-700 font-mono">
                  R$ {metrics.beneficioTotalReais.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
