/**
 * Classe base para Page Objects
 * Reutiliza métodos comuns entre todas as páginas
 */
class BasePage {
  /**
   * Define o URL base da página (pode ser sobrescrito nas subclasses)
   */
  get baseUrl() {
    return '';
  }

  /**
   * Navega para a página
   */
  visit(path = this.baseUrl) {
    if (path) {
      cy.visit(path);
    }
  }

  /**
   * Espera por um elemento estar visível
   * @param {string} selector - Seletor CSS
   * @param {number} timeout - Timeout em ms
   */
  waitForElement(selector, timeout = 5000) {
    return cy.get(selector, { timeout }).should('be.visible');
  }

  /**
   * Espera por um texto estar visível na página
   * @param {string} text - Texto a procurar
   * @param {number} timeout - Timeout em ms
   */
  waitForText(text, timeout = 5000) {
    return cy.contains(text, { timeout }).should('be.visible');
  }

  /**
   * Clica em um elemento após garantir visibilidade
   * @param {string} selector - Seletor CSS
   */
  clickElement(selector) {
    return cy.get(selector).should('be.visible').click();
  }

  /**
   * Clica em um elemento com força (para elementos ocultos/fixed)
   * @param {string} selector - Seletor CSS
   */
  clickElementForce(selector) {
    return cy.get(selector).click({ force: true });
  }

  /**
   * Preenche um campo de input
   * @param {string} selector - Seletor CSS
   * @param {string} text - Texto a digitar
   */
  fillInput(selector, text) {
    return cy.get(selector)
      .should('be.visible')
      .clear()
      .type(text);
  }

  /**
   * Obtém o valor de um input
   * @param {string} selector - Seletor CSS
   */
  getInputValue(selector) {
    return cy.get(selector).invoke('val');
  }

  /**
   * Verifica se elemento contém um texto específico
   * @param {string} selector - Seletor CSS
   * @param {string} expectedText - Texto esperado
   */
  verifyText(selector, expectedText) {
    return cy.get(selector).should('contain.text', expectedText);
  }

  /**
   * Verifica se elemento está visível
   * @param {string} selector - Seletor CSS
   */
  verifyVisible(selector) {
    return cy.get(selector).should('be.visible');
  }

  /**
   * Verifica se elemento não está visível
   * @param {string} selector - Seletor CSS
   */
  verifyNotVisible(selector) {
    return cy.get(selector, { timeout: 1000 }).should('not.be.visible');
  }

  /**
   * Verifica se elemento existe no DOM
   * @param {string} selector - Seletor CSS
   */
  verifyExists(selector) {
    return cy.get(selector).should('exist');
  }

  /**
   * Verifica se elemento não existe no DOM
   * @param {string} selector - Seletor CSS
   */
  verifyNotExists(selector) {
    return cy.get(selector).should('not.exist');
  }

  /**
   * Aguarda um elemento estar desabilitado
   * @param {string} selector - Seletor CSS
   */
  verifyDisabled(selector) {
    return cy.get(selector).should('be.disabled');
  }

  /**
   * Aguarda um elemento estar habilitado
   * @param {string} selector - Seletor CSS
   */
  verifyEnabled(selector) {
    return cy.get(selector).should('not.be.disabled');
  }

  /**
   * Scroll até um elemento
   * @param {string} selector - Seletor CSS
   */
  scrollToElement(selector) {
    return cy.get(selector).scrollIntoView();
  }

  /**
   * Obtém a URL atual
   */
  getCurrentUrl() {
    return cy.url();
  }

  /**
   * Aguarda uma URL específica
   * @param {string} url - URL esperada
   * @param {number} timeout - Timeout em ms
   */
  waitForUrl(url, timeout = 5000) {
    return cy.url({ timeout }).should('include', url);
  }

  /**
   * Recarrega a página
   */
  reload() {
    return cy.reload();
  }

  /**
   * Executa um script JavaScript na página
   * @param {string} script - Script a executar
   */
  executeScript(script) {
    return cy.window().then((win) => win.eval(script));
  }
}

module.exports = BasePage;
