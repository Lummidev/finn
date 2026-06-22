# Finn

:brazil: [Ler em Português](./README.pt-br.md)

Offline-First Web App for managing your daily expenses with a chat-like interface.

[Demo](https://lummi-finn.netlify.app/)

## Features

### Chat

The app's main feature is the ability to register expenses sending "messages" with simple language that can contain, in addition to the amount of money spent, a description of the expense. For example: "drugstore 6.50", "1.80 bus fare", "9.50 coffee".

The amount of money spent can come before, after, or even somewhere in the middle of the description, which can be as brief or detailed as you want for each situation, and can be edited afterwards in the expenses page.

### Categories

Expenses can be classified by categories created by you.

This can be done automatically adding the name of the category to the message, or even by registering specific keywords on the category itself that are also used to detect the correct category.

That is, if the category "Car" contains the words "gas", "oil", and "tire", when registering an expense with a message like "45 _oil_ change" it will be automatically attributed to that category.

### Goals and Charts (Dashboard)

You can set goals of maximum expenses per day, week, or month, and you can check them out in the Dashboard page, along with charts that detail your daily and monthly expenses by category.

### Progressive Web App (PWA)

In addition to all data being saved locally, the app functions entirely offline and you can "install" it using PWA-compatible browsers. For more information, see the [web.dev docs](https://web.dev/learn/pwa/progressive-web-apps#compatibility).

This can be done with the Demo app linked above.

## Running the project

Prerequisites:

- [Node.js](https://nodejs.org)>=22.12
- [pnpm](https://pnpm.io/)>=11
- A browser of your choice

> [!TIP]
> As said in the [official pnpm docs](https://pnpm.io/installation#using-corepack), you can use the `corepack enable pnpm` command, which is shipped with Node.js, to install pnpm on your system.

Clone the repository and run the command

```sh
pnpm install
```

at the project's root to download the required libraries, and then

```sh
pnpm dev
```

to run the development server. The app will be available at the URL http://localhost:5173/.

Alternatively, use the command below to build the app to the `dist` directory:

```sh
pnpm build
```

Unfortunately, simply running the app with the development server is not enough to make it installable in your local network for testing purposes. To do this, a server that hosts the application compiled with the command above must meet some requirements, like redirecting to HTTPS with a valid certificate. More information [in this web.dev article](https://web.dev/articles/install-criteria).

## Information

You can already use the app for its intended purpose, but it is still in its initial development phase.

No generative AI was used to generate source code for this project.

### Motivation

This project was motivated by the popularization in social media of message app bots (like WhatsApp, Telegram and Discord bots) that offer the functionality of receiving and saving messages with simple language that describe expenses, organize them by categories, and filter/search the already registered expenses.

These bots, as much as they are convenient, require third party hosting not only of their code, but also of personal data of your expenses, which is, at the very least, bad for your privacy.

The bots also use and offer AI features, mostly (probably) generative, to, for instance, create names for categories automatically and analyze your expenses. Again, while this is convenient, it adds yet another third party that processes your information in exchange of a small gain in productivity.

This project presents itself as an alternative that offers a similar experience and functionality, and that can be extended to have more features thanks to the Web platform, but that remains offline and private.

### Implementation

This is a [React](https://react.dev/) app that uses the [Dexie](https://dexie.org/) library to save data in the [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) of the browser.

## Planned features

- (optional) Notifications
  - Summarizing daily expenses
  - Warning if you're close to exceeding a goal's limit
- Exporting data to .csv
