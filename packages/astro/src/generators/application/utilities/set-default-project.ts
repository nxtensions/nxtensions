import { readNxJson, Tree, updateNxJson } from '@nx/devkit';

export function setDefaultProject(tree: Tree, projectName: string): void {
  const workspace = readNxJson(tree);
  if (!workspace.defaultProject) {
    workspace.defaultProject = projectName;
    updateNxJson(tree, workspace);
  }
}
