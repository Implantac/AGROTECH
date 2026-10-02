import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Map,
  Smartphone,
  FileSpreadsheet,
  Package,
  Activity,
  Sprout,
  X,
  Tractor,
  FileCheck,
  TrendingUp,
  Sliders,
  Handshake,
  Truck,
  CloudRain,
  FileText,
  Layers,
  Wrench,
  Search,
  Star,
  Grid,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Droplet,
  Sun,
  Coins,
  DollarSign,
  AlertCircle,
  Plus,
  Bell,
  MapPin,
  ChevronDown,
  Wifi,
  Globe,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { PublicLandingPage } from './components/PublicLandingPage';
import { LoginScreen } from './components/LoginScreen';
import { RegisterOnboardingScreen } from './components/RegisterOnboardingScreen';
import { TALHOES_INICIAIS, TalhaoData } from './data/mockAgroData';
import { QuickAccessModal, ALL_MODULES, ModuleItem } from './components/QuickAccessModal';
import { GlobalQuickEntryModal } from './components/GlobalQuickEntryModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { ToastNotification, ToastItem } from './components/ToastNotification';
import { UserRoleBar, UserProfileRole } from './components/UserRoleBar';
import { ModuleConfigModal } from './components/ModuleConfigModal';
import { HeaderFintechBar } from './components/HeaderFintechBar';
import { DossieBancarioCreditoModal } from './components/DossieBancarioCreditoModal';
import { OfflineSyncCockpitModal } from './components/OfflineSyncCockpitModal';
import {
  getSavedSubscriptionConfig,
  saveSubscriptionConfig,
  resolveActiveModuleIds,
  OPERATIONAL_PROFILES,
  SubscriptionConfig,
} from './services/subscriptionService';

