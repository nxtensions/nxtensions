jest.mock('@nrwl/devkit', () => ({
  ...jest.requireActual('@nrwl/devkit'),
  updateProjectConfiguration: jest
    .fn()
    .mockImplementation(
      jest.requireActual('@nrwl/devkit').updateProjectConfiguration
    ),
}));

import {
  addProjectConfiguration,
  readNxJson,
  readProjectConfiguration,
  removeProjectConfiguration,
  Tree,
  updateNxJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import addCheckTarget from './add-check-target';

describe('add-check-target migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

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

  test('should do nothing when there are no astro projects', async () => {
    removeProjectConfiguration(tree, 'astro-app');
    removeProjectConfiguration(tree, 'astro-lib');

    await addCheckTarget(tree);

    expect(updateProjectConfiguration).not.toHaveBeenCalled();
    let project = readProjectConfiguration(tree, 'non-astro-app');
    expect(project.targets.check).toBeFalsy();
    project = readProjectConfiguration(tree, 'non-astro-lib');
    expect(project.targets.check).toBeFalsy();
  });

  test('should add the check target to Astro projects', async () => {
    await addCheckTarget(tree);

    let project = readProjectConfiguration(tree, 'astro-app');
    expect(project.targets.check).toEqual({
      executor: '@nxtensions/astro:check',
    });
    project = readProjectConfiguration(tree, 'astro-lib');
    expect(project.targets.check).toEqual({
      executor: '@nxtensions/astro:check',
    });
    project = readProjectConfiguration(tree, 'non-astro-app');
    expect(project.targets.check).toBeFalsy();
    project = readProjectConfiguration(tree, 'non-astro-lib');
    expect(project.targets.check).toBeFalsy();
  });

  test('should add the check target to the cacheable operations', async () => {
    await addCheckTarget(tree);

    const workspace = readNxJson(tree);
    expect(
      workspace.tasksRunnerOptions.default.options.cacheableOperations
    ).toContain('check');
  });

  test('should add the check target to multiple runners', async () => {
    let workspace = readNxJson(tree);
    workspace.tasksRunnerOptions.runner2 = {
      runner: 'some-awesome-runner',
      options: { cacheableOperations: ['build', 'lint', 'test', 'e2e'] },
    };
    updateNxJson(tree, workspace);

    await addCheckTarget(tree);

    workspace = readNxJson(tree);
    expect(
      workspace.tasksRunnerOptions.default.options.cacheableOperations
    ).toContain('check');
    expect(
      workspace.tasksRunnerOptions.runner2.options.cacheableOperations
    ).toContain('check');
  });

  test('should not add the check target twice when it is already in the cacheable operations', async () => {
    let workspace = readNxJson(tree);
    workspace.tasksRunnerOptions.default.options.cacheableOperations.push(
      'check'
    );
    updateNxJson(tree, workspace);

    await addCheckTarget(tree);

    workspace = readNxJson(tree);
    expect(
      workspace.tasksRunnerOptions.default.options.cacheableOperations
    ).toStrictEqual(['build', 'lint', 'test', 'e2e', 'check']);
  });
});
