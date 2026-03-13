const { loginPage, dashboardPage, myInfoPage, adminPage } = require('../pages');

describe("OrangeHRM - Autenticação e fluxos básicos", () => {
  beforeEach(() => {
    cy.startEvidences();
  });

  afterEach(() => {
    cy.takeScreenshot("Tear Down");
    cy.finishEvidences();
  });

  it("Login bem-sucedido com credenciais válidas", () => {
    cy.takeScreenshot("Tela de Login Inicial");
    loginPage.loginAsAdmin();
    dashboardPage.verifyDashboardLoaded();
    cy.takeScreenshot("Dashboard Acessado com Sucesso");
  });

  it("Login inválido exibe mensagem de erro", () => {
    loginPage.visit();
    cy.takeScreenshot("Tela de Login Vazia");
    
    loginPage.login('invalid_user', 'wrong_password');
    loginPage.verifyLoginError("Invalid credentials");
    cy.takeScreenshot("Erro de credenciais inválidas exibido");
  });

  it("Campos vazios exibem validação obrigatória", () => {
    loginPage.visit();
    cy.takeScreenshot("Tela de Login Inicial");
    
    loginPage.clickSubmit();
    loginPage.verifyRequiredValidation();
    cy.takeScreenshot("Validação de campos obrigatórios exibida", "fullPage");
  });

  it("Logout encerra sessão do usuário", () => {
    loginPage.loginAsAdmin();
    dashboardPage.verifyDashboardLoaded();
    cy.takeScreenshot("Usuário logado no dashboard");
    
    dashboardPage.logout();
    loginPage.verifyLoginPageLoaded();
    cy.takeScreenshot("Usuário retornou à tela de login após logout");
  });

  it("Acessar My Info após login bem-sucedido", () => {
    loginPage.loginAsAdmin();
    dashboardPage.verifyDashboardLoaded();
    cy.takeScreenshot("Dashboard carregado", "fullPage");
    
    dashboardPage.navigateToMyInfo();
    myInfoPage.verifyMyInfoPageLoaded();
    cy.takeScreenshot("Página de informações pessoais carregada", "fullPage");
  });

  // Este teste depende de "Emily Jones" existir no demo externo.
  // Em CI, dados do demo são resetados periodicamente — use dados próprios para estabilizar.
  const itOrSkip = Cypress.env('CI') ? it.skip : it;
  itOrSkip("Admin adiciona novo usuário", () => {
    loginPage.loginAsAdmin();
    dashboardPage.verifyDashboardLoaded();
    cy.takeScreenshot("Dashboard carregado");
    
    dashboardPage.navigateToAdmin();
    adminPage.verifyAdminPageLoaded();
    cy.takeScreenshot("Página de usuários do sistema carregada");
    
    const newUser = `user_${Date.now()}`;
    adminPage.createNewUser({
      username: newUser,
      employee: 'Emily Jones',
      password: 'Password123!'
    });
    
    cy.takeScreenshot("Novo usuário criado com sucesso");
  });
});

