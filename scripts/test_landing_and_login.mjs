import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('🔍 TESTE DE VALIDAÇÃO: AGROTECH LANDING, ONBOARDING & LOGIN ENTERPRISE');
console.log('================================================================');

// 1. Verificar integridade e estrutura dos arquivos
const landingPath = path.resolve('/home/user/agtech-platform/src/components/PublicLandingPage.tsx');
const loginPath = path.resolve('/home/user/agtech-platform/src/components/LoginScreen.tsx');
const onboardingPath = path.resolve('/home/user/agtech-platform/src/components/RegisterOnboardingScreen.tsx');
const appPath = path.resolve('/home/user/agtech-platform/src/App.tsx');

if (!fs.existsSync(landingPath)) {
  console.error('❌ PublicLandingPage.tsx não encontrado!');
  process.exit(1);
}
console.log('✓ PublicLandingPage.tsx encontrado com sucesso.');

if (!fs.existsSync(loginPath)) {
  console.error('❌ LoginScreen.tsx não encontrado!');
  process.exit(1);
}
console.log('✓ LoginScreen.tsx encontrado com sucesso.');

if (!fs.existsSync(onboardingPath)) {
  console.error('❌ RegisterOnboardingScreen.tsx não encontrado!');
  process.exit(1);
}
console.log('✓ RegisterOnboardingScreen.tsx encontrado com sucesso.');

// 2. Verificar posicionamento e requisitos da Landing Page
const landingContent = fs.readFileSync(landingPath, 'utf8');

const requiredLandingSnippets = [
  'O sistema operacional da empresa rural',
  'A inteligência que conecta toda a sua operação agrícola',
  'Gestão agrícola, máquinas, produção, custos, estoque, mercado, financeiro e inteligência em uma única plataforma',
  'START',
  'PROFESSIONAL',
  'ENTERPRISE',
  'Sua operação já é grande demais para depender de planilhas',
  'Quanto custou produzir cada saca neste talhão?',
  'Minhas máquinas estão trabalhando ou paradas agora?',
  'Qual é o meu resultado financeiro real consolidado?',
  'Quando e quanto devo vender da minha produção futura?',
  'onGoToLogin',
  'onGoToRegister',
  'onEnterPlatformDirectly'
];

for (const snippet of requiredLandingSnippets) {
  if (!landingContent.includes(snippet)) {
    console.error(`❌ Snippet obrigatório ausente em PublicLandingPage.tsx: "${snippet}"`);
    process.exit(1);
  }
}
console.log(`✓ Todos os ${requiredLandingSnippets.length} requisitos essenciais da Landing Page foram validados.`);

// 3. Verificar Onboarding Progressivo
const onboardingContent = fs.readFileSync(onboardingPath, 'utf8');
const requiredOnboardingSnippets = [
  'Acesso do Gestor',
  'Dados da Propriedade',
  'Vocação e Culturas',
  'Primeiro Talhão',
  'onRegisterSuccess',
  '/api/v1/auth/register',
  'Soja',
  'Milho'
];

for (const snippet of requiredOnboardingSnippets) {
  if (!onboardingContent.includes(snippet)) {
    console.error(`❌ Snippet obrigatório ausente em RegisterOnboardingScreen.tsx: "${snippet}"`);
    process.exit(1);
  }
}
console.log(`✓ Todos os ${requiredOnboardingSnippets.length} requisitos do Onboarding Progressivo foram validados.`);

// 4. Verificar LoginScreen
const loginContent = fs.readFileSync(loginPath, 'utf8');
const requiredLoginSnippets = [
  'Carlos Eduardo Silva',
  'Dr. Marcelo Arantes',
  'Engª Juliana Prado',
  'Valmor Bertoncelli',
  'Acesso Rápido de Demonstração',
  'onLoginSuccess',
  'onBackToLanding',
  'onGoToRegister',
  '/api/v1/auth/login'
];

for (const snippet of requiredLoginSnippets) {
  if (!loginContent.includes(snippet)) {
    console.error(`❌ Snippet obrigatório ausente em LoginScreen.tsx: "${snippet}"`);
    process.exit(1);
  }
}
console.log(`✓ Todos os ${requiredLoginSnippets.length} requisitos da Tela de Login foram validados.`);

// 5. Verificar integração no App.tsx
const appContent = fs.readFileSync(appPath, 'utf8');
const requiredAppSnippets = [
  "import { PublicLandingPage } from './components/PublicLandingPage';",
  "import { LoginScreen } from './components/LoginScreen';",
  "import { RegisterOnboardingScreen } from './components/RegisterOnboardingScreen';",
  "currentAppView === 'LANDING'",
  "currentAppView === 'REGISTER'",
  "currentAppView === 'LOGIN'",
  "handleNavigateView('LANDING')",
  "handleNavigateView('REGISTER')",
  "handleNavigateView('LOGIN')",
  "handleNavigateView('PLATFORM')"
];

for (const snippet of requiredAppSnippets) {
  if (!appContent.includes(snippet)) {
    console.error(`❌ Snippet de integração ausente em App.tsx: "${snippet}"`);
    process.exit(1);
  }
}
console.log(`✓ Integração das 4 visões no App.tsx (LANDING, REGISTER, LOGIN, PLATFORM) validada com sucesso.`);

console.log('\n================================================================');
console.log('🎉 TODOS OS TESTES DA SUÍTE DE LANDING, ONBOARDING E LOGIN APROVADOS!');
console.log('================================================================');
