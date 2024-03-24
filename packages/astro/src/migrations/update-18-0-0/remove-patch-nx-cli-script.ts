import { formatFiles, readJson, writeJson, type Tree } from '@nx/devkit';
import type { PackageJson } from 'nx/src/utils/package-json';

const fullScriptRegex = /^node (?:\.\/)?tools\/scripts\/patch-nx-cli\.js$/;
const leadingScriptRegex =
  /^node (?:\.\/)?tools\/scripts\/patch-nx-cli\.js *&& */;
const trailingScriptRegex =
  / *&& *node (?:\.\/)?tools\/scripts\/patch-nx-cli\.js$/;
const middleScriptRegex =
  /&& *node (?:\.\/)?tools\/scripts\/patch-nx-cli\.js *&&/;

export default async function (tree: Tree) {
  if (tree.exists('tools/scripts/patch-nx-cli.js')) {
    tree.delete('tools/scripts/patch-nx-cli.js');
  }

  const packageJson = readJson<PackageJson>(tree, 'package.json');

  if (!packageJson.scripts?.postinstall) {
    return;
  }

  if (fullScriptRegex.test(packageJson.scripts.postinstall)) {
    delete packageJson.scripts.postinstall;
  } else if (leadingScriptRegex.test(packageJson.scripts.postinstall)) {
    packageJson.scripts.postinstall = packageJson.scripts.postinstall.replace(
      leadingScriptRegex,
      ''
    );
  } else if (trailingScriptRegex.test(packageJson.scripts.postinstall)) {
    packageJson.scripts.postinstall = packageJson.scripts.postinstall.replace(
      trailingScriptRegex,
      ''
    );
  } else if (middleScriptRegex.test(packageJson.scripts.postinstall)) {
    packageJson.scripts.postinstall = packageJson.scripts.postinstall.replace(
      middleScriptRegex,
      '&&'
    );
  }

  writeJson(tree, 'package.json', packageJson);

  await formatFiles(tree);
}
