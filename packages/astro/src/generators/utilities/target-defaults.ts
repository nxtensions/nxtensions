import {
  readNxJson,
  updateNxJson,
  type TargetConfiguration,
  type Tree,
} from '@nx/devkit';

export function addTargetDefaults(
  tree: Tree,
  targetOrExecutor: string,
  targetDefaults: Partial<TargetConfiguration>
): void {
  const nxJson = readNxJson(tree);
  nxJson.targetDefaults ??= {};
  nxJson.targetDefaults[targetOrExecutor] ??= targetDefaults;
  updateNxJson(tree, nxJson);
}
