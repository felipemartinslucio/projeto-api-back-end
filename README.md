# Projeto API - Programação Web Back-End

## Dependencias e versões

- bcryptjs: ^2.4.3
- dotenv: ^16.4.5
- expres": ^4.19.2
- jsonwbtoken: ^9.0.2
- mongose: ^8.6.1
- swager-jsdoc: ^6.2.8
- swgger-ui-express: ^5.0.1
- ndemon: ^3.1.4

Arquivo .env:
MONGO_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=your_jwt_secret
PORT=3000

## Instalação

- Baixe o projeto em formato ZIP;
- Extraia a pasta;
- Instale as dependencias:
**npm install**
- Crie o arquivo .env
    
## Rodando localmente

Após realizar a instalação das dependências e acessar o diretório do projeto, inicie localmente utilizando o comando:
**npm run dev**

## Como utilizar

- Use o Thunder do próprio VsCode, o navegador ou Nodemon, Insomnia, Talend, etc. para testar e utilizar as rotas;
- Use a rota /install para instalar os primeiros usuários padrões e popular o Banco de Dados;
- Use a rota /docs para acessar toda a documentação da API;
- Use a rota /auth/login para realizar o login com seu usuário e senha, resgatando seu Token;
- Após resgatar o token, você pode realizar outras ações, como:
  - /auth//register: para registrar mais usuários;
  - /user/list: para listar os usuários;
  - /user/update: para atualizar um usuário;
  - /admin/create-admin: para criar um administrador;
  - /admin/delete-user/:id: para deletar um usuário;

## Autor

- [@felipemartinslucio](https://github.com/felipemartinslucio)
