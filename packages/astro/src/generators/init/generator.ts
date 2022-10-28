import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { importNrwlCypress } from '../utilities/cypress';
import { GeneratorOptions } from './schema';
import {
  addProjectGraphPlugin,
  updateGitignore,
  addVSCodeRecommendedExtensions,
  addCheckToCacheableOperations,
  patchNxCli,
  setupNpmrc,
} from './utilities';
import { astroVersion } from './versions';

export async function initGenerator(
  tree: Tree,
  options: GeneratorOptions
): Promise<GeneratorCallback> {
  addProjectGraphPlugin(tree);
  addCheckToCacheableOperations(tree);
  updateGitignore(tree);
  addVSCodeRecommendedExtensions(tree);
  patchNxCli(tree);
  setupNpmrc(tree);

  const tasks: GeneratorCallback[] = [];
  if (options.addCypressTests !== false) {
    const { cypressInitGenerator } = await importNrwlCypress();
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
