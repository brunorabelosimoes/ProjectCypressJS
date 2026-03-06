# Documentação do Gerador de Evidências

## 📋 Visão Geral

O Gerador de Evidências é uma ferramenta integrada ao Cypress que automatiza a captura de screenshots durante os testes e gera um PDF organizado com todas as evidências.

## 🎯 Funcionalidades

1. **Captura de Screenshots**: Tira screenshots ordenadamente durante a execução do teste
2. **Geração de PDF**: Cria um PDF com data, nome do teste e todos os screenshots na ordem
3. **Organização Automática**: Salva PDFs na pasta `evidencias/` na raiz do projeto
4. **Limpeza Automática**: Remove screenshots temporários após gerar o PDF

## 📁 Estrutura de Pastas

```
ProjectCypressJS/
├── cypress/
│   ├── screenshots/
│   │   └── temp/           # Pasta temporária (criada e apagada automaticamente)
│   │       └── [nome-teste]/
│   └── support/
│       └── gerador-evidencias/
│           └── GeradorDeEvidencias.js
└── evidencias/              # PDFs finais ficam aqui (criada automaticamente)
    └── 2024-01-15_OrangeHRM_Autenticacao.pdf
```

## 🚀 Como Usar

### 1. Iniciar o Gerador

No início do teste (geralmente no `beforeEach`):

```javascript
cy.iniciarEvidencias('Nome_Do_Seu_Teste');
```

### 2. Capturar Evidências

Durante o teste, sempre que quiser documentar algo:

```javascript
cy.capturarEvidencia('Descrição do que está sendo capturado');
```

**Dica**: Use títulos descritivos e numerados para facilitar a leitura do PDF.

### 3. Finalizar e Gerar PDF

No final do teste (geralmente no `afterEach`):

```javascript
cy.finalizarEvidencias();
```

## 📝 Exemplo Completo

```javascript
describe("Meu Teste com Evidências", () => {
  
  beforeEach(() => {
    cy.iniciarEvidencias('Teste_Login');
  });

  afterEach(() => {
    cy.finalizarEvidencias();
  });

  it("Deve fazer login com sucesso", () => {
    cy.visit('/login');
    cy.capturarEvidencia('01 - Página de Login');
    
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('senha123');
    cy.capturarEvidencia('02 - Credenciais Preenchidas');
    
    cy.get('button[type="submit"]').click();
    cy.capturarEvidencia('03 - Login Realizado');
  });
});
```

## 🎨 Formato do PDF

O PDF gerado contém:

- **Cabeçalho**: Nome do teste e data
- **Screenshots**: Cada screenshot em uma página separada com:
  - Número sequencial
  - Título descritivo
  - Imagem capturada

## ⚙️ Configurações Técnicas

### Tamanho do PDF
- Formato: A4
- Margens: 50px
- Imagens ajustadas: 500x600px

### Nomenclatura dos Arquivos
- **Screenshots temporários**: `[timestamp]_[titulo].png`
- **PDF final**: `[data]_[nome-teste].pdf`

## 🔧 Dependências

- `pdfkit`: Biblioteca para gerar PDFs
- `fs`: Módulo nativo do Node.js para manipular arquivos
- `path`: Módulo nativo do Node.js para trabalhar com caminhos

## 🐛 Solução de Problemas

### Erro: "Você precisa chamar cy.iniciarEvidencias() antes!"

**Causa**: Tentou capturar evidência sem inicializar o gerador.

**Solução**: Adicione `cy.iniciarEvidencias('Nome_Teste')` no `beforeEach()`.

### PDF não está sendo gerado

**Causa**: Possível erro na finalização ou falta de screenshots.

**Solução**: 
1. Verifique se `cy.finalizarEvidencias()` está sendo chamado
2. Confirme que pelo menos uma evidência foi capturada
3. Verifique as permissões da pasta `evidencias/`

### Screenshots não estão aparecendo no PDF

**Causa**: Caminho do arquivo incorreto ou arquivo não existe.

**Solução**: 
1. Aguarde o Cypress processar o screenshot antes de capturar o próximo
2. Verifique se o comando `cy.screenshot()` está funcionando isoladamente

## 📊 Boas Práticas

1. **Títulos Claros**: Use títulos descritivos e numerados
   ```javascript
   cy.capturarEvidencia('01 - Tela Inicial Carregada');
   cy.capturarEvidencia('02 - Formulário Preenchido');
   ```

2. **Momentos Estratégicos**: Capture evidências em pontos-chave do teste
   - Antes de ações importantes
   - Após verificações críticas
   - Quando há mensagens de erro ou sucesso

3. **Nome do Teste**: Use nomes únicos e significativos
   ```javascript
   cy.iniciarEvidencias('Login_Usuario_Admin');
   cy.iniciarEvidencias('Cadastro_Novo_Usuario');
   ```

4. **Organização**: Mantenha um padrão de numeração
   - 01, 02, 03... para sequência cronológica
   - Use verbos de ação nos títulos

## 📅 Histórico de Mudanças

### Versão 1.0.0 - 2024-01-15
- ✅ Criação inicial do gerador
- ✅ Captura de screenshots ordenados
- ✅ Geração de PDF com data e nome
- ✅ Pasta de evidências na raiz do projeto
- ✅ Limpeza automática de screenshots temporários
- ✅ Comandos customizados do Cypress
- ✅ Documentação completa

## 🎓 Conceitos Importantes

### O que é um Screenshot?
É uma "foto" da tela naquele momento específico. No teste, serve como prova visual de que algo aconteceu.

### O que é um PDF?
É um documento que pode ser aberto em qualquer computador e sempre fica igual. É ótimo para compartilhar evidências com outras pessoas.

### Por que limpar os screenshots?
Para não ocupar espaço no computador e evitar confusão com testes antigos. O PDF já tem todas as informações necessárias.

## 💡 Dicas para Iniciantes

1. **Comece Simples**: Teste com um único screenshot primeiro
2. **Veja o Resultado**: Abra o PDF gerado para ver como ficou
3. **Ajuste os Títulos**: Melhore as descrições para ficarem mais claras
4. **Organize**: Mantenha uma sequência lógica das capturas

## 📞 Suporte

Se tiver dúvidas ou problemas, verifique:
1. Esta documentação
2. Os exemplos em [`cypress/e2e/orangehrm_auth_com_evidencias.cy.js`](cypress/e2e/orangehrm_auth_com_evidencias.cy.js)
3. Os logs do Cypress durante a execução