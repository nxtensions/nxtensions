import { formatFiles, Tree } from '@nrwl/devkit';
import type { GeneratorOptions } from './schema';
import {
  addComponentFile,
  addStyleDependencies,
  normalizeOptions,
} from './utilities';

export async function componentGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
) {
  const options = normalizeOptions(tree, rawOptions);

  addComponentFile(tree, options);
  const styleTask = addStyleDependencies(tree, options);
  await formatFiles(tree);

  return styleTask;
}

export default componentGenerator;
