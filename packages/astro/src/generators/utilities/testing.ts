import { readJsonFile, updateJson, workspaceRoot, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace as _createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import type { PackageJson } from 'nx/src/utils/package-json';
import { join } from 'path';

export function createTreeWithEmptyWorkspace(nxVersion?: string): Tree {
  const tree = _createTreeWithEmptyWorkspace();
  if (!nxVersion) {
    const { devDependencies } = readJsonFile<PackageJson>(
      join(workspaceRoot, 'package.json')
    );
    nxVersion = devDependencies['nx'];
  }
  updateJson(tree, 'package.json', (json) => {
    json.devDependencies['nx'] = nxVersion;
    return json;
  });

  return tree;
}
