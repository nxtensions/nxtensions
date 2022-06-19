import {
  generateFiles,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';

const patchScriptPath = 'tools/scripts/patch-nx-cli.js';
const patchCommand = `node ./${patchScriptPath}`;

export function patchNxCli(tree: Tree): void {
  updateJson(tree, 'package.json', (json) => {
    if (!json.scripts?.postinstall) {
      json.scripts ??= {};
      json.scripts.postinstall = patchCommand;
    } else if (!json.scripts.postinstall.includes(patchCommand)) {
      json.scripts.postinstall += ` && ${patchCommand}`;
    }

    return json;
  });

  if (tree.exists(patchScriptPath)) {
    return;
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    'tools/scripts',
    { tmpl: '' }
  );
}
