import type { GeneratorCallback, Tree } from '@nx/devkit';
import { ensurePackage, readNxJson } from '@nx/devkit';
import { addDependenciesToPackageJson } from '../../utilities/package-json';
import { astroVersion, getInstalledNxVersion } from '../utilities/versions';
import type { GeneratorOptions } from './schema';
import {
  addProjectGraphPlugin,
  addVSCodeRecommendedExtensions,
  setupNpmrc,
  updateGitignore,
  updateWorkspaceConfiguration,
} from './utilities';

export async function initGenerator(
  tree: Tree,
  options: GeneratorOptions
): Promise<GeneratorCallback> {
  const workspace = readNxJson(tree);
  if (workspace.plugins?.includes('@nxtensions/astro')) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const tasks: GeneratorCallback[] = [];
  const { initGenerator: jsInitGenerator } = ensurePackage<
    typeof import('@nx/js')
  >('@nx/js', getInstalledNxVersion(tree));
  const jsTask = await jsInitGenerator(tree, { skipFormat: true });
  tasks.push(jsTask);

  addProjectGraphPlugin(tree);
  updateWorkspaceConfiguration(tree);
  updateGitignore(tree);
  addVSCodeRecommendedExtensions(tree);
  setupNpmrc(tree);

  if (options.addCypressTests !== false) {
    const { cypressInitGenerator } = ensurePackage<
      typeof import('@nx/cypress')
    >('@nx/cypress', getInstalledNxVersion(tree));
    const cypressTask = await cypressInitGenerator(tree, {});
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
