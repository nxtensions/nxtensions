import {
  FileData,
  ProjectFileMap,
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
  workspaceRoot,
} from '@nrwl/devkit';
import { TypeScriptImportLocator } from 'nx/src/project-graph/build-dependencies/typescript-import-locator';
import { TargetProjectLocator } from 'nx/src/utils/target-project-locator';
import { readFileSync } from 'fs';
import { extname, join } from 'path';
import * as ts from 'typescript';

let astroCompiler: typeof import('@astrojs/compiler');
let astroCompilerUtils: typeof import('@astrojs/compiler/utils');

export async function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): Promise<ProjectGraph> {
  const filesToProcess = getAstroFilesToProcess(context.filesToProcess);

  // return the unmodified project graph when there are no Astro files to process
  if (filesToProcess.length === 0) {
    return graph;
  }

  let builder: ProjectGraphBuilder;
  let importLocator: TypeScriptImportLocator;
  let targetProjectLocator: TargetProjectLocator;
  let wereDependenciesAdded = false;
  for (const { project, files } of filesToProcess) {
    for (const file of files) {
      const fileContent = readFileSync(join(workspaceRoot, file.file), 'utf-8');

      astroCompiler ??= await new Function(
        `return import('@astrojs/compiler');`
      )();
      astroCompilerUtils ??= await new Function(
        `return import('@astrojs/compiler/utils');`
      )();

      // parse the file to get the AST
      const { ast } = await astroCompiler.parse(fileContent, {
        position: false,
      });

      astroCompilerUtils.walk(ast, (node) => {
        if (!astroCompilerUtils.is.frontmatter(node)) {
          return;
        }

        builder ??= new ProjectGraphBuilder(graph);
        importLocator ??= new TypeScriptImportLocator();
        targetProjectLocator ??= new TargetProjectLocator(
          graph.nodes,
          graph.externalNodes
        );

        const sourceFile = ts.createSourceFile(
          file.file,
          node.value,
          ts.ScriptTarget.Latest,
          true
        );
        // locate imports
        importLocator.fromNode(
          file.file,
          sourceFile,
          (importExpr, filePath) => {
            // locate project containing the import
            const target = targetProjectLocator.findProjectWithImport(
              importExpr,
              filePath
            );

            // add the explicit dependency when the target project was found
            if (target) {
              builder.addExplicitDependency(project, filePath, target);
              wereDependenciesAdded = true;
            }
          }
        );
      });
    }
  }

  return wereDependenciesAdded ? builder.getUpdatedProjectGraph() : graph;
}

function getAstroFilesToProcess(filesToProcess: ProjectFileMap): {
  project: string;
  files: FileData[];
}[] {
  const astroExtensions = ['.astro', '.md'];

  return Object.entries(filesToProcess)
    .map(([project, files]) => {
      const astroFiles = files.filter((file) =>
        astroExtensions.includes(extname(file.file))
      );
      if (astroFiles.length > 0) {
        return { project, files: astroFiles };
      }

      return undefined;
    })
    .filter(Boolean);
}
