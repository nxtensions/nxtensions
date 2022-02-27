import {
  readWorkspaceConfiguration,
  Tree,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

export function setDefaultProject(tree: Tree, projectName: string): void {
  const workspace = readWorkspaceConfiguration(tree);
  if (!workspace.defaultProject) {
    workspace.defaultProject = projectName;
    updateWorkspaceConfiguration(tree, workspace);
  }
}
