import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  NxJsonConfiguration,
  readJson,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { astroVersion } from './versions';

export function initGenerator(
  tree: Tree,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: Record<string, never> = {}
): GeneratorCallback {
  const nxJson = readJson<NxJsonConfiguration>(tree, 'nx.json');
  nxJson.plugins = nxJson.plugins || [];

  if (!nxJson.plugins.includes('@nxtensions/astro')) {
    nxJson.plugins.push('@nxtensions/astro');
    writeJson(tree, 'nx.json', nxJson);
  }

  if (tree.exists('.gitignore')) {
    let gitignore = tree.read('.gitignore', 'utf-8');

    if (/^\/node_modules$/gm.test(gitignore)) {
      gitignore = gitignore.replace(/^\/node_modules$/gm, 'node_modules');
      tree.write('.gitignore', gitignore);
    } else if (!/^node_modules$/gm.test(gitignore)) {
      gitignore += '\nnode_modules\n';
      tree.write('.gitignore', gitignore);
    }
  }

  return addDependenciesToPackageJson(tree, {}, { astro: astroVersion });
}

export default initGenerator;
