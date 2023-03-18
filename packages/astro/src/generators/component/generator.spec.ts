jest.mock('@nrwl/devkit', () => ({
  ...jest.requireActual('@nrwl/devkit'),
  formatFiles: jest.fn(),
}));

import {
  addProjectConfiguration,
  formatFiles,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { componentGenerator } from './generator';
import { Style } from './schema';

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
    await componentGenerator(tree, { name: 'foo', project: appProject });

    expect(
      tree.exists(`apps/${appProject}/src/components/Foo.astro`)
    ).toBeTruthy();
  });

  test('should create the component in the right location when adding it to a library', async () => {
    await componentGenerator(tree, { name: 'foo', project: libProject });

    expect(tree.exists(`libs/${libProject}/src/lib/Foo.astro`)).toBeTruthy();
  });

  test.each([
    ['foo', 'Foo'],
    ['foo-bar', 'FooBar'],
    ['fooBar', 'FooBar'],
  ])(
    'should create the component with the right PascalCase name when "%s" is provided',
    async (name, expectedName) => {
      await componentGenerator(tree, { name: name, project: libProject });

      expect(
        tree.exists(`libs/${libProject}/src/lib/${expectedName}.astro`)
      ).toBeTruthy();
    }
  );

  test('should format files', async () => {
    await componentGenerator(tree, { name: 'foo', project: appProject });

    expect(formatFiles).toHaveBeenCalled();
  });

  describe('--directory', () => {
    test('should create the component in the right location when adding it to an application', async () => {
      const directory = 'folder/foo';

      await componentGenerator(tree, {
        name: 'foo',
        project: appProject,
        directory,
      });

      expect(
        tree.exists(`apps/${appProject}/${directory}/Foo.astro`)
      ).toBeTruthy();
    });

    test('should create the component in the right location when adding it to a library', async () => {
      const directory = 'folder/foo';

      await componentGenerator(tree, {
        name: 'foo',
        project: libProject,
        directory,
      });

      expect(
        tree.exists(`libs/${libProject}/${directory}/Foo.astro`)
      ).toBeTruthy();
    });
  });

  describe('--styles', () => {
    test.each([undefined, 'css', 'scss', 'sass', 'less', 'styl', 'none'])(
      'should create the component with the right stylesheet content when "%s" is provided',
      async (style: Style) => {
        await componentGenerator(tree, {
          name: 'foo',
          project: appProject,
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
          name: 'foo',
          project: appProject,
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
          name: 'foo',
          project: appProject,
          style,
        });

        const { devDependencies } = readJson(tree, 'package.json');
        expect(devDependencies).toStrictEqual({});
      }
    );
  });

  describe('--capitalize-name', () => {
    test('should not capitalize the filename when adding it to an application', async () => {
      await componentGenerator(tree, {
        name: 'foo',
        project: appProject,
        capitalizeName: false,
      });

      expect(
        tree.exists(`apps/${appProject}/src/components/foo.astro`)
      ).toBeTruthy();
    });

    test('should not capitalize the filename when adding it to a library', async () => {
      await componentGenerator(tree, {
        name: 'foo',
        project: libProject,
        capitalizeName: false,
      });

      expect(tree.exists(`libs/${libProject}/src/lib/foo.astro`)).toBeTruthy();
    });
  });
});
