/**
 * Index de exportação para todos os Page Objects
 * Facilita a importação centralizada de todas as páginas
 */

module.exports = {
  BasePage: require('./basePage'),
  loginPage: require('./loginPage'),
  dashboardPage: require('./dashboardPage'),
  myInfoPage: require('./myInfoPage'),
  adminPage: require('./adminPage')
};
