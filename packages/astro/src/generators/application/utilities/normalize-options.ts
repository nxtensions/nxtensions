import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): NormalizedGeneratorOptions {
  const { appsDir, standaloneAsDefault } = getWorkspaceLayout(tree);

  const name = names(options.name).fileName;
  const directory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = directory.replace(/\//g, '-');
  const projectRoot = `${appsDir}/${directory}`;
  const tags = options.tags
    ? options.tags.split(',').map((tag) => tag.trim())
    : [];

  return {
    ...options,
    addCypressTests: options.addCypressTests ?? true,
    projectName,
    projectRoot,
    renderers: options.renderers ?? [],
    standaloneConfig: options.standaloneConfig ?? standaloneAsDefault,
    tags,
  };
}
