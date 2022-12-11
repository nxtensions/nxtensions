import type { Tree } from '@nrwl/devkit';
import {
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration as writeWorkspaceConfiguration,
} from '@nrwl/devkit';
import { gte } from 'semver';

export function updateWorkspaceConfiguration(tree: Tree): void {
  const workspace = readWorkspaceConfiguration(tree);

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

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version: nxVersion } = require('nx/package.json');
  // inputs config started to be generated in Nx v14.7.0
  if (
    gte(nxVersion, '14.7.0') &&
    workspace.targetDefaults &&
    workspace.namedInputs?.production &&
    !workspace.targetDefaults.check
  ) {
    workspace.targetDefaults.check = { inputs: ['production', '^production'] };
  }

  writeWorkspaceConfiguration(tree, workspace);
}
