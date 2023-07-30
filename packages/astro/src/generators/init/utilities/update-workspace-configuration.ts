import type { Tree } from '@nx/devkit';
import { readNxJson, updateNxJson } from '@nx/devkit';

export function updateWorkspaceConfiguration(tree: Tree): void {
  const workspace = readNxJson(tree);

  if (workspace.tasksRunnerOptions) {
    Object.keys(workspace.tasksRunnerOptions).forEach((taskRunnerName) => {
      const taskRunner = workspace.tasksRunnerOptions[taskRunnerName];
      if (!taskRunner.options?.cacheableOperations?.includes('check')) {
        taskRunner.options = {
          ...(taskRunner.options ?? {}),
          cacheableOperations: [
            ...(taskRunner.options?.cacheableOperations ?? []),
            'check',
          ],
        };
      }
    });
  }

  if (
    workspace.targetDefaults &&
    workspace.namedInputs?.production &&
    !workspace.targetDefaults.check
  ) {
    workspace.targetDefaults.check = { inputs: ['production', '^production'] };
  }

  updateNxJson(tree, workspace);
}
