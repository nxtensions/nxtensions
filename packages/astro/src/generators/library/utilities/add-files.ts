import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  type Tree,
} from '@nx/devkit';
import type { NormalizedGeneratorOptions } from '../schema';

export function addFiles(tree: Tree, options: NormalizedGeneratorOptions) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.projectRoot,
    {
      ...options,
      ...names(options.projectName),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      tmpl: '',
    }
  );

  if (!options.publishable) {
    tree.delete(joinPathFragments(options.projectRoot, 'package.json'));
  }
}
