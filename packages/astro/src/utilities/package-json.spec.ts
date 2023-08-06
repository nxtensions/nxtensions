import { readJson, updateJson, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addDependenciesToPackageJson } from './package-json';

describe('addDependenciesToPackageJson', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should only add non-existent dependencies and not overwrite the existing ones', () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies = {
        pkg1: '1.0.0',
        pkg2: '1.0.0',
      };
      json.devDependencies = {
        pkg3: '1.0.0',
        pkg4: '1.0.0',
      };

      return json;
    });

    addDependenciesToPackageJson(
      tree,
      { pkg1: '2.0.0', pkg4: '2.0.0', pkg5: '2.0.0' },
      { pkg2: '2.0.0', pkg3: '2.0.0', pkg6: '2.0.0' }
    );

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies).toStrictEqual({
      pkg1: '1.0.0',
      pkg2: '1.0.0',
      pkg5: '2.0.0',
    });
    expect(packageJson.devDependencies).toStrictEqual({
      pkg3: '1.0.0',
      pkg4: '1.0.0',
      pkg6: '2.0.0',
    });
  });
});
