import type { Tree } from '@nx/devkit';
import { readNxJson, updateNxJson } from '@nx/devkit';

export function updateWorkspaceConfiguration(tree: Tree): void {
  const nxJson = readNxJson(tree);

  const productionFileSet = nxJson.namedInputs?.production;
  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults.check ??= {};
  nxJson.targetDefaults.check.cache ??= true;
  nxJson.targetDefaults.check.inputs ??= productionFileSet
    ? ['production', '^production']
    : ['default', '^default'];

  updateNxJson(tree, nxJson);
}
