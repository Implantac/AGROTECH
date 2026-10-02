import { createServer } from 'vite';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

async function verifyAllModules() {
  console.log('Iniciando verificação de renderização de todos os módulos...');
  const server = await createServer({
    root: '/home/user/agtech-platform',
    configFile: '/home/user/agtech-platform/vite.config.ts',
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { ALL_MODULES } = await server.ssrLoadModule('/src/components/QuickAccessModal.tsx');
  console.log(`Carregados ${ALL_MODULES.length} módulos da definição ALL_MODULES.`);

  const appModule = await server.ssrLoadModule('/src/App.tsx');
  console.log('App.tsx carregado no SSR.');

  let successCount = 0;
  const errors = [];

  // Lista de arquivos de componentes para testar
  const fs = await import('fs');
  const path = await import('path');
  const files = fs.readdirSync('/home/user/agtech-platform/src/components')
    .filter(f => f.endsWith('.tsx') && !f.includes('QuickAccessModal') && !f.includes('AgroMap'));

  for (const file of files) {
    try {
      const mod = await server.ssrLoadModule(`/src/components/${file}`);
      const componentName = file.replace('.tsx', '');
      const Component = mod[componentName] || mod.default;

      if (!Component) {
        errors.push({ file, error: `Nenhum componente exportado com o nome ${componentName}` });
        continue;
      }

      // Renderiza o componente
      const element = React.createElement(Component);
      const html = ReactDOMServer.renderToString(element);
      if (html && html.length > 0) {
        successCount++;
      } else {
        errors.push({ file, error: 'Renderizou HTML vazio' });
      }
    } catch (err) {
      errors.push({ file, error: err.message, stack: err.stack });
    }
  }

  await server.close();

  console.log(`\n========================================`);
  console.log(`RESULTADO: ${successCount} de ${files.length} componentes renderizados com sucesso.`);
  if (errors.length > 0) {
    console.log(`ERROS ENCONTRADOS (${errors.length}):`);
    errors.forEach(e => {
      console.log(`❌ ${e.file}: ${e.error}`);
    });
  } else {
    console.log(`✅ 100% dos componentes renderizaram sem exceções!`);
  }
}

verifyAllModules().catch(err => {
  console.error('Falha geral no teste:', err);
  process.exit(1);
});
