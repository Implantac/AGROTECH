import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Download,
  Share2,
  TrendingDown,
  Cpu,
  Target,
  FileCode,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { PRESCRICOES_TAXA_VARIAVEL, TALHOES_INICIAIS, PrescricaoTaxaVariavelData } from '../data/mockAgroData';

export const AgriculturaPrecisaoModule: React.FC = () => {
  const [prescricoes, setPrescricoes] = useState<PrescricaoTaxaVariavelData[]>(PRESCRICOES_TAXA_VARIAVEL);
  const [selectedVra, setSelectedVra] = useState<PrescricaoTaxaVariavelData>(prescricoes[0]);

  const economiaTotalEstimada = prescricoes.reduce((acc, curr) => acc + curr.economiaFinanceiraEstimada, 0);

  const handleExportarIsoXml = (prescricao: PrescricaoTaxaVariavelData) => {
    alert(`✓ Arquivo de Prescrição ISO-XML (TaskData.xml) gerado com sucesso!
Talhão: ${prescricao.nomePrescricao}
Formato compatível com monitores John Deere GS4, Trimble FmX e Case IH AFS Pro 700.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Agricultura de Precisão */}
      <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Tecnologia VRA (Variable Rate Application)
            </span>
            <span className="text-xs text-[#66736A]">Amostragem de Solo Georreferenciada em Grid</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Prescrições de Adubação e Calagem em Taxa Variável
          </h2>
          <p className="text-xs text-[#66736A] mt-1">
            Gera mapas de aplicação de adubo e calcário para taxa variável, eliminando desperdício e equilibrando o solo da fazenda.
          </p>
        </div>

        <div className="bg-[#F7F9F5] p-3 rounded-xl border border-[#EAF4E7] text-right">
          <span className="text-[10px] text-[#66736A] uppercase font-semibold">Economia Estimada em Fertilizantes</span>
          <p className="text-xl font-black text-emerald-400">
            R$ {economiaTotalEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Grid das Prescrições Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prescricoes.map((presc) => {
          const talhao = TALHOES_INICIAIS.find((t) => t.id === presc.talhaoId);

          return (
            <div
              key={presc.id}
              className="bg-white border border-[#EAF4E7] rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    {presc.gradeAmostragem}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{presc.nomePrescricao}</h3>
                  <p className="text-xs text-[#66736A]">
                    Talhão: <span className="font-semibold text-[#26332A]">{talhao?.codigo} - {talhao?.nome}</span> ({talhao?.areaHa} ha)
                  </p>
                </div>

                <span className="px-2.5 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded-full text-[10px] font-bold">
                  {presc.statusExportacaoPiloto}
                </span>
              </div>

              {/* Informações da Dosagem Variável */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#F7F9F5] p-2.5 rounded-xl border border-[#EAF4E7]">
                  <span className="text-[10px] text-[#66736A] block font-medium">Dose Mínima</span>
                  <span className="text-sm font-black text-amber-400 font-mono mt-0.5 block">
                    {presc.doseMinimaKgHa}
                  </span>
                  <span className="text-[9px] text-slate-500">kg / ha</span>
                </div>

                <div className="bg-[#F7F9F5] p-2.5 rounded-xl border border-[#EAF4E7]">
                  <span className="text-[10px] text-[#66736A] block font-medium">Dose Média</span>
                  <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">
                    {presc.doseMediaKgHa}
                  </span>
                  <span className="text-[9px] text-slate-500">kg / ha</span>
                </div>

                <div className="bg-[#F7F9F5] p-2.5 rounded-xl border border-[#EAF4E7]">
                  <span className="text-[10px] text-[#66736A] block font-medium">Dose Máxima</span>
                  <span className="text-sm font-black text-blue-400 font-mono mt-0.5 block">
                    {presc.doseMaximaKgHa}
                  </span>
                  <span className="text-[9px] text-slate-500">kg / ha</span>
                </div>
              </div>

              {/* Insumo Recomendado */}
              <div className="bg-[#F7F9F5] p-3 rounded-xl border border-[#EAF4E7] text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#66736A] block">Adubo / Corretivo Recomendado:</span>
                  <span className="font-bold text-[#26332A]">{presc.aduboRecomendado}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#66736A] block">Economia Gerada:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    +R$ {presc.economiaFinanceiraEstimada.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Botões de Ação para o Piloto */}
              <div className="flex gap-2 pt-1 border-t border-[#EAF4E7]">
                <button
                  onClick={() => handleExportarIsoXml(presc)}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  <FileCode className="w-3.5 h-3.5" /> Exportar ISO-XML (Piloto GS4)
                </button>
                <button
                  onClick={() => alert(`Shapefile vetorial (.shp) do grid de fertilidade gerado para o talhão ${talhao?.codigo}.`)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-[#26332A] rounded-xl text-xs font-bold border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explicação da Vantagem Econômica da Taxa Variável */}
      <div className="bg-white border border-[#EAF4E7] p-6 rounded-2xl shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" /> Comparativo: Taxa Fixa Convencional vs Taxa Variável (VRA)
        </h3>
        <p className="text-xs text-[#26332A] leading-relaxed">
          Na aplicação convencional com dose única uniforme, zonas de alta fertilidade natural recebem adubo desnecessário (queixamento de fósforo e lixiviação de potássio), enquanto manchas de solo pobre continuam deficientes, derrubando o potencial produtivo. A agricultura de precisão distribui o fertilizante exatamente onde a planta necessita, gerando até <b>22% de economia direta de insumos</b> e elevando o teto produtivo da safra.
        </p>
      </div>
    </div>
  );
};
