import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependenciesToPackageJson } from '@nrwl/devkit';
import { importNrwlCypress } from '../utilities/cypress';
import type { GeneratorOptions } from './schema';
import {
  addProjectGraphPlugin,
  addVSCodeRecommendedExtensions,
  patchNxCli,
  setupNpmrc,
  updateGitignore,
  updateWorkspaceConfiguration,
} from './utilities';
import { astroVersion } from './versions';

export async function initGenerator(
  tree: Tree,
  options: GeneratorOptions
): Promise<GeneratorCallback> {
  addProjectGraphPlugin(tree);
  updateWorkspaceConfiguration(tree);
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
