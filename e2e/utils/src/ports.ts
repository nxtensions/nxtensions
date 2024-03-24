import net from 'net';
import { logError, logInfo, logSuccess } from './logs';
import kill = require('kill-port');

export async function killPorts(port?: number): Promise<boolean> {
  return port
    ? await killPort(port)
    : (await killPort(3333)) && (await killPort(4200));
}

const KILL_PORT_DELAY = 5000;
export async function killPort(port: number): Promise<boolean> {
  logInfo(`Attempting to close port ${port}`);

  if (!(await isPortUsed(port))) {
    logInfo(`Port ${port} is already closed.`);
    return true;
  }

  try {
    await kill(port);
    await new Promise<void>((resolve) =>
      setTimeout(() => resolve(), KILL_PORT_DELAY)
    );

    if (await isPortUsed(port)) {
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

async function isPortUsed(port: number): Promise<boolean> {
  const innerIsPortUsed = (host: string) =>
    new Promise<boolean>((resolve) => {
      const conn = net
        .connect(port, host)
        .on('error', () => {
          resolve(false);
        })
        .on('connect', () => {
          conn.end();
          resolve(true);
        });
    });

  return (await innerIsPortUsed('127.0.0.1')) || (await innerIsPortUsed('::1'));
}
