import * as chalk from 'chalk';

export function logInfo(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.white(
    ' INFO '
  )} ${chalk.bold.white(title)}`;

  e2eConsoleLogger(message, body);
}

export function logError(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.red(' ERROR ')} ${chalk.bold.red(
    title
  )}`;

  e2eConsoleLogger(message, body);
}

export function logSuccess(title: string, body?: string): void {
  const message = `${chalk.reset.inverse.bold.green(
    ' SUCCESS '
  )} ${chalk.bold.green(title)}`;

  e2eConsoleLogger(message, body);
}

const E2E_LOG_PREFIX = `${chalk.reset.inverse.bold.keyword('orange')(' E2E ')}`;
function e2eConsoleLogger(message: string, body?: string): void {
  process.stdout.write('\n');
  process.stdout.write(`${E2E_LOG_PREFIX} ${message}\n`);
  if (body) {
    process.stdout.write(`${body}\n`);
  }
  process.stdout.write('\n');
}
