-- ============================================================================
-- SUPER AGTECH v2.0 - SCHEMA FUNDACIONAL DO BANCO DE DADOS
-- Extensões: PostGIS (SIG espacial) + UUID
-- Padrão: UUIDv7 / UUID, Custeio ABC, LCDPR Condomínio Rural, Zootecnia e Frotas
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. ESTRUTURA SOCIETÁRIA E PRODUTORES (CONDOMÍNIO RURAL)
CREATE TABLE IF NOT EXISTS empresas_agricolas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razao_social VARCHAR(150) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    inscricao_estadual VARCHAR(20),
    regime_tributario VARCHAR(50) DEFAULT 'LIVRO_CAIXA',
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtores_condominio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_agricolas(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(14) NOT NULL,
    percentual_participacao NUMERIC(5,2) NOT NULL CHECK (percentual_participacao > 0 AND percentual_participacao <= 100),
    titular_principal BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FAZENDAS, SAFRAS E TALHÕES GEORREFERENCIADOS
CREATE TABLE IF NOT EXISTS fazendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_agricolas(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    numero_car VARCHAR(100),
    municipio_ibge VARCHAR(7) NOT NULL,
    uf CHAR(2) NOT NULL,
    area_total_hectares NUMERIC(10,2) NOT NULL,
    geom GEOMETRY(MultiPolygon, 4326),
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS safras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    nome VARCHAR(50) NOT NULL,
    tipo_cultura VARCHAR(50) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    meta_produtividade_sc_ha NUMERIC(6,2),
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS talhoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    safra_id UUID NOT NULL REFERENCES safras(id) ON DELETE RESTRICT,
    codigo_identificador VARCHAR(50) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    area_hectares NUMERIC(10,2) NOT NULL,
    cultura_atual VARCHAR(50) NOT NULL,
    variedade VARCHAR(50),
    data_plantio DATE,
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    status_operacional VARCHAR(30) DEFAULT 'PLANTADO', -- 'PREPARO', 'PLANTADO', 'PULVERIZADO', 'COLHIDO'
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_talhoes_geom ON talhoes USING GIST(geom);

-- 3. MÁQUINAS, IMPLEMENTOS E FROTA
CREATE TABLE IF NOT EXISTS maquinas_frota (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'TRATOR', 'COLHEITADEIRA', 'PULVERIZADOR', 'CAMINHAO'
    modelo VARCHAR(100),
    ano_fabricacao INT,
    horimetro_atual NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    custo_hora_estimado NUMERIC(10,2) NOT NULL, -- Depreciação + Manutenção
    consumo_diesel_medio_lh NUMERIC(6,2) DEFAULT 18.5,
    ativo BOOLEAN DEFAULT TRUE
);

-- 4. ALMOXARIFADO E CUSTO MÉDIO PONDERADO MÓVEL
CREATE TABLE IF NOT EXISTS insumos_estoque (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    nome_comercial VARCHAR(150) NOT NULL,
    principio_ativo VARCHAR(150),
    categoria VARCHAR(50) NOT NULL, -- 'SEMENTE', 'DEFENSIVO', 'FERTILIZANTE', 'COMBUSTIVEL'
    unidade_medida VARCHAR(10) NOT NULL,
    quantidade_saldo NUMERIC(14,4) NOT NULL DEFAULT 0.0000,
    custo_medio_unitario NUMERIC(12,4) NOT NULL DEFAULT 0.0000,
    estoque_minimo NUMERIC(12,2) DEFAULT 0.00,
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lotes_insumos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insumo_id UUID NOT NULL REFERENCES insumos_estoque(id) ON DELETE CASCADE,
    numero_lote VARCHAR(50) NOT NULL,
    data_validade DATE,
    germina_vigor_pct NUMERIC(5,2),
    saldo_lote NUMERIC(14,4) NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APONTAMENTOS DE CAMPO E CUSTOS ABC
CREATE TABLE IF NOT EXISTS operacoes_campo (
    id UUID PRIMARY KEY, -- Gerado no Mobile como UUIDv7
    talhao_id UUID NOT NULL REFERENCES talhoes(id) ON DELETE RESTRICT,
    maquina_id UUID REFERENCES maquinas_frota(id),
    operador_id VARCHAR(100) NOT NULL,
    tipo_operacao VARCHAR(50) NOT NULL, -- 'PLANTIO', 'PULVERIZACAO', 'ADUBACAO', 'COLHEITA'
    horimetro_inicial NUMERIC(10,2),
    horimetro_final NUMERIC(10,2),
    horas_trabalhadas NUMERIC(6,2),
    
    -- Condições Meteorológicas da Aplicação
    temperatura_celsius NUMERIC(4,1),
    umidade_relativa_pct NUMERIC(4,1),
    velocidade_vento_kmh NUMERIC(4,1),
    
    -- Custo Baseado em Atividades (ABC)
    custo_total_insumos NUMERIC(12,2) DEFAULT 0.00,
    custo_total_maquina NUMERIC(12,2) DEFAULT 0.00,
    custo_total_mao_de_obra NUMERIC(12,2) DEFAULT 0.00,
    custo_total_operacao NUMERIC(12,2) DEFAULT 0.00,
    
    data_hora_inicio TIMESTAMPTZ NOT NULL,
    data_hora_fim TIMESTAMPTZ NOT NULL,
    sincronizado_em TIMESTAMPTZ DEFAULT NOW(),
    device_local_timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS operacao_itens_insumo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operacao_id UUID NOT NULL REFERENCES operacoes_campo(id) ON DELETE CASCADE,
    insumo_id UUID NOT NULL REFERENCES insumos_estoque(id) ON DELETE RESTRICT,
    lote_id UUID REFERENCES lotes_insumos(id),
    ordem_mistura_tanque INT,
    dose_por_hectare NUMERIC(10,4) NOT NULL,
    quantidade_total_consumida NUMERIC(14,4) NOT NULL,
    custo_unitario_aplicado NUMERIC(12,4) NOT NULL,
    custo_total_item NUMERIC(12,2) NOT NULL
);

-- 6. MONITORAMENTO FITOSSANITÁRIO (HEATMAP)
CREATE TABLE IF NOT EXISTS monitoramento_pragas (
    id UUID PRIMARY KEY, -- UUIDv7
    talhao_id UUID NOT NULL REFERENCES talhoes(id) ON DELETE RESTRICT,
    tecnico_id VARCHAR(100) NOT NULL,
    alvo_biologico VARCHAR(100) NOT NULL,
    tipo_alvo VARCHAR(30) NOT NULL, -- 'PRAGA', 'DOENCA', 'DANINHA'
    nivel_dano VARCHAR(20) NOT NULL, -- 'BAIXO', 'MEDIO', 'CRITICO'
    contagem_amostragem NUMERIC(8,2),
    foto_url_1 TEXT,
    localizacao GEOMETRY(Point, 4326) NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    device_local_timestamp TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_monitoramento_pragas_loc ON monitoramento_pragas USING GIST(localizacao);

-- 7. REBANHO E ZOOTECNIA COM CARÊNCIA SANITÁRIA
CREATE TABLE IF NOT EXISTS animais_rebanho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    brinco_visual VARCHAR(20) NOT NULL,
    brinco_eletronico_rfid VARCHAR(30) UNIQUE,
    raca VARCHAR(50) NOT NULL,
    categoria VARCHAR(30) NOT NULL, -- 'BEZERRO', 'GARROTE', 'NOVILHA', 'BOI_GORDO', 'MATRIZ'
    data_nascimento DATE,
    peso_atual_kg NUMERIC(6,2) NOT NULL,
    gmd_diario_kg NUMERIC(4,3) DEFAULT 0.000,
    lote_pasto VARCHAR(50) NOT NULL,
    status_sanitario VARCHAR(30) DEFAULT 'LIBERADO', -- 'LIBERADO', 'EM_CARENCIA'
    carencia_ate_data DATE,
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REGISTROS FISCAIS RURAIS (LCDPR)
CREATE TABLE IF NOT EXISTS registros_lcdpr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fazenda_id UUID NOT NULL REFERENCES fazendas(id) ON DELETE CASCADE,
    data_lancamento DATE NOT NULL,
    tipo_documento VARCHAR(2) NOT NULL, -- '1'=NF, '2'=Fatura, '3'=Recibo, etc
    numero_documento VARCHAR(50) NOT NULL,
    historico_padrao VARCHAR(255) NOT NULL,
    cpf_cnpj_participante VARCHAR(14) NOT NULL,
    tipo_lancamento VARCHAR(2) NOT NULL, -- '1'=Receita, '2'=Despesa Custeio, '3'=Investimento
    valor_total NUMERIC(12,2) NOT NULL,
    conta_bancaria VARCHAR(20) NOT NULL,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);
