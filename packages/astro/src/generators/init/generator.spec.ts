import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initGenerator } from './generator';
import { astroVersion } from './versions';

describe('init generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  it('should add project graph plugin', () => {
    initGenerator(tree, {});

    const { plugins } = readJson(tree, 'nx.json');
    expect(plugins).toContain('@nxtensions/astro');
  });

  it('should add astro as a devDependency', () => {
    initGenerator(tree, {});

    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies.astro).toBe(astroVersion);
  });
});
