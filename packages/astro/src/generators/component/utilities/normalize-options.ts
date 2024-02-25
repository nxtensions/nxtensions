import {
  getProjects,
  joinPathFragments,
  normalizePath,
  readProjectConfiguration,
  workspaceRoot,
  type ProjectConfiguration,
  type Tree,
} from '@nx/devkit';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';
import {
  createProjectRootMappingsFromProjectConfigurations,
  findProjectForPath,
} from 'nx/src/project-graph/utils/find-project-for-path';
import { relative } from 'path';
import type { GeneratorOptions, NormalizedGeneratorOptions } from '../schema';

export async function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): Promise<NormalizedGeneratorOptions> {
  let derivedDirectory: string;
  if (options.directory) {
    derivedDirectory = options.directory;
  } else if (options.project) {
    derivedDirectory = getDerivedDirectoryFromProject(tree, options.project);
  } else {
    const projectName = findProjectFromPath(tree, getRelativeCwd());
    if (projectName) {
      derivedDirectory = getDerivedDirectoryFromProject(tree, projectName);
    }
  }

  const { artifactName, directory, fileName, filePath } =
    await determineArtifactNameAndDirectoryOptions(tree, {
      artifactType: 'component',
      callingGenerator: '@nxtensions/astro:component',
      name: options.name,
      directory: options.directory,
      derivedDirectory,
      flat: true,
      nameAndDirectoryFormat: options.nameAndDirectoryFormat,
      project: options.project,
      // the helper only accepts extensions for files managed by nx core plugins,
      // but it works fine with any
      fileExtension: 'astro' as any,
      pascalCaseFile: options.capitalizeName ?? true,
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

function getDerivedDirectoryFromProject(
  tree: Tree,
  projectName: string
): string {
  let derivedDirectory: string;
  const project = readProjectConfiguration(tree, projectName);
  if (project.projectType === 'library') {
    const libDirPath = joinPathFragments(project.root, 'src', 'lib');
    if (tree.exists(libDirPath) && tree.children(libDirPath).length) {
      derivedDirectory = joinPathFragments('src', 'lib');
    } else {
      derivedDirectory = 'src';
    }
  } else {
    derivedDirectory = joinPathFragments(
      project.sourceRoot ? '' : 'src',
      'components'
    );
  }

  return derivedDirectory;
}

function findProjectFromPath(tree: Tree, path: string): string | null {
  const projectConfigurations: Record<string, ProjectConfiguration> = {};
  const projects = getProjects(tree);
  for (const [projectName, project] of projects) {
    projectConfigurations[projectName] = project;
  }
  const projectRootMappings =
    createProjectRootMappingsFromProjectConfigurations(projectConfigurations);

  return findProjectForPath(path, projectRootMappings);
}

function getRelativeCwd(): string {
  return normalizePath(relative(workspaceRoot, getCwd()));
}

function getCwd(): string {
  return process.env.INIT_CWD?.startsWith(workspaceRoot)
    ? process.env.INIT_CWD
    : process.cwd();
}
