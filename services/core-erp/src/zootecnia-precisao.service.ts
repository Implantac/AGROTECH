/**
 * SUPER AGTECH v2.0 - ZOOTECNIA DE PRECISÃO, SISBOV & CONTROLE DE CARÊNCIA
 * Gestão de confinamento e pasto, cálculo de GMD (Ganho Médio Diário),
 * rastreabilidade individual RFID e bloqueio sanitário estrito de carência medicamentosa.
 */

export interface RegistroPesagem {
  dataPesagem: string; // YYYY-MM-DD
  pesoKg: number;
}

export interface AplicacaoVeterinaria {
  id: string;
  medicamento: string;
  principioAtivo: string;
  dataAplicacao: string; // YYYY-MM-DD
  carenciaDiasAbate: number; // Dias de carência legal MAPA
  loteMedicamento: string;
  responsavelTecnicoCrmv: string;
}

export interface AnimalSisbov {
  brincoVisual: string;
  rfidEletronico: string; // Padrão ISO 11784/11785
  raca: string;
  categoria: 'BEZERRO' | 'GARROTE' | 'BOI_MAGRO' | 'NOVILHA' | 'MATRIZ';
  lotePastoId: string;
  historicoPesagens: RegistroPesagem[];
  historicoSanitario: AplicacaoVeterinaria[];
}

export interface StatusCarenciaAnimal {
  emCarencia: boolean;
  diasRestantesMaximo: number;
  dataLiberacaoAbate: string | null;
  medicamentosBloqueantes: Array<{
    medicamento: string;
    diasRestantes: number;
    dataAplicacao: string;
    dataLiberacao: string;
  }>;
}

export interface DesempenhoZootecnico {
  animalRfid: string;
  pesoInicialKg: number;
  pesoAtualKg: number;
  ganhoTotalKg: number;
  diasIntervalo: number;
  gmdKgPorDia: number; // Ganho Médio Diário
  projecaoArrobasLiquidas: number; // Rendimento de carcaça estimado (ex: 54%)
  statusSanitario: StatusCarenciaAnimal;
  aptoParaAbate: boolean;
}

export class ZootecniaPrecisaoService {
  /**
   * Avalia a conformidade sanitária de carência para uma data de referência
   */
  public verificarCarenciaSanitaria(
    historicoSanitario: AplicacaoVeterinaria[],
    dataReferencia: Date = new Date()
  ): StatusCarenciaAnimal {
    let emCarencia = false;
    let diasRestantesMaximo = 0;
    let dataLiberacaoMaisTardia: Date | null = null;
    const medicamentosBloqueantes: StatusCarenciaAnimal['medicamentosBloqueantes'] = [];

    const refTime = dataReferencia.getTime();

    for (const med of historicoSanitario) {
      if (med.carenciaDiasAbate <= 0) continue;

      const [ano, mes, dia] = med.dataAplicacao.split('-').map(Number);
      const dataAplic = new Date(Date.UTC(ano, mes - 1, dia));
      const dataFimCarencia = new Date(dataAplic.getTime() + med.carenciaDiasAbate * 24 * 60 * 60 * 1000);

      const diferencaMs = dataFimCarencia.getTime() - refTime;
      const diasRestantes = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

      if (diasRestantes > 0) {
        emCarencia = true;
        if (diasRestantes > diasRestantesMaximo) {
          diasRestantesMaximo = diasRestantes;
        }
        if (!dataLiberacaoMaisTardia || dataFimCarencia > dataLiberacaoMaisTardia) {
          dataLiberacaoMaisTardia = dataFimCarencia;
        }

        medicamentosBloqueantes.push({
          medicamento: med.medicamento,
          diasRestantes,
          dataAplicacao: med.dataAplicacao,
          dataLiberacao: dataFimCarencia.toISOString().split('T')[0],
        });
      }
    }

    return {
      emCarencia,
      diasRestantesMaximo,
      dataLiberacaoAbate: dataLiberacaoMaisTardia ? dataLiberacaoMaisTardia.toISOString().split('T')[0] : null,
      medicamentosBloqueantes,
    };
  }

  /**
   * Calcula o desempenho zootécnico (GMD, peso e arrobas) com auditoria de carência
   */
  public calcularDesempenho(
    animal: AnimalSisbov,
    dataReferencia: Date = new Date(),
    rendimentoCarcacaPct: number = 54.0 // Padrão confinamento no Brasil
  ): DesempenhoZootecnico {
    if (!animal.historicoPesagens || animal.historicoPesagens.length < 2) {
      const pesoUnico = animal.historicoPesagens?.[0]?.pesoKg || 0;
      const statusSanitario = this.verificarCarenciaSanitaria(animal.historicoSanitario, dataReferencia);
      const arrobas = Number(((pesoUnico * (rendimentoCarcacaPct / 100)) / 15).toFixed(2));

      return {
        animalRfid: animal.rfidEletronico,
        pesoInicialKg: pesoUnico,
        pesoAtualKg: pesoUnico,
        ganhoTotalKg: 0,
        diasIntervalo: 0,
        gmdKgPorDia: 0,
        projecaoArrobasLiquidas: arrobas,
        statusSanitario,
        aptoParaAbate: !statusSanitario.emCarencia && pesoUnico >= 480,
      };
    }

    // Ordenar pesagens cronologicamente
    const ordenadas = [...animal.historicoPesagens].sort(
      (a, b) => new Date(a.dataPesagem).getTime() - new Date(b.dataPesagem).getTime()
    );

    const primeira = ordenadas[0];
    const ultima = ordenadas[ordenadas.length - 1];

    const d1 = new Date(primeira.dataPesagem);
    const d2 = new Date(ultima.dataPesagem);
    const diasIntervalo = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));

    const ganhoTotalKg = Number((ultima.pesoKg - primeira.pesoKg).toFixed(2));
    const gmdKgPorDia = Number((ganhoTotalKg / diasIntervalo).toFixed(3));

    const statusSanitario = this.verificarCarenciaSanitaria(animal.historicoSanitario, dataReferencia);
    const projecaoArrobasLiquidas = Number(((ultima.pesoKg * (rendimentoCarcacaPct / 100)) / 15).toFixed(2));

    // Apto para abate exige: peso mínimo de abate (> 480kg para macho) e ZERO carência medicamentosa ativa
    const aptoParaAbate = !statusSanitario.emCarencia && ultima.pesoKg >= 480;

    return {
      animalRfid: animal.rfidEletronico,
      pesoInicialKg: primeira.pesoKg,
      pesoAtualKg: ultima.pesoKg,
      ganhoTotalKg,
      diasIntervalo,
      gmdKgPorDia,
      projecaoArrobasLiquidas,
      statusSanitario,
      aptoParaAbate,
    };
  }
}
