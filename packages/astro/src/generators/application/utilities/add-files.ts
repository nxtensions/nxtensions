import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addFiles(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files', 'project'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      tmpl: '',
    }
  );

  if (options.integrations.find((i) => i.name === 'tailwind')) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '..', 'files', 'tailwind'),
      options.projectRoot,
      { tmpl: '' }
    );
  }
}
