import * as devkit from '@nrwl/devkit';
import {
  addProjectConfiguration,
  readJson,
  removeProjectConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import addSassDependency from './add-sass-dependency';

describe('add-check-target migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);

    addProjectConfiguration(tree, 'astro-app', {
      root: 'apps/astro-app',
      projectType: 'application',
      targets: {
        foo: { executor: '@my-org/awesome-package:executor' },
        build: { executor: '@nxtensions/astro:build' },
      },
    });
    addProjectConfiguration(tree, 'non-astro-app', {
      root: 'apps/non-astro-app',
      projectType: 'application',
      targets: {
        build: { executor: '@my-org/awesome-package:executor' },
      },
    });
    addProjectConfiguration(tree, 'astro-lib', {
      root: 'libs/astro-lib',
      projectType: 'library',
      targets: {},
    });
    addProjectConfiguration(tree, 'non-astro-lib', {
      root: 'libs/non-astro-lib',
      projectType: 'library',
      targets: {},
    });

    tree.write('apps/astro-app/a.css', '');
    tree.write('apss/astro-app/b.less', '');
    tree.write('apps/astro-app/c.styl', '');

    tree.write('apps/non-astro-app/a.sass', '');

    tree.write('libs/astro-lib/a.css', '');
    tree.write('libs/astro-lib/b.less', '');
    tree.write('libs/astro-lib/c.styl', '');
    tree.write('libs/astro-lib/folder/d.js', '');
    tree.write('libs/astro-lib/folder/E.astro', '');

    tree.write('libs/non-astro-lib/a.scss', '');

    jest.clearAllMocks();
  });

  test('should do nothing when sass is already installed', async () => {
    jest.spyOn(devkit, 'addDependenciesToPackageJson');
    updateJson(tree, 'package.json', (json) => {
      json.devDependencies = { sass: 'latest' };
      return json;
    });

    await addSassDependency(tree);

    expect(devkit.addDependenciesToPackageJson).not.toHaveBeenCalled();
  });

  test('should do nothing when there are no astro projects', async () => {
    jest.spyOn(devkit, 'addDependenciesToPackageJson');
    removeProjectConfiguration(tree, 'astro-app');
    removeProjectConfiguration(tree, 'astro-lib');

    await addSassDependency(tree);

    expect(devkit.addDependenciesToPackageJson).not.toHaveBeenCalled();
  });

  test('should do nothing when there is no sass or scss file', async () => {
    jest.spyOn(devkit, 'addDependenciesToPackageJson');

    await addSassDependency(tree);

    expect(devkit.addDependenciesToPackageJson).not.toHaveBeenCalled();
  });

  test('should do nothing when there are no styles in astro files', async () => {
    jest.spyOn(devkit, 'addDependenciesToPackageJson');
    tree.write('apps/astro-app/D.astro', '');

    await addSassDependency(tree);

    expect(devkit.addDependenciesToPackageJson).not.toHaveBeenCalled();
  });

  test('should do nothing when the style lang attribute is not specified', async () => {
    jest.spyOn(devkit, 'addDependenciesToPackageJson');
    tree.write('apps/astro-app/D.astro', '<style></style>');

    await addSassDependency(tree);

    expect(devkit.addDependenciesToPackageJson).not.toHaveBeenCalled();
  });

  test.each(['lang', 'lang=""', 'lang="css"', 'lang="less"', 'lang="styl"'])(
    `should do nothing when the style lang attribute is set as '%s'`,
    async (lang) => {
      jest.spyOn(devkit, 'addDependenciesToPackageJson');
      tree.write('apps/astro-app/D.astro', `<style ${lang}></style>`);

      await addSassDependency(tree);

      expect(devkit.addDependenciesToPackageJson).not.toHaveBeenCalled();
    }
  );

  test.each(['sass', 'scss'])(
    'should add the sass dependency when there are "%s" files',
    async (stylesheet) => {
      tree.write(`apps/astro-app/x.${stylesheet}`, '');

      await addSassDependency(tree);

      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies.sass).toBe('latest');
    }
  );

  test.each(['scss', 'sass'])(
    'should add the sass dependency when the style lang attribute is "%s"',
    async (lang) => {
      tree.write('apps/astro-app/D.astro', `<style lang="${lang}"></style>`);

      await addSassDependency(tree);

      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies.sass).toBe('latest');
    }
  );

  test.each(['scss', 'sass'])(
    'should handle multiple style blocks and one of them with style lang attribute set to "%s"',
    async (lang) => {
      tree.write(
        'apps/astro-app/D.astro',
        `<style></style>
        <style lang="less"></style>
        <style lang="${lang}"></style>
        `
      );

      await addSassDependency(tree);

      const { devDependencies } = readJson(tree, 'package.json');
      expect(devDependencies.sass).toBe('latest');
    }
  );
});
