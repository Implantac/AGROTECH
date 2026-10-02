/**
 * AGROTECH ENTERPRISE v9.5 - CORE ERP
 * Decodificador de Telemetria CAN Bus SAE J1939 / ISOBUS 11783
 * Decodificação de PGNs de motor, transmissão e pulverização em frotas mistas
 * (John Deere, Case IH, New Holland, Valtra, Massey Ferguson, Jacto)
 */

export interface CanFrame {
  canId: number;        // Identificador CAN de 29 bits (Extended Frame)
  data: number[];       // Array de 8 bytes [D0, D1, D2, D3, D4, D5, D6, D7]
  timestampMs: number;
}

export interface TelemetriaDecodificada {
  pgn: number;
  descricaoPgn: string;
  rpmMotor?: number;
  velocidadeKmH?: number;
  consumoCombustivelLPorHora?: number;
  temperaturaLiquidoArrefecimentoC?: number;
  pressaoOleoMotorKpa?: number;
  vazaoPulverizacaoLPorMinuto?: number;
  nivelTanqueCombustivelPct?: number;
}

export class CanBusJ1939DecoderService {
  /**
   * Extrai o PGN (Parameter Group Number) a partir do CAN-ID de 29 bits
   * Bitmask: (CAN_ID >> 8) & 0x3FFFF
   */
  public static extrairPgn(canId: number): number {
    const dpAndPfAndPs = (canId >> 8) & 0x3ffff;
    const pf = (dpAndPfAndPs >> 8) & 0xff;
    const ps = dpAndPfAndPs & 0xff;

    // Se PF < 240, PS é endereço de destino (PDU1) e PGN = PF << 8
    // Se PF >= 240, PS é extensão do grupo (PDU2) e PGN = (PF << 8) | PS
    if (pf < 240) {
      return (dpAndPfAndPs & 0x010000) | (pf << 8);
    }
    return dpAndPfAndPs;
  }

  /**
   * Decodifica o quadro CAN Bus J1939 para métricas agrícolas
   */
  public decodificarQuadro(frame: CanFrame): TelemetriaDecodificada {
    const pgn = CanBusJ1939DecoderService.extrairPgn(frame.canId);
    const d = frame.data;

    // PGN 61444 (0xF004) - EEC1 (Electronic Engine Controller 1) -> RPM do Motor
    if (pgn === 61444 && d.length >= 8) {
      // Bytes 3 e 4 (índices 3 e 4): Engine Speed (Resolução 0.125 rpm/bit)
      const rawRpm = d[3] | (d[4] << 8);
      const rpmMotor = Number((rawRpm * 0.125).toFixed(0));

      return {
        pgn,
        descricaoPgn: 'EEC1_ROTAÇÃO_MOTOR_RPM',
        rpmMotor
      };
    }

    // PGN 65266 (0xFEF2) - LFE (Fuel Economy) -> Consumo de Combustível em L/h
    if (pgn === 65266 && d.length >= 8) {
      // Bytes 0 e 1 (índices 0 e 1): Engine Fuel Rate (Resolução 0.05 L/h por bit)
      const rawFuelRate = d[0] | (d[1] << 8);
      const consumoCombustivelLPorHora = Number((rawFuelRate * 0.05).toFixed(2));

      return {
        pgn,
        descricaoPgn: 'LFE_CONSUMO_COMBUSTIVEL_L_H',
        consumoCombustivelLPorHora
      };
    }

    // PGN 65265 (0xFEF1) - CCVS (Cruising Speed) -> Velocidade de Deslocamento
    if (pgn === 65265 && d.length >= 8) {
      // Bytes 1 e 2: Wheel-Based Vehicle Speed (Resolução 1/256 km/h por bit)
      const rawSpeed = d[1] | (d[2] << 8);
      const velocidadeKmH = Number((rawSpeed / 256.0).toFixed(2));

      return {
        pgn,
        descricaoPgn: 'CCVS_VELOCIDADE_DESLOCAMENTO_KM_H',
        velocidadeKmH
      };
    }

    // PGN 65262 (0xFEEE) - ET1 (Engine Temperature 1) -> Temperatura do Motor
    if (pgn === 65262 && d.length >= 8) {
      // Byte 0: Engine Coolant Temperature (Resolução 1°C/bit, Offset -40°C)
      const temperaturaLiquidoArrefecimentoC = d[0] - 40;

      return {
        pgn,
        descricaoPgn: 'ET1_TEMPERATURA_MOTOR_C',
        temperaturaLiquidoArrefecimentoC
      };
    }

    // PGN 65276 (0xFEFC) - DD (Dash Display) -> Nível do Tanque de Diesel
    if (pgn === 65276 && d.length >= 8) {
      // Byte 1: Fuel Level (Resolução 0.4% por bit)
      const nivelTanqueCombustivelPct = Number((d[1] * 0.4).toFixed(1));

      return {
        pgn,
        descricaoPgn: 'DD_NIVEL_TANQUE_DIESEL_PCT',
        nivelTanqueCombustivelPct
      };
    }

    return {
      pgn,
      descricaoPgn: `PGN_GENÉRICO_${pgn}`
    };
  }
}
