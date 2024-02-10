import {
  addProjectConfiguration,
  joinPathFragments,
  type Tree,
} from '@nx/devkit';
import type { NormalizedGeneratorOptions } from '../schema';

export function addProject(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  addProjectConfiguration(
    tree,
    options.projectName,
    {
      root: options.projectRoot,
      projectType: 'application',
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: {
        build: {
          outputs: [
            joinPathFragments('{workspaceRoot}', 'dist', '{projectRoot}'),
          ],
          executor: '@nxtensions/astro:build',
          options: {},
        },
        dev: {
          executor: '@nxtensions/astro:dev',
          options: {},
        },
        preview: {
          dependsOn: [
            {
              target: 'build',
              projects: 'self',
            },
          ],
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
    },
    options.standaloneConfig
  );
}
