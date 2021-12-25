import { Tree, updateJson } from '@nrwl/devkit';

export function addVSCodeRecommendedExtensions(tree: Tree): void {
  if (!tree.exists('.vscode/extensions.json')) {
    return;
  }

  updateJson(tree, '.vscode/extensions.json', (json) => {
    json.recommendations = json.recommendations ?? [];

    const extension = 'astro-build.astro-vscode';
    if (!json.recommendations.includes(extension)) {
      json.recommendations.push(extension);
    }

    return json;
  });
}
