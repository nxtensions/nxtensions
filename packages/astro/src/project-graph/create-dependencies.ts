import type { Node } from '@astrojs/compiler/types';
import {
  workspaceRoot,
  type CreateDependencies,
  type CreateDependenciesContext,
  type FileData,
  type ProjectFileMap,
  type ProjectGraphProjectNode,
  type RawProjectGraphDependency,
} from '@nx/devkit';
import { readFileSync } from 'fs';
import { TargetProjectLocator } from 'nx/src/plugins/js/project-graph/build-dependencies/target-project-locator';
import { TypeScriptImportLocator } from 'nx/src/plugins/js/project-graph/build-dependencies/typescript-import-locator';
import { extname, join } from 'path';

let astroCompiler: typeof import('@astrojs/compiler');
let astroCompilerUtils: typeof import('@astrojs/compiler/utils');
let importLocator: TypeScriptImportLocator;
let ts: typeof import('typescript');

export const createDependencies: CreateDependencies = async (
  options,
  context
) => {
  const filesToProcess = getAstroFilesToProcess(
    context.filesToProcess.projectFileMap
  );

  if (filesToProcess.length === 0) {
    return [];
  }

  const dependencies: RawProjectGraphDependency[] = [];
  for (const { project, files } of filesToProcess) {
    for (const file of files) {
      // we delay the creation of these until needed and then, we cache them
      astroCompiler ??= await new Function(
        `return import('@astrojs/compiler');`
      )();
      astroCompilerUtils ??= await new Function(
        `return import('@astrojs/compiler/utils');`
      )();

      const fileContent = readFileSync(join(workspaceRoot, file.file), 'utf-8');
      // parse the file to get the AST
      const { ast } = await astroCompiler.parse(fileContent, {
        position: false,
      });

      // collect the dependencies
      await collectDependencies(ast, context, project, file.file, dependencies);
    }
  }

  return dependencies;
};

async function collectDependencies(
  node: Node,
  context: CreateDependenciesContext,
  project: string,
  filePath: string,
  collectedDependencies: RawProjectGraphDependency[]
): Promise<void> {
  if (astroCompilerUtils.is.frontmatter(node)) {
    // we delay the creation of these until needed and then, we cache them
    importLocator ??= new TypeScriptImportLocator();
    ts = ts ?? require('typescript');
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

    const sourceFile = ts.createSourceFile(
      filePath,
      node.value,
      ts.ScriptTarget.Latest,
      true
    );
    // locate imports
    importLocator.fromNode(
      filePath,
      sourceFile,
      (importExpr, filePath, type) => {
        // locate project containing the import
        const target =
          targetProjectLocator.findProjectWithImport(importExpr, filePath) ??
          `npm:${importExpr}`;

        // add the explicit dependency when the target project was found
        collectedDependencies.push({
          source: project,
          target,
          type,
          sourceFile: filePath,
        });
      }
    );

    // bail out since the frontmatter has already been processed
    return;
  }

  if (!astroCompilerUtils.is.parent(node)) {
    return;
  }

  for (const child of node.children) {
    await collectDependencies(
      child,
      context,
      project,
      filePath,
      collectedDependencies
    );

    // the child is the frontmatter and at this point was already processed, bail out
    if (astroCompilerUtils.is.frontmatter(child)) {
      return;
    }
  }
}

function getAstroFilesToProcess(filesToProcess: ProjectFileMap): {
  project: string;
  files: FileData[];
}[] {
  const astroExtensions = new Set(['.astro', '.md', '.mdx']);

  return Object.entries(filesToProcess)
    .map(([project, files]) => {
      const astroFiles = files.filter((file) =>
        astroExtensions.has(extname(file.file))
      );
      if (astroFiles.length > 0) {
        return { project, files: astroFiles };
      }

      return undefined;
    })
    .filter(Boolean);
}
