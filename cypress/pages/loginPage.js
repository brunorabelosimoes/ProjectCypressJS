const BasePage = require('./basePage');

/**
 * Page Object para Login
 * Gerencia todos os elementos e ações da página de login
 */
class LoginPage extends BasePage {
  /**
   * Seletores da página (centralizados)
   */
  selectors = {
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    submitBtn: 'button[type="submit"]',
    errorAlert: '.oxd-alert-content, .oxd-text--toast-message',
    requiredValidation: '.oxd-text--help-text'
  };

  /**
   * URL base da página
   */
  get baseUrl() {
    return '/auth/login';
  }

  /**
   * Acessa a página de login
   */
  visit() {
    cy.visit('/');
    this.waitForElement(this.selectors.username);
  }

  /**
   * Preenche o campo de username
   * @param {string} username - Nome de usuário
   */
  fillUsername(username) {
    return this.fillInput(this.selectors.username, username);
  }

  /**
   * Preenche o campo de password
   * @param {string} password - Senha
   */
  fillPassword(password) {
    return this.fillInput(this.selectors.password, password);
  }

  /**
   * Clica no botão de submit
   */
  clickSubmit() {
    return this.clickElement(this.selectors.submitBtn);
  }

  /**
   * Realiza login com credenciais
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   */
  login(username, password) {
    const user = username ?? Cypress.env('ADMIN_USER') ?? 'Admin';
    const pass = password ?? Cypress.env('ADMIN_PASS') ?? 'admin123';
    this.visit();
    this.fillUsername(user);
    this.fillPassword(pass);
    this.clickSubmit();
  }

  /**
   * Realiza login como admin usando credenciais de cypress.env.json
   */
  loginAsAdmin() {
    this.login();
  }

  /**
   * Verifica se mensagem de erro está visível
   * @param {string} expectedError - Texto do erro esperado
   */
  verifyLoginError(expectedError) {
    this.verifyVisible(this.selectors.errorAlert);
    return this.verifyText(this.selectors.errorAlert, expectedError);
  }

  /**
   * Verifica se validação de campos obrigatórios é exibida
   */
  verifyRequiredValidation() {
    // Aguarda qualquer mensagem de validação visível
    return cy.get('.oxd-input-group .oxd-text, .oxd-input-field-error, .oxd-text--help-text', { timeout: 5000 })
      .should('be.visible');
  }

  /**
   * Verifica se está na página de login
   */
  verifyLoginPageLoaded() {
    this.waitForElement(this.selectors.username);
    return this.verifyVisible(this.selectors.submitBtn);
  }
}

module.exports = new LoginPage();