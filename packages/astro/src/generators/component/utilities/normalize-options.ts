import type { Tree } from '@nx/devkit';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';
import type { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export async function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): Promise<NormalizedGeneratorOptions> {
  const { artifactName, directory, fileName, filePath } =
    await determineArtifactNameAndDirectoryOptions(tree, {
      path: options.path,
      name: options.name,
      // the helper only accepts extensions for files managed by nx core plugins,
      // but it works fine with any
      fileExtension: 'astro' as any,
    });

  return {
    ...options,
    name: artifactName,
    fileName,
    filePath,
    directory,
    style: options.style ?? 'css',
  };
}
