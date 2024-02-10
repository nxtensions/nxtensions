jest.mock('child_process');

import { ExecutorContext } from '@nx/devkit';
import { spawn } from 'child_process';
import { checkExecutor } from './executor';

type ChildProcessEvents = 'error' | 'exit';
type ChildProcessEventStore = { [event in ChildProcessEvents]?: unknown };

const childProcessEventStore: ChildProcessEventStore = {};

function emitChildProcessEvent(
  eventName: ChildProcessEvents,
  value: unknown
): void {
  childProcessEventStore[eventName] = value;
}

describe('Check Executor', () => {
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

    (spawn as jest.Mock).mockImplementation(() => ({
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

    const result = await checkExecutor({}, context);

    expect(result.success).toBe(true);
    expect(spawn).toHaveBeenCalled();
  });

  test('should fail if exit code is different than 0', async () => {
    emitChildProcessEvent('exit', 1);

    const result = await checkExecutor({}, context);

    expect(result.success).toBe(false);
    expect(spawn).toHaveBeenCalled();
  });

  test('should fail when the spawned process errors', async () => {
    emitChildProcessEvent('error', new Error('Check failed!'));

    const result = await checkExecutor({}, context);

    expect(result.success).toBe(false);
    expect(spawn).toHaveBeenCalled();
  });
});
