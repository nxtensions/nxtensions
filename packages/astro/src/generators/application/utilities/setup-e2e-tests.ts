import {
  addProjectConfiguration,
  ensurePackage,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
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
  const { Linter } = ensurePackage<typeof import('@nx/eslint')>(
    '@nx/eslint',
    getInstalledNxVersion(tree)
  );
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
    linter: Linter.EsLint,
    skipFormat: true,
    devServerTarget: `${options.projectName}:dev`,
    baseUrl: 'http://localhost:4200',
  });

  const e2eProject = readProjectConfiguration(tree, options.e2eProjectName);
  e2eProject.targets.e2e.options.devServerTarget =
    e2eProject.targets.e2e.options.devServerTarget.replace(':serve', ':dev');
  delete e2eProject.targets.e2e.configurations;
  updateProjectConfiguration(tree, options.e2eProjectName, e2eProject);

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
