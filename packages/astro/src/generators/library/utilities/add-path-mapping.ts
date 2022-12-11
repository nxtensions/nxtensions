import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedGeneratorOptions } from '../schema';

export function addPathMapping(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const rootTsConfigPath = getRootTsConfigPath(tree);

  if (!rootTsConfigPath) {
    return;
  }

  updateJson(tree, rootTsConfigPath, (json) => {
    const c = json.compilerOptions;
    c.paths = c.paths ?? {};
    c.paths[options.importPath] = [
      joinPathFragments(options.projectRoot, 'src/index.js'),
    ];

    return json;
  });
}

function getRootTsConfigPath(tree: Tree): string | undefined {
  const possiblePaths = ['tsconfig.base.json', 'tsconfig.json'];

  for (const path of possiblePaths) {
    if (tree.exists(path)) {
      return path;
    }
  }

  return undefined;
}
