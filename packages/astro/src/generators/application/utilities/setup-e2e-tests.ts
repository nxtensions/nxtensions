import {
  addProjectConfiguration,
  ensurePackage,
  getPackageManagerCommand,
  joinPathFragments,
  readProjectConfiguration,
  type GeneratorCallback,
  type Tree,
} from '@nx/devkit';
import { getInstalledNxVersion } from '../../utilities/versions';
import type { NormalizedGeneratorOptions } from '../schema';

export async function setupE2ETests(
  tree: Tree,
  options: NormalizedGeneratorOptions
): Promise<GeneratorCallback | undefined> {
  if (options.e2eTestRunner === 'cypress') {
    return await setupCypressE2ETests(tree, options);
  }
  if (options.e2eTestRunner === 'playwright') {
    return await setupPlaywrightE2ETests(tree, options);
  }
}

async function setupCypressE2ETests(
  tree: Tree,
  options: NormalizedGeneratorOptions
): Promise<GeneratorCallback> {
  const { configurationGenerator } = ensurePackage<
    typeof import('@nx/cypress')
  >('@nx/cypress', getInstalledNxVersion(tree));
  addProjectConfiguration(tree, options.e2eProjectName, {
    projectType: 'application',
    root: options.e2eProjectRoot,
    sourceRoot: joinPathFragments(options.e2eProjectRoot, 'src'),
    targets: {},
    tags: [],
    implicitDependencies: [options.projectName],
  });
  const cypressTask = await configurationGenerator(tree, {
    project: options.e2eProjectName,
    directory: 'src',
    skipFormat: true,
    devServerTarget: `${options.projectName}:dev`,
    baseUrl: 'http://localhost:4321',
    addPlugin: process.env.NX_ADD_PLUGINS !== 'false',
  });

  const e2eProject = readProjectConfiguration(tree, options.e2eProjectName);

  tree.write(
    `${e2eProject.sourceRoot}/e2e/app.cy.ts`,
    `import { getGreeting } from '../support/app.po';

describe('${options.projectName}', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.login('my-email@something.com', 'myPassword');

    getGreeting().contains('Welcome to Astro');
  });
});
`
  );

  return cypressTask;
}

async function setupPlaywrightE2ETests(
  tree: Tree,
  options: NormalizedGeneratorOptions
): Promise<GeneratorCallback> {
  const { configurationGenerator } = ensurePackage<
    typeof import('@nx/playwright')
  >('@nx/playwright', getInstalledNxVersion(tree));
  addProjectConfiguration(tree, options.e2eProjectName, {
    projectType: 'application',
    root: options.e2eProjectRoot,
    sourceRoot: joinPathFragments(options.e2eProjectRoot, 'src'),
    targets: {},
    tags: [],
    implicitDependencies: [options.projectName],
  });
  const playwrightTask = await configurationGenerator(tree, {
    project: options.e2eProjectName,
    directory: 'src',
    webServerAddress: 'http://localhost:4321',
    webServerCommand: `${getPackageManagerCommand().exec} nx run ${
      options.projectName
    }:dev`,
    addPlugin: process.env.NX_ADD_PLUGINS !== 'false',
    js: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    linter: 'eslint' as any,
    setParserOptionsProject: false,
    skipFormat: true,
    skipPackageJson: false,
  });

  const e2eProject = readProjectConfiguration(tree, options.e2eProjectName);

  tree.write(
    `${e2eProject.sourceRoot}/example.spec.ts`,
    `import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('main h1').innerText()).toContain('Welcome to Astro');
});
`
  );

  return playwrightTask;
}
