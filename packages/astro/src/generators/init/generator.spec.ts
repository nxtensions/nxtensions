import type { Tree } from '@nx/devkit';
import { readJson, readNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '../utilities/testing';
import { initGenerator } from './generator';

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
    expect(
      recommendations.filter((x: string) => x === 'astro-build.astro-vscode')
    ).toHaveLength(1);
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
});
