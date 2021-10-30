import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

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
    }
  );

  if (!options.publishable) {
    tree.delete(joinPathFragments(options.projectRoot, 'package.json'));
  }
}
