#!/usr/bin/env node
/**
 * Teste de Validação do Manual de Implantação, Chicote CAN Bus e Guia do Usuário
 * Princípios 1 (Não Inventar), 4 (UX Agrícola) e 16 (Testes Obrigatórios)
 */

import fs from 'fs';
import path from 'path';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  }
  console.log(`✅ SUCESSO: ${message}`);
}

async function runTests() {
  console.log('\n🚀 Iniciando Teste de Validação do Manual de Implantação e Guia Telemático...');

  // 1. Verificação do Arquivo Físico do Manual Completo
  console.log('\n--- 1. Validação Estrutural do Documento do Manual Técnico ---');
  const manualPath = '/home/user/MANUAL_IMPLANTACAO_E_USO_AGROTECH.md';
  assert(fs.existsSync(manualPath), 'Arquivo MANUAL_IMPLANTACAO_E_USO_AGROTECH.md existe na raiz do workspace');

  const manualContent = fs.readFileSync(manualPath, 'utf8');
  assert(manualContent.length > 5000, `Manual completo possui extensão técnica substancial (${manualContent.length} bytes)`);

  // Seções Obrigatórias do Chicote CAN Bus
  assert(manualContent.includes('CONECTOR DEUTSCH 9 PINOS'), 'Diagrama e especificação do conector Deutsch HD10 presentes');
  assert(manualContent.includes('Pino A') && manualContent.includes('GND'), 'Pinagem do terra (GND Pino A) documentada');
  assert(manualContent.includes('Pino B') && manualContent.includes('VCC'), 'Pinagem da alimentação (VCC Pino B) documentada');
  assert(manualContent.includes('Pino C') && manualContent.includes('CAN_H'), 'Pinagem CAN_H (Pino C) documentada');
  assert(manualContent.includes('Pino D') && manualContent.includes('CAN_L'), 'Pinagem CAN_L (Pino D) documentada');
  assert(manualContent.includes('60 Ohms'), 'Regra técnica de terminação de barramento (60 Ohms no multímetro) documentada');
  assert(manualContent.includes('33 a 50 voltas por metro') || manualContent.includes('33 a 50 espiras por metro'), 'Exigência de par trançado documentada');
  assert(manualContent.includes('Load Dump') || manualContent.includes('Fusível'), 'Proteção elétrica contra surtos de alternador documentada');

  // Protocolo In Loco com Operadores
  assert(manualContent.includes('Protocolo de Validação e Comissionamento In Loco com Operadores'), 'Seção de comissionamento de campo com operadores presente');
  assert(manualContent.includes('PGN 61444'), 'Validação dinâmica de RPM (PGN 61444) documentada');
  assert(manualContent.includes('PGN 65263'), 'Validação dinâmica de pressão de óleo (PGN 65263) documentada');
  assert(manualContent.includes('Offline Outbox Pattern'), 'Protocolo de validação de campo offline no talhão documentado');

  // Seções de Instalação Local e Hospedagem nas Nuvens do Brasil
  assert(manualContent.includes('GUIA DE INSTALAÇÃO LOCAL E SERVIDOR ON-PREMISES NA FAZENDA'), 'Seção de instalação local na sede da fazenda documentada');
  assert(manualContent.includes('GUIA DE HOSPEDAGEM E DEPLOY NAS PRINCIPAIS NUVENS DO BRASIL'), 'Seção de hospedagem nas principais nuvens do Brasil documentada');
  assert(manualContent.includes('Locaweb') && manualContent.includes('KingHost') && manualContent.includes('HostGator Brasil'), 'Provedores nacionais de VPS cobertos');
  assert(manualContent.includes('Registro.br') && manualContent.includes('certbot'), 'Registro de domínio .com.br e SSL Nginx cobertos');

  // 2. Verificação do Componente In-App Interativo
  console.log('\n--- 2. Validação do Componente Interativo no Sistema ---');
  const modalPath = '/home/user/agtech-platform/src/components/ManualImplantacaoOperacionalModal.tsx';
  assert(fs.existsSync(modalPath), 'Componente ManualImplantacaoOperacionalModal.tsx criado com sucesso');

  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert(modalContent.includes('Vista Frontal do Conector Macho'), 'Diagrama visual do conector Deutsch incluído no componente');
  assert(modalContent.includes('Terminação de 60 Ohms'), 'Card de instrução de multímetro presente no componente');
  assert(modalContent.includes('Protocolo de Comissionamento em Campo'), 'Checklist interativo de operadores presente no componente');
  assert(modalContent.includes('Instalação Local & Nuvem Brasil'), 'Aba de instalação local e nuvem nacional presente no componente');

  // 3. Verificação do Manual Ilustrado HTML
  console.log('\n--- 3. Validação do Manual Ilustrado HTML ---');
  const htmlPath = '/home/user/MANUAL_ILUSTRADO_AGROTECH.html';
  assert(fs.existsSync(htmlPath), 'Arquivo MANUAL_ILUSTRADO_AGROTECH.html existe na raiz');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  assert(htmlContent.includes('Instalação Local (Fazenda)'), 'Manual HTML inclui guia de instalação local');
  assert(htmlContent.includes('Hospedagem Nuvem Brasil'), 'Manual HTML inclui guia de nuvem Brasil');

  // 4. Verificação da Integração no App.tsx
  console.log('\n--- 4. Validação de Integração no Layout Principal (App.tsx) ---');
  const appPath = '/home/user/agtech-platform/src/App.tsx';
  const appContent = fs.readFileSync(appPath, 'utf8');
  assert(appContent.includes('ManualImplantacaoOperacionalModal'), 'Componente do Manual importado em App.tsx');
  assert(appContent.includes('isManualModalOpen'), 'Estado isManualModalOpen gerenciado em App.tsx');
  assert(appContent.includes('Manual do Sistema'), 'Botão de acesso rápido no Topbar implementado');
  assert(appContent.includes('Manual & Implantação'), 'Botão de navegação na Left Sidebar implementado');

  console.log('\n🌟 TODOS OS TESTES DO MANUAL DE IMPLANTAÇÃO E CHICOTE TELEMÁTICO PASSARAM COM 100% DE SUCESSO!\n');
}

runTests().catch(err => {
  console.error('❌ Erro inesperado:', err);
  process.exit(1);
});
