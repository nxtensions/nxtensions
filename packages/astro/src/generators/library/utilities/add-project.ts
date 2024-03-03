import { addProjectConfiguration, readNxJson, type Tree } from '@nx/devkit';
import { addTargetDefaults } from '../../utilities/target-defaults';
import type { NormalizedGeneratorOptions } from '../schema';

export function addProject(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const nxJson = readNxJson(tree);
  addTargetDefaults(tree, '@nxtensions/astro:check', {
    inputs:
      nxJson.namedInputs && 'production' in nxJson.namedInputs
        ? ['production', '^production']
        : ['default', '^default'],
    cache: true,
  });

  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    sourceRoot: options.projectRoot,
    projectType: 'library',
    targets: { check: { executor: '@nxtensions/astro:check' } },
    tags: options.tags,
  });
}
