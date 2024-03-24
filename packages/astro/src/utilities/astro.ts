import { readModulePackageJson } from 'nx/src/utils/package-json';
import { dirname, resolve } from 'path';

export function getAstroCliPath(): string {
  try {
    const { path: astroPackageJsonPath, packageJson } =
      readModulePackageJson('astro');
    const astroBinPath = packageJson.bin['astro'];

    return resolve(dirname(astroPackageJsonPath), astroBinPath);
  } catch (error) {
    throw new Error(
      'Could not resolve the Astro CLI. Make sure it is installed in your workspace.'
    );
  }
}
