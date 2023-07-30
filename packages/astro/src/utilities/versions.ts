import { gte } from 'semver';
import { readModulePackageJson } from './package-json';

let astroVersion: string | null;
export function getInstalledAstroVersion(): string | null {
  astroVersion ??= readModulePackageJson('astro')?.version;

  return astroVersion;
}

export function isAstroVersion(version: string): boolean {
  astroVersion ??= getInstalledAstroVersion();

  return astroVersion && gte(astroVersion, version);
}
