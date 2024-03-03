import { runCommand } from '@nx/plugin/testing';
import { logInfo } from './logs';

export function ensureCypressInstallation() {
  let cypressVerified = true;
  try {
    const r = runCommand('npx cypress verify', {});
    if (r.indexOf('Verified Cypress!') === -1) {
      cypressVerified = false;
    }
  } catch {
    cypressVerified = false;
  } finally {
    if (!cypressVerified) {
      logInfo('Cypress was not verified. Installing Cypress now.');
      runCommand('npx cypress install', {});
    }
  }
}

export function ensurePlaywrightBrowsersInstallation() {
  const playwrightInstallArgs =
    process.env.PLAYWRIGHT_INSTALL_ARGS || '--with-deps';
  runCommand(`npx playwright install ${playwrightInstallArgs}`, {});
  logInfo(
    `Playwright browsers ${runCommand('npx playwright --version', {})
      .toString()
      .trim()} installed.`
  );
}
