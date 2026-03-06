const BasePage = require('./basePage');

/**
 * Page Object para My Info
 * Gerencia todos os elementos e ações da página de informações pessoais
 */
class MyInfoPage extends BasePage {
  /**
   * Seletores da página (centralizados)
   */
  selectors = {
    pageTitle: 'h6:contains("Personal Details")',
    firstNameInput: 'input[name="firstName"]',
    lastNameInput: 'input[name="lastName"]',
    saveButton: 'button:contains("Save")',
    successMessage: '.oxd-toast-content-text'
  };

  get baseUrl() {
    return '/web/index.php/pim/viewPersonalDetails';
  }

  /**
   * Aguarda a página de informações pessoais carregar
   */
  waitForMyInfoPage(timeout = 10000) {
    cy.contains('Personal Details', { timeout }).should('be.visible');
  }

  /**
   * Verifica se página foi carregada
   */
  verifyMyInfoPageLoaded() {
    return this.waitForMyInfoPage();
  }

  /**
   * Preenche o primeiro nome
   * @param {string} firstName - Primeiro nome
   */
  fillFirstName(firstName) {
    return this.fillInput(this.selectors.firstNameInput, firstName);
  }

  /**
   * Preenche o último nome
   * @param {string} lastName - Último nome
   */
  fillLastName(lastName) {
    return this.fillInput(this.selectors.lastNameInput, lastName);
  }

  /**
   * Clica em salvar
   */
  clickSave() {
    return this.clickElement(this.selectors.saveButton);
  }

  /**
   * Verifica se mensagem de sucesso foi exibida
   */
  verifySuccessMessage() {
    return this.verifyVisible(this.selectors.successMessage);
  }

  /**
   * Atualiza as informações pessoais
   * @param {string} firstName - Primeiro nome
   * @param {string} lastName - Último nome
   */
  updatePersonalInfo(firstName, lastName) {
    this.verifyMyInfoPageLoaded();
    this.fillFirstName(firstName);
    this.fillLastName(lastName);
    this.clickSave();
    return this.verifySuccessMessage();
  }
}

module.exports = new MyInfoPage();
