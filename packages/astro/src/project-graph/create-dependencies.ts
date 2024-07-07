import {
  DependencyType,
  normalizePath,
  workspaceRoot,
  type CreateDependencies,
  type ProjectFileMap,
  type ProjectGraphProjectNode,
  type RawProjectGraphDependency,
} from '@nx/devkit';
import { findImports } from 'nx/src/native';
import { TargetProjectLocator } from 'nx/src/plugins/js/project-graph/build-dependencies/target-project-locator';
import { extname, join, relative } from 'path';

export const createDependencies: CreateDependencies = (options, context) => {
  const filesToProcess = getAstroFilesToProcess(
    context.filesToProcess.projectFileMap
  );

  if (Object.keys(filesToProcess).length === 0) {
    return [];
  }

  const nodes: Record<string, ProjectGraphProjectNode> = Object.fromEntries(
    Object.entries(context.projects).map(([key, config]) => [
      key,
      {
        name: key,
        type: null,
        data: config,
      },
    ])
  );
  const targetProjectLocator = new TargetProjectLocator(
    nodes,
    context.externalNodes
  );

  const imports = findImports(filesToProcess);
  const dependencies: RawProjectGraphDependency[] = [];

  for (const {
    sourceProject,
    file,
    staticImportExpressions,
    dynamicImportExpressions,
  } of imports) {
    const normalizedFilePath = normalizePath(relative(workspaceRoot, file));
    for (const importExpr of staticImportExpressions) {
      const dependency = convertImportToDependency(
        importExpr,
        normalizedFilePath,
        sourceProject,
        DependencyType.static,
        targetProjectLocator
      );
      dependencies.push(dependency);
    }

    for (const importExpr of dynamicImportExpressions) {
      const dependency = convertImportToDependency(
        importExpr,
        normalizedFilePath,
        sourceProject,
        DependencyType.dynamic,
        targetProjectLocator
      );
      dependencies.push(dependency);
    }
  }

  return dependencies;
};

function getAstroFilesToProcess(
  projectFileMap: ProjectFileMap
): Record<string, string[]> {
  const astroExtensions = new Set(['.astro', '.md', '.mdx']);

  const filesToProcess: Record<string, string[]> = {};
  for (const [project, fileData] of Object.entries(projectFileMap)) {
    for (const { file } of fileData) {
      if (astroExtensions.has(extname(file))) {
        filesToProcess[project] ??= [];
        filesToProcess[project].push(join(workspaceRoot, file));
      }
    }
  }

  return filesToProcess;
}

function convertImportToDependency(
  importExpr: string,
  sourceFile: string,
  source: string,
  type: RawProjectGraphDependency['type'],
  targetProjectLocator: TargetProjectLocator
): RawProjectGraphDependency {
  const target =
    ('findProjectWithImport' in targetProjectLocator
      ? // @ts-expect-error available method in versions lower than 19.1.2
        targetProjectLocator.findProjectWithImport(importExpr, sourceFile)
      : targetProjectLocator.findProjectFromImport(importExpr, sourceFile)) ??
    `npm:${importExpr}`;

  return {
    source,
    target,
    sourceFile,
    type,
  };
}
