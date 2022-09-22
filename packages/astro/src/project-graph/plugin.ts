import type { Node } from '@astrojs/compiler/types';
import type {
  FileData,
  ProjectFileMap,
  ProjectGraph,
  ProjectGraphProcessorContext,
} from '@nrwl/devkit';
import { ProjectGraphBuilder, workspaceRoot } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import { TypeScriptImportLocator } from 'nx/src/project-graph/build-dependencies/typescript-import-locator';
import { TargetProjectLocator } from 'nx/src/utils/target-project-locator';
import { extname, join } from 'path';

let astroCompiler: typeof import('@astrojs/compiler');
let astroCompilerUtils: typeof import('@astrojs/compiler/utils');
let importLocator: TypeScriptImportLocator;
let ts: typeof import('typescript');

export async function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): Promise<ProjectGraph> {
  const filesToProcess = getAstroFilesToProcess(context.filesToProcess);

  // return the unmodified project graph when there are no Astro files to process
  if (filesToProcess.length === 0) {
    return graph;
  }

  const builder = new ProjectGraphBuilder(graph);
  for (const { project, files } of filesToProcess) {
    if (!graph.nodes[project]) {
      addNode(context, builder, project);
    }

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
      collectDependencies(builder, ast, graph, project, file.file);
    }
  }

  return builder.getUpdatedProjectGraph();
}

function addNode(
  context: ProjectGraphProcessorContext,
  builder: ProjectGraphBuilder,
  projectName: string
): void {
  const project = context.workspace.projects[projectName];
  const projectType =
    project.projectType === 'application'
      ? projectName.endsWith('-e2e')
        ? 'e2e'
        : 'app'
      : 'lib';
  builder.addNode({
    data: {
      ...project,
      tags: project.tags ?? [],
      files: context.fileMap[projectName],
    },
    name: projectName,
    type: projectType,
  });
}

function collectDependencies(
  builder: ProjectGraphBuilder,
  node: Node,
  graph: ProjectGraph,
  project: string,
  filePath: string
): void {
  if (astroCompilerUtils.is.frontmatter(node)) {
    // we delay the creation of these until needed and then, we cache them
    importLocator ??= new TypeScriptImportLocator();
    ts = ts ?? require('typescript');
    const targetProjectLocator = new TargetProjectLocator(
      graph.nodes,
      graph.externalNodes
    );

    const sourceFile = ts.createSourceFile(
      filePath,
      node.value,
      ts.ScriptTarget.Latest,
      true
    );
    // locate imports
    importLocator.fromNode(filePath, sourceFile, (importExpr, filePath) => {
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

    // bail out since the frontmatter has already been processed
    return;
  }

  if (!astroCompilerUtils.is.parent(node)) {
    return;
  }

  for (const child of node.children) {
    collectDependencies(builder, child, graph, project, filePath);

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
