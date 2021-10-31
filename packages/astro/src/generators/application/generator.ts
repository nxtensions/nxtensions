import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { GeneratorOptions } from './schema';
import {
  addFiles,
  addProject,
  installRenderers,
  normalizeOptions,
} from './utilities';

// dummy comment
export async function applicationGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback | void> {
  const options = normalizeOptions(tree, rawOptions);

  addProject(tree, options);
  addFiles(tree, options);
  const renderersTask = installRenderers(tree, options.renderers);

  await formatFiles(tree);

  if (renderersTask) {
    return renderersTask;
  }
}

export default applicationGenerator;
