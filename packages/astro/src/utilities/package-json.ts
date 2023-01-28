import { readJsonFile, workspaceRoot } from '@nrwl/devkit';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

type PackageJsonExports =
  | string
  | Record<
      string,
      | string
      | {
          types?: string;
          require?: string;
          import?: string;
        }
    >;

export interface PackageJson {
  name: string;
  version: string;
  license?: string;
  scripts?: Record<string, string>;
  type?: 'module' | 'commonjs';
  main?: string;
  types?: string;
  module?: string;
  exports?: PackageJsonExports;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  bin?: Record<string, string>;
  workspaces?: string[] | { packages: string[] };
}

export function readModulePackageJson(
  moduleSpecifier: string,
  requirePaths = [workspaceRoot]
): PackageJson | null {
  let packageJsonPath: string;

  try {
    packageJsonPath = require.resolve(`${moduleSpecifier}/package.json`, {
      paths: requirePaths,
    });
  } catch {
    packageJsonPath = findPackageJsonPathFromModuleSpecifier(
      moduleSpecifier,
      requirePaths
    );
  }

  if (!packageJsonPath) {
    return null;
  }

  const packageJson = readJsonFile(packageJsonPath);
  if (packageJson.name && packageJson.name !== moduleSpecifier) {
    throw new Error(
      `Found module ${packageJson.name} while trying to locate ${moduleSpecifier}/package.json`
    );
  }

  return packageJson;
}

function findPackageJsonPathFromModuleSpecifier(
  moduleSpecifier: string,
  requirePaths: string[]
): string | null {
  try {
    const entryPoint = require.resolve(moduleSpecifier, {
      paths: requirePaths,
    });

    let moduleRootPath = dirname(entryPoint);
    let packageJsonPath = join(moduleRootPath, 'package.json');

    while (!existsSync(packageJsonPath) && moduleRootPath !== workspaceRoot) {
      moduleRootPath = dirname(moduleRootPath);
      packageJsonPath = join(moduleRootPath, 'package.json');
    }

    return packageJsonPath;
  } catch {
    return null;
  }
}
