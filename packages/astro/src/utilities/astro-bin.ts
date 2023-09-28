import { workspaceRoot } from '@nx/devkit';
import { normalize, join } from 'path';

export function getAstroBinPath(): string {
  return normalize(join(workspaceRoot, 'node_modules', '.bin', 'astro'));
}
