import { formatFiles, type GeneratorCallback, type Tree } from '@nx/devkit';
import { addDependenciesToPackageJson } from '../../utilities/package-json';
import { initGenerator } from '../init/generator';
import { astroCheckVersion, typescriptVersion } from '../utilities/versions';
import type { GeneratorOptions } from './schema';
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

  const tasks: GeneratorCallback[] = [];
  const initTask = await initGenerator(tree, { addCypressTests: false });
  tasks.push(initTask);

  const depsTask = addDependenciesToPackageJson(
    tree,
    {},
    {
      '@astrojs/check': astroCheckVersion,
      typescript: typescriptVersion,
    }
  );
  tasks.push(depsTask);

  addProject(tree, options);
  addFiles(tree, options);
  addPathMapping(tree, options);

  await formatFiles(tree);

  return () => tasks.forEach((task) => task());
}

export default libraryGenerator;
