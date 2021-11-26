# Projeto

Criação de uma aplicação chamada Be the Hero. A aplicação tem como objetivo permitir que ONGs cadastrem casos e encontrem pessoas dispostas a ajudar. 
Feita baseada no conteúdo da Semana OmniStack 11.

## Tecnologias

- Node.js para o back-end
  * Uso do Express para facilitar a criação das rotas
- ReactJS para o front-end Web 
- React Native para a aplicação mobile
  * Uso do Expo para facilitar a criação do app mobile
- Banco de Dados SQLite para persistir os dados
- Testes unitários e de integração utilizando Jest e Supertest

## Rodando a aplicação
Para começar a utilizar o projeto, deve-se clonar o repositório e entrar na pasta do projeto:

```
git clone https://github.com/pedrovicentesantos/be-the-hero-omnistack-11
cd be-the-hero-omnistack-11
```

O segundo passo é entrar em cada uma das subpastas `backend`, `frontend` e `mobile` e usar o seguinte comando:

```
npm start
```

Feito isto, a aplicação estará rodando e pode ser utilizada no servidor local acessando:

```
localhost:3000   // Para acessar a interface web
localhost:3333   // Para se comunicar com o backend
localhost:19002  // Para acessar o Expo
```

## Testes

Os testes implementados são referentes a API criada e para rodá-los, basta acessar a basta do backend e rodar `npm run test`.