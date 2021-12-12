import { generateFiles, joinPathFragments, names, Tree } from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addComponentFile(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.directory,
    {
      ...options,
      ...names(options.name),
      tmpl: '',
    }
  );
}
