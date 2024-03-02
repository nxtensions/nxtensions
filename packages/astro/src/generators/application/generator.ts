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
  addIntegrationsPackages,
  addProject,
  configureTailwindIntegration,
  normalizeOptions,
  setDefaultProject,
  setupE2ETests,
} from './utilities';

export async function applicationGenerator(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback | void> {
  return await applicationGeneratorInternal(tree, {
    projectNameAndRootFormat: 'derived',
    ...rawOptions,
  });
}

export async function applicationGeneratorInternal(
  tree: Tree,
  rawOptions: GeneratorOptions
): Promise<GeneratorCallback | void> {
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
  setDefaultProject(tree, options.projectName);
  addFiles(tree, options);
  await configureTailwindIntegration(tree, options);

  const e2eTask = await setupE2ETests(tree, options);
  if (e2eTask) {
    tasks.push(e2eTask);
  }

  const integrationsTask = addIntegrationsPackages(tree, options.integrations);
  if (integrationsTask) {
    tasks.push(integrationsTask);
  }

  await formatFiles(tree);

  return () => tasks.forEach((task) => task());
}

export default applicationGenerator;
