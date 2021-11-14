import { execSync, ExecSyncOptions } from 'child_process';

export function execSyncOrDryRun(
  command: string,
  options?: ExecSyncOptions,
  dryRun: boolean = false
): string | Buffer {
  if (!dryRun) {
    return execSync(command, options);
  }

  console.log(`[dry-run] ${command}`);

  return '';
}
