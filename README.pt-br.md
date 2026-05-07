# Finn

Aplicativo Web de funcionamento offline para gerenciamento de gastos do dia a dia e que utiliza uma interface de chat.

[Demonstração](https://lummi-finn.netlify.app/)

## Funcionalidades

### Chat

A funcionalidade principal do app é o registro de gastos pelo envio de "mensagens" utilizando uma linguagem simples que pode conter, além do valor gasto, uma descrição do gasto. Por exemplo: "Padaria 8,50", "50 vale transporte", "Farmácia 34,50".

O valor gasto pode vir antes, depois, ou até no meio da descrição, e essa pode ser o quão breve ou detalhada você quiser pra cada situação, e pode ser editada depois acessando a página de gastos.

### Categorias

Gastos podem ser classificadas por categorias criadas por você.

Isso pode ser feito automaticamente adicionando o nome da categoria na mensagem, ou ainda cadastrando palavras-chave específicas na própria categoria, que também são usadas para detectar a categoria correta.

Ou seja, se a categoria "Farmácia" conter as palavras "remédio", "paracetamol" e "curativo", ao registrar um gasto usando uma mensagem como "45,60 _remédio_ para ...", ele será automaticamente atribuído à essa categoria.

### Metas e gráficos (Resumo)

Você pode definir suas metas de gasto máximo diário, semanal e mensal, e você pode acompanhá-las na página de Resumo, junto com gráficos que detalham seu consumo diário e mensal por categoria.

### Aplicativo Web Progressivo (PWA)

Além dos dados serem salvos localmente, o aplicativo funciona completamente offline e você pode "instalar" ele utilizando navegadores compatíveis com PWAs. Pra mais informações sobre compatibilidade acesse a [documentação do web.dev](https://web.dev/learn/pwa/progressive-web-apps#compatibility).

Isso pode ser feito com o aplicativo hospedado no link de demonstração acima.

## Como executar o projeto

Requisitos:

- [Node.js](https://nodejs.org)>=22.12 (com npm)
- Um navegador de sua escolha

Clone o repositório e execute o comando

```sh
npm install
```

na raiz do projeto para baixar as bibliotecas necessárias, e então

```sh
npm run dev
```

para executar o servidor de desenvolvimento. A aplicação estará disponível no URL http://localhost:5173/

Alternativamente, use o comando abaixo para compilar a aplicação para a pasta `dist`:

```sh
npm run build
```

Infelizmente, apenas executar o projeto com o servidor de desenvolvimento não é suficiente para fazê-lo ser instalável na sua rede local para fins de teste. Para isso, é necessário hospedar a aplicação compilada com o comando acima em um servidor que atenda a alguns requisitos, como redirecionamento para HTTPS com um certificado válido. Mais informações nesse [artigo do web.dev](https://web.dev/articles/install-criteria).

## Informações

Já é possível utilizar o aplicativo para o que ele se propõe, porém, ele ainda está em sua fase inicial de desenvolvimento.

Nenhuma IA generativa foi usada para gerar código fonte desse projeto.

### Motivação

Este projeto foi motivado pela popularização em redes sociais de bots de aplicativos de mensagem (como WhatsApp, Telegram e Discord) que oferecem a funcionalidade de receber e salvar mensagens simples que descrevem gastos, organizá-las por categorias, e filtrar/pesquisar os gastos já registrados.

Esses bots, por mais que convenientes, requerem hospedagem de terceiros não apenas do código, mas também dos seus dados pessoais de compras, o que é, no mínimo, ruim para a sua privacidade.

Os bots também usam e oferecem funcionalidades de IA, de grande parte (provavelmente) generativa, para, por exemplo, criar nomes de categorias automaticamente e analisar seus gastos. Enquanto isso é conveniente, adiciona mais um terceiro que processa suas informações em troca de um ganho pequeno de produtividade.

Este projeto se apresenta como uma alternativa que oferece uma funcionalidade e experiência parecida, e que pode ser entendida para ter mais funcionalidades graças à plataforma Web, mas que se mantém offline e privada.

### Implementação

Esse é um aplicativo [React](https://react.dev/) que utiliza a biblioteca [Dexie](https://dexie.org/) para salvar dados no [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) do navegador.

## Funcionalidades planejadas

- Notificações (opcionais)
  - De resumo dos gastos do dia
  - De aviso caso estiver próximo do limite de uma meta
- Exportação dos dados
- Inglês como opção de linguagem
