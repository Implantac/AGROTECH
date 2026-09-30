import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { TALHOES_INICIAIS, MAQUINAS_INICIAIS, TalhaoData } from '../data/mockAgroData';
import {
  Layers,
  MapPin,
  Eye,
  AlertTriangle,
  Sprout,
  DollarSign,
  UploadCloud,
  Tractor,
  FileCode,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';

interface AgroMapProps {
  onSelectTalhao: (talhao: TalhaoData) => void;
  selectedTalhao: TalhaoData | null;
  profileId?: string;
}

const DIVISOES_PECUARIA: TalhaoData[] = [
  {
    id: 'pasto-01',
    codigo: 'PAS-01',
    nome: 'Pasto Mombaça P01',
    areaHa: 240.0,
    cultura: 'Panicum maximum cv. Mombaça',
    variedade: 'Pastejo Rotacionado (620 Novilhas)',
    dataPlantio: '2024-11-10',
    status: 'PULVERIZADO', // Mapeia para PASTEJO ATIVO
    coordenadas: [
      [-12.542, -55.728],
      [-12.542, -55.715],
      [-12.555, -55.715],
      [-12.555, -55.728],
    ],
    custoTotalABC: 138500.0,
    breakEvenScHa: 2.6, // UA/ha
    ndviMedio: 0.84,
    pragasDetectadas: 0,
  },
  {
    id: 'pasto-02',
    codigo: 'PAS-02',
    nome: 'Piquete Brachiaria P02',
    areaHa: 180.0,
    cultura: 'Brachiaria brizantha cv. Marandu',
    variedade: 'Descanso e Rebrota (35d)',
    dataPlantio: '2023-12-05',
    status: 'PREPARO', // Mapeia para DESCANSO
    coordenadas: [
      [-12.556, -55.728],
      [-12.556, -55.715],
      [-12.568, -55.715],
      [-12.568, -55.728],
    ],
    custoTotalABC: 89400.0,
    breakEvenScHa: 2.3, // UA/ha
    ndviMedio: 0.78,
    pragasDetectadas: 0,
  },
  {
    id: 'curral-03',
    codigo: 'CUR-03',
    nome: 'Currais de Confinamento A1-A10',
    areaHa: 45.0,
    cultura: 'Confinamento Intensivo Grão Inteiro',
    variedade: 'Nelore & Cruzamento Angus F1 (4.250 bois)',
    dataPlantio: '2026-08-01',
    status: 'COLHEITA', // Mapeia para TERMINAÇÃO COCHO
    coordenadas: [
      [-12.542, -55.714],
      [-12.542, -55.702],
      [-12.555, -55.702],
      [-12.555, -55.714],
    ],
    custoTotalABC: 489000.0,
    breakEvenScHa: 1.58, // GMD kg/dia
    ndviMedio: 0.35,
    pragasDetectadas: 0,
  },
  {
    id: 'pasto-04',
    codigo: 'PAS-04',
    nome: 'Piquete Maternidade & IATF',
    areaHa: 95.0,
    cultura: 'Brachiaria decumbens',
    variedade: 'Matrizes Prenhas & Bezerros',
    dataPlantio: '2024-10-15',
    status: 'PLANTADO', // Mapeia para MATERNIDADE
    coordenadas: [
      [-12.556, -55.714],
      [-12.556, -55.702],
      [-12.568, -55.702],
      [-12.568, -55.714],
    ],
    custoTotalABC: 64200.0,
    breakEvenScHa: 1.8, // UA/ha
    ndviMedio: 0.81,
    pragasDetectadas: 0,
  },
];

export const AgroMap: React.FC<AgroMapProps> = ({ onSelectTalhao, selectedTalhao, profileId = 'AGRICULTURA_GRAOS' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const machineLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'OPERACIONAL' | 'FITOSSANIDADE' | 'NDVI' | 'FROTA'>('OPERACIONAL');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [talhoesList, setTalhoesList] = useState<TalhaoData[]>(() => {
    return profileId === 'PECUARIA_CORTE_LEITE' ? DIVISOES_PECUARIA : TALHOES_INICIAIS;
  });
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza polígonos quando a atividade contratada muda
  useEffect(() => {
    if (profileId === 'PECUARIA_CORTE_LEITE') {
      setTalhoesList(DIVISOES_PECUARIA);
    } else {
      setTalhoesList(TALHOES_INICIAIS);
    }
  }, [profileId]);

  // Inicialização do Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Coordenadas centrais da Fazenda Santa Helena em Sorriso - MT
    const map = L.map(mapContainerRef.current, {
      center: [-12.56, -55.715],
      zoom: 14,
      zoomControl: true,
    });

    // Camada base de satélite aberta (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Esri, Maxar, Earthstar Geographics, Super AgTech SIG',
      maxZoom: 18,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    const machineGroup = L.layerGroup().addTo(map);
    polygonLayerGroupRef.current = layerGroup;
    machineLayerGroupRef.current = machineGroup;
    mapInstanceRef.current = map;

    return () => {
      if (map) {
        map.remove();
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Atualização dos polígonos quando muda a camada ativa, lista de talhões ou seleção
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = polygonLayerGroupRef.current;
    const machineGroup = machineLayerGroupRef.current;
    if (!map || !layerGroup || !machineGroup) return;

    layerGroup.clearLayers();
    machineGroup.clearLayers();

    talhoesList.forEach((talhao) => {
      let fillColor = '#10b981'; // Verde padrão
      let fillOpacity = 0.45;
      let strokeColor = '#059669';

      if (activeLayer === 'OPERACIONAL' || activeLayer === 'FROTA') {
        switch (talhao.status) {
          case 'PREPARO':
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
            break;
          case 'PLANTADO':
            fillColor = '#3b82f6';
            strokeColor = '#2563eb';
            break;
          case 'PULVERIZADO':
            fillColor = '#10b981';
            strokeColor = '#059669';
            break;
          case 'COLHEITA':
            fillColor = '#8b5cf6';
            strokeColor = '#7c3aed';
            break;
        }
      } else if (activeLayer === 'FITOSSANIDADE') {
        if (talhao.pragasDetectadas === 0) {
          fillColor = '#10b981';
          strokeColor = '#059669';
        } else if (talhao.pragasDetectadas <= 2) {
          fillColor = '#f59e0b';
          strokeColor = '#d97706';
        } else {
          fillColor = '#ef4444';
          strokeColor = '#b91c1c';
          fillOpacity = 0.65;
        }
      } else if (activeLayer === 'NDVI') {
        if (talhao.ndviMedio > 0.8) {
          fillColor = '#15803d';
          fillOpacity = 0.7;
        } else if (talhao.ndviMedio > 0.7) {
          fillColor = '#22c55e';
          fillOpacity = 0.6;
        } else if (talhao.ndviMedio > 0.5) {
          fillColor = '#eab308';
          fillOpacity = 0.6;
        } else {
          fillColor = '#b45309';
          fillOpacity = 0.6;
        }
        strokeColor = '#0f172a';
      }

      const isSelected = selectedTalhao?.id === talhao.id;

      const polygon = L.polygon(talhao.coordenadas, {
        color: isSelected ? '#ffffff' : strokeColor,
        weight: isSelected ? 4 : 2,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.75 : fillOpacity,
      });

      polygon.bindTooltip(
        `<b>${talhao.codigo} - ${talhao.nome}</b><br/>Área: ${talhao.areaHa} ha<br/>Cultura: ${talhao.cultura}<br/>Break-Even: <b>${talhao.breakEvenScHa} sc/ha</b>`,
        { permanent: false, direction: 'center', className: 'agro-tooltip' }
      );

      polygon.on('click', () => {
        onSelectTalhao(talhao);
      });

      polygon.addTo(layerGroup);

      if (activeLayer === 'FITOSSANIDADE' && talhao.pragasDetectadas > 0) {
        const center = polygon.getBounds().getCenter();
        const iconHtml = `<div class="bg-red-600 text-white font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">${talhao.pragasDetectadas}</div>`;
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'pest-icon',
          iconSize: [24, 24],
        });
        L.marker(center, { icon: customIcon }).addTo(layerGroup);
      }
    });

    // Se a camada de frotas estiver ativa, desenha as máquinas com GPS e telemetria instantânea
    if (activeLayer === 'FROTA') {
      MAQUINAS_INICIAIS.forEach((maq) => {
        const iconHtml = `<div class="bg-slate-950 text-emerald-400 p-1.5 rounded-xl border-2 border-emerald-400 shadow-2xl flex items-center justify-center w-8 h-8 font-black text-xs hover:scale-125 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5c-.1.5-.6.9-1.1.9H7.6"/><path d="M14 11V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/><circle cx="8" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></div>`;
        const machineIcon = L.divIcon({
          html: iconHtml,
          className: 'tractor-gps-marker',
          iconSize: [32, 32],
        });

        const marker = L.marker(maq.coordenadasAtual, { icon: machineIcon });
        marker.bindPopup(`
          <div class="text-xs p-1">
            <b class="text-sm font-bold">${maq.nome}</b><br/>
            <span>Operador: <b>${maq.operadorNome}</b></span><br/>
            <span>Velocidade: <b>${maq.velocidadeKmh} km/h</b></span><br/>
            <span>Consumo: <b>${maq.consumoInstantaneoLh} L/h</b> (Diesel S10)</span><br/>
            <span>Status: <b class="text-emerald-600">${maq.statusTelemetria}</b></span>
          </div>
        `);
        marker.addTo(machineGroup);
      });
    }
  }, [activeLayer, selectedTalhao, talhoesList, onSelectTalhao]);

  // Função para parsear arquivo GeoJSON
  const parseGeoJSON = (content: string, filename: string) => {
    try {
      const parsed = JSON.parse(content);
      const features = parsed.type === 'FeatureCollection' ? parsed.features : [parsed];
      const novosTalhoes: TalhaoData[] = [];

      features.forEach((feat: any, idx: number) => {
        let coordsRaw: any = null;
        if (feat.geometry?.type === 'Polygon') {
          coordsRaw = feat.geometry.coordinates[0];
        } else if (feat.geometry?.type === 'MultiPolygon') {
          coordsRaw = feat.geometry.coordinates[0][0];
        }

        if (coordsRaw && Array.isArray(coordsRaw)) {
          // Converte [lng, lat] para [lat, lng] compatível com Leaflet
          const leafletCoords: [number, number][] = coordsRaw.map((pt: any) => [Number(pt[1]), Number(pt[0])]);
          const props = feat.properties || {};

          novosTalhoes.push({
            id: `imported-${Date.now()}-${idx}`,
            codigo: props.codigo || `IMP-${talhoesList.length + idx + 1}`,
            nome: props.nome || `${filename.replace(/\.[^/.]+$/, '')} (Gleba ${idx + 1})`,
            areaHa: Number(props.areaHa || props.area || 185.4),
            cultura: props.cultura || 'Soja Grão',
            variedade: props.variedade || 'TMG 2381 IPRO',
            dataPlantio: props.dataPlantio || '15/10/2026',
            status: 'PLANTADO',
            coordenadas: leafletCoords,
            custoTotalABC: 145000.0,
            breakEvenScHa: 48.5,
            ndviMedio: 0.82,
            pragasDetectadas: 0,
          });
        }
      });

      if (novosTalhoes.length > 0) {
        setTalhoesList((prev) => [...prev, ...novosTalhoes]);
        setImportFeedback(`Sucesso! ${novosTalhoes.length} talhão(ões) importados de ${filename}.`);
        
        // Centraliza o mapa no novo talhão
        if (mapInstanceRef.current && novosTalhoes[0].coordenadas.length > 0) {
          const bounds = L.latLngBounds(novosTalhoes[0].coordenadas);
          mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
          onSelectTalhao(novosTalhoes[0]);
        }
      } else {
        setImportFeedback('Nenhum polígono válido encontrado no arquivo GeoJSON.');
      }
    } catch (err: any) {
      setImportFeedback(`Erro ao ler GeoJSON: ${err.message}`);
    }
  };

  // Função para parsear arquivo KML
  const parseKML = (content: string, filename: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      const placemarks = xmlDoc.getElementsByTagName('Placemark');
      const novosTalhoes: TalhaoData[] = [];

      for (let i = 0; i < placemarks.length; i++) {
        const placemark = placemarks[i];
        const nameNode = placemark.getElementsByTagName('name')[0];
        const name = nameNode ? nameNode.textContent || `KML Gleba ${i + 1}` : `KML Gleba ${i + 1}`;
        const coordNode = placemark.getElementsByTagName('coordinates')[0];

        if (coordNode && coordNode.textContent) {
          const coordText = coordNode.textContent.trim();
          const points = coordText.split(/\s+/);
          const leafletCoords: [number, number][] = [];

          points.forEach((p) => {
            const parts = p.split(',');
            if (parts.length >= 2) {
              const lng = parseFloat(parts[0]);
              const lat = parseFloat(parts[1]);
              if (!isNaN(lat) && !isNaN(lng)) {
                leafletCoords.push([lat, lng]);
              }
            }
          });

          if (leafletCoords.length >= 3) {
            novosTalhoes.push({
              id: `imported-kml-${Date.now()}-${i}`,
              codigo: `KML-${talhoesList.length + i + 1}`,
              nome: `${name} (${filename})`,
              areaHa: 215.0,
              cultura: 'Milho Safrinha',
              variedade: 'DKB 360 PRO3',
              dataPlantio: '05/02/2027',
              status: 'PREPARO',
              coordenadas: leafletCoords,
              custoTotalABC: 189000.0,
              breakEvenScHa: 72.0,
              ndviMedio: 0.71,
              pragasDetectadas: 1,
            });
          }
        }
      }

      if (novosTalhoes.length > 0) {
        setTalhoesList((prev) => [...prev, ...novosTalhoes]);
        setImportFeedback(`Sucesso! ${novosTalhoes.length} talhão(ões) KML importados de ${filename}.`);
        if (mapInstanceRef.current && novosTalhoes[0].coordenadas.length > 0) {
          const bounds = L.latLngBounds(novosTalhoes[0].coordenadas);
          mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
          onSelectTalhao(novosTalhoes[0]);
        }
      } else {
        setImportFeedback('Nenhuma coordenada válida encontrada no arquivo KML.');
      }
    } catch (err: any) {
      setImportFeedback(`Erro ao ler KML: ${err.message}`);
    }
  };

  const handleFileUpload = (file: File) => {
    const filename = file.name;
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      if (filename.endsWith('.json') || filename.endsWith('.geojson')) {
        parseGeoJSON(text, filename);
      } else if (filename.endsWith('.kml') || filename.endsWith('.xml')) {
        parseKML(text, filename);
      } else {
        // Fallback: tenta como JSON, se falhar tenta KML
        try {
          parseGeoJSON(text, filename);
        } catch {
          parseKML(text, filename);
        }
      }
    };

    reader.readAsText(file);
  };

  // Carregador de Amostra Pré-pronta de Demonstração
  const handleLoadSampleGeoJSON = () => {
    const sampleGeoJSON = JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            codigo: 'TAL-09',
            nome: 'Gleba Nova Esperança (CAR MT-5107925)',
            areaHa: 318.5,
            cultura: 'Soja Grão Intacta 2 Xtend',
            variedade: 'M 5917 IPRO',
            dataPlantio: '20/10/2026',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-55.705, -12.552],
                [-55.695, -12.552],
                [-55.695, -12.565],
                [-55.705, -12.565],
                [-55.705, -12.552],
              ],
            ],
          },
        },
      ],
    });

    parseGeoJSON(sampleGeoJSON, 'Gleba_Nova_Esperanca_CAR.geojson');
  };

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Contêiner Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Controles de Camadas SIG no topo */}
      <div className="absolute top-4 left-4 z-[500] bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700 shadow-xl flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5 px-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Camada SIG:
        </span>
        <button
          onClick={() => setActiveLayer('OPERACIONAL')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            activeLayer === 'OPERACIONAL'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Status Operações
        </button>
        <button
          onClick={() => setActiveLayer('FROTA')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
            activeLayer === 'FROTA'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Tractor className="w-3.5 h-3.5" /> Frotas (Tempo Real)
        </button>
        <button
          onClick={() => setActiveLayer('FITOSSANIDADE')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
            activeLayer === 'FITOSSANIDADE'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" /> Heatmap Pragas
        </button>
        <button
          onClick={() => setActiveLayer('NDVI')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 ${
            activeLayer === 'NDVI'
              ? 'bg-lime-600 text-white shadow-sm'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" /> NDVI Sentinel-2
        </button>
      </div>

      {/* Botão de Importação de CAR / Shapefile / GeoJSON */}
      <div className="absolute top-4 right-4 z-[500] flex items-center gap-2">
        <button
          onClick={() => setImportModalOpen(true)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-slate-200 hover:text-emerald-400 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xl transition-all"
        >
          <UploadCloud className="w-4 h-4 text-emerald-400" /> Importar GeoJSON / KML / CAR
        </button>
      </div>

      {/* Legenda Dinâmica no canto inferior esquerdo */}
      <div className="absolute bottom-4 left-4 z-[500] bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 text-xs text-slate-300 shadow-xl max-w-xs">
        <p className="font-semibold text-slate-200 mb-1.5">
          {activeLayer === 'OPERACIONAL' && 'Legenda de Status Operacional'}
          {activeLayer === 'FROTA' && 'Telemetria de Tratores e Pulverizadores'}
          {activeLayer === 'FITOSSANIDADE' && 'Alerta de Monitoramento Fitossanitário'}
          {activeLayer === 'NDVI' && 'Índice de Vigor Vegetativo (NDVI)'}
        </p>
        {(activeLayer === 'OPERACIONAL' || activeLayer === 'FROTA') && (
          profileId === 'PECUARIA_CORTE_LEITE' ? (
            <div className="grid grid-cols-2 gap-1.5">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Pastejo Ativo</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Descanso (Rebrota)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-sm"></span> Confinamento Cocho</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Maternidade / IATF</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Plantado</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Pulverizado</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Preparo</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-sm"></span> Colheita</span>
            </div>
          )
        )}
        {activeLayer === 'FITOSSANIDADE' && (
          <div className="space-y-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Sob Controle (0 alvos)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Alerta Moderado (1-2 alvos)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> NDE Crítico (Aplicação Urgente)</span>
          </div>
        )}
        {activeLayer === 'NDVI' && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded bg-gradient-to-r from-amber-700 via-yellow-400 to-green-700"></div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.30 Solo/Palha</span>
              <span>0.65 Médio</span>
              <span>0.85 Alta Biomassa</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Importação com Parser Ativo GeoJSON / KML */}
      {importModalOpen && (
        <div className="absolute inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-400" /> Parser SIG: Importar Malha Geográfica
              </h3>
              <button
                onClick={() => {
                  setImportModalOpen(false);
                  setImportFeedback(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Arraste ou selecione arquivos <strong>GeoJSON (.geojson, .json)</strong> ou <strong>KML (.kml)</strong> do CAR da fazenda ou do piloto automático do trator.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".geojson,.json,.kml,.xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />

            {/* Zona de Drop Interativa */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-4 ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-950/30'
                  : 'border-slate-700 hover:border-emerald-500/60 bg-slate-800/40'
              }`}
            >
              <FileCode className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-90" />
              <p className="text-sm font-semibold text-white">Arraste seu arquivo GeoJSON ou KML aqui</p>
              <p className="text-xs text-slate-400 mt-1">ou clique para selecionar do computador</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500 font-mono">
                <span>EPSG:4326 (WGS 84)</span>
                <span>•</span>
                <span>SIRGAS 2000</span>
                <span>•</span>
                <span>CAR / SiCAR</span>
              </div>
            </div>

            {/* Feedback da Importação */}
            {importFeedback && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                importFeedback.startsWith('Sucesso')
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950/50 text-rose-300 border border-rose-800'
              }`}>
                {importFeedback.startsWith('Sucesso') ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{importFeedback}</span>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                onClick={handleLoadSampleGeoJSON}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-800/50 font-semibold flex items-center justify-center gap-1.5 shadow"
              >
                <FileText className="w-3.5 h-3.5" /> Testar com Amostra (CAR 318 ha)
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
