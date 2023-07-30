import { runCommand } from '@nx/plugin/testing';

export function initializeGitRepo(): void {
  runCommand('git init', {});
  runCommand('git config user.email e2e-ci-bot@nxtensions.com', {});
  runCommand('git config user.name E2E-CI-Bot', {});
  runCommand('git branch -m main', {});
  runCommand('git add .', {});
  runCommand('git commit -m "initial commit"', {});
}
