import {
  addProjectConfiguration,
  ensurePackage,
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
  if (!options.addCypressTests) {
    return undefined;
  }

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
});`
  );

  return cypressTask;
}
