import { generateFiles, joinPathFragments, names, Tree } from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addComponentFile(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const componentNames = names(options.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.directory,
    {
      ...options,
      ...componentNames,
      componentFilename: options.capitalizeName
        ? componentNames.className
        : options.name,
      tmpl: '',
    }
  );
}
