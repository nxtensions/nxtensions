import { NxJsonConfiguration, Tree, updateJson } from '@nrwl/devkit';

export function addProjectGraphPlugin(tree: Tree): void {
  updateJson<NxJsonConfiguration>(tree, 'nx.json', (json) => {
    json.plugins = json.plugins ?? [];

    if (!json.plugins.includes('@nxtensions/astro')) {
      json.plugins.push('@nxtensions/astro');
    }

    return json;
  });
}
