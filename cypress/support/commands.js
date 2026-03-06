const EvidencesGenerator = require("./evidences-generator/EvidencesGenerator");

// Armazena o gerador atual
let atualGenerator = null;

/**
 * ============= EVIDÊNCIAS E SCREENSHOTS =============
 */

/**
 * Inicializa o gerador de evidências para um teste
 * Se não passar testName, captura automaticamente do it()
 * Uso: cy.startEvidences() ou cy.startEvidences('Nome customizado')
 */
Cypress.Commands.add("startEvidences", function(testName, options = {}) {
  // Captura o nome da suite (describe) e do teste (it)
  const suiteName = this.currentTest.parent.title;
  const name = testName || this.currentTest.title;
  const browser = Cypress.browser
    ? `${Cypress.browser.displayName} ${Cypress.browser.majorVersion}`
    : 'N/A';
  atualGenerator = new EvidencesGenerator(suiteName, name, {
    browser,
    environment: options.environment || 'HOM',
  });
  cy.log(`📋 Gerador de evidências iniciado: ${suiteName} > ${name}`);
});

/**
 * Captura uma evidência (screenshot) com um título
 * Uso: cy.takeScreenshot('Login realizado com sucesso')
 */
Cypress.Commands.add("takeScreenshot", (title, captureMode = "viewport") => {
  if (!atualGenerator) {
    throw new Error("❌ Você precisa chamar cy.startEvidences() antes!");
  }
  cy.log(`📸 Screenshot: ${title}`);
  return atualGenerator.takeScreenshot(title, captureMode);
});

/**
 * Finaliza a geração de evidências: cria o PDF e limpa screenshots
 * Uso: cy.finishEvidences()
 */
Cypress.Commands.add("finishEvidences", function() {
  if (!atualGenerator) {
    throw new Error("❌ Nenhum gerador de evidências foi iniciado!");
  }
  const status = (this.currentTest && this.currentTest.state) || 'passed';
  return cy.wrap(null).then(() => {
    return atualGenerator.finish(status);
  });
});

/**
 * ============= AGUARDAS E ESPERAS =============
 */

/**
 * Aguarda um elemento estar presente e visível
 * Uso: cy.waitForElement('button.submit', 10000)
 */
Cypress.Commands.add("waitForElement", (selector, timeout = 5000) => {
  cy.log(`⏳ Aguardando elemento: ${selector}`);
  return cy.get(selector, { timeout }).should('be.visible');
});

/**
 * Aguarda um texto estar presente na página
 * Uso: cy.waitForText('Dashboard', 10000)
 */
Cypress.Commands.add("waitForText", (text, timeout = 5000) => {
  cy.log(`⏳ Aguardando texto: ${text}`);
  return cy.contains(text, { timeout }).should('be.visible');
});

/**
 * ============= FORMULÁRIOS E INPUTS =============
 */

/**
 * Preenche um input com validação
 * Uso: cy.fillInput('input[name="username"]', 'usuário')
 */
Cypress.Commands.add("fillInput", (selector, value) => {
  cy.log(`📝 Preenchendo ${selector} com: ${value}`);
  return cy.get(selector)
    .should('be.visible')
    .clear()
    .type(value);
});

/**
 * Seleciona um dropdown buscando pelo label
 * Uso: cy.selectByLabel('User Role', 'Admin')
 */
Cypress.Commands.add("selectByLabel", (labelText, optionText) => {
  cy.log(`📋 Selecionando em ${labelText}: ${optionText}`);
  
  cy.contains("label", labelText, { timeout: 8000 }).then(($label) => {
    const $lbl = Cypress.$($label);
    let ancestor = $lbl;
    let found = null;

    // Procura o select subindo a árvore de ancestrais
    while (ancestor && ancestor.length && ancestor[0].tagName !== "BODY") {
      const candidate = ancestor
        .find(".oxd-select-wrapper .oxd-select-text-input, .oxd-select-text")
        .filter(":visible");
      if (candidate && candidate.length) {
        found = candidate;
        break;
      }
      ancestor = ancestor.parent();
    }

    // Fallback: busca no form mais próximo
    if (!found) {
      const $form = $lbl.closest("form.oxd-form");
      if ($form && $form.length) {
        const candidate = $form
          .find(".oxd-select-wrapper .oxd-select-text-input, .oxd-select-text")
          .filter(":visible");
        if (candidate && candidate.length) found = candidate;
      }
    }

    if (found && found.length) {
      cy.wrap(found.eq(0)).click({ force: true });
    } else {
      cy.wrap($label).click({ force: true });
    }
  });

  // Aguarda e clica na opção
  cy.contains(".oxd-select-dropdown *", optionText, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });
});

/**
 * ============= VALIDAÇÕES =============
 */

/**
 * Verifica se um elemento contém um texto específico
 * Uso: cy.verifyText('.error-message', 'Invalid credentials')
 */
Cypress.Commands.add("verifyText", (selector, expectedText) => {
  cy.log(`✓ Verificando texto: ${expectedText}`);
  return cy.get(selector).should('contain.text', expectedText);
});

/**
 * Verifica se um elemento está visível
 * Uso: cy.verifyVisible('.success-alert')
 */
Cypress.Commands.add("verifyVisible", (selector) => {
  cy.log(`✓ Verificando se elemento está visível: ${selector}`);
  return cy.get(selector).should('be.visible');
});

/**
 * Verifica se um elemento não existe ou não está visível
 * Uso: cy.verifyNotVisible('.error-message')
 */
Cypress.Commands.add("verifyNotVisible", (selector) => {
  cy.log(`✓ Verificando se elemento não está visível: ${selector}`);
  return cy.get(selector, { timeout: 1000 }).should('not.be.visible');
});
