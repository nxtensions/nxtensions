import { names } from '@nx/devkit';
import {
  checkFilesExist,
  ensureNxProject,
  readFile,
  runNxCommandAsync,
  tmpProjPath,
  uniq,
  updateFile,
} from '@nx/plugin/testing';
import {
  ensureCypressInstallation,
  ensurePlaywrightBrowsersInstallation,
  initializeGitRepo,
  killPort,
} from '@nxtensions/e2e-utils';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import stripAnsi from 'strip-ansi';

describe('astro e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxtensions/astro', 'dist/packages/astro');
    initializeGitRepo();
  }, 600_000);

  it('should generate app and build correctly', async () => {
    const app = uniq('app');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    expect(() => checkFilesExist(app)).not.toThrow();

    const output = await runNxCommandAsync(`build ${app}`);

    expect(stripAnsi(output.stdout)).toContain(
      `Successfully ran target build for project ${app}`
    );
    expect(() => checkFilesExist(`dist/${app}/index.html`)).not.toThrow();
  }, 300_000);

  it('should generate app and a dependent lib and build correctly', async () => {
    const app = uniq('app');
    const lib = uniq('lib');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    expect(() => checkFilesExist(app)).not.toThrow();

    await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib}`);
    expect(() => checkFilesExist(lib)).not.toThrow();

    const libComponentName = names(lib).className;
    updateFile(
      `${app}/src/pages/index.astro`,
      `---
import { ${libComponentName} } from '@proj/${lib}';
---

<${libComponentName} />
`
    );

    const output = await runNxCommandAsync(`run ${app}:build`);

    expect(stripAnsi(output.stdout)).toContain(
      `Successfully ran target build for project ${app}`
    );
    expect(() => checkFilesExist(`dist/${app}`)).not.toThrow();
    expect(() => checkFilesExist(`dist/${app}/index.html`)).not.toThrow();

    const indexContent = readFile(`dist/${app}/index.html`);
    const libComponentContent = readFile(
      `${lib}/src/${libComponentName}.astro`
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
    expect(stripAnsi(appRun.stdout)).toContain(
      `Successfully ran target check for project ${app}`
    );
    const libRun = await runNxCommandAsync(`run ${lib}:check`);
    expect(stripAnsi(libRun.stdout)).toContain(
      `Successfully ran target check for project ${lib}`
    );
  }, 300_000);

  it('should generate TypeScript types for content collections correctly', async () => {
    const app = uniq('app');

    await runNxCommandAsync(`generate @nxtensions/astro:app ${app}`);
    updateFile(
      `${app}/astro.config.mjs`,
      `import { defineConfig } from "astro/config";

      export default defineConfig({
        outDir: '../../dist/${app}',
      });`
    );
    updateFile(
      `${app}/src/content/config.ts`,
      `import { z, defineCollection } from 'astro:content';

      const blog = defineCollection({
        schema: z.object({
          title: z.string(),
          tags: z.array(z.string()),
          image: z.string().optional(),
        }),
      });

      export const collections = { blog };`
    );
    updateFile(`${app}/src/content/blog/awesome-blog-post.mdx`, '');

    const output = await runNxCommandAsync(`run ${app}:sync`);
    expect(stripAnsi(output.stdout)).toContain(
      `Successfully ran target sync for project ${app}`
    );
    checkFilesExist(`${app}/.astro/types.d.ts`);
    expect(readFile(`${app}/src/env.d.ts`)).toContain(
      '/// <reference path="../.astro/types.d.ts" />'
    );
  }, 300_000);

  it('should generate cypress e2e tests for an app and test correctly', async () => {
    const app = uniq('app');

    await runNxCommandAsync(
      `generate @nxtensions/astro:app ${app} --e2eTestRunner=cypress`
    );
    ensureCypressInstallation();
    const output = await runNxCommandAsync(`run ${app}-e2e:e2e`);

    expect(stripAnsi(output.stdout)).toContain('All specs passed!');
    expect(stripAnsi(output.stdout)).toContain(
      `Successfully ran target e2e for project ${app}`
    );

    expect(await killPort(4321)).toBeTruthy();
  }, 300_000);

  it('should generate playwright e2e tests for an app and test correctly', async () => {
    const app = uniq('app');

    await runNxCommandAsync(
      `generate @nxtensions/astro:app ${app} --e2eTestRunner=playwright`
    );
    ensurePlaywrightBrowsersInstallation();
    const output = await runNxCommandAsync(`run ${app}-e2e:e2e`, {
      // Playwright uses it to determine Jest is running and throws, don't propagate it
      env: { JEST_WORKER_ID: undefined },
    });

    expect(stripAnsi(output.stdout)).toContain(
      `Successfully ran target e2e for project ${app}`
    );

    expect(await killPort(4321)).toBeTruthy();
  }, 300_000);

  it('should generate app and a dependent lib with Tailwind CSS and build correctly', async () => {
    const app = uniq('app');
    const lib = uniq('lib');

    await runNxCommandAsync(
      `generate @nxtensions/astro:app ${app} --integrations tailwind`
    );
    await runNxCommandAsync(`generate @nxtensions/astro:lib ${lib}`);

    const libComponentName = names(lib).className;
    // update app index to use text-4xl and text-center and the lib
    updateFile(
      `${app}/src/pages/index.astro`,
      `---
import { ${libComponentName} } from '@proj/${lib}';
---

<h1 class="text-4xl text-center">Welcome to ${app}!</h1>

<${libComponentName} />
`
    );
    // update lib component to use text-2xl
    updateFile(
      `${lib}/src/${libComponentName}.astro`,
      `<h2 class="text-2xl">Welcome to ${lib}!</h2>`
    );

    const output = await runNxCommandAsync(`build ${app}`);

    expect(stripAnsi(output.stdout)).toContain(
      `Successfully ran target build for project ${app}`
    );

    const stylesheetPath = findAstroBuiltStylesheet(app);
    expect(stylesheetPath).toBeTruthy();
    const stylesheet = readFile(stylesheetPath);
    // Tailwind CSS classes from the app
    expect(stylesheet).toContain('text-4xl');
    expect(stylesheet).toContain('text-center');
    // Tailwind CSS classes from the lib
    expect(stylesheet).toContain('text-2xl');
    // Tailwind CSS classes not used, should not be included
    expect(stylesheet).not.toContain('text-xl');
  }, 300_000);
});

function findAstroBuiltStylesheet(project: string, dir = ''): string | null {
  const outputDir = tmpProjPath(join('dist', project, dir));
  const stylesheetPath = readdirSync(outputDir).find(
    (f) => f.startsWith('index') && f.endsWith('.css')
  );

  if (stylesheetPath) {
    return join(outputDir, stylesheetPath);
  }

  const subDirs = readdirSync(outputDir).filter((f) =>
    statSync(join(outputDir, f)).isDirectory()
  );
  for (const subDir of subDirs) {
    const stylesheet = findAstroBuiltStylesheet(project, subDir);
    if (stylesheet) {
      return stylesheet;
    }
  }

  return null;
}
