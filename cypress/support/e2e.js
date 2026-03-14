import './commands'

/**
 * Erros conhecidos e benignos do OrangeHRM (SPA Vue.js).
 * Apenas ESTES erros são ignorados — erros reais da aplicação continuarão
 * causando falha nos testes, o que é o comportamento correto.
 */
const KNOWN_BENIGN_ERRORS = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications',
  'Non-Error promise rejection captured',
  'Loading CSS chunk',
  'dynamically imported module',
  'Load failed',
];

Cypress.on('uncaught:exception', (err) => {
  const isKnownBenign = KNOWN_BENIGN_ERRORS.some(
    (msg) => err.message && err.message.includes(msg)
  );
  // retorna false = ignora o erro | retorna true (implícito) = falha o teste
  return !isKnownBenign;
});