// Code-Splitting & Lazy Loading dos 45 Módulos Especializados
const DashboardBI = React.lazy(() => import('./components/DashboardBI').then(m => ({ default: m.DashboardBI })));
const AgroMap = React.lazy(() => import('./components/AgroMap').then(m => ({ default: m.AgroMap })));
const MobileCockpitSimulator = React.lazy(() => import('./components/MobileCockpitSimulator').then(m => ({ default: m.MobileCockpitSimulator })));
const FiscalLCDPRModule = React.lazy(() => import('./components/FiscalLCDPRModule').then(m => ({ default: m.FiscalLCDPRModule })));
const AlmoxarifadoModule = React.lazy(() => import('./components/AlmoxarifadoModule').then(m => ({ default: m.AlmoxarifadoModule })));
const ZootecniaModule = React.lazy(() => import('./components/ZootecniaModule').then(m => ({ default: m.ZootecniaModule })));
const TelemetriaFrotaModule = React.lazy(() => import('./components/TelemetriaFrotaModule').then(m => ({ default: m.TelemetriaFrotaModule })));
const ReceituarioAgronomicoModule = React.lazy(() => import('./components/ReceituarioAgronomicoModule').then(m => ({ default: m.ReceituarioAgronomicoModule })));
const SensibilidadeSafraModule = React.lazy(() => import('./components/SensibilidadeSafraModule').then(m => ({ default: m.SensibilidadeSafraModule })));
const ComercializacaoBarterModule = React.lazy(() => import('./components/ComercializacaoBarterModule').then(m => ({ default: m.ComercializacaoBarterModule })));
const RomaneioColheitaModule = React.lazy(() => import('./components/RomaneioColheitaModule').then(m => ({ default: m.RomaneioColheitaModule })));
const AgrometeorologiaModule = React.lazy(() => import('./components/AgrometeorologiaModule').then(m => ({ default: m.AgrometeorologiaModule })));
const RelatorioSafraModule = React.lazy(() => import('./components/RelatorioSafraModule').then(m => ({ default: m.RelatorioSafraModule })));
const AgriculturaPrecisaoModule = React.lazy(() => import('./components/AgriculturaPrecisaoModule').then(m => ({ default: m.AgriculturaPrecisaoModule })));
const ManutencaoOficinaModule = React.lazy(() => import('./components/ManutencaoOficinaModule').then(m => ({ default: m.ManutencaoOficinaModule })));
const MIPManejoPragasModule = React.lazy(() => import('./components/MIPManejoPragasModule').then(m => ({ default: m.MIPManejoPragasModule })));
const DRECombustivelComboioModule = React.lazy(() => import('./components/DRECombustivelComboioModule').then(m => ({ default: m.DRECombustivelComboioModule })));
const ESGConformidadeEUDRModule = React.lazy(() => import('./components/ESGConformidadeEUDRModule').then(m => ({ default: m.ESGConformidadeEUDRModule })));
const CopilotSafraModule = React.lazy(() => import('./components/CopilotSafraModule').then(m => ({ default: m.CopilotSafraModule })));
const IrrigacaoPivoModule = React.lazy(() => import('./components/IrrigacaoPivoModule').then(m => ({ default: m.IrrigacaoPivoModule })));
const SilosArmazenagemModule = React.lazy(() => import('./components/SilosArmazenagemModule').then(m => ({ default: m.SilosArmazenagemModule })));
const NR31SegurancaTrabalhoModule = React.lazy(() => import('./components/NR31SegurancaTrabalhoModule').then(m => ({ default: m.NR31SegurancaTrabalhoModule })));
const CreditoRuralFinanciamentosModule = React.lazy(() => import('./components/CreditoRuralFinanciamentosModule').then(m => ({ default: m.CreditoRuralFinanciamentosModule })));
const LogisticaFretesModule = React.lazy(() => import('./components/LogisticaFretesModule').then(m => ({ default: m.LogisticaFretesModule })));
const ArrendamentosContratosModule = React.lazy(() => import('./components/ArrendamentosContratosModule').then(m => ({ default: m.ArrendamentosContratosModule })));
const SementesVigorTSIModule = React.lazy(() => import('./components/SementesVigorTSIModule').then(m => ({ default: m.SementesVigorTSIModule })));
const CarbonoAgroModule = React.lazy(() => import('./components/CarbonoAgroModule').then(m => ({ default: m.CarbonoAgroModule })));
const DronePulverizacaoAereaModule = React.lazy(() => import('./components/DronePulverizacaoAereaModule').then(m => ({ default: m.DronePulverizacaoAereaModule })));
const InpevLogisticaReversaModule = React.lazy(() => import('./components/InpevLogisticaReversaModule').then(m => ({ default: m.InpevLogisticaReversaModule })));
const NutricaoFoliarSoloModule = React.lazy(() => import('./components/NutricaoFoliarSoloModule').then(m => ({ default: m.NutricaoFoliarSoloModule })));
const PerdasColheitaModule = React.lazy(() => import('./components/PerdasColheitaModule').then(m => ({ default: m.PerdasColheitaModule })));
const BiofabricaManejoOnFarmModule = React.lazy(() => import('./components/BiofabricaManejoOnFarmModule').then(m => ({ default: m.BiofabricaManejoOnFarmModule })));
const HedgeCambialNDFModule = React.lazy(() => import('./components/HedgeCambialNDFModule').then(m => ({ default: m.HedgeCambialNDFModule })));
const ILPFManejoRotacionadoModule = React.lazy(() => import('./components/ILPFManejoRotacionadoModule').then(m => ({ default: m.ILPFManejoRotacionadoModule })));
const SeguroAgricolaSinistrosModule = React.lazy(() => import('./components/SeguroAgricolaSinistrosModule').then(m => ({ default: m.SeguroAgricolaSinistrosModule })));
const CompostagemCircularModule = React.lazy(() => import('./components/CompostagemCircularModule').then(m => ({ default: m.CompostagemCircularModule })));
const ConfinamentoBovinoModule = React.lazy(() => import('./components/ConfinamentoBovinoModule').then(m => ({ default: m.ConfinamentoBovinoModule })));
const RemineralizadoresRochagemModule = React.lazy(() => import('./components/RemineralizadoresRochagemModule').then(m => ({ default: m.RemineralizadoresRochagemModule })));
const DescontaminacaoPulverizadorModule = React.lazy(() => import('./components/DescontaminacaoPulverizadorModule').then(m => ({ default: m.DescontaminacaoPulverizadorModule })));
const EnergiaSolarIrrigacaoModule = React.lazy(() => import('./components/EnergiaSolarIrrigacaoModule').then(m => ({ default: m.EnergiaSolarIrrigacaoModule })));
const PlantasCoberturaBiomassaModule = React.lazy(() => import('./components/PlantasCoberturaBiomassaModule').then(m => ({ default: m.PlantasCoberturaBiomassaModule })));
const ProdutividadePreditivaModule = React.lazy(() => import('./components/ProdutividadePreditivaModule').then(m => ({ default: m.ProdutividadePreditivaModule })));
const PontasPulverizacaoModule = React.lazy(() => import('./components/PontasPulverizacaoModule').then(m => ({ default: m.PontasPulverizacaoModule })));
const CompactacaoSoloModule = React.lazy(() => import('./components/CompactacaoSoloModule').then(m => ({ default: m.CompactacaoSoloModule })));
const BioanaliseSoloModule = React.lazy(() => import('./components/BioanaliseSoloModule').then(m => ({ default: m.BioanaliseSoloModule })));
const EnsaioVariedadesModule = React.lazy(() => import('./components/EnsaioVariedadesModule').then(m => ({ default: m.EnsaioVariedadesModule })));
const FixacaoBiologicaNitrogenioModule = React.lazy(() => import('./components/FixacaoBiologicaNitrogenioModule').then(m => ({ default: m.FixacaoBiologicaNitrogenioModule })));
const DejetosLiquidosSuinosModule = React.lazy(() => import('./components/DejetosLiquidosSuinosModule').then(m => ({ default: m.DejetosLiquidosSuinosModule })));
const UniformidadePlantioModule = React.lazy(() => import('./components/UniformidadePlantioModule').then(m => ({ default: m.UniformidadePlantioModule })));
const NematoidesManejoModule = React.lazy(() => import('./components/NematoidesManejoModule').then(m => ({ default: m.NematoidesManejoModule })));
const OEEFrotasAgricolasModule = React.lazy(() => import('./components/OEEFrotasAgricolasModule').then(m => ({ default: m.OEEFrotasAgricolasModule })));
const DaninhasResistentesModule = React.lazy(() => import('./components/DaninhasResistentesModule').then(m => ({ default: m.DaninhasResistentesModule })));
const SilagemForragemModule = React.lazy(() => import('./components/SilagemForragemModule').then(m => ({ default: m.SilagemForragemModule })));
const DistribuicaoAduboModule = React.lazy(() => import('./components/DistribuicaoAduboModule').then(m => ({ default: m.DistribuicaoAduboModule })));
const FungicidasManejoModule = React.lazy(() => import('./components/FungicidasManejoModule').then(m => ({ default: m.FungicidasManejoModule })));
const RenovabioCBIOModule = React.lazy(() => import('./components/RenovabioCBIOModule').then(m => ({ default: m.RenovabioCBIOModule })));
const FertirrigacaoPivoModule = React.lazy(() => import('./components/FertirrigacaoPivoModule').then(m => ({ default: m.FertirrigacaoPivoModule })));
const AlgodaoHVIQualidadeModule = React.lazy(() => import('./components/AlgodaoHVIQualidadeModule').then(m => ({ default: m.AlgodaoHVIQualidadeModule })));
const BiodigestorBiometanoModule = React.lazy(() => import('./components/BiodigestorBiometanoModule').then(m => ({ default: m.BiodigestorBiometanoModule })));
const PisciculturaAquiculturaModule = React.lazy(() => import('./components/PisciculturaAquiculturaModule').then(m => ({ default: m.PisciculturaAquiculturaModule })));
const CafeiculturaEspecialModule = React.lazy(() => import('./components/CafeiculturaEspecialModule').then(m => ({ default: m.CafeiculturaEspecialModule })));
const CanadeAcucarATRModule = React.lazy(() => import('./components/CanadeAcucarATRModule').then(m => ({ default: m.CanadeAcucarATRModule })));
const SilviculturaManejoFlorestalModule = React.lazy(() => import('./components/SilviculturaManejoFlorestalModule').then(m => ({ default: m.SilviculturaManejoFlorestalModule })));
const MercadoCarbonoSBCEModule = React.lazy(() => import('./components/MercadoCarbonoSBCEModule').then(m => ({ default: m.MercadoCarbonoSBCEModule })));
const ApiculturaPolinizacaoModule = React.lazy(() => import('./components/ApiculturaPolinizacaoModule').then(m => ({ default: m.ApiculturaPolinizacaoModule })));
const HeveiculturaBorrachaModule = React.lazy(() => import('./components/HeveiculturaBorrachaModule').then(m => ({ default: m.HeveiculturaBorrachaModule })));
const VitiviniculturaPrecisaoModule = React.lazy(() => import('./components/VitiviniculturaPrecisaoModule').then(m => ({ default: m.VitiviniculturaPrecisaoModule })));
const OvinoculturaCaprinosModule = React.lazy(() => import('./components/OvinoculturaCaprinosModule').then(m => ({ default: m.OvinoculturaCaprinosModule })));
const CitriculturaPrecisaoModule = React.lazy(() => import('./components/CitriculturaPrecisaoModule').then(m => ({ default: m.CitriculturaPrecisaoModule })));
const AviculturaClimatizadaModule = React.lazy(() => import('./components/AviculturaClimatizadaModule').then(m => ({ default: m.AviculturaClimatizadaModule })));
const OriziculturaArrozModule = React.lazy(() => import('./components/OriziculturaArrozModule').then(m => ({ default: m.OriziculturaArrozModule })));
const CacauliculturaCabrucaModule = React.lazy(() => import('./components/CacauliculturaCabrucaModule').then(m => ({ default: m.CacauliculturaCabrucaModule })));
const BovinoculturaLeiteModule = React.lazy(() => import('./components/BovinoculturaLeiteModule').then(m => ({ default: m.BovinoculturaLeiteModule })));
const OliviculturaAzeiteModule = React.lazy(() => import('./components/OliviculturaAzeiteModule').then(m => ({ default: m.OliviculturaAzeiteModule })));
const OlericulturaHFModule = React.lazy(() => import('./components/OlericulturaHFModule').then(m => ({ default: m.OlericulturaHFModule })));
const SuinoculturaPrecisaoModule = React.lazy(() => import('./components/SuinoculturaPrecisaoModule').then(m => ({ default: m.SuinoculturaPrecisaoModule })));
const MandioculturaAmidoModule = React.lazy(() => import('./components/MandioculturaAmidoModule').then(m => ({ default: m.MandioculturaAmidoModule })));
const LupuliculturaCervejeiraModule = React.lazy(() => import('./components/LupuliculturaCervejeiraModule').then(m => ({ default: m.LupuliculturaCervejeiraModule })));
const BananiculturaClimatizadaModule = React.lazy(() => import('./components/BananiculturaClimatizadaModule').then(m => ({ default: m.BananiculturaClimatizadaModule })));
const ConfinamentoCordeirosModule = React.lazy(() => import('./components/ConfinamentoCordeirosModule').then(m => ({ default: m.ConfinamentoCordeirosModule })));
const CultivoProtegidoHidroponiaModule = React.lazy(() => import('./components/CultivoProtegidoHidroponiaModule').then(m => ({ default: m.CultivoProtegidoHidroponiaModule })));
const EquinoculturaManejoModule = React.lazy(() => import('./components/EquinoculturaManejoModule').then(m => ({ default: m.EquinoculturaManejoModule })));
const PalmaForrageiraSemiAridoModule = React.lazy(() => import('./components/PalmaForrageiraSemiAridoModule').then(m => ({ default: m.PalmaForrageiraSemiAridoModule })));
const BubalinoculturaQueijoModule = React.lazy(() => import('./components/BubalinoculturaQueijoModule').then(m => ({ default: m.BubalinoculturaQueijoModule })));
const RaniculturaSustentavelModule = React.lazy(() => import('./components/RaniculturaSustentavelModule').then(m => ({ default: m.RaniculturaSustentavelModule })));
const CarciniculturaBioflocosModule = React.lazy(() => import('./components/CarciniculturaBioflocosModule').then(m => ({ default: m.CarciniculturaBioflocosModule })));
const CuniculturaIndustrialModule = React.lazy(() => import('./components/CuniculturaIndustrialModule').then(m => ({ default: m.CuniculturaIndustrialModule })));
const FungiculturaCogumelosModule = React.lazy(() => import('./components/FungiculturaCogumelosModule').then(m => ({ default: m.FungiculturaCogumelosModule })));
const SericiculturaSedaModule = React.lazy(() => import('./components/SericiculturaSedaModule').then(m => ({ default: m.SericiculturaSedaModule })));
const AlgotecnologiaMicroalgasModule = React.lazy(() => import('./components/AlgotecnologiaMicroalgasModule').then(m => ({ default: m.AlgotecnologiaMicroalgasModule })));
const MinhoculturaHumusModule = React.lazy(() => import('./components/MinhoculturaHumusModule').then(m => ({ default: m.MinhoculturaHumusModule })));
const HeliciculturaEscargotModule = React.lazy(() => import('./components/HeliciculturaEscargotModule').then(m => ({ default: m.HeliciculturaEscargotModule })));
const OEMTelematicsGatewayModule = React.lazy(() => import('./components/OEMTelematicsGatewayModule').then(m => ({ default: m.OEMTelematicsGatewayModule })));
const SefazGeoAuditorModule = React.lazy(() => import('./components/SefazGeoAuditorModule').then(m => ({ default: m.SefazGeoAuditorModule })));
const CajuculturaBeneficiamentoModule = React.lazy(() => import('./components/CajuculturaBeneficiamentoModule').then(m => ({ default: m.CajuculturaBeneficiamentoModule })));
const FazendasVerticaisAeroponiaModule = React.lazy(() => import('./components/FazendasVerticaisAeroponiaModule').then(m => ({ default: m.FazendasVerticaisAeroponiaModule })));
const ErvaMateSapecoModule = React.lazy(() => import('./components/ErvaMateSapecoModule').then(m => ({ default: m.ErvaMateSapecoModule })));
const DendeiculturaRspoModule = React.lazy(() => import('./components/DendeiculturaRspoModule').then(m => ({ default: m.DendeiculturaRspoModule })));
const MariculturaOstrasModule = React.lazy(() => import('./components/MariculturaOstrasModule').then(m => ({ default: m.MariculturaOstrasModule })));
const OrquestradorAutonomo40Module = React.lazy(() => import('./components/OrquestradorAutonomo40Module').then(m => ({ default: m.OrquestradorAutonomo40Module })));
const BataticulturaChipsModule = React.lazy(() => import('./components/BataticulturaChipsModule').then(m => ({ default: m.BataticulturaChipsModule })));
const CebolaAlhoCuraModule = React.lazy(() => import('./components/CebolaAlhoCuraModule').then(m => ({ default: m.CebolaAlhoCuraModule })));
const MeliponiculturaAsfModule = React.lazy(() => import('./components/MeliponiculturaAsfModule').then(m => ({ default: m.MeliponiculturaAsfModule })));
const CaprinoculturaQueijosModule = React.lazy(() => import('./components/CaprinoculturaQueijosModule').then(m => ({ default: m.CaprinoculturaQueijosModule })));
const CarbonoAzulMarinhoModule = React.lazy(() => import('./components/CarbonoAzulMarinhoModule').then(m => ({ default: m.CarbonoAzulMarinhoModule })));
const NozPecanPomaresModule = React.lazy(() => import('./components/NozPecanPomaresModule').then(m => ({ default: m.NozPecanPomaresModule })));
const MacadamiaProcessamentoModule = React.lazy(() => import('./components/MacadamiaProcessamentoModule').then(m => ({ default: m.MacadamiaProcessamentoModule })));
const GuaraniculturaAmazoniaModule = React.lazy(() => import('./components/GuaraniculturaAmazoniaModule').then(m => ({ default: m.GuaraniculturaAmazoniaModule })));
const PimentaDoReinoQualidadeModule = React.lazy(() => import('./components/PimentaDoReinoQualidadeModule').then(m => ({ default: m.PimentaDoReinoQualidadeModule })));
const InteligenciaBasisPortuarioModule = React.lazy(() => import('./components/InteligenciaBasisPortuarioModule').then(m => ({ default: m.InteligenciaBasisPortuarioModule })));
const CacauFinoFermentacaoModule = React.lazy(() => import('./components/CacauFinoFermentacaoModule').then(m => ({ default: m.CacauFinoFermentacaoModule })));
const TainhaAquiculturaEstuarinaModule = React.lazy(() => import('./components/TainhaAquiculturaEstuarinaModule').then(m => ({ default: m.TainhaAquiculturaEstuarinaModule })));
const CastanhaBrasilExtrativismoModule = React.lazy(() => import('./components/CastanhaBrasilExtrativismoModule').then(m => ({ default: m.CastanhaBrasilExtrativismoModule })));
const GergelimSegundaSafraModule = React.lazy(() => import('./components/GergelimSegundaSafraModule').then(m => ({ default: m.GergelimSegundaSafraModule })));
const MonitoramentoFilaTerminaisModule = React.lazy(() => import('./components/MonitoramentoFilaTerminaisModule').then(m => ({ default: m.MonitoramentoFilaTerminaisModule })));
const PitaiaculturaPrecisaoModule = React.lazy(() => import('./components/PitaiaculturaPrecisaoModule').then(m => ({ default: m.PitaiaculturaPrecisaoModule })));
const SuinoculturaMaternidadeModule = React.lazy(() => import('./components/SuinoculturaMaternidadeModule').then(m => ({ default: m.SuinoculturaMaternidadeModule })));
const AcaiTerraFirmeModule = React.lazy(() => import('./components/AcaiTerraFirmeModule').then(m => ({ default: m.AcaiTerraFirmeModule })));
const ReguladoresCrescimentoModule = React.lazy(() => import('./components/ReguladoresCrescimentoModule').then(m => ({ default: m.ReguladoresCrescimentoModule })));
const ZoneamentoRiscoZarcModule = React.lazy(() => import('./components/ZoneamentoRiscoZarcModule').then(m => ({ default: m.ZoneamentoRiscoZarcModule })));
const FloriculturaFloresNobresModule = React.lazy(() => import('./components/FloriculturaFloresNobresModule').then(m => ({ default: m.FloriculturaFloresNobresModule })));
const AviculturaPosturaOvosModule = React.lazy(() => import('./components/AviculturaPosturaOvosModule').then(m => ({ default: m.AviculturaPosturaOvosModule })));
const FertilizantesOrganomineraisModule = React.lazy(() => import('./components/FertilizantesOrganomineraisModule').then(m => ({ default: m.FertilizantesOrganomineraisModule })));
const AzeitonasDeMesaProcessamentoModule = React.lazy(() => import('./components/AzeitonasDeMesaProcessamentoModule').then(m => ({ default: m.AzeitonasDeMesaProcessamentoModule })));
const TorreControleLogisticoCocModule = React.lazy(() => import('./components/TorreControleLogisticoCocModule').then(m => ({ default: m.TorreControleLogisticoCocModule })));
const AlgodaoHviClassificacaoModule = React.lazy(() => import('./components/AlgodaoHviClassificacaoModule').then(m => ({ default: m.AlgodaoHviClassificacaoModule })));
const VinhosFinosDuplaPodaModule = React.lazy(() => import('./components/VinhosFinosDuplaPodaModule').then(m => ({ default: m.VinhosFinosDuplaPodaModule })));
const CaprinoculturaQueijosMaturadosModule = React.lazy(() => import('./components/CaprinoculturaQueijosMaturadosModule').then(m => ({ default: m.CaprinoculturaQueijosMaturadosModule })));
const MicorrizasBioinsumosModule = React.lazy(() => import('./components/MicorrizasBioinsumosModule').then(m => ({ default: m.MicorrizasBioinsumosModule })));
const BarterMultiCommodityCprModule = React.lazy(() => import('./components/BarterMultiCommodityCprModule').then(m => ({ default: m.BarterMultiCommodityCprModule })));
const FertirrigacaoInjecaoMulticanalModule = React.lazy(() => import('./components/FertirrigacaoInjecaoMulticanalModule').then(m => ({ default: m.FertirrigacaoInjecaoMulticanalModule })));
const BovinoculturaSisbovRfidModule = React.lazy(() => import('./components/BovinoculturaSisbovRfidModule').then(m => ({ default: m.BovinoculturaSisbovRfidModule })));
const MoendaDifusorCanaExtracaoModule = React.lazy(() => import('./components/MoendaDifusorCanaExtracaoModule').then(m => ({ default: m.MoendaDifusorCanaExtracaoModule })));
const ArmazenagemTermometriaOrvalhoModule = React.lazy(() => import('./components/ArmazenagemTermometriaOrvalhoModule').then(m => ({ default: m.ArmazenagemTermometriaOrvalhoModule })));
const RenovabioCalculadoraCbioModule = React.lazy(() => import('./components/RenovabioCalculadoraCbioModule').then(m => ({ default: m.RenovabioCalculadoraCbioModule })));

