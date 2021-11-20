import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initGenerator } from './generator';
import { astroVersion } from './versions';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  test('should add project graph plugin', () => {
    initGenerator(tree, {});

    const { plugins } = readJson(tree, 'nx.json');
    expect(plugins).toContain('@nxtensions/astro');
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

  test('should add astro as a devDependency', () => {
    initGenerator(tree, {});

    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies.astro).toBe(astroVersion);
  });
});
