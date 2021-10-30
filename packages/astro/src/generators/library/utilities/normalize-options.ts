import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): NormalizedGeneratorOptions {
  const { libsDir, npmScope, standaloneAsDefault } = getWorkspaceLayout(tree);

  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${libsDir}/${projectDirectory}`;
  const importPath = options.importPath || `@${npmScope}/${projectName}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    importPath,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    standaloneConfig: options.standaloneConfig ?? standaloneAsDefault,
  };
}
