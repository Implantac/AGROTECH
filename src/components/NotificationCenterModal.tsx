import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Flame,
  CloudRain,
  Fuel,
  TrendingUp,
  Check,
  Trash2,
  Activity,
  Sparkles,
  Scale
} from 'lucide-react';

export interface OperationalAlert {
  id: string;
  tipo: 'CRITICO' | 'ALERTA' | 'INFORMATIVO' | 'MERCADO';
  titulo: string;
  descricao: string;
  timestamp: string;
  moduloAlvoId: string;
  lido: boolean;
}

interface NotificationCenterModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectModule?: (moduleId: string) => void;
  profileId?: string;
}

const ALERTAS_GRAOS: OperationalAlert[] = [
  {
    id: 'ALT-01',
    tipo: 'CRITICO',
    titulo: 'Silo 03: Ponto de Orvalho & Risco de Condensação',
    descricao: 'Ponto de orvalho externo atingiu 14.8°C aproximando-se da temperatura de teto. Aeração automática bloqueada para evitar gotejamento na massa de grãos.',
    timestamp: 'Há 8 minutos',
    moduloAlvoId: 'ARMAZENAGEM_TERMOMETRIA_ORVALHO',
    lido: false,
  },
  {
    id: 'ALT-02',
    tipo: 'ALERTA',
    titulo: 'Logística Reversa inpEV: Prazo Legal de Devolução (27 dias)',
    descricao: 'Lote de 38 galões de fungicidas tríplice lavados aguardando agendamento no posto de recolhimento de Primavera do Leste para evitar infração INDEA.',
    timestamp: 'Há 25 minutos',
    moduloAlvoId: 'INPEV_LOGISTICA_REVERSA',
    lido: false,
  },
  {
    id: 'ALT-03',
    tipo: 'ALERTA',
    titulo: 'CAN Bus Telemetria: Revisão de 3.500h Trator John Deere 8R',
    descricao: 'Horímetro atingiu 3.410,8h (89,2h restantes). Kit de filtros de óleo hidráulico e graxa de lítio reservados na oficina central.',
    timestamp: 'Há 1 hora',
    moduloAlvoId: 'MANUTENCAO_OFICINA',
    lido: false,
  },
  {
    id: 'ALT-04',
    tipo: 'MERCADO',
    titulo: 'CBOT Chicago: Soja Futura em Alta (+1.8%)',
    descricao: 'Contrato Maio/2026 bateu US$ 10,42/bushel com relatório USDA apontando estoques menores nos EUA. Excelente momento para travas de Barter.',
    timestamp: 'Há 2 horas',
    moduloAlvoId: 'BARTER_MULTI_COMMODITY_CPR',
    lido: true,
  },
  {
    id: 'ALT-05',
    tipo: 'INFORMATIVO',
    titulo: 'SEFAZ Nacional: NF-e do Produtor Autorizada (Mod 55)',
    descricao: 'Chave de acesso 5126... autorizada com sucesso com SHA-256 e dígito verificador Módulo 11 para carga de 600 sacas de soja.',
    timestamp: 'Há 3 horas',
    moduloAlvoId: 'FISCAL',
    lido: true,
  },
];

const ALERTAS_PECUARIA: OperationalAlert[] = [
  {
    id: 'ALT-PEC-01',
    tipo: 'CRITICO',
    titulo: 'Confinamento Piquete C-04: Leitura de Cocho Zerada (Nota 0)',
    descricao: 'Leitura das 06:30 detectou cocho completamente lambido e fundo seco. Fome excessiva e risco iminente de acidose ruminal subclínica (+1.1 kg MS/cab/dia recomendado).',
    timestamp: 'Há 10 minutos',
    moduloAlvoId: 'CONFINAMENTO_BOVINO',
    lido: false,
  },
  {
    id: 'ALT-PEC-02',
    tipo: 'ALERTA',
    titulo: 'Qualidade do Leite: Tanque Resfriador 02 com CCS em 340.000 CS/mL',
    descricao: 'Contagem de células somáticas acima do limite contratual do laticínio. Teste CMT isolou 4 vacas em lactação para protocolo de barreira iodada.',
    timestamp: 'Há 35 minutos',
    moduloAlvoId: 'BOVINOCULTURA_LEITE',
    lido: false,
  },
  {
    id: 'ALT-PEC-03',
    tipo: 'ALERTA',
    titulo: 'Rastreabilidade SISBOV: Lote 12 Apto para Cota Hilton',
    descricao: '180 novilhos Nelore cumpriram o período obrigatório de 90 dias em estabelecimento rural aprovado (ERAS) com 100% dos brincos RFID auditados.',
    timestamp: 'Há 1 hora',
    moduloAlvoId: 'BOVINOCULTURA_SISBOV_RFID',
    lido: false,
  },
  {
    id: 'ALT-PEC-04',
    tipo: 'MERCADO',
    titulo: 'Boi Gordo B3: Arroba Cotada a R$ 242,00 (+1.2%)',
    descricao: 'Relação de troca milho/boi gordo atingiu 2.2 sc/@ (altamente favorável para travas de insumos da engorda no cocho).',
    timestamp: 'Há 2 horas',
    moduloAlvoId: 'ZOOTECNIA',
    lido: true,
  },
  {
    id: 'ALT-PEC-05',
    tipo: 'INFORMATIVO',
    titulo: 'IAGRO / SEFAZ: Guia de Trânsito Animal (GTA) Autorizada',
    descricao: 'GTA eletrônica autorizada para transporte de 18 cabeças com destino a frigorífico habilitado para exportação.',
    timestamp: 'Há 3 horas',
    moduloAlvoId: 'FISCAL',
    lido: true,
  },
];

