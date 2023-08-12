import { Tree, readProjectConfiguration, joinPathFragments } from '@nx/devkit';
import { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): NormalizedGeneratorOptions {
  const project = readProjectConfiguration(tree, options.project);

  let directory: string;
  if (options.directory) {
    directory = joinPathFragments(project.root, options.directory);
  } else if (project.projectType === 'library') {
    const libDirPath = joinPathFragments(project.root, 'src', 'lib');
    if (tree.exists(libDirPath) && tree.children(libDirPath).length) {
      directory = libDirPath;
    } else {
      directory = joinPathFragments(project.root, 'src');
    }
  } else {
    directory = joinPathFragments(project.root, 'src', 'components');
  }

  return {
    ...options,
    capitalizeName: options.capitalizeName ?? true,
    directory,
    style: options.style ?? 'css',
  };
}
