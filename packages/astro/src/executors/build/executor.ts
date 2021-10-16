import { ExecutorContext, logger } from '@nrwl/devkit';
import { ChildProcess, fork } from 'child_process';
import { removeSync } from 'fs-extra';
import { BuildExecutorSchema } from './schema';

let childProcess: ChildProcess;

export async function buildExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const projectRoot = context.workspace.projects[context.projectName].root;
  // TODO: replace with what is in astro.config.mjs when astro js appi is available
  const outputPath = context.target?.outputs?.[0] ?? `dist/${projectRoot}`;

  if (options.deleteOutputPath) {
    removeSync(outputPath);
  }

  try {
    await runCliBuild(projectRoot);

    return { success: true };
  } catch (e) {
    logger.error(e);

    return { success: false };
  } finally {
    if (childProcess) {
      childProcess.kill();
    }
  }
}

export default buildExecutor;

function runCliBuild(projectRoot: string) {
  return new Promise((resolve, reject) => {
    childProcess = fork(require.resolve('astro'), ['build'], {
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
