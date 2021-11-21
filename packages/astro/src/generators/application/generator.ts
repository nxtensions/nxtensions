import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { initGenerator } from '../init/generator';
import { GeneratorOptions } from './schema';
import {
  addFiles,
  addProject,
  installRenderers,
  normalizeOptions,
  setupE2ETests,
} from './utilities';

export async function applicationGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback | void> {
  const options = normalizeOptions(tree, rawOptions);

  const initTask = initGenerator(tree, {
    addCypressTests: options.addCypressTests,
  });

  const tasks: GeneratorCallback[] = [];
  tasks.push(initTask);

  addProject(tree, options);
  addFiles(tree, options);

  const e2eTask = await setupE2ETests(tree, options);
  if (e2eTask) {
    tasks.push(e2eTask);
  }

  const renderersTask = installRenderers(tree, options.renderers);
  if (renderersTask) {
    tasks.push(renderersTask);
  }

  await formatFiles(tree);

  return () => tasks.forEach((task) => task());
}

export default applicationGenerator;
