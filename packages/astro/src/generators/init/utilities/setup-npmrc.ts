import { stripIndents, Tree } from '@nrwl/devkit';

export function setupNpmrc(tree: Tree): void {
  const shamefullyHoist = 'shamefully-hoist=true';
  const textToAdd = stripIndents`# Expose Astro dependencies for \`pnpm\` users
    ${shamefullyHoist}`;

  if (tree.exists('.npmrc')) {
    const npmrc = tree.read('.npmrc', 'utf-8');
    if (!npmrc.includes(shamefullyHoist)) {
      tree.write(
        '.npmrc',
        stripIndents`${npmrc}
        ${textToAdd}
      `
      );
    }
  } else {
    tree.write('.npmrc', textToAdd);
  }
}
