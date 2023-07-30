import { readNxJson, Tree, updateNxJson } from '@nx/devkit';

export function addProjectGraphPlugin(tree: Tree): void {
  const workspace = readNxJson(tree);
  workspace.plugins ??= [];
  if (!workspace.plugins.includes('@nxtensions/astro')) {
    workspace.plugins.push('@nxtensions/astro');
    updateNxJson(tree, workspace);
  }
}
