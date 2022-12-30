import type { ExecutorContext } from '@nrwl/devkit';
import { logger } from '@nrwl/devkit';
import type { ChildProcess } from 'child_process';
import { fork } from 'child_process';
import { lt } from 'semver';
import { getInstalledAstroVersion } from '../../utilities/versions';
import type { SyncExecutorOptions } from './schema';

let childProcess: ChildProcess;

export async function syncExecutor(
  _options: SyncExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const astroVersion = getInstalledAstroVersion();
  if (astroVersion && lt(astroVersion, '1.8.0')) {
    throw new Error(
      `The Astro "sync" CLI command is only available from version 1.8.0. Your installed version is "${astroVersion}".`
    );
  }

  const projectRoot = context.workspace.projects[context.projectName].root;

  try {
    const exitCode = await runCliSync(context.root, projectRoot);

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

export default syncExecutor;

function runCliSync(workspaceRoot: string, projectRoot: string) {
  return new Promise((resolve, reject) => {
    childProcess = fork(
      require.resolve('astro'),
      ['sync', ...getAstroBuildArgs(projectRoot)],
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
