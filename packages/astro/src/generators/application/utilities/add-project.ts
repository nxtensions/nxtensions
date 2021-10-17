import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addProject(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  addProjectConfiguration(tree, options.projectName, {
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
        // TODO: Amend if needed when executor is implemented
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
        // TODO: Amend if needed when executor is implemented
        executor: '@nxtensions/astro:preview',
        options: {},
      },
    },
    tags: options.parsedTags,
  });
}
