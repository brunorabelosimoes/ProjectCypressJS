Feature: Autenticação e gestão básica de usuários (OrangeHRM)

  Cenário: Login bem‑sucedido
    Dado que estou na página de login do OrangeHRM
    Quando eu informar o usuário válido "Admin" e a senha "admin123" e submeter
    Então eu devo ver o painel "Dashboard" visível

  Cenário: Login inválido mostra erro
    Dado que estou na página de login do OrangeHRM
    Quando eu informar usuário inválido "usuario_errado" e senha "senha_errada" e submeter
    Então eu devo ver a mensagem de erro "Invalid credentials"

  Cenário: Campos vazios mostram validação
    Dado que estou na página de login do OrangeHRM
    Quando eu submeter o formulário com o campo usuário ou senha em branco
    Então devo ver mensagens de validação indicando campos obrigatórios

  Cenário: Logout encerra sessão
    Dado que estou autenticado como "Admin"
    Quando eu clicar em Logout
    Então devo ser redirecionado para a página de login e o painel "Dashboard" não deve mais estar acessível

  Cenário: Acessar 'My Info' e verificar dados
    Dado que estou autenticado como "Admin"
    Quando eu navegar para a aba "My Info"
    Então devo ver o nome do empregado e os dados do perfil presentes

  Cenário: Admin adiciona novo usuário
    Dado que estou autenticado como "Admin" e estou no Dashboard
    Quando eu for para Admin → User Management → Add e preencher os campos necessários (username, user role, employee name, password) e salvar
    Então devo ver o novo usuário listado em User Management e conseguir autenticar‑me com as credenciais criadas
