import { ExecutorContext, logger } from '@nrwl/devkit';
import { ChildProcess, fork } from 'child_process';
import { removeSync } from 'fs-extra';
import { join } from 'path';
import { BuildExecutorOptions } from './schema';

let childProcess: ChildProcess;

export async function buildExecutor(
  options: BuildExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  options = normalizeOptions(options);

  const projectRoot = join(
    context.root,
    context.workspace.projects[context.projectName].root
  );

  // TODO: use what's in the Astro config once the CLI API is available.
  // See https://github.com/snowpackjs/astro/issues/1483.
  const outputPath = context.target?.outputs?.[0] ?? `dist/${projectRoot}`;

  if (options.deleteOutputPath) {
    removeSync(outputPath);
  }

  try {
    const exitCode = await runCliBuild(projectRoot, options);

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

export default buildExecutor;

function runCliBuild(projectRoot: string, options: BuildExecutorOptions) {
  return new Promise((resolve, reject) => {
    // TODO: use Astro CLI API once it's available.
    // See https://github.com/snowpackjs/astro/issues/1483.
    childProcess = fork(
      require.resolve('astro'),
      ['build', ...getAstroBuildArgs(options)],
      {
        cwd: projectRoot,
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

function normalizeOptions(options: BuildExecutorOptions): BuildExecutorOptions {
  return {
    deleteOutputPath: true,
    sitemap: true,
    ...options,
  };
}

function getAstroBuildArgs(options: BuildExecutorOptions): string[] {
  const args: string[] = [];

  if (options.config) {
    args.push('--config', options.config);
  }
  if (options.drafts) {
    args.push('--drafts');
  }
  if (options.experimentalSsr) {
    args.push('--experimental-ssr');
  }
  if (options.experimentalStaticBuild) {
    args.push('--experimental-static-build');
  }
  if (options.silent) {
    args.push('--silent');
  }
  if (options.sitemap === false) {
    args.push('--no-sitemap');
  }
  if (options.verbose) {
    args.push('--verbose');
  }

  return args;
}
