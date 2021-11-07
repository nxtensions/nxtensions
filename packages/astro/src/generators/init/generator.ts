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

  return addDependenciesToPackageJson(tree, {}, { astro: astroVersion });
}

export default initGenerator;
