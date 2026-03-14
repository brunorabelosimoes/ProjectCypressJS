# 🛠️ Guia de Configuração do Framework

> **Para quem é esse guia?**
> Para qualquer pessoa — mesmo quem nunca usou Cypress — que queira colocar esse framework rodando
> em uma nova empresa ou novo projeto em poucos minutos.

---

## 🧠 Antes de tudo: como o framework funciona?

Imagine que o framework é uma **máquina de testar automática**.
Você fala para ela:

- **"Qual site você vai testar?"** → `BASE_URL`
- **"Qual o login e senha?"** → `ADMIN_USER` e `ADMIN_PASS`
- **"Qual é o nome da sua empresa?"** → `COMPANY_NAME`

Ela faz os testes, tira prints de cada passo, e no final gera:
- Um **PDF profissional** com evidências de cada teste
- Um **relatório HTML** colorido com o resumo de tudo

Você configura **uma vez** e ela funciona para qualquer empresa ou ambiente.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

| Ferramenta | Para que serve | Como verificar |
|---|---|---|
| **Node.js 18+** | Roda o JavaScript no seu computador | `node --version` |
| **npm** | Gerenciador de pacotes (vem com o Node) | `npm --version` |
| **Git** | Controle de versão | `git --version` |

> 💡 Se algum comando acima der erro, acesse [nodejs.org](https://nodejs.org) e instale o Node.js LTS.

---

## 🚀 Primeiros passos: do zero ao primeiro teste

### Passo 1 — Clonar o projeto

```bash
git clone https://github.com/sua-empresa/seu-repositorio.git
cd seu-repositorio
```

### Passo 2 — Instalar as dependências

```bash
npm install
```

> Isso baixa todas as bibliotecas que o projeto precisa. Pode demorar alguns minutos na primeira vez.

### Passo 3 — Configurar o ambiente (o mais importante!)

```bash
npm run setup
```

Esse comando:
1. Cria o arquivo `cypress.env.json` (com base no `cypress.env.example.json`)
2. Cria as pastas necessárias para relatórios e evidências
3. Exibe uma mensagem confirmando que está tudo certo

> ⚠️ **O arquivo `cypress.env.json` NUNCA deve ser enviado ao Git** (ele já está no `.gitignore`).
> Ele contém senhas reais e é exclusivo de cada máquina/ambiente.

### Passo 4 — Editar o arquivo de configuração

Abra o arquivo `cypress.env.json` que foi criado e preencha com os dados da sua empresa:

```json
{
  "BASE_URL":      "https://seu-sistema.empresa.com.br",
  "ADMIN_USER":    "seu.usuario",
  "ADMIN_PASS":    "sua_senha_aqui",
  "ENVIRONMENT":   "HOM",
  "CI_CD_TOOL":    "Jenkins",
  "COMPANY_NAME":  "Nome da Sua Empresa",
  "LOGO_PATH":     "cypress/assets/logo.png"
}
```

### Passo 5 — Rodar os testes!

**Modo visual (recomendado para desenvolvimento):**
```bash
npm run cy:open
```

**Modo linha de comando + relatório completo (recomendado para CI):**
```bash
npm run cy:run:full
```

---

## ⚙️ Todas as variáveis de configuração explicadas

| Variável | O que ela faz | Exemplo |
|---|---|---|
| `BASE_URL` | Endereço do sistema a ser testado | `https://meu-sistema.com` |
| `ADMIN_USER` | Usuário administrador para login | `admin` |
| `ADMIN_PASS` | Senha do administrador | `Senha@2024` |
| `ENVIRONMENT` | Nome do ambiente (aparece no PDF) | `DEV`, `HOM`, `PROD` |
| `CI_CD_TOOL` | Pipeline usado (aparece no PDF) | `Jenkins`, `GitHub Actions`, `Local` |
| `COMPANY_NAME` | Nome da empresa (aparece nos relatórios) | `Acme Corp` |
| `LOGO_PATH` | Caminho para o logo (aparece no PDF) | `cypress/assets/logo.png` |
| `RESPONSIBLE` | Nome do responsável pelos testes (opcional) | `Time QA` |

> **Dica:** Se `RESPONSIBLE` não for definido, o framework usa automaticamente
> o nome de usuário do sistema operacional.

---

## 🌍 Múltiplos ambientes (DEV, HOM, PROD)

Você pode trocar de ambiente sem editar nenhum arquivo!
Basta passar a variável na linha de comando:

```bash
# Rodar contra o ambiente de Desenvolvimento
npx cypress run --env BASE_URL=https://dev.empresa.com,ENVIRONMENT=DEV

# Rodar contra Produção (cuidado! 🚨)
npx cypress run --env BASE_URL=https://www.empresa.com,ENVIRONMENT=PROD

# Rodar só o arquivo de login em Homologação
npx cypress run --spec "cypress/e2e/orangehrm_auth.cy.js" --env ENVIRONMENT=HOM
```

---

## 📜 Todos os comandos disponíveis

```bash
# Setup inicial (só precisa rodar uma vez, na primeira instalação)
npm run setup

# Abre a interface visual do Cypress
npm run cy:open

# Roda os testes no terminal (sem gerar relatório)
npm run cy:run

# Roda os testes E gera relatório HTML + PDFs de evidência (tudo em um comando!)
npm run cy:run:full

# Apenas gera o relatório HTML a partir de runs anteriores
npm run report
```

---

## 📊 Relatórios e evidências

Após rodar `npm run cy:run:full`, dois tipos de saída são gerados:

### 📄 Evidências em PDF

- **Onde ficam:** pasta `evidences/` na raiz do projeto
- **O que contém:** capa profissional + print de cada passo do teste
- **Nome do arquivo:** `2026-03-13-14-30-00_passed_Login-com-credenciais-validas.pdf`

A capa do PDF inclui:
- Nome do case de teste e da suite
- Ambiente, data e hora da execução
- Browser utilizado
- Nome do responsável
- Status **PASSOU** (verde) ou **FALHOU** (vermelho)

### 📊 Relatório HTML

- **Onde fica:** `cypress/reports/html/report.html`
- Abra esse arquivo no navegador para ver o resumo visual de todos os testes

---

## 🔒 Como adicionar o logo da empresa no PDF

1. Copie o arquivo do logo para `cypress/assets/logo.png`
   (o arquivo deve ser do tipo `.png` e ter no máximo ~200px de largura)
2. Confirme que no `cypress.env.json` está assim:
   ```json
   "LOGO_PATH": "cypress/assets/logo.png"
   ```
3. Rode os testes — o logo aparecerá automaticamente na capa do PDF!

> Se não quiser logo, simplesmente não adicione o arquivo.
> O framework funciona perfeitamente sem logo.

---

## 🤖 Integração com CI/CD (GitHub Actions)

O arquivo `.github/workflows/cypress.yml` já está configurado e pronto para uso.

### O que ele faz automaticamente?

Toda vez que alguém fizer um `push` ou abrir um `Pull Request` para `main`:
1. Instala o Node.js e as dependências
2. Cria o `cypress.env.json` com os valores dos Secrets do GitHub
3. Roda os testes em **Chrome** e **Firefox** em paralelo
4. Salva os PDFs de evidência como artefatos (disponíveis por 30 dias)
5. Salva o relatório HTML como artefato

### Como configurar os Secrets no GitHub?

1. Acesse seu repositório no GitHub
2. Clique em **Settings → Secrets and variables → Actions**
3. Adicione os seguintes secrets:

| Secret | Valor |
|---|---|
| `ADMIN_USER` | Usuário administrador |
| `ADMIN_PASS` | Senha do administrador |

4. Adicione as seguintes **Variables** (não são secretas):

| Variable | Valor |
|---|---|
| `BASE_URL` | URL do sistema em CI |
| `COMPANY_NAME` | Nome da empresa |

---

## 🗂️ Estrutura do projeto

```
📁 ProjectCypressJS/
├── 📄 cypress.env.json          ← SUA config local (gitignored, não commitar!)
├── 📄 cypress.env.example.json  ← Template: commitar, sem dados reais
├── 📄 cypress.config.js         ← Config principal do Cypress
├── 📄 package.json              ← Scripts npm
├── 📁 .github/workflows/
│   └── 📄 cypress.yml           ← Pipeline do GitHub Actions
├── 📁 scripts/
│   └── 📄 setup.js              ← Script de setup inicial
├── 📁 cypress/
│   ├── 📁 assets/               ← Logo da empresa (logo.png)
│   ├── 📁 config/
│   │   └── 📄 testData.js       ← Dados de teste centralizados
│   ├── 📁 e2e/                  ← Arquivos de teste (.cy.js)
│   ├── 📁 pages/                ← Page Objects (uma classe por página)
│   ├── 📁 support/
│   │   ├── 📄 commands.js       ← Comandos customizados do Cypress
│   │   └── 📄 e2e.js            ← Setup global dos testes
│   └── 📁 fixtures/             ← Dados estáticos de teste (JSON)
├── 📁 evidences/                ← PDFs gerados (gitignored)
└── 📁 cypress/reports/          ← Relatórios HTML e JSON (gitignored)
```

---

## 🐛 Problemas comuns e soluções

### ❌ "Cannot find module 'cypress'"

```bash
npm install
```

### ❌ Os testes falham com "Invalid credentials"

Verifique se o `cypress.env.json` existe e tem os valores corretos:
```bash
cat cypress.env.json
```

### ❌ O PDF não tem logo

Verifique se o arquivo existe em `cypress/assets/logo.png` e se o `LOGO_PATH` no `cypress.env.json` aponta para ele corretamente.

### ❌ "baseUrl not set"

Verifique se o `cypress.env.json` tem a chave `BASE_URL` com a URL completa (incluindo `https://`).

### ❌ Erro no CI: "cypress.env.json not found"

No GitHub Actions, o arquivo é criado automaticamente pela etapa "Criar cypress.env.json". Confirme que os Secrets `ADMIN_USER` e `ADMIN_PASS` estão configurados no repositório.

---

## 💡 Dicas para adaptar a uma nova empresa

Checklist rápido para colocar o framework funcionando em qualquer empresa:

- [ ] Clonar o repositório
- [ ] Rodar `npm install`
- [ ] Rodar `npm run setup`
- [ ] Editar `cypress.env.json` com URL e credenciais da empresa
- [ ] Adicionar `cypress/assets/logo.png` (opcional)
- [ ] Atualizar os seletores em `cypress/pages/` se o sistema for diferente do OrangeHRM
- [ ] Rodar `npm run cy:open` e ver os testes passando 🎉

---

## 📞 Suporte

Dúvidas? Problemas? Sugestões? Abra uma **Issue** no repositório ou entre em contato com o time de QA.

> Framework desenvolvido com ❤️ por **Bruno Simões**
