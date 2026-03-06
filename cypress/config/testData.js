/**
 * Dados de teste centralizados
 * Facilita manutenção e segurança
 */

module.exports = {
  users: {
    admin: {
      username: 'Admin',
      password: 'admin123',
    },
    invalid: {
      username: 'usuario_invalido',
      password: 'senha_errada',
    },
  },
  
  employees: {
    emily: {
      name: 'Emily Jones',
      searchHint: 'Emil',
    },
  },

  timeout: {
    short: 3000,
    default: 5000,
    long: 10000,
  },

  selectors: {
    dashboard: 'Dashboard',
    errorAlert: '.oxd-alert-content, .oxd-text--toast-message',
    requiredValidation: 'Required',
    usernameInput: 'input[name="username"]',
    submitButton: 'button[type="submit"]',
  },
};
