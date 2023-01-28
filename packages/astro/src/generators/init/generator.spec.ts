jest.mock('@nrwl/cypress');

import { cypressInitGenerator } from '@nrwl/cypress';
import type { Tree } from '@nrwl/devkit';
import { readJson, readNxJson, updateJson, updateNxJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initGenerator } from './generator';
import { astroVersion } from './versions';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  test('should add project graph plugin', async () => {
    await initGenerator(tree, {});

    const { plugins } = readNxJson(tree);
    expect(plugins).toContain('@nxtensions/astro');
  });

  test('should add the check target to the cacheable operations', async () => {
    await initGenerator(tree, {});

    const workspace = readNxJson(tree);
    expect(
      workspace.tasksRunnerOptions.default.options.cacheableOperations
    ).toContain('check');
  });

  test('should add the check target defaults', async () => {
    let workspace = readNxJson(tree);
    workspace.namedInputs ??= { production: [] };
    workspace.targetDefaults ??= {};
    updateNxJson(tree, workspace);

    await initGenerator(tree, {});

    workspace = readNxJson(tree);
    expect(workspace.targetDefaults.check).toStrictEqual({
      inputs: ['production', '^production'],
    });
  });

  test('should add "node_modules" and ".astro" entries to .gitignore', async () => {
    tree.write(
      '.gitignore',
      `foo
bar
`
    );

    await initGenerator(tree, {});

    const gitignore = tree.read('.gitignore', 'utf-8');
    expect(gitignore).toBe(`foo
bar

node_modules

.astro
`);
  });

  test('should not duplicate the "node_modules" and ".astro" entries in .gitignore when they exist', async () => {
    const gitignoreContent = `foo
bar
node_modules
.astro
`;
    tree.write('.gitignore', gitignoreContent);

    await initGenerator(tree, {});

    const gitignore = tree.read('.gitignore', 'utf-8');
    expect(gitignore).toBe(gitignoreContent);
  });

  test('should correct node_modules entry in .gitignore file when only targeting root', async () => {
    tree.write(
      '.gitignore',
      `foo
bar

/node_modules
`
    );

    await initGenerator(tree, {});

    const gitignore = tree.read('.gitignore', 'utf-8');
    expect(gitignore).not.toContain('/node_modules');
    expect(gitignore).toContain('node_modules');
  });

  test('should not add VSCode extensions file when it does not exist', async () => {
    await initGenerator(tree, {});

    expect(tree.exists('.vscode/extensions.json')).toBeFalsy();
  });

  test('should add the Astro extension to the VSCode recommended extensions', async () => {
    tree.write(
      '.vscode/extensions.json',
      JSON.stringify({
        recommendations: ['nrwl.angular-console'],
      })
    );

    await initGenerator(tree, {});

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

    await initGenerator(tree, {});

    const { recommendations } = readJson(tree, '.vscode/extensions.json');
    expect(recommendations).toStrictEqual([
      'nrwl.angular-console',
      'astro-build.astro-vscode',
    ]);
  });

  test('should add astro as a devDependency', async () => {
    await initGenerator(tree, {});

    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies.astro).toBe(astroVersion);
  });

  test('should generate script to patch the nx cli', async () => {
    await initGenerator(tree, {});

    expect(tree.exists('tools/scripts/patch-nx-cli.js')).toBe(true);
  });

  test('should add a postinstall script to patch the nx cli', async () => {
    await initGenerator(tree, {});

    const { scripts } = readJson(tree, 'package.json');
    expect(scripts.postinstall).toBe('node ./tools/scripts/patch-nx-cli.js');
  });

  test('should update the postinstall script to patch the nx cli', async () => {
    updateJson(tree, 'package.json', (json) => ({
      ...json,
      scripts: { postinstall: 'node ./some-important-script.js' },
    }));

    await initGenerator(tree, {});

    const { scripts } = readJson(tree, 'package.json');
    expect(scripts.postinstall).toBe(
      'node ./some-important-script.js && node ./tools/scripts/patch-nx-cli.js'
    );
  });

  test('should add .npmrc when it does not exist', async () => {
    await initGenerator(tree, {});

    expect(tree.exists('.npmrc')).toBe(true);
    expect(tree.read('.npmrc', 'utf-8')).toMatchSnapshot();
  });

  test('should update .npmrc when it exist', async () => {
    tree.write('.npmrc', '# Some initial content');

    await initGenerator(tree, {});

    expect(tree.read('.npmrc', 'utf-8')).toMatchSnapshot();
  });

  test('should not duplicate .npmrc configuration when it exist', async () => {
    tree.write('.npmrc', 'shamefully-hoist=true');

    await initGenerator(tree, {});

    expect(tree.read('.npmrc', 'utf-8')).toBe('shamefully-hoist=true');
  });

  describe('--addCypressTests', () => {
    test('should not add cypress when --addCypressTests=false', async () => {
      await initGenerator(tree, { addCypressTests: false });

      expect(cypressInitGenerator).not.toHaveBeenCalled();
    });

    test('should add cypress by default', async () => {
      await initGenerator(tree, {});

      expect(cypressInitGenerator).toHaveBeenCalled();
    });

    test('should add cypress when --addCypressTests=true', async () => {
      await initGenerator(tree, {});

      expect(cypressInitGenerator).toHaveBeenCalled();
    });
  });
});
