<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nx-astro-dark.png">
    <img alt="Nx + Astro logo" src="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nx-astro-light.png">
  </picture>
</p>

# @nxtensions/astro

[Nx](https://nx.dev/) plugin adding first-class support for [Astro](https://astro.build).

## Features

- Generators for scaffolding Astro applications and libraries.
- Generators for scaffolding Astro components.
- Cypress tests for Astro applications.
- Executors to run builds, start the Astro development server, start a local static file server to preview built applications, and run diagnostic checks against projects.
- Nx project graph plugin to visualize Astro project dependencies.

## Prerequisites

To use the plugin an [Nx workspace](https://nx.dev/getting-started/intro) is required.

In an Nx workspace, start by installing the `@nxtensions/astro` package in the workspace running:

```bash
# npm
npm install -D @nxtensions/astro

# yarn
yarn add -D @nxtensions/astro

# pnpm
pnpm install -D @nxtensions/astro
```

## Updating the package

To update the package version and run any migrations included in it, use the `nx migrate` command:

```bash
nx migrate @nxtensions/astro@latest
```

Then follow the intructions provided when the above command finishes running.

For more information on the `nx migrate` command see https://nx.dev/nx/migrate.

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

## Generate a component

To generate an Astro library run:

```bash
nx generate @nxtensions/astro:component my-component
```

## Build

To build an Astro application run:

```bash
nx build my-app
```

Form more information on building an Astro application see https://docs.astro.build/en/reference/cli-reference/#astro-build.

## Development server

To run an Astro application in development mode run:

```bash
nx dev my-app
```

For more information on the Astro development server see https://docs.astro.build/en/reference/cli-reference/#astro-dev.

## Preview

To start a local static file server to serve a previously built Astro application run:

```bash
nx preview my-app
```

For more information on the local static file server for Astro applications see https://docs.astro.build/en/reference/cli-reference/#astro-preview.

## Check

To run diagnostic checks (such as type-checking) against a project run:

```bash
nx check my-app
```

For more information see https://docs.astro.build/en/reference/cli-reference/#astro-check.

## Project graph

To visualize the workspace graph of dependencies run:

```bash
nx graph
```

## Further reference

- [Nx](https://nx.dev)
- [Astro](https://astro.build)
