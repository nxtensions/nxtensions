import {
  readWorkspaceConfiguration,
  Tree,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

export function addProjectGraphPlugin(tree: Tree): void {
  const workspace = readWorkspaceConfiguration(tree);
  workspace.plugins ??= [];
  if (!workspace.plugins.includes('@nxtensions/astro')) {
    workspace.plugins.push('@nxtensions/astro');
    updateWorkspaceConfiguration(tree, workspace);
  }
}
