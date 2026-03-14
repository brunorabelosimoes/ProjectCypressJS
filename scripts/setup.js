/**
 * Script de setup inicial do projeto.
 * Execute: npm run setup
 *
 * O que faz:
 *  1. Copia cypress.env.example.json → cypress.env.json (se não existir)
 *  2. Garante que as pastas essenciais existam
 */

const fs   = require('fs');
const path = require('path');

const root    = path.resolve(__dirname, '..');
const example = path.join(root, 'cypress.env.example.json');
const envFile = path.join(root, 'cypress.env.json');

// 1. Cria cypress.env.json a partir do exemplo, se ainda não esistir
if (!fs.existsSync(envFile)) {
  fs.copyFileSync(example, envFile);
  console.log('✅  cypress.env.json criado a partir do exemplo.');
  console.log('   ➜  Abra o arquivo e preencha com os valores reais antes de rodar os testes.\n');
} else {
  console.log('ℹ️   cypress.env.json já existe — nenhuma alteração feita.\n');
}

// 2. Garante existência de pastas necessárias
const dirs = [
  path.join(root, 'cypress', 'assets'),
  path.join(root, 'cypress', 'reports'),
  path.join(root, 'evidences'),
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁  Pasta criada: ${path.relative(root, dir)}`);
  }
});

console.log('\n🚀  Projeto pronto! Execute "npm run cy:open" para começar.\n');
