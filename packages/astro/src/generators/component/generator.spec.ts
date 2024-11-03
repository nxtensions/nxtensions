jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  formatFiles: jest.fn(),
}));

import {
  addProjectConfiguration,
  formatFiles,
  readJson,
  type Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { componentGenerator } from './generator';
import type { Style } from './schema';

describe('component generator', () => {
  let tree: Tree;
  const appProject = 'app1';
  const libProject = 'lib1';

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, appProject, {
      root: `apps/${appProject}`,
      projectType: 'application',
    });
    addProjectConfiguration(tree, libProject, {
      root: `libs/${libProject}`,
      projectType: 'library',
    });

    jest.clearAllMocks();
  });

  test('should create the component in the right location when adding it to an application', async () => {
    await componentGenerator(tree, {
      path: `apps/${appProject}/src/components/Foo`,
    });

    expect(
      tree.exists(`apps/${appProject}/src/components/Foo.astro`)
    ).toBeTruthy();
  });

  test('should create the component in the right location when adding it to a library', async () => {
    await componentGenerator(tree, {
      path: `libs/${libProject}/src/Foo`,
    });

    expect(tree.exists(`libs/${libProject}/src/Foo.astro`)).toBeTruthy();
  });

  test('should create the component in src/lib when that dir exists and it is not empty for backward compat', async () => {
    tree.write(`libs/${libProject}/src/lib/Cmp1.astro`, '<div>cmp1</div>');

    await componentGenerator(tree, {
      path: `libs/${libProject}/src/lib/Foo`,
    });

    expect(tree.exists(`libs/${libProject}/src/lib/Foo.astro`)).toBeTruthy();
  });

  test.each([['foo'], ['Foo'], ['foo-bar'], ['fooBar'], ['FooBar']])(
    'should create the component with "%s" as provided',
    async (name) => {
      await componentGenerator(tree, {
        path: `libs/${libProject}/src/${name}`,
      });

      expect(tree.exists(`libs/${libProject}/src/${name}.astro`)).toBeTruthy();
    }
  );

  test('should format files', async () => {
    await componentGenerator(tree, {
      path: `apps/${appProject}/src/components/foo`,
    });

    expect(formatFiles).toHaveBeenCalled();
  });

  describe('--styles', () => {
    test.each([undefined, 'css', 'scss', 'sass', 'less', 'styl', 'none'])(
      'should create the component with the right stylesheet content when "%s" is provided',
      async (style: Style) => {
        await componentGenerator(tree, {
          path: `apps/${appProject}/src/components/Foo`,
          style,
        });

        expect(
          tree.read(`apps/${appProject}/src/components/Foo.astro`, 'utf-8')
        ).toMatchSnapshot();
      }
    );

    test.each([
      ['scss', 'sass'],
      ['sass', 'sass'],
      ['less', 'less'],
      ['styl', 'stylus'],
    ])(
      'should install the right package when "%s" is provided',
      async (style: Style, packageName: string) => {
        await componentGenerator(tree, {
          path: `apps/${appProject}/src/components/foo`,
          style,
        });

        const { devDependencies } = readJson(tree, 'package.json');
        expect(devDependencies[packageName]).toBeTruthy();
      }
    );

    test.each([undefined, 'css', 'none'])(
      'should not install any package when "%s" is provided',
      async (style: Style) => {
        await componentGenerator(tree, {
          path: `apps/${appProject}/src/components/foo`,
          style,
        });

        const { devDependencies } = readJson(tree, 'package.json');
        expect(devDependencies).toStrictEqual({});
      }
    );
  });
});
