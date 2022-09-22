import { ExecutorContext, logger } from '@nrwl/devkit';
import { ChildProcess, fork } from 'child_process';
import stripAnsi from 'strip-ansi';
import { PreviewExecutorOptions } from './schema';

let childProcess: ChildProcess;

export async function* previewExecutor(
  options: PreviewExecutorOptions,
  context: ExecutorContext
): AsyncGenerator<{ baseUrl?: string; success: boolean }> {
  const projectRoot = context.workspace.projects[context.projectName].root;

  try {
    const success = await runCliPreview(context.root, projectRoot, options);

    // TODO: build url from what's in the Astro config once the CLI API is available.
    // See https://github.com/snowpackjs/astro/issues/1483.
    yield { baseUrl: `http://localhost:3000`, success };

    // This Promise intentionally never resolves, leaving the process running
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await new Promise<{ success: boolean }>(() => {});
  } catch (e) {
    logger.error(e);

    yield { success: false };
  } finally {
    if (childProcess) {
      childProcess.kill();
    }
  }
}

export default previewExecutor;

function runCliPreview(
  workspaceRoot: string,
  projectRoot: string,
  options: PreviewExecutorOptions
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // TODO: use Astro CLI API once it's available.
    // See https://github.com/snowpackjs/astro/issues/1483.
    childProcess = fork(
      require.resolve('astro'),
      ['preview', ...getAstroPreviewArgs(projectRoot, options)],
      {
        cwd: workspaceRoot,
        env: { ...process.env, FORCE_COLOR: 'true' },
        stdio: 'pipe',
      }
    );

    // Ensure the child process is killed when the parent exits
    process.on('exit', () => childProcess.kill());
    process.on('SIGTERM', () => childProcess.kill());

    const serverStartedRegex =
      /(astro +v\d{1,3}.\d{1,3}.\d{1,3} started in \d+ms|Server started)/;
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);

      if (serverStartedRegex.test(stripAnsi(data.toString()))) {
        resolve(true);
      }
    });
    childProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    childProcess.on('error', (err) => {
      reject(err);
    });
    childProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(
          new Error('Could not start Astro Preview Server. See errors above.')
        );
      }
    });
  });
}

function getAstroPreviewArgs(
  projectRoot: string,
  options: PreviewExecutorOptions
): string[] {
  const args: string[] = ['--root', projectRoot];

  if (options.config) {
    args.push('--config', options.config);
  }
  if (options.host !== undefined) {
    args.push('--host', options.host.toString());
  }
  if (options.port) {
    args.push('--port', options.port.toString());
  }
  if (options.silent) {
    args.push('--silent');
  }
  if (options.site) {
    args.push('site', options.site);
  }
  if (options.verbose) {
    args.push('--verbose');
  }

  return args;
}
