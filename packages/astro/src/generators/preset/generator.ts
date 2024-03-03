import {
  formatFiles,
  joinPathFragments,
  type GeneratorCallback,
  type Tree,
} from '@nx/devkit';
import { applicationGenerator } from '../application/generator';
import type { GeneratorOptions } from './schema';

export default async function (
  tree: Tree,
  options: GeneratorOptions
): Promise<GeneratorCallback | void> {
  const applicationTask = await applicationGenerator(tree, {
    name: options.astroAppName,
    tags: options.tags,
    directory: joinPathFragments('apps', options.astroAppName),
    projectNameAndRootFormat: 'as-provided',
  });

  await formatFiles(tree);

  return applicationTask;
}
