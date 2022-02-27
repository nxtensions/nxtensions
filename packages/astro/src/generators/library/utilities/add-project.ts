import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addProject(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  addProjectConfiguration(
    tree,
    options.projectName,
    {
      root: options.projectRoot,
      sourceRoot: options.projectRoot,
      projectType: 'library',
      targets: { check: { executor: '@nxtensions/astro:check' } },
      tags: options.tags,
    },
    options.standaloneConfig
  );
}
