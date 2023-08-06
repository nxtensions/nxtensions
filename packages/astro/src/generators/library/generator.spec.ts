jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  formatFiles: jest.fn(),
}));

import {
  formatFiles,
  readJson,
  readProjectConfiguration,
  updateJson,
  type Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '../utilities/testing';
import { libraryGenerator } from './generator';
import type { GeneratorOptions } from './schema';

describe('library generator', () => {
  let tree: Tree;
  const options: GeneratorOptions = { name: 'lib1' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  test('should add project configuration', async () => {
    await libraryGenerator(tree, options);

    const config = readProjectConfiguration(tree, options.name);
    expect(config).toMatchSnapshot();
  });

  test('should generate files', async () => {
    await libraryGenerator(tree, options);

    expect(tree.exists(`${options.name}/src/index.js`)).toBeTruthy();
    expect(tree.exists(`${options.name}/src/lib/Lib1.astro`)).toBeTruthy();
    expect(tree.exists(`${options.name}/README.md`)).toBeTruthy();
    expect(tree.exists(`${options.name}/tsconfig.json`)).toBeTruthy();
  });

  test('should generate files in a monorepo layout', async () => {
    tree.write('libs/.gitkeep', '');

    await libraryGenerator(tree, options);

    expect(tree.exists(`libs/${options.name}/src/index.js`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/src/lib/Lib1.astro`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/README.md`)).toBeTruthy();
    expect(tree.exists(`libs/${options.name}/tsconfig.json`)).toBeTruthy();
  });

  test('should add the path mapping', async () => {
    await libraryGenerator(tree, options);

    const { compilerOptions } = readJson(tree, 'tsconfig.base.json');
    expect(compilerOptions.paths[`@proj/${options.name}`]).toStrictEqual([
      `${options.name}/src/index.js`,
    ]);
  });

  test('should ignore typescript 5 deprecation warnings', async () => {
    await libraryGenerator(tree, options);

    const { compilerOptions } = readJson(tree, `${options.name}/tsconfig.json`);
    expect(compilerOptions.ignoreDeprecations).toBe('5.0');
  });

  test('should not ignore typescript 5 deprecation warnings when typescript 5 is not installed', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.devDependencies.typescript = '~4.9.5';
      return json;
    });

    await libraryGenerator(tree, options);

    const { compilerOptions } = readJson(tree, `${options.name}/tsconfig.json`);
    expect(compilerOptions.ignoreDeprecations).toBeUndefined();
  });

  test('should format files', async () => {
    await libraryGenerator(tree, options);

    expect(formatFiles).toHaveBeenCalled();
  });

  describe('--directory', () => {
    const directory = 'some-directory/sub-directory';

    test('should add project with the right name when a directory is provided', async () => {
      await libraryGenerator(tree, { ...options, directory });

      const project = readProjectConfiguration(
        tree,
        `some-directory-sub-directory-${options.name}`
      );
      expect(project).toBeTruthy();
    });

    test('should generate files in the right directory', async () => {
      await libraryGenerator(tree, { ...options, directory });

      expect(
        tree.exists(`${directory}/${options.name}/src/index.js`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/src/lib/Lib1.astro`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/README.md`)
      ).toBeTruthy();
      expect(
        tree.exists(`${directory}/${options.name}/tsconfig.json`)
      ).toBeTruthy();
    });

    test('should generate files in the right directory in a monorepo layout', async () => {
      tree.write('libs/.gitkeep', '');

      await libraryGenerator(tree, { ...options, directory });

      expect(
        tree.exists(`libs/${directory}/${options.name}/src/index.js`)
      ).toBeTruthy();
      expect(
        tree.exists(`libs/${directory}/${options.name}/src/lib/Lib1.astro`)
      ).toBeTruthy();
      expect(
        tree.exists(`libs/${directory}/${options.name}/README.md`)
      ).toBeTruthy();
      expect(
        tree.exists(`libs/${directory}/${options.name}/tsconfig.json`)
      ).toBeTruthy();
    });

    test('should add the path mapping with the right directory', async () => {
      await libraryGenerator(tree, { ...options, directory });

      const { compilerOptions } = readJson(tree, 'tsconfig.base.json');
      expect(
        compilerOptions.paths[
          `@proj/some-directory-sub-directory-${options.name}`
        ]
      ).toStrictEqual([`${directory}/${options.name}/src/index.js`]);
    });
  });

  describe('--tags', () => {
    test('should add project tags when provided', async () => {
      await libraryGenerator(tree, { ...options, tags: 'foo, bar' });

      const { tags } = readProjectConfiguration(tree, options.name);
      expect(tags).toEqual(['foo', 'bar']);
    });
  });

  describe('--publishable', () => {
    test('should not generate a package.json when publishable is false', async () => {
      await libraryGenerator(tree, { ...options, publishable: false });

      expect(tree.exists(`${options.name}/package.json`)).toBeFalsy();
    });

    test('should throw when publishable is true and importPath was not specified', async () => {
      await expect(
        libraryGenerator(tree, { ...options, publishable: true })
      ).rejects.toThrow();
    });

    test('should generate a package.json when publishable is true', async () => {
      await libraryGenerator(tree, {
        ...options,
        publishable: true,
        importPath: 'lib1',
      });

      expect(tree.exists(`${options.name}/package.json`)).toBeTruthy();
    });
  });

  describe('--importPath', () => {
    const importPath = '@my-awesome-scope/lib1';

    test('should use the specified importPath as the package name', async () => {
      await libraryGenerator(tree, {
        ...options,
        importPath,
        publishable: true,
      });

      expect(readJson(tree, `${options.name}/package.json`).name).toBe(
        importPath
      );
    });

    test('should add the specified importPath to the path mappings in tsconfig.base.json', async () => {
      await libraryGenerator(tree, { ...options, importPath });

      const { compilerOptions } = readJson(tree, 'tsconfig.base.json');
      expect(compilerOptions.paths[importPath]).toStrictEqual([
        `${options.name}/src/index.js`,
      ]);
    });
  });
});
