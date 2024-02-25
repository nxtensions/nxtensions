import { formatFiles, type Tree } from '@nx/devkit';
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
  return await componentGeneratorInternal(tree, {
    nameAndDirectoryFormat: 'derived',
    ...rawOptions,
  });
}

export async function componentGeneratorInternal(
  tree: Tree,
  rawOptions: GeneratorOptions
) {
  const options = await normalizeOptions(tree, rawOptions);

  addComponentFile(tree, options);
  const styleTask = addStyleDependencies(tree, options);
  await formatFiles(tree);

  return styleTask;
}

export default componentGenerator;
