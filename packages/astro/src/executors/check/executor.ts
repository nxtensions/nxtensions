import { ExecutorContext, logger } from '@nrwl/devkit';
import { ChildProcess, fork } from 'child_process';
import { join } from 'path';
import { CheckExecutorOptions } from './schema';

let childProcess: ChildProcess;

export async function checkExecutor(
  options: CheckExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const projectRoot = join(
    context.root,
    context.workspace.projects[context.projectName].root
  );

  try {
    const exitCode = await runCliCheck(projectRoot);

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

function runCliCheck(projectRoot: string) {
  return new Promise((resolve, reject) => {
    // TODO: use Astro CLI API once it's available.
    // See https://github.com/snowpackjs/astro/issues/1483.
    childProcess = fork(require.resolve('astro'), ['check'], {
      cwd: projectRoot,
      stdio: 'inherit',
    });

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
