import type { Tree } from '@nx/devkit';
import {
  getWorkspaceLayout,
  joinPathFragments,
  names,
  readJson,
  readNxJson,
} from '@nx/devkit';
import type { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): NormalizedGeneratorOptions {
  const { libsDir, standaloneAsDefault } = getWorkspaceLayout(tree);

  const name = names(options.name).fileName;
  const directory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = directory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = joinPathFragments(libsDir, directory);
  const tags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  let importPath = options.importPath;
  if (!importPath) {
    const npmScope = getNpmScope(tree);
    if (npmScope) {
      importPath = npmScope ? `@${npmScope}/${projectName}` : projectName;
    }
  }

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

function getNpmScope(tree: Tree): string | null {
  const nxJson = readNxJson(tree);
  if (nxJson?.npmScope) {
    return nxJson.npmScope;
  }

  const { name } = readJson<{ name?: string }>(tree, 'package.json');
  if (name?.startsWith('@')) {
    return name.split('/')[0].substring(1);
  }

  return null;
}
