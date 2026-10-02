import React from 'react';
import {
  FileText,
  Printer,
  Download,
  Building,
  CheckCircle,
  Sprout,
  DollarSign,
  Award,
  Truck,
  Scale,
  ShieldCheck,
  Activity,
  Sparkles,
  Layers,
  Fuel
} from 'lucide-react';
import {
  TALHOES_INICIAIS,
  CONTRATOS_BARTER_INICIAIS,
  RECEITUARIOS_INICIAIS,
  CONDOMINOS_FAZENDA
} from '../data/mockAgroData';

interface RelatorioSafraModuleProps {
  profileId?: string;
}

export const RelatorioSafraModule: React.FC<RelatorioSafraModuleProps> = ({ profileId = 'AGRICULTURA_GRAOS' }) => {
  const totalAreaHa = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.areaHa, 0);
  const totalCustoABC = TALHOES_INICIAIS.reduce((acc, curr) => acc + curr.custoTotalABC, 0);
  const custoMedioHa = totalCustoABC / totalAreaHa;

  const handleImprimirRelatorio = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner do Relatório */}
      <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Auditoria & Caderno Oficial
            </span>
            <span className="text-xs text-[#66736A]">Prestação de Contas Bancárias & Seguro Agrícola / Pecuário</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            {profileId === 'PECUARIA_CORTE_LEITE'
              ? 'Dossiê Zootécnico & Fechamento de Giro de Confinamento'
              : profileId === 'HORTIFRUTI_FLORICULTURA'
              ? 'Caderno de Campo HF, Rastreabilidade & Certificação GlobalGAP'
              : profileId === 'BIOENERGIA_SUCROALCOOLEIRO'
              ? 'Relatório Consolidado de Moagem, ATR & Certificação RenovaBio'
              : 'Relatório Executivo de Fechamento de Safra 2025/2026'}
          </h2>
          <p className="text-xs text-[#66736A] mt-1">
            Documento consolidado exigido por bancos (Banco do Brasil, Sicredi, Bradesco Agro) para comprovação de crédito rural (Proagro, CPR) e auditorias de conformidade.
          </p>
        </div>

        <button
          onClick={handleImprimirRelatorio}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Imprimir Documento Oficial (PDF)
        </button>
      </div>

      {/* Relatório Formatado Estilo Folha Oficial A4 */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-8 font-sans">
        {profileId === 'PECUARIA_CORTE_LEITE' ? (
          /* ========================================================================= */
          /* DOSSIÊ PECUÁRIA & CONFINAMENTO                                            */
          /* ========================================================================= */
          <>
            {/* Cabeçalho */}
            <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-emerald-700">SUPER AGTECH</span>
                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">AUDITORIA SISBOV</span>
                </div>
                <h1 className="text-2xl font-black text-slate-950 mt-2">
                  DOSSIÊ ZOOTÉCNICO & FECHAMENTO DE CONFINAMENTO
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Propriedade: <b>Estância Pantaneira & Confinamento</b> • Município: <b>Corumbá - MS (IBGE: 5003207)</b>
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <p>Data de Emissão: <b>30/09/2026</b></p>
                <p>ERAS MAPA: <b>BR-MS-004812</b></p>
                <p>CAR: <b>MS-5003207-A9182049182</b></p>
              </div>
            </div>

            {/* 1. Titulares e Responsabilidade Técnica */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                1. Titulares da Exploração & Registro Sanitário (IAGRO / MAPA)
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Roberto Silveira & Filhos</span>
                  <span className="text-slate-600 block">CPF: 219.408.192-04</span>
                  <span className="text-emerald-700 font-black block mt-1">Quota: 60% (Titular)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Agropecuária Pantanal Ltda</span>
                  <span className="text-slate-600 block">CNPJ: 04.918.204/0001-92</span>
                  <span className="text-emerald-700 font-black block mt-1">Quota: 40% (Parceiro)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Status Sanitário SISBOV</span>
                  <span className="text-slate-600 block">100% Brinco RFID Eletrônico</span>
                  <span className="text-emerald-700 font-black block mt-1">Apto Cota Hilton / China</span>
                </div>
              </div>
            </div>

            {/* 2. Fechamento de Lotes e Ganho Médio Diário */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                2. Balanço Zootécnico por Lote / Piquete de Terminação
              </h3>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 border-b">Lote / Local</th>
                    <th className="p-2 border-b">Cabeças</th>
                    <th className="p-2 border-b">Peso Entrada</th>
                    <th className="p-2 border-b">Peso Atual</th>
                    <th className="p-2 border-b">GMD (kg/dia)</th>
                    <th className="p-2 border-b text-right">@ Produzidas</th>
                    <th className="p-2 border-b text-right">Custo da @ (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-2 font-bold">Lote C-04 • Confinamento</td>
                    <td className="p-2">280 garrotes</td>
                    <td className="p-2">380 kg</td>
                    <td className="p-2">542 kg</td>
                    <td className="p-2 font-bold text-emerald-700">1.54 kg/dia</td>
                    <td className="p-2 text-right font-mono">1.512 @</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 184,20</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Lote C-02 • Confinamento</td>
                    <td className="p-2">250 bois Nelore</td>
                    <td className="p-2">395 kg</td>
                    <td className="p-2">548 kg</td>
                    <td className="p-2 font-bold text-emerald-700">1.58 kg/dia</td>
                    <td className="p-2 text-right font-mono">1.275 @</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 182,50</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Piquete 08 • Pasto Mombaça</td>
                    <td className="p-2">320 novilhas</td>
                    <td className="p-2">270 kg</td>
                    <td className="p-2">365 kg</td>
                    <td className="p-2 font-bold text-emerald-700">0.82 kg/dia</td>
                    <td className="p-2 text-right font-mono">1.013 @</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 145,00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Lote 01 • Vacas Lactação</td>
                    <td className="p-2">80 vacas</td>
                    <td className="p-2" colSpan={3}>Média 28.5 L/vaca/dia • CCS 240.000 CS/mL</td>
                    <td className="p-2 text-right font-mono">68.400 L/mês</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 1,92 / L</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold text-slate-950">
                  <tr>
                    <td className="p-2">TOTAL REBANHO</td>
                    <td className="p-2">930 animais</td>
                    <td className="p-2" colSpan={3}>Confinamento Intensivo + Rotacionado ILPF</td>
                    <td className="p-2 text-right font-mono text-emerald-700">3.800 @ (+ Leite)</td>
                    <td className="p-2 text-right font-mono text-emerald-700">R$ 178,40 / @ Méd.</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 3. Composição de Custo da Arroba (@) */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                3. Composição de Custos Operacionais da Arroba Produzida
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Nutrição (Silagem, Milho Moído, Minerais)</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">68,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 121,31 / @ produzida</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Sanidade, Vacinas & Brincos RFID</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">14,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 24,98 / @ produzida</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Operacional (Vagão Misturador & Pessoal)</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">18,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 32,11 / @ produzida</span>
                </div>
              </div>
            </div>

            {/* 4. Conformidade Sanitária */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                4. Rastreabilidade & Controle Sanitário Oficial (GTA & IAGRO)
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between items-center p-2 bg-slate-50 border border-slate-200 rounded">
                  <div>
                    <span className="font-bold text-slate-900">GTA Eletrônica #MS-2026-918204</span> • Guia de Trânsito Animal para Frigorífico Exportador
                    <span className="block text-[11px] text-slate-500">Vacinação Aftosa/Brucelose 100% em dia • Período de Carência Medicamentosa: Zero dias</span>
                  </div>
                  <span className="font-bold text-emerald-700">HOMOLOGADA</span>
                </div>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Roberto Silveira</p>
                <p className="text-slate-500">Produtor Titular / Pecuarista</p>
              </div>

              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Dr. Marcos Vinicius Alencar</p>
                <p className="text-slate-500">Médico Veterinário • CRMV-MS 4182</p>
              </div>
            </div>
          </>
        ) : profileId === 'HORTIFRUTI_FLORICULTURA' ? (
          /* ========================================================================= */
          /* DOSSIÊ HORTIFRÚTI & CULTIVO PROTEGIDO                                     */
          /* ========================================================================= */
          <>
            <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-emerald-700">SUPER AGTECH</span>
                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">GLOBALGAP CERTIFICADO</span>
                </div>
                <h1 className="text-2xl font-black text-slate-950 mt-2">
                  CADERNO DE CAMPO HF & RASTREABILIDADE CEAGESP
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Propriedade: <b>Fazenda Vale Verde HF</b> • Município: <b>Cristalina - GO (IBGE: 5206200)</b>
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <p>Data de Emissão: <b>30/09/2026</b></p>
                <p>Certificação: <b>GGN-4052891024</b></p>
                <p>CAR: <b>GO-5206200-E4192049182</b></p>
              </div>
            </div>

            {/* 1. Titulares */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                1. Titulares & Certificação de Boas Práticas Agrícolas (BPA / GlobalGAP)
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Mariana Sampaio & Sócios</span>
                  <span className="text-slate-600 block">CPF: 341.982.108-44</span>
                  <span className="text-emerald-700 font-black block mt-1">Quota: 70% (Gestão Técnica)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Vale Verde Frutas Finas</span>
                  <span className="text-slate-600 block">CNPJ: 18.294.102/0001-33</span>
                  <span className="text-emerald-700 font-black block mt-1">Quota: 30% (Expedição)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Auditoria de Resíduos LMR</span>
                  <span className="text-slate-600 block">100% Conforme Anvisa</span>
                  <span className="text-emerald-700 font-black block mt-1">Carência Zero p/ Colheita</span>
                </div>
              </div>
            </div>

            {/* 2. Rastreabilidade por Estufa */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                2. Rastreabilidade de Estufas, Colheitas e Refratometria de Açúcares (°Bx)
              </h3>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 border-b">Estufa / Módulo</th>
                    <th className="p-2 border-b">Cultura / Híbrido</th>
                    <th className="p-2 border-b">Caixas Colhidas</th>
                    <th className="p-2 border-b">Grau Brix (°Bx)</th>
                    <th className="p-2 border-b">Classificação</th>
                    <th className="p-2 border-b text-right">Preço Médio (cx)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-2 font-bold">Estufa 02 • Tomate</td>
                    <td className="p-2">Grape Sweet Heaven</td>
                    <td className="p-2">4.500 cx (20kg)</td>
                    <td className="p-2 font-black text-amber-600">9.8°Bx</td>
                    <td className="p-2 font-bold text-emerald-700">Classe Extra Gourmet</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 68,00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Estufa 01 • Tomate</td>
                    <td className="p-2">Italiano Saladete</td>
                    <td className="p-2">8.200 cx (22kg)</td>
                    <td className="p-2 font-black text-amber-600">6.2°Bx</td>
                    <td className="p-2 font-bold text-emerald-700">Comercial Especial</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 52,00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Estufa 03 • Morango</td>
                    <td className="p-2">San Andreas (Semi-hidropônico)</td>
                    <td className="p-2">3.800 cx (4kg)</td>
                    <td className="p-2 font-black text-amber-600">11.2°Bx</td>
                    <td className="p-2 font-bold text-emerald-700">Fruta Nobre Premium</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 48,00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Estufa 04 • Hidroponia</td>
                    <td className="p-2">Alface Americana NFT</td>
                    <td className="p-2">68.000 pés</td>
                    <td className="p-2 font-black text-slate-700">Ciclo 28 dias</td>
                    <td className="p-2 font-bold text-emerald-700">Padrão Supermercado</td>
                    <td className="p-2 text-right font-mono font-bold">R$ 2,40 / pé</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Custo por Caixa */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                3. Estrutura de Custos do Hortifrúti Especializado
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Fertirrigação & Solução Nutritiva</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">42,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 18,20 / caixa média</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Embalagens & Packing House</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">31,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 13,40 / caixa média</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Mão de Obra de Colheita Seletiva</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">27,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 11,70 / caixa média</span>
                </div>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Mariana Sampaio</p>
                <p className="text-slate-500">Produtora Titular • Vale Verde HF</p>
              </div>

              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Dr. Lucas Peixoto</p>
                <p className="text-slate-500">Engenheiro Agrônomo • CREA-GO 28190-D</p>
              </div>
            </div>
          </>
        ) : profileId === 'BIOENERGIA_SUCROALCOOLEIRO' ? (
          /* ========================================================================= */
          /* DOSSIÊ CANA-DE-AÇÚCAR & RENOVABIO                                         */
          /* ========================================================================= */
          <>
            <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-emerald-700">SUPER AGTECH</span>
                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">RENOVABIO AUDITADO</span>
                </div>
                <h1 className="text-2xl font-black text-slate-950 mt-2">
                  RELATÓRIO CONSOLIDADO DE MOAGEM, ATR & CBIOs
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Unidade Industrial: <b>Usina Santa Cruz</b> • Município: <b>Ribeirão Preto - SP (IBGE: 3543402)</b>
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <p>Data de Emissão: <b>30/09/2026</b></p>
                <p>Certificação ANP: <b>ANP-BIO-2026-9812</b></p>
                <p>CAR: <b>SP-3543402-B8192049182</b></p>
              </div>
            </div>

            {/* 1. Titulares */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                1. Parque Industrial & Elegibilidade Ambiental RenovaBio
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Usina Santa Cruz Bioenergia</span>
                  <span className="text-slate-600 block">CNPJ: 54.918.204/0001-88</span>
                  <span className="text-emerald-700 font-black block mt-1">Capacidade: 2,5M ton/safra</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Elegibilidade CAR / Desmatamento</span>
                  <span className="text-slate-600 block">94.8% Elegível para CBIO</span>
                  <span className="text-emerald-700 font-black block mt-1">Marco 2018 100% Conforme</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block">Nota de Eficiência Energética</span>
                  <span className="text-slate-600 block">NEEA: 61.2 g CO2eq/MJ</span>
                  <span className="text-emerald-700 font-black block mt-1">Emissão CBIO Aprovada</span>
                </div>
              </div>
            </div>

            {/* 2. Balanço de Frentes de Corte */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                2. Balanço Operacional de Colheita, Moagem e Rendimento Consecana
              </h3>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 border-b">Bloco Canavial</th>
                    <th className="p-2 border-b">Variedade</th>
                    <th className="p-2 border-b">Área (ha)</th>
                    <th className="p-2 border-b">Cana Moída (t)</th>
                    <th className="p-2 border-b">ATR Médio (kg/t)</th>
                    <th className="p-2 border-b text-right">Extração RTC (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-2 font-bold">Bloco Norte • Frente 01</td>
                    <td className="p-2">RB867515</td>
                    <td className="p-2">3.200 ha</td>
                    <td className="p-2 font-mono">288.000 ton</td>
                    <td className="p-2 font-bold text-emerald-700">142.5 kg/t</td>
                    <td className="p-2 text-right font-mono font-bold">97.4%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Bloco Sul • Frente 02</td>
                    <td className="p-2">CTC4</td>
                    <td className="p-2">2.800 ha</td>
                    <td className="p-2 font-mono">246.400 ton</td>
                    <td className="p-2 font-bold text-emerald-700">138.2 kg/t</td>
                    <td className="p-2 text-right font-mono font-bold">97.2%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Bloco Leste • Frente 03</td>
                    <td className="p-2">IAC91-1099</td>
                    <td className="p-2">2.500 ha</td>
                    <td className="p-2 font-mono">212.500 ton</td>
                    <td className="p-2 font-bold text-emerald-700">136.9 kg/t</td>
                    <td className="p-2 text-right font-mono font-bold">96.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Custo CTT */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                3. Composição de Custos Agrícolas e Industriais (R$/ton)
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Corte, Transbordo e Transporte (CTT)</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">48,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 56,20 / ton cana</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Tratos & Vinhaça Localizada</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">28,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 32,70 / ton cana</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Extração Industrial Moenda / Vapor</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">24,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 28,10 / ton cana</span>
                </div>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Eng. Henrique Botelho</p>
                <p className="text-slate-500">Diretor Agroindustrial • Usina Santa Cruz</p>
              </div>

              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Dra. Fernanda Guimarães</p>
                <p className="text-slate-500">Engenheira Química • CRQ-IV 04819-B</p>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* CADERNO DE CAMPO PADRÃO (GRÃOS & COMMODITIES)                             */
          /* ========================================================================= */
          <>
            {/* Cabeçalho do Relatório */}
            <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-emerald-700">SUPER AGTECH</span>
                  <span className="text-xs bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">AUDITADO</span>
                </div>
                <h1 className="text-2xl font-black text-slate-950 mt-2">
                  CADERNO DE CAMPO & FECHAMENTO DA SAFRA 2025/2026
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Propriedade: <b>Fazenda Santa Helena</b> • Município: <b>Sorriso - MT (IBGE: 5107909)</b>
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-0.5">
                <p>Data de Emissão: <b>25/09/2026</b></p>
                <p>CAR: <b>MT-5107909-E8192841029</b></p>
                <p>CCIR: <b>951.048.102.491-0</b></p>
              </div>
            </div>

            {/* 1. Estrutura Societária e Titulares (Condomínio Rural) */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                1. Titulares da Exploração (Condomínio Rural Familiar)
              </h3>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {CONDOMINOS_FAZENDA.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block">{c.nome}</span>
                    <span className="text-slate-600 block">CPF: {c.cpf}</span>
                    <span className="text-emerald-700 font-black block mt-1">Quota: {c.percentual}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Resumo Agronômico por Talhão */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                2. Mapeamento Agronômico e Status da Lavoura (PostGIS)
              </h3>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 border-b">Talhão</th>
                    <th className="p-2 border-b">Área (ha)</th>
                    <th className="p-2 border-b">Cultura / Híbrido</th>
                    <th className="p-2 border-b">Data Plantio</th>
                    <th className="p-2 border-b text-right">Custo ABC (R$)</th>
                    <th className="p-2 border-b text-right">Break-Even (sc/ha)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {TALHOES_INICIAIS.map((t) => (
                    <tr key={t.id}>
                      <td className="p-2 font-bold">{t.codigo} - {t.nome}</td>
                      <td className="p-2">{t.areaHa} ha</td>
                      <td className="p-2">{t.cultura}</td>
                      <td className="p-2">{t.dataPlantio}</td>
                      <td className="p-2 text-right font-mono">
                        R$ {t.custoTotalABC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-950">
                        {t.breakEvenScHa.toFixed(1)} sc/ha
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold text-slate-950">
                  <tr>
                    <td className="p-2">TOTAL</td>
                    <td className="p-2">{totalAreaHa} ha</td>
                    <td className="p-2" colSpan={2}>Soja e Milho Safrinha</td>
                    <td className="p-2 text-right font-mono text-emerald-700">
                      R$ {totalCustoABC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 text-right font-mono text-emerald-700">
                      {(totalCustoABC / totalAreaHa / 132).toFixed(1)} sc/ha
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 3. Síntese do Custeio ABC */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                3. Metodologia de Custeio Baseado em Atividades (ABC)
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Insumos (Calda, Sementes, Adubo)</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">66,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 1.048,00 / ha</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Máquinas & Diesel S10</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">23,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 365,20 / ha</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block">Mão de Obra Operacional</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">11,0%</p>
                  <span className="text-slate-600 text-[11px]">R$ 174,70 / ha</span>
                </div>
              </div>
            </div>

            {/* 4. Rastreabilidade Fitossanitária e ARTs */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                4. Conformidade Fitossanitária (CREA-MT & Logística Reversa inpEV)
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                {RECEITUARIOS_INICIAIS.map((r) => (
                  <div key={r.id} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-200 rounded">
                    <div>
                      <span className="font-bold text-slate-900">{r.numeroReceita}</span> • {r.produtoComercial} (Dose: {r.doseRecomendada})
                      <span className="block text-[11px] text-slate-500">ART: {r.numeroArt} • Resp. Técnico: {r.agronomoResponsavel} ({r.creaNumero})</span>
                    </div>
                    <span className="font-bold text-emerald-700">{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assinaturas Técnicas */}
            <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Carlos Eduardo Silva</p>
                <p className="text-slate-500">Produtor Titular / Condomínio Rural</p>
              </div>

              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-950">Dra. Camila Nogueira de Barros</p>
                <p className="text-slate-500">Engenheira Agrônoma • CREA-MT 18492-D</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
