# Contributing to Nxtensions

Want to leave your mark? We are happy to accept contributions to Nxtensions.

## Found an issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our GitHub Repository. Even better, you can submit a Pull Request with a fix.

## Have ideas or suggestions?

If you have any ideas or suggestions for Nxtensions, you can [start a discussion in the [Ideas category](https://github.com/nxtensions/nxtensions/discussions/new?category=ideas) or create a [Feature Request issue](https://github.com/nxtensions/nxtensions/issues/new) in our repository.

## Prerequisites

Nxtensions uses [PNPM](https://pnpm.io/) to manage dependencies. To contribute, [make sure that you have PNPM installed on your machine](https://pnpm.io/installation).

## Setting up your development environment

```bash
git clone https://github.com/nxtensions/nxtensions.git
cd nxtensions
pnpm i
```

## Build

Nxtensions uses [Nx](https://nx.dev). To build a project in the workspace run:

```bash
nx build <project-name>
```

> **Note**: If you don't have Nx installed globally you can run `pnpm nx build <project-name>`.

To build any project affected by the changes made in the workspace run:

```bash
nx affected:build
```

## Test

To test a project in the workspace run:

```bash
nx test <project-name>
```

To test any project affected by the changes made in the workspace run:

```bash
nx affected:test
```

## Lint

To lint a project in the workspace run:

```bash
nx lint <project-name>
```

To test any project affected by the changes made in the workspace run:

```bash
nx affected:build
```

## Submission guidelines

### Submitting an issue

Make sure to first search for an existing issue in the issue tracker before submitting a new one. Your problem might have already been reported and has been resolved.

In order for us to be able to troubleshoot and fix your issue as quickly as possible, please make sure to provide detailed information about the environment and the steps you performed to reproduce it. Providing a minimal reproduction would allow us to quickly confirm the bug and will save us from spending time trying to guess and reproduce the problem.

When the information is not sufficient and minimal reproduction has not been provided, we will insist on providing one in order to save maintainers time and enablem them to solve more issues.

### Submitting a PR

Please follow the following guidelines when submitting a PR:

- Make sure the affected projects build successfully (`nx affected:build`).
- Make sure the unit tests of the affected projects pass (`nx affected:test`).
- Make sure the affected projects pass the linting (`nx affected:lint`).
- This is a [Commitizen](https://github.com/commitizen/cz-cli) friendly repository, just do `git add` and execute `pnpm commit` to create a commit following our commit guidelines.
