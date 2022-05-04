import { parse } from '@astrojs/parser';
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

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  const filesToProcess = getAstroFilesToProcess(context.filesToProcess);

  // return the unmodified project graph when there are no Astro files to process
  if (filesToProcess.length === 0) {
    return graph;
  }

  const builder = new ProjectGraphBuilder(graph);

  const importLocator = new TypeScriptImportLocator();
  const targetProjectLocator = new TargetProjectLocator(
    graph.nodes,
    graph.externalNodes
  );

  filesToProcess.forEach(({ project, files }) => {
    files.forEach((file) => {
      const fileContent = readFileSync(join(workspaceRoot, file.file), 'utf-8');

      // parse the file to get the AST
      const { module } = parse(fileContent);

      // nothing to do when module is not defined
      if (!module) {
        return;
      }

      const sourceFile = ts.createSourceFile(
        file.file,
        module.content,
        ts.ScriptTarget.Latest,
        true
      );
      // locate imports
      importLocator.fromNode(file.file, sourceFile, (importExpr, filePath) => {
        // locate project containing the import
        const target = targetProjectLocator.findProjectWithImport(
          importExpr,
          filePath
        );

        // add the explicit dependency when the target project was found
        if (target) {
          builder.addExplicitDependency(project, filePath, target);
        }
      });
    });
  });

  return builder.getUpdatedProjectGraph();
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
