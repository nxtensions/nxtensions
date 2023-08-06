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
      isTs5: isTypeScript5(tree),
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

function isTypeScript5(tree: Tree): boolean {
  const typescriptVersion = getPackageInstalledVersion(tree, 'typescript');

  return typescriptVersion
    ? major(cleanVersion(typescriptVersion)) >= 5
    : false;
}
