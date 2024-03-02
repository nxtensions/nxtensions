import { readNxJson, type Tree } from '@nx/devkit';
import type { GeneratorOptions } from './schema';
import {
  addProjectGraphPlugin,
  addVSCodeRecommendedExtensions,
  setupNpmrc,
  updateGitignore,
} from './utilities';

export async function initGenerator(
  tree: Tree,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: GeneratorOptions
): Promise<void> {
  const workspace = readNxJson(tree);
  if (workspace.plugins?.includes('@nxtensions/astro')) {
    return;
  }

  addProjectGraphPlugin(tree);
  updateGitignore(tree);
  addVSCodeRecommendedExtensions(tree);
  setupNpmrc(tree);
}

export default initGenerator;
