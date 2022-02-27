import {
  readWorkspaceConfiguration,
  Tree,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

export function addCheckToCacheableOperations(tree: Tree): void {
  const workspace = readWorkspaceConfiguration(tree);
  if (!workspace.tasksRunnerOptions) {
    return;
  }

  let shouldUpdate = false;
  Object.keys(workspace.tasksRunnerOptions).forEach((taskRunnerName) => {
    const taskRunner = workspace.tasksRunnerOptions[taskRunnerName];
    if (!taskRunner.options?.cacheableOperations?.includes('check')) {
      shouldUpdate = true;
      taskRunner.options = {
        ...(taskRunner.options ?? {}),
        cacheableOperations: Array.from(
          new Set([...(taskRunner.options?.cacheableOperations ?? []), 'check'])
        ),
      };
    }
  });

  if (shouldUpdate) {
    updateWorkspaceConfiguration(tree, workspace);
  }
}
