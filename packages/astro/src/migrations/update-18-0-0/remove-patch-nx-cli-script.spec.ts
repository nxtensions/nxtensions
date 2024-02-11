import { updateJson, type Tree, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '../../generators/utilities/testing';
import migration from './remove-patch-nx-cli-script';

describe('remove-nx-cli-patch migration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  test('should delete the patch-nx-cli.js script', async () => {
    tree.write('tools/scripts/patch-nx-cli.js', '');

    await migration(tree);

    expect(tree.exists('tools/scripts/patch-nx-cli.js')).toBe(false);
  });

  test.each`
    script                                                            | expected
    ${'node tools/scripts/patch-nx-cli.js'}                           | ${undefined}
    ${'node ./tools/scripts/patch-nx-cli.js'}                         | ${undefined}
    ${'node tools/scripts/patch-nx-cli.js && echo foo'}               | ${'echo foo'}
    ${'node tools/scripts/patch-nx-cli.js&&echo foo'}                 | ${'echo foo'}
    ${'node ./tools/scripts/patch-nx-cli.js && echo foo'}             | ${'echo foo'}
    ${'node ./tools/scripts/patch-nx-cli.js&&echo foo'}               | ${'echo foo'}
    ${'echo foo && node tools/scripts/patch-nx-cli.js'}               | ${'echo foo'}
    ${'echo foo&&node tools/scripts/patch-nx-cli.js'}                 | ${'echo foo'}
    ${'echo foo && node ./tools/scripts/patch-nx-cli.js'}             | ${'echo foo'}
    ${'echo foo&&node ./tools/scripts/patch-nx-cli.js'}               | ${'echo foo'}
    ${'echo foo && node tools/scripts/patch-nx-cli.js && echo bar'}   | ${'echo foo && echo bar'}
    ${'echo foo&&node tools/scripts/patch-nx-cli.js&&echo bar'}       | ${'echo foo&&echo bar'}
    ${'echo foo && node ./tools/scripts/patch-nx-cli.js && echo bar'} | ${'echo foo && echo bar'}
    ${'echo foo&&node ./tools/scripts/patch-nx-cli.js&&echo bar'}     | ${'echo foo&&echo bar'}
  `(
    'should replace the postinstall script "$script" with "$expected"',
    async ({ script, expected }) => {
      updateJson(tree, 'package.json', (json) => {
        json.scripts = {
          postinstall: script,
        };
        return json;
      });

      await migration(tree);

      const packageJson = readJson(tree, 'package.json');
      expect(packageJson.scripts.postinstall).toBe(expected);
    }
  );
});
