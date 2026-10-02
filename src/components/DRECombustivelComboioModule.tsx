import React, { useState } from 'react';
import {
  DollarSign,
  Fuel,
  TrendingUp,
  BarChart3,
  Truck,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Tractor,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import { TALHOES_INICIAIS, TalhaoData } from '../data/mockAgroData';

export interface DRETalhaoData {
  talhaoId: string;
  codigo: string;
  nome: string;
  cultura: string;
  areaHa: number;
  produtividadeScHa: number;
  precoVendaSaca: number;
  pctDescontoBalanca: number;
  // Decomposição de Custos Absorvidos (R$/ha)
  custoSementesHa: number;
  custoFertilizantesHa: number;
  custoDefensivosHa: number;
  custoDieselHa: number;
  custoHorasMaquinaHa: number;
  custoMaoDeObraArrendamentoHa: number;
}

export interface RegistroAbastecimentoComboio {
  id: string;
  dataHora: string;
  origemComboio: string; // ex: 'Comboio Melosa 01'
  maquinaNome: string;
  operadorNome: string;
  talhaoLocal: string;
  litrosAbastecidos: number;
  horimetroMomento: number;
  horasTrabalhadasPeriodo: number;
  consumoRealLh: number;
  metaFabricanteLh: number;
  desvioPct: number;
  statusAuditoria: 'NORMAL' | 'ALERTA_DESVIO' | 'CRITICO_EXCESSIVO';
}

const DRE_TALHOES_INICIAIS: DRETalhaoData[] = [
  {
    talhaoId: 'talhao-01',
    codigo: 'TAL-01',
    nome: 'Talhão Sede Norte',
    cultura: 'Soja M5947 IPRO',
    areaHa: 420.5,
    produtividadeScHa: 66.4,
    precoVendaSaca: 132.0,
    pctDescontoBalanca: 1.8,
    custoSementesHa: 380.0,
    custoFertilizantesHa: 1850.0,
    custoDefensivosHa: 1120.0,
    custoDieselHa: 283.2,
    custoHorasMaquinaHa: 340.0,
    custoMaoDeObraArrendamentoHa: 560.0,
  },
  {
    talhaoId: 'talhao-02',
    codigo: 'TAL-02',
    nome: 'Talhão Represa Leste',
    cultura: 'Soja BMX Desafio',
    areaHa: 380.0,
    produtividadeScHa: 61.2,
    precoVendaSaca: 132.0,
    pctDescontoBalanca: 2.4,
    custoSementesHa: 395.0,
    custoFertilizantesHa: 1910.0,
    custoDefensivosHa: 1280.0,
    custoDieselHa: 295.0,
    custoHorasMaquinaHa: 360.0,
    custoMaoDeObraArrendamentoHa: 580.0,
  },
  {
    talhaoId: 'talhao-03',
    codigo: 'TAL-03',
    nome: 'Talhão Pivô Central 01',
    cultura: 'Soja TMG 2381',
    areaHa: 510.0,
    produtividadeScHa: 73.8,
    precoVendaSaca: 134.0,
    pctDescontoBalanca: 1.2,
    custoSementesHa: 410.0,
    custoFertilizantesHa: 2150.0,
    custoDefensivosHa: 1150.0,
    custoDieselHa: 240.0,
    custoHorasMaquinaHa: 310.0,
    custoMaoDeObraArrendamentoHa: 620.0,
  },
  {
    talhaoId: 'talhao-04',
    codigo: 'TAL-04',
    nome: 'Talhão Platô Sul',
    cultura: 'Soja M5947 IPRO',
    areaHa: 450.0,
    produtividadeScHa: 58.5,
    precoVendaSaca: 132.0,
    pctDescontoBalanca: 2.1,
    custoSementesHa: 380.0,
    custoFertilizantesHa: 1820.0,
    custoDefensivosHa: 1190.0,
    custoDieselHa: 310.0,
    custoHorasMaquinaHa: 380.0,
    custoMaoDeObraArrendamentoHa: 540.0,
  },
  {
    talhaoId: 'talhao-05',
    codigo: 'TAL-05',
    nome: 'Talhão Córrego Fundo',
    cultura: 'Milho KWS 9010 VIP3',
    areaHa: 360.0,
    produtividadeScHa: 112.0,
    precoVendaSaca: 56.0,
    pctDescontoBalanca: 2.0,
    custoSementesHa: 480.0,
    custoFertilizantesHa: 1650.0,
    custoDefensivosHa: 890.0,
    custoDieselHa: 320.0,
    custoHorasMaquinaHa: 410.0,
    custoMaoDeObraArrendamentoHa: 490.0,
  },
];

const ABASTECIMENTOS_INICIAIS: RegistroAbastecimentoComboio[] = [
  {
    id: 'abs-101',
    dataHora: '2026-09-25 08:30',
    origemComboio: 'Caminhão Comboio Melosa 01',
    maquinaNome: 'Trator John Deere 8370R (Frota #01)',
    operadorNome: 'Valmir Santos',
    talhaoLocal: 'TAL-01 (Sede Norte)',
    litrosAbastecidos: 412,
    horimetroMomento: 3410.8,
    horasTrabalhadasPeriodo: 12.5,
    consumoRealLh: 32.96,
    metaFabricanteLh: 28.0,
    desvioPct: 17.7,
    statusAuditoria: 'ALERTA_DESVIO',
  },
  {
    id: 'abs-102',
    dataHora: '2026-09-25 09:15',
    origemComboio: 'Caminhão Comboio Melosa 01',
    maquinaNome: 'Pulverizador Case Patriot 350 (Frota #04)',
    operadorNome: 'Antônio Silva',
    talhaoLocal: 'TAL-02 (Represa Leste)',
    litrosAbastecidos: 260,
    horimetroMomento: 1890.2,
    horasTrabalhadasPeriodo: 10.0,
    consumoRealLh: 26.0,
    metaFabricanteLh: 25.5,
    desvioPct: 2.0,
    statusAuditoria: 'NORMAL',
  },
  {
    id: 'abs-103',
    dataHora: '2026-09-24 17:40',
    origemComboio: 'Caminhão Comboio Melosa 02',
    maquinaNome: 'Colheitadeira John Deere S790 (Frota #02)',
    operadorNome: 'Marcos Vinícius',
    talhaoLocal: 'TAL-03 (Pivô Central)',
    litrosAbastecidos: 580,
    horimetroMomento: 2120.4,
    horasTrabalhadasPeriodo: 11.2,
    consumoRealLh: 51.78,
    metaFabricanteLh: 52.0,
    desvioPct: -0.4,
    statusAuditoria: 'NORMAL',
  },
  {
    id: 'abs-104',
    dataHora: '2026-09-24 14:10',
    origemComboio: 'Caminhão Comboio Melosa 01',
    maquinaNome: 'Trator New Holland T8.380 (Frota #03)',
    operadorNome: 'Carlos Eduardo',
    talhaoLocal: 'TAL-04 (Platô Sul)',
    litrosAbastecidos: 495,
    horimetroMomento: 4210.0,
    horasTrabalhadasPeriodo: 13.0,
    consumoRealLh: 38.07,
    metaFabricanteLh: 31.0,
    desvioPct: 22.8,
    statusAuditoria: 'CRITICO_EXCESSIVO',
  },
];

export const DRECombustivelComboioModule: React.FC = () => {
  const [subAba, setSubAba] = useState<'DRE' | 'COMBUSTIVEL' | 'OEE'>('DRE');
  const [dreLista] = useState<DRETalhaoData[]>(DRE_TALHOES_INICIAIS);
  const [abastecimentos, setAbastecimentos] = useState<RegistroAbastecimentoComboio[]>(ABASTECIMENTOS_INICIAIS);
  const [talhaoSelecionado, setTalhaoSelecionado] = useState<string>('TODOS');

  // Estados dos Tanques de Combustível
  const [tanqueSedeLitros, setTanqueSedeLitros] = useState<number>(42800);
  const tanqueSedeCapacidade = 60000;
  const [comboio01Litros, setComboio01Litros] = useState<number>(4850);
  const comboio01Capacidade = 6000;
  const [comboio02Litros, setComboio02Litros] = useState<number>(1200);
  const comboio02Capacidade = 4000;

  // Modal Novo Abastecimento
  const [mostrarModalNovoAbs, setMostrarModalNovoAbs] = useState<boolean>(false);
  const [formMaquina, setFormMaquina] = useState<string>('Trator John Deere 8370R (Frota #01)');
  const [formOperador, setFormOperador] = useState<string>('Valmir Santos');
  const [formTalhao, setFormTalhao] = useState<string>('TAL-01');
  const [formLitros, setFormLitros] = useState<number>(350);
  const [formHoras, setFormHoras] = useState<number>(12);
  const [formMeta, setFormMeta] = useState<number>(28.0);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  // Cálculos DRE Consolidados
  const dreCalculado = dreLista.map((item) => {
    const receitaBrutaHa = item.produtividadeScHa * item.precoVendaSaca;
    const descontoBalancaHa = receitaBrutaHa * (item.pctDescontoBalanca / 100);
    const receitaLiquidaHa = receitaBrutaHa - descontoBalancaHa;

    const custoTotalHa =
      item.custoSementesHa +
      item.custoFertilizantesHa +
      item.custoDefensivosHa +
      item.custoDieselHa +
      item.custoHorasMaquinaHa +
      item.custoMaoDeObraArrendamentoHa;

    const margemLiquidaHa = receitaLiquidaHa - custoTotalHa;
    const custoPorSaca = custoTotalHa / item.produtividadeScHa;
    const margemLiquidaPorSaca = margemLiquidaHa / item.produtividadeScHa;

    const receitaTotalTalhao = receitaLiquidaHa * item.areaHa;
    const custoTotalTalhao = custoTotalHa * item.areaHa;
    const lucroLiquidoTalhao = margemLiquidaHa * item.areaHa;

    return {
      ...item,
      receitaBrutaHa,
      receitaLiquidaHa,
      custoTotalHa,
      margemLiquidaHa,
      custoPorSaca,
      margemLiquidaPorSaca,
      receitaTotalTalhao,
      custoTotalTalhao,
      lucroLiquidoTalhao,
    };
  });

  const totalAreaHa = dreCalculado.reduce((acc, curr) => acc + curr.areaHa, 0);
  const totalReceitaLiquida = dreCalculado.reduce((acc, curr) => acc + curr.receitaTotalTalhao, 0);
  const totalCustoAbsorvido = dreCalculado.reduce((acc, curr) => acc + curr.custoTotalTalhao, 0);
  const totalLucroLiquido = totalReceitaLiquida - totalCustoAbsorvido;
  const margemMediaPorHa = totalLucroLiquido / totalAreaHa;

  // Talhão mais lucrativo
  const campeaoMargem = [...dreCalculado].sort((a, b) => b.margemLiquidaHa - a.margemLiquidaHa)[0];

  const handleSalvarAbastecimento = (e: React.FormEvent) => {
    e.preventDefault();
    const consumoReal = formLitros / (formHoras || 1);
    const desvio = ((consumoReal - formMeta) / formMeta) * 100;

    let status: 'NORMAL' | 'ALERTA_DESVIO' | 'CRITICO_EXCESSIVO' = 'NORMAL';
    if (desvio > 15.0) status = 'CRITICO_EXCESSIVO';
    else if (desvio > 5.0) status = 'ALERTA_DESVIO';

    const novo: RegistroAbastecimentoComboio = {
      id: `abs-${Date.now()}`,
      dataHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
      origemComboio: 'Caminhão Comboio Melosa 01',
      maquinaNome: formMaquina,
      operadorNome: formOperador,
      talhaoLocal: formTalhao,
      litrosAbastecidos: Number(formLitros),
      horimetroMomento: 3450.0,
      horasTrabalhadasPeriodo: Number(formHoras),
      consumoRealLh: Number(consumoReal.toFixed(2)),
      metaFabricanteLh: Number(formMeta),
      desvioPct: Number(desvio.toFixed(1)),
      statusAuditoria: status,
    };

    setAbastecimentos([novo, ...abastecimentos]);
    setComboio01Litros((prev) => Math.max(0, prev - formLitros));
    setMostrarModalNovoAbs(false);
    setSucessoMsg(`Abastecimento registrado! Consumo calculado: ${consumoReal.toFixed(2)} L/h (${desvio >= 0 ? '+' : ''}${desvio.toFixed(1)}% vs meta)`);
    setTimeout(() => setSucessoMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1D4B38]">DRE por Talhão & Gestão de Combustível</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Margem R$/sc & ha
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Melosa & Comboio
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Demonstrativo de Resultado do Exercício individualizado por hectare e auditoria antifraude de óleo diesel do comboio.
              </p>
            </div>
          </div>
        </div>

        {/* Seletor de Sub-Abas */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
          <button
            onClick={() => setSubAba('DRE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              subAba === 'DRE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            DRE por Talhão
          </button>
          <button
            onClick={() => setSubAba('COMBUSTIVEL')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              subAba === 'COMBUSTIVEL'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            Comboio & Diesel
          </button>
          <button
            onClick={() => setSubAba('OEE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              subAba === 'OEE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            OEE de Máquinas
          </button>
        </div>
      </div>

      {sucessoMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{sucessoMsg}</span>
          </div>
          <button onClick={() => setSucessoMsg(null)} className="text-xs text-emerald-400 hover:underline">
            Fechar
          </button>
        </div>
      )}

      {/* SUB-ABA 1: DRE POR TALHÃO */}
      {subAba === 'DRE' && (
        <div className="space-y-6">
          {/* Cards Executivos Consolidados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Área Consolidada</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-[#1D4B38] font-mono">{totalAreaHa.toFixed(1)} ha</div>
              <p className="text-xs text-slate-500 mt-1">5 talhões agrícolas ativos na safra</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Receita Líquida Total</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-[#1D4B38] font-mono">
                R$ {(totalReceitaLiquida / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-slate-500 mt-1">Após descontos técnicos de balança</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Custo Absorvido Total</span>
                <PieChart className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-[#1D4B38] font-mono">
                R$ {(totalCustoAbsorvido / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-slate-500 mt-1">Insumos + Diesel + Horas + Fixos</p>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl">
              <div className="flex items-center justify-between text-emerald-300 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">Lucro Líquido Safra</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-200 font-mono">
                R$ {(totalLucroLiquido / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-emerald-400/80 mt-1">
                Média de R$ {margemMediaPorHa.toFixed(2)} / hectare
              </p>
            </div>
          </div>

          {/* Destaque do Campeão de Margem */}
          {campeaoMargem && (
            <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-700/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Campeão de Rentabilidade Safra
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full">
                      {campeaoMargem.codigo} - {campeaoMargem.nome}
                    </span>
                  </div>
                  <div className="text-sm text-slate-900 font-medium mt-0.5">
                    Margem Líquida de <strong className="text-emerald-300 font-mono">R$ {campeaoMargem.margemLiquidaPorSaca.toFixed(2)} / sc</strong> (R$ {campeaoMargem.margemLiquidaHa.toFixed(2)} / ha)
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600">Lucro Líquido Gerado pelo Talhão:</span>
                <div className="text-lg font-bold font-mono text-emerald-300">
                  R$ {campeaoMargem.lucroLiquidoTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          )}

          {/* Tabela DRE Analítica por Talhão */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#1D4B38] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  DRE Detalhado Talhão a Talhão
                </h2>
                <p className="text-xs text-slate-600">
                  Apurado por absorção direta de custos agronômicos, mecânicos e descontos de balança
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Talhão & Cultura</th>
                    <th className="px-4 py-3.5">Área & Produtividade</th>
                    <th className="px-4 py-3.5">Receita Líquida (R$/ha)</th>
                    <th className="px-4 py-3.5">Insumos (R$/ha)</th>
                    <th className="px-4 py-3.5">Frota & Diesel (R$/ha)</th>
                    <th className="px-4 py-3.5">Custo Total (R$/sc)</th>
                    <th className="px-4 py-3.5">Margem Líq. (R$/sc)</th>
                    <th className="px-4 py-3.5">Lucro Total Talhão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dreCalculado.map((item) => {
                    const insumosHa = item.custoSementesHa + item.custoFertilizantesHa + item.custoDefensivosHa;
                    const frotaHa = item.custoDieselHa + item.custoHorasMaquinaHa;

                    return (
                      <tr key={item.talhaoId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{item.codigo}</div>
                          <div className="text-slate-600 text-[11px]">{item.nome}</div>
                          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">{item.cultura}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900 font-mono">{item.areaHa} ha</div>
                          <div className="text-[11px] text-slate-600 font-mono">
                            {item.produtividadeScHa} sc/ha @ R$ {item.precoVendaSaca}/sc
                          </div>
                          <div className="text-[10px] text-amber-400 mt-0.5">
                            Desc. Balança: -{item.pctDescontoBalanca}%
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-[#1D4B38]">
                            R$ {item.receitaLiquidaHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Bruta: R$ {item.receitaBrutaHa.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono text-slate-900 font-medium">
                            R$ {insumosHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Adubo R${item.custoFertilizantesHa} • Def. R${item.custoDefensivosHa}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono text-slate-900 font-medium">
                            R$ {frotaHa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Diesel: R$ {item.custoDieselHa.toFixed(2)}/ha
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-amber-300">
                            R$ {item.custoPorSaca.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Total: R$ {item.custoTotalHa.toFixed(2)}/ha
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div
                            className={`font-mono font-bold text-sm ${
                              item.margemLiquidaPorSaca >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            R$ {item.margemLiquidaPorSaca.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-600">
                            R$ {item.margemLiquidaHa.toFixed(2)} / ha
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-emerald-300">
                            R$ {item.lucroLiquidoTalhao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <span className="text-[10px] text-emerald-400/80">Líquido</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 2: COMBOIO & DIESEL */}
      {subAba === 'COMBUSTIVEL' && (
        <div className="space-y-6">
          {/* Níveis dos Tanques Fixo e Comboios Móveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tanque Sede */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tanque Central Fixo (Sede)
                </span>
                <Fuel className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-bold font-mono text-[#1D4B38]">
                  {tanqueSedeLitros.toLocaleString('pt-BR')} L
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  Cap: {tanqueSedeCapacidade.toLocaleString('pt-BR')} L
                </div>
              </div>
              {/* Barra de Progresso */}
              <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(tanqueSedeLitros / tanqueSedeCapacidade) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                <span>Nível: {((tanqueSedeLitros / tanqueSedeCapacidade) * 100).toFixed(1)}%</span>
                <span className="text-emerald-400">Autonomia: ~18 dias de safra</span>
              </div>
            </div>

            {/* Melosa 01 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Caminhão Melosa 01 (Campo)
                </span>
                <Truck className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-bold font-mono text-[#1D4B38]">
                  {comboio01Litros.toLocaleString('pt-BR')} L
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  Cap: {comboio01Capacidade.toLocaleString('pt-BR')} L
                </div>
              </div>
              <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${(comboio01Litros / comboio01Capacidade) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                <span>Nível: {((comboio01Litros / comboio01Capacidade) * 100).toFixed(1)}%</span>
                <span className="text-indigo-400">Em operação no TAL-01/02</span>
              </div>
            </div>

            {/* Melosa 02 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Caminhão Melosa 02 (Campo)
                </span>
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div className="text-2xl font-bold font-mono text-rose-300">
                  {comboio02Litros.toLocaleString('pt-BR')} L
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  Cap: {comboio02Capacidade.toLocaleString('pt-BR')} L
                </div>
              </div>
              <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${(comboio02Litros / comboio02Capacidade) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                <span className="text-rose-400 font-semibold">Nível: 30.0% (Crítico)</span>
                <span className="text-amber-400 hover:underline cursor-pointer">Solicitar Recarga Sede</span>
              </div>
            </div>
          </div>

          {/* Registro de Abastecimentos no Campo & Auditoria de Desvios */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#1D4B38] flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-amber-400" />
                  Auditoria de Abastecimentos & Detecção de Desvios de Diesel
                </h2>
                <p className="text-xs text-slate-600">
                  Cruzamento automático de Litros Abastecidos × Horas Trabalhadas × Consumo Padrão de Fábrica (L/h)
                </p>
              </div>

              <button
                onClick={() => setMostrarModalNovoAbs(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Registrar Abastecimento de Campo
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Data & Máquina</th>
                    <th className="px-4 py-3.5">Origem / Comboio</th>
                    <th className="px-4 py-3.5">Operador & Local</th>
                    <th className="px-4 py-3.5">Volume & Horímetro</th>
                    <th className="px-4 py-3.5">Consumo Real</th>
                    <th className="px-4 py-3.5">Meta Fábrica</th>
                    <th className="px-4 py-3.5">Desvio / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {abastecimentos.map((abs) => {
                    let badge = (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Em Conformidade ({abs.desvioPct}%)
                      </span>
                    );

                    if (abs.statusAuditoria === 'CRITICO_EXCESSIVO') {
                      badge = (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> Desvio Alto (+{abs.desvioPct}%)
                        </span>
                      );
                    } else if (abs.statusAuditoria === 'ALERTA_DESVIO') {
                      badge = (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Atenção (+{abs.desvioPct}%)
                        </span>
                      );
                    }

                    return (
                      <tr key={abs.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{abs.maquinaNome}</div>
                          <div className="text-[11px] text-slate-600">{abs.dataHora}</div>
                        </td>

                        <td className="px-4 py-3.5 text-slate-900 font-medium">
                          {abs.origemComboio}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="text-slate-900 font-medium">{abs.operadorNome}</div>
                          <div className="text-[11px] text-slate-600">{abs.talhaoLocal}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-amber-300 font-mono text-sm">
                            {abs.litrosAbastecidos} Litros
                          </div>
                          <div className="text-[11px] text-slate-600 font-mono">
                            Horímetro: {abs.horimetroMomento} h ({abs.horasTrabalhadasPeriodo}h trab.)
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-slate-900">
                            {abs.consumoRealLh.toFixed(2)} L/h
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-slate-600 font-mono">
                          {abs.metaFabricanteLh.toFixed(1)} L/h
                        </td>

                        <td className="px-4 py-3.5">{badge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 3: OEE AGRÍCOLA */}
      {subAba === 'OEE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl">
              <span className="text-xs text-slate-600 uppercase tracking-wider block mb-1">
                Disponibilidade Mecânica
              </span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">91.4%</div>
              <p className="text-xs text-slate-500 mt-1">Horas operando / horas totais de escala</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl">
              <span className="text-xs text-slate-600 uppercase tracking-wider block mb-1">
                Eficiência Operacional
              </span>
              <div className="text-2xl font-bold text-indigo-400 font-mono">84.2%</div>
              <p className="text-xs text-slate-500 mt-1">Tempo efetivo na linha vs manobras</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl">
              <span className="text-xs text-slate-600 uppercase tracking-wider block mb-1">
                Qualidade de Execução
              </span>
              <div className="text-2xl font-bold text-cyan-400 font-mono">88.5%</div>
              <p className="text-xs text-slate-500 mt-1">População de sementes e desvio de rota</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-700/60 p-4 rounded-xl">
              <span className="text-xs text-indigo-300 uppercase tracking-wider block mb-1">
                OEE Global da Fazenda
              </span>
              <div className="text-3xl font-extrabold text-indigo-200 font-mono">68.1%</div>
              <p className="text-xs text-indigo-400/80 mt-1">
                Classe Mundial no Agronegócio (&gt; 65%)
              </p>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl">
            <h3 className="text-base font-bold text-[#1D4B38] mb-2">
              Composição das Horas de Trabalho de Frota (CAN Bus)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Distribuição percentual do horímetro das máquinas em operação durante a janela de plantio e pulverização:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-900 mb-1">
                  <span>Trabalho Efetivo Produtivo (Linha de Plantio / Pulverização)</span>
                  <span className="font-mono font-bold text-emerald-400">68.1% (545h)</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '68.1%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-900 mb-1">
                  <span>Manobra em Cabeceira de Talhão</span>
                  <span className="font-mono font-bold text-indigo-400">14.3% (114h)</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '14.3%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-900 mb-1">
                  <span>Deslocamento entre Talhões / Estradas Internas</span>
                  <span className="font-mono font-bold text-amber-400">8.9% (71h)</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '8.9%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-900 mb-1">
                  <span>Ocioso com Motor Ligado (Parado em Abastecimento/Espera de Caminhão)</span>
                  <span className="font-mono font-bold text-rose-400">8.7% (70h)</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '8.7%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Abastecimento */}
      {mostrarModalNovoAbs && (
        <div className="fixed inset-0 z-50 bg-slate-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-[#1D4B38] flex items-center gap-2">
                <Fuel className="w-5 h-5 text-amber-400" />
                Registrar Abastecimento de Comboio
              </h3>
              <button
                onClick={() => setMostrarModalNovoAbs(false)}
                className="text-slate-600 hover:text-slate-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarAbastecimento} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-900 block mb-1 font-medium">Máquina Abastecida:</label>
                <select
                  value={formMaquina}
                  onChange={(e) => {
                    const m = e.target.value;
                    setFormMaquina(m);
                    if (m.includes('8370R')) setFormMeta(28.0);
                    else if (m.includes('Patriot')) setFormMeta(25.5);
                    else if (m.includes('S790')) setFormMeta(52.0);
                    else setFormMeta(31.0);
                  }}
                  className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                >
                  <option value="Trator John Deere 8370R (Frota #01)">Trator John Deere 8370R (Frota #01)</option>
                  <option value="Pulverizador Case Patriot 350 (Frota #04)">Pulverizador Case Patriot 350 (Frota #04)</option>
                  <option value="Colheitadeira John Deere S790 (Frota #02)">Colheitadeira John Deere S790 (Frota #02)</option>
                  <option value="Trator New Holland T8.380 (Frota #03)">Trator New Holland T8.380 (Frota #03)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Operador:</label>
                  <input
                    type="text"
                    value={formOperador}
                    onChange={(e) => setFormOperador(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Talhão da Operação:</label>
                  <input
                    type="text"
                    value={formTalhao}
                    onChange={(e) => setFormTalhao(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Litros:</label>
                  <input
                    type="number"
                    value={formLitros}
                    onChange={(e) => setFormLitros(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Horas Trab.:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formHoras}
                    onChange={(e) => setFormHoras(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-900 block mb-1 font-medium">Meta Fábrica:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formMeta}
                    onChange={(e) => setFormMeta(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-700 rounded-lg px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Consumo estimado: <strong>{((formLitros / (formHoras || 1))).toFixed(2)} L/h</strong>. Desvios acima de +15% disparam alerta de auditoria de combustível.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMostrarModalNovoAbs(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Registrar Abastecimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DRECombustivelComboioModule;
