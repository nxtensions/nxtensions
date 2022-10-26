import { check as portCheck } from 'tcp-port-used';
import { logError, logInfo, logSuccess } from './logs';
import kill = require('kill-port');

export async function killPorts(port?: number): Promise<boolean> {
  return port
    ? await killPort(port)
    : (await killPort(3333)) && (await killPort(4200));
}

const KILL_PORT_DELAY = 5000;
export async function killPort(port: number): Promise<boolean> {
  if (!(await portCheck(port))) {
    return true;
  }

  try {
    logInfo(`Attempting to close port ${port}`);

    await kill(port);
    await new Promise<void>((resolve) =>
      setTimeout(() => resolve(), KILL_PORT_DELAY)
    );

    if (await portCheck(port)) {
      logError(`Port ${port} still open.`);
    } else {
      logSuccess(`Port ${port} successfully closed.`);

      return true;
    }
  } catch {
    logError(`Port ${port} closing failed.`);
  }

  return false;
}
