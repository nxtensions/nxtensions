import { Tree, readJsonFile, updateJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace as _createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { PackageJson } from '../../utilities/package-json';

export function createTreeWithEmptyWorkspace(nxVersion?: string): Tree {
  const tree = _createTreeWithEmptyWorkspace();
  if (!nxVersion) {
    const { devDependencies } = readJsonFile<PackageJson>('package.json');
    nxVersion = devDependencies['nx'];
  }
  updateJson(tree, 'package.json', (json) => {
    json.devDependencies['nx'] = nxVersion;
    return json;
  });

  return tree;
}
