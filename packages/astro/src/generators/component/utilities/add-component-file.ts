import { generateFiles, joinPathFragments, names, type Tree } from '@nx/devkit';
import type { NormalizedGeneratorOptions } from '../schema';

export function addComponentFile(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const { className } = names(options.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.directory,
    {
      ...options,
      className,
      tmpl: '',
    }
  );
}
