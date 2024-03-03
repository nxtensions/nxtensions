import {
  ensurePackage,
  formatFiles,
  type GeneratorCallback,
  type Tree,
} from '@nx/devkit';
import { addDependenciesToPackageJson } from '../../utilities/package-json';
import { initGenerator } from '../init/generator';
import {
  astroCheckVersion,
  astroVersion,
  getInstalledNxVersion,
  typescriptVersion,
} from '../utilities/versions';
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
  return await libraryGeneratorInternal(tree, {
    projectNameAndRootFormat: 'derived',
    ...rawOptions,
  });
}

export async function libraryGeneratorInternal(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback> {
  if (rawOptions.publishable && !rawOptions.importPath) {
    throw new Error(
      'For publishable libraries the "--importPath" must be provided. Please note it needs to be a valid npm package name (e.g. my-lib or @my-org/my-lib).'
    );
  }

  const options = await normalizeOptions(tree, rawOptions);

  const tasks: GeneratorCallback[] = [];
  const { initGenerator: jsInitGenerator } = ensurePackage<
    typeof import('@nx/js')
  >('@nx/js', getInstalledNxVersion(tree));
  const jsTask = await jsInitGenerator(tree, { skipFormat: true });
  tasks.push(jsTask);

  await initGenerator(tree, {});

  const depsTask = addDependenciesToPackageJson(
    tree,
    {},
    {
      astro: astroVersion,
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
