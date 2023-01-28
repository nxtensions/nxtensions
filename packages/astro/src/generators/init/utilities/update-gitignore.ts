import { Tree } from '@nrwl/devkit';

export function updateGitignore(tree: Tree): void {
  if (!tree.exists('.gitignore')) {
    return;
  }

  let gitignore = tree.read('.gitignore', 'utf-8');

  if (/^\/node_modules$/gm.test(gitignore)) {
    gitignore = gitignore.replace(/^\/node_modules$/gm, 'node_modules');
    tree.write('.gitignore', gitignore);
  } else if (!/^node_modules$/gm.test(gitignore)) {
    gitignore += '\nnode_modules\n';
    tree.write('.gitignore', gitignore);
  }

  if (!/^\.astro$/gm.test(gitignore)) {
    gitignore += '\n.astro\n';
    tree.write('.gitignore', gitignore);
  }
}
