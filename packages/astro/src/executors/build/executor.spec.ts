jest.mock('child_process');
jest.mock('fs-extra', () => ({
  ...jest.requireActual<object>('fs-extra'),
  removeSync: jest.fn(),
}));

import { ExecutorContext } from '@nrwl/devkit';
import { fork } from 'child_process';
import * as fsExtra from 'fs-extra';
import { buildExecutor } from './executor';

type ChildProcessEvents = 'error' | 'exit';
type ChildProcessEventStore = { [event in ChildProcessEvents]?: unknown };

const childProcessEventStore: ChildProcessEventStore = {};

function emitChildProcessEvent(
  eventName: ChildProcessEvents,
  value: unknown
): void {
  childProcessEventStore[eventName] = value;
}

describe('Build Executor', () => {
  let context: ExecutorContext;

  beforeEach(() => {
    context = {
      projectName: 'app1',
      root: 'root',
      target: {
        outputs: ['{workspaceRoot}/dist/apps/app1'],
      },
      workspace: {
        projects: {
          app1: { root: 'apps/app1' },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (fork as jest.Mock).mockImplementation(() => ({
      kill: jest.fn(),
      on: (eventName, cb) => {
        if (childProcessEventStore[eventName] !== undefined) {
          cb(childProcessEventStore[eventName]);
        }
      },
    }));

    jest.clearAllMocks();
  });

  test('should run successfully', async () => {
    emitChildProcessEvent('exit', 0);

    const result = await buildExecutor({}, context);

    expect(result.success).toBe(true);
    expect(fork).toHaveBeenCalled();
  });

  test('should fail if exit code is different than 0', async () => {
    emitChildProcessEvent('exit', 1);

    const result = await buildExecutor({}, context);

    expect(result.success).toBe(false);
    expect(fork).toHaveBeenCalled();
  });

  test('should fail when the forked process errors', async () => {
    emitChildProcessEvent('error', new Error('Build failed!'));

    const result = await buildExecutor({}, context);

    expect(result.success).toBe(false);
    expect(fork).toHaveBeenCalled();
  });

  test('should delete output path', async () => {
    emitChildProcessEvent('exit', 0);

    await buildExecutor({ deleteOutputPath: true }, context);

    expect(fsExtra.removeSync).toHaveBeenCalledWith(
      expect.stringContaining('dist/apps/app1')
    );
  });

  test('should not delete output path when "deleteOuputPath" is set to false', async () => {
    emitChildProcessEvent('exit', 0);

    await buildExecutor({ deleteOutputPath: false }, context);

    expect(fsExtra.removeSync).not.toHaveBeenCalled();
  });
});
