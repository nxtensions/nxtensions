import * as devkit from '@nrwl/devkit';
import {
  getProjects,
  readJson,
  readProjectConfiguration,
  readWorkspaceConfiguration,
  Tree,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from './generator';
import { GeneratorOptions } from './schema';

describe('application generator', () => {
  let tree: Tree;
  const options: GeneratorOptions = { name: 'app1' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  test('should add project configuration', async () => {
    await applicationGenerator(tree, options);

    const config = readProjectConfiguration(tree, options.name);
    expect(config).toMatchSnapshot();
  });

  test('should not set the default project when it is already set', async () => {
    let config = readWorkspaceConfiguration(tree);
    config.defaultProject = 'other-app';
    updateWorkspaceConfiguration(tree, config);

    await applicationGenerator(tree, options);

    config = readWorkspaceConfiguration(tree);
    expect(config.defaultProject).toBe('other-app');
  });

  test('should set the default project when it is not set', async () => {
    await applicationGenerator(tree, options);

    const config = readWorkspaceConfiguration(tree);
    expect(config.defaultProject).toBe(options.name);
  });

  test('should generate files', async () => {
    await applicationGenerator(tree, options);

    expect(
      tree.exists(`apps/${options.name}/public/assets/logo.svg`)
    ).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/public/styles/global.css`)
    ).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/public/styles/home.css`)
    ).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/public/favicon.ico`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/public/robots.txt`)).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/src/components/Tour.astro`)
    ).toBeTruthy();
    expect(
      tree.exists(`apps/${options.name}/src/pages/index.astro`)
    ).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/astro.config.mjs`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/tsconfig.json`)).toBeTruthy();
  });

  test('should format files', async () => {
    jest.spyOn(devkit, 'formatFiles');

    await applicationGenerator(tree, options);

    expect(devkit.formatFiles).toHaveBeenCalled();
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
        tree.exists(`apps/${directory}/${options.name}/public/assets/logo.svg`)
      ).toBeTruthy();
      expect(
        tree.exists(
          `apps/${directory}/${options.name}/public/styles/global.css`
        )
      ).toBeTruthy();
      expect(
        tree.exists(`apps/${directory}/${options.name}/public/styles/home.css`)
      ).toBeTruthy();
      expect(
        tree.exists(`apps/${directory}/${options.name}/public/favicon.ico`)
      ).toBeTruthy();
      expect(
        tree.exists(`apps/${directory}/${options.name}/public/robots.txt`)
      ).toBeTruthy();
      expect(
        tree.exists(
          `apps/${directory}/${options.name}/src/components/Tour.astro`
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

  describe('--renderers', () => {
    test('should install provided renderers', async () => {
      const installRenderersTask = await applicationGenerator(tree, {
        ...options,
        renderers: ['@astrojs/renderer-preact', '@astrojs/renderer-solid'],
      });

      expect(installRenderersTask).toBeTruthy();
      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies['@astrojs/renderer-preact']).toBe('latest');
      expect(devDependencies['@astrojs/renderer-solid']).toBe('latest');
      expect(devDependencies['@astrojs/renderer-react']).toBeUndefined();
      expect(devDependencies['@astrojs/renderer-svelte']).toBeUndefined();
      expect(devDependencies['@astrojs/renderer-vue']).toBeUndefined();
    });
  });

  describe('--standaloneConfig', () => {
    test('should create a project.json when standaloneConfig is true', async () => {
      await applicationGenerator(tree, { ...options, standaloneConfig: true });

      expect(tree.exists(`apps/${options.name}/project.json`)).toBeTruthy();
    });

    test('should not create a project.json when standaloneConfig is false', async () => {
      await applicationGenerator(tree, { ...options, standaloneConfig: false });

      expect(tree.exists(`apps/${options.name}/project.json`)).toBeFalsy();
      const project = readProjectConfiguration(tree, options.name);
      expect(project).toBeTruthy();
    });
  });

  describe('--addCypressTests', () => {
    test('should not add an e2e project when --addCypressTests=false', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, { ...options, addCypressTests: false });

      expect(tree.exists(`apps/${e2eProjectName}`)).toBeFalsy();
      const projects = getProjects(tree);
      expect(projects.has(e2eProjectName)).toBeFalsy();
    });

    test('should add an e2e project by default', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, options);

      expect(tree.exists(`apps/${e2eProjectName}`)).toBeTruthy();
      expect(readProjectConfiguration(tree, e2eProjectName)).toBeTruthy();
    });

    test('should add an e2e project when --addCypressTests=true', async () => {
      const e2eProjectName = `${options.name}-e2e`;

      await applicationGenerator(tree, { ...options, addCypressTests: true });

      expect(tree.exists(`apps/${e2eProjectName}`)).toBeTruthy();
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

      expect(tree.exists(`apps/${directory}/${options.name}-e2e`)).toBeTruthy();
      const e2eProject = readProjectConfiguration(tree, e2eProjectName);
      expect(e2eProject.targets.e2e).toBeTruthy();
    });
  });
});
