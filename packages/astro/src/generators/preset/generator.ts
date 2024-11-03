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
    directory: joinPathFragments('apps', options.astroAppName),
    name: options.astroAppName,
    tags: options.tags,
  });

  await formatFiles(tree);

  return applicationTask;
}
