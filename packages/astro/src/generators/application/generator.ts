import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { initGenerator } from '../init/generator';
import { GeneratorOptions } from './schema';
import {
  addFiles,
  addProject,
  addIntegrationsPackages,
  normalizeOptions,
  setDefaultProject,
  setupE2ETests,
} from './utilities';

export async function applicationGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback | void> {
  const options = await normalizeOptions(tree, rawOptions);

  const initTask = await initGenerator(tree, {
    addCypressTests: options.addCypressTests,
  });

  const tasks: GeneratorCallback[] = [];
  tasks.push(initTask);

  addProject(tree, options);
  setDefaultProject(tree, options.projectName);
  addFiles(tree, options);

  const e2eTask = await setupE2ETests(tree, options);
  if (e2eTask) {
    tasks.push(e2eTask);
  }

  const integrationsTask = addIntegrationsPackages(tree, options.integrations);
  if (integrationsTask) {
    tasks.push(integrationsTask);
  }

  await formatFiles(tree);

  return () => tasks.forEach((task) => task && task());
}

export default applicationGenerator;
