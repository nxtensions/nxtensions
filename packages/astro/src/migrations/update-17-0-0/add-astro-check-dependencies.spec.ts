import { readJson, updateJson, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '../../generators/utilities/testing';
import migration from './add-astro-check-dependencies';

describe('add-astro-check-dependencies migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add @astrojs/check to devDependencies', async () => {
    await migration(tree);

    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies['@astrojs/check']).toBe('^0.5.2');
  });

  it('should not overwrite existing @astrojs/check in dependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies = { '@astrojs/check': '0.5.0' };
      return json;
    });

    await migration(tree);

    const { dependencies, devDependencies } = readJson(tree, 'package.json');
    expect(dependencies['@astrojs/check']).toBe('0.5.0');
    expect(devDependencies['@astrojs/check']).toBeUndefined();
  });

  it('should not overwrite existing @astrojs/check in devDependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.devDependencies = { '@astrojs/check': '0.5.0' };
      return json;
    });

    await migration(tree);

    const { dependencies, devDependencies } = readJson(tree, 'package.json');
    expect(dependencies['@astrojs/check']).toBeUndefined();
    expect(devDependencies['@astrojs/check']).toBe('0.5.0');
  });

  it('should add typescript to devDependencies', async () => {
    await migration(tree);

    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies['typescript']).toBe('^5.3.3');
  });

  it('should not overwrite existing typescript in dependencies if >= 5.0.0', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies = { typescript: '~5.0.0' };
      return json;
    });

    await migration(tree);

    const { dependencies, devDependencies } = readJson(tree, 'package.json');
    expect(dependencies['typescript']).toBe('~5.0.0');
    expect(devDependencies['typescript']).toBeUndefined();
  });

  it('should not overwrite existing @astrojs/check in devDependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.devDependencies = { typescript: '~5.0.0' };
      return json;
    });

    await migration(tree);

    const { dependencies, devDependencies } = readJson(tree, 'package.json');
    expect(dependencies['typescript']).toBeUndefined();
    expect(devDependencies['typescript']).toBe('~5.0.0');
  });

  it('should overwrite existing typescript in dependencies if <= 5.0.0', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.dependencies = { typescript: '^4.9.0' };
      return json;
    });

    await migration(tree);

    const { dependencies, devDependencies } = readJson(tree, 'package.json');
    expect(dependencies['typescript']).toBe('^5.3.3');
    expect(devDependencies['typescript']).toBeUndefined();
  });

  it('should not overwrite existing @astrojs/check in devDependencies', async () => {
    updateJson(tree, 'package.json', (json) => {
      json.devDependencies = { typescript: '^4.9.0' };
      return json;
    });

    await migration(tree);

    const { dependencies, devDependencies } = readJson(tree, 'package.json');
    expect(dependencies['typescript']).toBeUndefined();
    expect(devDependencies['typescript']).toBe('^5.3.3');
  });
});
