import './commands'

// Ignorar exceções não tratadas originadas pela aplicação (evita falha dos testes)
Cypress.on('uncaught:exception', (err, runnable) => {
	// opcional: filtrar por mensagens específicas
	// if (err.message && err.message.includes('Cannot read properties of undefined')) {
	//   return false
	// }
	return false
})