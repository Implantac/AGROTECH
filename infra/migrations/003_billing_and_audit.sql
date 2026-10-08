-- ============================================================================
-- AGROTECH ENTERPRISE v10.0 - MIGRATION 003
-- Extensões: Faturamento SaaS (Billing), Webhooks Bancários BACEN/Gateways,
-- Matriz de Governança RBAC e Trilha de Auditoria Imutável
-- ============================================================================

-- 1. SUBSCRIÇÕES E FATURAMENTO SAAS (RECORRÊNCIA E CRÉDITO RURAL)
CREATE TABLE IF NOT EXISTS assinaturas_saas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_agricolas(id) ON DELETE CASCADE,
    plano_id VARCHAR(50) NOT NULL, -- 'STARTER', 'PRO', 'ENTERPRISE', 'COOPERATIVA'
    ciclo VARCHAR(20) NOT NULL DEFAULT 'ANNUAL', -- 'MONTHLY', 'ANNUAL'
    metodo_pagamento VARCHAR(30) NOT NULL DEFAULT 'PIX', -- 'PIX', 'CREDIT_CARD', 'BOLETO'
    valor_total NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PAGO_CONFIRMADO', -- 'PENDENTE', 'PAGO_CONFIRMADO', 'EXPIRADO', 'CANCELADO'
    txid VARCHAR(100) NOT NULL UNIQUE,
    recibo_fiscal_nfse VARCHAR(50),
    autenticacao_bancaria VARCHAR(100),
    data_inicio TIMESTAMPTZ DEFAULT NOW(),
    data_expiracao TIMESTAMPTZ,
    criado_em TIMESTAMPTZ DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assinaturas_empresa ON assinaturas_saas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_txid ON assinaturas_saas(txid);

-- 2. LOGS DE WEBHOOKS BANCÁRIOS (IDEMPOTÊNCIA E AUDITORIA DE RECONCILIAÇÃO)
CREATE TABLE IF NOT EXISTS billing_webhooks_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento VARCHAR(100) NOT NULL,
    txid VARCHAR(100),
    gateway_id VARCHAR(100),
    payload JSONB NOT NULL,
    processado BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_txid ON billing_webhooks_log(txid);

-- 3. MATRIZ DE DELEGAÇÃO DE PERMISSÕES RBAC (EXCLUSIVO SUPERADMIN)
CREATE TABLE IF NOT EXISTS rbac_permissoes_delegadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas_agricolas(id) ON DELETE CASCADE,
    usuario_id VARCHAR(100) NOT NULL,
    perfil_base VARCHAR(30) NOT NULL, -- 'PRODUTOR', 'AGRONOMO', 'OPERADOR', 'CONTADOR', 'VETERINARIO'
    modulo_id VARCHAR(50) NOT NULL,
    autorizado BOOLEAN NOT NULL DEFAULT TRUE,
    concedido_por_usuario VARCHAR(150) NOT NULL, -- 'Dr. Roberto Schneider' (Superadmin)
    justificativa TEXT,
    data_concessao TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rbac_usuario_modulo ON rbac_permissoes_delegadas(usuario_id, modulo_id);

-- 4. TRILHA DE AUDITORIA OPERACIONAL IMUTÁVEL (COMPLIANCE E FISCAL)
CREATE TABLE IF NOT EXISTS auditoria_operacional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES empresas_agricolas(id) ON DELETE SET NULL,
    usuario_nome VARCHAR(150) NOT NULL,
    usuario_perfil VARCHAR(50) NOT NULL,
    acao VARCHAR(100) NOT NULL, -- 'LOGIN', 'EMISSAO_NFE', 'EXPORTACAO_LCDPR', 'CONCESSAO_RBAC', 'CHECKOUT_SAAS'
    detalhes JSONB NOT NULL,
    ip_origem VARCHAR(45),
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_empresa ON auditoria_operacional(empresa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_acao ON auditoria_operacional(acao);
