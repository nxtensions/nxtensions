import type { Tree } from '@nrwl/devkit';
import {
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
} from '@nrwl/devkit';
import type { NormalizedGeneratorOptions } from '../schema';

export function addFiles(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const rootOffset = offsetFromRoot(options.projectRoot);

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files', 'project'),
    options.projectRoot,
    {
      ...options,
      ...names(options.name),
      offsetFromRoot: rootOffset,
      outDir: joinPathFragments(rootOffset, 'dist', options.projectRoot),
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