const ALERTAS_HORTIFRUTI: OperationalAlert[] = [
  {
    id: 'ALT-HF-01',
    tipo: 'CRITICO',
    titulo: 'Estufa 01: Condutividade Elétrica (CE) em 2.6 mS/cm no Gotejamento',
    descricao: 'Acúmulo salino no substrato de fibra de coco por evapotranspiração do meio-dia. Aplicar pulso rápido de água desmineralizada com 20% de drenagem.',
    timestamp: 'Há 12 minutos',
    moduloAlvoId: 'FERTIRRIGACAO_INJECAO_MULTICANAL',
    lido: false,
  },
  {
    id: 'ALT-HF-02',
    tipo: 'ALERTA',
    titulo: 'Estufa 02: Ponto de Colheita Grape (Refratômetro 9.8°Bx)',
    descricao: 'Açúcares totais no ápice de maturidade gourmet. Concluir a colheita seletiva matinal antes das 10h para preservar a firmeza dos frutos.',
    timestamp: 'Há 30 minutos',
    moduloAlvoId: 'OLERICULTURA_HF',
    lido: false,
  },
  {
    id: 'ALT-HF-03',
    tipo: 'ALERTA',
    titulo: 'MIP Biológico: Ácaro-Rajado na Estufa 03 (Morango)',
    descricao: 'Atingido nível de controle (1.4 ninfas/folíolo). Como restam 5 dias para o corte, liberar ácaros predadores Neoseiulus californicus.',
    timestamp: 'Há 1 hora',
    moduloAlvoId: 'MIP',
    lido: false,
  },
  {
    id: 'ALT-HF-04',
    tipo: 'MERCADO',
    titulo: 'CEAGESP: Alta de 42% na Caixa de Folhosas Hidropônicas',
    descricao: 'Redução de oferta pós-chuva na serra valorizou alface americana para R$ 38,00/caixa. Oportunidade para entrega direta de 18.000 pés.',
    timestamp: 'Há 2 horas',
    moduloAlvoId: 'CULTIVO_PROTEGIDO_HIDROPONIA',
    lido: true,
  },
  {
    id: 'ALT-HF-05',
    tipo: 'INFORMATIVO',
    titulo: 'GlobalGAP: Laudo Microbiológico de Água e LMR Conforme',
    descricao: 'Certificado de análise laboratorial aprovado com ausência total de contaminantes e resíduos dentro dos limites legais.',
    timestamp: 'Há 3 horas',
    moduloAlvoId: 'RECEITUARIO',
    lido: true,
  },
];

