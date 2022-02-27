import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { extname, join } from 'path';

export default async function (tree: Tree) {
  const projects = getProjects(tree);

  for (const [projectName, project] of projects) {
    if (!isAstroProject(tree, project)) {
      continue;
    }

    project.targets = {
      ...project.targets,
      check: {
        executor: '@nxtensions/astro:check',
        options: {},
      },
    };

    updateProjectConfiguration(tree, projectName, project);
  }

  await formatFiles(tree);
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
