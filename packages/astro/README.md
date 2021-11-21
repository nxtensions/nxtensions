<p align="center">
  <image src="https://user-images.githubusercontent.com/12051310/139603151-de031c74-8ccf-482a-b3d9-588c78cef9db.png" alt="Nx + Astro logo"/>
</p>

# @nxtensions/astro

[Astro](https://astro.build) plugin for [Nx](https://nx.dev/).

## Features

- Generator for scaffolding Astro applications and libraries.
- Cypress tests for Astro applications.
- Executors to run builds, start the Astro development server and start a local static file server to preview built applications.
- Nx project graph plugin to see Astro project dependencies.

## Prerequisites

To use the plugin an Nx workspace is required. First, install the `@nxtensions/astro` package in the workspace by running:

```bash
# npm
npm install -D @nxtensions/astro

# yarn
yarn add -D @nxtensions/astro

# pnpm
pnpm install -D @nxtensions/astro
```

## Generate an application

To generate an Astro application run:

```bash
nx generate @nxtensions/astro:app my-app
```

## Generate a library

To generate an Astro library run:

```bash
nx generate @nxtensions/astro:lib my-lib
```

## Build

To build an Astro application run:

```bash
nx build my-app
```

Form more information on building an Astro application see https://docs.astro.build/reference/cli-reference/#astro-build.

## Development server

To run an Astro application in development mode run:

```bash
nx dev my-app
```

For more information on the Astro development server see https://docs.astro.build/reference/cli-reference/#astro-dev.

## Preview

To start a local static file server to serve a previously built Astro application run:

```bash
nx dev my-app
```

For more information on the local static file server for Astro applications see https://docs.astro.build/reference/cli-reference/#astro-preview.

## Project graph

To visualize the workspace graph of dependencies run:

```bash
nx dep-graph
```

## Further reference

- [Nx](https://nx.dev)
- [Astro](https://astro.build)
