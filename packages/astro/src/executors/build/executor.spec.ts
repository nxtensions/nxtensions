jest.mock('child_process');

import { ExecutorContext } from '@nrwl/devkit';
import { fork } from 'child_process';
import * as fsExtra from 'fs-extra';
import executor from './executor';

type ChildProcessEvents = 'error' | 'exit';
let mockedEventName: ChildProcessEvents;
let mockedEventValue: unknown;
function emitChildProcessEvent(
  eventName: ChildProcessEvents,
  value: unknown
): void {
  mockedEventName = eventName;
  mockedEventValue = value;
}

describe('Build Executor', () => {
  let context: ExecutorContext;

  beforeEach(() => {
    context = {
      projectName: 'app1',
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
        if (eventName === mockedEventName) {
          cb(mockedEventValue);
        }
      },
    }));

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(fsExtra, 'removeSync').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  it('should run successfully', async () => {
    emitChildProcessEvent('exit', 0);

    const output = await executor({}, context);

    expect(output.success).toBe(true);
    expect(fork).toHaveBeenCalled();
  });

  it('should fail when the forked process errors', async () => {
    emitChildProcessEvent('error', new Error('Build failed!'));

    const output = await executor({}, context);

    expect(output.success).toBe(false);
    expect(fork).toHaveBeenCalled();
  });

  it('should delete output path', async () => {
    emitChildProcessEvent('exit', 0);

    await executor({ deleteOutputPath: true }, context);

    expect(fsExtra.removeSync).toHaveBeenCalledWith(context.target.outputs[0]);
  });

  it('should not delete output path when "deleteOuputPath" is set to false', async () => {
    emitChildProcessEvent('exit', 0);

    await executor({ deleteOutputPath: false }, context);

    expect(fsExtra.removeSync).not.toHaveBeenCalled();
  });
});
