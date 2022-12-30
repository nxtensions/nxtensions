import type { Tree } from '@nrwl/devkit';
import { addProjectConfiguration, joinPathFragments } from '@nrwl/devkit';
import { gte } from 'semver';
import { getInstalledAstroVersion } from '../../../utilities/versions';
import type { NormalizedGeneratorOptions } from '../schema';

export function addProject(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version: nxVersion } = require('nx/package.json');
  const outputDirectory = gte(nxVersion, '15.0.0')
    ? joinPathFragments('{workspaceRoot}', 'dist', '{projectRoot}')
    : joinPathFragments('dist', options.projectRoot);
  const astroVersion = getInstalledAstroVersion();

  addProjectConfiguration(
    tree,
    options.projectName,
    {
      root: options.projectRoot,
      projectType: 'application',
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: {
        build: {
          outputs: [outputDirectory],
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
        sync:
          !astroVersion || gte(astroVersion, '1.8.0')
            ? { executor: '@nxtensions/astro:sync' }
            : undefined,
      },
      tags: options.tags,
    },
    options.standaloneConfig
  );
}
