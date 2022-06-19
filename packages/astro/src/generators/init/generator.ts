import { cypressInitGenerator } from '@nrwl/cypress';
import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { GeneratorOptions } from './schema';
import {
  addProjectGraphPlugin,
  updateGitignore,
  addVSCodeRecommendedExtensions,
  addCheckToCacheableOperations,
  patchNxCli,
} from './utilities';
import { astroVersion } from './versions';

export function initGenerator(
  tree: Tree,
  options: GeneratorOptions
): GeneratorCallback {
  addProjectGraphPlugin(tree);
  addCheckToCacheableOperations(tree);
  updateGitignore(tree);
  addVSCodeRecommendedExtensions(tree);
  patchNxCli(tree);

  const tasks: GeneratorCallback[] = [];
  if (options.addCypressTests !== false) {
    const cypressTask = cypressInitGenerator(tree, {});
    tasks.push(cypressTask);
  }

  const depsTask = addDependenciesToPackageJson(
    tree,
    {},
    { astro: astroVersion }
  );
  tasks.push(depsTask);

  return () => tasks.forEach((task) => task());
}

export default initGenerator;
