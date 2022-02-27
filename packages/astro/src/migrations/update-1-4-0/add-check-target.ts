import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  readWorkspaceConfiguration,
  Tree,
  updateProjectConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { extname, join } from 'path';

export default async function (tree: Tree) {
  const projects = getProjects(tree);

  let hasAstroProject = false;
  for (const [projectName, project] of projects) {
    if (!isAstroProject(tree, project)) {
      continue;
    }

    hasAstroProject = true;

    project.targets = {
      ...project.targets,
      check: { executor: '@nxtensions/astro:check' },
    };

    updateProjectConfiguration(tree, projectName, project);
  }

  if (hasAstroProject) {
    addCacheableOperation(tree);
    await formatFiles(tree);
  }
}

function addCacheableOperation(tree: Tree) {
  const workspace = readWorkspaceConfiguration(tree);
  if (!workspace.tasksRunnerOptions) {
    return;
  }

  Object.keys(workspace.tasksRunnerOptions).forEach((taskRunnerName) => {
    const taskRunner = workspace.tasksRunnerOptions[taskRunnerName];
    taskRunner.options = {
      ...(taskRunner.options ?? {}),
      cacheableOperations: Array.from(
        new Set([...(taskRunner.options?.cacheableOperations ?? []), 'check'])
      ),
    };
  });

  updateWorkspaceConfiguration(tree, workspace);
}

function isAstroProject(tree: Tree, project: ProjectConfiguration): boolean {
  if (project.projectType === 'application') {
    return Object.values(project.targets ?? {}).some((target) =>
      target.executor.startsWith('@nxtensions/astro:')
    );
  }

  // currently, libs don't have any targets, try to find Astro files
  return doesProjectContainAstroFiles(tree, project.sourceRoot ?? project.root);
}

function doesProjectContainAstroFiles(tree: Tree, dirPath: string): boolean {
  for (const child of tree.children(dirPath)) {
    const fullPath = join(dirPath, child);
    if (tree.isFile(fullPath)) {
      if (extname(fullPath) === '.astro') {
        return true;
      }
    } else {
      const result = doesProjectContainAstroFiles(tree, fullPath);
      if (result) {
        return true;
      }
    }
  }

  return false;
}
