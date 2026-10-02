/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Interpretação Laboratorial de Solo & Recomendação de Calagem e Gessagem
 * Métodos Oficiais: Saturação por Bases (V%), Demattê, Sousa & Lobato (Embrapa Cerrados)
 */

export interface LaudoLaboratorioSolo {
  identificadorAmostra: string;
  talhaoId: string;
  profundidadeCm: '0_20' | '20_40';
  phCacl2: number;         // pH em CaCl2 (ex: 4.8)
  materiaOrganicaGdm3: number; // M.O. em g/dm³ (ex: 28.0)
  fosforoMgdm3: number;    // P Mehlich-1 ou Resina em mg/dm³ (ex: 6.5)
  potassioCmolcdm3: number;// K trocável em cmolc/dm³ (ex: 0.18)
  calcioCmolcdm3: number;  // Ca trocável em cmolc/dm³ (ex: 1.80)
  magnesioCmolcdm3: number;// Mg trocável em cmolc/dm³ (ex: 0.70)
  aluminioCmolcdm3: number;// Al trocável em cmolc/dm³ (ex: 0.45)
  hMaisAlCmolcdm3: number; // Acidez potencial H+Al em cmolc/dm³ (ex: 4.20)
  argilaPct: number;       // Teor de argila em % (ex: 38%)
}

export interface ParametrosRecomendacaoCalagem {
  saturacaoBasesAlvoV2Pct: number; // V2% desejado (ex: 70% para soja/milho/algodão, 60% para café/pastagem)
  prntCalcarioPct: number;         // Poder Relativo de Neutralização Total do calcário (ex: 85%)
}

export interface ResultadoFertilidadeSolo {
  identificadorAmostra: string;
  somaBasesSB: number;             // SB = Ca + Mg + K (cmolc/dm³)
  ctcEfetivaT: number;             // t = SB + Al (cmolc/dm³)
  ctcPh7T: number;                 // T = SB + (H + Al) (cmolc/dm³)
  saturacaoBasesV1Pct: number;     // V1% = (SB / T) * 100
  saturacaoAluminioMPct: number;   // m% = (Al / t) * 100
  necessidadeCalagemTonHa: number; // NC (t/ha) para atingir V2%
  necessidadeGessoKgHa: number;    // NG (kg/ha) para condicionamento subsuperficial
  classificacaoAcidez: 'MUITO_ALTA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  alertaToxidezAluminio: boolean;
}

export class AnaliseSoloRecomendacaoService {
  /**
   * Interpreta o laudo analítico e calcula índices químicos de fertilidade e correções
   */
  public interpretarECalcularRecomendacoes(
    laudo: LaudoLaboratorioSolo,
    parametros: ParametrosRecomendacaoCalagem
  ): ResultadoFertilidadeSolo {
    const {
      calcioCmolcdm3,
      magnesioCmolcdm3,
      potassioCmolcdm3,
      aluminioCmolcdm3,
      hMaisAlCmolcdm3,
      argilaPct,
      phCacl2
    } = laudo;

    // 1. Soma de Bases (SB = Ca + Mg + K)
    const somaBasesSB = Number((calcioCmolcdm3 + magnesioCmolcdm3 + potassioCmolcdm3).toFixed(2));

    // 2. Capacidade de Troca Catiônica Efetiva (t = SB + Al)
    const ctcEfetivaT = Number((somaBasesSB + aluminioCmolcdm3).toFixed(2));

    // 3. Capacidade de Troca Catiônica a pH 7.0 (T = SB + (H + Al))
    const ctcPh7T = Number((somaBasesSB + hMaisAlCmolcdm3).toFixed(2));

    // 4. Saturação por Bases Atual (V1% = (SB / T) * 100)
    const saturacaoBasesV1Pct = ctcPh7T > 0
      ? Number(((somaBasesSB / ctcPh7T) * 100).toFixed(1))
      : 0;

    // 5. Saturação por Alumínio (m% = (Al / t) * 100)
    const saturacaoAluminioMPct = ctcEfetivaT > 0
      ? Number(((aluminioCmolcdm3 / ctcEfetivaT) * 100).toFixed(1))
      : 0;

    // 6. Necessidade de Calagem (NC) pelo Método da Saturação por Bases
    // NC (t/ha) = ((V2 - V1) * T) / PRNT
    let necessidadeCalagemTonHa = 0;
    if (parametros.saturacaoBasesAlvoV2Pct > saturacaoBasesV1Pct && parametros.prntCalcarioPct > 0) {
      const deltaV = parametros.saturacaoBasesAlvoV2Pct - saturacaoBasesV1Pct;
      necessidadeCalagemTonHa = Number(
        (((deltaV * ctcPh7T) / parametros.prntCalcarioPct)).toFixed(2)
      );
    }

    // 7. Necessidade de Gessagem (NG) segundo Sousa & Lobato (Embrapa Cerrados):
    // Para culturas anuais: NG (kg/ha) = 50 * Argila (%)
    // Aplicável quando em 20-40cm: Ca < 0.5 cmolc/dm³ ou Al > 0.5 cmolc/dm³ ou m% > 20%
    const necessidadeGessoKgHa = Math.round(50 * argilaPct);

    // 8. Classificação técnica de acidez do solo
    let classificacaoAcidez: 'MUITO_ALTA' | 'ALTA' | 'MEDIA' | 'BAIXA' = 'MEDIA';
    if (phCacl2 < 4.5) {
      classificacaoAcidez = 'MUITO_ALTA';
    } else if (phCacl2 <= 5.0) {
      classificacaoAcidez = 'ALTA';
    } else if (phCacl2 <= 5.5) {
      classificacaoAcidez = 'MEDIA';
    } else {
      classificacaoAcidez = 'BAIXA';
    }

    // Alerta de toxidez por alumínio trocável (m% > 15% ou Al > 0.3 cmolc/dm³)
    const alertaToxidezAluminio = saturacaoAluminioMPct > 15.0 || aluminioCmolcdm3 > 0.3;

    return {
      identificadorAmostra: laudo.identificadorAmostra,
      somaBasesSB,
      ctcEfetivaT,
      ctcPh7T,
      saturacaoBasesV1Pct,
      saturacaoAluminioMPct,
      necessidadeCalagemTonHa,
      necessidadeGessoKgHa,
      classificacaoAcidez,
      alertaToxidezAluminio
    };
  }
}
