import { parse } from '@astrojs/parser';
import {
  addDependenciesToPackageJson,
  formatFiles,
  getProjects,
  logger,
  ProjectConfiguration,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { extname, join } from 'path';

export default async function (tree: Tree) {
  const packageJson = readJson(tree, 'package.json');
  if (packageJson.dependencies?.sass || packageJson.devDependencies?.sass) {
    return;
  }

  const projects = getProjects(tree);

  for (const [, project] of projects) {
    if (!isAstroProject(tree, project)) {
      continue;
    }

    if (!isProjectUsingSass(tree, project.sourceRoot ?? project.root)) {
      continue;
    }

    addDependenciesToPackageJson(tree, {}, { sass: 'latest' });
    await formatFiles(tree);
    logger.info(
      `The "sass" package was added to "devDependencies". Please make sure to run "npm install" or "yarn install" to install it.`
    );
    return;
  }
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

function isProjectUsingSass(tree: Tree, dirPath: string): boolean {
  for (const child of tree.children(dirPath)) {
    const fullPath = join(dirPath, child);
    if (tree.isFile(fullPath)) {
      const fileExt = extname(fullPath);
      if (fileExt === '.sass' || fileExt === '.scss') {
        return true;
      }

      if (fileExt === '.astro') {
        const fileContent = tree.read(fullPath, 'utf-8');
        const { css } = parse(fileContent);
        if (
          css?.some((x) =>
            x.attributes?.some(
              (a) =>
                a.name === 'lang' &&
                Array.isArray(a.value) &&
                (a.value[0]?.data === 'sass' || a.value[0]?.data === 'scss')
            )
          )
        ) {
          return true;
        }
      }
    } else {
      const result = isProjectUsingSass(tree, fullPath);
      if (result) {
        return true;
      }
    }
  }

  return false;
}
