import type { Tree } from '@nrwl/devkit';
import {
  formatFiles,
  getPackageManagerCommand,
  logger,
  updateJson,
} from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { join } from 'path';

const patchScriptPath = 'tools/scripts/patch-nx-cli.js';
const patchCommand = `node ./${patchScriptPath}`;

export default async function (tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    if (!json.scripts?.postinstall) {
      json.scripts ??= {};
      json.scripts.postinstall = patchCommand;
    } else if (!json.scripts.postinstall.includes(patchCommand)) {
      json.scripts.postinstall += ` && ${patchCommand}`;
    }

    return json;
  });

  const scriptContent = readFileSync(
    join(__dirname, '../../generators/init/files/patch-nx-cli.js__tmpl__'),
    'utf8'
  );
  tree.write(patchScriptPath, scriptContent);

  logger.info(`
A command was added to the "postinstall" script in the "package.json" file to patch the Nx CLI in order to support importing an ESM module in the project graph plugin.
Please run "${
    getPackageManagerCommand().install
  }" or "node ./tools/scripts/patch-nx-cli.js" to apply the patch.
`);

  await formatFiles(tree);
}
