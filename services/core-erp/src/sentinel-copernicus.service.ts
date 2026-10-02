/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Copernicus Sentinel-2 Multispectral Satellite Service
 * Cálculo de NDVI, NDWI, EVI e Máscara de Nuvens SCL
 */

export interface ReflectanciaPixel {
  b02Azul: number;      // Banda 2 - Azul (490 nm)
  b04Vermelho: number;  // Banda 4 - Vermelho (665 nm)
  b08Nir: number;       // Banda 8 - Infravermelho Próximo NIR (842 nm)
  b11Swir: number;      // Banda 11 - Infravermelho de Onda Curta SWIR (1610 nm)
  sclClassificacao: number; // SCL (Scene Classification Layer: 3=Sombra, 4=Vegetação, 8=Nuvem Média, 9=Nuvem Alta)
}

export interface ResultadoIndicesEspectrais {
  ndvi: number;
  ndwi: number;
  evi: number;
  biomassaStatus: 'MUITO_ALTA' | 'ALTA' | 'MEDIA' | 'BAIXA' | 'SOLO_EXPOSTO';
  estresseHidricoStatus: 'SEM_ESTRESSE' | 'LEVE' | 'MODERADO' | 'SEVERO';
  pixelValidoSemNuvem: boolean;
  classificacaoSclNome: string;
}

export class SentinelCopernicusService {
  /**
   * Processa os dados de reflectância de superfície (BOA - Level-2A) para um pixel ou talhão
   */
  public calcularIndicesVegetacao(pixel: ReflectanciaPixel): ResultadoIndicesEspectrais {
    const { b02Azul, b04Vermelho, b08Nir, b11Swir, sclClassificacao } = pixel;

    // 1. Verificação de Máscara de Nuvens e Sombras (SCL)
    // SCL 4 = Vegetação, SCL 5 = Solo não vegetado, SCL 6 = Água
    // SCL 3 = Sombra de nuvem, SCL 8 = Nuvem média probabilidade, SCL 9 = Nuvem alta, SCL 10 = Cirrus
    const isCloudOrShadow = [3, 8, 9, 10].includes(sclClassificacao);
    const pixelValidoSemNuvem = !isCloudOrShadow;

    let classificacaoSclNome = 'VEGETACAO';
    if (sclClassificacao === 3) classificacaoSclNome = 'SOMBRA_DE_NUVEM';
    else if (sclClassificacao === 8 || sclClassificacao === 9) classificacaoSclNome = 'COBERTURA_DE_NUVEM';
    else if (sclClassificacao === 5) classificacaoSclNome = 'SOLO_EXPOSTO';

    // 2. NDVI = (NIR - RED) / (NIR + RED)
    const denominadorNdvi = b08Nir + b04Vermelho;
    const ndvi = denominadorNdvi !== 0
      ? Number(((b08Nir - b04Vermelho) / denominadorNdvi).toFixed(4))
      : 0;

    // 3. NDWI = (NIR - SWIR) / (NIR + SWIR) (Gao, 1996 - Teor de água na folha)
    const denominadorNdwi = b08Nir + b11Swir;
    const ndwi = denominadorNdwi !== 0
      ? Number(((b08Nir - b11Swir) / denominadorNdwi).toFixed(4))
      : 0;

    // 4. EVI = 2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1)) (Huete et al., 2002)
    const denominadorEvi = b08Nir + 6 * b04Vermelho - 7.5 * b02Azul + 1;
    const evi = denominadorEvi !== 0
      ? Number((2.5 * ((b08Nir - b04Vermelho) / denominadorEvi)).toFixed(4))
      : 0;

    // 5. Interpretação Agronômica de Vigor de Biomassa
    let biomassaStatus: 'MUITO_ALTA' | 'ALTA' | 'MEDIA' | 'BAIXA' | 'SOLO_EXPOSTO' = 'BAIXA';
    if (ndvi >= 0.75) {
      biomassaStatus = 'MUITO_ALTA';
    } else if (ndvi >= 0.60) {
      biomassaStatus = 'ALTA';
    } else if (ndvi >= 0.40) {
      biomassaStatus = 'MEDIA';
    } else if (ndvi >= 0.20) {
      biomassaStatus = 'BAIXA';
    } else {
      biomassaStatus = 'SOLO_EXPOSTO';
    }

    // 6. Interpretação de Estresse Hídrico via NDWI
    let estresseHidricoStatus: 'SEM_ESTRESSE' | 'LEVE' | 'MODERADO' | 'SEVERO' = 'SEM_ESTRESSE';
    if (ndwi >= 0.30) {
      estresseHidricoStatus = 'SEM_ESTRESSE';
    } else if (ndwi >= 0.15) {
      estresseHidricoStatus = 'LEVE';
    } else if (ndwi >= 0.0) {
      estresseHidricoStatus = 'MODERADO';
    } else {
      estresseHidricoStatus = 'SEVERO';
    }

    return {
      ndvi,
      ndwi,
      evi,
      biomassaStatus,
      estresseHidricoStatus,
      pixelValidoSemNuvem,
      classificacaoSclNome
    };
  }
}
