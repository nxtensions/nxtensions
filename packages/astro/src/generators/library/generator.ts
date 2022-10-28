import { formatFiles, GeneratorCallback, Tree } from '@nrwl/devkit';
import { initGenerator } from '../init/generator';
import { GeneratorOptions } from './schema';
import {
  addFiles,
  addPathMapping,
  addProject,
  normalizeOptions,
} from './utilities';

export async function libraryGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback> {
  if (rawOptions.publishable && !rawOptions.importPath) {
    throw new Error(
      'For publishable libraries the "--importPath" must be provided. Please note it needs to be a valid npm package name (e.g. my-lib or @my-org/my-lib).'
    );
  }

  const options = normalizeOptions(tree, rawOptions);

  const initTask = await initGenerator(tree, { addCypressTests: false });

  addProject(tree, options);
  addFiles(tree, options);
  addPathMapping(tree, options);

  await formatFiles(tree);

  return initTask;
}

export default libraryGenerator;
