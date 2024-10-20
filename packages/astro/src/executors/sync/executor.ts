import { logger, type ExecutorContext } from '@nx/devkit';
import { fork, type ChildProcess } from 'child_process';
import { getAstroCliPath } from '../../utilities/astro';
import type { SyncExecutorOptions } from './schema';

let childProcess: ChildProcess;

export async function syncExecutor(
  _options: SyncExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName].root;

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
    // TODO: use Astro CLI API: https://docs.astro.build/en/reference/cli-reference/#advanced-apis-experimental
    childProcess = fork(
      getAstroCliPath(),
      ['sync', ...getAstroSyncArgs(projectRoot)],
      {
        cwd: workspaceRoot,
        env: { ...process.env, FORCE_COLOR: 'true' },
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

function getAstroSyncArgs(projectRoot: string): string[] {
  const args: string[] = ['--root', projectRoot];

  return args;
}
