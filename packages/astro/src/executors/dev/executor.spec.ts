jest.mock('child_process');

import { ExecutorContext } from '@nrwl/devkit';
import { fork } from 'child_process';
import { devExecutor } from './executor';

type ChildProcessEvents = 'error' | 'exit';
type ChildProcessEventStore = { [event in ChildProcessEvents]?: unknown };
type ChildProcessStdio = 'stdout' | 'stderr';
type ChildProcessStdioDataEventsStore = {
  [event in ChildProcessStdio]?: unknown;
};

const childProcessEventStore: ChildProcessEventStore = {};
const childProcessStdioDataEventStore: ChildProcessStdioDataEventsStore = {};

function emitChildProcessEvent(
  eventName: ChildProcessEvents,
  value: unknown
): void {
  childProcessEventStore[eventName] = value;
}
function emitChildProcessStdioData(
  stdio: 'stdout' | 'stderr',
  value: unknown
): void {
  childProcessStdioDataEventStore[stdio] = value;
}

describe('Dev Executor', () => {
  let context: ExecutorContext;

  beforeEach(() => {
    context = {
      projectName: 'app1',
      root: 'root',
      target: {
        outputs: ['dist/apps/app1'],
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
      stdout: {
        on: (_, cb) => {
          if (childProcessStdioDataEventStore['stdout']) {
            cb(childProcessStdioDataEventStore['stdout']);
          }
        },
      },
      stderr: {
        on: (_, cb) => {
          if (childProcessStdioDataEventStore['stderr']) {
            cb(childProcessStdioDataEventStore['stderr']);
          }
        },
      },
    }));

    emitChildProcessEvent('exit', 0);
  });

  test('should run successfully', async () => {
    emitChildProcessStdioData('stdout', 'Server started');

    const resultIterator = devExecutor({}, context);

    const result = (await resultIterator.next()).value;
    expect(result.success).toBe(true);
    expect(fork).toHaveBeenCalled();
  });

  test('should fail if exit code is different than 0', async () => {
    emitChildProcessEvent('exit', 1);
    emitChildProcessStdioData('stdout', '');

    const resultIterator = devExecutor({}, context);

    const result = (await resultIterator.next()).value;
    expect(result.success).toBe(false);
    expect(fork).toHaveBeenCalled();
  });

  test('should fail when the forked process errors', async () => {
    emitChildProcessEvent('error', new Error('Build failed!'));
    emitChildProcessStdioData('stdout', '');

    const resultIterator = devExecutor({}, context);

    const result = (await resultIterator.next()).value;
    expect(result.success).toBe(false);
    expect(fork).toHaveBeenCalled();
  });

  describe('--port', () => {
    test('should default to port 3000 when no port is provided', async () => {
      emitChildProcessStdioData('stdout', 'Server started');

      const resultIterator = devExecutor({}, context);

      const result = (await resultIterator.next()).value;
      expect(result.baseUrl).toBe('http://localhost:3000');
      expect(fork).toHaveBeenCalled();
    });

    test('should use provided port', async () => {
      emitChildProcessStdioData('stdout', 'Server started');

      const resultIterator = devExecutor({ port: 4200 }, context);

      const result = (await resultIterator.next()).value;
      expect(result.baseUrl).toBe('http://localhost:4200');
      expect(fork).toHaveBeenCalled();
    });
  });
});
