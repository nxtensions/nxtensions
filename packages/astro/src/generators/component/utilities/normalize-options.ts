import {
  Tree,
  readProjectConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';
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
    directory = joinPathFragments(project.root, 'src', 'lib');
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
