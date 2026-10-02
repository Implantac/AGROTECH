-- ============================================================================
-- AGROTECH ENTERPRISE v9.5 - MIGRATION 002
-- Extensões: Barter & CPR Eletrônica B3, Frete Rodoviário ANTT,
-- Manejo Hídrico FAO-56, Laudos Laboratoriais de Solo e Fila Outbox
-- ============================================================================

-- 1. CONTRATOS DE BARTER & CÉDULAS DE PRODUTO RURAL (CPR - LEI 13.986/2020)
CREATE TABLE IF NOT EXISTS contratos_barter_cpr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_agricolas(id) ON DELETE CASCADE,
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE RESTRICT,
    numero_contrato VARCHAR(50) NOT NULL UNIQUE,
    cpr_identificador_b3 VARCHAR(60),
    comprador_trading VARCHAR(150) NOT NULL,
    tipo_operacao VARCHAR(50) NOT NULL DEFAULT 'BARTER_INSUMOS', -- 'BARTER_INSUMOS', 'VENDA_FUTURA_FIXA'
    commodity VARCHAR(100) NOT NULL DEFAULT 'SOJA_EM_GRAO',
    safra_ano VARCHAR(20) NOT NULL,
    quantidade_sacas_60kg NUMERIC(12,2) NOT NULL,
    preco_travado_unitario_saca NUMERIC(10,2) NOT NULL,
    valor_total_contrato_reais NUMERIC(14,2) NOT NULL,
    sacas_entregues NUMERIC(12,2) DEFAULT 0.0,
    area_penhor_hectares NUMERIC(10,2),
    matricula_cri VARCHAR(120),
    data_limite_entrega DATE NOT NULL,
    local_entrega_armazem VARCHAR(200) NOT NULL,
    status_liquidacao VARCHAR(30) DEFAULT 'ABERTO', -- 'ABERTO', 'ENTREGA_PARCIAL', 'LIQUIDADO', 'INADIMPLENTE'
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_barter_empresa ON contratos_barter_cpr(empresa_id);
CREATE INDEX IF NOT EXISTS idx_barter_safra ON contratos_barter_cpr(safra_ano);

