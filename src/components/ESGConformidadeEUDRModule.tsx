import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Globe,
  Trees,
  CheckCircle2,
  FileCheck,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Award,
  Layers,
  Leaf,
  FileText,
  Printer
} from 'lucide-react';
import { TALHOES_INICIAIS, TalhaoData } from '../data/mockAgroData';

export interface TalhaoESGStatus {
  talhaoId: string;
  codigo: string;
  nome: string;
  areaHa: number;
  cultura: string;
  carNumero: string;
  desmatamentoProdesPos2020: boolean;
  dataAberturaArea: string; // Ex: '2014-08-20' (anterior a 31/12/2020)
  sobreposicaoTerraIndigena: boolean;
  sobreposicaoUnidadeConservacao: boolean;
  embargoIbamaAtivo: boolean;
  reservaLegalPreservadaPct: number;
  pegadaCarbonoKgCO2eSc: number; // Ex: 14.2 kg CO2e / sc de soja (muito abaixo da média mundial de 28 kg)
  statusEUDR: 'APTO_EXPORTACAO_UE' | 'BLOQUEIO_SOCIOAMBIENTAL';
  ddsNumero: string; // Due Diligence Statement ID
}

const TALHOES_ESG_MOCK: TalhaoESGStatus[] = [
  {
    talhaoId: 'talhao-01',
    codigo: 'TAL-01',
    nome: 'Talhão Sede Norte',
    areaHa: 420.5,
    cultura: 'Soja M5947 IPRO',
    carNumero: 'MT-5107909-E8192841029',
    desmatamentoProdesPos2020: false,
    dataAberturaArea: '2012-05-14',
    sobreposicaoTerraIndigena: false,
    sobreposicaoUnidadeConservacao: false,
    embargoIbamaAtivo: false,
    reservaLegalPreservadaPct: 22.4,
    pegadaCarbonoKgCO2eSc: 12.8,
    statusEUDR: 'APTO_EXPORTACAO_UE',
    ddsNumero: 'DDS-EUDR-2026-BR-MT-04128',
  },
  {
    talhaoId: 'talhao-02',
    codigo: 'TAL-02',
    nome: 'Talhão Represa Leste',
    areaHa: 380.0,
    cultura: 'Soja BMX Desafio',
    carNumero: 'MT-5107909-E8192841029',
    desmatamentoProdesPos2020: false,
    dataAberturaArea: '2016-11-03',
    sobreposicaoTerraIndigena: false,
    sobreposicaoUnidadeConservacao: false,
    embargoIbamaAtivo: false,
    reservaLegalPreservadaPct: 21.8,
    pegadaCarbonoKgCO2eSc: 13.5,
    statusEUDR: 'APTO_EXPORTACAO_UE',
    ddsNumero: 'DDS-EUDR-2026-BR-MT-04129',
  },
  {
    talhaoId: 'talhao-03',
    codigo: 'TAL-03',
    nome: 'Talhão Pivô Central 01',
    areaHa: 510.0,
    cultura: 'Soja TMG 2381',
    carNumero: 'MT-5107909-E8192841029',
    desmatamentoProdesPos2020: false,
    dataAberturaArea: '2010-09-28',
    sobreposicaoTerraIndigena: false,
    sobreposicaoUnidadeConservacao: false,
    embargoIbamaAtivo: false,
    reservaLegalPreservadaPct: 25.0,
    pegadaCarbonoKgCO2eSc: 11.2,
    statusEUDR: 'APTO_EXPORTACAO_UE',
    ddsNumero: 'DDS-EUDR-2026-BR-MT-04130',
  },
  {
    talhaoId: 'talhao-04',
    codigo: 'TAL-04',
    nome: 'Talhão Platô Sul',
    areaHa: 450.0,
    cultura: 'Soja M5947 IPRO',
    carNumero: 'MT-5107909-E8192841029',
    desmatamentoProdesPos2020: false,
    dataAberturaArea: '2018-03-22',
    sobreposicaoTerraIndigena: false,
    sobreposicaoUnidadeConservacao: false,
    embargoIbamaAtivo: false,
    reservaLegalPreservadaPct: 20.5,
    pegadaCarbonoKgCO2eSc: 14.1,
    statusEUDR: 'APTO_EXPORTACAO_UE',
    ddsNumero: 'DDS-EUDR-2026-BR-MT-04131',
  },
  {
    talhaoId: 'talhao-05',
    codigo: 'TAL-05',
    nome: 'Talhão Córrego Fundo',
    areaHa: 360.0,
    cultura: 'Milho KWS 9010 VIP3',
    carNumero: 'MT-5107909-E8192841029',
    desmatamentoProdesPos2020: false,
    dataAberturaArea: '2015-07-19',
    sobreposicaoTerraIndigena: false,
    sobreposicaoUnidadeConservacao: false,
    embargoIbamaAtivo: false,
    reservaLegalPreservadaPct: 23.1,
    pegadaCarbonoKgCO2eSc: 15.0,
    statusEUDR: 'APTO_EXPORTACAO_UE',
    ddsNumero: 'DDS-EUDR-2026-BR-MT-04132',
  },
];

