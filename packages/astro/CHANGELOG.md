# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v2.1.2...@nxtensions/astro@v2.2.0) (2022-05-17)

### Features

- **astro:** support Nx 14.x.x ([#47](https://github.com/nxtensions/nxtensions/issues/47)) ([60070ab](https://github.com/nxtensions/nxtensions/commit/60070abc0565aec18cac376d1f593e450647e5fa))

### [2.1.2](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v2.1.1...@nxtensions/astro@v2.1.2) (2022-03-20)

### Bug Fixes

- **astro:** support old cli terminal output ([#44](https://github.com/nxtensions/nxtensions/issues/44)) ([66fb7b9](https://github.com/nxtensions/nxtensions/commit/66fb7b9d9f252d0be1521f7e9a52047802f99d7d))

### [2.1.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v2.1.0...@nxtensions/astro@v2.1.1) (2022-03-16)

### Bug Fixes

- **astro:** fix component generator schema ([#43](https://github.com/nxtensions/nxtensions/issues/43)) ([328a3e1](https://github.com/nxtensions/nxtensions/commit/328a3e12ce9a5c05928f23f1115f2d886eab2019))

## [2.1.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v2.0.0...@nxtensions/astro@v2.1.0) (2022-03-13)

### Features

- **astro:** add support for astro v0.24.0 ([5f534ef](https://github.com/nxtensions/nxtensions/commit/5f534ef1c0d7d8b23965c6d1cca41147ba7d2b4a))

### Bug Fixes

- **astro:** add missing "site" option to the build executor ([29ff5cf](https://github.com/nxtensions/nxtensions/commit/29ff5cf641c86157445b8005fa944465f77a76fc))

## [2.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.3.2...@nxtensions/astro@v2.0.0) (2022-02-27)

### ⚠ BREAKING CHANGES

- **astro:** Astro v0.23.0 comes with a couple of breaking changes. Make sure to check the migration guide https://docs.astro.build/en/migrate/#migrate-to-v023.

### Features

- **astro:** add check executor to run astro diagnostic checks ([138f93a](https://github.com/nxtensions/nxtensions/commit/138f93a9d94828982e44f6a8704c4b726919588b))
- **astro:** add check target to cacheable operations ([b8f69ca](https://github.com/nxtensions/nxtensions/commit/b8f69caf0a908a6afd8097edd184520311516491))
- **astro:** add migration to add sass if not installed and it is being used in astro projects ([cb5e90c](https://github.com/nxtensions/nxtensions/commit/cb5e90c100e7edbc3fed02ffb00186ec326945d8))
- **astro:** set default project if it is not set when creating an application ([262d1ef](https://github.com/nxtensions/nxtensions/commit/262d1ef66ef85b898f03885ad1a17c47541c56f0))
- **astro:** support allowed flags for the build, dev and preview executors ([624a6ea](https://github.com/nxtensions/nxtensions/commit/624a6ead59609f289c71fabca2a59131242ce219))
- **astro:** support astro v0.23.0 ([41c630c](https://github.com/nxtensions/nxtensions/commit/41c630c7eba34efb8d5e01ac684da205137d06e2))

### Bug Fixes

- **astro:** use the right astro version when initializing the plugin ([7c30ae7](https://github.com/nxtensions/nxtensions/commit/7c30ae7dbe4b37fba1174d3a3d68da32d635d3c0))

### [1.3.2](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.3.1...@nxtensions/astro@v1.3.2) (2022-02-20)

### Bug Fixes

- **astro:** read files from the workspace root when processing the project graph ([7d509f0](https://github.com/nxtensions/nxtensions/commit/7d509f0ad4da2386d740fa027d92e4859b5a8cfe))

### [1.3.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.3.0...@nxtensions/astro@v1.3.1) (2022-02-17)

## [1.3.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.2.0...@nxtensions/astro@v1.3.0) (2021-12-25)

### Features

- **astro:** add recommended vscode extensions for astro when creating projects if needed ([#38](https://github.com/nxtensions/nxtensions/issues/38)) ([39eea0d](https://github.com/nxtensions/nxtensions/commit/39eea0d86b5e5e3d0a4c7fcbbcb34a20e84c8dc0))
- **astro:** update astro and nx dependencies ([#37](https://github.com/nxtensions/nxtensions/issues/37)) ([7458014](https://github.com/nxtensions/nxtensions/commit/745801434aae1f157228ccc06ce0fbfc37ca0bdd))

### Bug Fixes

- **astro:** remove workaround for project graph as it's fixed on nx side ([#39](https://github.com/nxtensions/nxtensions/issues/39)) ([496a6a1](https://github.com/nxtensions/nxtensions/commit/496a6a19091d0b82df293645b36c3003cddc0246))

## [1.2.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.0.1...@nxtensions/astro@v1.2.0) (2021-12-23)

### Features

- **astro:** add component generator ([#34](https://github.com/nxtensions/nxtensions/issues/34)) ([b194bde](https://github.com/nxtensions/nxtensions/commit/b194bde4ccb7047780a96a8b66fe1cbe537c05e7))

### Bug Fixes

- **astro:** add workaround for nx not handling the project graph plugin without projectFilePatterns ([#36](https://github.com/nxtensions/nxtensions/issues/36)) ([c50009a](https://github.com/nxtensions/nxtensions/commit/c50009a6c1cf835942675f6dc687b982b145998b))

## [1.1.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.0.1...@nxtensions/astro@v1.1.0) (2021-12-12)

### Features

- **astro:** add component generator ([9f7c819](https://github.com/nxtensions/nxtensions/commit/9f7c819c04b333d3baeaafb741aec94a5b64c05e))

### [1.0.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v1.0.0...@nxtensions/astro@v1.0.1) (2021-11-21)

### Bug Fixes

- **astro:** update deps to use nx 13.x.x versions ([82a3b1e](https://github.com/nxtensions/nxtensions/commit/82a3b1e38cdd40e0bc779ed89ef289806eff3705))

## [1.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v0.0.1...@nxtensions/astro@v1.0.0) (2021-11-21)

### Features

- **astro:** add support for astro 0.21.0 ([#29](https://github.com/nxtensions/nxtensions/issues/29)) ([0b4a57d](https://github.com/nxtensions/nxtensions/commit/0b4a57d6a7b30e4d5dc311bcf698bf28341a752c))
- **astro:** add support for generating cypress e2e tests for applications ([#30](https://github.com/nxtensions/nxtensions/issues/30)) ([5c9f9b8](https://github.com/nxtensions/nxtensions/commit/5c9f9b875e4635ca98dbe9c211881fe63e7d06fd))

### 0.0.1 (2021-11-15)

### Features

- **astro:** add application generator ([a728b1d](https://github.com/nxtensions/nxtensions/commit/a728b1d53b078bc9035ce1aa6b4a3dbf25d371dd))
- **astro:** add build executor ([6f017ee](https://github.com/nxtensions/nxtensions/commit/6f017eeb319826182a042f5f823f2b42cfa87b61))
- **astro:** add dev executor ([dfb9543](https://github.com/nxtensions/nxtensions/commit/dfb9543f8088cfca18fe1f7c4028a3b894a4a96e))
- **astro:** add library generator ([53b6be7](https://github.com/nxtensions/nxtensions/commit/53b6be73b798f9feff10c404961c7cca0f636b2a))
- **astro:** add preview executor ([7c6dbe5](https://github.com/nxtensions/nxtensions/commit/7c6dbe585757ee5de419e37951e4a611b8ced63a))
- **astro:** add project graph plugin to handle astro files ([#26](https://github.com/nxtensions/nxtensions/issues/26)) ([5bce5b3](https://github.com/nxtensions/nxtensions/commit/5bce5b3252f152160fd07669371fd28178f57f76))
- **astro:** add standaloneConfig option to application generator ([edfb070](https://github.com/nxtensions/nxtensions/commit/edfb0708699fce40a9dace48115e85a786f781b8))
- **tsconfig-paths-snowpack-plugin:** create snowpack plugin to use tsconfig path mappings as aliases ([9fb82f5](https://github.com/nxtensions/nxtensions/commit/9fb82f596c7073b12f7dc61eb7f1cf56eacef0c4))

### Bug Fixes

- **astro:** add missing export and dependencies to package ([#27](https://github.com/nxtensions/nxtensions/issues/27)) ([19180c8](https://github.com/nxtensions/nxtensions/commit/19180c8f73488badd1b7504720ea231773306c32))
- **astro:** fail build when exit code is different than 0 ([39d6f3a](https://github.com/nxtensions/nxtensions/commit/39d6f3ac19efae9337a19e8d74abba74fd34a360))
