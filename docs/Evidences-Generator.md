# Gerador de Evidências — Documentação Completa

> **Versão atual:** 2.0 &nbsp;|&nbsp; **Framework:** Cypress &nbsp;|&nbsp; **Geração de PDF:** PDFKit

---

## 📋 Visão Geral

O Gerador de Evidências é uma ferramenta integrada ao Cypress que automatiza a captura de screenshots durante a execução dos testes e consolida tudo em um PDF profissional, com **capa detalhada** gerada automaticamente.

Cada PDF é composto por:

1. **Página de capa** — gerada automaticamente com todas as informações do teste
2. **Páginas de evidências** — um screenshot por página, com título e URL capturados

---

## 🎯 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Capa automática | Primeira página com logo, informações do teste, ambiente, browser, status e tempo de execução |
| Captura de screenshots | Screenshots ordenados e com título durante a execução |
| URL registrada | Registra a URL da página em cada screenshot |
| Status automático | Detecta se o teste **PASSOU** ou **FALHOU** automaticamente |
| Responsável detectado | Lê o usuário do sistema operacional (`os.userInfo().username`) |
| Browser detectado | Lê o nome e versão do navegador do Cypress automaticamente |
| Limpeza automática | Remove os screenshots temporários após gerar o PDF |
| Organização por suíte | PDFs salvos em `evidences/<nome-da-suite>/` |

---

## 📁 Estrutura de Arquivos

```
ProjectCypressJS/
├── cypress/
│   ├── assets/
│   │   └── logo.png                  ← Logo da capa (coloque aqui!)
│   ├── screenshots/
│   │   └── temp/                     ← Temporário, apagado após gerar o PDF
│   │       └── <suite>/
│   │           └── <teste>/
│   │               └── *.png
│   └── support/
│       ├── commands.js               ← Comandos customizados cy.*
│       └── evidences-generator/
│           └── EvidencesGenerator.js ← Lógica do lado do navegador
├── cypress.config.js                 ← Tasks Node.js (geração do PDF)
└── evidences/                        ← PDFs finais gerados aqui (automático)
    └── <nome-da-suite>/
        └── YYYY-MM-DD-HH-MM-SS_<teste>.pdf
```

---

## 🚀 Como Usar

### 1. Iniciar o gerador

No `beforeEach`, inicialize o gerador para o teste atual:

```javascript
beforeEach(() => {
  cy.startEvidences();
  // ou com ambiente customizado:
  cy.startEvidences(undefined, { environment: 'PRD' });
});
```

> O nome da **suíte** (`describe`) e do **caso de teste** (`it`) são capturados automaticamente. Passe o primeiro argumento apenas se quiser sobrescrever o nome do caso de teste.

### 2. Capturar evidências

Durante o teste, chame `cy.takeScreenshot()` nos momentos relevantes:

```javascript
cy.takeScreenshot('Tela de Login Inicial');
cy.takeScreenshot('Dashboard Carregado com Sucesso');
cy.takeScreenshot('Mensagem de Erro Exibida', 'fullPage'); // scroll completo
```

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `title` | `string` | — | Título descritivo que aparece no PDF |
| `captureMode` | `'viewport'` \| `'fullPage'` | `'viewport'` | `viewport` captura somente a área visível; `fullPage` rola a página e junta |

### 3. Finalizar e gerar o PDF

No `afterEach`, finalize as evidências:

```javascript
afterEach(() => {
  cy.takeScreenshot('Tear Down');
  cy.finishEvidences(); // gera o PDF e limpa os screenshots temporários
});
```

O status (`PASSOU` / `FALHOU`) é detectado automaticamente a partir do resultado do teste.

---

## 📝 Exemplo Completo

```javascript
const { loginPage, dashboardPage } = require('../pages');

describe('OrangeHRM - Autenticação', () => {

  beforeEach(() => {
    cy.startEvidences(); // inicia com nome da suíte e do it() automaticamente
  });

  afterEach(() => {
    cy.takeScreenshot('Tear Down');
    cy.finishEvidences(); // gera PDF e limpa temporários
  });

  it('Login bem-sucedido com credenciais válidas', () => {
    cy.takeScreenshot('Tela de Login Inicial');

    loginPage.loginAsAdmin();
    dashboardPage.verifyDashboardLoaded();

    cy.takeScreenshot('Dashboard Acessado com Sucesso');
  });

  it('Login inválido exibe mensagem de erro', () => {
    loginPage.visit();
    cy.takeScreenshot('Tela de Login Vazia');

    loginPage.login('usuario_errado', 'senha_errada');
    loginPage.verifyLoginError('Invalid credentials');

    cy.takeScreenshot('Erro de Credenciais Exibido');
  });

});
```

---

## 🎨 Capa do PDF

A primeira página é gerada automaticamente com o seguinte layout:

