# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [19.0.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v19.0.0...@nxtensions/astro@v19.0.1) (2024-07-07)

### Bug Fixes

- **astro:** support renamed nx project locator helper and native helper to find imports ([#654](https://github.com/nxtensions/nxtensions/issues/654)) ([55e2554](https://github.com/nxtensions/nxtensions/commit/55e255469d32f10f5c5df21c2ca5440da09f5aa5))

## [19.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v18.2.1...@nxtensions/astro@v19.0.0) (2024-05-18)

### ⚠ BREAKING CHANGES

- **astro:** Support for Nx v18 was dropped.

### Features

- **astro:** support nx v19 ([#634](https://github.com/nxtensions/nxtensions/issues/634)) ([e808e9f](https://github.com/nxtensions/nxtensions/commit/e808e9f962bc10b3ea03f311c1b9032e1bf6709a))

### [18.2.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v18.2.0...@nxtensions/astro@v18.2.1) (2024-03-24)

### Bug Fixes

- **astro:** allow passing additional properties to the nx init generator ([#599](https://github.com/nxtensions/nxtensions/issues/599)) ([38fe3c5](https://github.com/nxtensions/nxtensions/commit/38fe3c56f597711570b7416b8f56cb4793f963fb))
- **astro:** resolve and execute astro cli binary ([#600](https://github.com/nxtensions/nxtensions/issues/600)) ([42e9ee1](https://github.com/nxtensions/nxtensions/commit/42e9ee1464744044b516132b49d3c8bdec1cc373))

## [18.2.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v18.1.1...@nxtensions/astro@v18.2.0) (2024-03-03)

### Features

- **astro:** add support for generating apps with playwright e2e tests ([#574](https://github.com/nxtensions/nxtensions/issues/574)) ([e0392a9](https://github.com/nxtensions/nxtensions/commit/e0392a97f085f66b8bff5cf52910f59133e4fcd4))
- **astro:** allow cypress generator to infer targets ([#573](https://github.com/nxtensions/nxtensions/issues/573)) ([74ed967](https://github.com/nxtensions/nxtensions/commit/74ed967e59604e2ac78396765235210122455b8c))
- **astro:** set target defaults per executor ([#572](https://github.com/nxtensions/nxtensions/issues/572)) ([e70a625](https://github.com/nxtensions/nxtensions/commit/e70a625dc62bee8fdb0c7a1df54b4d41404fd109))

### [18.1.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v18.1.0...@nxtensions/astro@v18.1.1) (2024-02-27)

### Bug Fixes

- **astro:** spawn astro process correctly on windows platform ([#564](https://github.com/nxtensions/nxtensions/issues/564)) ([0381a71](https://github.com/nxtensions/nxtensions/commit/0381a71f49c705053f976dd29a936262f66935e7))

## [18.1.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v18.0.0...@nxtensions/astro@v18.1.0) (2024-02-25)

### Features

- **astro:** allow generating applications with project name and directory as provided ([#561](https://github.com/nxtensions/nxtensions/issues/561)) ([abdb9f8](https://github.com/nxtensions/nxtensions/commit/abdb9f8dc31876d0816d50b9ae3af0c5d099c9da))
- **astro:** allow generating components with name and directory as provided ([#563](https://github.com/nxtensions/nxtensions/issues/563)) ([d2c54c1](https://github.com/nxtensions/nxtensions/commit/d2c54c1ad799577694683400f059f6b2c3dcbb8b))
- **astro:** allow generating libraries with project name and directory as provided ([#562](https://github.com/nxtensions/nxtensions/issues/562)) ([f20a454](https://github.com/nxtensions/nxtensions/commit/f20a454f3312a5ef788a9abc99c2a6a8f1bb7752))

## [18.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v17.0.0...@nxtensions/astro@v18.0.0) (2024-02-11)

### ⚠ BREAKING CHANGES

- **astro:** Support for Nx versions lower than 18 was dropped

- feat(astro): remove the patch-nx-cli.js script

### Features

- **astro:** support astro v4 ([#540](https://github.com/nxtensions/nxtensions/issues/540)) ([998db4f](https://github.com/nxtensions/nxtensions/commit/998db4fabcd228120f12c32985bedd806a91c2d5))
- **astro:** support nx v18 ([#539](https://github.com/nxtensions/nxtensions/issues/539)) ([a85745c](https://github.com/nxtensions/nxtensions/commit/a85745c29f380ceacbcd9ba6ebec114a18c6847b))

## [17.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v16.2.0...@nxtensions/astro@v17.0.0) (2024-02-11)

### ⚠ BREAKING CHANGES

- **astro:** Support for versions of Astro lower than v3 was dropped

- chore(repo): bump deps

### Features

- **astro:** support astro v3 ([#538](https://github.com/nxtensions/nxtensions/issues/538)) ([a07c7bf](https://github.com/nxtensions/nxtensions/commit/a07c7bfc1d74a505df361c9d30c50609e8584674))
- **astro:** support nx v17 ([#537](https://github.com/nxtensions/nxtensions/issues/537)) ([627bd81](https://github.com/nxtensions/nxtensions/commit/627bd81cc8d428c479fbfe1986f3c5ee885a6b33))

### Bug Fixes

- **astro:** makes the nx patch exit normally instead of throwing an error ([#509](https://github.com/nxtensions/nxtensions/issues/509)) ([2100ad9](https://github.com/nxtensions/nxtensions/commit/2100ad911ca9bab5e22a75306efd5c283aac485f))

## [16.2.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v16.1.0...@nxtensions/astro@v16.2.0) (2023-08-13)

### Features

- **astro:** restore usage of astro's latest version ([#467](https://github.com/nxtensions/nxtensions/issues/467)) ([9a3d805](https://github.com/nxtensions/nxtensions/commit/9a3d80536e8d85378a61366ae6ed1b9ca1834925))
- **astro:** sync with upstream and simplify generator templates ([#468](https://github.com/nxtensions/nxtensions/issues/468)) ([fd33746](https://github.com/nxtensions/nxtensions/commit/fd33746ffb9788b3f5a59d39554eabb1fc6707d6))

### Bug Fixes

- **astro:** import tsquery lazily in application generator ([#466](https://github.com/nxtensions/nxtensions/issues/466)) ([c328cdb](https://github.com/nxtensions/nxtensions/commit/c328cdb5e97373465e8cb1660a8b7cdc5423a37c))
- **astro:** set explicit include setting to generated app tsconfig ([#469](https://github.com/nxtensions/nxtensions/issues/469)) ([88ca75f](https://github.com/nxtensions/nxtensions/commit/88ca75fd577ea0f105a971c07dc30f6e38ce3549))

## [16.1.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v16.0.0...@nxtensions/astro@v16.1.0) (2023-08-06)

### Features

- **astro:** pin generated astro version to 2.9.6 ([#451](https://github.com/nxtensions/nxtensions/issues/451)) ([19f3b42](https://github.com/nxtensions/nxtensions/commit/19f3b425ad97fcf085caee427aedd47d0bfccc30))
- **astro:** set @nx/cypress and @nx/linter as optional peer dependencies ([#455](https://github.com/nxtensions/nxtensions/issues/455)) ([86eb49c](https://github.com/nxtensions/nxtensions/commit/86eb49c225d7c1cab9fb678ecd68899af5ed57e2))
- **astro:** update dependencies ([#450](https://github.com/nxtensions/nxtensions/issues/450)) ([3879519](https://github.com/nxtensions/nxtensions/commit/38795195ab36d2213f342670507b53f2c7e4d603))

### Bug Fixes

- **astro:** do not overwrite existing dependencies in generators ([#454](https://github.com/nxtensions/nxtensions/issues/454)) ([d5093b7](https://github.com/nxtensions/nxtensions/commit/d5093b7e8430e77f18fe08d738f675fc297664ad))
- **astro:** generate correct tailwind integration config ([#453](https://github.com/nxtensions/nxtensions/issues/453)) ([a9d083e](https://github.com/nxtensions/nxtensions/commit/a9d083e3f1a015e32f52de726de99a93d37e58a0))
- **astro:** sync generated tsconfig with astro defaults ([#456](https://github.com/nxtensions/nxtensions/issues/456)) ([51e50a7](https://github.com/nxtensions/nxtensions/commit/51e50a7db814f53d486b121aaf82abd005a5b56c))

## [16.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.5.0...@nxtensions/astro@v16.0.0) (2023-07-30)

### ⚠ BREAKING CHANGES

- **astro:** Support for Nx 16.x.x was added and support for lower version of Nx has been dropped. Make sure to upgrade Nx to 16.x.x before upgrading to this version. Starting with this version and moving forward, the major version of this package will be in sync with the major version of Nx it supports.

### Features

- **astro:** support nx v16 ([#425](https://github.com/nxtensions/nxtensions/issues/425)) ([eca49b2](https://github.com/nxtensions/nxtensions/commit/eca49b27fe6b15aaf678f41c32b80954dacb3869))

## [3.5.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.4.0...@nxtensions/astro@v3.5.0) (2023-04-01)

### Features

- **astro:** support nx v15.9.0 ([#351](https://github.com/nxtensions/nxtensions/issues/351)) ([77fdf0c](https://github.com/nxtensions/nxtensions/commit/77fdf0c814ddca7f1a510888a6c71c0397f5850b))

## [3.4.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.3.1...@nxtensions/astro@v3.4.0) (2023-03-24)

### Features

- **astro:** allow opting-out of component filename capitalization ([#338](https://github.com/nxtensions/nxtensions/issues/338)) ([d898485](https://github.com/nxtensions/nxtensions/commit/d898485358cf7cef18cf9e97043f97e90c5888df))

### [3.3.1](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.3.0...@nxtensions/astro@v3.3.1) (2023-03-09)

### Bug Fixes

- **astro:** handle —host boolean value correctly in dev executor ([#327](https://github.com/nxtensions/nxtensions/issues/327)) ([45679c9](https://github.com/nxtensions/nxtensions/commit/45679c982ce821bd97a67af3b6cfda0c28446f79))

## [3.3.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.2.0...@nxtensions/astro@v3.3.0) (2023-01-28)

### Features

- **astro:** add support for astro v2 ([#297](https://github.com/nxtensions/nxtensions/issues/297)) ([3a333d9](https://github.com/nxtensions/nxtensions/commit/3a333d9b3b5d9a9337fa73884fc861bd14ce352a))
- **astro:** add sync executor ([#277](https://github.com/nxtensions/nxtensions/issues/277)) ([0a9931c](https://github.com/nxtensions/nxtensions/commit/0a9931cd2b224ef6ef74f3f47fb032594ed23393))
- **astro:** generate astro as a peer dependency for publishable libraries ([#276](https://github.com/nxtensions/nxtensions/issues/276)) ([e3e3c38](https://github.com/nxtensions/nxtensions/commit/e3e3c3855fa3b4ee64e9c348ca1eef44a1ab83e7))
- **astro:** generate new workspaces with astro ^1.8.0 ([#278](https://github.com/nxtensions/nxtensions/issues/278)) ([9dac5c1](https://github.com/nxtensions/nxtensions/commit/9dac5c18b80eeaf1db947a399a76868fd9866656))

### Bug Fixes

- **astro:** ensure the plugin is not initialized multiple times ([#279](https://github.com/nxtensions/nxtensions/issues/279)) ([73cc94f](https://github.com/nxtensions/nxtensions/commit/73cc94fbb8c1a15cc42937e7c9c46b2b90c812c9))
- **astro:** fix build executor support for astro supported config file types ([#294](https://github.com/nxtensions/nxtensions/issues/294)) ([dbc98f3](https://github.com/nxtensions/nxtensions/commit/dbc98f31986ad5b60b6a0230abc3ae4548bc1bec))

## [3.2.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.1.0...@nxtensions/astro@v3.2.0) (2022-12-25)

### Features

- **astro:** add a preset generator ([#270](https://github.com/nxtensions/nxtensions/issues/270)) ([235ac6b](https://github.com/nxtensions/nxtensions/commit/235ac6bf7d3e90ac27f4196467e7cbbe63d6db23))
- **astro:** generate check target defaults ([#253](https://github.com/nxtensions/nxtensions/issues/253)) ([37278df](https://github.com/nxtensions/nxtensions/commit/37278df758b07e283936903b0a45861d2a19064f))

## [3.1.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v3.0.0...@nxtensions/astro@v3.1.0) (2022-10-28)

### Features

- **astro:** add support for nx 15 ([#217](https://github.com/nxtensions/nxtensions/issues/217)) ([ca7e189](https://github.com/nxtensions/nxtensions/commit/ca7e189e1e2870155e57bd4c4401137ed81ec82c))
- **astro:** update astro dependencies ([a5c50ea](https://github.com/nxtensions/nxtensions/commit/a5c50ea4597eaa8ef335f8f31968db9b1f8cf1c9))

## [3.0.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v2.3.0...@nxtensions/astro@v3.0.0) (2022-09-25)

### ⚠ NOTICE

This version adds support for the stable Astro version 1.x.x. If you're coming from a version of Astro earlier than 1.0.0, please make sure to follow the [Astro Migration Guide](https://docs.astro.build/en/migrate/).

Remember to update this plugin version in your workspace by running `nx migrate @nxtensions/astro@latest`.

### Features

- **astro:** support latest astro stable version (1.2.8) ([#165](https://github.com/nxtensions/nxtensions/issues/165)) ([a38e9ce](https://github.com/nxtensions/nxtensions/commit/a38e9ce6d024d9a04f6eb2b34256911f894dc582))
- **astro:** update astro to latest (1.3.0) ([#169](https://github.com/nxtensions/nxtensions/issues/169)) ([570d9b6](https://github.com/nxtensions/nxtensions/commit/570d9b6185dd4b492f3e5f98f6bf6d1c82e58bc9))

### Bug Fixes

- **astro:** handle new projects correctly in project graph plugin ([#168](https://github.com/nxtensions/nxtensions/issues/168)) ([d2f7ec4](https://github.com/nxtensions/nxtensions/commit/d2f7ec4b38103844f91ab9722dc7e9b91df81417))

## [2.3.0](https://github.com/nxtensions/nxtensions/compare/@nxtensions/astro@v2.2.0...@nxtensions/astro@v2.3.0) (2022-06-27)

### ⚠ NOTICE

This version adds support for the latest Astro beta version. If you're coming from a version of Astro earlier than 1.0.0-beta.0, please make sure to follow the [Astro Migration Guide](https://docs.astro.build/en/migrate/).

Remember to update this plugin version in your workspace by running `nx migrate @nxtensions/astro@latest`.

### Features

- **astro:** add migration to generate script to patch the nx cli for esm module import support ([19c4649](https://github.com/nxtensions/nxtensions/commit/19c464924c404a86dc1cc15d1cd6c63ff7b26d0f))
- **astro:** support latest version (1.0.0-beta.47) ([#50](https://github.com/nxtensions/nxtensions/issues/50)) ([f514c7a](https://github.com/nxtensions/nxtensions/commit/f514c7a2795a27b62a8e0366fbcc49fc967671c5))
- **astro:** support latest version (1.0.0-beta.56) ([#52](https://github.com/nxtensions/nxtensions/issues/52)) ([c2a3449](https://github.com/nxtensions/nxtensions/commit/c2a3449269d328966ed92af11428c4c17b858511))

### Bug Fixes

- **astro:** add missing package update migration for astro package ([c87847f](https://github.com/nxtensions/nxtensions/commit/c87847fbab4165212d06eb65d49058837d3b927f))
- **astro:** collect deps with a custom visitor to improve performance and fix some race conditions ([9a2a36f](https://github.com/nxtensions/nxtensions/commit/9a2a36ff7b41ec41553a735a80936aa7c83598dd))

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
