import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { GeneratorOptions } from './schema';

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
