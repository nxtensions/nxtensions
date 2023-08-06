import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  type Tree,
} from '@nx/devkit';
import { major } from 'semver';
import {
  cleanVersion,
  getPackageInstalledVersion,
} from '../../utilities/versions';
import type { NormalizedGeneratorOptions } from '../schema';

export function addFiles(tree: Tree, options: NormalizedGeneratorOptions) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      tmpl: '',
      isTs5: isTypeScript5(tree),
    }
  );

  if (!options.publishable) {
    tree.delete(joinPathFragments(options.projectRoot, 'package.json'));
  }
}

function isTypeScript5(tree: Tree): boolean {
  const typescriptVersion = getPackageInstalledVersion(tree, 'typescript');

  return typescriptVersion
    ? major(cleanVersion(typescriptVersion)) >= 5
    : false;
}
