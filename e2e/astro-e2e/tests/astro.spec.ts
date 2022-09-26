import { names } from '@nrwl/devkit';
import {
  checkFilesExist,
  ensureNxProject,
  readFile,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import { killPorts, readProjectGraph } from '@nxtensions/e2e-utils';

describe('astro e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxtensions/astro', 'dist/packages/astro');
  }, 600_000);

  it('should generate app and build correctly', async () => {
    const app = uniq('app');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    expect(() => checkFilesExist(`apps/${app}`)).not.toThrow();

    const output = await runNxCommandAsync(`build ${app}`);

    expect(output.stdout).toContain(
      `Successfully ran target build for project ${app}`
    );
    expect(() => checkFilesExist(`dist/apps/${app}/index.html`)).not.toThrow();
  }, 300_000);

  it('should generate app and a dependent lib and build correctly', async () => {
    const app = uniq('app');
    const lib = uniq('lib');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    expect(() => checkFilesExist(`apps/${app}`)).not.toThrow();

    await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib}`);
    expect(() => checkFilesExist(`libs/${lib}`)).not.toThrow();

    const libComponentName = names(lib).className;
    updateFile(
      `apps/${app}/src/pages/index.astro`,
      `---
import { ${libComponentName} } from '@proj/${lib}';
---

<${libComponentName} />
`
    );

    const output = await runNxCommandAsync(`run ${app}:build`);

    expect(output.stdout).toContain(
      `Successfully ran target build for project ${app}`
    );
    expect(() => checkFilesExist(`dist/apps/${app}`)).not.toThrow();
    expect(() => checkFilesExist(`dist/apps/${app}/index.html`)).not.toThrow();

    const indexContent = readFile(`dist/apps/${app}/index.html`);
    const libComponentContent = readFile(
      `libs/${lib}/src/lib/${libComponentName}.astro`
    );
    expect(indexContent).toEqual(
      expect.stringContaining(libComponentContent.trim())
    );
  }, 300_000);

  it('should run diagnostics correctly for apps and libs', async () => {
    const app = uniq('app');
    const lib = uniq('lib');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib}`);

    await runNxCommandAsync(`run ${app}:build`);
    const appRun = await runNxCommandAsync(`run ${app}:check`);
    expect(appRun.stdout).toContain(
      `Successfully ran target check for project ${app}`
    );
    const libRun = await runNxCommandAsync(`run ${lib}:check`);
    expect(libRun.stdout).toContain(
      `Successfully ran target check for project ${lib}`
    );
  }, 300_000);

  it('should generate e2e tests for an app and test correctly', async () => {
    const app = uniq('app');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    const output = await runNxCommandAsync(`run ${app}-e2e:e2e --no-watch`);

    expect(output.stdout).toContain('All specs passed!');
    expect(output.stdout).toContain(
      `Successfully ran target e2e for project ${app}`
    );

    expect(await killPorts(3000)).toBeTruthy();
  }, 300_000);

  describe('project graph plugin', () => {
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
        `apps/${app1}/src/pages/index.astro`,
        `---
  import { ${lib1ComponentName} } from '@proj/${lib1}';
  ---

  <${lib1ComponentName} />
  `
      );

      // assert the lib has been added as a dependency to the app in the project graph
      projectGraph = await readProjectGraph();
      console.log(projectGraph.nodes);
      console.log(projectGraph.dependencies);
      expect(
        projectGraph.dependencies[app1].some((dep) => dep.target === lib1)
      ).toBe(true);

      // create second lib and add it as dependency to the first lib
      const lib2 = uniq('lib');
      await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib2}`);

      const lib2ComponentName = names(lib2).className;
      updateFile(
        `libs/${lib1}/src/lib/${lib1ComponentName}.astro`,
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
});
