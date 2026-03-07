<!-- README gerado automaticamente: versão detalhada para uso no repositório -->

# ProjectCypressJS

[![CI](https://github.com/brunorabelosimoes/ProjectCypressJS/actions/workflows/cypress.yml/badge.svg)](https://github.com/brunorabelosimoes/ProjectCypressJS/actions/workflows/cypress.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14-brightgreen?logo=node.js)](https://nodejs.org/)
[![Cypress](https://img.shields.io/badge/cypress-15.x-brightgreen?logo=cypress)](https://www.cypress.io/)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/brunorabelosimoes/ProjectCypressJS)](https://github.com/brunorabelosimoes/ProjectCypressJS/commits/main)
[![GitHub Stars](https://img.shields.io/github/stars/brunorabelosimoes/ProjectCypressJS?style=social)](https://github.com/brunorabelosimoes/ProjectCypressJS/stargazers)

Automação de testes end-to-end com Cypress para a aplicação OrangeHRM (exemplos, boas práticas e geração de evidências em PDF).

> **Quer experimentar?** &nbsp;[▶ Ver execuções do CI](https://github.com/brunorabelosimoes/ProjectCypressJS/actions/workflows/cypress.yml) &nbsp;·&nbsp; [⭐ Dar uma estrela](https://github.com/brunorabelosimoes/ProjectCypressJS/stargazers) &nbsp;·&nbsp; [🐛 Abrir issue](https://github.com/brunorabelosimoes/ProjectCypressJS/issues/new)

Status: **Refatorado** — estrutura padrão de Page Objects, dados centralizados e comandos customizados.

Conteúdo deste README:

- Visão geral do projeto
- Requisitos e instalação
- Scripts importantes (como executar testes e gerar relatórios)
- Estrutura do repositório e principais arquivos
- Como contribuir, rodar localmente e debugging

---

## Requisitos

- Node.js (>= 14)
- npm (ou yarn)
- Dependências do projeto (instalar via `npm install`)

Instalação das dependências:

```bash
npm install
```

---

## Scripts úteis

Os scripts disponíveis (definidos em `package.json`):

- `npm run cy:open` — abre a UI do Cypress
- `npm run cy:run` — executa os testes headless
- `npm run cy:run:report` — executa os testes e gera relatórios mochawesome (JSON)
- `npm run report:merge` — mescla relatórios JSON gerados pelo mochawesome
- `npm run report:generate` — gera o relatório HTML a partir do JSON mesclado
- `npm test` — alias para `npm run cy:run`

Exemplo: executar testes com relatório

```bash
npm run cy:run:report
npm run report:merge
npm run report:generate
```

---

## Estrutura do repositório (resumo)

- `docs/` — toda a documentação do projeto ([INDEX.md](docs/INDEX.md) como ponto de entrada)
- `cypress/` — testes, páginas (Page Objects), configuração e evidências
  - `cypress/assets/` — assets estáticos (ex: `logo.png` para a capa do PDF)
  - `cypress/config/testData.js` — dados centralizados (usuários, timeouts, etc.)
  - `cypress/pages/` — Page Objects (ex: `basePage.js`, `loginPage.js`, `dashboardPage.js`)
  - `cypress/e2e/` — especificações de teste (`*.cy.js`, `*.feature`)
  - `cypress/support/commands.js` — comandos customizados
- `cypress/reports/` — relatórios mochawesome
- `evidences/` — evidências geradas (PDFs, screenshots organizadas)

---

## Como rodar localmente

1. Instale dependências: `npm install`
2. Abra a UI para desenvolvimento: `npm run cy:open`
3. Para execução headless (CI): `npm test` ou `npm run cy:run`

Variáveis de ambiente (opcional):

- `BASE_URL` — URL alvo para os testes (caso queira sobrescrever o valor padrão)
- `CI` — marcardor de ambiente de CI (ex.: `CI=true npm test`)

---

## Geração de evidências

O projeto inclui um gerador de evidências completo que cria PDFs com capa profissional automaticamente.

- Screenshots temporários: `cypress/screenshots/temp/` durante a execução
- PDFs finais: `evidences/<nome-da-suite>/` (organizados por suíte)
- Logo personalizada: `cypress/assets/logo.png`

Documentação completa: [`docs/Evidences-Generator.md`](docs/Evidences-Generator.md)

Uso rápido nos testes:
```javascript
beforeEach(() => cy.startEvidences());
afterEach(() => { cy.takeScreenshot('Tear Down'); cy.finishEvidences(); });
// durante o teste:
cy.takeScreenshot('Título descritivo');
```

---

## Integração Contínua (CI)

Existe um workflow de GitHub Actions em `.github/workflows/cypress.yml` — ele executa os testes no push e gera relatórios. Revise o arquivo para ajustar variáveis e segredos do repositório.

---

## Boas práticas e padrões adotados

- Page Object Model para organização de ações e seletores
- Dados centralizados em `cypress/config/testData.js`
- Comandos customizados em `cypress/support/commands.js`
- Evitar `cy.wait()` arbitrário — usar waits por condição (`waitForElement`)
- Nenhum `.only` em testes de CI
- Uso de mochawesome para relatórios consolidados

---

## Contribuindo

1. Fork ou clone o repositório
2. Crie uma branch de feature: `git checkout -b feat/minha-melhora`
3. Adicione testes e código seguindo o padrão do projeto
4. Execute `npm test` localmente
5. Abra um Pull Request descrevendo as mudanças

Sugestões de contribuição:

- Adicionar Page Objects faltantes (ex: `adminPage`, `systemUsersPage`)
- Melhorar cobertura e reduzir dependência de dados frágeis
- Integrar testes de API ou checks de acessibilidade

---

## Troubleshooting rápido

- Testes flaky: aumentar timeouts em `testData.timeout.*` e usar waits condicionais
- Falta de screenshots: confirme que `cy.startEvidences()` é chamado em `beforeEach`
- Erros de permissão ao gerar PDFs: verifique permissões da pasta `evidences/`

---

## Contato / Manutenção

Mantido por: Bruno (repositório inicial)

Para mudanças em CI ou tokens: verifique as Secrets do repositório no GitHub.

---

## Licença

Este repositório não contém uma licença explícita por padrão. Adicione um arquivo `LICENSE` se desejar um modelo de licença (MIT, Apache-2.0, etc.).

---

*(README.md atualizado automaticamente — se quiser, adapto para um README em inglês ou adiciono badges/CTA para o workflow.)*

