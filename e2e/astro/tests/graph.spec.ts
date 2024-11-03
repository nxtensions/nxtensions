import { names } from '@nx/devkit';
import {
  ensureNxProject,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nx/plugin/testing';
import { initializeGitRepo, readProjectGraph } from '@nxtensions/e2e-utils';

describe('project graph plugin', () => {
  beforeAll(() => {
    ensureNxProject('@nxtensions/astro', 'dist/packages/astro');
    initializeGitRepo();
  }, 600_000);

  it('should add projects and dependencies correctly to project graph', async () => {
    const app1 = uniq('app');
    const lib1 = uniq('lib');
    await runNxCommandAsync(`generate @nxtensions/astro:app ${app1}`);
    await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib1}`);

    // assert projects were added as nodes to the project graph
    let projectGraph = await readProjectGraph();
    expect(projectGraph.nodes[app1]).toBeTruthy();
    expect(projectGraph.nodes[lib1]).toBeTruthy();
    expect(projectGraph.dependencies[app1]).not.toContain(lib1);

    // add the lib as a dependency to the app
    const lib1ComponentName = names(lib1).className;
    updateFile(
      `${app1}/src/pages/index.astro`,
      `---
  import { ${lib1ComponentName} } from '@proj/${lib1}';
  ---

  <${lib1ComponentName} />
  `
    );

    // assert the lib has been added as a dependency to the app in the project graph
    projectGraph = await readProjectGraph();
    expect(
      projectGraph.dependencies[app1].some((dep) => dep.target === lib1)
    ).toBe(true);

    // create second lib and add it as dependency to the first lib
    const lib2 = uniq('lib');
    await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib2}`);

    const lib2ComponentName = names(lib2).className;
    updateFile(
      `${lib1}/src/${lib1ComponentName}.astro`,
      `---
  import { ${lib2ComponentName} } from '@proj/${lib2}';
  ---

  <${lib2ComponentName} />
  `
    );

    // assert the second lib node was added and it's set as a dependency to
    // the first lib in the project graph
    projectGraph = await readProjectGraph();
    expect(projectGraph.nodes[lib2]).toBeTruthy();
    expect(
      projectGraph.dependencies[lib1].some((dep) => dep.target === lib2)
    ).toBe(true);
  }, 300_000);
});
