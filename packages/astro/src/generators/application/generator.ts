import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { initGenerator } from '../init/generator';
import { GeneratorOptions } from './schema';
import {
  addFiles,
  addProject,
  installRenderers,
  normalizeOptions,
} from './utilities';

export async function applicationGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback | void> {
  const options = normalizeOptions(tree, rawOptions);

  const initTask = initGenerator(tree);

  const tasks: GeneratorCallback[] = [];
  tasks.push(initTask);

  addProject(tree, options);
  addFiles(tree, options);

  const renderersTask = installRenderers(tree, options.renderers);
  if (renderersTask) {
    tasks.push(renderersTask);
  }

  await formatFiles(tree);

  return () => tasks.forEach((task) => task());
}

export default applicationGenerator;
