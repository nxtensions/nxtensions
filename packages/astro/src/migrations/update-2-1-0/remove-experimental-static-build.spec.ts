import {
  addProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import removeExperimentalStaticBuild from './remove-experimental-static-build';

describe('remove-experimental-static-build migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('project configuration', () => {
    test('should do nothing when there are no executors meant to be migrated', async () => {
      const targets = {
        build: {
          executor: '@my-org/awesome-package:build',
          options: { experimentalStaticBuild: true },
        },
        dev: {
          executor: '@my-org/awesome-package:dev',
          options: { experimentalStaticBuild: true },
        },
      };
      addProjectConfiguration(tree, 'app1', {
        root: 'apps/app1',
        projectType: 'application',
        targets,
      });

      await removeExperimentalStaticBuild(tree);

      const project = readProjectConfiguration(tree, 'app1');
      expect(project.targets).toStrictEqual(targets);
    });

    test('should do nothing when the experimentalStaticBuild option is not set', async () => {
      const targets = {
        build: {
          executor: '@nxtensions/astro:build',
          options: { drafts: true },
        },
        dev: {
          executor: '@nxtensions/astro:dev',
          options: { drafts: true },
        },
      };
      addProjectConfiguration(tree, 'app1', {
        root: 'apps/app1',
        projectType: 'application',
        targets,
      });

      await removeExperimentalStaticBuild(tree);

      const project = readProjectConfiguration(tree, 'app1');
      expect(project.targets).toStrictEqual(targets);
    });

    test('should delete the experimentalStaticBuild option when set to true', async () => {
      addProjectConfiguration(tree, 'app1', {
        root: 'apps/app1',
        projectType: 'application',
        targets: {
          build: {
            executor: '@nxtensions/astro:build',
            options: { experimentalStaticBuild: true },
          },
          dev: {
            executor: '@nxtensions/astro:dev',
            options: { experimentalStaticBuild: true },
          },
        },
      });

      await removeExperimentalStaticBuild(tree);

      const project = readProjectConfiguration(tree, 'app1');
      expect(project.targets.build.options).toStrictEqual({});
      expect(project.targets.dev.options).toStrictEqual({});
    });

    test('should set legacyBuild to true when the experimentalStaticBuild option is set to false', async () => {
      addProjectConfiguration(tree, 'app1', {
        root: 'apps/app1',
        projectType: 'application',
        targets: {
          build: {
            executor: '@nxtensions/astro:build',
            options: { experimentalStaticBuild: false },
          },
          dev: {
            executor: '@nxtensions/astro:dev',
            options: { experimentalStaticBuild: false },
          },
        },
      });

      await removeExperimentalStaticBuild(tree);

      const project = readProjectConfiguration(tree, 'app1');
      expect(project.targets.build.options).toStrictEqual({
        legacyBuild: true,
      });
      expect(project.targets.dev.options).toStrictEqual({ legacyBuild: true });
    });

    test('should also update configurations', async () => {
      addProjectConfiguration(tree, 'app1', {
        root: 'apps/app1',
        projectType: 'application',
        targets: {
          build: {
            executor: '@nxtensions/astro:build',
            options: { experimentalStaticBuild: false },
            configurations: {
              production: { experimentalStaticBuild: true },
            },
          },
          dev: {
            executor: '@nxtensions/astro:dev',
            options: {},
            configurations: {
              development: { silent: true, experimentalStaticBuild: false },
              production: { experimentalStaticBuild: true },
            },
            defaultConfiguration: 'development',
          },
        },
      });

      await removeExperimentalStaticBuild(tree);

      const project = readProjectConfiguration(tree, 'app1');
      expect(project.targets.build.options).toStrictEqual({
        legacyBuild: true,
      });
      expect(project.targets.build.configurations).toStrictEqual({
        production: {},
      });
      expect(project.targets.dev.options).toStrictEqual({});
      expect(project.targets.dev.configurations).toStrictEqual({
        development: { silent: true, legacyBuild: true },
        production: {},
      });
    });
  });

  describe('astro configuration', () => {
    beforeEach(() => {
      addProjectConfiguration(tree, 'app1', {
        root: 'apps/app1',
        projectType: 'application',
        targets: { build: { executor: '@nxtensions/astro:build' } },
      });
    });

    test('should do nothing when experimentalStaticBuild is not set', async () => {
      tree.write(
        'apps/app1/astro.config.mjs',
        `export default /** @type {import('astro').AstroUserConfig} */ ({
          buildOptions: {
            drafts: true,
          },
        });`
      );

      await removeExperimentalStaticBuild(tree);

      expect(
        tree.read('apps/app1/astro.config.mjs', 'utf-8')
      ).toMatchSnapshot();
    });

    test('should do nothing when experimentalStaticBuild is contained in a comment', async () => {
      tree.write(
        'apps/app1/astro.config.mjs',
        `export default /** @type {import('astro').AstroUserConfig} */ ({
          buildOptions: {
            // experimentalStaticBuild: true,
            drafts: true,
          },
        });`
      );

      await removeExperimentalStaticBuild(tree);

      expect(
        tree.read('apps/app1/astro.config.mjs', 'utf-8')
      ).toMatchSnapshot();
    });

    test('should do nothing when experimentalStaticBuild is not part of buildOptions (invalid config)', async () => {
      tree.write(
        'apps/app1/astro.config.mjs',
        `export default /** @type {import('astro').AstroUserConfig} */ ({
          buildOptions: {
            drafts: true,
          },
          experimentalStaticBuild: true,
        });`
      );

      await removeExperimentalStaticBuild(tree);

      expect(
        tree.read('apps/app1/astro.config.mjs', 'utf-8')
      ).toMatchSnapshot();
    });

    test('should delete the experimentalStaticBuild option when set to true', async () => {
      tree.write(
        'apps/app1/astro.config.mjs',
        `export default /** @type {import('astro').AstroUserConfig} */ ({
          buildOptions: {
            experimentalStaticBuild: true,
            drafts: true,
          },
        });`
      );

      await removeExperimentalStaticBuild(tree);

      expect(
        tree.read('apps/app1/astro.config.mjs', 'utf-8')
      ).toMatchSnapshot();
    });

    test('should set legacyBuild to true when the experimentalStaticBuild option is set to false', async () => {
      tree.write(
        'apps/app1/astro.config.mjs',
        `export default /** @type {import('astro').AstroUserConfig} */ ({
          buildOptions: {
            experimentalStaticBuild: false,
            drafts: true,
          },
        });`
      );

      await removeExperimentalStaticBuild(tree);

      expect(
        tree.read('apps/app1/astro.config.mjs', 'utf-8')
      ).toMatchSnapshot();
    });

    test.each([
      'astro.config.mjs',
      'astro.config.js',
      'astro.config.cjs',
      'astro.config.ts',
    ])('should handle "%s"', async (configFile) => {
      tree.write(
        `apps/app1/${configFile}`,
        `export default /** @type {import('astro').AstroUserConfig} */ ({
          buildOptions: {
            experimentalStaticBuild: true,
            drafts: true,
          },
        });`
      );

      await removeExperimentalStaticBuild(tree);

      expect(tree.read(`apps/app1/${configFile}`, 'utf-8')).toMatchSnapshot();
    });
  });
});
