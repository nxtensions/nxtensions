import { formatFiles, readJson, writeJson, type Tree } from '@nx/devkit';
import type { PackageJson } from 'nx/src/utils/package-json';
import { clean, coerce, lt } from 'semver';

export default async function (tree: Tree) {
  const packageJson = readJson<PackageJson>(tree, 'package.json');
  if (
    !packageJson.dependencies['@astrojs/check'] &&
    !packageJson.devDependencies['@astrojs/check']
  ) {
    packageJson.devDependencies['@astrojs/check'] = '^0.5.2';
  }

  if (packageJson.dependencies['typescript']) {
    if (lt(cleanSemver(packageJson.dependencies['typescript']), '5.0.0')) {
      packageJson.dependencies['typescript'] = '^5.3.3';
    }
  } else if (packageJson.devDependencies['typescript']) {
    if (lt(cleanSemver(packageJson.devDependencies['typescript']), '5.0.0')) {
      packageJson.devDependencies['typescript'] = '^5.3.3';
    }
  } else {
    packageJson.devDependencies['typescript'] = '^5.3.3';
  }

  writeJson(tree, 'package.json', packageJson);

  await formatFiles(tree);
}

function cleanSemver(version: string) {
  return clean(version) ?? coerce(version);
}
