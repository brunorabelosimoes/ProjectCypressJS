const BasePage = require('./basePage');

/**
 * Page Object para Dashboard
 * Gerencia todos os elementos e ações da página dashboard
 */
class DashboardPage extends BasePage {
  /**
   * Seletores da página (centralizados)
   */
  selectors = {
    dashboardTitle: 'Dashboard',
    userDropdown: '.oxd-userdropdown-name',
    logoutLink: 'a:contains("Logout")',
    myInfoLink: 'a:contains("My Info")',
    adminLink: 'a:contains("Admin")',
    sidebar: '.oxd-sidebar-nav'
  };

  get baseUrl() {
    return '/dashboard/index';
  }

  /**
   * Aguarda o dashboard estar totalmente carregado
   */
  waitForDashboard(timeout = 10000) {
    return this.waitForText(this.selectors.dashboardTitle, timeout);
  }

  /**
   * Verifica se o dashboard foi carregado
   */
  verifyDashboardLoaded() {
    return this.waitForDashboard();
  }

  /**
   * Clica no menu do usuário
   */
  openUserMenu() {
    return this.clickElement(this.selectors.userDropdown);
  }

  /**
   * Realiza logout
   */
  logout() {
    this.openUserMenu();
    cy.contains('Logout', { timeout: 5000 }).click();
  }

  /**
   * Navega para My Info
   */
  navigateToMyInfo() {
    return cy.contains('My Info', { timeout: 5000 }).click();
  }

  /**
   * Navega para Admin
   */
  navigateToAdmin() {
    return cy.contains('Admin', { timeout: 5000 }).click();
  }

  /**
   * Verifica se está logado (dashboard visível)
   */
  verifyUserLoggedIn() {
    return this.verifyVisible(this.selectors.userDropdown);
  }
}

module.exports = new DashboardPage();
