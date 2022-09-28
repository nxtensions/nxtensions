<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nxtensions-dark.png">
    <img alt="Nxtensions logo" src="https://raw.githubusercontent.com/nxtensions/nxtensions/main/assets/nxtensions-light.png">
  </picture>
</p>

# Nxtensions

[![Run CI checks](https://github.com/nxtensions/nxtensions/actions/workflows/main.yml/badge.svg)](https://github.com/nxtensions/nxtensions/actions/workflows/main.yml) [![License: MIT](https://img.shields.io/static/v1?label=license&message=MIT&color=success)](https://opensource.org/licenses/MIT) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![@nxtensions/astro](https://img.shields.io/npm/v/@nxtensions/astro?label=%40nxtensions%2Fastro)](https://www.npmjs.com/package/@nxtensions/astro) [![@nxtensions/tsconfig-paths-snowpack-plugin](https://img.shields.io/npm/v/@nxtensions/tsconfig-paths-snowpack-plugin?label=%40nxtensions%2Ftsconfig-paths-snowpack-plugin)](https://www.npmjs.com/package/@nxtensions/tsconfig-paths-snowpack-plugin)

Nxtensions is a set of plugins and utilities for [Nx](https://nx.dev).

Nx is a smart and extensible build framework. At its core, it offers many great features like:

- Project and task graph creation and analysis.
- Orchestration and execution of tasks.
- Computation caching.
- Code generation.

Its core functionality can be further extended with plugins to support frameworks and technologies not supported by the core plugins maintained by the Nx team.

## List of packages

- [@nxtensions/astro](./packages/astro/README.md): [Astro](https://astro.build) plugin for Nx.
- [@nxtensions/tsconfig-paths-snowpack-plugin](./packages/tsconfig-paths-snowpack-plugin/README.md): [Snowpack](https://www.snowpack.dev/) plugin adding support for using path mappings specified in tsconfig files.

## Contributing

Interested in contributing? We welcome contributions, please check out our [Contributors Guide](./CONTRIBUTING.md).
