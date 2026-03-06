const BasePage = require('./basePage');

/**
 * Page Object para Admin
 * Gerencia todos os elementos e ações da página de sistema de usuários
 */
class AdminPage extends BasePage {
  /**
   * Seletores da página (centralizados)
   */
  selectors = {
    pageTitle: 'h6:contains("System Users")',
    addButton: 'button:contains("Add")',
    userRoleSelect: '.oxd-select-text-input',
    employeeInput: 'input[placeholder="Type for hints..."]',
    employeeOption: '.oxd-autocomplete-dropdown',
    statusSelect: '.oxd-select-text-input',
    passwordInput: 'input[type="password"]',
    saveButton: 'button:contains("Save")',
    userForm: 'form.oxd-form',
    usernameInput: 'input[placeholder="Username"], input[name="username"]',
    successMessage: '.oxd-toast-content-text'
  };

  get baseUrl() {
    return '/web/index.php/admin/viewSystemUsers';
  }

  /**
   * Aguarda a página de usuários do sistema carregar
   */
  waitForAdminPage(timeout = 10000) {
    cy.contains('System Users', { timeout }).should('be.visible');
  }

  /**
   * Verifica se a página de admin foi carregada
   */
  verifyAdminPageLoaded() {
    return this.waitForAdminPage();
  }

  /**
   * Clica no botão Add para novo usuário
   */
  clickAddUser() {
    return this.clickElement(this.selectors.addButton);
  }

  /**
   * Aguarda o formulário de novo usuário estar visível
   */
  waitForUserForm() {
    return this.waitForElement(this.selectors.userForm);
  }

  /**
   * Preenche o username
   * @param {string} username - Nome de usuário
   */
  fillUsername(username) {
    cy.get(
      'input[placeholder="Username"], input[name="username"], input#systemUser_userName, input[name="systemUser[userName]"], form.oxd-form input.oxd-input',
      { timeout: 8000 }
    )
      .filter(':visible')
      .first()
      .clear()
      .type(username);
  }

  /**
   * Seleciona User Role usando label
   * @param {string} roleText - Texto do role (ex: "Admin")
   */
  selectUserRole(roleText) {
    return cy.selectByLabel('User Role', roleText);
  }

  /**
   * Preenche o campo de employee
   * @param {string} employeeName - Nome do funcionário
   */
  fillEmployee(employeeName) {
    return this.fillInput(this.selectors.employeeInput, employeeName);
  }

  /**
   * Seleciona um employee da lista dropdown
   * @param {string} employeeName - Nome do funcionário
   */
  selectEmployee(employeeName) {
    cy.get(this.selectors.employeeOption, { timeout: 5000 })
      .should('be.visible')
      .contains(employeeName)
      .click();
  }

  /**
   * Seleciona Status
   * @param {string} status - Status (ex: "Enabled")
   */
  selectStatus(status) {
    return cy.selectByLabel('Status', status);
  }

  /**
   * Preenche a senha
   * @param {string} password - Senha
   * @param {number} fieldIndex - Índice do campo (0 para primeira, 1 para segunda)
   */
  fillPassword(password, fieldIndex = 0) {
    cy.get(this.selectors.passwordInput, { timeout: 8000 })
      .filter(':visible')
      .eq(fieldIndex)
      .clear()
      .type(password);
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
    // Aguarda por qualquer mensagem de sucesso (toast, alert, etc)
    return cy.get('[role="alert"], .oxd-toast-content-text, .oxd-toast, .oxd-toast-box', { timeout: 8000 })
      .should('be.visible');
  }

  /**
   * Cria um novo usuário admin
   * @param {object} userData - { username, employee, password }
   */
  createNewUser(userData) {
    this.waitForAdminPage();
    this.clickAddUser();
    this.waitForUserForm();
    
    this.fillUsername(userData.username);
    this.selectUserRole('Admin');
    this.fillEmployee(userData.employee);
    this.selectEmployee(userData.employee);
    this.selectStatus('Enabled');
    this.fillPassword(userData.password, 0);
    this.fillPassword(userData.password, 1);
    this.clickSave();
    return this.verifySuccessMessage();
  }
}

module.exports = new AdminPage();
