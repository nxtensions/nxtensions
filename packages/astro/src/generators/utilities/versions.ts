import { readJson, type Tree } from '@nx/devkit';
import type { PackageJson } from '../../utilities/package-json';

export function getInstalledNxVersion(tree: Tree): string {
  const packageJson = readJson<PackageJson>(tree, 'package.json');
  const version =
    packageJson?.devDependencies?.['nx'] ?? packageJson?.dependencies?.['nx'];

  if (!version) {
    throw new Error(
      'Could not resolve the "nx" version from the "package.json".'
    );
  }

  return version;
}