export const ESGConformidadeEUDRModule: React.FC = () => {
  const [talhoesESG] = useState<TalhaoESGStatus[]>(TALHOES_ESG_MOCK);
  const [talhaoSelecionado, setTalhaoSelecionado] = useState<TalhaoESGStatus>(TALHOES_ESG_MOCK[0]);
  const [mostrarModalDDS, setMostrarModalDDS] = useState<boolean>(false);

  const totalAreaAuditada = talhoesESG.reduce((acc, curr) => acc + curr.areaHa, 0);
  const aptosUE = talhoesESG.filter((t) => t.statusEUDR === 'APTO_EXPORTACAO_UE').length;
  const pegadaMedia =
    talhoesESG.reduce((acc, curr) => acc + curr.pegadaCarbonoKgCO2eSc, 0) / talhoesESG.length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">ESG & Conformidade Regulatória EUDR</h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Marco 31/12/2020 PRODES
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Due Diligence Statement
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Validação automática contra desmatamento ilegal (EUDR), sobreposição com Terras Indígenas/UCs e emissão de Passaporte Verde da Carga.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModalDDS(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/20 cursor-pointer"
        >
          <FileCheck className="w-4 h-4" />
          Gerar Due Diligence EUDR (DDS)
        </button>
      </div>

      {/* Cards de Métricas ESG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Área Conforme EUDR</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            {totalAreaAuditada.toFixed(1)} ha (100%)
          </div>
          <p className="text-xs text-slate-500 mt-1">Livre de desmate após 31/12/2020</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Embargos IBAMA / ICMBio</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">0 Embargos</div>
          <p className="text-xs text-emerald-400/80 mt-1">Conformidade total no SICAR</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Terras Indígenas / UCs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">0 Sobreposições</div>
          <p className="text-xs text-slate-500 mt-1">Raio de amortecimento &gt; 10 km</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Pegada de Carbono Média</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {pegadaMedia.toFixed(1)} kg CO₂e/sc
          </div>
          <p className="text-xs text-slate-500 mt-1">50% menor que o benchmark global</p>
        </div>
      </div>

      {/* Grid de Auditoria Talhão a Talhão */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Auditoria Socioambiental Individual por Talhão
            </h2>
            <p className="text-xs text-slate-400">
              Verificação via satélite PRODES/INPE, MapBiomas e bases oficiais da FUNAI e IBAMA
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Talhão & CAR</th>
                <th className="px-4 py-3.5">Área & Cultura</th>
                <th className="px-4 py-3.5">Abertura Histórica</th>
                <th className="px-4 py-3.5">PRODES Pós-2020</th>
                <th className="px-4 py-3.5">TI / UC / Embargos</th>
                <th className="px-4 py-3.5">Pegada Carbono</th>
                <th className="px-4 py-3.5">Status EUDR</th>
                <th className="px-4 py-3.5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {talhoesESG.map((t) => (
                <tr key={t.talhaoId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-200">{t.codigo} - {t.nome}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{t.carNumero}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-200 font-mono">{t.areaHa} ha</div>
                    <div className="text-[11px] text-emerald-400">{t.cultura}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-mono text-slate-200">{t.dataAberturaArea}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Anterior ao Marco 2020</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Zero Desmate
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-slate-300 font-medium">100% Desimpedido</span>
                    <div className="text-[10px] text-slate-500">Sem sobreposição FUNAI/IBAMA</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-emerald-400">
                      {t.pegadaCarbonoKgCO2eSc} kg CO₂e/sc
                    </div>
                    <div className="text-[10px] text-slate-500">Plantio Direto + Biológicos</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-fit">
                      <Globe className="w-3 h-3" /> Apto UE (EUDR Compliant)
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => {
                        setTalhaoSelecionado(t);
                        setMostrarModalDDS(true);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-400" /> Passaporte
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal do Passaporte Verde & Due Diligence Statement (DDS) EUDR */}
      {mostrarModalDDS && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">
                  EUDR Due Diligence Statement (DDS) & Passaporte Verde
                </h3>
              </div>
              <button
                onClick={() => setMostrarModalDDS(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Certificação Socioambiental Conforme Regulamento EU 2023/1115
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Declaração de Diligência Prévia nº {talhaoSelecionado.ddsNumero}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Este lote de {talhaoSelecionado.cultura} produzido no {talhaoSelecionado.codigo} cumpre integralmente os requisitos de ausência de desmatamento e legalidade fundiária.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[8px] font-mono text-slate-600 mt-1 font-bold">SCAN PASSAPORTE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Propriedade & CAR:</span>
                  <span className="text-slate-200 font-medium">Fazenda Santa Helena</span>
                  <span className="text-[10px] text-slate-500 block font-mono">{talhaoSelecionado.carNumero}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Marco Temporal (Corte EUDR):</span>
                  <span className="text-emerald-400 font-bold">31 de Dezembro de 2020</span>
                  <span className="text-[10px] text-slate-500 block">Área consolidada em {talhaoSelecionado.dataAberturaArea}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Emissão de Carbono:</span>
                  <span className="text-emerald-300 font-mono font-bold">{talhaoSelecionado.pegadaCarbonoKgCO2eSc} kg CO₂e / sc</span>
                  <span className="text-[10px] text-slate-500 block">Metodologia GHG Protocol Agro</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status de Exportação:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Liberado para Portos da UE
                  </span>
                  <span className="text-[10px] text-slate-500 block">Roterdã, Hamburgo, Antuérpia</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                Os metadados vetoriais do talhão foram validados via API do Sistema Nacional de Cadastro Ambiental Rural (SICAR) e Instituto Nacional de Pesquisas Espaciais (INPE/PRODES).
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setMostrarModalDDS(false)}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Imprimir Certificado DDS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ESGConformidadeEUDRModule;