-- 2. VIAGENS DE FRETE RODOVIÁRIO & MDF-e (LEI 13.703/2018 ANTT)
CREATE TABLE IF NOT EXISTS viagens_frete_mdfe (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_agricolas(id) ON DELETE CASCADE,
    fazenda_origem_id UUID NOT NULL REFERENCES fazendas(id),
    numero_mdfe VARCHAR(20) NOT NULL,
    chave_acesso_mdfe VARCHAR(44) NOT NULL UNIQUE,
    protocolo_autorizacao VARCHAR(30),
    tipo_veiculo VARCHAR(50) NOT NULL, -- 'RODOTREM_9_EIXOS', 'BITREM_7_EIXOS', etc.
    quantidade_eixos INT NOT NULL,
    placa_cavalo VARCHAR(10) NOT NULL,
    placa_carreta_1 VARCHAR(10),
    placa_carreta_2 VARCHAR(10),
    motorista_nome VARCHAR(150) NOT NULL,
    motorista_cpf VARCHAR(14) NOT NULL,
    transportadora_nome VARCHAR(150) NOT NULL,
    transportadora_cnpj VARCHAR(18),
    rntrc VARCHAR(20),
    ciot VARCHAR(20),
    rota_destino VARCHAR(200) NOT NULL,
    distancia_km NUMERIC(8,2) NOT NULL,
    peso_carga_toneladas NUMERIC(8,2) NOT NULL,
    peso_liquido_quilos NUMERIC(10,2),
    tarifa_custo_km NUMERIC(8,2) NOT NULL,
    valor_pedagio_obrigatorio NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    valor_total_frete_reais NUMERIC(12,2) NOT NULL,
    piso_minimo_antt_calculado NUMERIC(12,2) NOT NULL,
    conformidade_antt BOOLEAN NOT NULL DEFAULT TRUE,
    status_viagem VARCHAR(30) DEFAULT 'EM_TRANSITO', -- 'EM_TRANSITO', 'ENCERRADO', 'CANCELADO'
    data_emissao TIMESTAMPTZ DEFAULT NOW(),
    data_encerramento TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_frete_chave_mdfe ON viagens_frete_mdfe(chave_acesso_mdfe);
CREATE INDEX IF NOT EXISTS idx_frete_placa ON viagens_frete_mdfe(placa_cavalo);

-- 3. MONITORAMENTO DE PIVÔS DE IRRIGAÇÃO & BALANÇO HÍDRICO FAO-56
CREATE TABLE IF NOT EXISTS pivos_irrigacao_leituras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    pivo_codigo VARCHAR(50) NOT NULL,
    area_irrigada_hectares NUMERIC(8,2) NOT NULL,
    vazao_nominal_m3_hora NUMERIC(8,2) NOT NULL,
    potencia_motores_cv NUMERIC(6,2) NOT NULL,
    data_leitura DATE NOT NULL,
    eto_referencia_mm_dia NUMERIC(5,2) NOT NULL,
    kc_cultura NUMERIC(4,2) NOT NULL,
    etc_consumo_mm_dia NUMERIC(5,2) NOT NULL,
    precipitacao_efetiva_mm NUMERIC(5,2) DEFAULT 0.0,
    lamina_liquida_mm NUMERIC(5,2) NOT NULL,
    lamina_bruta_mm NUMERIC(5,2) NOT NULL,
    horas_operacao NUMERIC(5,1) NOT NULL,
    volume_total_m3 NUMERIC(10,2) NOT NULL,
    operou_horario_noturno BOOLEAN DEFAULT TRUE,
    custo_energia_reais NUMERIC(10,2) NOT NULL,
    economia_noturna_reais NUMERIC(10,2) DEFAULT 0.0,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pivo_data ON pivos_irrigacao_leituras(pivo_codigo, data_leitura);

-- 4. LAUDOS LABORATORIAIS DE SOLO & RECOMENDAÇÕES DE CORREÇÃO
CREATE TABLE IF NOT EXISTS laudos_analise_solo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talhao_id UUID NOT NULL REFERENCES talhoes(id) ON DELETE CASCADE,
    codigo_amostra VARCHAR(50) NOT NULL,
    laboratorio_nome VARCHAR(150),
    data_coleta DATE NOT NULL,
    profundidade_camada VARCHAR(20) NOT NULL, -- '0_20', '20_40'
    ph_cacl2 NUMERIC(4,2) NOT NULL,
    materia_organica_g_dm3 NUMERIC(5,2) NOT NULL,
    fosforo_mg_dm3 NUMERIC(6,2) NOT NULL,
    potassio_cmolc_dm3 NUMERIC(5,3) NOT NULL,
    calcio_cmolc_dm3 NUMERIC(5,2) NOT NULL,
    magnesio_cmolc_dm3 NUMERIC(5,2) NOT NULL,
    aluminio_cmolc_dm3 NUMERIC(5,2) NOT NULL,
    h_mais_al_cmolc_dm3 NUMERIC(5,2) NOT NULL,
    argila_percentual NUMERIC(5,2) NOT NULL,
    soma_bases_sb NUMERIC(5,2) NOT NULL,
    ctc_efetiva_t NUMERIC(5,2) NOT NULL,
    ctc_ph7_t NUMERIC(5,2) NOT NULL,
    saturacao_bases_v1_pct NUMERIC(5,2) NOT NULL,
    saturacao_aluminio_m_pct NUMERIC(5,2) NOT NULL,
    saturacao_alvo_v2_pct NUMERIC(5,2) NOT NULL,
    prnt_calcario_pct NUMERIC(5,2) NOT NULL,
    necessidade_calagem_ton_ha NUMERIC(6,2) NOT NULL,
    necessidade_gessagem_kg_ha NUMERIC(8,2) NOT NULL,
    alerta_toxidez_aluminio BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_laudo_talhao ON laudos_analise_solo(talhao_id, data_coleta);

-- 5. TABELA DE FILA OUTBOX (MENSAGERIA ASSÍNCRONA RESILIENTE)
CREATE TABLE IF NOT EXISTS sync_outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) NOT NULL UNIQUE,
    aggregate_type VARCHAR(60) NOT NULL, -- 'OPERACAO_CAMPO', 'MIP', 'ABASTECIMENTO', 'PESAGEM'
    aggregate_id VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SYNCING', 'SYNCED', 'FAILED', 'CONFLICT'
    tentativas_envio INT DEFAULT 0,
    ultimo_erro TEXT,
    origem_dispositivo_id VARCHAR(100),
    timestamp_geracao TIMESTAMPTZ NOT NULL,
    sincronizado_em TIMESTAMPTZ,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbox_status ON sync_outbox_events(status);
