jest.mock('node-fetch');

import * as devkit from '@nx/devkit';
import {
  getProjects,
  readJson,
  readNxJson,
  readProjectConfiguration,
  updateNxJson,
  type Tree,
} from '@nx/devkit';
import fetch from 'node-fetch';
import type { PackageManagerCommands } from 'nx/src/utils/package-manager';
import { createTreeWithEmptyWorkspace } from '../utilities/testing';
import { applicationGenerator } from './generator';
import type { GeneratorOptions } from './schema';

describe('application generator', () => {
  let tree: Tree;
  const options: GeneratorOptions = {
    name: 'app1',
    projectNameAndRootFormat: 'as-provided',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  test('should add project configuration', async () => {
    await applicationGenerator(tree, options);

    const config = readProjectConfiguration(tree, options.name);
    expect(config).toMatchSnapshot();
  });

  test('should set target defaults', async () => {
    await applicationGenerator(tree, options);

    const nxJson = readNxJson(tree);
    expect(nxJson.targetDefaults).toStrictEqual(
      expect.objectContaining({
        '@nxtensions/astro:build': {
          cache: true,
          inputs: ['default', '^default'],
          outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        },
        '@nxtensions/astro:check': {
          cache: true,
          inputs: ['default', '^default'],
        },
        '@nxtensions/astro:preview': { dependsOn: ['build'] },
      })
    );
  });

  test('should not set the default project when it is already set', async () => {
    let config = readNxJson(tree);
    config.defaultProject = 'other-app';
    updateNxJson(tree, config);

    await applicationGenerator(tree, options);

    config = readNxJson(tree);
    expect(config.defaultProject).toBe('other-app');
  });

  test('should set the default project when it is not set', async () => {
    await applicationGenerator(tree, options);

    const config = readNxJson(tree);
    expect(config.defaultProject).toBe(options.name);
  });

  test('should generate files', async () => {
    await applicationGenerator(tree, options);

    expect(tree.exists(`${options.name}/public/favicon.svg`)).toBeTruthy();
    expect(
      tree.exists(`${options.name}/src/components/Card.astro`)
    ).toBeTruthy();
    expect(
      tree.exists(`${options.name}/src/layouts/Layout.astro`)
    ).toBeTruthy();
    expect(tree.exists(`${options.name}/src/pages/index.astro`)).toBeTruthy();
    expect(tree.exists(`${options.name}/astro.config.mjs`)).toBeTruthy();
    expect(tree.exists(`${options.name}/tsconfig.json`)).toBeTruthy();
  });

  test('should generate files in the right location in a monorepo layout', async () => {
    tree.write('apps/.gitkeep', '');

    await applicationGenerator(tree, {
      ...options,
      projectNameAndRootFormat: undefined,
    });

    expect(tree.exists(`apps/${options.name}/public/favicon.svg`)).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/src/components/Card.astro`)
    ).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/src/layouts/Layout.astro`)
    ).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/src/pages/index.astro`)
    ).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/astro.config.mjs`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/tsconfig.json`)).toBeTruthy();
  });

  describe('--directory', () => {
    test('should add project with the right name when a directory is provided', async () => {
      const directory = `some-directory/sub-directory/${options.name}`;

      await applicationGenerator(tree, { ...options, directory });

      const project = readProjectConfiguration(tree, options.name);
      expect(project).toBeTruthy();
    });

    test('should generate files in the right directory', async () => {
      const directory = `some-directory/sub-directory/${options.name}`;

      await applicationGenerator(tree, { ...options, directory });

      expect(tree.exists(`${directory}/public/favicon.svg`)).toBeTruthy();
      expect(
        tree.exists(`${directory}/src/components/Card.astro`)
      ).toBeTruthy();
      expect(tree.exists(`${directory}/src/layouts/Layout.astro`)).toBeTruthy();
      expect(tree.exists(`${directory}/src/pages/index.astro`)).toBeTruthy();
      expect(tree.exists(`${directory}/astro.config.mjs`)).toBeTruthy();
      expect(tree.exists(`${directory}/tsconfig.json`)).toBeTruthy();
    });

    test('should generate files in the right directory in a monorepo layout', async () => {
      tree.write('apps/.gitkeep', '');
      const directory = 'some-directory/sub-directory';

      await applicationGenerator(tree, {
        ...options,
        directory,
        projectNameAndRootFormat: undefined,
      });

      expect(
        tree.exists(`apps/${directory}/${options.name}/public/favicon.svg`)
      ).toBeTruthy();
      expect(
        tree.exists(
          `apps/${directory}/${options.name}/src/components/Card.astro`
        )
      ).toBeTruthy();
      expect(
        tree.exists(
          `apps/${directory}/${options.name}/src/layouts/Layout.astro`
        )
      ).toBeTruthy();
      expect(
        tree.exists(`apps/${directory}/${options.name}/src/pages/index.astro`)
      ).toBeTruthy();
      expect(
        tree.exists(`apps/${directory}/${options.name}/astro.config.mjs`)
      ).toBeTruthy();
      expect(
        tree.exists(`apps/${directory}/${options.name}/tsconfig.json`)
      ).toBeTruthy();
    });
  });

  describe('--tags', () => {
    test('should add project tags when provided', async () => {
      await applicationGenerator(tree, { ...options, tags: 'foo, bar' });

      const { tags } = readProjectConfiguration(tree, options.name);
      expect(tags).toEqual(['foo', 'bar']);
    });
  });

  describe('--integrations', () => {
    test('should add integrations to the astro config', async () => {
      (fetch as unknown as jest.Mock).mockImplementation((url) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve(
              url.includes('@astrojs/solid-js')
                ? { name: '@astrojs/solid-js', version: '0.1.4' }
                : url.includes('@astrojs/vue')
                ? { name: '@astrojs/vue', version: '0.1.5' }
                : { name: 'should-not-be-installed' }
            ),
        });
      });

      await applicationGenerator(tree, {
        ...options,
        integrations: ['solid-js', 'vue'],
      });

      expect(
        tree.read(`${options.name}/astro.config.mjs`, 'utf-8')
      ).toMatchSnapshot();
    });

    test('should install provided integrations and dependencies', async () => {
      (fetch as unknown as jest.Mock).mockImplementation((url) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve(
              url.includes('@astrojs/solid-js')
                ? {
                    name: '@astrojs/solid-js',
                    version: '0.1.4',
                    peerDependencies: { 'solid-js': '^1.3.6' },
                  }
                : url.includes('@astrojs/vue')
                ? {
                    name: '@astrojs/vue',
                    version: '0.1.5',
                    peerDependencies: { vue: '^3.2.30' },
                  }
                : { name: 'should-not-be-installed' }
            ),
        });
      });

      await applicationGenerator(tree, {
        ...options,
        integrations: ['solid-js', 'vue'],
      });

      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies['@astrojs/solid-js']).toBe('^0.1.4');
      expect(devDependencies['solid-js']).toBe('^1.3.6');
      expect(devDependencies['@astrojs/vue']).toBe('^0.1.5');
      expect(devDependencies['vue']).toBe('^3.2.30');
      expect(devDependencies['should-not-be-installed']).toBeUndefined();
    });

    test('should support extra integrations that are not listed scoped to @astrojs', async () => {
      (fetch as unknown as jest.Mock).mockImplementation((url) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve(
              url.includes('@astrojs/netlify')
                ? { name: '@astrojs/netlify', version: '0.4.4' }
                : { name: 'should-not-be-installed' }
            ),
        });
      });

      await applicationGenerator(tree, {
        ...options,
        integrations: ['netlify'],
      });

      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies['@astrojs/netlify']).toBe('^0.4.4');
      expect(devDependencies['should-not-be-installed']).toBeUndefined();
    });

    test('should support third-party integrations with a name starting with "astro-" and with or without scope', async () => {
      (fetch as unknown as jest.Mock).mockImplementation((url) => {
        return Promise.resolve({
          json: () =>
            Promise.resolve(
              url.includes('astro-imagetools')
                ? { name: 'astro-imagetools', version: '0.6.10' }
                : url.includes('@lloydjatkinson/astro-snipcart')
                ? { name: '@lloydjatkinson/astro-snipcart', version: '0.1.2' }
                : { name: 'should-not-be-installed' }
            ),
        });
      });

      await applicationGenerator(tree, {
        ...options,
        integrations: ['astro-imagetools', '@lloydjatkinson/astro-snipcart'],
      });

      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies['astro-imagetools']).toBe('^0.6.10');
      expect(devDependencies['@lloydjatkinson/astro-snipcart']).toBe('^0.1.2');
      expect(devDependencies['should-not-be-installed']).toBeUndefined();
    });
  });

  describe('--e2eTestRunner', () => {
    test('should not add an e2e project when --e2eTestRunner=none', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, { ...options, e2eTestRunner: 'none' });

      expect(tree.exists(`${e2eProjectName}`)).toBeFalsy();
      const projects = getProjects(tree);
      expect(projects.has(e2eProjectName)).toBeFalsy();
    });

    test('should not add an e2e project by default', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, options);

      expect(tree.exists(`${e2eProjectName}`)).toBeFalsy();
      const projects = getProjects(tree);
      expect(projects.has(e2eProjectName)).toBeFalsy();
    });

    test('should add a cypress e2e project when --e2eTestRunner=cypress', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, {
        ...options,
        e2eTestRunner: 'cypress',
      });

      expect(tree.exists(`${e2eProjectName}`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });

    test('should configure the right web server command in cypress preset', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, {
        ...options,
        e2eTestRunner: 'cypress',
      });

      expect(tree.read(`${e2eProjectName}/cypress.config.ts`, 'utf-8'))
        .toMatchInlineSnapshot(`
        "import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

        import { defineConfig } from 'cypress';

        export default defineConfig({
          e2e: {
            ...nxE2EPreset(__filename, {
              cypressDir: 'src',
              webServerCommands: { default: 'nx run app1:dev' },
            }),
            baseUrl: 'http://localhost:4321',
          },
        });
        "
      `);
    });

    test('should create cypress e2e project correctly when passing a directory', async () => {
      const directory = `some-directory/sub-directory/${options.name}`;
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, {
        ...options,
        directory,
        e2eTestRunner: 'cypress',
      });

      expect(tree.exists(`${directory}-e2e`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });

    test('should add a playwright e2e project when --e2eTestRunner=playwright', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, {
        ...options,
        e2eTestRunner: 'playwright',
      });

      expect(tree.exists(`${e2eProjectName}`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });

    test('should configure playwright correctly', async () => {
      const e2eProjectName = `${options.name}-e2e`;
      jest
        .spyOn(devkit, 'getPackageManagerCommand')
        .mockReturnValue({ exec: 'pnpm exec' } as PackageManagerCommands);

      await applicationGenerator(tree, {
        ...options,
        e2eTestRunner: 'playwright',
      });

      expect(
        tree.read(`${e2eProjectName}/playwright.config.ts`, 'utf-8')
      ).toMatchSnapshot();
    });

    test('should create playwright e2e project correctly when passing a directory', async () => {
      const directory = `some-directory/sub-directory/${options.name}`;
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, {
        ...options,
        directory,
        e2eTestRunner: 'playwright',
      });

      expect(tree.exists(`${directory}-e2e`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });
  });
});
