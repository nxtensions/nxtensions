import type { Tree } from '@nrwl/devkit';
import { getWorkspaceLayout, joinPathFragments, names } from '@nrwl/devkit';
import type { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): NormalizedGeneratorOptions {
  const { libsDir, npmScope, standaloneAsDefault } = getWorkspaceLayout(tree);

  const name = names(options.name).fileName;
  const directory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = directory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = joinPathFragments(libsDir, directory);
  const importPath = options.importPath || `@${npmScope}/${projectName}`;
  const tags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    directory,
    importPath,
    projectName,
    projectRoot,
    publishable: options.publishable ?? false,
    standaloneConfig: options.standaloneConfig ?? standaloneAsDefault,
    tags,
  };
}
