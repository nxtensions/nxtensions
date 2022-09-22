import type { Tree } from '@nrwl/devkit';
import { readJson, updateJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import migration from './add-script-to-patch-nx-cli';

describe('Test Suite Name', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  test('should generate script to patch the nx cli', async () => {
    await migration(tree);

    expect(tree.exists('tools/scripts/patch-nx-cli.js')).toBe(true);
  });

  test('should add a postinstall script to patch the nx cli', async () => {
    await migration(tree);

    const { scripts } = readJson(tree, 'package.json');
    expect(scripts.postinstall).toBe('node ./tools/scripts/patch-nx-cli.js');
  });

  test('should update the postinstall script to patch the nx cli', async () => {
    updateJson(tree, 'package.json', (json) => ({
      ...json,
      scripts: { postinstall: 'node ./some-important-script.js' },
    }));

    await migration(tree);

    const { scripts } = readJson(tree, 'package.json');
    expect(scripts.postinstall).toBe(
      'node ./some-important-script.js && node ./tools/scripts/patch-nx-cli.js'
    );
  });
});