```
┌──────────────────────────── azul escuro ──────────────────────────┐
│  [logo.png]   EVIDÊNCIA DE TESTE                                   │
│               Automated Testing Framework  •  Bruno Simões         │
│◀══════════════════════ faixa cyan ═══════════════════════════════▶│
├─ INFORMAÇÕES DO TESTE ────────────────────────────────────────────┤
│ Suite                     │ OrangeHRM - Autenticação               │
│ Caso de Teste             │ Login bem-sucedido com credenciais...  │
│ Ambiente                  │ HOM                                    │
│ Responsável pela Execução │ bruno.simoes  (usuário do SO)          │
│ Data / Hora da Execução   │ 06/03/2026 10:32:15                    │
├─ INFORMAÇÕES TÉCNICAS ────────────────────────────────────────────┤
│ Navegador                 │ Chrome 120                             │
│ Framework                 │ Cypress                                │
│ Pipeline CI/CD            │ Jenkins                                │
│ Tempo de Execução         │ 00:01:43                               │
├───────────────────────────────────────────────────────────────────┤
│  STATUS:   ✅ PASSOU    (verde)   ou   ❌ FALHOU    (vermelho)     │
└───────────────────────────────────────────────────────────────────┘
```

### Logo personalizada

Coloque o arquivo `logo.png` em `cypress/assets/logo.png`.  
Se o arquivo não existir, a capa é gerada normalmente sem a logo.

- Formato: **PNG** (com ou sem transparência)
- Tamanho recomendado: **300×300 px** ou maior (proporção quadrada)

### Ambiente (`environment`)

O padrão é `HOM`. Para sobrescrever por teste ou suíte:

```javascript
cy.startEvidences(undefined, { environment: 'PRD' });
cy.startEvidences(undefined, { environment: 'DEV' });
```

---

## ⚙️ Especificações Técnicas

| Item | Valor |
|---|---|
| Formato do PDF | A4 (595×842 pt) |
| Biblioteca | PDFKit |
| Screenshots por página | 1 |
| Fit das imagens | 500×600 pt (proporcional) |
| Nomenclatura do PDF | `YYYY-MM-DD-HH-MM-SS_<nome-do-teste>.pdf` |
| Pasta de saída | `evidences/<nome-da-suite>/` |
| Screenshots temporários | `cypress/screenshots/temp/<suite>/<teste>/` |

---

## 🔧 Arquivos Envolvidos

| Arquivo | Responsabilidade |
|---|---|
| `cypress/support/commands.js` | Registra `cy.startEvidences()`, `cy.takeScreenshot()`, `cy.finishEvidences()` |
| `cypress/support/evidences-generator/EvidencesGenerator.js` | Classe cliente (roda no browser); cronometra a execução, delega tudo via `cy.task()` |
| `cypress.config.js` | Tasks Node.js: `ensureFolders`, `storeScreenshotUrl`, `generatePdf`, `cleanScreenshots`; funções de capa `drawCoverPage` e `drawInfoSection` |
| `cypress/assets/logo.png` | Logo exibida na capa (opcional) |

---

## 🐛 Solução de Problemas

### `❌ Você precisa chamar cy.startEvidences() antes!`

Você chamou `cy.takeScreenshot()` ou `cy.finishEvidences()` sem ter chamado `cy.startEvidences()` antes.

**Solução:** Adicione `cy.startEvidences()` no `beforeEach()`.

---

### PDF não gerado / pasta `evidences/` vazia

1. Confirme que `cy.finishEvidences()` está no `afterEach()`
2. Verifique se ao menos um `cy.takeScreenshot()` foi chamado no teste
3. Cheque as permissões de escrita na pasta raiz do projeto

---

### Logo não aparece na capa

1. Confirme que o arquivo existe em `cypress/assets/logo.png`
2. O arquivo deve ser um PNG válido (não corrompido)
3. Se o arquivo estiver ausente, a capa é gerada normalmente sem a logo (sem erro)

---

### Screenshots com artefatos no modo `fullPage`

O modo `fullPage` rola a página e une os fragmentos. Elementos com `position: fixed` (navbars, modais) podem aparecer duplicados.

**Solução:** Use `'viewport'` nesses casos e limite o `fullPage` a páginas com conteúdo longo estático.

---

## 📊 Boas Práticas

1. **Títulos descritivos** — expliquem o *estado* e não a *ação*:
   ```javascript
   // ✅ Bom
   cy.takeScreenshot('Mensagem de erro "Invalid credentials" exibida');
   // ❌ Ruim
   cy.takeScreenshot('screenshot2');
   ```

2. **Momentos estratégicos** — capture em:
   - Estado inicial da página
   - Após preencher formulários importantes
   - Após cada asserção crítica
   - Estado final (Tear Down)

3. **Tear Down como última evidência** — padronize sempre o `afterEach`:
   ```javascript
   afterEach(() => {
     cy.takeScreenshot('Tear Down');
     cy.finishEvidences();
   });
   ```

4. **Não exagere** — 4 a 8 screenshots por teste é o ideal; muitos screenshots tornam o PDF difícil de revisar.

---

## 📅 Histórico de Versões

| Versão | Data | Mudanças |
|---|---|---|
| 2.0 | 06/03/2026 | Capa profissional com logo, status automático, browser e tempo de execução; comandos renomeados para inglês (`startEvidences`, `takeScreenshot`, `finishEvidences`) |
| 1.0 | — | Versão inicial: captura de screenshots e geração básica de PDF |

