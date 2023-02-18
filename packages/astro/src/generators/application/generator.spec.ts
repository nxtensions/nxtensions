jest.mock('node-fetch');
jest.mock('@nrwl/devkit', () => ({
  ...jest.requireActual('@nrwl/devkit'),
  formatFiles: jest.fn(),
}));

import {
  formatFiles,
  getProjects,
  readJson,
  readNxJson,
  readProjectConfiguration,
  Tree,
  updateNxJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import fetch from 'node-fetch';
import { applicationGenerator } from './generator';
import { GeneratorOptions } from './schema';

describe('application generator', () => {
  let tree: Tree;
  const options: GeneratorOptions = { name: 'app1' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  test('should add project configuration', async () => {
    await applicationGenerator(tree, options);

    const config = readProjectConfiguration(tree, options.name);
    expect(config).toMatchSnapshot();
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

    await applicationGenerator(tree, options);

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

  test('should format files', async () => {
    await applicationGenerator(tree, options);

    expect(formatFiles).toHaveBeenCalled();
  });

  describe('--directory', () => {
    test('should add project with the right name when a directory is provided', async () => {
      const directory = 'some-directory/sub-directory';

      await applicationGenerator(tree, { ...options, directory });

      const project = readProjectConfiguration(
        tree,
        `some-directory-sub-directory-${options.name}`
      );
      expect(project).toBeTruthy();
    });

    test('should generate files in the right directory', async () => {
      const directory = 'some-directory/sub-directory';

      await applicationGenerator(tree, { ...options, directory });

      expect(
        tree.exists(`${directory}/${options.name}/public/favicon.svg`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/src/components/Card.astro`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/src/layouts/Layout.astro`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/src/pages/index.astro`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/astro.config.mjs`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/tsconfig.json`)
      ).toBeTruthy();
    });

    test('should generate files in the right directory in a monorepo layout', async () => {
      tree.write('apps/.gitkeep', '');
      const directory = 'some-directory/sub-directory';

      await applicationGenerator(tree, { ...options, directory });

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

  describe('--addCypressTests', () => {
    test('should not add an e2e project when --addCypressTests=false', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, { ...options, addCypressTests: false });

      expect(tree.exists(`${e2eProjectName}`)).toBeFalsy();
      const projects = getProjects(tree);
      expect(projects.has(e2eProjectName)).toBeFalsy();
    });

    test('should add an e2e project by default', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, options);

      expect(tree.exists(`${e2eProjectName}`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });

    test('should add an e2e project when --addCypressTests=true', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, { ...options, addCypressTests: true });

      expect(tree.exists(`${e2eProjectName}`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });

    test('should configure the e2e target correctly', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, { ...options, addCypressTests: true });

      const e2eProject = readProjectConfiguration(tree, e2eProjectName);
      expect(e2eProject.targets.e2e).toBeTruthy();
      expect(e2eProject.targets.e2e.options.devServerTarget).toBe(
        `${options.name}:dev`
      );
      expect(e2eProject.targets.e2e.configurations).toBeUndefined();
    });

    test('should be configured correctly when passing a directory', async () => {
      const directory = 'some-directory/sub-directory';
      const e2eProjectName = `some-directory-sub-directory-${options.name}-e2e`;

      await applicationGenerator(tree, {
        ...options,
        directory,
        addCypressTests: true,
      });

      expect(tree.exists(`${directory}/${options.name}-e2e`)).toBeTruthy();
      const e2eProject = readProjectConfiguration(tree, e2eProjectName);
      expect(e2eProject.targets.e2e).toBeTruthy();
    });
  });
});
