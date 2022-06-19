import {
  addDependenciesToPackageJson,
  formatFiles,
  getPackageManagerCommand,
  getProjects,
  logger,
  ProjectConfiguration,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { extname, join } from 'path';

let astroCompiler: typeof import('@astrojs/compiler');
let astroCompilerUtils: typeof import('@astrojs/compiler/utils');

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

    if (!(await isProjectUsingSass(tree, project.sourceRoot ?? project.root))) {
      continue;
    }

    addDependenciesToPackageJson(tree, {}, { sass: 'latest' });
    await formatFiles(tree);
    logger.info(
      `The "sass" package was added to "devDependencies". Please make sure to run "${
        getPackageManagerCommand().install
      }" to install it.`
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

async function isProjectUsingSass(
  tree: Tree,
  dirPath: string
): Promise<boolean> {
  for (const child of tree.children(dirPath)) {
    const fullPath = join(dirPath, child);
    if (!tree.isFile(fullPath)) {
      const result = await isProjectUsingSass(tree, fullPath);
      if (result) {
        return true;
      }
    }

    const fileExt = extname(fullPath);
    if (fileExt === '.sass' || fileExt === '.scss') {
      return true;
    }

    if (fileExt === '.astro') {
      const fileContent = tree.read(fullPath, 'utf-8');

      astroCompiler ??= await new Function(
        `return import('@astrojs/compiler');`
      )();
      astroCompilerUtils ??= await new Function(
        `return import('@astrojs/compiler/utils');`
      )();

      const { ast } = await astroCompiler.parse(fileContent);

      let isUsingSass = false;
      astroCompilerUtils.walk(ast, (node) => {
        if (
          astroCompilerUtils.is.element(node) &&
          node.name === 'style' &&
          node.attributes.some(
            ({ name, value }) =>
              name === 'lang' && ['scss', 'sass'].includes(value)
          )
        ) {
          isUsingSass = true;
        }
      });

      return isUsingSass;
    }
  }

  return false;
}
