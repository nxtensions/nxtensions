jest.mock('@nrwl/cypress');

import { cypressInitGenerator } from '@nrwl/cypress';
import {
  readJson,
  readWorkspaceConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initGenerator } from './generator';
import { astroVersion } from './versions';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
    jest.clearAllMocks();
  });

  test('should add project graph plugin', () => {
    initGenerator(tree, {});

    const { plugins } = readWorkspaceConfiguration(tree);
    expect(plugins).toContain('@nxtensions/astro');
  });

  test('should add the check target to the cacheable operations', async () => {
    initGenerator(tree, {});

    const workspace = readWorkspaceConfiguration(tree);
    expect(
      workspace.tasksRunnerOptions.default.options.cacheableOperations
    ).toContain('check');
  });

  test('should correct node_modules entry in .gitignore file when only targeting root', () => {
    tree.write(
      '.gitignore',
      `foo
bar

/node_modules
`
    );

    initGenerator(tree, {});

    const gitignore = tree.read('.gitignore', 'utf-8');
    expect(gitignore).toBe(`foo
bar

node_modules
`);
  });

  test('should add node_modules entry to .gitignore', () => {
    tree.write(
      '.gitignore',
      `foo
bar
`
    );

    initGenerator(tree, {});

    const gitignore = tree.read('.gitignore', 'utf-8');
    expect(gitignore).toBe(`foo
bar

node_modules
`);
  });

  test('should not add VSCode extensions file when it does not exist', async () => {
    initGenerator(tree, {});

    expect(tree.exists('.vscode/extensions.json')).toBeFalsy();
  });

  test('should add the Astro extension to the VSCode recommended extensions', async () => {
    tree.write(
      '.vscode/extensions.json',
      JSON.stringify({
        recommendations: ['nrwl.angular-console'],
      })
    );

    initGenerator(tree, {});

    const { recommendations } = readJson(tree, '.vscode/extensions.json');
    expect(recommendations).toContain('astro-build.astro-vscode');
  });

  test('should not duplicate the Astro extension when it is already present', async () => {
    tree.write(
      '.vscode/extensions.json',
      JSON.stringify({
        recommendations: ['nrwl.angular-console', 'astro-build.astro-vscode'],
      })
    );

    initGenerator(tree, {});

    const { recommendations } = readJson(tree, '.vscode/extensions.json');
    expect(recommendations).toStrictEqual([
      'nrwl.angular-console',
      'astro-build.astro-vscode',
    ]);
  });

  test('should add astro as a devDependency', () => {
    initGenerator(tree, {});

    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies.astro).toBe(astroVersion);
  });

  test('should generate script to patch the nx cli', () => {
    initGenerator(tree, {});

    expect(tree.exists('tools/scripts/patch-nx-cli.js')).toBe(true);
  });

  test('should add a postinstall script to patch the nx cli', () => {
    initGenerator(tree, {});

    const { scripts } = readJson(tree, 'package.json');
    expect(scripts.postinstall).toBe('node ./tools/scripts/patch-nx-cli.js');
  });

  test('should update the postinstall script to patch the nx cli', () => {
    updateJson(tree, 'package.json', (json) => ({
      ...json,
      scripts: { postinstall: 'node ./some-important-script.js' },
    }));

    initGenerator(tree, {});

    const { scripts } = readJson(tree, 'package.json');
    expect(scripts.postinstall).toBe(
      'node ./some-important-script.js && node ./tools/scripts/patch-nx-cli.js'
    );
  });

  describe('--addCypressTests', () => {
    test('should not add cypress when --addCypressTests=false', () => {
      initGenerator(tree, { addCypressTests: false });

      expect(cypressInitGenerator).not.toHaveBeenCalled();
    });

    test('should add cypress by default', () => {
      initGenerator(tree, {});

      expect(cypressInitGenerator).toHaveBeenCalled();
    });

    test('should add cypress when --addCypressTests=true', () => {
      initGenerator(tree, {});

      expect(cypressInitGenerator).toHaveBeenCalled();
    });
  });
});
