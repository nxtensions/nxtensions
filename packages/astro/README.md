<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nx-astro-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nx-astro-light.png">
    <img alt="Nx + Astro logo" src="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nx-astro-light.png">
  </picture>
</p>

# @nxtensions/astro

[Nx](https://nx.dev/) plugin adding first-class support for [Astro](https://astro.build).

## Features

- Nx preset to create a workspace with an Astro application.
- Generators for scaffolding Astro applications and libraries.
- Generators for scaffolding Astro components.
- Cypress and Playwright E2E tests for Astro applications.
- Executors to run builds, start the Astro development server, start a local static file server to preview built applications, and run diagnostic checks against projects.
- Nx project graph plugin to visualize Astro project dependencies.

## Create a new Nx workspace with an Astro application

To create a new Nx workspace with an Astro application you can run:

```bash
npx create-nx-workspace@latest --preset=@nxtensions/astro
```

And follow the instructions.

> [!NOTE]
> By default, the above command will use `npm` as the package manager. You can provide the `--pm` flag with a value of `yarn` or `pnpm` if you prefer using one of those instead.

## Add the plugin to an existing Nx workspace

In an existing Nx workspace, add the `@nxtensions/astro` package in the workspace by running:

```bash
nx add @nxtensions/astro
```

> [!NOTE]
> If you're using Nx with a version lower than 18.0.0, run:
>
> ```bash
> # npm
> npm install -D @nxtensions/astro@<version>
>
> # yarn
> yarn add -D @nxtensions/astro@<version>
>
> # pnpm
> pnpm install -D @nxtensions/astro@<version>
> ```
>
> Replace the `<version>` with the version of the plugin that supports your version of Nx.

## Updating the package

To update the package version and run any migrations included in it, use the `nx migrate` command:

```bash
nx migrate @nxtensions/astro@latest
```

Then follow the intructions provided when the above command finishes running.

> [!IMPORTANT]
> Prefer updating the plugin using the `nx migrate` command over manually updating its version. The plugin will sometimes apply version updates and run code migrations for packages it manages to ensure they work correctly.

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

To generate an Astro component run:

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

## Sync

To generate TypeScript types for all Astro modules for a project, run:

```bash
nx sync my-app
```

For more information see https://docs.astro.build/en/reference/cli-reference/#astro-sync.

## Project graph

To visualize the workspace graph of dependencies run:

```bash
nx graph
```

## Nx supported versions

Since v16, the plugin version is aligned to the Nx version it supports.

## Further reference

- [Nx](https://nx.dev)
- [Astro](https://astro.build)
