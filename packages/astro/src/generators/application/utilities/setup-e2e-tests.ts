import { cypressProjectGenerator } from '@nrwl/cypress';
import {
  GeneratorCallback,
  names,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { NormalizedGeneratorOptions } from '../schema';

export async function setupE2ETests(
  tree: Tree,
  options: NormalizedGeneratorOptions
): Promise<GeneratorCallback | undefined> {
  if (!options.addCypressTests) {
    return undefined;
  }

  const name = `${names(options.name).fileName}-e2e`;
  const directory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const e2eProjectName = directory.replace(/\//g, '-');

  const cypressTask = await cypressProjectGenerator(tree, {
    name,
    project: options.projectName,
    directory: options.directory,
    linter: Linter.EsLint,
    standaloneConfig: options.standaloneConfig,
    skipFormat: true,
  });

  const e2eProject = readProjectConfiguration(tree, e2eProjectName);
  e2eProject.targets.e2e.options.devServerTarget =
    e2eProject.targets.e2e.options.devServerTarget.replace(':serve', ':dev');
  delete e2eProject.targets.e2e.configurations;
  updateProjectConfiguration(tree, e2eProjectName, e2eProject);

  return cypressTask;
}
