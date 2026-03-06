# 🎯 Guia de Melhores Práticas - QA Cypress

## ✅ Melhorias Implementadas

### 1. **Separação de Dados de Teste**
- ✨ **Arquivo:** `cypress/config/testData.js`
- 🎯 **Benefício:** Evita dados hardcoded no código
- 📝 **Exemplo:**
```javascript
const testData = require("../config/testData");
login.username().type(testData.users.admin.username);
```

### 2. **Page Object Model (POM) Robusto**
- ✨ **Arquivo:** `cypress/pages/basePage.js` + `cypress/pages/loginPage.js`
- 🎯 **Benefício:** Reutilização de código, fácil manutenção
- 📝 **Exemplo:**
```javascript
login.loginAsAdmin();  // Encapsula toda lógica de login
login.verifyLoginError("Invalid credentials");
```

### 3. **Custom Commands Organizados**
- ✨ **Arquivo:** `cypress/support/commands.js`
- 🎯 **Benefício:** Reduz duplicação, código mais legível
- 📝 **Categorizado em seções:**
  - Evidências e Screenshots
  - Aguardas e Esperas
  - Formulários e Inputs
  - Validações

### 4. **Remoção do `.only`**
- ✨ **Problema:** Apenas um teste rodava
- ✅ **Solução:** Todos os testes agora executam

### 5. **JSDoc Documentation**
- ✨ **Benefício:** Autocomplete melhorado, documentação inline
- 📝 **Exemplo:**
```javascript
/**
 * Realiza login com username e password
 * @param {string} user - Nome de usuário
 * @param {string} pass - Senha
 */
login(user, pass) { ... }
```

### 6. **Timeouts Configuráveis**
- ✨ **Arquivo:** `cypress/config/testData.js`
- 🎯 **Benefício:** Evita testes flaky, fácil ajuste
```javascript
timeout: {
  short: 3000,
  default: 5000,
  long: 10000,
}
```

### 7. **Nomes Consistentes**
- ✨ **Mudança:** Métodos em português e inglês unificados
- 🎯 **Nova padrão:** `takeScreenshot`, `loginAsAdmin`, `verifyLoginError`

---

## 📋 Como Estruturar Novos Testes

### Padrão AAA (Arrange-Act-Assert)

```javascript
it("Descrição clara do teste", () => {
  // Arrange - Preparação
  login.visit();
  cy.takeScreenshot("Estado inicial");

  // Act - Ação
  login.loginAsAdmin();

  // Assert - Verificação
  login.waitForDashboard();
  cy.takeScreenshot("Estado final");
});
```

### Criar Novo Page Object

```javascript
// cypress/pages/dashboardPage.js
const BasePage = require('./basePage');
const testData = require('../config/testData');

class DashboardPage extends BasePage {
  /**
   * Clica no menu "Leave"
   */
  clickLeaveMenu() {
    return this.waitForText('Leave', testData.timeout.default).click();
  }
}

module.exports = new DashboardPage();
```

### Adicionar Novos Custom Commands

```javascript
/**
 * Valida se um elemento está desabilitado
 * Uso: cy.verifyDisabled('button.submit')
 */
Cypress.Commands.add("verifyDisabled", (selector) => {
  cy.log(`✓ Verificando se elemento está desabilitado: ${selector}`);
  return cy.get(selector).should('be.disabled');
});
```

---

## 🚀 Próximos Passos Recomendados

### Priority 1 - Alta Prioridade
- [ ] **Dividir teste "Admin adiciona novo usuário"**
  - Muito longo (~40 linhas)
  - Recomendação: Criar `adminPage.js` com metodos específicos
  
- [ ] **Adicionar Page Objects faltantes**
  - DashboardPage
  - AdminPage
  - MyInfoPage

- [ ] **Implementar Data-TestIds**
  - Trabalhar com dev para adicionar `data-testid` em elementos críticos
  - Exemplo: `<button data-testid="submit-btn">Submit</button>`

### Priority 2 - Média Prioridade
- [ ] **Adicionar testes de API**
  - Usar `cy.request()` para setup/cleanup
  - Complementar testes E2E

- [ ] **Implementar Retry Logic**
  - Para elementos flaky
  - `cy.get(selector).should('exist').then(retry)`

- [ ] **Melhorar Relatórios**
  - Integrar Mochawesome (já instalado)
  - Adicionar logs customizados

### Priority 3 - Baixa Prioridade
- [ ] **Teste Performance**
  - Medir tempo de carregamento
  - Validar métricas Web Vitals

- [ ] **Visual Regression Testing**
  - Ferramentas: Percy, Applitools
  - Comparar screenshots automaticamente

- [ ] **Acessibilidade**
  - Usar `cypress-axe`
  - Validar WCAG 2.1

---

## 📊 Checklist para Cada Novo Teste

```
[ ] Usa Arrange-Act-Assert
[ ] Tem screenshot no início e fim
[ ] Usa testData para dados
[ ] Usa Page Objects para acesso a elementos
[ ] Tem comentários em português
[ ] Sem `.only` ou `.skip`
[ ] Sem sleep() ou cy.wait(1000) sem motivo
[ ] Timeouts configuráveis
[ ] Descrição clara do que está testando
[ ] Sem duplicação de código (usar custom commands)
```

---

## 🔧 Troubleshooting

### Teste falhando intermitentemente?
1. Aumentar timeout em `testData.js`
2. Adicionar `.should('be.visible')` antes de interagir
3. Usar `waitForElement()` ou `waitForText()`

### Seletor quebrou?
1. Adicionar fallbacks: `selector1, selector2`
2. Considerar pedir `data-testid` do dev
3. Usar texto visível: `cy.contains('button text')`

### Screenshot vazio?
1. Certificar que `cy.startEvidences()` foi chamado
2. Adicionar delay se necessário: `cy.wait(500).then(() => cy.takeScreenshot(...))`
3. Checar pasta `cypress/screenshots/temp/`

---

## 📚 Recursos Úteis

- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Page Object Model Pattern](https://docs.cypress.io/guides/references/best-practices#Organizing-Commands)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com)
