import type { Node } from '@astrojs/compiler/types';
import type {
  FileData,
  ProjectFileMap,
  ProjectGraph,
  ProjectGraphExternalNode,
  ProjectGraphProcessorContext,
  ProjectGraphProjectNode,
} from '@nrwl/devkit';
import { ProjectGraphBuilder, workspaceRoot } from '@nrwl/devkit';
import { readFileSync } from 'fs';
import type { TargetProjectLocator } from 'nx/src/plugins/js/project-graph/build-dependencies/target-project-locator';
import type { TypeScriptImportLocator } from 'nx/src/plugins/js/project-graph/build-dependencies/typescript-import-locator';
import { extname, join } from 'path';
import { isNxVersion } from '../utilities/versions';

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
      await collectDependencies(builder, ast, graph, project, file.file);
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

async function collectDependencies(
  builder: ProjectGraphBuilder,
  node: Node,
  graph: ProjectGraph,
  project: string,
  filePath: string
): Promise<void> {
  if (astroCompilerUtils.is.frontmatter(node)) {
    // we delay the creation of these until needed and then, we cache them
    importLocator ??= await getTypeScriptImportLocator();
    ts = ts ?? require('typescript');
    const targetProjectLocator = await getTargetProjectLocator(
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
    importLocator.fromNode(
      filePath,
      sourceFile,
      (importExpr, filePath, type) => {
        // locate project containing the import
        const target = targetProjectLocator.findProjectWithImport(
          importExpr,
          filePath
        );

        // add the explicit dependency when the target project was found
        if (target) {
          addDependencyToGraph(builder, project, target, filePath, type);
        }
      }
    );

    // bail out since the frontmatter has already been processed
    return;
  }

  if (!astroCompilerUtils.is.parent(node)) {
    return;
  }

  for (const child of node.children) {
    await collectDependencies(builder, child, graph, project, filePath);

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

async function addDependencyToGraph(
  builder: ProjectGraphBuilder,
  sourceProject: string,
  targetProject: string,
  sourceFilePath: string,
  dependencyType: import('@nrwl/devkit').DependencyType
): Promise<void> {
  if (isNxVersion('15.8.0')) {
    const { DependencyType } = await import('@nrwl/devkit');
    if (dependencyType === DependencyType.static) {
      builder.addStaticDependency(sourceProject, targetProject, sourceFilePath);
    } else {
      builder.addDynamicDependency(
        sourceProject,
        targetProject,
        sourceFilePath
      );
    }
  }

  builder.addExplicitDependency(sourceProject, sourceFilePath, targetProject);
  return;
}

async function getTypeScriptImportLocator(): Promise<TypeScriptImportLocator> {
  if (isNxVersion('15.9.0')) {
    const { TypeScriptImportLocator } = await import(
      'nx/src/plugins/js/project-graph/build-dependencies/typescript-import-locator'
    );
    return new TypeScriptImportLocator();
  }

  const { TypeScriptImportLocator } = await import(
    // @ts-expect-error this is available in supported Nx versions lower than 15.9.0
    'nx/src/project-graph/build-dependencies/typescript-import-locator'
  );

  return new TypeScriptImportLocator();
}

async function getTargetProjectLocator(
  nodes: Record<string, ProjectGraphProjectNode>,
  externalNodes: Record<string, ProjectGraphExternalNode>
): Promise<TargetProjectLocator> {
  if (isNxVersion('15.9.0')) {
    const { TargetProjectLocator } = await import(
      'nx/src/plugins/js/project-graph/build-dependencies/target-project-locator'
    );
    return new TargetProjectLocator(nodes, externalNodes);
  }

  const { TargetProjectLocator } = await import(
    // @ts-expect-error this is available in supported Nx versions lower than 15.9.0
    'nx/src/utils/target-project-locator'
  );

  return new TargetProjectLocator(nodes, externalNodes);
}
