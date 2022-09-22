import type { ExecutorContext } from '@nrwl/devkit';
import { logger } from '@nrwl/devkit';
import type { ChildProcess } from 'child_process';
import { fork } from 'child_process';
import type { CheckExecutorOptions } from './schema';

let childProcess: ChildProcess;

export async function checkExecutor(
  _options: CheckExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const projectRoot = context.workspace.projects[context.projectName].root;

  try {
    const exitCode = await runCliCheck(context.root, projectRoot);

    return { success: exitCode === 0 };
  } catch (e) {
    logger.error(e);

    return { success: false };
  } finally {
    if (childProcess) {
      childProcess.kill();
    }
  }
}

export default checkExecutor;

function runCliCheck(workspaceRoot: string, projectRoot: string) {
  return new Promise((resolve, reject) => {
    // TODO: use Astro CLI API once it's available.
    // See https://github.com/snowpackjs/astro/issues/1483.
    childProcess = fork(
      require.resolve('astro'),
      ['check', ...getAstroBuildArgs(projectRoot)],
      {
        cwd: workspaceRoot,
        stdio: 'inherit',
      }
    );

    // Ensure the child process is killed when the parent exits
    process.on('exit', () => childProcess.kill());
    process.on('SIGTERM', () => childProcess.kill());

    childProcess.on('error', (err) => {
      reject(err);
    });
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
}

function getAstroBuildArgs(projectRoot: string): string[] {
  const args: string[] = ['--root', projectRoot];

  return args;
}
