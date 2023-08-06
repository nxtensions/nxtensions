import { readJson, type Tree } from '@nx/devkit';
import { clean, coerce } from 'semver';
import type { PackageJson } from '../../utilities/package-json';

export function getInstalledNxVersion(tree: Tree): string {
  const version = getPackageInstalledVersion(tree, 'nx');
  if (!version) {
    throw new Error(
      'Could not resolve the "nx" version from the "package.json".'
    );
  }

  return version;
}

export function getPackageInstalledVersion(
  tree: Tree,
  packageName: string
): string | undefined {
  const packageJson = readJson<PackageJson>(tree, 'package.json');

  return (
    packageJson?.dependencies?.[packageName] ??
    packageJson?.devDependencies?.[packageName]
  );
}

export function cleanVersion(version: string): string {
  return clean(version) ?? coerce(version)?.version ?? version;
}
