import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import addCheckTarget from './add-check-target';

describe('add-check-target migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);

    addProjectConfiguration(tree, 'astro-app', {
      root: 'apps/astro-app',
      projectType: 'application',
      targets: {
        foo: { executor: '@my-org/awesome-package:executor' },
        build: { executor: '@nxtensions/astro:build' },
      },
    });
    addProjectConfiguration(tree, 'non-astro-app', {
      root: 'apps/non-astro-app',
      projectType: 'application',
      targets: {
        build: { executor: '@my-org/awesome-package:executor' },
      },
    });
    addProjectConfiguration(tree, 'astro-lib', {
      root: 'libs/astro-lib',
      projectType: 'library',
      targets: {},
    });
    addProjectConfiguration(tree, 'non-astro-lib', {
      root: 'libs/non-astro-lib',
      projectType: 'library',
      targets: {},
    });

    tree.write('libs/astro-lib/a.json', JSON.stringify({}));
    tree.write('libs/astro-lib/b.ts', 'const a = 1;');
    tree.write('libs/astro-lib/folder/c.js', '');
    tree.write('libs/astro-lib/folder/D.astro', '');

    tree.write('libs/non-astro-lib/a.json', JSON.stringify({}));
    tree.write('libs/non-astro-lib/b.ts', 'const a = 1;');

    jest.clearAllMocks();
  });

  test('should add the check target to Astro projects', async () => {
    await addCheckTarget(tree);

    let project = readProjectConfiguration(tree, 'astro-app');
    expect(project.targets.check).toEqual({
      executor: '@nxtensions/astro:check',
      options: {},
    });
    project = readProjectConfiguration(tree, 'astro-lib');
    expect(project.targets.check).toEqual({
      executor: '@nxtensions/astro:check',
      options: {},
    });
    project = readProjectConfiguration(tree, 'non-astro-app');
    expect(project.targets.check).toBeFalsy();
    project = readProjectConfiguration(tree, 'non-astro-lib');
    expect(project.targets.check).toBeFalsy();
  });
});
