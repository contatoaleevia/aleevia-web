# Aleevia Web

Este projeto foi desenvolvido com [Angular](https://angular.io/) versão 19.2.1.

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [npm](https://www.npmjs.com/) (normalmente vem com o Node.js)
- [Angular CLI](https://angular.dev/tools/cli) versão 19.2.1

Para instalar o Angular CLI globalmente:

```bash
npm install -g @angular/cli@19.2.1
```

## Instalação

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITÓRIO]
cd aleevia-web
```

2. Instale as dependências:

```bash
npm install
```

## Ambiente de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm start
# ou
ng serve
```

O aplicativo estará disponível em `http://localhost:4200/`. A aplicação será recarregada automaticamente se você alterar qualquer um dos arquivos de origem.

## Ambientes

O projeto está configurado com dois ambientes:

- **Development**: Ambiente padrão durante o desenvolvimento local
- **Production**: Ambiente otimizado para a versão de produção

As configurações de ambiente estão localizadas em:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

## Build para Produção

Para compilar o projeto para produção:

```bash
npm run build
# ou
npm run build:production
```

Isso irá criar os arquivos de build na pasta `dist/aleevia-web`. Estes arquivos estão otimizados para melhor desempenho em ambiente de produção.

## Scripts Disponíveis

O projeto inclui os seguintes scripts npm:

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run build`: Constrói o aplicativo para produção
- `npm run watch`: Constrói o aplicativo em modo de observação para desenvolvimento
- `npm test`: Executa os testes unitários

## Executando Testes Unitários

Para executar os testes unitários via [Karma](https://karma-runner.github.io):

```bash
npm test
# ou
ng test
```

## Outras Informações

### Geração de Código

Use o Angular CLI para gerar novos componentes, diretivas, pipes, etc:

```bash
ng generate component nome-do-componente
ng generate service nome-do-servico
ng generate module nome-do-modulo
```

### Dependências Principais

- Angular Material: UI components
- Bootstrap: Layout e estilos
- NgBootstrap: Componentes Bootstrap para Angular
- SweetAlert2: Alertas personalizados
- ngx-mask: Máscaras para inputs
