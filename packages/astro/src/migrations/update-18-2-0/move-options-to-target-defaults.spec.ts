import {
  addProjectConfiguration as _addProjectConfiguration,
  readNxJson,
  readProjectConfiguration,
  updateNxJson,
  type ProjectConfiguration,
  type ProjectGraph,
  type Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '../../generators/utilities/testing';
import migration from './move-options-to-target-defaults';

let projectGraph: ProjectGraph;
jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  createProjectGraphAsync: jest
    .fn()
    .mockImplementation(async () => projectGraph),
}));

function addProjectConfiguration(
  tree: Tree,
  name: string,
  project: ProjectConfiguration
) {
  _addProjectConfiguration(tree, name, project);
  projectGraph.nodes[name] = {
    name: name,
    type: 'app',
    data: project,
  };
}

describe('move-options-to-target-defaults migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    projectGraph = {
      nodes: {},
      dependencies: {},
      externalNodes: {},
    };
  });

  describe('@nxtensions/astro:build executor', () => {
    test('should set targetDefaults and remove defaults from projects', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          build: {
            outputs: ['{workspaceRoot}/dist/{projectRoot}'],
            executor: '@nxtensions/astro:build',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          build: {
            outputs: ['{workspaceRoot}/dist/{projectRoot}'],
            executor: '@nxtensions/astro:build',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.build
      ).toStrictEqual({
        executor: '@nxtensions/astro:build',
      });
      expect(
        readProjectConfiguration(tree, 'proj2').targets.build
      ).toStrictEqual({
        executor: '@nxtensions/astro:build',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:build': {
          cache: true,
          inputs: ['default', '^default'],
          outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        },
      });
    });

    test('should respect existing targetDefaults when all targets have the same target name', async () => {
      const nxJson = readNxJson(tree);
      nxJson.targetDefaults['build'] = {
        cache: false,
        outputs: ['{workspaceRoot}/build/{projectRoot}'],
      };
      updateNxJson(tree, nxJson);
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          build: {
            outputs: ['{workspaceRoot}/build/{projectRoot}'],
            executor: '@nxtensions/astro:build',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.build
      ).toStrictEqual({
        executor: '@nxtensions/astro:build',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:build': {
          cache: false,
          inputs: ['default', '^default'],
          outputs: ['{workspaceRoot}/build/{projectRoot}'],
        },
      });
    });

    test('should not remove target configuration that does not match the targetDefaults', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          build: {
            cache: false,
            inputs: ['default', '^default'],
            outputs: ['{workspaceRoot}/build/{projectRoot}'],
            executor: '@nxtensions/astro:build',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.build
      ).toStrictEqual({
        cache: false,
        outputs: ['{workspaceRoot}/build/{projectRoot}'],
        executor: '@nxtensions/astro:build',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:build': {
          cache: true,
          inputs: ['default', '^default'],
          outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        },
      });
    });

    test('should not remove target configuration when target uses a different executor', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          build: {
            cache: true,
            inputs: ['default', '^default'],
            outputs: ['{workspaceRoot}/dist/{projectRoot}'],
            executor: '@nxtensions/astro:build',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          build: {
            cache: true,
            inputs: ['default', '^default'],
            outputs: ['{workspaceRoot}/dist/{projectRoot}'],
            executor: '@scope/package:some-executor',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.build
      ).toStrictEqual({
        executor: '@nxtensions/astro:build',
      });
      expect(
        readProjectConfiguration(tree, 'proj2').targets.build
      ).toStrictEqual({
        cache: true,
        inputs: ['default', '^default'],
        outputs: ['{workspaceRoot}/dist/{projectRoot}'],
        executor: '@scope/package:some-executor',
      });
      expect(
        readNxJson(tree).targetDefaults['@nxtensions/astro:build']
      ).toStrictEqual({
        cache: true,
        inputs: ['default', '^default'],
        outputs: ['{workspaceRoot}/dist/{projectRoot}'],
      });
    });

    test('should not remove target defaults when there are targets using different executors', async () => {
      const nxJson = readNxJson(tree);
      nxJson.targetDefaults['build'] = {
        cache: false,
        outputs: ['{workspaceRoot}/build/{projectRoot}'],
      };
      updateNxJson(tree, nxJson);
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          build: {
            outputs: ['{workspaceRoot}/build/{projectRoot}'],
            executor: '@nxtensions/astro:build',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          build: {
            executor: '@scope/package:some-executor',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.build
      ).toStrictEqual({
        executor: '@nxtensions/astro:build',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:build': {
          cache: false,
          inputs: ['default', '^default'],
          outputs: ['{workspaceRoot}/build/{projectRoot}'],
        },
        build: {
          cache: false,
          outputs: ['{workspaceRoot}/build/{projectRoot}'],
        },
      });
    });
  });

  describe('@nxtensions/astro:check executor', () => {
    test('should set targetDefaults and remove defaults from projects', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          check: {
            cache: true,
            executor: '@nxtensions/astro:check',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          check: {
            cache: true,
            executor: '@nxtensions/astro:check',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.check
      ).toStrictEqual({
        executor: '@nxtensions/astro:check',
      });
      expect(
        readProjectConfiguration(tree, 'proj2').targets.check
      ).toStrictEqual({
        executor: '@nxtensions/astro:check',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:check': {
          cache: true,
          inputs: ['default', '^default'],
        },
      });
    });

    test('should respect existing targetDefaults when all targets have the same target name', async () => {
      const nxJson = readNxJson(tree);
      nxJson.targetDefaults['check'] = {
        cache: false,
      };
      updateNxJson(tree, nxJson);
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          check: {
            cache: false,
            executor: '@nxtensions/astro:check',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.check
      ).toStrictEqual({
        executor: '@nxtensions/astro:check',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:check': {
          cache: false,
          inputs: ['default', '^default'],
        },
      });
    });

    test('should not remove target configuration that does not match the targetDefaults', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          check: {
            cache: false,
            inputs: ['default', '^default'],
            executor: '@nxtensions/astro:check',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.check
      ).toStrictEqual({
        cache: false,
        executor: '@nxtensions/astro:check',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:check': {
          cache: true,
          inputs: ['default', '^default'],
        },
      });
    });

    test('should not remove target configuration when target uses a different executor', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          check: {
            cache: true,
            inputs: ['default', '^default'],
            executor: '@nxtensions/astro:check',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          check: {
            cache: true,
            inputs: ['default', '^default'],
            executor: '@scope/package:some-executor',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.check
      ).toStrictEqual({
        executor: '@nxtensions/astro:check',
      });
      expect(
        readProjectConfiguration(tree, 'proj2').targets.check
      ).toStrictEqual({
        cache: true,
        inputs: ['default', '^default'],
        executor: '@scope/package:some-executor',
      });
      expect(
        readNxJson(tree).targetDefaults['@nxtensions/astro:check']
      ).toStrictEqual({
        cache: true,
        inputs: ['default', '^default'],
      });
    });

    test('should not remove target defaults when there are targets using different executors', async () => {
      const nxJson = readNxJson(tree);
      nxJson.targetDefaults['check'] = {
        cache: false,
      };
      updateNxJson(tree, nxJson);
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          check: {
            cache: false,
            executor: '@nxtensions/astro:check',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          check: {
            executor: '@scope/package:some-executor',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.check
      ).toStrictEqual({
        executor: '@nxtensions/astro:check',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:check': {
          cache: false,
          inputs: ['default', '^default'],
        },
        check: {
          cache: false,
        },
      });
    });
  });

  describe('@nxtensions/astro:preview executor', () => {
    test('should set targetDefaults and remove defaults from projects', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          preview: {
            dependsOn: ['build'],
            executor: '@nxtensions/astro:preview',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          preview: {
            dependsOn: ['build'],
            executor: '@nxtensions/astro:preview',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.preview
      ).toStrictEqual({
        executor: '@nxtensions/astro:preview',
      });
      expect(
        readProjectConfiguration(tree, 'proj2').targets.preview
      ).toStrictEqual({
        executor: '@nxtensions/astro:preview',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:preview': {
          dependsOn: ['build'],
        },
      });
    });

    test('should respect existing targetDefaults when all targets have the same target name', async () => {
      const nxJson = readNxJson(tree);
      nxJson.targetDefaults['preview'] = {
        dependsOn: ['some-target'],
      };
      updateNxJson(tree, nxJson);
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          preview: {
            dependsOn: ['some-target'],
            executor: '@nxtensions/astro:preview',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.preview
      ).toStrictEqual({
        executor: '@nxtensions/astro:preview',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:preview': {
          dependsOn: ['some-target'],
        },
      });
    });

    test('should not remove target configuration that does not match the targetDefaults', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          preview: {
            dependsOn: ['some-target'],
            executor: '@nxtensions/astro:preview',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.preview
      ).toStrictEqual({
        dependsOn: ['some-target'],
        executor: '@nxtensions/astro:preview',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:preview': {
          dependsOn: ['build'],
        },
      });
    });

    test('should not remove target configuration when target uses a different executor', async () => {
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          preview: {
            dependsOn: ['build'],
            executor: '@nxtensions/astro:preview',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          preview: {
            dependsOn: ['build'],
            executor: '@scope/package:some-executor',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.preview
      ).toStrictEqual({
        executor: '@nxtensions/astro:preview',
      });
      expect(
        readProjectConfiguration(tree, 'proj2').targets.preview
      ).toStrictEqual({
        dependsOn: ['build'],
        executor: '@scope/package:some-executor',
      });
      expect(
        readNxJson(tree).targetDefaults['@nxtensions/astro:preview']
      ).toStrictEqual({
        dependsOn: ['build'],
      });
    });

    test('should not remove target defaults when there are targets using different executors', async () => {
      const nxJson = readNxJson(tree);
      nxJson.targetDefaults['preview'] = {
        dependsOn: ['build'],
      };
      updateNxJson(tree, nxJson);
      addProjectConfiguration(tree, 'proj1', {
        root: 'proj1',
        targets: {
          preview: {
            dependsOn: ['build'],
            executor: '@nxtensions/astro:preview',
          },
        },
      });
      addProjectConfiguration(tree, 'proj2', {
        root: 'proj2',
        targets: {
          preview: {
            executor: '@scope/package:some-executor',
          },
        },
      });

      await migration(tree);

      expect(
        readProjectConfiguration(tree, 'proj1').targets.preview
      ).toStrictEqual({
        executor: '@nxtensions/astro:preview',
      });
      expect(readNxJson(tree).targetDefaults).toStrictEqual({
        '@nxtensions/astro:preview': {
          dependsOn: ['build'],
        },
        preview: {
          dependsOn: ['build'],
        },
      });
    });
  });
});
