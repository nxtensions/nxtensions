import type { Tree } from '@nx/devkit';
import { determineProjectNameAndRootOptions } from '@nx/devkit/src/generators/project-name-and-root-utils';
import type { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export async function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): Promise<NormalizedGeneratorOptions> {
  const { importPath, projectName, projectRoot, projectNameAndRootFormat } =
    await determineProjectNameAndRootOptions(tree, {
      name: options.name,
      projectType: 'library',
      directory: options.directory,
      importPath: options.importPath,
      projectNameAndRootFormat: options.projectNameAndRootFormat,
      callingGenerator: '@nxtensions/astro:library',
    });

  const tags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    projectNameAndRootFormat,
    importPath,
    projectName,
    projectRoot,
    publishable: options.publishable ?? false,
    tags,
  };
}
