import {
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addFiles(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const templateOptions = {
    ...options,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.projectRoot,
    templateOptions
  );
}
