import {
  addProjectConfiguration,
  joinPathFragments,
  readNxJson,
  type Tree,
} from '@nx/devkit';
import { addTargetDefaults } from '../../utilities/target-defaults';
import type { NormalizedGeneratorOptions } from '../schema';

export function addProject(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const nxJson = readNxJson(tree);
  const productionInputs =
    nxJson.namedInputs && 'production' in nxJson.namedInputs
      ? ['production', '^production']
      : ['default', '^default'];

  addTargetDefaults(tree, '@nxtensions/astro:build', {
    inputs: productionInputs,
    outputs: [joinPathFragments('{workspaceRoot}', 'dist', '{projectRoot}')],
    cache: true,
  });
  addTargetDefaults(tree, '@nxtensions/astro:check', {
    inputs: productionInputs,
    cache: true,
  });
  addTargetDefaults(tree, '@nxtensions/astro:preview', {
    dependsOn: ['build'],
  });

  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: joinPathFragments(options.projectRoot, 'src'),
    targets: {
      build: {
        executor: '@nxtensions/astro:build',
        options: {},
      },
      dev: {
        executor: '@nxtensions/astro:dev',
        options: {},
      },
      preview: {
        executor: '@nxtensions/astro:preview',
        options: {},
      },
      check: {
        executor: '@nxtensions/astro:check',
      },
      sync: {
        executor: '@nxtensions/astro:sync',
      },
    },
    tags: options.tags,
  });
}