const ALERTAS_BIOENERGIA: OperationalAlert[] = [
  {
    id: 'ALT-BIO-01',
    tipo: 'CRITICO',
    titulo: 'Bloco Norte: Pico de ATR em 142.5 kg/ton (Chuva em 72h)',
    descricao: 'Previsão meteorológica indica 45mm de precipitação. Concentrar colhedoras no Bloco Norte para evitar perda de açúcares por diluição.',
    timestamp: 'Há 15 minutos',
    moduloAlvoId: 'CANA_DE_ACUCAR_ATR',
    lido: false,
  },
  {
    id: 'ALT-BIO-02',
    tipo: 'ALERTA',
    titulo: 'Moenda #02: Desfibrador com Open Cell em 83.2%',
    descricao: 'Queda de extração RTC para 96.6% e umidade do bagaço em 52.4%. Agendada virada de martelos para a parada de limpeza das 06:00.',
    timestamp: 'Há 45 minutos',
    moduloAlvoId: 'MOENDA_DIFUSOR_CANA_EXTRACAO',
    lido: false,
  },
  {
    id: 'ALT-BIO-03',
    tipo: 'MERCADO',
    titulo: 'RenovaBio B3: Cotação de CBIOs Firme a R$ 94,50',
    descricao: '12.800 CBIOs gerados com biomassa 94.8% elegível estão prontos para escrituração e liquidação no leilão quinzenal.',
    timestamp: 'Há 2 horas',
    moduloAlvoId: 'RENOVABIO_CALCULADORA_CBIO',
    lido: true,
  },
  {
    id: 'ALT-BIO-04',
    tipo: 'INFORMATIVO',
    titulo: 'SEFAZ / ANP: Autorização de Transporte de Etanol Anidro',
    descricao: 'MDF-e e CT-e autorizados para comboio de 3 bitrens tanque com 135.000 L de biocombustível.',
    timestamp: 'Há 3 horas',
    moduloAlvoId: 'FISCAL',
    lido: true,
  },
];

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onSelectModule = () => {},
  profileId = 'AGRICULTURA_GRAOS',
}) => {
  const alertasIniciais = useMemo(() => {
    if (profileId === 'PECUARIA_CORTE_LEITE') return ALERTAS_PECUARIA;
    if (profileId === 'HORTIFRUTI_FLORICULTURA') return ALERTAS_HORTIFRUTI;
    if (profileId === 'BIOENERGIA_SUCROALCOOLEIRO') return ALERTAS_BIOENERGIA;
    return ALERTAS_GRAOS;
  }, [profileId]);

  const [alerts, setAlerts] = useState<OperationalAlert[]>(alertasIniciais);

  useEffect(() => {
    setAlerts(alertasIniciais);
  }, [alertasIniciais]);

  if (isOpen === false) return null;

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, lido: true })));
  };

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const unreadCount = alerts.filter((a) => !a.lido).length;

  return (
    <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Cabeçalho da Central */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
              <Bell className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Central de Alertas & Notificações</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    {unreadCount} novos
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Gatilhos operacionais filtrados para: <span className="text-emerald-800 font-semibold">{profileId.replace(/_/g, ' ')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="Marcar todas como lidas"
              >
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Marcar Lidas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Alertas com Scroll */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-100 max-h-[60vh]">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Tudo limpo por aqui!</p>
              <p className="text-xs text-slate-500">Nenhum alerta pendente para a sua fazenda no momento.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              let badgeBg = 'bg-slate-100 text-slate-800 border-slate-300';
              let Icon = Bell;

              if (alert.tipo === 'CRITICO') {
                badgeBg = 'bg-rose-50 text-rose-800 border-rose-300';
                Icon = ShieldAlert;
              } else if (alert.tipo === 'ALERTA') {
                badgeBg = 'bg-amber-50 text-amber-800 border-amber-300';
                Icon = AlertTriangle;
              } else if (alert.tipo === 'MERCADO') {
                badgeBg = 'bg-indigo-50 text-indigo-800 border-indigo-300';
                Icon = TrendingUp;
              } else {
                badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                Icon = CheckCircle2;
              }

              return (
                <div
                  key={alert.id}
                  className={`pt-3 first:pt-0 flex items-start justify-between gap-3 p-3 rounded-xl transition-all ${
                    alert.lido
                      ? 'opacity-60 bg-transparent hover:opacity-100 hover:bg-slate-50'
                      : 'bg-slate-50 border border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl border shrink-0 ${badgeBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                          {alert.tipo}
                        </span>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {alert.timestamp}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#285943] tracking-tight leading-snug">{alert.titulo}</h4>

                      <p className="text-xs text-slate-900 leading-relaxed font-normal">{alert.descricao}</p>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (onSelectModule && alert.moduloAlvoId) {
                              onSelectModule(alert.moduloAlvoId);
                              if (onClose) onClose();
                            }
                          }}
                          className="text-[11px] font-bold text-[#285943] hover:text-[#1D4B38] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          Ver no Módulo <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => clearAlert(alert.id)}
                    className="text-slate-600 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                    title="Dispensar alerta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé da Central */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>{alerts.length} alertas monitorados em tempo real</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
