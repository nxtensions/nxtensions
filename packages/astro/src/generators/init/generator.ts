import { cypressInitGenerator } from '@nrwl/cypress';
import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  NxJsonConfiguration,
  readJson,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { GeneratorOptions } from './schema';
import { astroVersion } from './versions';

export function initGenerator(
  tree: Tree,
  options: GeneratorOptions
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

  const tasks: GeneratorCallback[] = [];
  if (options.addCypressTests !== false) {
    const cypressTask = cypressInitGenerator(tree);
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
