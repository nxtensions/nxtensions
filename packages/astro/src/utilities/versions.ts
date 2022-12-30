import { readModulePackageJson } from './package-json';

export function getInstalledAstroVersion(): string | null {
  return readModulePackageJson('astro')?.version;
}
