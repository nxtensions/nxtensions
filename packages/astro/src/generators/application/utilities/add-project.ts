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
      projectType: 'application',
      sourceRoot: `${options.projectRoot}/src`,
      targets: {
        build: {
          outputs: [`dist/${options.projectRoot}`],
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
      },
      tags: options.tags,
    },
    options.standaloneConfig
  );
}
