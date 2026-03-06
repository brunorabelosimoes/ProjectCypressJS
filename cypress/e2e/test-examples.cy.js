/**
 * ============================================
 * EXEMPLOS DE TESTES BEM ESTRUTURADOS
 * ============================================
 * 
 * Este arquivo mostra a estrutura recomendada
 * para novos testes seguindo as melhores práticas
 */

const login = require("../pages/loginPage");
const testData = require("../config/testData");
const dashboard = require("../pages/dashboardPage");
const myInfo = require("../pages/myInfoPage");

describe("OrangeHRM - Exemplos de Testes Bem Estruturados", () => {
  beforeEach(() => {
    cy.startEvidences();
  });

  afterEach(() => {
    cy.finishEvidences();
  });

  /**
   * ✅ BOM EXEMPLO: Teste simples e focado
   * AAA Pattern (Arrange-Act-Assert)
   */
  it("Dashboard exibe informações do usuário após login", () => {
    // Arrange
    cy.takeScreenshot("01-Tela de login inicial");

    // Act
    login.loginAsAdmin();

    // Assert
    dashboard.waitForDashboard();
    cy.takeScreenshot("02-Dashboard carregado com sucesso");
  });

  /**
   * ✅ BOM EXEMPLO: Teste com validações múltiplas
   */
  it("Logout redireciona para tela de login", () => {
    // Arrange
    login.loginAsAdmin();
    dashboard.waitForDashboard();
    cy.takeScreenshot("01-Usuário logado no dashboard");

    // Act
    dashboard.logout();

    // Assert
    login.visit();
    cy.verifyVisible('input[name="username"]');
    cy.takeScreenshot("02-Redirecionado para login com sucesso");
  });

  /**
   * ✅ BOM EXEMPLO: Teste com interações múltiplas
   * Navega por diferentes seções
   */
  it("Usuário navega entre seções do sistema", () => {
    // Arrange
    login.loginAsAdmin();
    dashboard.waitForDashboard();
    cy.takeScreenshot("01-Dashboard inicial");

    // Act 1
    dashboard.clickMainMenu("My Info");
    
    // Assert 1
    myInfo.waitForPersonalDetails();
    cy.takeScreenshot("02-Seção My Info acessada");

    // Act 2 - Volta ao dashboard
    cy.visit("/web/index.php/dashboard/index");
    
    // Assert 2
    dashboard.isDashboardVisible();
    cy.takeScreenshot("03-Retornou ao dashboard");
  });

  /**
   * ✅ BOM EXEMPLO: Teste com dados de múltiplas sources
   * Usa testData, Page Objects e Custom Commands
   */
  it("Verifica informações pessoais estão acessíveis", () => {
    // Arrange
    cy.log(`🔑 Usando credenciais de: ${testData.users.admin.username}`);
    login.loginAsAdmin();
    dashboard.waitForDashboard();
    cy.takeScreenshot("01-Login realizado");

    // Act
    dashboard.clickMainMenu("My Info");
    myInfo.waitForPersonalDetails();
    
    // Assert - Obtém e verifica dados
    myInfo.getFirstName().then((firstName) => {
      cy.log(`✓ Nome encontrado: ${firstName}`);
      cy.verifyVisible('input[name="firstName"]');
    });
    
    cy.takeScreenshot("02-Informações pessoais visíveis");
  });

  /**
   * ✅ BOM EXEMPLO: Teste com esperas explícitas
   * Usa custom commands para aguardar elementos
   */
  it("Aguarda elementos com timeouts apropriados", () => {
    // Arrange
    login.visit();
    cy.takeScreenshot("01-Tela de login");

    // Act - Preencha fields com custom command
    cy.fillInput('input[name="username"]', testData.users.admin.username);
    cy.fillInput('input[name="password"]', testData.users.admin.password);
    
    // Assert - Aguarde elemento antes de clicar
    cy.waitForElement('button[type="submit"]', testData.timeout.default);
    cy.contains("Login").click();

    // Assert - Aguarde dashboard
    dashboard.waitForDashboard();
    cy.takeScreenshot("02-Dashboard carregado");
  });

  /**
   * ❌ EXEMPLO DE ANTI-PATTERN (O que NÃO fazer)
   * 
   * Teste abaixo é apenas ilustrativo do que EVITAR
   * Está comentado para não executar
   */

  // it.skip("❌ Anti-padrão: Test com problemas", () => {
  //   // ❌ NÃO FAZER: Usar cy.wait() arbitrário
  //   cy.visit("https://opensource-demo.orangehrmlive.com/");
  //   cy.wait(1000); // RUIM: Não espera elemento específico
  //   
  //   // ❌ NÃO FAZER: Valores hardcoded
  //   cy.get('input[name="username"]').type("Admin");
  //   cy.get('input[name="password"]').type("admin123");
  //   
  //   // ❌ NÃO FAZER: Seletor muito específico sem fallback
  //   cy.get('.oxd-button.oxd-button--medium.oxd-button--main').click();
  //   
  //   // ❌ NÃO FAZER: Sem verificação clara
  //   cy.get('body').should('exist');
  //   
  //   // ❌ NÃO FAZER: Screenshot no final apenas
  //   cy.screenshot();
  // });
});
