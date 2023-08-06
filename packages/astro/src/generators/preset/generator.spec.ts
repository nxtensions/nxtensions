import { readProjectConfiguration, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '../utilities/testing';
import generator from './generator';
import type { GeneratorOptions } from './schema';

describe('preset generator', () => {
  let appTree: Tree;
  const options: GeneratorOptions = { astroAppName: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should create application successfully', async () => {
    await generator(appTree, options);

    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
