import { createServer } from 'vite';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';

async function verifyAllModules() {
  console.log('Iniciando verificação de renderização de todos os módulos...');
  const server = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const { ALL_MODULES } = await server.ssrLoadModule('/src/components/QuickAccessModal.tsx');
  console.log(`Carregados ${ALL_MODULES.length} módulos da lista ALL_MODULES.`);

  let successCount = 0;
  const errors = [];

  const files = fs.readdirSync('./src/components')
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

      const element = React.createElement(Component);
      const html = ReactDOMServer.renderToString(element);
      if (html && html.length > 0) {
        successCount++;
        console.log(`✓ ${componentName} renderizou (${html.length} bytes)`);
      } else {
        errors.push({ file, error: 'Renderizou HTML vazio' });
      }
    } catch (err) {
      errors.push({ file, error: err.message });
      console.log(`❌ ${file} FALHOU: ${err.message}`);
    }
  }

  await server.close();

  console.log(`\n========================================`);
  console.log(`RESULTADO: ${successCount} de ${files.length} componentes testados renderizaram.`);
  if (errors.length > 0) {
    console.log(`ERROS ENCONTRADOS (${errors.length}):`);
    errors.forEach(e => {
      console.log(`❌ ${e.file}: ${e.error}`);
    });
  } else {
    console.log(`✅ 100% dos componentes renderizaram perfeitamente!`);
  }
}

verifyAllModules().catch(err => {
  console.error('Falha geral no teste:', err);
  process.exit(1);
});