// Componente Skeleton/Loading para Suspense
const ModuleFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[350px] bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-4 animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
      <Sprout className="w-6 h-6 text-emerald-400 animate-spin" />
    </div>
    <div className="text-center">
      <h3 className="text-sm font-semibold text-white">Carregando Módulo Especializado...</h3>
      <p className="text-xs text-slate-400 mt-1">Code-splitting sob demanda ativo</p>
    </div>
  </div>
);

// Error Boundary para blindagem contra quebras de renderização
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ModuleErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Falha de renderização do módulo:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 border border-rose-800/60 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Falha Temporária ao Carregar o Módulo</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {this.state.error?.message || 'Ocorreu uma inconsistência no módulo selecionado. O sistema recuperou a interface com segurança.'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer"
          >
            Recarregar Módulo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  // Controle de Visualização Global: Landing Page Institucional | Tela de Login | Cadastro & Onboarding | Cockpit da Plataforma
  const [currentAppView, setCurrentAppView] = useState<'LANDING' | 'LOGIN' | 'REGISTER' | 'PLATFORM'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlView = urlParams.get('view');
        if (urlView === 'platform') return 'PLATFORM';
        if (urlView === 'login') return 'LOGIN';
        if (urlView === 'register' || urlView === 'cadastro') return 'REGISTER';
        if (urlView === 'landing') return 'LANDING';

        const hash = window.location.hash;
        if (hash.includes('cockpit') || hash.includes('platform')) return 'PLATFORM';
        if (hash.includes('login')) return 'LOGIN';
        if (hash.includes('register') || hash.includes('cadastro')) return 'REGISTER';
        if (hash.includes('landing') || hash.includes('planos') || hash.includes('calculadora')) return 'LANDING';

        const saved = sessionStorage.getItem('agtech_current_app_view');
        if (saved === 'LOGIN' || saved === 'PLATFORM' || saved === 'LANDING' || saved === 'REGISTER') {
          return saved as 'LANDING' | 'LOGIN' | 'REGISTER' | 'PLATFORM';
        }
      }
    } catch {
      // fallback
    }
    return 'LANDING';
  });

  const handleNavigateView = (view: 'LANDING' | 'LOGIN' | 'REGISTER' | 'PLATFORM') => {
    setCurrentAppView(view);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('agtech_current_app_view', view);
        localStorage.setItem('agtech_current_app_view', view);
      }
    } catch {
      // ignore
    }
  };

  const [activeTab, setActiveTab] = useState<string>('BI');
  const [selectedTalhao, setSelectedTalhao] = useState<TalhaoData | null>(null);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [selectedFarm, setSelectedFarm] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('agtech_selected_farm');
        if (saved) return saved;
      }
    } catch {
      // fallback
    }
    return 'Fazenda Santa Helena (Sorriso - MT)';
  });
  const [isFarmDropdownOpen, setIsFarmDropdownOpen] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('TODOS');
  const [ribbonFilter, setRibbonFilter] = useState<string>('');

  const farmsList = [
    {
      id: 'F01',
      nome: 'Fazenda Santa Helena',
      local: 'Sorriso - MT',
      area: '4.200 ha',
      safra: 'Safra 2026/27',
      profileId: 'AGRICULTURA_GRAOS',
      profileLabel: 'Grãos & Commodities',
      culturas: ['SOJA', 'MILHO'],
    },
    {
      id: 'F02',
      nome: 'Fazenda Primavera',
      local: 'Primavera do Leste - MT',
      area: '3.150 ha',
      safra: 'Safra 2026/27',
      profileId: 'AGROPECUARIA_MISTA',
      profileLabel: 'Misto / ILPF',
      culturas: ['SOJA', 'MILHO', 'BOVINO_CORTE'],
    },
    {
      id: 'F03',
      nome: 'Estância Pantaneira',
      local: 'Corumbá - MS',
      area: '8.500 ha',
      safra: 'Safra 2026/27',
      profileId: 'PECUARIA_CORTE_LEITE',
      profileLabel: 'Pecuária & Confinamento',
      culturas: ['BOVINO_CORTE', 'BOVINO_LEITE'],
    },
    {
      id: 'F04',
      nome: 'Fazenda Vale Verde HF',
      local: 'Cristalina - GO',
      area: '1.200 ha',
      safra: 'Safra 2026/27',
      profileId: 'HORTIFRUTI_FLORICULTURA',
      profileLabel: 'Hortifrúti & HF',
      culturas: ['HF_HORTIFRUTI'],
    },
    {
      id: 'F05',
      nome: 'Usina Santa Cruz',
      local: 'Ribeirão Preto - SP',
      area: '14.500 ha',
      safra: 'Safra 2026/27',
      profileId: 'BIOENERGIA_SUCROALCOOLEIRO',
      profileLabel: 'Cana & Etanol',
      culturas: ['CANA'],
    },
  ];

  const handleSelectFarm = (f: (typeof farmsList)[0]) => {
    const farmStr = `${f.nome} (${f.local})`;
    setSelectedFarm(farmStr);
    setIsFarmDropdownOpen(false);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('agtech_selected_farm', farmStr);
      }
    } catch {
      // ignore
    }

    if (f.profileId) {
      const newConfig: SubscriptionConfig = {
        profileId: f.profileId,
        customModuleIds: [],
        selectedCultures: f.culturas || [],
        updatedAt: new Date().toISOString(),
      };
      saveSubscriptionConfig(newConfig);
      setSubscriptionConfig(newConfig);
      addToast(
        `Fazenda: ${f.nome} • Atividade: ${f.profileLabel}`,
        'info'
      );

      // Transição suave se o módulo atual não for ativo no novo perfil
      const newActiveSet = resolveActiveModuleIds(newConfig, ALL_MODULES.map((m) => m.id));
      if (!newActiveSet.has(activeTab) && activeTab !== 'DASHBOARD' && activeTab !== 'MAPA' && activeTab !== 'BI') {
        setActiveTab('DASHBOARD');
      }
    } else {
      addToast(`Fazenda alterada para: ${f.nome}`, 'info');
    }
  };

  // Favoritos personalizáveis com persistência no localStorage
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      const salvo = localStorage.getItem('super_agtech_favorites');
      if (salvo) return JSON.parse(salvo);
    } catch {
      // fallback
    }
    return ['BI', 'SIG', 'MOBILE', 'FROTA', 'FISCAL']; // 5 padrões
  });

  // Modal Central de Lançamentos Rápidos & Sistema de Toast
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
  const [isDossieBancarioOpen, setIsDossieBancarioOpen] = useState(false);
  const [isOfflineSyncModalOpen, setIsOfflineSyncModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleFavorito = (moduleId: string) => {
    setFavoritos((prev) => {
      const novos = prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId];
      try {
        localStorage.setItem('super_agtech_favorites', JSON.stringify(novos));
      } catch {
        // local storage error handle
      }
      return novos;
    });
  };

  // Atalho de Teclado Global: Ctrl + K (Busca) e N (Novo Lançamento Rápido)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickAccessOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsQuickEntryOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTalhao = (talhao: TalhaoData) => {
    setSelectedTalhao(talhao);
  };

  // Configuração Modular de Subscrição / Atividades Contratadas (Pecuarista, Agricultor, Culturas, etc.)
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfig>(() =>
    getSavedSubscriptionConfig()
  );
  const [isModuleConfigOpen, setIsModuleConfigOpen] = useState<boolean>(false);

  // Todos os IDs de módulos disponíveis
  const allModuleIds = useMemo(() => ALL_MODULES.map((m) => m.id), []);

  // Conjunto de módulos habilitados de acordo com o contrato/atividade
  const enabledModuleIds = useMemo(() => {
    return resolveActiveModuleIds(subscriptionConfig, allModuleIds);
  }, [subscriptionConfig, allModuleIds]);

  // Lista dos módulos efetivamente disponíveis para o cliente
  const availableModules = useMemo(() => {
    return ALL_MODULES.filter((m: ModuleItem) => enabledModuleIds.has(m.id));
  }, [enabledModuleIds]);

  // Perfil operacional atual do cliente
  const activeProfile = useMemo(() => {
    return (
      OPERATIONAL_PROFILES.find((p) => p.id === subscriptionConfig.profileId) ||
      OPERATIONAL_PROFILES[0]
    );
  }, [subscriptionConfig.profileId]);

  // Se o módulo ativo atual não estiver habilitado no perfil contratado, redireciona para o primeiro módulo habilitado
  useEffect(() => {
    if (!enabledModuleIds.has(activeTab) && availableModules.length > 0) {
      setActiveTab(availableModules[0].id);
    }
  }, [enabledModuleIds, activeTab, availableModules]);

  // Seleção e sincronização inteligente de módulos
  const handleSelectModule = (id: string) => {
    setActiveTab(id);
    const mod = ALL_MODULES.find((m: ModuleItem) => m.id === id);
    if (mod && selectedDomain !== 'TODOS' && selectedDomain !== 'FAVORITOS') {
      setSelectedDomain(mod.category);
    }
  };

  // Módulo ativo
  const activeModuleObj =
    availableModules.find((m: ModuleItem) => m.id === activeTab) ||
    ALL_MODULES.find((m: ModuleItem) => m.id === activeTab) ||
    ALL_MODULES[0];

  // Contadores por Domínio Operacional (apenas módulos contratados)
  const campoCount = availableModules.filter((m: ModuleItem) => m.category === 'CAMPO').length;
  const frotaCount = availableModules.filter((m: ModuleItem) => m.category === 'FROTA').length;
  const mercadoCount = availableModules.filter((m: ModuleItem) => m.category === 'MERCADO').length;
  const fiscalCount = availableModules.filter((m: ModuleItem) => m.category === 'FISCAL').length;
  const pecuariaCount = availableModules.filter((m: ModuleItem) => m.category === 'PECUARIA').length;

  // Módulos exibidos na fita de navegação rápida com busca instantânea
  const ribbonModules = availableModules.filter((m: ModuleItem) => {
    const matchesDomain =
      selectedDomain === 'FAVORITOS'
        ? favoritos.includes(m.id)
        : selectedDomain === 'TODOS'
        ? true
        : m.category === selectedDomain;
    if (!matchesDomain) return false;
    if (!ribbonFilter.trim()) return true;
    const q = ribbonFilter.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.fullName.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  // Lista dos módulos favoritos da barra superior (apenas ativos)
  const modulosBarraSuperior = availableModules.filter(
    (m: ModuleItem) => favoritos.includes(m.id) || m.id === activeTab
  );

  // Renderização Condicional: Landing Page Institucional
  if (currentAppView === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#8FBF88] selection:text-slate-900">
        <PublicLandingPage
          onGoToLogin={() => handleNavigateView('LOGIN')}
          onGoToRegister={() => handleNavigateView('REGISTER')}
          onEnterPlatformDirectly={() => {
            handleNavigateView('PLATFORM');
            addToast('Bem-vindo ao Cockpit Super AgTech Enterprise!', 'success');
          }}
        />
        <ToastNotification toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Renderização Condicional: Tela de Cadastro e Onboarding Progressivo
  if (currentAppView === 'REGISTER') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#8FBF88] selection:text-slate-900">
        <RegisterOnboardingScreen
          onRegisterSuccess={(data) => {
            handleNavigateView('PLATFORM');
            addToast(`Fazenda ${data.farm.nome} configurada com sucesso! Cockpit operacional pronto.`, 'success');
          }}
          onGoToLogin={() => handleNavigateView('LOGIN')}
          onBackToLanding={() => handleNavigateView('LANDING')}
        />
        <ToastNotification toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Renderização Condicional: Tela de Login Segura
  if (currentAppView === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#8FBF88] selection:text-slate-900">
        <LoginScreen
          onLoginSuccess={(profile) => {
            handleNavigateView('PLATFORM');
            addToast(`Bem-vindo, ${profile?.name || 'Produtor Rural'}! Cockpit carregado.`, 'success');
          }}
          onBackToLanding={() => handleNavigateView('LANDING')}
          onGoToRegister={() => handleNavigateView('REGISTER')}
        />
        <ToastNotification toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#8FBF88] selection:text-slate-900">
      {/* Barra de Ticker Financeiro B3/CBOT & Cockpit Climático Delta T */}
      <HeaderFintechBar onOpenDossie={() => setIsDossieBancarioOpen(true)} />

      {/* 1. Header Principal Corporativo (Luminoso, Clean & Moderno) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 px-4 lg:px-8 py-2.5 print:hidden shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo, Identificação e Seletor de Propriedade */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                  AGROTECH
                </span>
                <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  SaaS Rural
                </span>
              </div>
            </div>

            {/* Divisor vertical */}
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            {/* Seletor de Fazenda */}
            <div className="relative">
              <button
                onClick={() => setIsFarmDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs text-slate-800 font-bold bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{selectedFarm}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isFarmDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 space-y-1 text-slate-900">
                  <span className="text-[10px] uppercase font-bold text-slate-500 px-2 block">
                    Trocar Propriedade Agrícola:
                  </span>
                  {farmsList.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFarm(f)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex flex-col cursor-pointer ${
                        selectedFarm.includes(f.nome)
                          ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{f.nome}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                          {f.profileLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{f.local} • {f.area} • {f.safra}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Atividade Ativa */}
            <button
              onClick={() => setIsModuleConfigOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer group shadow-2xs"
              title="Configuração de Módulos e Atividades Contratadas"
            >
              <span className="text-xs">{activeProfile.icon}</span>
              <strong className="text-slate-900 font-bold">{activeProfile.shortLabel}</strong>
              <Sliders className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </button>
          </div>

          {/* Centro: Busca Rápida Ctrl+K */}
          <button
            onClick={() => setIsQuickAccessOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 text-xs font-medium shadow-2xs transition-all cursor-pointer w-48 md:w-64"
            title="Pressione Ctrl + K para abrir o Command Palette"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Buscar módulo ou comando...</span>
            <kbd className="ml-auto px-1.5 py-0.5 text-[9px] font-mono bg-white text-slate-500 rounded border border-slate-200">
              Ctrl K
            </kbd>
          </button>

          {/* Direita: Perfil RBAC, Ações & Sair */}
          <div className="flex items-center gap-2">
            {/* Seletor de Papel RBAC */}
            <div className="hidden xl:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              {(['PRODUTOR', 'AGRONOMO', 'OPERADOR', 'CONTADOR'] as UserProfileRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    agroApi.login(r);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer hover:bg-white/60"
                >
                  {r === 'PRODUTOR' ? 'Produtor' : r === 'AGRONOMO' ? 'Agrônomo' : r === 'OPERADOR' ? 'Operador' : 'Contador'}
                </button>
              ))}
            </div>

            {/* Central de Alertas */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 text-xs transition-all cursor-pointer shadow-2xs"
              title="Abrir Central de Notificações"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* Botão Novo Lançamento */}
            <button
              onClick={() => setIsQuickEntryOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
              title="Abrir Central de Lançamentos Rápidos (Pressione N)"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Novo Lançamento</span>
            </button>

            {/* Portal Comercial */}
            <button
              onClick={() => handleNavigateView('LANDING')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Ver Landing Page Institucional e Planos"
            >
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <span>Portal</span>
            </button>

            {/* Botão Sair */}
            <button
              onClick={() => handleNavigateView('LOGIN')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold border border-transparent transition-all cursor-pointer"
              title="Trocar de Conta / Tela de Login"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Navegador de Categorias & Faixa de Módulos (Domain Ribbon) */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-2.5 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Seletor de Categorias */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto text-xs pb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider pr-1">
                Domínio:
              </span>
              <button
                onClick={() => setSelectedDomain('TODOS')}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  selectedDomain === 'TODOS'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'text-slate-600 bg-transparent border-transparent hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Habilitados ({availableModules.length})
              </button>
              <button
                onClick={() => setSelectedDomain('FAVORITOS')}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                  selectedDomain === 'FAVORITOS'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>Favoritos ({favoritos.length})</span>
              </button>
              <button
                onClick={() => setSelectedDomain('CAMPO')}
                className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  selectedDomain === 'CAMPO'
                    ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-2xs'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                🌾 Campo & Manejo ({campoCount})
              </button>
              <button
                onClick={() => setSelectedDomain('FROTA')}
                className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  selectedDomain === 'FROTA'
                    ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-2xs'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                🚜 Máquinas & Frotas ({frotaCount})
              </button>
              <button
                onClick={() => setSelectedDomain('MERCADO')}
                className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  selectedDomain === 'MERCADO'
                    ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-2xs'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                📈 Mercado & Finanças ({mercadoCount})
              </button>
              <button
                onClick={() => setSelectedDomain('FISCAL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  selectedDomain === 'FISCAL'
                    ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-2xs'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                ⚖️ Fiscal & ESG ({fiscalCount})
              </button>
              <button
                onClick={() => setSelectedDomain('PECUARIA')}
                className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  selectedDomain === 'PECUARIA'
                    ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-2xs'
                    : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                🐂 Pecuária & ILPF ({pecuariaCount})
              </button>
            </div>

            {/* Barra de Pesquisa Rápida na Fita & Botão para Configuração Modular */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filtrar módulos..."
                  value={ribbonFilter}
                  onChange={(e) => setRibbonFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-7 pr-6 py-1 text-xs text-slate-900 placeholder-slate-400 w-36 sm:w-44 focus:outline-none transition-all"
                />
                {ribbonFilter && (
                  <button
                    onClick={() => setRibbonFilter('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsModuleConfigOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-800 hover:bg-emerald-50 border border-emerald-300 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                title="Personalizar Módulos Contratados de Acordo com a Atividade"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>Configurar ({activeProfile.shortLabel})</span>
              </button>
            </div>
          </div>

          {/* Fita Horizontal de Módulos do Domínio Selecionado */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {ribbonModules.map((m: ModuleItem) => {
              const Icon = m.icon;
              const isActive = activeTab === m.id;
              const isFav = favoritos.includes(m.id);

              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectModule(m.id)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-800 border-emerald-800 text-white font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{m.name}</span>
                  {m.badge && (
                    <span
                      className={`px-1.5 py-0.2 text-[9px] rounded font-bold ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {m.badge}
                    </span>
                  )}
                  {isFav && <Star className="w-2.5 h-2.5 text-amber-500 fill-current ml-0.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal Dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Active Module Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <activeModuleObj.icon className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {activeModuleObj.category === 'CAMPO'
                    ? 'Agronomia & Manejo'
                    : activeModuleObj.category === 'FROTA'
                    ? 'Frotas & Mecânica'
                    : activeModuleObj.category === 'MERCADO'
                    ? 'Mercado & Finanças'
                    : activeModuleObj.category === 'FISCAL'
                    ? 'Fiscal & LCDPR'
                    : 'Pecuária & ILPF'}
                </span>
                <h1 className="text-base font-bold text-slate-900">{activeModuleObj.fullName}</h1>
                {activeModuleObj.badge && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
                    {activeModuleObj.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeModuleObj.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Atalhos Rápidos Operacionais do Módulo */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {activeTab !== 'BI' && (
                <button
                  onClick={() => handleSelectModule('BI')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all cursor-pointer"
                  title="Painel Executivo BI"
                >
                  Cockpit BI
                </button>
              )}
              {activeTab !== 'SIG' && (
                <button
                  onClick={() => handleSelectModule('SIG')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all cursor-pointer"
                  title="Central SIG de Mapas"
                >
                  Mapa SIG
                </button>
              )}
              {activeTab !== 'COPILOT' && (
                <button
                  onClick={() => handleSelectModule('COPILOT')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-white rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  title="Copilot IA Safra"
                >
                  <Sparkles className="w-3 h-3 text-emerald-700" /> Copilot IA
                </button>
              )}
              {activeTab !== 'MOBILE' && (
                <button
                  onClick={() => handleSelectModule('MOBILE')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  title="Simulador de Aplicativo Mobile Offline"
                >
                  <Smartphone className="w-3 h-3 text-slate-500" /> Mobile
                </button>
              )}
            </div>

            <button
              onClick={() => handleToggleFavorito(activeModuleObj.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-2xs ${
                favoritos.includes(activeModuleObj.id)
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  favoritos.includes(activeModuleObj.id) ? 'fill-current text-amber-500' : 'text-slate-400'
                }`}
              />
              <span className="hidden sm:inline">{favoritos.includes(activeModuleObj.id) ? 'Favoritado' : 'Favoritar'}</span>
            </button>
            <button
              onClick={() => setIsQuickAccessOpen(true)}
              className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs"
              title="Abrir Command Palette (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ModuleErrorBoundary key={activeTab}>
          <React.Suspense fallback={<ModuleFallback />}>
            {activeTab === 'BI' && (
            <DashboardBI
              onSelectTalhao={(talhao) => {
                setSelectedTalhao(talhao);
                setActiveTab('SIG');
              }}
              profileId={subscriptionConfig.profileId}
              onNavigate={(moduleId) => handleSelectModule(moduleId)}
              onOpenModuleConfig={() => setIsModuleConfigOpen(true)}
            />
          )}

          {activeTab === 'SIG' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-xl font-bold text-[#1D4B38] flex items-center gap-2">
                    <Map className="w-5 h-5 text-emerald-700" /> Central Geográfica SIG (PostGIS + Mapbox/Leaflet)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Polígonos vetoriais com dados agronômicos, fitossanidade em tempo real, telemetria de frotas e índice NDVI Sentinel-2.
                  </p>
                </div>
              </div>

              <AgroMap
                selectedTalhao={selectedTalhao}
                onSelectTalhao={handleSelectTalhao}
                profileId={subscriptionConfig.profileId}
              />

              {/* Painel do Talhão Selecionado */}
              {selectedTalhao && (
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative animate-fade-in text-slate-900">
                  <button
                    onClick={() => setSelectedTalhao(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-600 hover:text-[#1D4B38] hover:bg-slate-50 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2.5 py-0.5 bg-emerald-50 text-[#1D4B38] border border-emerald-300 rounded-md font-bold">
                        {selectedTalhao.codigo}
                      </span>
                      <h3 className="text-base font-bold text-[#1D4B38]">{selectedTalhao.nome}</h3>
                      <span className="text-xs text-slate-600">({selectedTalhao.areaHa} ha)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Cultura: <span className="font-semibold text-[#285943]">{selectedTalhao.cultura}</span> • Variedade: {selectedTalhao.variedade} • Plantado em {selectedTalhao.dataPlantio}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-600 text-[10px] block uppercase font-bold">Custo ABC Acumulado</span>
                      <span className="text-[#1D4B38] font-mono font-bold text-sm">
                        R$ {selectedTalhao.custoTotalABC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-600 text-[10px] block uppercase font-bold">Break-Even</span>
                      <span className="text-[#A67C1E] font-mono font-bold text-sm">
                        {selectedTalhao.breakEvenScHa.toFixed(1)} sc/ha
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-600 text-[10px] block uppercase font-bold">Vigor NDVI (Satélite)</span>
                      <span className="text-[#285943] font-mono font-bold text-sm">
                        {selectedTalhao.ndviMedio.toFixed(2)} (Alta biomassa)
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('MOBILE')}
                      className="px-4 py-2.5 bg-[#285943] hover:bg-[#1D4B38] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
                    >
                      <Smartphone className="w-4 h-4" /> Lançar Operação
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'FROTA' && <TelemetriaFrotaModule />}

          {activeTab === 'OFICINA' && <ManutencaoOficinaModule />}

          {activeTab === 'NR31' && <NR31SegurancaTrabalhoModule />}

          {activeTab === 'PRECISAO' && <AgriculturaPrecisaoModule />}

          {activeTab === 'CLIMA' && <AgrometeorologiaModule />}

          {activeTab === 'IRRIGACAO' && <IrrigacaoPivoModule />}

          {activeTab === 'COLHEITA' && <RomaneioColheitaModule />}

          {activeTab === 'SILOS' && <SilosArmazenagemModule />}

          {activeTab === 'LOGISTICA' && <LogisticaFretesModule />}

          {activeTab === 'BARTER' && <ComercializacaoBarterModule />}

          {activeTab === 'CREDITO' && <CreditoRuralFinanciamentosModule />}

          {activeTab === 'RELATORIO' && <RelatorioSafraModule profileId={subscriptionConfig.profileId} />}

          {activeTab === 'MOBILE' && <MobileCockpitSimulator profileId={subscriptionConfig.profileId} />}

          {activeTab === 'RECEITUARIO' && <ReceituarioAgronomicoModule />}

          {activeTab === 'MIP' && <MIPManejoPragasModule />}

          {activeTab === 'ESG' && <ESGConformidadeEUDRModule />}

          {activeTab === 'SEMENTES' && <SementesVigorTSIModule />}

          {activeTab === 'CARBONO' && <CarbonoAgroModule />}

          {activeTab === 'DRONE' && <DronePulverizacaoAereaModule />}

          {activeTab === 'INPEV' && <InpevLogisticaReversaModule />}

          {activeTab === 'NUTRICAO' && <NutricaoFoliarSoloModule />}

          {activeTab === 'PERDAS_COLHEITA' && <PerdasColheitaModule />}

          {activeTab === 'BIOFABRICA' && <BiofabricaManejoOnFarmModule />}

          {activeTab === 'HEDGE_CAMBIAL' && <HedgeCambialNDFModule />}

          {activeTab === 'SEGURO' && <SeguroAgricolaSinistrosModule />}

          {activeTab === 'ILPF' && <ILPFManejoRotacionadoModule />}

          {activeTab === 'COMPOSTAGEM' && <CompostagemCircularModule />}

          {activeTab === 'CONFINAMENTO' && <ConfinamentoBovinoModule />}

          {activeTab === 'ROCHAGEM' && <RemineralizadoresRochagemModule />}

          {activeTab === 'DESCONTAMINACAO' && <DescontaminacaoPulverizadorModule />}

          {activeTab === 'SOLAR' && <EnergiaSolarIrrigacaoModule />}

          {activeTab === 'COBERTURA' && <PlantasCoberturaBiomassaModule />}

          {activeTab === 'PRODUTIVIDADE_PREDITIVA' && <ProdutividadePreditivaModule />}

          {activeTab === 'PONTAS_PULVERIZACAO' && <PontasPulverizacaoModule />}

          {activeTab === 'COMPACTACAO_SOLO' && <CompactacaoSoloModule />}

          {activeTab === 'BIOANALISE_SOLO' && <BioanaliseSoloModule />}

          {activeTab === 'ENSAIO_VARIEDADES' && <EnsaioVariedadesModule />}

          {activeTab === 'FBN_NITROGENIO' && <FixacaoBiologicaNitrogenioModule />}

          {activeTab === 'DEJETOS_SUINOS' && <DejetosLiquidosSuinosModule />}

          {activeTab === 'NEMATOIDES' && <NematoidesManejoModule />}

          {activeTab === 'UNIFORMIDADE_PLANTIO' && <UniformidadePlantioModule />}

          {activeTab === 'OEE_FROTAS' && <OEEFrotasAgricolasModule />}

          {activeTab === 'DANINHAS_RESISTENTES' && <DaninhasResistentesModule />}

          {activeTab === 'SILAGEM_FORRAGEM' && <SilagemForragemModule />}

          {activeTab === 'DISTRIBUICAO_ADUBO' && <DistribuicaoAduboModule />}

          {activeTab === 'FUNGICIDAS_MANEJO' && <FungicidasManejoModule />}

          {activeTab === 'FERTIRRIGACAO_PIVO' && <FertirrigacaoPivoModule />}

          {activeTab === 'RENOVABIO_CBIOS' && <RenovabioCBIOModule />}

          {activeTab === 'ALGODAO_HVI' && <AlgodaoHVIQualidadeModule />}

          {activeTab === 'BIODIGESTOR_BIOMETANO' && <BiodigestorBiometanoModule />}

          {activeTab === 'PISCICULTURA_AQUICULTURA' && <PisciculturaAquiculturaModule />}

          {activeTab === 'CAFEICULTURA_ESPECIAL' && <CafeiculturaEspecialModule />}

          {activeTab === 'CANA_DE_ACUCAR_ATR' && <CanadeAcucarATRModule />}

          {activeTab === 'SILVICULTURA_IMA' && <SilviculturaManejoFlorestalModule />}

          {activeTab === 'MERCADO_CARBONO_SBCE' && <MercadoCarbonoSBCEModule />}

          {activeTab === 'APICULTURA_POLINIZACAO' && <ApiculturaPolinizacaoModule />}

          {activeTab === 'HEVEICULTURA_BORRACHA' && <HeveiculturaBorrachaModule />}

          {activeTab === 'VITIVINICULTURA_PRECISAO' && <VitiviniculturaPrecisaoModule />}

          {activeTab === 'OVINOCULTURA_CAPRINOS' && <OvinoculturaCaprinosModule />}

          {activeTab === 'CITRICULTURA_PRECISAO' && <CitriculturaPrecisaoModule />}

          {activeTab === 'AVICULTURA_CLIMATIZADA' && <AviculturaClimatizadaModule />}

          {activeTab === 'ORIZICULTURA_ARROZ' && <OriziculturaArrozModule />}

          {activeTab === 'CACAULICULTURA_CABRUCA' && <CacauliculturaCabrucaModule />}

          {activeTab === 'BOVINOCULTURA_LEITE' && <BovinoculturaLeiteModule />}

          {activeTab === 'OLIVICULTURA_AZEITE' && <OliviculturaAzeiteModule />}

          {activeTab === 'OLERICULTURA_HF' && <OlericulturaHFModule />}

          {activeTab === 'SUINOCULTURA_PRECISAO' && <SuinoculturaPrecisaoModule />}

          {activeTab === 'MANDIOCULTURA_AMIDO' && <MandioculturaAmidoModule />}

          {activeTab === 'LUPULICULTURA_CERVEJA' && <LupuliculturaCervejeiraModule />}

          {activeTab === 'BANANICULTURA_CLIMATIZADA' && <BananiculturaClimatizadaModule />}

          {activeTab === 'CONFINAMENTO_CORDEIROS' && <ConfinamentoCordeirosModule />}

          {activeTab === 'CULTIVO_PROTEGIDO_HIDROPONIA' && <CultivoProtegidoHidroponiaModule />}

          {activeTab === 'EQUINOCULTURA_MANEJO' && <EquinoculturaManejoModule />}

          {activeTab === 'PALMA_FORRAGEIRA' && <PalmaForrageiraSemiAridoModule />}

          {activeTab === 'BUBALINOCULTURA_QUEIJO' && <BubalinoculturaQueijoModule />}

          {activeTab === 'RANICULTURA_SUSTENTAVEL' && <RaniculturaSustentavelModule />}

          {activeTab === 'CARCINICULTURA_BIOFLOCOS' && <CarciniculturaBioflocosModule />}

          {activeTab === 'CUNICULTURA_INDUSTRIAL' && <CuniculturaIndustrialModule />}

          {activeTab === 'FUNGICULTURA_COGUMELOS' && <FungiculturaCogumelosModule />}

          {activeTab === 'SERICICULTURA_SEDA' && <SericiculturaSedaModule />}

          {activeTab === 'ALGOTECNOLOGIA_MICROALGAS' && <AlgotecnologiaMicroalgasModule />}

          {activeTab === 'MINHOCULTURA_HUMUS' && <MinhoculturaHumusModule />}

          {activeTab === 'HELICICULTURA_ESCARGOT' && <HeliciculturaEscargotModule />}

          {activeTab === 'OEM_TELEMATICS_GATEWAY' && <OEMTelematicsGatewayModule />}

          {activeTab === 'SEFAZ_GEO_AUDITOR' && <SefazGeoAuditorModule />}

          {activeTab === 'CAJUCULTURA_DOC' && <CajuculturaBeneficiamentoModule />}

          {activeTab === 'FAZENDAS_VERTICAIS_AEROPONIA' && <FazendasVerticaisAeroponiaModule />}

          {activeTab === 'ERVA_MATE_SAPECO' && <ErvaMateSapecoModule />}

          {activeTab === 'DENDEICULTURA_RSPO' && <DendeiculturaRspoModule />}

          {activeTab === 'MARICULTURA_OSTRAS' && <MariculturaOstrasModule />}

          {activeTab === 'ORQUESTRADOR_AUTONOMO_40' && <OrquestradorAutonomo40Module />}

          {activeTab === 'BATATICULTURA_CHIPS' && <BataticulturaChipsModule />}

          {activeTab === 'CEBOLA_ALHO_CURA' && <CebolaAlhoCuraModule />}

          {activeTab === 'MELIPONICULTURA_ASF' && <MeliponiculturaAsfModule />}

          {activeTab === 'CAPRINOCULTURA_QUEIJOS' && <CaprinoculturaQueijosModule />}

          {activeTab === 'CARBONO_AZUL_MARINHO' && <CarbonoAzulMarinhoModule />}

          {activeTab === 'NOZ_PECAN_POMARES' && <NozPecanPomaresModule />}

          {activeTab === 'MACADAMIA_PROCESSAMENTO' && <MacadamiaProcessamentoModule />}

          {activeTab === 'GUARANICULTURA_AMAZONIA' && <GuaraniculturaAmazoniaModule />}

          {activeTab === 'PIMENTA_DO_REINO_QUALIDADE' && <PimentaDoReinoQualidadeModule />}

          {activeTab === 'INTELIGENCIA_BASIS_PORTUARIO' && <InteligenciaBasisPortuarioModule />}

          {activeTab === 'CACAU_FINO_FERMENTACAO' && <CacauFinoFermentacaoModule />}

          {activeTab === 'TAINHA_AQUICULTURA_ESTUARINA' && <TainhaAquiculturaEstuarinaModule />}

          {activeTab === 'CASTANHA_BRASIL_EXTRATIVISMO' && <CastanhaBrasilExtrativismoModule />}

          {activeTab === 'GERGELIM_SEGUNDA_SAFRA' && <GergelimSegundaSafraModule />}

          {activeTab === 'MONITORAMENTO_FILA_TERMINAIS' && <MonitoramentoFilaTerminaisModule />}

          {activeTab === 'PITAIA_PRECISAO' && <PitaiaculturaPrecisaoModule />}

          {activeTab === 'SUINOCULTURA_MATERNIDADE' && <SuinoculturaMaternidadeModule />}

          {activeTab === 'ACAI_TERRA_FIRME' && <AcaiTerraFirmeModule />}

          {activeTab === 'REGULADORES_CRESCIMENTO' && <ReguladoresCrescimentoModule />}

          {activeTab === 'ZONEAMENTO_RISCO_ZARC' && <ZoneamentoRiscoZarcModule />}

          {activeTab === 'FLORICULTURA_FLORES_NOBRES' && <FloriculturaFloresNobresModule />}

          {activeTab === 'AVICULTURA_POSTURA_OVOS' && <AviculturaPosturaOvosModule />}

          {activeTab === 'FERTILIZANTES_ORGANOMINERAIS' && <FertilizantesOrganomineraisModule />}

          {activeTab === 'AZEITONAS_MESA_PROCESSAMENTO' && <AzeitonasDeMesaProcessamentoModule />}

          {activeTab === 'TORRE_CONTROLE_LOGISTICO_COC' && <TorreControleLogisticoCocModule />}

          {activeTab === 'ALGODAO_HVI_CLASSIFICACAO' && <AlgodaoHviClassificacaoModule />}

          {activeTab === 'VINHOS_FINOS_DUPLA_PODA' && <VinhosFinosDuplaPodaModule />}

          {activeTab === 'CAPRINOCULTURA_QUEIJOS_MATURADOS' && <CaprinoculturaQueijosMaturadosModule />}

          {activeTab === 'MICORRIZAS_BIOINSUMOS' && <MicorrizasBioinsumosModule />}

          {activeTab === 'BARTER_MULTI_COMMODITY_CPR' && <BarterMultiCommodityCprModule />}

          {activeTab === 'FERTIRRIGACAO_INJECAO_MULTICANAL' && <FertirrigacaoInjecaoMulticanalModule />}

          {activeTab === 'BOVINOCULTURA_SISBOV_RFID' && <BovinoculturaSisbovRfidModule />}

          {activeTab === 'MOENDA_DIFUSOR_CANA_EXTRACAO' && <MoendaDifusorCanaExtracaoModule />}

          {activeTab === 'ARMAZENAGEM_TERMOMETRIA_ORVALHO' && <ArmazenagemTermometriaOrvalhoModule />}

          {activeTab === 'RENOVABIO_CALCULADORA_CBIO' && <RenovabioCalculadoraCbioModule />}

          {activeTab === 'COPILOT' && <CopilotSafraModule profileId={subscriptionConfig.profileId} />}

          {activeTab === 'DRE_COMBOIO' && <DRECombustivelComboioModule />}

          {activeTab === 'SENSIBILIDADE' && <SensibilidadeSafraModule />}

          {activeTab === 'FISCAL' && <FiscalLCDPRModule />}

          {activeTab === 'ESTOQUE' && <AlmoxarifadoModule />}

          {activeTab === 'ARRENDAMENTO' && <ArrendamentosContratosModule />}

            {activeTab === 'ZOOTECNIA' && <ZootecniaModule />}
          </React.Suspense>
        </ModuleErrorBoundary>
      </main>

      {/* Central Unificada de Lançamentos Rápidos */}
      <GlobalQuickEntryModal
        isOpen={isQuickEntryOpen}
        onClose={() => setIsQuickEntryOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
        profileId={subscriptionConfig.profileId}
      />

      {/* Dossiê Executivo de Crédito Rural & Homologação Bancária */}
      <DossieBancarioCreditoModal
        isOpen={isDossieBancarioOpen}
        onClose={() => setIsDossieBancarioOpen(false)}
      />

      {/* Central Offline-First & Fila de Sincronização PWA */}
      <OfflineSyncCockpitModal
        isOpen={isOfflineSyncModalOpen}
        onClose={() => setIsOfflineSyncModalOpen(false)}
        onNotify={(msg, type) => addToast(msg, type)}
      />

      {/* Sistema de Notificações Toast Feedback Instantâneo */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      {/* Central de Alertas e Notificações Operacionais */}
      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectModule={(id) => handleSelectModule(id)}
        profileId={subscriptionConfig.profileId}
      />

      {/* Modal de Gestão de Módulos e Atividades Contratadas */}
      <ModuleConfigModal
        isOpen={isModuleConfigOpen}
        onClose={() => setIsModuleConfigOpen(false)}
        config={subscriptionConfig}
        onConfigChange={(newCfg) => {
          setSubscriptionConfig(newCfg);
          const prof = OPERATIONAL_PROFILES.find((p) => p.id === newCfg.profileId);
          addToast(`Perfil atualizado: ${prof ? prof.name : 'Personalizado'}`, 'success');
          const newActiveSet = resolveActiveModuleIds(newCfg, ALL_MODULES.map((m) => m.id));
          if (!newActiveSet.has(activeTab) && activeTab !== 'DASHBOARD' && activeTab !== 'MAPA') {
            setActiveTab('DASHBOARD');
          }
        }}
      />

      {/* Modal de Acesso Rápido, Busca e Gerenciamento de Favoritos (Command Palette) */}
      <QuickAccessModal
        isOpen={isQuickAccessOpen}
        onClose={() => setIsQuickAccessOpen(false)}
        onSelectModule={(id) => handleSelectModule(id)}
        activeModuleId={activeTab}
        favoritos={favoritos}
        onToggleFavorito={handleToggleFavorito}
        enabledModuleIds={enabledModuleIds}
        onOpenModuleConfig={() => setIsModuleConfigOpen(true)}
        activeProfileName={activeProfile.name}
      />

      {/* Footer com Arquitetura, Atalhos e Indicadores de Sistema */}
      <footer className="border-t border-slate-200 bg-white px-6 py-3.5 mt-auto text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5F8F52] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#285943]"></span>
            </span>
            <span className="text-slate-900 font-bold">AGROTECH Enterprise • Sistema Operacional Rural</span>
            <span className="text-[10px] text-[#285943] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 font-mono">
              PostGIS 3.4 Spatial • Online
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-600 border-l border-slate-200 pl-3">
            <span>SEFAZ A1: <b className="text-[#285943]">Válido (248 dias)</b></span>
            <span>•</span>
            <span>GPS RTK: <b className="text-[#7DA9C4]">Precisão 2cm</b></span>
            <span>•</span>
            <span>Sincronização: <b className="text-[#285943]">Ativa (12ms)</b></span>
          </div>
        </div>

        {/* Atalhos de Teclado */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-600 hidden sm:inline">Atalhos Globais:</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-50 text-slate-900 rounded border border-slate-200">Ctrl K</kbd>
            <span className="text-slate-600">Buscar</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-50 text-slate-900 rounded border border-slate-200">N</kbd>
            <span className="text-slate-600">Lançamento</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
